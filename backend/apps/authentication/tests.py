"""Tests covering registration, login, profile access, and password flows."""
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class RegisterTests(APITestCase):
    def setUp(self):
        self.url = reverse('authentication:register')
        self.valid_payload = {
            'username': 'johndoe',
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com',
            'phone': '+1 555-0100',
            'password': 'StrongPass1!',
            'password_confirm': 'StrongPass1!',
        }

    def test_register_success(self):
        response = self.client.post(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('tokens', response.data['data'])
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().role, User.Role.MEMBER)

    def test_register_duplicate_email_fails(self):
        User.objects.create_user(username='existing', email='john@example.com', password='StrongPass1!')
        response = self.client.post(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn('email', response.data['errors'])

    def test_register_password_mismatch_fails(self):
        payload = {**self.valid_payload, 'password_confirm': 'Different1!'}
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_weak_password_fails(self):
        payload = {**self.valid_payload, 'password': 'weak', 'password_confirm': 'weak'}
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='janedoe', email='jane@example.com', password='StrongPass1!',
        )
        self.url = reverse('authentication:login')

    def test_login_success(self):
        response = self.client.post(self.url, {'username': 'janedoe', 'password': 'StrongPass1!'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data']['tokens'])
        self.assertIn('refresh', response.data['data']['tokens'])

    def test_login_wrong_password_fails(self):
        response = self.client.post(self.url, {'username': 'janedoe', 'password': 'WrongPass1!'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['success'])


class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='memberuser', email='member@example.com', password='StrongPass1!',
        )
        self.url = reverse('authentication:profile')

    def test_profile_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_get_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['email'], 'member@example.com')

    def test_profile_update(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.url, {'first_name': 'Updated'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

    def test_cannot_escalate_role_via_profile_update(self):
        self.client.force_authenticate(user=self.user)
        self.client.put(self.url, {'role': 'admin'})
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, User.Role.MEMBER)


class ChangePasswordTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='pwuser', email='pw@example.com', password='OldPass1!',
        )
        self.url = reverse('authentication:change-password')
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        response = self.client.post(self.url, {
            'old_password': 'OldPass1!',
            'new_password': 'NewPass1!',
            'new_password_confirm': 'NewPass1!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewPass1!'))

    def test_change_password_wrong_old_password(self):
        response = self.client.post(self.url, {
            'old_password': 'WrongOld1!',
            'new_password': 'NewPass1!',
            'new_password_confirm': 'NewPass1!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ForgotPasswordTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='forgotuser', email='forgot@example.com', password='StrongPass1!',
        )

    def test_forgot_password_always_returns_generic_success(self):
        url = reverse('authentication:forgot-password')
        response_known = self.client.post(url, {'email': 'forgot@example.com'})
        response_unknown = self.client.post(url, {'email': 'nobody@example.com'})
        self.assertEqual(response_known.status_code, status.HTTP_200_OK)
        self.assertEqual(response_unknown.status_code, status.HTTP_200_OK)
        self.assertEqual(response_known.data['message'], response_unknown.data['message'])

    def test_reset_password_with_valid_token(self):
        from .serializers import build_uid_and_token
        uid, token = build_uid_and_token(self.user)
        url = reverse('authentication:reset-password')
        response = self.client.post(url, {
            'uid': uid, 'token': token,
            'new_password': 'BrandNew1!', 'new_password_confirm': 'BrandNew1!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('BrandNew1!'))

    def test_reset_password_with_invalid_token_fails(self):
        from django.utils.encoding import force_bytes
        from django.utils.http import urlsafe_base64_encode
        url = reverse('authentication:reset-password')
        response = self.client.post(url, {
            'uid': urlsafe_base64_encode(force_bytes(self.user.pk)),
            'token': 'invalid-token',
            'new_password': 'BrandNew1!', 'new_password_confirm': 'BrandNew1!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
