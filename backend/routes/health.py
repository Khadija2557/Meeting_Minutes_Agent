from __future__ import annotations

import logging

from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)
logger = logging.getLogger("meeting_agent.health")


@health_bp.route("/health", methods=["GET"])
def health() -> tuple[dict, int]:
    logger.info("Responding to /health")
    return jsonify({"status": "ok"}), 200
