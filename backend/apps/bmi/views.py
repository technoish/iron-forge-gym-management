"""POST /api/bmi/ — stateless BMI calculator, open to any client."""
from drf_spectacular.utils import extend_schema
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny

from apps.common.response import error_response, success_response

from .serializers import BMIRequestSerializer, BMIResponseSerializer
from .services import calculate_bmi, get_bmi_category


class BMICalculatorView(GenericAPIView):
    serializer_class = BMIRequestSerializer
    permission_classes = [AllowAny]

    @extend_schema(request=BMIRequestSerializer, responses=BMIResponseSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response('Invalid height or weight.', serializer.errors, 400)

        height = serializer.validated_data['height']
        weight = serializer.validated_data['weight']

        bmi = calculate_bmi(height, weight)
        category_info = get_bmi_category(bmi)

        return success_response(
            message='BMI calculated successfully.',
            data={'bmi': bmi, **category_info},
        )
