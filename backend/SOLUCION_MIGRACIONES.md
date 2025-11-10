# Solución: Error "no such table: api_apartamento"

## Problema
Las tablas no existen en la base de datos porque las migraciones no se han aplicado correctamente.

## Solución Rápida (Windows)

### Opción 1: Usar el script automático (RECOMENDADO)
```bash
cd backend
fix_migrations.bat
```

Este script:
1. Elimina migraciones anteriores
2. Elimina la base de datos
3. Crea nuevas migraciones
4. Aplica las migraciones
5. Crea el usuario admin
6. Carga datos de ejemplo

### Opción 2: Manual paso a paso

1. **Eliminar la base de datos existente:**
```bash
cd backend
del db.sqlite3
```

2. **Eliminar migraciones anteriores (opcional):**
```bash
del api\migrations\*.py
```
(No elimines `__init__.py`)

3. **Crear las migraciones:**
```bash
python manage.py makemigrations api
```

Deberías ver:
```
Migrations for 'api':
  api\migrations\0001_initial.py
    - Create model Apartamento
    - Create model Usuario
    - Create model Pago
    - Create model Gasto
```

4. **Aplicar las migraciones:**
```bash
python manage.py migrate
```

Deberías ver:
```
Operations to perform:
  Apply all migrations: admin, api, auth, authtoken, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
  ...
```

5. **Crear superusuario:**
```bash
python manage.py createsuperuser
```
- Usuario: admin
- Email: admin@condominio.com
- Contraseña: admin123

6. **Cargar datos de ejemplo:**
```bash
python init_db.py
```

## Verificar que funcionó

1. **Iniciar el servidor:**
```bash
python manage.py runserver
```

2. **Acceder al admin:**
- URL: http://127.0.0.1:8000/admin
- Usuario: admin
- Contraseña: admin123

3. **Verificar que aparecen las tablas:**
- Deberías ver: Apartamentos, Usuarios, Pagos, Gastos en el admin

4. **Verificar en la API:**
- http://127.0.0.1:8000/api/apartamentos/ (requiere autenticación)

## Si sigue sin funcionar

1. **Verificar que estás en el directorio correcto:**
```bash
cd backend
python manage.py showmigrations api
```

Deberías ver:
```
api
 [X] 0001_initial
```

2. **Verificar que la app 'api' está en INSTALLED_APPS:**
Abre `condominio_backend/settings.py` y verifica que tiene:
```python
INSTALLED_APPS = [
    ...
    'api',
]
```

3. **Verificar la estructura de carpetas:**
```
backend/
  ├── api/
  │   ├── migrations/
  │   │   ├── __init__.py
  │   │   └── 0001_initial.py
  │   ├── models.py
  │   └── ...
  ├── condominio_backend/
  ├── manage.py
  └── db.sqlite3
```

## Comando único para todo (Windows)

Crea un archivo `setup.bat`:
```batch
@echo off
cd /d %~dp0
del db.sqlite3 2>nul
python manage.py makemigrations api
python manage.py migrate
python manage.py createsuperuser --username admin --email admin@condominio.com --noinput
python -c "import django; django.setup(); from django.contrib.auth.models import User; u = User.objects.get(username='admin'); u.set_password('admin123'); u.save()"
python init_db.py
echo.
echo Base de datos configurada!
echo Usuario: admin
echo Contraseña: admin123
pause
```

Ejecuta: `setup.bat`

## Notas importantes

- **Siempre ejecuta `makemigrations` antes de `migrate`**
- **Si cambias los modelos, vuelve a ejecutar `makemigrations`**
- **No edites manualmente los archivos de migración** (excepto si sabes lo que haces)
- **El archivo `db.sqlite3` se crea automáticamente** cuando ejecutas `migrate`


