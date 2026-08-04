from rest_framework import viewsets

from apps.common.pagination import StandardResultsPagination
from apps.common.permissions import IsAdminOrReadOnly
from apps.common.response import success_response

from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsPagination
    search_fields = ['customer_name', 'review']
    ordering_fields = ['created_at', 'rating']
    filterset_fields = ['rating', 'is_active']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Testimonial.objects.all()
        if not (self.request.user.is_authenticated and getattr(self.request.user, 'role', None) == 'admin'):
            queryset = queryset.filter(is_active=True)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return success_response('Testimonial created successfully.', serializer.data, status_code=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return success_response('Testimonial updated successfully.', serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return success_response('Testimonial deleted successfully.')
