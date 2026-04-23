import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from config import Config

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(app.config["CERTIFICATES_DIR"], exist_ok=True)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    from app.routes.admin import admin_bp
    from app.routes.auth import auth_bp
    from app.routes.case import case_bp
    from app.routes.payment import payment_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(case_bp, url_prefix="/api/cases")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(payment_bp, url_prefix="/api/payment")

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "code-of-crime-backend"}

    @app.get("/api/about")
    def about():
        return {"supported_by": "supported by codeofcrime@annexra.in"}

    return app
