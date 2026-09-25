import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "Task Manager")

    @classmethod
    def validate(cls):
        missing = [
            name for name in ("SUPABASE_URL", "SUPABASE_KEY", "MAIL_USERNAME", "MAIL_PASSWORD")
            if not getattr(cls, name)
        ]
        if missing:
            raise RuntimeError(
                f"Missing environment variables: {', '.join(missing)}"
            )