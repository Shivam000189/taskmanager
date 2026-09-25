import smtplib
import threading
from email.message import EmailMessage

from flask import current_app

from app.config import Config


def _send(subject: str, to_email: str, body: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{Config.MAIL_FROM_NAME} <{Config.MAIL_USERNAME}>"
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
            server.send_message(msg)
    except Exception:
        
        import logging
        logging.exception(f"Failed to send email to {to_email}")


def send_email_async(subject: str, to_email: str, body: str):
    if not to_email:
        return
    threading.Thread(
        target=_send,
        args=(subject, to_email, body),
        daemon=True,
    ).start()