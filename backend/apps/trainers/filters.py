import django_filters

from .models import Trainer


class TrainerFilter(django_filters.FilterSet):
    specialization = django_filters.CharFilter(field_name='specialization', lookup_expr='icontains')
    is_active = django_filters.BooleanFilter(field_name='is_active')

    class Meta:
        model = Trainer
        fields = ['specialization', 'is_active']
