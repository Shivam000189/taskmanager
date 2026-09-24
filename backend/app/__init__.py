from flask import Flask
from flask_cors import CORS



def create_app():
    app = Flask(__name__)

    CORS(app)

    
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")

    @app.route("/")
    def home():
        return {
            "message": "Flask API is running"
        }

    return app