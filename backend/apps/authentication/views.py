"""Authentication endpoints: register, login, logout, refresh, profile, password flows."""
import logging

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.common.response import error_response, success_response
from apps.users.serializers import UserProfileSerializer

from .serializers import (
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    ForgotPasswordSerializer,
    LogoutSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    build_uid_and_token,
)
from .utils import send_password_reset_email

User = get_user_model()
logger = logging.getLogger('apps.authentication')


class RegisterView(GenericAPIView):
    """POST /api/auth/register/ — create a new member account."""

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_scope = 'auth'
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response('Registration failed.', serializer.errors, status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        logger.info('New user registered: user_id=%s email=%s', user.id, user.email)

        refresh = RefreshToken.for_user(user)
        return success_response(
            message='Account created successfully.',
            data={
                'user': UserProfileSerializer(user).data,
                'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
            },
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — obtain an access/refresh token pair."""

    serializer_class = CustomTokenObtainPairSerializer
    throttle_scope = 'auth'
    throttle_classes = [ScopedRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            logger.warning('Failed login attempt for "%s"', request.data.get(User.USERNAME_FIELD, 'unknown'))
            return error_response('Invalid credentials.', {'detail': ['No active account found with the given credentials.']}, status.HTTP_401_UNAUTHORIZED)

        data = serializer.validated_data
        logger.info('User logged in: %s', data.get('user', {}).get('id'))
        return success_response(
            message='Login successful.',
            data={
                'user': data['user'],
                'tokens': {'access': data['access'], 'refresh': data['refresh']},
            },
        )


class RefreshTokenView(TokenRefreshView):
    """POST /api/auth/refresh/ — exchange a refresh token for a new access token."""

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            return error_response('Invalid or expired refresh token.', {}, status.HTTP_401_UNAUTHORIZED)
        return success_response(message='Token refreshed.', data=serializer.validated_data)


class LogoutView(GenericAPIView):
    """POST /api/auth/logout/ — blacklist the provided refresh token."""

    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response('Logout failed.', serializer.errors, status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
        except TokenError:
            return error_response('Invalid or already-expired token.', {}, status.HTTP_400_BAD_REQUEST)

        logger.info('User logged out: user_id=%s', request.user.id)
        return success_response(message='Logged out successfully.')


class ProfileView(GenericAPIView):
    """GET/PUT /api/auth/profile/ — view or update the authenticated user's profile."""

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return success_response(message='Profile retrieved.', data=self.get_serializer(request.user).data)

    def put(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response('Profile update failed.', serializer.errors, status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return success_response(message='Profile updated successfully.', data=serializer.data)


class ChangePasswordView(GenericAPIView):
    """POST /api/auth/change-password/ — change password while authenticated."""

    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response('Password change failed.', serializer.errors, status.HTTP_400_BAD_REQUEST)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        logger.info('Password changed for user_id=%s', request.user.id)
        return success_response(message='Password changed successfully.')


class ForgotPasswordView(GenericAPIView):
    """POST /api/auth/forgot-password/ — email a password reset link."""

    serializer_class = ForgotPasswordSerializer
    permission_classes = [AllowAny]
    throttle_scope = 'password_reset'
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response('Request failed.', serializer.errors, status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        user = User.objects.filter(email__iexact=email).first()
        if user:
            uid, token = build_uid_and_token(user)
            send_password_reset_email(user, uid, token)

        return success_response(message='If an account with that email exists, a reset link has been sent.')


class ResetPasswordView(GenericAPIView):
    """POST /api/auth/reset-password/ — complete a password reset with uid + token."""

    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]
    throttle_scope = 'password_reset'
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response('Password reset failed.', serializer.errors, status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        logger.info('Password reset completed for user_id=%s', user.id)
        return success_response(message='Password has been reset successfully. You can now log in.')
