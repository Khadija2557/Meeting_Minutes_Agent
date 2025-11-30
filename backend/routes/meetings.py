from __future__ import annotations

import logging

from flask import Blueprint, current_app, jsonify, request

try:
    from backend.database import SessionLocal
    from backend.models import Meeting
    from backend.pipelines.orchestrator import process_meeting
    from backend.services.storage import save_audio_file
except ModuleNotFoundError:
    from database import SessionLocal
    from models import Meeting
    from pipelines.orchestrator import process_meeting
    from services.storage import save_audio_file

meetings_bp = Blueprint("meetings", __name__)
logger = logging.getLogger(__name__)


def _meeting_payload(meeting: Meeting) -> dict:
    return {
        "id": meeting.id,
        "title": meeting.title,
        "status": meeting.status,
        "created_at": meeting.created_at.isoformat(),
        "audio_url": meeting.audio_url,
        "transcript": meeting.transcript,
        "summary": meeting.summary,
        "source_agent": meeting.source_agent,
        "error_message": meeting.error_message,
        "action_items": [
            {
                "id": item.id,
                "description": item.description,
                "owner": item.owner,
                "due_date": item.due_date.isoformat() if item.due_date else None,
                "status": item.status,
            }
            for item in meeting.action_items
        ],
    }


@meetings_bp.route("/meetings", methods=["GET"])
def list_meetings():
    session = SessionLocal()
    try:
        query = session.query(Meeting).order_by(Meeting.created_at.desc())
        limit = request.args.get("limit", type=int)
        if limit:
            query = query.limit(limit)
        meetings = query.all()
        return jsonify([_meeting_payload(meeting) for meeting in meetings]), 200
    finally:
        session.close()


@meetings_bp.route("/meetings", methods=["POST"])
def create_meeting():
    logger.info("Creating new meeting - Content-Type: %s", request.content_type)
    session = SessionLocal()
    try:
        # Parse request data
        payload = request.get_json(silent=True)
        if payload is None and request.form:
            logger.info("Using form data (multipart)")
            payload = request.form.to_dict()
        payload = payload or {}
        logger.debug("Payload keys: %s", list(payload.keys()))

        # Handle audio file upload
        audio_file = request.files.get("audio") if request.files else None
        audio_path = None
        if audio_file:
            logger.info("Audio file uploaded: %s (size: %s bytes)", audio_file.filename, audio_file.content_length)
            try:
                audio_path = save_audio_file(audio_file, current_app.config["STORAGE_DIR"])
                logger.info("Audio saved to: %s", audio_path)
            except Exception as e:
                logger.error("Failed to save audio file: %s", str(e))
                return jsonify({"error": f"Failed to save audio file: {str(e)}"}), 500
        elif payload.get("audio_url"):
            audio_path = payload["audio_url"]
            logger.info("Using audio URL: %s", audio_path)

        # Get transcript
        transcript = payload.get("transcript")
        if transcript:
            logger.info("Transcript provided: %d characters", len(transcript))

        # Validate input
        if not transcript and not audio_path:
            logger.warning("No transcript or audio file provided")
            return jsonify({
                "error": "Provide a transcript or an audio file",
                "details": "Send either 'transcript' field with text, or 'audio' file in multipart/form-data"
            }), 400

        # Create meeting record
        meeting = Meeting(
            title=payload.get("title") or "Untitled Meeting",
            audio_url=str(audio_path) if audio_path else None,
            transcript=transcript,
            source_agent=payload.get("source_agent"),
            status="pending",
        )
        session.add(meeting)
        session.commit()
        logger.info("Created meeting ID: %s", meeting.id)

        # Submit for background processing
        runner = current_app.extensions.get("background_runner")
        if runner:
            runner.submit(process_meeting, meeting.id)
            logger.info("Submitted meeting %s for processing", meeting.id)
        else:
            logger.warning("Background runner not available")

        session.refresh(meeting)
        return jsonify(_meeting_payload(meeting)), 201
    except Exception as e:
        logger.exception("Error creating meeting: %s", str(e))
        return jsonify({
            "error": "Failed to create meeting",
            "message": str(e),
            "type": type(e).__name__
        }), 500
    finally:
        session.close()


@meetings_bp.route("/meetings/<int:meeting_id>", methods=["GET"])
def get_meeting(meeting_id: int):
    session = SessionLocal()
    try:
        meeting = session.get(Meeting, meeting_id)
        if meeting is None:
            return jsonify({"error": "Meeting not found"}), 404
        return jsonify(_meeting_payload(meeting)), 200
    finally:
        session.close()
