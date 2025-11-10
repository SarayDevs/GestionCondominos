# Backend Django - Sistema de Gestión de Condominio

## Instalación

1. Crear un entorno virtual:
```bash
python -m venv venv
```

2. Activar el entorno virtual:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Realizar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Crear un superusuario:
```bash
python manage.py createsuperuser
```
Sigue las instrucciones para crear un usuario administrador.

6. **Inicializar base de datos con datos de ejemplo:**
```bash
python init_db.py
```
Este script creará:
- Usuario admin (usuario: admin, contraseña: admin123)
- 8 apartamentos de ejemplo
- 6 usuarios de ejemplo
- Varios pagos y gastos de ejemplo

7. Ejecutar el servidor:
```bash
python manage.py runserver
```

El servidor estará disponible en `http://127.0.0.1:8000`

**Nota:** Si ya ejecutaste `init_db.py`, puedes iniciar sesión con:
- Usuario: `admin`
- Contraseña: `admin123`

## Endpoints API

- `POST /api/auth/login/` - Autenticación (retorna token)
- `GET /api/apartamentos/` - Lista de apartamentos
- `GET /api/apartamentos/morosos/` - Apartamentos morosos
- `GET /api/apartamentos/{id}/historial_pagos/` - Historial de pagos
- `GET /api/pagos/` - Lista de pagos
- `GET /api/pagos/resumen_mensual/` - Resumen mensual de pagos
- `GET /api/gastos/` - Lista de gastos
- `GET /api/gastos/por_categoria/` - Gastos por categoría
- `GET /api/dashboard/stats/` - Estadísticas del dashboard

## Configuración de Base de Datos

Por defecto usa SQLite. Para cambiar a MySQL, edita `condominio_backend/settings.py` y descomenta la configuración de MySQL.

