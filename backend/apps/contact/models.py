from django.db import models

from apps.common.validators import phone_validator


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, validators=[phone_validator])
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_messages'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['email']), models.Index(fields=['created_at'])]

    def __str__(self):
        return f'{self.name} <{self.email}> — {self.subject or "No subject"}'
