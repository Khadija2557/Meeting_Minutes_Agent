"""
WSGI entry point for Railway deployment.
This file should be in the backend folder.
"""
import os
from app import create_app

# Create the Flask application
app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
