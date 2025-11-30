import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
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

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger("meeting_agent.app")
logger.setLevel(LOG_LEVEL)


def create_app(config_object: type | None = None) -> Flask:
    """Application factory used by tests and production."""
    app = Flask(__name__)
    config_cls = config_object or DefaultConfig
    app.config.from_object(config_cls)
    logger.info("Creating Meeting Agent app using config %s", config_cls.__name__)

    storage_dir = Path(app.config.get("STORAGE_DIR", "backend/uploads"))
    storage_dir.mkdir(parents=True, exist_ok=True)
    app.config["STORAGE_DIR"] = storage_dir
    logger.info("Storage directory set to %s", storage_dir)

    # Configure CORS with debug logging
    CORS(app, resources={r"/*": {"origins": "*"}})
    logger.info("CORS enabled for all origins")

    # Add request logging middleware
    @app.before_request
    def log_request():
        logger.info(
            ">> %s %s from %s | Content-Type: %s | Content-Length: %s",
            request.method,
            request.path,
            request.remote_addr,
            request.content_type,
            request.content_length,
        )

    @app.after_request
    def log_response(response):
        logger.info(
            "<< %s %s -> %s %s",
            request.method,
            request.path,
            response.status_code,
            response.status,
        )
        return response

    try:
        init_engine(
            database_url=app.config["SQLALCHEMY_DATABASE_URI"],
            echo=app.config.get("SQLALCHEMY_ECHO", False),
            force=bool(app.config.get("TESTING", False)),
        )
        logger.info(
            "Database engine initialized (driver=%s)",
            app.config["SQLALCHEMY_DATABASE_URI"].split(":", 1)[0],
        )
        init_db()
        logger.info("Database schema ensured")
    except Exception:
        logger.exception("Database initialization failed")
        raise

    background_runner = BackgroundTaskRunner(
        enabled=app.config.get("ENABLE_BACKGROUND_JOBS", True)
    )
    app.extensions["background_runner"] = background_runner
    logger.info(
        "Background runner enabled=%s",
        app.config.get("ENABLE_BACKGROUND_JOBS", True),
    )

    # Add a root endpoint
    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "service": "Meeting Minutes Agent API",
            "version": "1.0.0",
            "endpoints": {
                "health": "/health",
                "meetings": {
                    "list": "GET /meetings",
                    "create": "POST /meetings",
                    "get": "GET /meetings/<id>"
                }
            },
            "status": "running"
        }), 200

    register_blueprints(app)
    logger.info("Blueprints registered: %s", list(app.blueprints.keys()))

    # Error handlers
    @app.errorhandler(400)
    def bad_request(e):
        logger.error("Bad Request (400): %s", str(e))
        return jsonify({"error": "Bad Request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        logger.warning("Not Found (404): %s %s", request.method, request.path)
        return jsonify({"error": "Not Found", "path": request.path}), 404

    @app.errorhandler(500)
    def internal_error(e):
        logger.exception("Internal Server Error (500): %s", str(e))
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.exception("Unhandled exception: %s", str(e))
        return jsonify({
            "error": "Unexpected error",
            "message": str(e),
            "type": type(e).__name__
        }), 500

    @app.teardown_appcontext
    def shutdown_session(exception: Exception | None = None) -> None:
        if SessionLocal:
            SessionLocal.remove()

    return app


def get_background_runner(app: Flask) -> BackgroundTaskRunner:
    return app.extensions["background_runner"]


if __name__ == "__main__":
    flask_app = create_app()
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    logger.info("=" * 60)
    logger.info("Starting Meeting Minutes Agent")
    logger.info("=" * 60)
    logger.info("Host: %s", host)
    logger.info("Port: %s", port)
    logger.info("Debug: %s", debug)
    logger.info("Log Level: %s", LOG_LEVEL)
    logger.info("=" * 60)
    logger.info("Available Endpoints:")
    logger.info("  GET  / - API info")
    logger.info("  GET  /health - Health check")
    logger.info("  GET  /meetings - List meetings")
    logger.info("  POST /meetings - Create meeting (accepts audio file or transcript)")
    logger.info("  GET  /meetings/<id> - Get meeting details")
    logger.info("=" * 60)

    flask_app.run(host=host, port=port, debug=debug)
