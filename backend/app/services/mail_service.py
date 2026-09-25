import logging
import threading

import resend

from app.config import Config

resend.api_key = Config.RESEND_API_KEY


def _send(subject: str, to_email: str, body: str):
    try:
        resend.api_key = Config.RESEND_API_KEY
        resend.Emails.send({
            "from": f"{Config.MAIL_FROM_NAME} <onboarding@resend.dev>",
            "to": to_email,
            "subject": subject,
            "text": body,
        })
    except Exception:
        logging.exception(f"Failed to send email to {to_email}")


def send_email_async(subject: str, to_email: str, body: str):
    if not to_email:
        return
    threading.Thread(
        target=_send,
        args=(subject, to_email, body),
        daemon=True,
    ).start()