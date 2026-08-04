from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.common.models import TimeStampedModel


class Testimonial(TimeStampedModel):
    customer_name = models.CharField(max_length=150)
    image = models.ImageField(upload_to='testimonials/%Y/%m/', blank=True, null=True)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review = models.TextField()
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'testimonials'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['is_active'])]

    def __str__(self):
        return f'{self.customer_name} ({self.rating}★)'
