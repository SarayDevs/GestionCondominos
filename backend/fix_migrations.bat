@echo off
echo ========================================
echo Configurando Base de Datos
echo ========================================
echo.

cd /d %~dp0

echo 1. Eliminando migraciones anteriores...
if exist api\migrations\*.py (
    del /q api\migrations\*.py
    echo    Migraciones eliminadas (excepto __init__.py)
)

echo.
echo 2. Eliminando base de datos anterior...
if exist db.sqlite3 (
    del db.sqlite3
    echo    Base de datos eliminada
)

echo.
echo 3. Creando migraciones...
python manage.py makemigrations api
if errorlevel 1 (
    echo    ERROR: No se pudieron crear las migraciones
    pause
    exit /b 1
)

echo.
echo 4. Aplicando migraciones...
python manage.py migrate
if errorlevel 1 (
    echo    ERROR: No se pudieron aplicar las migraciones
    pause
    exit /b 1
)

echo.
echo 5. Creando superusuario...
echo    (Presiona Enter para usar valores por defecto: admin/admin123)
python manage.py createsuperuser --username admin --email admin@condominio.com --noinput
if errorlevel 1 (
    echo    Usuario admin puede que ya exista, continuando...
)

echo.
echo 6. Configurando contraseña del admin...
python -c "import django; django.setup(); from django.contrib.auth.models import User; u = User.objects.get(username='admin'); u.set_password('admin123'); u.save(); print('Contraseña configurada')"

echo.
echo 7. Cargando datos de ejemplo...
python init_db.py

echo.
echo ========================================
echo Base de datos configurada correctamente!
echo ========================================
echo.
echo Inicia el servidor con: python manage.py runserver
echo.
pause


