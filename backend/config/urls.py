"""Root URL configuration — mounts every app under /api/*."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Feature apps
    path('api/auth/', include('apps.authentication.urls')),
    path('api/trainers/', include('apps.trainers.urls')),
    path('api/memberships/', include('apps.memberships.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/bmi/', include('apps.bmi.urls')),
    path('api/contact/', include('apps.contact.urls')),
    path('api/gallery/', include('apps.gallery.urls')),
    path('api/testimonials/', include('apps.testimonials.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = 'IronForge Gym Administration'
admin.site.site_title = 'IronForge Admin'
admin.site.index_title = 'Manage Gym Content'
