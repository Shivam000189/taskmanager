from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from app.config import Config


def create_app():
    Config.validate()

    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": Config.get_cors_origins()}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    from app.routes.users import users_bp
    from app.routes.tasks import tasks_bp

    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")

    @app.route("/")
    def home():
        return {"message": "Flask API is running"}

    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            return jsonify({"error": e.description}), e.code
        app.logger.exception(f"Unhandled server error: {e}")
        return jsonify({"error": "Internal server error"}), 500

    return app