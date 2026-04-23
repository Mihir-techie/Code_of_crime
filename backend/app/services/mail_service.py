from flask import current_app, url_for
from flask_mail import Message

from app import mail


def send_mail(subject: str, recipients: list[str], body: str, html: str = None):
    if not current_app.config.get("MAIL_USERNAME") or not current_app.config.get("MAIL_PASSWORD"):
        return
    msg = Message(subject=subject, recipients=recipients, body=body, html=html)
    mail.send(msg)


def send_verification_email(email: str, token: str):
    verify_url = f"{current_app.config['FRONTEND_URL']}/verify-email?token={token}"
    logo_url = url_for('static', filename='logo.png', _external=True)
    
    body = (
        "❤️❤️Welcome to Code of Crime❤️❤️.\n\n"
        f"Please verify your email by opening this link:\n{verify_url}\n\n"
        "If you did not sign up, ignore this email."
    )
    
    html = f"""
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #050505; color: #ffffff; padding: 40px 20px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(225, 29, 72, 0.15);">
            <div style="background: linear-gradient(180deg, rgba(225, 29, 72, 0.1) 0%, rgba(18, 18, 18, 0) 100%); padding: 40px 20px 20px;">
                <img src="{logo_url}" alt="Code of Crime Logo" style="height: 80px; margin-bottom: 20px;" />
                <h1 style="margin: 0; font-size: 28px; color: #e11d48; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Agency</h1>
            </div>
            <div style="padding: 30px 40px 40px; text-align: left;">
                <p style="font-size: 16px; line-height: 1.6; color: #d4d4d8; margin-top: 0;">Detective,</p>
                <p style="font-size: 16px; line-height: 1.6; color: #d4d4d8;">Your clearance has been initiated. Before you can access the classified case files and begin your investigation, we need to verify your credentials.</p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{verify_url}" style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);">VERIFY IDENTITY</a>
                </div>
                
                <p style="font-size: 14px; line-height: 1.5; color: #71717a; text-align: center; margin-bottom: 0;">If you did not request access to the Code of Crime archives, please disregard this transmission.</p>
            </div>
            <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #2a2a2a;">
                <p style="margin: 0; font-size: 12px; color: #52525b; text-transform: uppercase; letter-spacing: 1px;">© Code of Crime Interactive</p>
            </div>
        </div>
    </div>
    """
    
    send_mail("Verify your Code of Crime clearance", [email], body, html=html)


def send_certificate_email(email: str, user_name: str, case_title: str, certificate_url: str):
    body = (
        f"Hi {user_name},\n\n"
        f"Congratulations! You passed '{case_title}'.\n"
        f"Download your certificate here: {certificate_url}\n\n"
        "Thanks,\nCode of Crime"
    )
    send_mail("Your Code of Crime Certificate", [email], body)
