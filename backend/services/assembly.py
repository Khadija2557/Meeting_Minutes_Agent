from __future__ import annotations

import time
from pathlib import Path
from typing import Iterable

import requests


class AssemblyAIError(Exception):
    pass


class AssemblyAIClient:
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.assemblyai.com/v2",
        poll_interval: float = 3.0,
        poll_timeout: float = 600.0,
        chunk_size: int = 5 * 1024 * 1024,
        session: requests.Session | None = None,
    ) -> None:
        if not api_key:
            raise AssemblyAIError("AssemblyAI API key is required")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.poll_interval = poll_interval
        self.poll_timeout = poll_timeout
        self.chunk_size = chunk_size
        self.session = session or requests.Session()

    # Internal helpers -----------------------------------------------------
    def _auth_headers(self) -> dict:
        return {"authorization": self.api_key}

    def _read_file(self, path: Path) -> Iterable[bytes]:
        with path.open("rb") as file_obj:
            while True:
                chunk = file_obj.read(self.chunk_size)
                if not chunk:
                    break
                yield chunk

    # Public API -----------------------------------------------------------
    def upload_file(self, file_path: Path) -> str:
        if not file_path.exists():
            raise AssemblyAIError(f"File not found: {file_path}")
        url = f"{self.base_url}/upload"
        response = self.session.post(url, headers=self._auth_headers(), data=self._read_file(file_path))
        if response.status_code >= 400:
            raise AssemblyAIError(f"Upload failed: {response.text}")
        upload_url = response.json().get("upload_url")
        if not upload_url:
            raise AssemblyAIError("Upload response missing 'upload_url'")
        return upload_url

    def request_transcription(self, audio_url: str, model: str | None = None) -> str:
        payload = {"audio_url": audio_url}
        if model:
            payload["model"] = model
        response = self.session.post(
            f"{self.base_url}/transcript",
            headers={**self._auth_headers(), "content-type": "application/json"},
            json=payload,
        )
        if response.status_code >= 400:
            raise AssemblyAIError(f"Transcription request failed: {response.text}")
        transcript_id = response.json().get("id")
        if not transcript_id:
            raise AssemblyAIError("Transcription response missing 'id'")
        return transcript_id

    def poll_transcription(self, transcript_id: str) -> dict:
        start_time = time.time()
        url = f"{self.base_url}/transcript/{transcript_id}"
        while True:
            response = self.session.get(url, headers=self._auth_headers())
            if response.status_code >= 400:
                raise AssemblyAIError(f"Polling failed: {response.text}")
            data = response.json()
            status = data.get("status")
            if status == "completed":
                return data
            if status == "error":
                raise AssemblyAIError(data.get("error", "AssemblyAI reported an error"))
            if (time.time() - start_time) > self.poll_timeout:
                raise AssemblyAIError("Polling timed out")
            time.sleep(self.poll_interval)

    def transcribe(self, audio_source: str, model: str | None = None) -> str:
        transcript_id = self.request_transcription(audio_source, model=model)
        result = self.poll_transcription(transcript_id)
        text = (result.get("text") or "").strip()
        if not text:
            raise AssemblyAIError("AssemblyAI returned an empty transcript")
        return text
