"""
WSGI entry point for Railway deployment.
This file should be in the backend folder.
"""
import os
import sys
from pathlib import Path

# Since we're deploying only the backend folder, add current directory to path
# This allows imports like "from config import..." instead of "from backend.config import..."
sys.path.insert(0, str(Path(__file__).parent))

from app import create_app

# Create the Flask application
app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
