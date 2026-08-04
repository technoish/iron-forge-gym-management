from rest_framework import serializers

from apps.common.validators import validate_image_file

from .models import GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ('id', 'image', 'title', 'category', 'uploaded_at')
        read_only_fields = ('id', 'uploaded_at')

    def validate_image(self, value):
        validate_image_file(value)
        return value
