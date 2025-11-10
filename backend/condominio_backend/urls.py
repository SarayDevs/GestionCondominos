"""
URL configuration for condominio_backend project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "API Condominio activa"})),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]


