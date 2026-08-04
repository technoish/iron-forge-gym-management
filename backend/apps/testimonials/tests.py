from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Testimonial

User = get_user_model()


class TestimonialAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin4', email='admin4@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.url = reverse('testimonial-list')

    def test_create_requires_valid_rating(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {'customer_name': 'Jordan', 'rating': 9, 'review': 'Great gym!'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_create_testimonial(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {'customer_name': 'Jordan', 'rating': 5, 'review': 'Great gym!'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Testimonial.objects.count(), 1)

    def test_inactive_testimonial_hidden_from_public(self):
        Testimonial.objects.create(customer_name='Hidden', rating=3, review='meh', is_active=False)
        response = self.client.get(self.url)
        names = [t['customer_name'] for t in response.data['data']]
        self.assertNotIn('Hidden', names)
