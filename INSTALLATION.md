# Guía de Instalación - Sistema de Gestión de Condominio

## Requisitos Previos

- Python 3.8 o superior
- Node.js 16 o superior
- npm o yarn

## Instalación del Backend (Django)

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Crea un entorno virtual:
```bash
python -m venv venv
```

3. Activa el entorno virtual:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Instala las dependencias:
```bash
pip install -r requirements.txt
```

5. Realiza las migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Crea un superusuario:
```bash
python manage.py createsuperuser
```
Sigue las instrucciones para crear un usuario administrador.

7. (Opcional) Carga datos de ejemplo:
```bash
python manage.py shell
```
Luego ejecuta:
```python
from api.models import Apartamento, Pago, Gasto, Usuario
from django.contrib.auth.models import User

# Crear apartamentos de ejemplo
apt1 = Apartamento.objects.create(numero=101, propietario="Juan Pérez", saldo=0, estado="Al Día")
apt2 = Apartamento.objects.create(numero=102, propietario="María López", saldo=-50000, estado="Moroso")

# Crear pagos de ejemplo
Pago.objects.create(apartamento=apt1, monto=500000, fecha_pago="2025-01-15", metodo_pago="transferencia", estado="Pagado")
Pago.objects.create(apartamento=apt2, monto=500000, fecha_pago="2025-01-10", metodo_pago="efectivo", estado="Pendiente")

# Crear gastos de ejemplo
Gasto.objects.create(concepto="Mantenimiento Ascensor", monto=1500000, fecha_gasto="2025-01-20", proveedor="ServiLift", categoria="Mantenimiento", estado="Pagado")
Gasto.objects.create(concepto="Servicios Agua", monto=350000, fecha_gasto="2025-01-25", proveedor="Acueducto S.A.", categoria="Servicios Básicos", estado="Pendiente")
```

8. Inicia el servidor:
```bash
python manage.py runserver
```

El backend estará disponible en `http://127.0.0.1:8000`

## Instalación del Frontend (React + Vite)

1. En la raíz del proyecto, instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Configuración

### Configurar URL del Backend

Si el backend está en una URL diferente, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Cambiar a MySQL (Opcional)

1. Edita `backend/condominio_backend/settings.py`
2. Descomenta y configura la sección de MySQL:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'condominio_db',
        'USER': 'root',
        'PASSWORD': 'tu_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

3. Instala el driver de MySQL:
```bash
pip install mysqlclient
```

## Uso

1. Inicia el backend Django
2. Inicia el frontend React
3. Abre `http://localhost:5173` en tu navegador
4. Inicia sesión con las credenciales del superusuario creado

## Endpoints API Principales

- `POST /api/auth/login/` - Autenticación
- `GET /api/apartamentos/` - Lista de apartamentos
- `GET /api/pagos/` - Lista de pagos
- `GET /api/gastos/` - Lista de gastos
- `GET /api/dashboard/stats/` - Estadísticas del dashboard

Para más detalles, consulta `backend/README.md`


