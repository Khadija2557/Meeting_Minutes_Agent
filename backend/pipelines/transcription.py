from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import urlparse

try:
    from backend.services.assembly import AssemblyAIClient, AssemblyAIError
except ModuleNotFoundError:
    from services.assembly import AssemblyAIClient, AssemblyAIError

class TranscriptionError(Exception):
    pass


def transcribe_audio(file_path: str, model_name: str | None = None) -> str:
    if os.getenv("MOCK_TRANSCRIPTION", "0") == "1":
        name = Path(file_path).name if file_path else "unknown"
        return f"Mock transcript for {name}"

    provider = os.getenv("TRANSCRIPTION_PROVIDER", "assemblyai").lower()
    if provider == "assemblyai":
        return _transcribe_with_assemblyai(file_path, model_name)
    if provider == "whisper":
        return _transcribe_with_whisper(file_path, model_name)
    raise TranscriptionError(f"Unsupported transcription provider: {provider}")


def _transcribe_with_assemblyai(file_path: str, model_name: str | None = None) -> str:
    api_key = os.getenv("ASSEMBLYAI_API_KEY", "").strip()
    if not api_key:
        raise TranscriptionError("ASSEMBLYAI_API_KEY is required for transcription")
    client = AssemblyAIClient(
        api_key=api_key,
        base_url=os.getenv("ASSEMBLYAI_BASE_URL", "https://api.assemblyai.com/v2"),
        poll_interval=float(os.getenv("ASSEMBLYAI_POLL_INTERVAL", "3")),
        poll_timeout=float(os.getenv("ASSEMBLYAI_POLL_TIMEOUT", "600")),
    )

    if _looks_like_url(file_path):
        audio_source = file_path
    else:
        path = Path(file_path)
        if not path.exists():
            raise TranscriptionError(f"Audio file not found: {file_path}")
        audio_source = client.upload_file(path)

    model = model_name or os.getenv("ASSEMBLYAI_MODEL")
    try:
        return client.transcribe(audio_source, model=model)
    except AssemblyAIError as exc:
        raise TranscriptionError(str(exc)) from exc


def _transcribe_with_whisper(file_path: str, model_name: str | None = None) -> str:
    path = Path(file_path)
    if not path.exists():
        raise TranscriptionError(f"Audio file not found: {file_path}")

    try:
        import whisper  # type: ignore
    except ImportError as exc:  # pragma: no cover - depends on optional dependency
        raise TranscriptionError("OpenAI Whisper is not installed") from exc

    model = whisper.load_model(model_name or os.getenv("WHISPER_MODEL", "base"))
    result = model.transcribe(str(path))
    transcript = result.get("text", "").strip()
    if not transcript:
        raise TranscriptionError("Whisper returned an empty transcript")
    return transcript


def _looks_like_url(value: str) -> bool:
    parsed = urlparse(value or "")
    return parsed.scheme in {"http", "https"}
