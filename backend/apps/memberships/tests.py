from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import MembershipPlan

User = get_user_model()


class MembershipPlanAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin2', email='admin2@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.plan = MembershipPlan.objects.create(
            plan_name='Premium', duration='monthly', price=Decimal('59.00'), features=['24/7 access'],
        )
        self.url = reverse('membership-plan-list')

    def test_list_plans_public(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_create_requires_admin(self):
        response = self.client.post(self.url, {
            'plan_name': 'Elite', 'duration': 'monthly', 'price': '99.00', 'features': ['Coaching'],
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_create_plan(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {
            'plan_name': 'Elite', 'duration': 'monthly', 'price': '99.00', 'features': ['Coaching'],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_features_type_rejected(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {
            'plan_name': 'Bad Plan', 'duration': 'monthly', 'price': '10.00', 'features': 'not-a-list',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_negative_price_rejected(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {
            'plan_name': 'Bad Price', 'duration': 'monthly', 'price': '-5.00', 'features': [],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
