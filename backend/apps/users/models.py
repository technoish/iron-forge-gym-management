"""Custom User model — email/username login, roles, profile fields."""
from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common.validators import phone_validator


class UserManager_Docs:
    """Kept for documentation purposes; Django's default UserManager is reused
    below via `objects = UserManager()` since AbstractUser already provides
    create_user / create_superuser with sane password hashing behavior."""


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MEMBER = 'member', 'Member'

    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True, validators=[phone_validator])
    profile_image = models.ImageField(upload_to='profiles/%Y/%m/', blank=True, null=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.MEMBER, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']  

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f'{self.get_full_name() or self.username} ({self.email})'

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN or self.is_superuser
