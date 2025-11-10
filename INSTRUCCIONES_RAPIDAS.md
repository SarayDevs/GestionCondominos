# 🚀 Instrucciones Rápidas - Solución de Problemas

## ⚠️ Problema: "no such table: api_apartamento"

### ✅ Solución Rápida (Windows)

1. **Abre PowerShell o CMD en la carpeta `backend`**

2. **Ejecuta el script automático:**
```bash
setup.bat
```

Este script hará TODO automáticamente:
- ✅ Eliminará la base de datos vieja
- ✅ Creará las migraciones
- ✅ Aplicará las migraciones
- ✅ Creará el usuario admin
- ✅ Cargará datos de ejemplo

### 📋 Solución Manual (Si el script no funciona)

```bash
# 1. Ve a la carpeta backend
cd backend

# 2. Elimina la base de datos
del db.sqlite3

# 3. Crea las migraciones
python manage.py makemigrations api

# 4. Aplica las migraciones
python manage.py migrate

# 5. Crea el usuario admin
python manage.py createsuperuser
# Usuario: admin
# Email: admin@condominio.com  
# Contraseña: admin123

# 6. Carga datos de ejemplo
python init_db.py
```

### 🔍 Verificar que funcionó

1. **Inicia el servidor:**
```bash
python manage.py runserver
```

2. **Accede al admin:**
- URL: http://127.0.0.1:8000/admin
- Usuario: `admin`
- Contraseña: `admin123`

3. **Deberías ver:**
- ✅ Apartamentos (con datos)
- ✅ Usuarios (con datos)
- ✅ Pagos (con datos)
- ✅ Gastos (con datos)

### 🎯 Verificar en el Frontend

1. **Inicia el frontend:**
```bash
npm run dev
```

2. **Inicia sesión:**
- Usuario: `admin`
- Contraseña: `admin123`

3. **Deberías ver:**
- ✅ Dashboard con datos reales
- ✅ Gráficos con información
- ✅ Apartamentos en la lista
- ✅ Pagos y gastos funcionando

## 📊 Gráficos en SalesChart.jsx

El componente `SalesChart.jsx` ahora incluye **7 gráficos diferentes**:

1. **Ingresos Mensuales** (Line Chart)
2. **Comparativa Ingresos vs Egresos** (Bar Chart)
3. **Distribución por Método de Pago** (Pie Chart)
4. **Gastos por Categoría** (Pie Chart)
5. **Área de Ingresos Acumulados** (Area Chart)
6. **Egresos Mensuales** (Bar Chart)
7. **Análisis Comparativo Completo** (Composed Chart)

Todos los gráficos se conectan automáticamente al backend y muestran datos en tiempo real.

## 🔧 Si sigue sin funcionar

### Verificar migraciones:
```bash
python manage.py showmigrations api
```

Deberías ver:
```
api
 [X] 0001_initial
```

### Verificar que la app está registrada:
Abre `backend/condominio_backend/settings.py` y verifica:
```python
INSTALLED_APPS = [
    ...
    'api',  # <-- Debe estar aquí
]
```

### Verificar estructura de carpetas:
```
backend/
  ├── api/
  │   ├── migrations/
  │   │   ├── __init__.py
  │   │   └── 0001_initial.py  # <-- Debe existir
  │   ├── models.py
  │   └── ...
  ├── condominio_backend/
  ├── manage.py
  ├── setup.bat  # <-- Script de solución
  └── db.sqlite3  # <-- Se crea automáticamente
```

## 🆘 Comandos Útiles

```bash
# Ver estado de migraciones
python manage.py showmigrations

# Ver tablas en la base de datos
python manage.py dbshell
# Luego en SQLite: .tables

# Recrear migraciones desde cero
python manage.py makemigrations api --empty
python manage.py makemigrations api
python manage.py migrate
```

## ✅ Checklist Final

- [ ] Migraciones creadas (`makemigrations`)
- [ ] Migraciones aplicadas (`migrate`)
- [ ] Usuario admin creado
- [ ] Datos de ejemplo cargados
- [ ] Servidor Django corriendo
- [ ] Frontend corriendo
- [ ] Login funciona
- [ ] Datos aparecen en el dashboard


