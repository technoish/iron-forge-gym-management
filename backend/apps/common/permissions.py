"""Reusable role-based permission classes shared across every app."""
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminRole(BasePermission):
    """Allows access only to authenticated users with role == 'admin'."""

    message = 'Only gym administrators can perform this action.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == 'admin' or request.user.is_superuser)
        )


class IsAdminOrReadOnly(BasePermission):
    """Public GET/HEAD/OPTIONS; write access restricted to admins."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == 'admin' or request.user.is_superuser)
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level permission: owner of a record, or an admin, may modify it."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        is_admin = request.user.role == 'admin' or request.user.is_superuser
        owner_id = getattr(obj, 'user_id', getattr(obj, 'id', None))
        return is_admin or owner_id == request.user.id
