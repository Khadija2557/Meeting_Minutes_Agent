from __future__ import annotations

import secrets
from pathlib import Path

from werkzeug.datastructures import FileStorage


def save_audio_file(upload: FileStorage, storage_dir: Path) -> Path:
    storage_dir.mkdir(parents=True, exist_ok=True)
    file_ext = Path(upload.filename or "audio").suffix or ".wav"
    file_name = f"meeting-{secrets.token_hex(8)}{file_ext}"
    target = storage_dir / file_name
    upload.save(target)
    return target
