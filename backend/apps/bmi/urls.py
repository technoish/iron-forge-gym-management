from django.urls import path

from .views import BMICalculatorView

urlpatterns = [
    path('', BMICalculatorView.as_view(), name='bmi-calculate'),
]
