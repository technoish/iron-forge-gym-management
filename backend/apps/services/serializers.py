from rest_framework import serializers

from apps.common.validators import validate_image_file

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'title', 'image', 'description', 'icon', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_image(self, value):
        if value:
            validate_image_file(value)
        return value
