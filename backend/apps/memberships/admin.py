from django.contrib import admin

from .models import MembershipPlan


@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('plan_name', 'price', 'duration', 'is_popular', 'is_active', 'created_at')
    list_filter = ('duration', 'is_popular', 'is_active')
    search_fields = ('plan_name', 'description')
    ordering = ('price',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 25
