from django.contrib import admin
from django.utils.html import format_html

from .models import GalleryImage


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'image_preview', 'uploaded_at')
    list_filter = ('category', 'uploaded_at')
    search_fields = ('title',)
    ordering = ('-uploaded_at',)
    readonly_fields = ('uploaded_at', 'image_preview')
    list_per_page = 30

    @admin.display(description='Preview')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:48px;width:48px;border-radius:8px;object-fit:cover;" />', obj.image.url)
        return '—'
