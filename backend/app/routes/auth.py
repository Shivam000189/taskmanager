from flask import Blueprint, request, jsonify, current_app

from app.services.supabase_service import supabase


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        return jsonify({
            "message": "Registration successful",
            "user": response.user.model_dump() if response.user else None
        }), 201

    except Exception:
        current_app.logger.exception("Registration failed")
        return jsonify({"error": "Registration failed"}), 400


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        return jsonify({
            "message": "Login successful",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": response.user.model_dump()
        }), 200

    except Exception:
        current_app.logger.exception("Login failed")
        return jsonify({"error": "Invalid email or password"}), 401