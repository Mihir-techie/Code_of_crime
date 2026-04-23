from datetime import datetime

from app import db


class CaseFile(db.Model):
    __tablename__ = "cases"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    story = db.Column(db.Text, nullable=False)
    evidence = db.Column(db.Text, nullable=False)
    final_verdict_question = db.Column(db.String(255), nullable=True)
    is_paid = db.Column(db.Boolean, default=False)
    price_inr = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    questions = db.relationship("Question", backref="case", lazy=True, cascade="all,delete")
    attempts = db.relationship("CaseAttempt", backref="case", lazy=True)
    ratings = db.relationship("CaseRating", backref="case", lazy=True)
    certificates = db.relationship("Certificate", backref="case", lazy=True)

    def to_dict(self, include_questions=False):
        data = {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "story": self.story,
            "evidence": self.evidence,
            "final_verdict_question": self.final_verdict_question,
            "is_paid": self.is_paid,
            "price_inr": self.price_inr,
            "is_published": self.is_published,
        }
        if include_questions:
            data["questions"] = [q.to_dict() for q in self.questions]
        return data


class CaseAttempt(db.Model):
    __tablename__ = "case_attempts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_answers = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CaseRating(db.Model):
    __tablename__ = "case_ratings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
