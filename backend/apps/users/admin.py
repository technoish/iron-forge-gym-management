from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.html import format_html

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('username', 'email', 'full_name', 'role', 'is_active', 'profile_preview', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')

    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Gym Profile', {'fields': ('phone', 'profile_image', 'role')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    @admin.display(description='Full Name')
    def full_name(self, obj):
        return obj.get_full_name() or '—'

    @admin.display(description='Photo')
    def profile_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" style="height:36px;width:36px;border-radius:50%;object-fit:cover;" />', obj.profile_image.url)
        return '—'
