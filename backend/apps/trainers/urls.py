from rest_framework.routers import DefaultRouter

from .views import TrainerViewSet

router = DefaultRouter()
router.register('', TrainerViewSet, basename='trainer')

urlpatterns = router.urls
