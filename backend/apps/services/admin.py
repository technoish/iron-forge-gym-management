from django.contrib import admin
from django.utils.html import format_html

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'is_active', 'image_preview', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    ordering = ('title',)
    readonly_fields = ('created_at', 'updated_at', 'image_preview')
    list_per_page = 25

    @admin.display(description='Preview')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:44px;width:44px;border-radius:8px;object-fit:cover;" />', obj.image.url)
        return '—'
