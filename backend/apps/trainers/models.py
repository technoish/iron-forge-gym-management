from django.db import models

from apps.common.models import TimeStampedModel
from apps.common.validators import phone_validator


class Trainer(TimeStampedModel):
    name = models.CharField(max_length=150)
    image = models.ImageField(upload_to='trainers/%Y/%m/', blank=True, null=True)
    specialization = models.CharField(max_length=150)
    experience = models.CharField(max_length=50, help_text='e.g. "9 yrs experience"')
    certifications = models.TextField(blank=True, help_text='Comma-separated or free text.')
    description = models.TextField(blank=True)

    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True, validators=[phone_validator])

    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'trainers'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['is_active']), models.Index(fields=['specialization'])]

    def __str__(self):
        return self.name
