from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .services import calculate_bmi, get_bmi_category


class BMIServiceTests(APITestCase):
    """Pure unit tests for the calculation logic, independent of HTTP."""

    def test_calculate_bmi_matches_known_value(self):
        self.assertEqual(calculate_bmi(170, 65), 22.49)

    def test_category_boundaries(self):
        self.assertEqual(get_bmi_category(18.4)['category'], 'Underweight')
        self.assertEqual(get_bmi_category(18.5)['category'], 'Normal')
        self.assertEqual(get_bmi_category(24.9)['category'], 'Normal')
        self.assertEqual(get_bmi_category(25)['category'], 'Overweight')
        self.assertEqual(get_bmi_category(29.9)['category'], 'Overweight')
        self.assertEqual(get_bmi_category(30)['category'], 'Obese')


class BMIAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('bmi-calculate')

    def test_bmi_calculation_success(self):
        response = self.client.post(self.url, {'height': 170, 'weight': 65})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['bmi'], 22.49)
        self.assertEqual(response.data['data']['category'], 'Normal')

    def test_missing_fields_rejected(self):
        response = self.client.post(self.url, {'height': 170})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_negative_weight_rejected(self):
        response = self.client.post(self.url, {'height': 170, 'weight': -65})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unrealistic_height_rejected(self):
        response = self.client.post(self.url, {'height': 5000, 'weight': 65})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_authentication_required(self):
        response = self.client.post(self.url, {'height': 180, 'weight': 80})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
