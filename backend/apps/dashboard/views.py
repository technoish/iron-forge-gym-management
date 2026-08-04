"""GET /api/dashboard/ — admin-only aggregate statistics for the admin panel."""
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.common.permissions import IsAdminRole
from apps.common.response import success_response
from apps.contact.models import ContactMessage
from apps.gallery.models import GalleryImage
from apps.memberships.models import MembershipPlan
from apps.services.models import Service
from apps.testimonials.models import Testimonial
from apps.trainers.models import Trainer

from .serializers import DashboardStatsSerializer

User = get_user_model()


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    @extend_schema(responses=DashboardStatsSerializer)
    def get(self, request):
        data = {
            'total_trainers': Trainer.objects.count(),
            'active_trainers': Trainer.objects.filter(is_active=True).count(),
            'total_membership_plans': MembershipPlan.objects.count(),
            'total_services': Service.objects.count(),
            'total_contact_messages': ContactMessage.objects.count(),
            'unread_contact_messages': ContactMessage.objects.filter(is_read=False).count(),
            'total_testimonials': Testimonial.objects.count(),
            'total_gallery_images': GalleryImage.objects.count(),
            'total_members': User.objects.filter(role=User.Role.MEMBER).count(),
        }
        return success_response('Dashboard statistics retrieved.', data)
