from django.db import models

from apps.common.models import TimeStampedModel


class Service(TimeStampedModel):
    title = models.CharField(max_length=150)
    image = models.ImageField(upload_to='services/%Y/%m/', blank=True, null=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon key rendered by the frontend, e.g. "dumbbell".')
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'services'
        ordering = ['title']
        indexes = [models.Index(fields=['is_active'])]

    def __str__(self):
        return self.title
