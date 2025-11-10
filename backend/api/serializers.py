from rest_framework import serializers
from .models import Apartamento, Usuario, Pago, Gasto


class ApartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartamento
        fields = ['id', 'numero', 'propietario', 'saldo', 'estado', 'created_at', 'updated_at']


class UsuarioSerializer(serializers.ModelSerializer):
    apartamento_details = ApartamentoSerializer(source='apartamento', read_only=True)
    
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apartamento', 'apartamento_details', 'rol', 'email', 'created_at', 'updated_at']


class PagoSerializer(serializers.ModelSerializer):
    apartamento_details = ApartamentoSerializer(source='apartamento', read_only=True)
    
    class Meta:
        model = Pago
        fields = ['id', 'apartamento', 'apartamento_details', 'monto', 'fecha_pago', 'metodo_pago', 'referencia', 'estado', 'created_at', 'updated_at']


class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = ['id', 'concepto', 'monto', 'fecha_gasto', 'proveedor', 'categoria', 'estado', 'created_at', 'updated_at']


