import os
from pathlib import Path


class DefaultConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///meeting_agent.db")
    SQLALCHEMY_ECHO = False
    WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")
    TRANSCRIPTION_PROVIDER = os.getenv("TRANSCRIPTION_PROVIDER", "assemblyai")
    ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY", "")
    ASSEMBLYAI_BASE_URL = os.getenv("ASSEMBLYAI_BASE_URL", "https://api.assemblyai.com/v2")
    ASSEMBLYAI_MODEL = os.getenv("ASSEMBLYAI_MODEL")
    ASSEMBLYAI_POLL_INTERVAL = float(os.getenv("ASSEMBLYAI_POLL_INTERVAL", "3"))
    ASSEMBLYAI_POLL_TIMEOUT = float(os.getenv("ASSEMBLYAI_POLL_TIMEOUT", "600"))
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    ENABLE_BACKGROUND_JOBS = os.getenv("ENABLE_BACKGROUND_JOBS", "true").lower() == "true"
    STORAGE_DIR = Path(os.getenv("STORAGE_DIR", "backend/uploads"))
    TESTING = False
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MB uploads

    # Supervisor Integration Agent settings
    SUPERVISOR_TIMEOUT = int(os.getenv("SUPERVISOR_TIMEOUT", "30000"))  # 30 seconds in ms
    SUPERVISOR_AGENT_NAME = os.getenv("SUPERVISOR_AGENT_NAME", "meeting_followup_agent")
