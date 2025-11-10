"""
URL configuration for condominio_backend project.
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "API Condominio activa"})),
    path('api/', include('api.urls')),
    path('auth/login/', obtain_auth_token, name='api_token_auth'),
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('admin/', admin.site.urls),
]


