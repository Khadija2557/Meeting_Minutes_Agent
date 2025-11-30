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
    meeting = None
    try:
        meeting = session.get(Meeting, meeting_id)
        if meeting is None:
            raise ValueError(f"Meeting {meeting_id} not found")

        meeting.status = "processing"
        meeting.error_message = None
        session.commit()

        # Get or transcribe the transcript
        transcript = (meeting.transcript or "").strip()
        if not transcript and meeting.audio_url:
            logger.info("Transcribing audio for meeting %s from %s", meeting.id, meeting.audio_url)
            try:
                transcript = transcribe_audio(meeting.audio_url)
                if not transcript or len(transcript.strip()) == 0:
                    raise ValueError("Transcription returned empty content")
                meeting.transcript = transcript
                session.commit()
                logger.info("Transcription completed for meeting %s (%d chars)", meeting.id, len(transcript))
            except Exception as e:
                error_msg = f"Transcription failed: {str(e)}"
                logger.error(error_msg)
                raise ValueError(error_msg) from e

        # Validate transcript
        if not transcript or len(transcript.strip()) < 10:
            raise ValueError("Transcript is too short or empty. Need at least 10 characters of meaningful content.")

        logger.info("Processing meeting %s with transcript length: %d", meeting.id, len(transcript))

        # Generate summary
        try:
            summary = summarize_transcript(transcript)
            if not summary or len(summary.strip()) == 0:
                raise ValueError("Summarization returned empty content")
            meeting.summary = summary
            session.commit()
            logger.info("Summary generated for meeting %s", meeting.id)
        except Exception as e:
            error_msg = f"Summarization failed: {str(e)}"
            logger.error(error_msg)
            raise ValueError(error_msg) from e

        # Extract action items
        try:
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
            logger.info("Extracted %d action items for meeting %s", len(items), meeting.id)
        except Exception as e:
            # Don't fail the entire process if action item extraction fails
            logger.warning("Action item extraction failed for meeting %s: %s", meeting.id, str(e))

        meeting.status = "done"
        session.commit()
        logger.info("Successfully processed meeting %s", meeting.id)
        return meeting.id
    except Exception as e:
        error_message = str(e)
        logger.exception("Failed to process meeting %s: %s", meeting_id, error_message)
        if meeting:
            meeting.status = "failed"
            meeting.error_message = error_message
            session.commit()
        raise
    finally:
        session.close()
