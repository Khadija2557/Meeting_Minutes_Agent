import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

# Handle both local development and deployment scenarios
if __package__ is None:  # pragma: no cover - only used for direct script execution
    sys.path.append(str(Path(__file__).resolve().parents[1]))

# Try importing with "backend." prefix (local development)
# If that fails, import directly (Railway deployment where backend is root)
try:
    from backend.config import DefaultConfig
    from backend.database import init_db, init_engine, SessionLocal
    from backend.routes import register_blueprints
    from backend.services.background import BackgroundTaskRunner
except ModuleNotFoundError:
    from config import DefaultConfig
    from database import init_db, init_engine, SessionLocal
    from routes import register_blueprints
    from services.background import BackgroundTaskRunner


load_dotenv()


def create_app(config_object: type | None = None) -> Flask:
    """Application factory used by tests and production."""
    app = Flask(__name__)
    config_cls = config_object or DefaultConfig
    app.config.from_object(config_cls)

    storage_dir = Path(app.config.get("STORAGE_DIR", "backend/uploads"))
    storage_dir.mkdir(parents=True, exist_ok=True)
    app.config["STORAGE_DIR"] = storage_dir

    CORS(app)

    init_engine(
        database_url=app.config["SQLALCHEMY_DATABASE_URI"],
        echo=app.config.get("SQLALCHEMY_ECHO", False),
        force=bool(app.config.get("TESTING", False)),
    )
    init_db()

    background_runner = BackgroundTaskRunner(
        enabled=app.config.get("ENABLE_BACKGROUND_JOBS", True)
    )
    app.extensions["background_runner"] = background_runner

    register_blueprints(app)

    @app.teardown_appcontext
    def shutdown_session(exception: Exception | None = None) -> None:
        if SessionLocal:
            SessionLocal.remove()

    return app


def get_background_runner(app: Flask) -> BackgroundTaskRunner:
    return app.extensions["background_runner"]


if __name__ == "__main__":
    flask_app = create_app()
    flask_app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=False)
