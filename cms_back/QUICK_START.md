# ⚡ Quick Start - CMS Backend

## 🎯 Configuración en 5 Minutos

### 1. Instalar Dependencias (1 min)

```bash
cd cms_back
npm install
```

### 2. Crear Base de Datos (1 min)

Abre PostgreSQL y ejecuta:

```sql
CREATE DATABASE cms_medico;
```

O usa pgAdmin para crear la base de datos visualmente.

### 3. Configurar .env (1 min)

Crea archivo `.env` en `cms_back/`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cms_medico
DB_USER=postgres
DB_PASSWORD=tu_password_postgres
JWT_SECRET=secreto_super_seguro_123456789
CORS_ORIGIN=http://localhost:3000
```

### 4. Inicializar Base de Datos (1 min)

```bash
npm run init-db
```

### 5. Iniciar Servidor (1 min)

```bash
npm run dev
```

---

## ✅ Verificación

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

✅ Debe responder: `{"status":"OK","message":"CMS Backend is running"}`

### Test 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

✅ Debe responder con un token JWT

---

## 🎮 Credenciales de Prueba

**Admin:**

- Usuario: `admin`
- Password: `password123`

**Editor:**

- Usuario: `editor`
- Password: `password123`

---

## 📡 Endpoints Principales

### Autenticación

```
POST /api/auth/login
GET  /api/auth/me
```

### Usuarios

```
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Catálogos

```
GET    /api/catalogs/especialidades
POST   /api/catalogs/especialidades
PUT    /api/catalogs/especialidades/:id
DELETE /api/catalogs/especialidades/:id
```

### Médicos

```
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

### Pacientes

```
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
GET    /api/patients/:id/addresses
POST   /api/patients/:id/addresses
```

### Citas

```
GET    /api/appointments/citas
POST   /api/appointments/citas
PUT    /api/appointments/citas/:id
DELETE /api/appointments/citas/:id
```

### Auditoría

```
GET /api/audit
GET /api/audit/stats
```

---

## 🔗 Conectar con Frontend

### Opción 1: Actualizar Frontend

En `cms_front/src/context/AuthContext.js`:

```javascript
const login = async (username, password) => {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    setUser(data.user);
    localStorage.setItem("cms_token", data.token);
    localStorage.setItem("cms_user", JSON.stringify(data.user));
    return true;
  }
  return false;
};
```

### Opción 2: Crear Servicio API

Crea `cms_front/src/services/api.js`:

```javascript
const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("cms_token");

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // ... put, delete
};
```

---

## 🚨 Troubleshooting Rápido

### ❌ Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "connect ECONNREFUSED"

PostgreSQL no está corriendo. Inícialo:

```bash
# Windows
net start postgresql-x64-14

# Linux/Mac
sudo service postgresql start
```

### ❌ Error: "relation does not exist"

```bash
npm run init-db
```

### ❌ Error: "password authentication failed"

Verifica tu password en `.env`

---

## 📚 Más Información

- **Documentación Completa**: Ver `README.md`
- **Todos los Endpoints**: Ver `API_ENDPOINTS.md`
- **Guía de Setup Detallada**: Ver `SETUP_GUIDE.md`

---

## 🎉 ¡Listo!

Tu backend debería estar corriendo en:

```
http://localhost:5000
```

**Siguiente paso:** Conecta tu frontend y prueba la integración completa.

---

**Tiempo total de setup: ~5 minutos** ⏱️
