from django.contrib import admin
from django.utils.html import format_html

from .models import Trainer


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'experience', 'is_active', 'image_preview', 'created_at')
    list_filter = ('is_active', 'specialization', 'created_at')
    search_fields = ('name', 'specialization', 'email', 'phone')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'image_preview')
    list_per_page = 25
    fieldsets = (
        (None, {'fields': ('name', 'image', 'image_preview', 'specialization', 'experience', 'is_active')}),
        ('Bio', {'fields': ('description', 'certifications')}),
        ('Contact', {'fields': ('email', 'phone', 'facebook', 'instagram', 'linkedin')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    @admin.display(description='Preview')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:48px;width:48px;border-radius:8px;object-fit:cover;" />', obj.image.url)
        return '—'
