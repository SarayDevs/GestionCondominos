from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    ApartamentoViewSet,
    UsuarioViewSet,
    PagoViewSet,
    GastoViewSet,
    dashboard_stats
)

router = DefaultRouter()
router.register(r'apartamentos', ApartamentoViewSet, basename='apartamento')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'pagos', PagoViewSet, basename='pago')
router.register(r'gastos', GastoViewSet, basename='gasto')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', obtain_auth_token, name='api_token_auth'),
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
]


