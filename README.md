# 🏥 CMS Médico - Guía de Inicio Rápido

## 📋 Requisitos Previos

- Node.js instalado
- Docker instalado
- Python 3.7+ instalado (para Locust)

---

## 🚀 Inicio Rápido (3 pasos)

### 1️⃣ Base de Datos

```bash
cd cms_db
docker-compose up -d
```

✅ PostgreSQL en puerto `5432`  
✅ MongoDB en puerto `27017`

---

### 2️⃣ Backend

```bash
cd cms_back
npm install
npm start
```

✅ Backend corriendo en `http://localhost:5000`

---

### 3️⃣ Frontend

**En otra terminal:**

```bash
cd cms_front
npm install
npm start
```

✅ Frontend corriendo en `http://localhost:3000`

---

## 🦗 Pruebas de Carga (Locust) - Opcional

**En otra terminal:**

```bash
cd cms_back

# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Instalar y ejecutar
pip install locust
locust -f locustfile.py --host=http://localhost:5000
```

✅ Abre `http://localhost:8089` en tu navegador

---

## 🛑 Detener Todo

```bash
# Detener base de datos
cd cms_db
docker-compose down

# Detener backend/frontend: Ctrl+C en cada terminal
```

---

## 📝 Credenciales por Defecto

- **Usuario:** `admin`
- **Contraseña:** `password`

---

## ❓ Problemas Comunes

**Base de datos no inicia:**

```bash
cd cms_db
docker-compose down
docker-compose up -d
```

**Puerto ocupado:**

- Backend: Cambia `PORT` en `cms_back/.env`
- Frontend: Cambia puerto en `cms_front/package.json`

**Error de módulos:**

```bash
# Elimina node_modules y reinstala
rm -rf node_modules
npm install
```
