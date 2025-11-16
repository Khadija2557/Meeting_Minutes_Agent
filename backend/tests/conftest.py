import os
from pathlib import Path

import pytest

from backend.app import create_app
from backend.config import DefaultConfig


class TestConfig(DefaultConfig):
    TESTING = True
    ENABLE_BACKGROUND_JOBS = False


@pytest.fixture
def app(tmp_path, monkeypatch):
    db_file = tmp_path / "test.sqlite"
    storage_dir = tmp_path / "uploads"

    class _Config(TestConfig):
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_file}"
        STORAGE_DIR = storage_dir

    monkeypatch.setenv("MOCK_SUMMARY", "1")
    monkeypatch.setenv("MOCK_ACTION_ITEMS", "1")
    monkeypatch.setenv("MOCK_TRANSCRIPTION", "1")
    monkeypatch.setenv("TRANSCRIPTION_PROVIDER", "assemblyai")

    application = create_app(_Config)

    yield application


@pytest.fixture
def client(app):
    return app.test_client()
