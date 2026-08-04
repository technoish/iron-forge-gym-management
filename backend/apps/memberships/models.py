from django.core.validators import MinValueValidator
from django.db import models

from apps.common.models import TimeStampedModel


class MembershipPlan(TimeStampedModel):
    class Duration(models.TextChoices):
        MONTHLY = 'monthly', 'Monthly'
        QUARTERLY = 'quarterly', 'Quarterly'
        YEARLY = 'yearly', 'Yearly'

    plan_name = models.CharField(max_length=100, unique=True)
    duration = models.CharField(max_length=20, choices=Duration.choices, default=Duration.MONTHLY)
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    description = models.TextField(blank=True)
    features = models.JSONField(default=list, blank=True, help_text='List of feature strings.')
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'membership_plans'
        ordering = ['price']
        indexes = [models.Index(fields=['is_active'])]

    def __str__(self):
        return f'{self.plan_name} (${self.price}/{self.duration})'
