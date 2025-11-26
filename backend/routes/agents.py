from __future__ import annotations

from flask import Blueprint, jsonify, request

try:
    from backend.pipelines.action_items import extract_action_items
    from backend.pipelines.summarization import summarize_transcript
except ModuleNotFoundError:
    from pipelines.action_items import extract_action_items
    from pipelines.summarization import summarize_transcript

agents_bp = Blueprint("agents", __name__)


@agents_bp.route("/agents/meeting-followup", methods=["POST"])
def meeting_followup():
    payload = request.get_json() or {}
    transcript = payload.get("transcript", "").strip()
    if not transcript:
        return jsonify({"error": "transcript is required"}), 400

    summary = summarize_transcript(transcript)
    action_items = extract_action_items(transcript=transcript, summary=summary)
    return (
        jsonify(
            {
                "summary": summary,
                "action_items": action_items,
                "metadata": payload.get("metadata", {}),
            }
        ),
        200,
    )
