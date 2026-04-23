import os

from flask import Blueprint, current_app, jsonify, request, send_file
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db
from app.models.case import CaseAttempt, CaseFile, CaseRating
from app.models.course import Certificate, Course
from app.models.purchase import Purchase
from app.models.question import Question
from app.models.user import User
from app.services.certificate_service import generate_certificate
from app.services.mail_service import send_certificate_email

case_bp = Blueprint("case", __name__)


def _case_accessible(case: CaseFile, user_id: int) -> bool:
    if not case.is_paid:
        return True
    return (
        Purchase.query.filter_by(
            user_id=user_id, item_type="case", item_id=case.id, status="completed"
        ).first()
        is not None
    )


@case_bp.get("")
@jwt_required(optional=True)
def list_cases():
    user_id = get_jwt_identity()
    cases = CaseFile.query.filter_by(is_published=True).all()
    payload = []
    for c in cases:
        item = c.to_dict(include_questions=False)
        item["unlocked"] = bool(user_id) and _case_accessible(c, int(user_id)) or not c.is_paid
        payload.append(item)
    return jsonify(payload)


@case_bp.get("/certificate/<string:verification_code>")
def get_certificate(verification_code: str):
    cert = Certificate.query.filter_by(
        verification_code=verification_code
    ).first()
    if not cert:
        return jsonify({"message": "Certificate not found"}), 404
        
    abs_path = os.path.abspath(cert.certificate_url)
    if not os.path.exists(abs_path):
        return jsonify({"message": "Certificate not found"}), 404
        
    return send_file(abs_path, as_attachment=True)


@case_bp.get("/<int:case_id>")
@jwt_required()
def case_detail(case_id: int):
    user_id = int(get_jwt_identity())
    case = CaseFile.query.get_or_404(case_id)
    if not _case_accessible(case, user_id):
        return jsonify({"message": "Purchase required to unlock this case"}), 402
    return jsonify(case.to_dict(include_questions=True))


@case_bp.post("/<int:case_id>/submit")
@jwt_required()
def submit_case(case_id: int):
    user_id = int(get_jwt_identity())
    case = CaseFile.query.get_or_404(case_id)
    if not _case_accessible(case, user_id):
        return jsonify({"message": "Purchase required"}), 402

    data = request.get_json() or {}
    answers = data.get("answers", {})

    questions = Question.query.filter_by(case_id=case.id).all()
    total = len(questions)
    if total == 0:
        return jsonify({"message": "No questions configured"}), 400

    correct = 0
    for q in questions:
        user_answer = str(answers.get(str(q.id), "")).strip().lower()
        if user_answer == q.correct_answer.strip().lower():
            correct += 1

    score = int((correct / total) * 100)
    pass_threshold = current_app.config.get("PASS_THRESHOLD_PERCENT", 70)
    passed = score >= pass_threshold

    attempt = CaseAttempt(
        user_id=user_id,
        case_id=case.id,
        score=score,
        total_questions=total,
        correct_answers=correct,
        passed=passed,
    )
    db.session.add(attempt)

    certificate_data = None
    if passed:
        user = User.query.get(user_id)
        pdf_path, verification_code = generate_certificate(user.name, case.title)
        cert = Certificate(
            user_id=user.id,
            case_id=case.id,
            certificate_url=pdf_path,
            verification_code=verification_code,
        )
        db.session.add(cert)
        certificate_data = {
            "verification_code": verification_code,
            "download_url": f"/api/cases/certificate/{verification_code}",
        }
        send_certificate_email(user.email, user.name, case.title, pdf_path)

    db.session.commit()

    return jsonify(
        {
            "score": score,
            "correct_answers": correct,
            "total_questions": total,
            "passed": passed,
            "certificate": certificate_data,
        }
    )


@case_bp.post("/<int:case_id>/rate")
@jwt_required()
def rate_case(case_id: int):
    user_id = int(get_jwt_identity())
    CaseFile.query.get_or_404(case_id)
    data = request.get_json() or {}
    rating = int(data.get("rating", 0))
    feedback = data.get("feedback", "").strip()
    if rating < 1 or rating > 5:
        return jsonify({"message": "rating should be between 1 and 5"}), 400

    row = CaseRating(user_id=user_id, case_id=case_id, rating=rating, feedback=feedback)
    db.session.add(row)
    db.session.commit()
    return jsonify({"message": "Thanks for your feedback"})


@case_bp.get("/<int:case_id>/ratings")
def ratings(case_id: int):
    rows = CaseRating.query.filter_by(case_id=case_id).order_by(CaseRating.id.desc()).all()
    return jsonify(
        [
            {"rating": r.rating, "feedback": r.feedback, "created_at": r.created_at.isoformat()}
            for r in rows
        ]
    )


@case_bp.get("/courses")
@jwt_required(optional=True)
def list_courses():
    user_id = get_jwt_identity()
    courses = Course.query.filter_by(is_published=True).all()
    payload = []
    for c in courses:
        unlocked = not c.is_paid
        if user_id and c.is_paid:
            unlocked = (
                Purchase.query.filter_by(
                    user_id=int(user_id), item_type="course", item_id=c.id, status="completed"
                ).first()
                is not None
            )
        item = c.to_dict()
        item["unlocked"] = unlocked
        payload.append(item)
    return jsonify(payload)
