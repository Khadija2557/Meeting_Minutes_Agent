from __future__ import annotations

import logging
from datetime import datetime
from typing import Callable

from sqlalchemy.orm import Session

try:
    from backend.database import SessionLocal
    from backend.models import ActionItem, Meeting
    from backend.pipelines.action_items import extract_action_items
    from backend.pipelines.summarization import summarize_transcript
    from backend.pipelines.transcription import transcribe_audio
except ModuleNotFoundError:
    from database import SessionLocal
    from models import ActionItem, Meeting
    from pipelines.action_items import extract_action_items
    from pipelines.summarization import summarize_transcript
    from pipelines.transcription import transcribe_audio

logger = logging.getLogger(__name__)


def _ensure_session(session_factory: Callable[[], Session] | None = None) -> Session:
    factory = session_factory or SessionLocal
    if factory is None:
        raise RuntimeError("Session factory is not configured")
    return factory()


def process_meeting(meeting_id: int, session_factory: Callable[[], Session] | None = None) -> int:
    session = _ensure_session(session_factory)
    try:
        meeting = session.get(Meeting, meeting_id)
        if meeting is None:
            raise ValueError(f"Meeting {meeting_id} not found")

        meeting.status = "processing"
        session.commit()

        transcript = (meeting.transcript or "").strip()
        if not transcript and meeting.audio_url:
            transcript = transcribe_audio(meeting.audio_url)
            meeting.transcript = transcript
            session.commit()

        if not transcript:
            raise ValueError("Meeting is missing transcript or audio for transcription")

        summary = summarize_transcript(transcript)
        meeting.summary = summary
        session.commit()

        items = extract_action_items(transcript=transcript, summary=summary)
        (
            session.query(ActionItem)
            .filter(ActionItem.meeting_id == meeting.id)
            .delete(synchronize_session=False)
        )
        for item in items:
            due = item.get("due_date")
            due_date_obj = None
            if due:
                try:
                    due_date_obj = datetime.fromisoformat(due).date()
                except ValueError:
                    logger.warning("Unable to parse due date '%s' for meeting %s", due, meeting.id)
            session.add(
                ActionItem(
                    meeting_id=meeting.id,
                    description=item.get("description", "").strip(),
                    owner=item.get("owner"),
                    due_date=due_date_obj,
                    status=item.get("status", "pending"),
                )
            )
        meeting.status = "done"
        session.commit()
        logger.info("Processed meeting %s", meeting.id)
        return meeting.id
    except Exception:
        meeting = locals().get("meeting")  # type: ignore
        if meeting:
            meeting.status = "failed"
            session.commit()
        logger.exception("Failed to process meeting %s", meeting_id)
        raise
    finally:
        session.close()
