from __future__ import annotations

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
    session = SessionLocal()
    try:
        payload = request.get_json(silent=True)
        if payload is None and request.form:
            payload = request.form.to_dict()
        payload = payload or {}
        audio_file = request.files.get("audio") if request.files else None
        audio_path = None
        if audio_file:
            audio_path = save_audio_file(audio_file, current_app.config["STORAGE_DIR"])
        elif payload.get("audio_url"):
            audio_path = payload["audio_url"]

        transcript = payload.get("transcript")
        if not transcript and not audio_path:
            return jsonify({"error": "Provide a transcript or an audio file"}), 400

        meeting = Meeting(
            title=payload.get("title") or "Untitled Meeting",
            audio_url=str(audio_path) if audio_path else None,
            transcript=transcript,
            source_agent=payload.get("source_agent"),
            status="pending",
        )
        session.add(meeting)
        session.commit()

        runner = current_app.extensions.get("background_runner")
        runner.submit(process_meeting, meeting.id)

        session.refresh(meeting)
        return jsonify(_meeting_payload(meeting)), 201
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
