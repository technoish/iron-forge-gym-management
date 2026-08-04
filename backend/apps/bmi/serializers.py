from rest_framework import serializers


class BMIRequestSerializer(serializers.Serializer):
    height = serializers.FloatField(min_value=50, max_value=272, help_text='Height in centimeters (50-272cm).')
    weight = serializers.FloatField(min_value=10, max_value=500, help_text='Weight in kilograms (10-500kg).')

    def validate_height(self, value):
        if value <= 0:
            raise serializers.ValidationError('Height must be a positive number.')
        return value

    def validate_weight(self, value):
        if value <= 0:
            raise serializers.ValidationError('Weight must be a positive number.')
        return value


class BMIResponseSerializer(serializers.Serializer):
    bmi = serializers.FloatField()
    category = serializers.CharField()
    health_tip = serializers.CharField()
