from datetime import datetime

from app import db


class Purchase(db.Model):
    __tablename__ = "purchases"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    item_type = db.Column(db.String(20), nullable=False)  # case|course
    item_id = db.Column(db.Integer, nullable=False, index=True)
    amount_inr = db.Column(db.Integer, nullable=False)
    razorpay_payment_id = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default="completed")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
