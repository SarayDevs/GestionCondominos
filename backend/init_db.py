#!/usr/bin/env python
"""
Script para inicializar la base de datos con datos de ejemplo
Ejecutar después de las migraciones: python init_db.py
"""
import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'condominio_backend.settings')
django.setup()

from api.models import Apartamento, Usuario, Pago, Gasto
from django.contrib.auth.models import User

def init_database():
    print("Inicializando base de datos con datos de ejemplo...")
    print("-" * 60)
    
    # Crear usuario admin si no existe o actualizar contraseña
    try:
        if User.objects.filter(username='admin').exists():
            admin_user = User.objects.get(username='admin')
            admin_user.set_password('admin123')
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.email = 'admin@condominio.com'
            admin_user.save()
            print("✓ Usuario admin actualizado (usuario: admin, contraseña: admin123)")
        else:
            User.objects.create_superuser('admin', 'admin@condominio.com', 'admin123')
            print("✓ Usuario admin creado (usuario: admin, contraseña: admin123)")
    except Exception as e:
        print(f"⚠ Error con usuario admin: {e}")
    
    # No limpiar datos existentes para no perder información
    # Si quieres limpiar, descomenta las siguientes líneas:
    # print("Limpiando datos existentes...")
    # Gasto.objects.all().delete()
    # Pago.objects.all().delete()
    # Usuario.objects.all().delete()
    # Apartamento.objects.all().delete()
    
    # Crear apartamentos
    apartamentos_data = [
        {'numero': 101, 'propietario': 'Juan Pérez', 'saldo': 0, 'estado': 'Al Día'},
        {'numero': 102, 'propietario': 'María López', 'saldo': -50000, 'estado': 'Moroso'},
        {'numero': 201, 'propietario': 'Carlos García', 'saldo': 0, 'estado': 'Al Día'},
        {'numero': 202, 'propietario': 'Ana Rodríguez', 'saldo': -250000, 'estado': 'Moroso'},
        {'numero': 301, 'propietario': 'Pedro Martínez', 'saldo': 100000, 'estado': 'A Favor'},
        {'numero': 302, 'propietario': 'Laura Sánchez', 'saldo': 0, 'estado': 'Al Día'},
        {'numero': 401, 'propietario': 'Roberto Silva', 'saldo': -150000, 'estado': 'Moroso'},
        {'numero': 402, 'propietario': 'Carmen Torres', 'saldo': 0, 'estado': 'Al Día'},
    ]
    
    apartamentos = []
    for apt_data in apartamentos_data:
        apt, created = Apartamento.objects.get_or_create(
            numero=apt_data['numero'],
            defaults=apt_data
        )
        apartamentos.append(apt)
        if created:
            print(f"✓ Apartamento {apt.numero} creado")
    
    # Crear usuarios
    usuarios_data = [
        {'nombre': 'Juan Pérez', 'apartamento': 101, 'rol': 'Propietario', 'email': 'juan.perez@example.com'},
        {'nombre': 'María López', 'apartamento': 102, 'rol': 'Propietario', 'email': 'maria.lopez@example.com'},
        {'nombre': 'Carlos García', 'apartamento': 201, 'rol': 'Arrendatario', 'email': 'carlos.garcia@example.com'},
        {'nombre': 'Ana Rodríguez', 'apartamento': 202, 'rol': 'Propietario', 'email': 'ana.rodriguez@example.com'},
        {'nombre': 'Pedro Martínez', 'apartamento': 301, 'rol': 'Propietario', 'email': 'pedro.martinez@example.com'},
        {'nombre': 'Laura Sánchez', 'apartamento': 302, 'rol': 'Residente', 'email': 'laura.sanchez@example.com'},
    ]
    
    for user_data in usuarios_data:
        apt = Apartamento.objects.get(numero=user_data['apartamento'])
        usuario, created = Usuario.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'nombre': user_data['nombre'],
                'apartamento': apt,
                'rol': user_data['rol']
            }
        )
        if created:
            print(f"✓ Usuario {usuario.nombre} creado")
    
    # Crear pagos
    hoy = date.today()
    pagos_data = [
        {'apartamento': 101, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=5), 'metodo_pago': 'transferencia', 'estado': 'Pagado'},
        {'apartamento': 101, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=35), 'metodo_pago': 'transferencia', 'estado': 'Pagado'},
        {'apartamento': 201, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=10), 'metodo_pago': 'efectivo', 'estado': 'Pagado'},
        {'apartamento': 301, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=3), 'metodo_pago': 'pse', 'estado': 'Pagado'},
        {'apartamento': 302, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=15), 'metodo_pago': 'transferencia', 'estado': 'Pagado'},
        {'apartamento': 102, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=20), 'metodo_pago': 'transferencia', 'estado': 'Pendiente'},
        {'apartamento': 401, 'monto': 500000, 'fecha_pago': hoy - timedelta(days=25), 'metodo_pago': 'efectivo', 'estado': 'Pendiente'},
    ]
    
    for pago_data in pagos_data:
        apt = Apartamento.objects.get(numero=pago_data['apartamento'])
        pago, created = Pago.objects.get_or_create(
            apartamento=apt,
            fecha_pago=pago_data['fecha_pago'],
            monto=pago_data['monto'],
            defaults={
                'metodo_pago': pago_data['metodo_pago'],
                'estado': pago_data['estado'],
                'referencia': f'Cuota {pago_data["fecha_pago"].strftime("%B %Y")}'
            }
        )
        if created:
            print(f"✓ Pago de ${pago.monto:,.0f} para apt {apt.numero} creado")
    
    # Crear gastos
    gastos_data = [
        {'concepto': 'Mantenimiento Ascensor', 'monto': 1500000, 'fecha_gasto': hoy - timedelta(days=10), 'proveedor': 'ServiLift', 'categoria': 'Mantenimiento', 'estado': 'Pagado'},
        {'concepto': 'Servicios Agua Común', 'monto': 350000, 'fecha_gasto': hoy - timedelta(days=5), 'proveedor': 'Acueducto S.A.', 'categoria': 'Servicios Básicos', 'estado': 'Pagado'},
        {'concepto': 'Limpieza Zonas Comunes', 'monto': 800000, 'fecha_gasto': hoy - timedelta(days=2), 'proveedor': 'CleanAll', 'categoria': 'Mantenimiento', 'estado': 'Pagado'},
        {'concepto': 'Arreglo Fachada', 'monto': 4000000, 'fecha_gasto': hoy - timedelta(days=40), 'proveedor': 'ConstruYa', 'categoria': 'Inversión', 'estado': 'Pagado'},
        {'concepto': 'Salario Administrador', 'monto': 2000000, 'fecha_gasto': hoy - timedelta(days=1), 'proveedor': 'Personal', 'categoria': 'Salarios', 'estado': 'Pagado'},
        {'concepto': 'Servicios de Luz', 'monto': 450000, 'fecha_gasto': hoy, 'proveedor': 'Energía S.A.', 'categoria': 'Servicios Básicos', 'estado': 'Pendiente'},
        {'concepto': 'Reparación Portón', 'monto': 1200000, 'fecha_gasto': hoy - timedelta(days=15), 'proveedor': 'Mantenimiento Pro', 'categoria': 'Mantenimiento', 'estado': 'Pagado'},
    ]
    
    for gasto_data in gastos_data:
        gasto, created = Gasto.objects.get_or_create(
            concepto=gasto_data['concepto'],
            fecha_gasto=gasto_data['fecha_gasto'],
            defaults=gasto_data
        )
        if created:
            print(f"✓ Gasto {gasto.concepto} de ${gasto.monto:,.0f} creado")
    
    print("\n✓ Base de datos inicializada correctamente!")
    print(f"✓ Total apartamentos: {Apartamento.objects.count()}")
    print(f"✓ Total usuarios: {Usuario.objects.count()}")
    print(f"✓ Total pagos: {Pago.objects.count()}")
    print(f"✓ Total gastos: {Gasto.objects.count()}")

if __name__ == '__main__':
    init_database()

