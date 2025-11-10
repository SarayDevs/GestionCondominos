@echo off
echo ========================================
echo Verificando Estado de las Migraciones
echo ========================================
echo.

cd /d %~dp0

echo 1. Verificando migraciones de la app 'api'...
python manage.py showmigrations api
echo.

echo 2. Verificando si existe la base de datos...
if exist db.sqlite3 (
    echo    OK: Base de datos existe
    echo.
    echo 3. Verificando tablas en la base de datos...
    python -c "import sqlite3; conn = sqlite3.connect('db.sqlite3'); cursor = conn.cursor(); cursor.execute(\"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'api_%'\"); tables = cursor.fetchall(); print('   Tablas encontradas:'); [print(f'     - {t[0]}') for t in tables] if tables else print('     ERROR: No se encontraron tablas api_*'); conn.close()"
) else (
    echo    ERROR: Base de datos no existe
    echo    Ejecuta: python manage.py migrate
)
echo.

echo 4. Verificando modelos...
python manage.py shell -c "from api.models import Apartamento, Usuario, Pago, Gasto; print(f'   Apartamentos: {Apartamento.objects.count()}'); print(f'   Usuarios: {Usuario.objects.count()}'); print(f'   Pagos: {Pago.objects.count()}'); print(f'   Gastos: {Gasto.objects.count()}')"
echo.

echo ========================================
pause


