from itsdangerous import URLSafeTimedSerializer
from flask import current_app


def _serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def generate_email_token(email: str) -> str:
    return _serializer().dumps(email, salt="email-verify")


def verify_email_token(token: str, max_age=60 * 60 * 24) -> str | None:
    try:
        return _serializer().loads(token, salt="email-verify", max_age=max_age)
    except Exception:
        return None
