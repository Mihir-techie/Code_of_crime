import hmac
import hashlib

from flask import current_app


def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
    secret = current_app.config.get("RAZORPAY_KEY_SECRET", "")
    if not secret:
        return False
    payload = f"{order_id}|{payment_id}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
