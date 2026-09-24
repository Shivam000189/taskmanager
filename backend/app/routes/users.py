from flask import Blueprint, jsonify, request

from app.middleware.auth_guard import auth_required


users_bp = Blueprint("users", __name__)


@users_bp.get("/me")
@auth_required
def get_current_user():

    user = request.user

    return jsonify({
        "message": "Authenticated successfully",
        "user": {
            "id": user.id,
            "email": user.email
        }
    })