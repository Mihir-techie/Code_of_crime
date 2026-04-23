from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models.case import CaseFile
from app.models.course import Course
from app.models.purchase import Purchase
from app.services.payment_service import verify_razorpay_signature

payment_bp = Blueprint("payment", __name__)


@payment_bp.get("/config")
def config():
    return jsonify({"razorpay_key_id": current_app.config.get("RAZORPAY_KEY_ID", "")})


@payment_bp.post("/unlock")
@jwt_required()
def unlock():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    item_type = data.get("item_type")
    item_id = int(data.get("item_id", 0))
    payment_id = data.get("payment_id", "")
    order_id = data.get("order_id", "")
    signature = data.get("signature", "")

    if item_type not in ("case", "course"):
        return jsonify({"message": "Invalid item type"}), 400

    if item_type == "case":
        item = CaseFile.query.get_or_404(item_id)
    else:
        item = Course.query.get_or_404(item_id)

    if not item.is_paid:
        return jsonify({"message": "This item is free"}), 400

    if not verify_razorpay_signature(order_id, payment_id, signature):
        return jsonify({"message": "Invalid payment signature"}), 400

    purchase = Purchase(
        user_id=user_id,
        item_type=item_type,
        item_id=item.id,
        amount_inr=item.price_inr,
        razorpay_payment_id=payment_id,
        status="completed",
    )
    db.session.add(purchase)
    db.session.commit()
    return jsonify({"message": "Unlocked successfully"})
