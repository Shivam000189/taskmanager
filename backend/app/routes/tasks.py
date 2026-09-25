import logging

from app import Config
from flask import Blueprint, jsonify, request

from app.middleware.auth_guard import auth_required
from app.services.supabase_service import supabase
from app.services.mail_service import send_email_async


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

    created_task = response.data[0]

    if assigned_to and assigned_to != request.user.id:
        try:
            assignee = supabase.table("profiles").select("email, full_name").eq("id", assigned_to).execute()
            if assignee.data:
                recipient = assignee.data[0]
                send_email_async(
                    subject=f"New task assigned: {title}",
                    to_email=recipient.get("email"),
                    body=(
                        f"Hi {recipient.get('full_name') or ''},\n\n"
                        f"You've been assigned a new task: \"{title}\".\n"
                        f"{('Description: ' + data.get('description')) if data.get('description') else ''}\n\n"
                        f"— {Config.MAIL_FROM_NAME}"
                    ),
                )
        except Exception:
            logging.exception("Failed to send task assignment notification email")

    return jsonify({"task": created_task}), 201


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
    completed_task = response.data[0]

    if completed_task["created_by"] != request.user.id:
        try:
            creator = supabase.table("profiles").select("email, full_name").eq("id", completed_task["created_by"]).execute()
            if creator.data:
                recipient = creator.data[0]
                send_email_async(
                    subject=f"Task completed: {completed_task['title']}",
                    to_email=recipient.get("email"),
                    body=(
                        f"Hi {recipient.get('full_name') or ''},\n\n"
                        f"Your task \"{completed_task['title']}\" has been marked complete.\n\n"
                        f"— {Config.MAIL_FROM_NAME}"
                    ),
                )
        except Exception:
            logging.exception("Failed to send task completion notification email")

    return jsonify({"task": completed_task})


@tasks_bp.get("/<task_id>/comments")
@auth_required
def list_comments(task_id):
    task_res = supabase.table("tasks").select("id").eq("id", task_id).execute()
    if not task_res.data:
        return jsonify({"error": "Task not found"}), 404

    comments_res = (
        supabase.table("comments")
        .select("*")
        .eq("task_id", task_id)
        .order("created_at", desc=False)
        .execute()
    )
    comments = comments_res.data or []

    user_ids = list({c["user_id"] for c in comments if c.get("user_id")})
    profiles_map = {}
    if user_ids:
        profiles_res = (
            supabase.table("profiles")
            .select("id, email, full_name, avatar_url")
            .in_("id", user_ids)
            .execute()
        )
        if profiles_res.data:
            profiles_map = {p["id"]: p for p in profiles_res.data}

    for comment in comments:
        comment["user"] = profiles_map.get(comment.get("user_id"))

    return jsonify({"comments": comments})


@tasks_bp.post("/<task_id>/comments")
@auth_required
def create_comment(task_id):
    data = request.get_json(silent=True) or {}
    content = (data.get("content") or "").strip()

    if not content:
        return jsonify({"error": "Comment content cannot be empty"}), 400

    task_res = supabase.table("tasks").select("*").eq("id", task_id).execute()
    if not task_res.data:
        return jsonify({"error": "Task not found"}), 404

    task = task_res.data[0]

    comment_data = {
        "task_id": task_id,
        "user_id": request.user.id,
        "content": content,
    }

    insert_res = supabase.table("comments").insert(comment_data).execute()
    if not insert_res.data:
        return jsonify({"error": "Failed to create comment"}), 500

    created_comment = insert_res.data[0]

    author_res = (
        supabase.table("profiles")
        .select("id, email, full_name, avatar_url")
        .eq("id", request.user.id)
        .execute()
    )
    author_profile = author_res.data[0] if author_res.data else None
    created_comment["user"] = author_profile
    author_name = (author_profile.get("full_name") if author_profile else None) or "A team member"

    # Send email notification to other participants (creator and/or assignee)
    recipients_to_notify = set()
    if task.get("created_by") and task["created_by"] != request.user.id:
        recipients_to_notify.add(task["created_by"])
    if task.get("assigned_to") and task["assigned_to"] != request.user.id:
        recipients_to_notify.add(task["assigned_to"])

    for recipient_id in recipients_to_notify:
        try:
            rec_res = (
                supabase.table("profiles")
                .select("email, full_name")
                .eq("id", recipient_id)
                .execute()
            )
            if rec_res.data and rec_res.data[0].get("email"):
                rec_profile = rec_res.data[0]
                rec_name = rec_profile.get("full_name") or "there"
                send_email_async(
                    subject=f"New comment on task: {task['title']}",
                    to_email=rec_profile["email"],
                    body=(
                        f"Hi {rec_name},\n\n"
                        f"{author_name} commented on \"{task['title']}\":\n\n"
                        f"\"{content}\"\n\n"
                        f"View task: {Config.FRONTEND_URL}/tasks/{task_id}\n\n"
                        f"— {Config.MAIL_FROM_NAME}"
                    ),
                )
        except Exception:
            logging.exception("Failed to send comment notification email")

    return jsonify({"comment": created_comment}), 201


@tasks_bp.delete("/<task_id>/comments/<comment_id>")
@auth_required
def delete_comment(task_id, comment_id):
    existing = (
        supabase.table("comments")
        .select("*")
        .eq("id", comment_id)
        .eq("task_id", task_id)
        .execute()
    )
    if not existing.data:
        return jsonify({"error": "Comment not found"}), 404

    comment = existing.data[0]
    if comment["user_id"] != request.user.id:
        return jsonify({"error": "You can only delete your own comments"}), 403

    supabase.table("comments").delete().eq("id", comment_id).execute()
    return jsonify({"message": "Comment deleted"})