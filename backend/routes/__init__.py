from __future__ import annotations

from flask import Flask

# Handle both local and deployment scenarios
try:
    from backend.routes.agents import agents_bp
    from backend.routes.health import health_bp
    from backend.routes.meetings import meetings_bp
    from backend.routes.supervisor_adapter import supervisor_bp
except ModuleNotFoundError:
    from routes.agents import agents_bp
    from routes.health import health_bp
    from routes.meetings import meetings_bp
    from routes.supervisor_adapter import supervisor_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(health_bp)
    app.register_blueprint(meetings_bp)
    app.register_blueprint(agents_bp)
    app.register_blueprint(supervisor_bp)
