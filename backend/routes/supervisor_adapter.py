"""
Supervisor Integration Adapter
This blueprint provides endpoints compatible with the Supervisor Integration Agent.
"""
from __future__ import annotations

import base64
import logging
import os
import tempfile
from pathlib import Path

from flask import Blueprint, jsonify, request
from pydantic import ValidationError

try:
    from backend.models.supervisor import (
        ErrorModel,
        OutputModel,
        SupervisorAgentRequest,
        SupervisorAgentResponse,
    )
    from backend.pipelines.action_items import ActionExtractionError, extract_action_items
    from backend.pipelines.summarization import SummarizationError, summarize_transcript
    from backend.pipelines.transcription import transcribe_audio
except ModuleNotFoundError:
    from models.supervisor import (
        ErrorModel,
        OutputModel,
        SupervisorAgentRequest,
        SupervisorAgentResponse,
    )
    from pipelines.action_items import ActionExtractionError, extract_action_items
    from pipelines.summarization import SummarizationError, summarize_transcript
    from pipelines.transcription import transcribe_audio

supervisor_bp = Blueprint("supervisor", __name__)
logger = logging.getLogger(__name__)


def format_meeting_result_as_markdown(summary: str, action_items: list, metadata: dict) -> str:
    """Format meeting result as nice markdown for frontend display."""
    lines = []

    # Title
    filename = metadata.get("filename", "Meeting")
    lines.append(f"# {filename}\n")

    # Summary section
    lines.append("## Summary\n")
    lines.append(f"{summary}\n")

    # Action Items section
    lines.append("## Action Items\n")
    if action_items:
        # Group by status
        status_order = ["To Do", "In Progress", "Done", "pending"]
        grouped = {}
        for item in action_items:
            status = item.get("status", "To Do")
            if status not in grouped:
                grouped[status] = []
            grouped[status].append(item)

        # Display by status
        for status in status_order:
            if status not in grouped:
                continue

            items_list = grouped[status]
            if not items_list:
                continue

            # Status emoji
            status_emoji = {
                "To Do": "📌",
                "In Progress": "🔄",    
                "Done": "✅",
                "pending": "📌"
            }
            emoji = status_emoji.get(status, "•")

            lines.append(f"\n### {emoji} {status}\n")
            for item in items_list:
                desc = item.get("description", "No description")
                owner = item.get("owner")
                due = item.get("due_date")

                # Build the line
                line = f"- **{desc}**"
                if owner:
                    line += f" (👤 {owner})"
                if due:
                    line += f" (📅 {due})"
                lines.append(line)
    else:
        lines.append("*No action items identified*\n")

    # Metadata (cleaned)
    if metadata:
        lines.append("\n---\n")
        lines.append("### ℹInfo\n")
        if "language" in metadata:
            lines.append(f"- **Language:** {metadata['language']}")
        if "mime_type" in metadata:
            lines.append(f"- **Type:** {metadata['mime_type']}")

    return "\n".join(lines)


@supervisor_bp.route("/agents/supervisor/meeting-followup", methods=["POST"])
def supervisor_meeting_followup():
    """
    Supervisor-compatible endpoint for meeting follow-up processing.

    Accepts SupervisorAgentRequest and returns SupervisorAgentResponse.
    Processes meeting transcripts to generate summaries and action items.
    """
    logger.info("Received meeting-followup request")
    try:
        payload = request.get_json()
        if not payload:
            logger.warning("Empty request body")
            return jsonify({
                "error": {
                    "type": "validation_error",
                    "message": "Request body is required"
                }
            }), 400

        logger.debug(f"Request payload keys: {list(payload.keys())}")
        if 'input' in payload:
            logger.debug(f"Input keys: {list(payload['input'].keys())}")
            if 'text' in payload['input']:
                text_len = len(payload['input']['text']) if payload['input']['text'] else 0
                logger.debug(f"Input text length: {text_len}")
            if 'metadata' in payload['input']:
                logger.debug(f"Metadata: {payload['input']['metadata']}")

        # Validate incoming request against Supervisor schema
        try:
            supervisor_request = SupervisorAgentRequest(**payload)
        except ValidationError as e:
            logger.error(f"Validation error: {e}")
            return jsonify({
                "request_id": payload.get("request_id", "unknown"),
                "agent_name": payload.get("agent_name", "meeting_followup_agent"),
                "status": "error",
                "output": None,
                "error": {
                    "type": "validation_error",
                    "message": f"Invalid request format: {str(e)}"
                }
            }), 400

        # Extract transcript from input
        transcript = supervisor_request.input.text.strip()
        metadata = supervisor_request.input.metadata

        # Check if there's an audio file in metadata
        has_audio_file = metadata.get("file_base64") and metadata.get("mime_type", "").startswith("audio/")

        logger.info(f"Received text: {len(transcript)} characters")
        logger.info(f"Has audio file in metadata: {has_audio_file}")

        if has_audio_file:
            logger.info(f"Audio file detected: {metadata.get('filename', 'unknown')} ({metadata.get('mime_type', 'unknown')})")
            logger.info(f"Audio file base64 length: {len(metadata.get('file_base64', ''))} characters")

            # For audio files, we'll transcribe them and ignore the short query text
            # The text field typically contains the user's query like "summarize this meeting"
            # We need to transcribe the audio to get the actual transcript
            try:
                # Decode base64 audio file
                audio_base64 = metadata.get("file_base64", "")
                audio_bytes = base64.b64decode(audio_base64)

                # Save to temporary file
                filename = metadata.get("filename", "audio.mp3")
                file_ext = Path(filename).suffix or ".mp3"

                with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
                    tmp_file.write(audio_bytes)
                    temp_path = tmp_file.name

                logger.info(f"Saved audio to temp file: {temp_path} ({len(audio_bytes)} bytes)")

                # Transcribe the audio
                try:
                    transcript = transcribe_audio(temp_path)
                    logger.info(f"Transcription successful: {len(transcript)} characters")
                finally:
                    # Clean up temp file
                    try:
                        os.unlink(temp_path)
                    except:
                        pass

            except Exception as e:
                logger.exception(f"Failed to process audio file: {e}")
                response = SupervisorAgentResponse(
                    request_id=supervisor_request.request_id,
                    agent_name=supervisor_request.agent_name,
                    status="error",
                    output=None,
                    error=ErrorModel(
                        type="transcription_error",
                        message=f"Failed to process audio file: {str(e)}"
                    )
                )
                return jsonify(response.dict()), 500

        # Validate we have a transcript
        if not transcript:
            logger.warning("No transcript available (neither text nor audio file provided)")
            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="error",
                output=None,
                error=ErrorModel(
                    type="validation_error",
                    message="Transcript text is required in input.text field, or provide an audio file in metadata"
                )
            )
            return jsonify(response.dict()), 400

        # Validate transcript length
        MIN_TRANSCRIPT_LENGTH = 50
        if len(transcript) < MIN_TRANSCRIPT_LENGTH:
            logger.warning(f"Transcript is too short ({len(transcript)} chars, minimum: {MIN_TRANSCRIPT_LENGTH})")
            logger.warning(f"Received transcript: '{transcript}'")
            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="error",
                output=None,
                error=ErrorModel(
                    type="validation_error",
                    message=f"Transcript is too short ({len(transcript)} characters). Need at least {MIN_TRANSCRIPT_LENGTH} characters. Received: '{transcript}'"
                )
            )
            return jsonify(response.dict()), 400

        logger.info(f"Processing meeting with transcript: {len(transcript)} characters")

        # Process the meeting transcript
        try:
            # Generate summary
            summary = summarize_transcript(transcript)

            # Extract action items
            action_items = extract_action_items(
                transcript=transcript,
                summary=summary
            )

            # Build successful response
            # Clean metadata - remove large base64 data before returning
            clean_metadata = {k: v for k, v in supervisor_request.input.metadata.items() if k != "file_base64"}
            if "filename" in supervisor_request.input.metadata:
                clean_metadata["filename"] = supervisor_request.input.metadata["filename"]
            if "mime_type" in supervisor_request.input.metadata:
                clean_metadata["mime_type"] = supervisor_request.input.metadata["mime_type"]
            if "language" in supervisor_request.input.metadata:
                clean_metadata["language"] = supervisor_request.input.metadata["language"]

            # Format as nice markdown
            markdown_result = format_meeting_result_as_markdown(summary, action_items, clean_metadata)

            result = {
                "summary": summary,
                "action_items": action_items,
                "metadata": clean_metadata,
                "markdown": markdown_result  # Include formatted markdown version
            }

            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="success",
                output=OutputModel(
                    result=markdown_result,  # Return markdown as main result for display
                    confidence=0.9,
                    details=f"Generated summary and {len(action_items)} action items from meeting transcript"
                ),
                error=None
            )

            logger.info(f"Successfully processed request {supervisor_request.request_id}")
            return jsonify(response.dict()), 200

        except SummarizationError as e:
            logger.error(f"Summarization error: {e}")
            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="error",
                output=None,
                error=ErrorModel(
                    type="summarization_error",
                    message=str(e)
                )
            )
            return jsonify(response.dict()), 500

        except ActionExtractionError as e:
            logger.error(f"Action extraction error: {e}")
            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="error",
                output=None,
                error=ErrorModel(
                    type="action_extraction_error",
                    message=str(e)
                )
            )
            return jsonify(response.dict()), 500

    except Exception as e:
        logger.exception(f"Unexpected error in supervisor endpoint: {e}")
        return jsonify({
            "request_id": payload.get("request_id", "unknown") if payload else "unknown",
            "agent_name": "meeting_followup_agent",
            "status": "error",
            "output": None,
            "error": {
                "type": "internal_error",
                "message": f"Internal server error: {str(e)}"
            }
        }), 500


@supervisor_bp.route("/agents/supervisor/health", methods=["GET"])
def supervisor_health():
    """
    Health check endpoint for Supervisor Agent to verify this worker is available.
    """
    return jsonify({
        "status": "healthy",
        "agent": "meeting_followup_agent",
        "capabilities": ["meeting.followup"],
        "version": "1.0.0"
    }), 200


@supervisor_bp.route("/agents/supervisor/debug", methods=["POST"])
def supervisor_debug():
    """
    Debug endpoint to see exactly what the Supervisor is sending.
    """
    try:
        payload = request.get_json()

        # Log the full payload
        import json
        logger.info("=== DEBUG: Full Request Payload ===")
        logger.info(json.dumps(payload, indent=2))

        # Extract and display key fields
        debug_info = {
            "received_payload": payload,
            "payload_keys": list(payload.keys()) if payload else [],
        }

        if payload and 'input' in payload:
            debug_info["input_keys"] = list(payload['input'].keys())
            if 'text' in payload['input']:
                text = payload['input']['text']
                debug_info["text_info"] = {
                    "length": len(text) if text else 0,
                    "content": text,
                    "first_100_chars": text[:100] if text else None,
                }
            if 'metadata' in payload['input']:
                debug_info["metadata"] = payload['input']['metadata']

        return jsonify({
            "message": "Debug info logged. Check server logs for details.",
            "debug": debug_info
        }), 200
    except Exception as e:
        logger.exception(f"Debug endpoint error: {e}")
        return jsonify({"error": str(e)}), 500
