from flask import Flask
from flask_cors import CORS

from app.config import Config


def create_app():
    Config.validate()

    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=[Config.FRONTEND_URL])

    from app.routes.auth import auth_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")

    @app.route("/")
    def home():
        return {"message": "Flask API is running"}

    return app