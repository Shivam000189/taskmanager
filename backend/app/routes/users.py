from flask import Blueprint, jsonify, request
from app.services.supabase_service import supabase

from app.middleware.auth_guard import auth_required


users_bp = Blueprint("users", __name__)


@users_bp.get("/me")
@auth_required
def get_current_user():
    user = request.user
    meta = user.user_metadata or {}

    return jsonify({
        "message": "Authenticated successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": meta.get("full_name") or meta.get("name"),
            "avatar_url": meta.get("avatar_url") or meta.get("picture"),
        }
    })


@users_bp.get("")
@auth_required
def list_users():
    search = request.args.get("search", "").strip()

    query = supabase.table("profiles").select("id, email, full_name, avatar_url")

    if search:
        query = query.or_(f"email.ilike.%{search}%,full_name.ilike.%{search}%")

    response = query.limit(20).execute()

    return jsonify({"users": response.data})