from pathlib import Path

from backend.pipelines.action_items import extract_action_items
from backend.pipelines.summarization import summarize_transcript
from backend.pipelines.transcription import transcribe_audio


def test_transcribe_audio_mock(tmp_path, monkeypatch):
    audio_path = tmp_path / "sample.wav"
    audio_path.write_text("fake audio")
    monkeypatch.setenv("MOCK_TRANSCRIPTION", "1")
    result = transcribe_audio(str(audio_path))
    assert "sample" in result


def test_summarize_transcript_mock(monkeypatch):
    monkeypatch.setenv("MOCK_SUMMARY", "1")
    summary = summarize_transcript("Line one. Line two.")
    assert summary.startswith("Line one")


def test_extract_action_items_rule_based(monkeypatch):
    monkeypatch.setenv("MOCK_ACTION_ITEMS", "1")
    transcript = "ACTION: Send deck @Alice (due 2023-12-01)"
    items = extract_action_items(transcript)
    assert len(items) == 1
    assert items[0]["owner"] == "Alice"
