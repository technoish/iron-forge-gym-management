from rest_framework import serializers

from apps.common.validators import validate_image_file

from .models import Trainer


class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = (
            'id', 'name', 'image', 'specialization', 'experience', 'certifications',
            'description', 'facebook', 'instagram', 'linkedin', 'email', 'phone',
            'is_active', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_image(self, value):
        if value:
            validate_image_file(value)
        return value
