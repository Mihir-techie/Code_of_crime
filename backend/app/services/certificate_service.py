import os
import secrets
from datetime import datetime, timezone

from flask import current_app
from PIL import Image, ImageDraw, ImageFont


def generate_certificate(user_name: str, case_name: str) -> tuple[str, str]:
    verification_code = secrets.token_hex(12)
    safe_name = "".join(ch for ch in user_name if ch.isalnum() or ch in ("_", "-")).strip()
    filename = f"{safe_name}_{verification_code}.pdf"
    output_path = os.path.join(current_app.config["CERTIFICATES_DIR"], filename)

    template_path = os.path.join(current_app.root_path, "assets", "certificate_template.png")

    if os.path.exists(template_path):
        img = Image.open(template_path).convert("RGB")
    else:
        # Fallback empty image if not found
        img = Image.new("RGB", (950, 655), color="white")

    draw = ImageDraw.Draw(img)

    try:
        font_large = ImageFont.truetype("arial.ttf", 36)
        font_medium = ImageFont.truetype("arial.ttf", 20)
        font_small = ImageFont.truetype("arial.ttf", 16)
    except IOError:
        font_large = font_medium = font_small = ImageFont.load_default()

    name_color = (201, 167, 89)
    code_color = (0, 0, 0)
    date_color = (150, 150, 150)

    current_date = datetime.now(timezone.utc).strftime("%d %b %Y")

    draw.text((475, 290), user_name, font=font_large, fill=name_color, anchor="mm")
    draw.text((475, 410), case_name, font=font_large, fill=name_color, anchor="mm")
    draw.text((505, 500), verification_code, font=font_medium, fill=code_color, anchor="mm")
    draw.text((308, 545), current_date, font=font_small, fill=date_color, anchor="mm")

    img.save(output_path, "PDF", resolution=100.0)

    return output_path, verification_code
