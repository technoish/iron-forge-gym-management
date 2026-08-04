"""Password reset token generation, scoped to the users app."""
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class PasswordResetTokenGeneratorImpl(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return f'{user.pk}{user.password}{timestamp}{user.is_active}'


password_reset_token_generator = PasswordResetTokenGeneratorImpl()
