"""
Trainer CRUD API.
Public: GET (list/retrieve), scoped to active trainers only for anonymous users.
Admin: full CRUD.
"""
from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from apps.common.pagination import StandardResultsPagination
from apps.common.permissions import IsAdminOrReadOnly
from apps.common.response import success_response

from .filters import TrainerFilter
from .models import Trainer
from .serializers import TrainerSerializer


class TrainerViewSet(viewsets.ModelViewSet):
    serializer_class = TrainerSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsPagination
    parser_classes = [MultiPartParser, FormParser]
    filterset_class = TrainerFilter
    search_fields = ['name', 'specialization', 'description']
    ordering_fields = ['created_at', 'name', 'experience']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Trainer.objects.all()
        # Anonymous / member users only ever see active trainers.
        if not (self.request.user.is_authenticated and getattr(self.request.user, 'role', None) == 'admin'):
            queryset = queryset.filter(is_active=True)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return success_response('Trainer created successfully.', serializer.data, status_code=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return success_response('Trainer updated successfully.', serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return success_response('Trainer retrieved.', self.get_serializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return success_response('Trainer deleted successfully.', status_code=200)
