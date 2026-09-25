# Task Manager API

A Flask + Supabase backend for creating and assigning tasks, with
Google OAuth login and email notifications.

## Features
- Sign up / log in with Google (via Supabase Auth)
- Create tasks and assign them to other registered users
- Email notification when a task is assigned
- Email notification when a task is marked complete
- Task comments thread with instant updates and email alerts
- Row Level Security so users only see and edit tasks they created or
  were assigned

## Tech stack
- Flask (Python)
- Supabase (Postgres, Auth, Row Level Security)
- Gmail SMTP for email notifications

## Setup

1. Clone the repo and `cd backend`
2. `python -m venv venv` then activate it
3. `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL` / `SUPABASE_KEY` — from your Supabase project's API settings
   - `MAIL_USERNAME` / `MAIL_PASSWORD` — a Gmail address and an [app password](https://myaccount.google.com/apppasswords)
   - `FRONTEND_URL` — where your frontend runs, e.g. `http://localhost:3000`
5. In Supabase's SQL Editor, run the schema in `schema.sql` (see below)
6. In Google Cloud Console, set up an OAuth client and add the callback
   URL from Supabase's Google provider settings
7. `python run.py`

## Database schema
See `schema.sql` for the `profiles` and `tasks` tables, triggers, and
RLS policies.

## API routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | Health check |
| GET | `/api/users/me` | Yes | Current user's profile |
| GET | `/api/users?search=` | Yes | Search users by name/email |
| POST | `/api/tasks` | Yes | Create a task, optionally assigned |
| GET | `/api/tasks?scope=` | Yes | List tasks (`created`, `assigned`, or all) |
| GET | `/api/tasks/<id>` | Yes | Get one task |
| PATCH | `/api/tasks/<id>` | Yes | Update a task (creator only) |
| PATCH | `/api/tasks/<id>/complete` | Yes | Mark complete (creator or assignee) |
| DELETE | `/api/tasks/<id>` | Yes | Delete a task (creator only) |
| GET | `/api/tasks/<id>/comments` | Yes | List comments on a task with user profiles |
| POST | `/api/tasks/<id>/comments` | Yes | Add a comment & notify task participants via email |
| DELETE | `/api/tasks/<id>/comments/<comment_id>` | Yes | Delete your own comment |

## Notes
- Auth uses Supabase's Google OAuth provider; the actual login happens
  client-side, and the backend validates the resulting token.
- Emails are sent on a background thread so a slow mail server never
  blocks the API response.