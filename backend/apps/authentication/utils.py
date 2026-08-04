"""Email helpers for the authentication flows (password reset, etc.)."""
import logging

from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger('apps.authentication')


def send_password_reset_email(user, uid, token):
    reset_link = f'{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}'
    subject = 'Reset your IronForge password'
    message = (
        f'Hi {user.first_name or user.username},\n\n'
        f'We received a request to reset your IronForge account password. '
        f'Click the link below to choose a new one. This link expires in 1 hour.\n\n'
        f'{reset_link}\n\n'
        f"If you didn't request this, you can safely ignore this email.\n\n"
        f'— IronForge Gym'
    )
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info('Password reset email sent to user_id=%s', user.id)
    except Exception:
        logger.exception('Failed to send password reset email to user_id=%s', user.id)
        raise
