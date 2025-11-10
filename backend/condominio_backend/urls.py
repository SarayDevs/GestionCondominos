"""
URL configuration for condominio_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse  # 👈 Import necesario
from rest_framework.authtoken.views import obtain_auth_token  # 👈 Import del login token
from api.views import dashboard_stats  # 👈 Import de la vista que creaste (ajústalo si está en otra parte)


urlpatterns = [
    path('', lambda request: JsonResponse({"message": "API Condominio activa"})),
    path('api/', include('api.urls')),
    path('auth/login/', obtain_auth_token, name='api_token_auth'),
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('admin/', admin.site.urls),
]


