from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Apartamento, Usuario, Pago, Gasto
from .serializers import (
    ApartamentoSerializer,
    UsuarioSerializer,
    PagoSerializer,
    GastoSerializer
)


class ApartamentoViewSet(viewsets.ModelViewSet):
    queryset = Apartamento.objects.all()
    serializer_class = ApartamentoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def morosos(self, request):
        """Retorna solo los apartamentos morosos"""
        morosos = self.queryset.filter(estado='Moroso')
        serializer = self.get_serializer(morosos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def historial_pagos(self, request, pk=None):
        """Retorna el historial de pagos de un apartamento"""
        apartamento = self.get_object()
        pagos = Pago.objects.filter(apartamento=apartamento).order_by('-fecha_pago')
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pago = serializer.save()
        # Actualizar saldo del apartamento
        apartamento = pago.apartamento
        if pago.estado == 'Pagado':
            apartamento.saldo += pago.monto
        apartamento.save()

    @action(detail=False, methods=['get'])
    def resumen_mensual(self, request):
        """Retorna resumen de pagos por mes"""
        meses_nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        meses = []
        hoy = timezone.now()
        for i in range(5, -1, -1):  # Últimos 6 meses
            fecha = hoy - timedelta(days=30*i)
            mes_nombre = meses_nombres[fecha.month - 1]
            total = Pago.objects.filter(
                fecha_pago__year=fecha.year,
                fecha_pago__month=fecha.month,
                estado='Pagado'
            ).aggregate(total=Sum('monto'))['total'] or 0
            meses.append({'mes': mes_nombre, 'total': float(total)})
        return Response(meses)

    @action(detail=False, methods=['get'])
    def por_metodo(self, request):
        """Retorna pagos agrupados por método de pago"""
        metodos = Pago.objects.values('metodo_pago').annotate(
            total=Sum('monto'),
            cantidad=Count('id')
        )
        return Response(list(metodos))

    @action(detail=False, methods=['get'])
    def por_apartamento(self, request):
        """Retorna pagos agrupados por apartamento"""
        pagos_por_apto = Pago.objects.values('apartamento__numero').annotate(
            total=Sum('monto'),
            cantidad=Count('id')
        ).order_by('-total')
        return Response(list(pagos_por_apto))


class GastoViewSet(viewsets.ModelViewSet):
    queryset = Gasto.objects.all()
    serializer_class = GastoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def por_categoria(self, request):
        """Retorna gastos agrupados por categoría"""
        gastos_por_cat = self.queryset.values('categoria').annotate(
            total=Sum('monto'),
            cantidad=Count('id')
        )
        return Response(list(gastos_por_cat))

    @action(detail=False, methods=['get'])
    def resumen_mensual(self, request):
        """Retorna resumen de gastos por mes"""
        meses_nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        meses = []
        hoy = timezone.now()
        for i in range(5, -1, -1):  # Últimos 6 meses
            fecha = hoy - timedelta(days=30*i)
            mes_nombre = meses_nombres[fecha.month - 1]
            total = Gasto.objects.filter(
                fecha_gasto__year=fecha.year,
                fecha_gasto__month=fecha.month,
                estado='Pagado'
            ).aggregate(total=Sum('monto'))['total'] or 0
            meses.append({'mes': mes_nombre, 'total': float(total)})
        return Response(meses)

    @action(detail=False, methods=['get'])
    def por_proveedor(self, request):
        """Retorna gastos agrupados por proveedor"""
        gastos_por_prov = self.queryset.values('proveedor').annotate(
            total=Sum('monto'),
            cantidad=Count('id')
        ).order_by('-total')[:10]
        return Response(list(gastos_por_prov))

    @action(detail=False, methods=['get'])
    def por_estado(self, request):
        """Retorna gastos agrupados por estado"""
        gastos_por_estado = self.queryset.values('estado').annotate(
            total=Sum('monto'),
            cantidad=Count('id')
        )
        return Response(list(gastos_por_estado))


# Vista para estadísticas del dashboard
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Retorna estadísticas generales para el dashboard"""
    total_ingresos = Pago.objects.filter(estado='Pagado').aggregate(
        total=Sum('monto')
    )['total'] or 0
    
    total_egresos = Gasto.objects.filter(estado='Pagado').aggregate(
        total=Sum('monto')
    )['total'] or 0
    
    saldo_neto = float(total_ingresos) - float(total_egresos)
    
    morosos_count = Apartamento.objects.filter(estado='Moroso').count()
    
    return Response({
        'saldo_neto': saldo_neto,
        'total_ingresos': float(total_ingresos),
        'total_egresos': float(total_egresos),
        'apartamentos_morosos': morosos_count,
    })

