from django.contrib import admin
from .models import Apartamento, Usuario, Pago, Gasto


@admin.register(Apartamento)
class ApartamentoAdmin(admin.ModelAdmin):
    list_display = ['numero', 'propietario', 'saldo', 'estado']
    list_filter = ['estado']
    search_fields = ['numero', 'propietario']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apartamento', 'rol', 'email']
    list_filter = ['rol']
    search_fields = ['nombre', 'email']


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ['id', 'apartamento', 'monto', 'fecha_pago', 'estado']
    list_filter = ['estado', 'metodo_pago', 'fecha_pago']
    search_fields = ['apartamento__numero', 'referencia']


@admin.register(Gasto)
class GastoAdmin(admin.ModelAdmin):
    list_display = ['concepto', 'monto', 'categoria', 'fecha_gasto', 'estado']
    list_filter = ['categoria', 'estado', 'fecha_gasto']
    search_fields = ['concepto', 'proveedor']


