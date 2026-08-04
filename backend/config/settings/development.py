"""Development settings — verbose errors, permissive CORS, console email."""
from .base import *  # noqa: F401,F403

DEBUG = True


if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']

INSTALLED_APPS += []  

CORS_ALLOW_ALL_ORIGINS = env_bool('DJANGO_CORS_ALLOW_ALL', True)
