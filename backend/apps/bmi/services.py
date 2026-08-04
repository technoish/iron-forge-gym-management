"""
Business logic for BMI calculation, kept separate from the view/serializer
so it's independently unit-testable and reusable (e.g. from a future
member-progress-tracking feature).
"""

BMI_CATEGORIES = (
    (0, 18.5, 'Underweight', 'You are below a healthy weight range. Consider a structured strength program with a calorie surplus, and speak with a nutrition coach.'),
    (18.5, 25, 'Normal', 'Maintain your healthy lifestyle.'),
    (25, 30, 'Overweight', 'A mix of strength training and structured cardio, paired with a modest calorie deficit, is a proven path to a healthier range.'),
    (30, float('inf'), 'Obese', 'We recommend booking a free assessment with one of our coaches to build a safe, personalized training and nutrition plan.'),
)


def calculate_bmi(height_cm: float, weight_kg: float) -> float:
    """Returns BMI rounded to 2 decimal places. height_cm and weight_kg must be > 0."""
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 2)


def get_bmi_category(bmi: float) -> dict:
    """Returns {'category': str, 'health_tip': str} for a given BMI value."""
    for lower, upper, category, tip in BMI_CATEGORIES:
        if lower <= bmi < upper:
            return {'category': category, 'health_tip': tip}
    return {'category': 'Unknown', 'health_tip': 'Please consult a health professional.'}
