from functools import wraps

from flask import request, jsonify

from app.services.supabase_service import supabase


def auth_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "error": "Authorization header is required"
            }), 401

        try:
            token = auth_header.split(" ")[1]

            user_response = supabase.auth.get_user(token)

            if not user_response.user:
                return jsonify({
                    "error": "Invalid token"
                }), 401

            request.user = user_response.user

            supabase.postgrest.auth(token)

        except Exception:
            return jsonify({
                "error": "Invalid or expired token"
            }), 401

        return f(*args, **kwargs)

    return decorated