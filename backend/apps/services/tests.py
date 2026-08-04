from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Service

User = get_user_model()


class ServiceAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin3', email='admin3@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.service = Service.objects.create(title='Strength Training', icon='dumbbell')
        self.url = reverse('service-list')

    def test_public_can_list_services(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_member_cannot_delete_service(self):
        member = User.objects.create_user(username='m3', email='m3@example.com', password='StrongPass1!')
        self.client.force_authenticate(user=member)
        response = self.client.delete(reverse('service-detail', args=[self.service.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_update_service(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(reverse('service-detail', args=[self.service.id]), {'title': 'Updated Title'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.service.refresh_from_db()
        self.assertEqual(self.service.title, 'Updated Title')
