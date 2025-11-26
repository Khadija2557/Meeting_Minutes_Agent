"""
Supervisor Integration Adapter
This blueprint provides endpoints compatible with the Supervisor Integration Agent.
"""
from __future__ import annotations

import logging

from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from backend.models.supervisor import (
    ErrorModel,
    OutputModel,
    SupervisorAgentRequest,
    SupervisorAgentResponse,
)
from backend.pipelines.action_items import ActionExtractionError, extract_action_items
from backend.pipelines.summarization import SummarizationError, summarize_transcript

supervisor_bp = Blueprint("supervisor", __name__)
logger = logging.getLogger(__name__)


@supervisor_bp.route("/agents/supervisor/meeting-followup", methods=["POST"])
def supervisor_meeting_followup():
    """
    Supervisor-compatible endpoint for meeting follow-up processing.

    Accepts SupervisorAgentRequest and returns SupervisorAgentResponse.
    Processes meeting transcripts to generate summaries and action items.
    """
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({
                "error": {
                    "type": "validation_error",
                    "message": "Request body is required"
                }
            }), 400

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
        if not transcript:
            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="error",
                output=None,
                error=ErrorModel(
                    type="validation_error",
                    message="Transcript text is required in input.text field"
                )
            )
            return jsonify(response.dict()), 400

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
            result = {
                "summary": summary,
                "action_items": action_items,
                "metadata": supervisor_request.input.metadata
            }

            response = SupervisorAgentResponse(
                request_id=supervisor_request.request_id,
                agent_name=supervisor_request.agent_name,
                status="success",
                output=OutputModel(
                    result=result,
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
