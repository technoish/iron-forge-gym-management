from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Trainer

User = get_user_model()


class TrainerAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin1', email='admin1@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.member = User.objects.create_user(
            username='member1', email='member1@example.com', password='StrongPass1!', role=User.Role.MEMBER,
        )
        self.trainer = Trainer.objects.create(
            name='Marcus Reid', specialization='Strength', experience='9 yrs', is_active=True,
        )
        self.inactive_trainer = Trainer.objects.create(
            name='Hidden Coach', specialization='Cardio', experience='1 yr', is_active=False,
        )
        self.list_url = reverse('trainer-list')

    def test_public_list_only_shows_active_trainers(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [t['name'] for t in response.data['data']]
        self.assertIn('Marcus Reid', names)
        self.assertNotIn('Hidden Coach', names)

    def test_admin_sees_inactive_trainers_too(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_url)
        names = [t['name'] for t in response.data['data']]
        self.assertIn('Hidden Coach', names)

    def test_member_cannot_create_trainer(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.post(self.list_url, {'name': 'New Coach', 'specialization': 'Yoga', 'experience': '2 yrs'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_trainer(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.list_url, {'name': 'New Coach', 'specialization': 'Yoga', 'experience': '2 yrs'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(Trainer.objects.filter(name='New Coach').count(), 1)

    def test_anonymous_cannot_create_trainer(self):
        response = self.client.post(self.list_url, {'name': 'New Coach', 'specialization': 'Yoga', 'experience': '2 yrs'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_trainer(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('trainer-detail', args=[self.trainer.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Trainer.objects.filter(id=self.trainer.id).exists())

    def test_search_by_name(self):
        response = self.client.get(self.list_url, {'search': 'Marcus'})
        names = [t['name'] for t in response.data['data']]
        self.assertIn('Marcus Reid', names)
