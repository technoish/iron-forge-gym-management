from django.db import models


class GalleryImage(models.Model):
    class Category(models.TextChoices):
        FLOOR = 'floor', 'Gym Floor'
        CLASSES = 'classes', 'Classes'
        EQUIPMENT = 'equipment', 'Equipment'
        EVENTS = 'events', 'Events'
        FACILITY = 'facility', 'Facility'

    image = models.ImageField(upload_to='gallery/%Y/%m/')
    title = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.FLOOR, db_index=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'gallery_images'
        ordering = ['-uploaded_at']
        indexes = [models.Index(fields=['category'])]

    def __str__(self):
        return self.title or f'Gallery image #{self.pk}'
