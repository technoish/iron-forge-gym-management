from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ContactMessage

User = get_user_model()


class ContactAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('contact-message-list')
        self.valid_payload = {
            'name': 'Alex Kim',
            'email': 'alex@example.com',
            'phone': '+1 555-0111',
            'subject': 'Membership question',
            'message': 'I would like to know more about your Elite plan.',
        }

    def test_anyone_can_submit_contact_message(self):
        response = self.client.post(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_short_message_rejected(self):
        response = self.client.post(self.url, {**self.valid_payload, 'message': 'Hi'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_email_rejected(self):
        response = self.client.post(self.url, {**self.valid_payload, 'email': 'not-an-email'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_anonymous_cannot_list_messages(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_list_messages(self):
        ContactMessage.objects.create(**{**self.valid_payload})
        admin = User.objects.create_user(
            username='admin6', email='admin6@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.client.force_authenticate(user=admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
