from __future__ import annotations

from flask import Flask

from backend.routes.agents import agents_bp
from backend.routes.health import health_bp
from backend.routes.meetings import meetings_bp
from backend.routes.supervisor_adapter import supervisor_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(health_bp)
    app.register_blueprint(meetings_bp)
    app.register_blueprint(agents_bp)
    app.register_blueprint(supervisor_bp)
