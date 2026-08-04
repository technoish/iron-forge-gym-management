"""
POST /api/contact/  — public: submit a contact form message.
GET  /api/contact/  — admin only: list submitted messages.
"""
import logging

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle

from apps.common.pagination import StandardResultsPagination
from apps.common.permissions import IsAdminRole
from apps.common.response import success_response

from .models import ContactMessage
from .serializers import ContactMessageSerializer

logger = logging.getLogger('apps')


class ContactMessageViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    pagination_class = StandardResultsPagination
    search_fields = ['name', 'email', 'subject', 'message']
    ordering_fields = ['created_at']
    filterset_fields = ['is_read']
    ordering = ['-created_at']
    throttle_scope = 'auth'

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminRole()]

    def get_throttles(self):
        if self.action == 'create':
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        logger.info('New contact message received from %s', serializer.validated_data.get('email'))
        return success_response(
            'Thanks for reaching out — we will get back to you within one business day.',
            serializer.data,
            status_code=201,
        )
