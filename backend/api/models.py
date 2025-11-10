from django.db import models
from django.contrib.auth.models import User


class Apartamento(models.Model):
    numero = models.IntegerField(unique=True)
    propietario = models.CharField(max_length=200)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('Al Día', 'Al Día'),
            ('Moroso', 'Moroso'),
            ('A Favor', 'A Favor'),
        ],
        default='Al Día'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['numero']

    def __str__(self):
        return f"Apartamento {self.numero} - {self.propietario}"


class Usuario(models.Model):
    nombre = models.CharField(max_length=200)
    apartamento = models.ForeignKey(Apartamento, on_delete=models.CASCADE, related_name='usuarios')
    rol = models.CharField(
        max_length=20,
        choices=[
            ('Propietario', 'Propietario'),
            ('Arrendatario', 'Arrendatario'),
            ('Residente', 'Residente'),
        ]
    )
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.apartamento.numero}"


class Pago(models.Model):
    apartamento = models.ForeignKey(Apartamento, on_delete=models.CASCADE, related_name='pagos')
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pago = models.DateField()
    metodo_pago = models.CharField(
        max_length=20,
        choices=[
            ('transferencia', 'Transferencia'),
            ('efectivo', 'Efectivo'),
            ('pse', 'PSE'),
            ('otro', 'Otro'),
        ],
        default='transferencia'
    )
    referencia = models.CharField(max_length=200, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=[
            ('Pagado', 'Pagado'),
            ('Pendiente', 'Pendiente'),
        ],
        default='Pagado'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha_pago', '-created_at']

    def __str__(self):
        return f"Pago {self.id} - Apt {self.apartamento.numero} - ${self.monto}"


class Gasto(models.Model):
    concepto = models.CharField(max_length=200)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_gasto = models.DateField()
    proveedor = models.CharField(max_length=200)
    categoria = models.CharField(
        max_length=50,
        choices=[
            ('Mantenimiento', 'Mantenimiento'),
            ('Servicios Básicos', 'Servicios Básicos'),
            ('Salarios', 'Salarios'),
            ('Inversión', 'Inversión'),
            ('Otros', 'Otros'),
        ],
        default='Otros'
    )
    estado = models.CharField(
        max_length=20,
        choices=[
            ('Pagado', 'Pagado'),
            ('Pendiente', 'Pendiente'),
        ],
        default='Pendiente'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-fecha_gasto', '-created_at']

    def __str__(self):
        return f"{self.concepto} - ${self.monto}"


