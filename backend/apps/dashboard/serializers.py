from rest_framework import serializers


class DashboardStatsSerializer(serializers.Serializer):
    total_trainers = serializers.IntegerField()
    active_trainers = serializers.IntegerField()
    total_membership_plans = serializers.IntegerField()
    total_services = serializers.IntegerField()
    total_contact_messages = serializers.IntegerField()
    unread_contact_messages = serializers.IntegerField()
    total_testimonials = serializers.IntegerField()
    total_gallery_images = serializers.IntegerField()
    total_members = serializers.IntegerField()
