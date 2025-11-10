# Inicializar Base de Datos

## Pasos para crear la base de datos

1. **Activa el entorno virtual:**
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # o
   source venv/bin/activate  # Linux/Mac
   ```

2. **Realiza las migraciones:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Crea un superusuario:**
   ```bash
   python manage.py createsuperuser
   ```
   - Usuario: admin
   - Email: admin@condominio.com
   - Contraseña: admin123 (o la que prefieras)

4. **Inicializa datos de ejemplo:**
   ```bash
   python init_db.py
   ```

Este script creará:
- 8 apartamentos de ejemplo
- 6 usuarios de ejemplo
- Varios pagos de ejemplo
- Varios gastos de ejemplo

## Verificar que todo funciona

1. Inicia el servidor:
   ```bash
   python manage.py runserver
   ```

2. Accede al admin:
   - URL: http://127.0.0.1:8000/admin
   - Usuario: admin
   - Contraseña: (la que creaste)

3. Verifica los datos en el admin o usando la API:
   - http://127.0.0.1:8000/api/apartamentos/
   - http://127.0.0.1:8000/api/pagos/
   - http://127.0.0.1:8000/api/gastos/
   - http://127.0.0.1:8000/api/usuarios/

## Nota

Si quieres limpiar y reinicializar la base de datos, puedes:
1. Eliminar `db.sqlite3`
2. Ejecutar las migraciones de nuevo
3. Ejecutar `init_db.py` de nuevo


