from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import GalleryImage

User = get_user_model()


def make_test_image():
    content = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00'
        b'\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    return SimpleUploadedFile('test.png', content, content_type='image/png')


class GalleryAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin5', email='admin5@example.com', password='StrongPass1!', role=User.Role.ADMIN,
        )
        self.url = reverse('gallery-image-list')

    def test_public_can_list_gallery(self):
        GalleryImage.objects.create(image=make_test_image(), title='Floor', category='floor')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_member_cannot_upload(self):
        member = User.objects.create_user(username='m5', email='m5@example.com', password='StrongPass1!')
        self.client.force_authenticate(user=member)
        response = self.client.post(self.url, {'image': make_test_image(), 'title': 'Floor', 'category': 'floor'}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_upload_requires_image(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {'title': 'No Image', 'category': 'floor'}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
