import json
import os
import uuid

from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename

from app import db
from app.models.case import CaseFile
from app.models.course import Course
from app.models.question import Question
from app.models.user import User
from app.utils.decorators import role_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.post("/seed")
def seed_default_data():
    admin_defaults = [
        ("codeofcrime82@gmail.com", "code_of_crime_67", "Code Of Crime Admin"),
        ("mihirkumarpanigrahi2002@gmail.com", "mihir_ntsh_69", "Mihir Admin"),
    ]
    for email, password, name in admin_defaults:
        row = User.query.filter_by(email=email).first()
        if not row:
            row = User(
                name=name,
                email=email,
                role="admin",
                is_email_verified=True,
            )
            row.set_password(password)
            db.session.add(row)

    if CaseFile.query.count() == 0:
        c1 = CaseFile(
            title="The Vault Heist",
            slug="the-vault-heist",
            story=(
                "At 2:15 AM, a private vault inside a finance office was opened without signs "
                "of forced entry. ₹50 lakh worth of valuables are missing. Security shows CCTV "
                "blackout for 7 minutes and no alarm trigger. One frame before blackout shows a "
                "person in security uniform."
            ),
            evidence=(
                "CCTV: 2:12-2:19 blackout. Access log: authorized card belongs to Rajesh (night "
                "supervisor). Physical: size 9 industrial shoe print, glove-smudged fingerprint. "
                "Vault: manual internal override, no forced damage. Break room: sedative in half-"
                "drunk coffee. Digital: Rajesh location shows home, but WiFi disconnect at 1:50 AM."
            ),
            final_verdict_question="Inside job or impersonation?",
            is_paid=False,
            price_inr=0,
        )
        c2 = CaseFile(
            title="Midnight Hit-and-Run",
            slug="midnight-hit-and-run",
            story=(
                "At 11:45 PM, a pedestrian was hit on a dimly lit road and the driver fled the "
                "scene. Victim is critical. Nearby CCTV captured sedan type with left headlight "
                "broken and last plate digits 27."
            ),
            evidence=(
                "Scene: broken headlight glass, skid marks, blood pool. Victim clothes: dark blue "
                "paint transfer. Forensics: Honda City 2015-2018 match. Witness: loud music and "
                "swerving. Petrol bunk: nervous driver with broken headlight seen at 12:05 AM."
            ),
            final_verdict_question="Was this reckless or drunk driving?",
            is_paid=False,
            price_inr=0,
        )
        c3 = CaseFile(
            title="Midnight Rain",
            slug="midnight-rain",
            story=(
                "Date: October 12, Time: 12:30 AM, Location: isolated roadside near industrial "
                "area. Heavy rain. A man was found dead near a ditch, face down. At first glance "
                "it looked like an accident, but multiple clues suggest the scene was staged."
            ),
            evidence=(
                "Body 5 meters away from road; rain washed traces; head injury, minor hand cuts, "
                "wallet missing. Tire impressions suggest SUV, but no skid marks. Only one "
                "footprint set leads toward body, none away. Blood pool is very small, indicating "
                "injury likely elsewhere. Phone found in bushes, last call 12:05 AM unknown number. "
                "Injury pattern indicates blunt force trauma, not vehicle impact. Final logic: "
                "victim attacked elsewhere and dumped during rain."
            ),
            final_verdict_question="Was this a staged dump scene?",
            is_paid=True,
            price_inr=99,
        )
        db.session.add_all([c1, c2, c3])
        db.session.flush()

        questions = [
            Question(
                case_id=c1.id,
                prompt="What indicates insider involvement?",
                options_json=json.dumps(
                    ["Forced lock", "Authorized card usage", "Public holiday", "Power cut"]
                ),
                correct_answer="Authorized card usage",
            ),
            Question(
                case_id=c1.id,
                prompt="Why is CCTV blackout suspicious?",
                options_json=json.dumps(
                    ["Rain issue", "Scheduled maintenance", "Timed with vault event", "No reason"]
                ),
                correct_answer="Timed with vault event",
            ),
            Question(
                case_id=c1.id,
                prompt="What does sedative in coffee suggest?",
                options_json=json.dumps(
                    ["Random contamination", "Planned incapacitation", "Coffee expired", "No clue"]
                ),
                correct_answer="Planned incapacitation",
            ),
            Question(
                case_id=c2.id,
                prompt="Most likely vehicle?",
                options_json=json.dumps(["Bike", "SUV", "Sedan Honda City", "Truck"]),
                correct_answer="Sedan Honda City",
            ),
            Question(
                case_id=c2.id,
                prompt="Dark blue paint transfer indicates what?",
                options_json=json.dumps(
                    ["Victim car color", "Attacker shirt", "Vehicle body contact", "Road paint"]
                ),
                correct_answer="Vehicle body contact",
            ),
            Question(
                case_id=c2.id,
                prompt="Swerving and loud music indicate?",
                options_json=json.dumps(
                    ["Careful driving", "Negligent/reckless driving", "Engine failure", "Fog issue"]
                ),
                correct_answer="Negligent/reckless driving",
            ),
            Question(
                case_id=c3.id,
                prompt="Small blood pool at scene indicates?",
                options_json=json.dumps(
                    ["Massive bleed onsite", "Injury elsewhere", "No injury", "Animal blood"]
                ),
                correct_answer="Injury elsewhere",
            ),
            Question(
                case_id=c3.id,
                prompt="What does absence of skid marks suggest?",
                options_json=json.dumps(
                    ["Heavy brake applied", "Vehicle parked", "No emergency braking event", "Rain impossible"]
                ),
                correct_answer="No emergency braking event",
            ),
            Question(
                case_id=c3.id,
                prompt="Best final verdict?",
                options_json=json.dumps(
                    ["Clear accident", "Natural death", "Staged crime scene", "Suicide"]
                ),
                correct_answer="Staged crime scene",
            ),
        ]
        db.session.add_all(questions)

    db.session.commit()
    return jsonify({"message": "Seed complete"})


@admin_bp.post("/cases")
@role_required("admin")
def create_case():
    data = request.get_json() or {}
    row = CaseFile(
        title=data.get("title", ""),
        slug=data.get("slug", ""),
        story=data.get("story", ""),
        evidence=data.get("evidence", ""),
        final_verdict_question=data.get("final_verdict_question"),
        is_paid=bool(data.get("is_paid", False)),
        price_inr=int(data.get("price_inr", 0)),
        is_published=bool(data.get("is_published", True)),
    )
    db.session.add(row)
    db.session.flush()

    questions = data.get("questions", [])
    for q_data in questions:
        q = Question(
            case_id=row.id,
            prompt=q_data.get("prompt", ""),
            options_json=json.dumps(q_data.get("options", [])),
            correct_answer=q_data.get("correct_answer", ""),
            explanation=q_data.get("explanation"),
        )
        db.session.add(q)

    db.session.commit()
    return jsonify(row.to_dict()), 201


@admin_bp.post("/cases/<int:case_id>/questions")
@role_required("admin")
def add_question(case_id: int):
    CaseFile.query.get_or_404(case_id)
    data = request.get_json() or {}
    q = Question(
        case_id=case_id,
        prompt=data.get("prompt", ""),
        options_json=json.dumps(data.get("options", [])),
        correct_answer=data.get("correct_answer", ""),
        explanation=data.get("explanation"),
    )
    db.session.add(q)
    db.session.commit()
    return jsonify({"id": q.id}), 201


@admin_bp.post("/courses")
@role_required("admin")
def create_course():
    data = request.get_json() or {}
    c = Course(
        title=data.get("title", ""),
        description=data.get("description", ""),
        video_url=data.get("video_url"),
        notes=data.get("notes"),
        is_paid=bool(data.get("is_paid", False)),
        price_inr=int(data.get("price_inr", 0)),
        is_published=bool(data.get("is_published", True)),
    )
    db.session.add(c)
    db.session.commit()
    return jsonify(c.to_dict()), 201


@admin_bp.post("/upload-video")
@role_required("admin")
def upload_video():
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        ext = os.path.splitext(filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        
        # Ensure static/uploads exists
        uploads_dir = os.path.join(current_app.root_path, "static", "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        
        filepath = os.path.join(uploads_dir, unique_filename)
        file.save(filepath)
        
        # Return public URL path
        return jsonify({"url": f"/static/uploads/{unique_filename}"}), 200
