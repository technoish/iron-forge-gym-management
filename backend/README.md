# IronForge Gym — Backend API

A Django REST Framework backend for the IronForge gym
management platform: JWT authentication, trainers, membership plans,
services, testimonials, gallery, contact messages, a BMI calculator, and an
admin dashboard — all API-only

## Tech Stack

- Python 3.12, Django 5, Django REST Framework
- PostgreSQL
- JWT auth via `djangorestframework-simplejwt` (access + refresh, blacklist-on-logout)
- `django-cors-headers`, `django-filter`
- `drf-spectacular` for OpenAPI/Swagger docs
- Pillow for image uploads
- Gunicorn + WhiteNoise for production serving
- Docker + docker-compose

## Project Structure

```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py            # shared settings
│   │   ├── development.py     # DEBUG=True, permissive CORS
│   │   └── production.py      # hardened security settings
│   ├── urls.py                # mounts every app under /api/*
│   ├── wsgi.py / asgi.py
│
├── apps/
│   ├── common/                # response envelope, pagination, permissions,
│   │                           # exception handler, validators, request-logging
│   │                           # middleware, seed_data management command
│   ├── users/                 # custom User model (AUTH_USER_MODEL)
│   ├── authentication/        # register/login/logout/refresh/profile/password flows
│   ├── trainers/
│   ├── memberships/
│   ├── services/               (app label: gym_services, db table: services)
│   ├── bmi/                   # stateless calculator + services.py business logic
│   ├── contact/
│   ├── gallery/
│   ├── testimonials/
│   └── dashboard/             # admin-only aggregate stats
│
├── media/ static/ logs/
├── requirements.txt / requirements-dev.txt
├── Dockerfile / docker-compose.yml / docker-entrypoint.sh
├── pytest.ini
└── manage.py
```

## Local Setup

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements-dev.txt   # includes requirements.txt + test/lint tools

cp .env.example .env
# edit .env — at minimum set DJANGO_SECRET_KEY and your local Postgres credentials

# Create the database (adjust to your local Postgres setup)
createdb gym_db

python manage.py migrate
python manage.py seed_data        # optional: demo trainers/plans/services + an admin user
python manage.py createsuperuser  # or use the admin created by seed_data (admin / ChangeMe123!)

python manage.py runserver
```

API root: `http://localhost:8000/api/`
Swagger UI: `http://localhost:8000/api/docs/`
ReDoc: `http://localhost:8000/api/redoc/`
Django Admin: `http://localhost:8000/admin/`

## Docker

```bash
cp .env.example .env   # edit as needed; DB_HOST is overridden to "db" by docker-compose
docker compose up --build
```

This starts PostgreSQL and the backend (migrations + `collectstatic` run
automatically via `docker-entrypoint.sh`), serving on `http://localhost:8000`.

## Running Tests

```bash
pytest                      # uses pytest.ini -> config.settings.development
# or, without pytest:
python manage.py test
```

Tests cover models, serializers, permissions, and every API endpoint
(authentication flows, CRUD permission boundaries, BMI calculation
correctness, dashboard access control).

## Authentication Model: Roles vs. Django Admin Access

Two different things gate access in this project and it's worth being
explicit about the distinction:

- **`User.role`** (`admin` / `member`) — drives *API* permissions everywhere
  under `/api/*` (see `apps.common.permissions.IsAdminRole` /
  `IsAdminOrReadOnly`). This is what the React frontend's login response
  and JWT payload expose.
- **`is_staff` / `is_superuser`** — Django's own flags, required to log in
  to `/admin/`. `seed_data` creates its demo admin as a superuser *and*
  with `role=admin`, but in general these are independent — you can have
  an API-admin who can't log into the Django admin site, or vice versa.
  Adjust `IsAdminRole` if you'd rather couple the two.

## API Response Format

Every endpoint returns the same envelope:

```json
// success
{ "success": true, "message": "Trainer created successfully.", "data": { ... } }

// paginated list
{ "success": true, "message": "Success", "data": [ ... ], "meta": { "count": 42, "total_pages": 4, "current_page": 1, "page_size": 12, "next": "...", "previous": null } }

// error
{ "success": false, "message": "Validation failed.", "errors": { "email": ["This field is required."] } }
```

## Key Endpoints

| Area | Endpoint |
|---|---|
| Auth | `POST /api/auth/register/`, `login/`, `logout/`, `refresh/`, `GET|PUT /api/auth/profile/`, `change-password/`, `forgot-password/`, `reset-password/` |
| Trainers | `GET|POST /api/trainers/`, `GET|PUT|PATCH|DELETE /api/trainers/{id}/` |
| Membership Plans | `GET|POST /api/memberships/`, `.../{id}/` |
| Services | `GET|POST /api/services/`, `.../{id}/` |
| Testimonials | `GET|POST /api/testimonials/`, `.../{id}/` |
| Gallery | `GET|POST /api/gallery/`, `.../{id}/` |
| Contact | `POST /api/contact/` (public), `GET /api/contact/` (admin) |
| BMI | `POST /api/bmi/` (public, stateless) |
| Dashboard | `GET /api/dashboard/` (admin only) |

Public GET endpoints only ever return `is_active=True` records to
anonymous/member users; authenticated admins see everything (including
inactive/hidden records) so the admin dashboard can manage them.

## Security Notes

- JWT access/refresh tokens, refresh rotation + blacklist-on-logout
- Password hashing via Django's PBKDF2 (default) + a custom complexity
  validator (`apps.common.validators.PasswordComplexityValidator`) requiring
  upper/lower/digit/special-character
- `forgot-password` always returns the same generic message whether or not
  the email exists, to avoid account enumeration
- Scoped rate throttling on auth (`10/min`) and password-reset (`5/hour`)
  endpoints, plus global anon/user throttles
- CORS allowlist via `CORS_ALLOWED_ORIGINS`; production settings additionally
  enforce HTTPS redirect, HSTS, secure cookies, and `X-Frame-Options: DENY`
- Image upload validation (extension allowlist + 5MB size cap) on every
  ImageField-backed serializer
- All list/detail errors and uncaught exceptions pass through a single
  custom exception handler so nothing leaks a raw traceback to the client
- Structured logging to `logs/app.log`, `logs/error.log`, and
  `logs/auth.log` (rotating file handlers), plus a request-logging
  middleware that records method/path/status/duration/user for every
  `/api/*` call

## Known Limitations / Next Steps

- I could not run `pip install`, `migrate`, or the test suite in the
  environment this was built in (no network access), so while every file
  was syntax-checked (`py_compile`) and manually cross-referenced for
  import/URL-name consistency, you should run `pytest` locally as your
  first step after `pip install` and treat this as reviewed-but-unexecuted
  code.
- Email sending defaults to the console backend in development
  (`EMAIL_BACKEND` in `.env.example`) — swap in real SMTP credentials for
  the forgot-password flow to actually deliver mail.
- No Celery/async task queue is wired up; password-reset emails send
  synchronously inside the request. Fine at gym-website scale, worth
  moving to a task queue if email volume grows.
