from flask import Blueprint, jsonify, request

from app.middleware.auth_guard import auth_required
from app.services.supabase_service import supabase


tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.post("")
@auth_required
def create_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()

    if not title:
        return jsonify({"error": "Title is required"}), 400

    assigned_to = data.get("assigned_to")

    if assigned_to:
        check = supabase.table("profiles").select("id").eq("id", assigned_to).execute()
        if not check.data:
            return jsonify({"error": "assigned_to must be an existing user id"}), 400

    task = {
        "title": title,
        "description": data.get("description"),
        "due_date": data.get("due_date"),
        "created_by": request.user.id,
        "assigned_to": assigned_to,
    }

    response = supabase.table("tasks").insert(task).execute()

    return jsonify({"task": response.data[0]}), 201


@tasks_bp.get("")
@auth_required
def list_tasks():
    scope = request.args.get("scope", "all")
    query = supabase.table("tasks").select("*")

    if scope == "created":
        query = query.eq("created_by", request.user.id)
    elif scope == "assigned":
        query = query.eq("assigned_to", request.user.id)

    response = query.order("created_at", desc=True).execute()

    return jsonify({"tasks": response.data})


@tasks_bp.get("/<task_id>")
@auth_required
def get_task(task_id):
    response = supabase.table("tasks").select("*").eq("id", task_id).execute()

    if not response.data:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({"task": response.data[0]})


@tasks_bp.patch("/<task_id>")
@auth_required
def update_task(task_id):
    data = request.get_json(silent=True) or {}

    allowed = {"title", "description", "due_date", "assigned_to"}
    updates = {k: v for k, v in data.items() if k in allowed}

    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400

    if "assigned_to" in updates and updates["assigned_to"]:
        check = supabase.table("profiles").select("id").eq("id", updates["assigned_to"]).execute()
        if not check.data:
            return jsonify({"error": "assigned_to must be an existing user id"}), 400

    response = supabase.table("tasks").update(updates).eq("id", task_id).execute()

    if not response.data:
        return jsonify({"error": "Task not found or not yours to edit"}), 404

    return jsonify({"task": response.data[0]})


@tasks_bp.delete("/<task_id>")
@auth_required
def delete_task(task_id):
    response = supabase.table("tasks").delete().eq("id", task_id).execute()

    if not response.data:
        return jsonify({"error": "Task not found or not yours to delete"}), 404

    return jsonify({"message": "Task deleted"})


@tasks_bp.patch("/<task_id>/complete")
@auth_required
def complete_task(task_id):
    existing = supabase.table("tasks").select("*").eq("id", task_id).execute()

    if not existing.data:
        return jsonify({"error": "Task not found"}), 404

    task = existing.data[0]

    if request.user.id not in (task["created_by"], task["assigned_to"]):
        return jsonify({"error": "Not your task"}), 403

    response = (
        supabase.table("tasks")
        .update({"status": "completed"})
        .eq("id", task_id)
        .execute()
    )

    return jsonify({"task": response.data[0]})