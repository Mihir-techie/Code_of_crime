# Code of Crime Backend

Flask + SQLAlchemy backend for:
- JWT auth (user/admin)
- Email verification and SMTP email sending
- Case files, quiz questions, scoring, certificates
- Admin case/course creation
- Razorpay signature-based unlock endpoint

## Setup

1. Create venv and install dependencies:
   - `python -m venv .venv`
   - `.venv\Scripts\activate`
   - `pip install -r requirements.txt`
2. Copy `.env.example` to `.env` and fill real values.
3. Run server:
   - `python run.py`
4. Seed default admins and sample cases:
   - `POST /api/admin/seed`

## Default seeded admin accounts

- `codeofcrime82@gmail.com` / `code_of_crime_67`
- `mihirkumarpanigrahi2002@gmail.com` / `mihir_ntsh_69`

## Key endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/cases`
- `GET /api/cases/<id>`
- `POST /api/cases/<id>/submit`
- `POST /api/cases/<id>/rate`
- `GET /api/cases/courses`
- `POST /api/admin/cases`
- `POST /api/admin/cases/<id>/questions`
- `POST /api/admin/courses`
- `POST /api/payment/unlock`
- ` .\.venv\Scripts\Activate.ps1`
