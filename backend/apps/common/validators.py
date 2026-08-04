"""Custom field- and password-level validators shared across serializers."""
import os
import re

from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import RegexValidator

phone_validator = RegexValidator(
    regex=r'^\+?[0-9\s\-()]{7,20}$',
    message='Enter a valid phone number (7-20 digits, may include +, spaces, dashes, or parentheses).',
)


class PasswordComplexityValidator:
    """
    Requires at least one uppercase letter, one lowercase letter, one digit,
    and one special character — used alongside Django's built-in validators.
    """

    def validate(self, password, user=None):
        errors = []
        if not re.search(r'[A-Z]', password):
            errors.append('Password must contain at least one uppercase letter.')
        if not re.search(r'[a-z]', password):
            errors.append('Password must contain at least one lowercase letter.')
        if not re.search(r'\d', password):
            errors.append('Password must contain at least one digit.')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=/\\\[\];\'~`]', password):
            errors.append('Password must contain at least one special character.')
        if errors:
            raise DjangoValidationError(errors)

    def get_help_text(self):
        return (
            'Your password must contain at least one uppercase letter, one lowercase '
            'letter, one digit, and one special character.'
        )


def validate_image_file(image_field, max_size_mb=5, allowed_extensions=None):
    """
    Validates an uploaded image's extension and size. Raises DRF-friendly
    django.core.exceptions.ValidationError on failure.
    """
    allowed_extensions = allowed_extensions or ['.jpg', '.jpeg', '.png', '.webp']
    ext = os.path.splitext(image_field.name)[1].lower()

    if ext not in allowed_extensions:
        raise DjangoValidationError(
            f'Unsupported file type "{ext}". Allowed types: {", ".join(allowed_extensions)}.'
        )

    max_size_bytes = max_size_mb * 1024 * 1024
    if image_field.size > max_size_bytes:
        raise DjangoValidationError(f'Image file too large. Maximum size is {max_size_mb}MB.')
