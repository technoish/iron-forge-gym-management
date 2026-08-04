from rest_framework import serializers

from .models import MembershipPlan


class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = (
            'id', 'plan_name', 'duration', 'price', 'description', 'features',
            'is_popular', 'is_active', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_features(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Features must be a list of strings.')
        if not all(isinstance(item, str) for item in value):
            raise serializers.ValidationError('Each feature must be a string.')
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value
