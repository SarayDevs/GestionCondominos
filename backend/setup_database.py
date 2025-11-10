#!/usr/bin/env python
"""
Script completo para configurar la base de datos desde cero
Ejecutar: python setup_database.py
"""
import os
import sys
import django
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'condominio_backend.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.db import connection
import sqlite3

def setup_database():
    print("=" * 60)
    print("Configurando Base de Datos - Sistema de Condominio")
    print("=" * 60)
    
    # 1. Eliminar base de datos existente si hay problemas
    db_path = BASE_DIR / 'db.sqlite3'
    if db_path.exists():
        print(f"\n1. Base de datos existente encontrada: {db_path}")
        respuesta = input("   ¿Deseas eliminar y recrear la base de datos? (s/n): ")
        if respuesta.lower() == 's':
            db_path.unlink()
            print("   ✓ Base de datos eliminada")
        else:
            print("   → Manteniendo base de datos existente")
    
    # 2. Crear migraciones
    print("\n2. Creando migraciones...")
    try:
        execute_from_command_line(['manage.py', 'makemigrations', 'api'])
        print("   ✓ Migraciones creadas")
    except Exception as e:
        print(f"   ✗ Error creando migraciones: {e}")
        return False
    
    # 3. Aplicar migraciones
    print("\n3. Aplicando migraciones...")
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("   ✓ Migraciones aplicadas")
    except Exception as e:
        print(f"   ✗ Error aplicando migraciones: {e}")
        return False
    
    # 4. Verificar que las tablas existen
    print("\n4. Verificando tablas creadas...")
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'api_%';")
        tables = cursor.fetchall()
        if tables:
            print(f"   ✓ Tablas encontradas: {len(tables)}")
            for table in tables:
                print(f"     - {table[0]}")
        else:
            print("   ✗ No se encontraron tablas")
            return False
    
    # 5. Crear superusuario si no existe
    print("\n5. Verificando superusuario...")
    from django.contrib.auth.models import User
    if not User.objects.filter(username='admin').exists():
        print("   → Creando usuario admin...")
        User.objects.create_superuser('admin', 'admin@condominio.com', 'admin123')
        print("   ✓ Usuario admin creado (usuario: admin, contraseña: admin123)")
    else:
        print("   ✓ Usuario admin ya existe")
    
    # 6. Cargar datos de ejemplo
    print("\n6. Cargando datos de ejemplo...")
    try:
        from init_db import init_database
        init_database()
        print("   ✓ Datos de ejemplo cargados")
    except Exception as e:
        print(f"   ⚠ Error cargando datos de ejemplo: {e}")
        print("   → Puedes ejecutar 'python init_db.py' después")
    
    print("\n" + "=" * 60)
    print("✓ Base de datos configurada correctamente!")
    print("=" * 60)
    print("\nPróximos pasos:")
    print("1. Inicia el servidor: python manage.py runserver")
    print("2. Accede al admin: http://127.0.0.1:8000/admin")
    print("3. Login: admin / admin123")
    print("\n")
    
    return True

if __name__ == '__main__':
    try:
        setup_database()
    except KeyboardInterrupt:
        print("\n\nOperación cancelada por el usuario")
    except Exception as e:
        print(f"\n\nError: {e}")
        import traceback
        traceback.print_exc()


