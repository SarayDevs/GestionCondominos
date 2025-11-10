# 🏢 Sistema de Gestión de Condominios

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![React](https://img.shields.io/badge/Made%20with-React-blue)
![Django](https://img.shields.io/badge/API-Django%20REST%20Framework-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render.com-blueviolet)
![License](https://img.shields.io/badge/license-MIT-yellow)
![Status](https://img.shields.io/badge/status-Beta-orange)

---

**Proyecto Full Stack:** Django REST Framework (Backend) + React + Vite (Frontend)  
**Objetivo:** Gestionar pagos, gastos, apartamentos y usuarios de un condominio, con panel estadístico y gráficos dinámicos.

🌐 **Backend (Render):** [https://api-condominios.onrender.com](https://api-condominios.onrender.com)  
🌐 **Frontend (Vercel):** [https://gestion-condominios.vercel.app](https://gestion-condominos.vercel.app)

---

## 🚀 Características Principales

### 🧠 Backend (Django REST Framework)
- API REST completa con endpoints para:
  - 🏠 **Apartamentos** (CRUD, morosos, historial de pagos)
  - 💰 **Pagos** (CRUD, resumen mensual, métodos, ingresos)
  - 📉 **Gastos** (CRUD, categorías, proveedores, estados)
  - 👤 **Usuarios** (CRUD)
  - 📊 **Dashboard** (estadísticas globales)
- Autenticación con **token JWT**
- Base de datos **SQLite** (configurable a MySQL)
- Panel **Admin Django** habilitado
- CORS configurado para desarrollo

### 💻 Frontend (React + Vite)
- Autenticación y persistencia de sesión
- Dashboard con **gráficos interactivos en tiempo real**
- Páginas:
  - 🧭 **Dashboard**: resumen general de ingresos y egresos
  - 💸 **Pagos.jsx**: 6 tipos de gráficos dinámicos
  - 📊 **Gastos.jsx**: 8 tipos de gráficos dinámicos
  - 🏢 **Apartamentos.jsx**: listado, filtro de morosos y formularios
  - 👥 **Usuarios.jsx**: administración completa
  - ⚙️ **Configuración.jsx**: preferencias del usuario
- Configuración centralizada de API (`src/config/api.js`)
- Interfaz responsive, moderna y con **modo oscuro / claro**

---

## 🧩 Estructura del Proyecto

```bash
ProyectoCondominio/
├── backend/                  # Django REST Framework
│   ├── api/                 # App principal (modelos, vistas, serializers)
│   ├── condominio_backend/  # Configuración Django
│   ├── init_db.py           # Carga de datos de ejemplo
│   ├── setup.bat            # Script de configuración automática
│   ├── requirements.txt
│   └── db.sqlite3
│
├── src/                     # Frontend React + Vite
│   ├── components/          # Componentes reutilizables (gráficos)
│   ├── pages/               # Páginas principales
│   └── config/              # Configuración de API
│
└── README.md
```
## ⚙️ Instalación y Configuración

## ▶️ Quick Start (rápido)

## Clonar el repo
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```
### Iniciar backend (desde la carpeta backend)
```
cd backend
python -m venv venv
```
### Windows:
```
venv\Scripts\activate
```
## macOS / Linux:
## source venv/bin/activate
```
pip install -r requirements.txt
python manage.py migrate
python init_db.py
python manage.py runserver
```
## En otra terminal: iniciar frontend (desde la carpeta raíz o frontend)
```
npm install
npm run dev
```
## ⚙️ Instalación y Configuración

### 🔹 Requisitos Previos
- Python **3.8+**
- Node.js **16+**
- npm o yarn

---
#🐍 Backend (Django) — pasos descriptivos
Ir a la carpeta del backend:
```bash
cd backend
Crear y activar entorno virtual:
python -m venv venv
```
# Windows
```
venv\Scripts\activate
```
# macOS / Linux
# source venv/bin/activate

Instalar dependencias:
```

pip install -r requirements.txt

```
Crear y aplicar migraciones:
```

python manage.py makemigrations
python manage.py migrate
```

Cargar datos de ejemplo (opcional pero recomendado):
```

python init_db.py

```
Ejecutar el servidor de desarrollo:
```

python manage.py runserver
```
Acceso local del backend

API REST: http://127.0.0.1:8000

Admin Django: http://127.0.0.1:8000/admin

Credenciales por defecto (si usaste init_db.py):
```
Usuario: admin

Contraseña: admin123
```

## ⚛️ Frontend (React + Vite) — pasos descriptivos

Ir a la carpeta del frontend (ajusta el path si tu frontend está en otra carpeta):
```
cd frontend
```

Instalar dependencias:
```
npm install
```

Ejecutar en modo desarrollo:
```

npm run dev
```

Acceso local del frontend

App: http://localhost:5173

## 🧠 Datos de ejemplo

Si ejecutaste python init_db.py se crearán automáticamente:

- 👤 Usuario administrador (admin / admin123)

- 🏢 Apartamentos de prueba

- 💰 Pagos y gastos simulados

- 📊 Qué gráficos incluye (resumen)

  - Pagos.jsx

  - Ingresos Mensuales (Bar Chart)

  - Distribución por Método (Pie Chart)

  - Tendencia de Ingresos (Line Chart)

  - Ingresos Acumulados (Area Chart)

  - Top Apartamentos (Bar Chart Horizontal)

  - Comparativa Mensual (Composed Chart)

  - Gastos.jsx

  - Distribución por Categoría (Pie Chart)

  - Gastos Mensuales (Bar Chart)

  - Tendencia de Gastos (Line Chart)

  - Gastos por Estado (Pie Chart)

  - Top Proveedores (Bar Chart Horizontal)

  - Gastos Acumulados (Area Chart)

  - Comparativa por Categoría (Bar Chart)

  - Análisis Comparativo (Composed Chart)

  - Todos los gráficos:

  - Se conectan al backend (API)

  - Formatean en COP (pesos colombianos)

  - Son responsivos e interactivos

## 🧾 Comandos útiles
### Crear superusuario manualmente (si no usas init_db.py)
```
python manage.py createsuperuser
```
### Ver migraciones
```
python manage.py showmigrations api
```

### Eliminar y recrear la base de datos (Windows)
```
del db.sqlite3
python manage.py makemigrations api
python manage.py migrate
```
# 🐞 Solución de problemas comunes

### Error: no such table: api_apartamento
```
cd backend
setup.bat   # si existe y está configurado
# Si no:
del db.sqlite3
python manage.py makemigrations api
python manage.py migrate
python init_db.py
```

### Frontend muestra datos en 0 o vacíos

Verifica que el backend esté corriendo (python manage.py runserver).

Revisa VITE_API_URL en .env del frontend.

- Abre DevTools → Application → Local Storage y revisa que exista el token de sesión si la app lo requiere.
---

# 📚 Tecnologías (resumen)

- React + Vite — Frontend

- Django REST Framework — Backend API

- Recharts — Gráficos

- SQLite (por defecto) — Base de datos

- JWT / Tokens — Autenticación

- Axios — HTTP client

- TailwindCSS (opcional) — Estilos
