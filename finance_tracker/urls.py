# finance_tracker/urls.py
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Redirect root to /api/
    path('', lambda request: redirect('api/')), 
    
    path('admin/', admin.site.urls),
    
    # Djoser URLs for user registration, login, etc.
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # Simple JWT token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # This includes all API endpoints from the 'tracker' app, including subscriptions.
    path('api/', include('tracker.urls')),
]