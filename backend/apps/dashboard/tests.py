from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.trainers.models import Trainer

User = get_user_model()


class DashboardAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin7', email='admin7@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.member = User.objects.create_user(
            username='member7', email='member7@example.com', password='StrongPass1!', role=User.Role.MEMBER,
        )
        Trainer.objects.create(name='Coach A', specialization='Strength', experience='5 yrs')
        self.url = reverse('dashboard-stats')

    def test_dashboard_requires_admin(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_gets_stats(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['total_trainers'], 1)
        self.assertEqual(response.data['data']['total_members'], 1)
