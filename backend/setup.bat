@echo off
echo ========================================
echo Configurando Base de Datos Completa
echo ========================================
echo.

cd /d %~dp0

echo [1/6] Eliminando base de datos anterior...
if exist db.sqlite3 (
    del db.sqlite3
    echo    OK: Base de datos eliminada
) else (
    echo    OK: No habia base de datos anterior
)

echo.
echo [2/6] Eliminando migraciones anteriores de api...
if exist api\migrations\0001_initial.py del api\migrations\0001_initial.py
if exist api\migrations\0002_*.py del api\migrations\0002_*.py
if exist api\migrations\0003_*.py del api\migrations\0003_*.py
echo    OK: Migraciones anteriores eliminadas

echo.
echo [3/6] Creando migraciones nuevas...
python manage.py makemigrations api
if errorlevel 1 (
    echo    ERROR: No se pudieron crear las migraciones
    echo    Verifica que estes en el directorio backend y que Django este instalado
    pause
    exit /b 1
)
echo    OK: Migraciones creadas

echo.
echo [4/6] Aplicando migraciones a la base de datos...
python manage.py migrate
if errorlevel 1 (
    echo    ERROR: No se pudieron aplicar las migraciones
    pause
    exit /b 1
)
echo    OK: Migraciones aplicadas

echo.
echo [5/6] Creando usuario administrador...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() and User.objects.get(username='admin').delete() or None; User.objects.create_superuser('admin', 'admin@condominio.com', 'admin123')"
if errorlevel 1 (
    echo    AVISO: Error al crear usuario, intentando metodo alternativo...
    python -c "import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'condominio_backend.settings'); django.setup(); from django.contrib.auth.models import User; u, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@condominio.com'}); u.set_password('admin123'); u.is_superuser = True; u.is_staff = True; u.save(); print('Usuario admin creado/actualizado')"
)
echo    OK: Usuario admin configurado (admin/admin123)

echo.
echo [6/6] Cargando datos de ejemplo...
python init_db.py
if errorlevel 1 (
    echo    AVISO: Error al cargar datos de ejemplo
    echo    Puedes ejecutar 'python init_db.py' manualmente despues
) else (
    echo    OK: Datos de ejemplo cargados
)

echo.
echo ========================================
echo CONFIGURACION COMPLETA!
echo ========================================
echo.
echo Usuario: admin
echo Password: admin123
echo.
echo Inicia el servidor con:
echo   python manage.py runserver
echo.
echo Luego accede a:
echo   http://127.0.0.1:8000/admin
echo.
pause


