from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# JWT views (already imported – good!)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Submissions endpoints first – so /api/submissions/ matches here
    path('api/', include('submissions.urls')),

    # Users endpoints (signup, etc.) after submissions
    path('api/users/', include('users.urls')),

    # JWT login endpoints (token obtain + refresh)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files (uploaded photos/videos) in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)