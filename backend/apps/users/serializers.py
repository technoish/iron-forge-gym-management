"""Serializers for reading/updating a user's own profile."""
from rest_framework import serializers

from apps.common.validators import validate_image_file

from .models import User


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'full_name', 'email',
            'phone', 'profile_image', 'role', 'is_active', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'username', 'email', 'role', 'is_active', 'created_at', 'updated_at')

    def get_full_name(self, obj):
        return obj.get_full_name()

    def validate_profile_image(self, value):
        if value:
            validate_image_file(value)
        return value


class UserPublicSerializer(serializers.ModelSerializer):
    """Minimal, safe-to-expose representation used when embedding a user in other payloads."""

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile_image')
