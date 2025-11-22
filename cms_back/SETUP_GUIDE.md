# 🛠️ Guía de Configuración CMS Backend

## 📋 Prerequisitos

### Software Requerido

1. **Node.js** (v16 o superior)

   - Verifica: `node --version`
   - Descarga: https://nodejs.org/

2. **PostgreSQL** (v12 o superior)

   - Verifica: `psql --version`
   - Descarga: https://www.postgresql.org/download/

3. **npm** (incluido con Node.js)
   - Verifica: `npm --version`

---

## 🚀 Instalación Paso a Paso

### 1. Instalar Dependencias

```bash
cd cms_back
npm install
```

Esto instalará:

- Express.js (servidor web)
- pg (cliente PostgreSQL)
- bcryptjs (hash de contraseñas)
- jsonwebtoken (autenticación JWT)
- cors, helmet, morgan (middleware)
- dotenv (variables de entorno)

---

### 2. Configurar PostgreSQL

#### Opción A: Crear Base de Datos con psql

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE cms_medico;

# Salir
\q
```

#### Opción B: Usar pgAdmin

1. Abrir pgAdmin
2. Click derecho en "Databases"
3. Create → Database
4. Nombre: `cms_medico`
5. Save

---

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz de `cms_back`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cms_medico
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI

# JWT Configuration
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANTE:**

- Reemplaza `TU_PASSWORD_AQUI` con tu contraseña de PostgreSQL
- Cambia `JWT_SECRET` a un valor aleatorio y seguro
- En producción, usa variables de entorno del sistema, no archivo .env

---

### 4. Inicializar Base de Datos

```bash
npm run init-db
```

Esto ejecutará:

- ✅ Crear todas las tablas (schema.sql)
- ✅ Insertar datos iniciales (seed-data.sql)
- ✅ Crear índices para rendimiento
- ✅ Crear usuarios de prueba

**Usuarios de Prueba:**

- Username: `admin` | Password: `password123`
- Username: `editor` | Password: `password123`

---

### 5. Iniciar el Servidor

#### Modo Desarrollo (recomendado)

```bash
npm run dev
```

Ventajas:

- Auto-reload cuando cambias archivos
- Logs detallados
- Ideal para desarrollo

#### Modo Producción

```bash
npm start
```

---

## ✅ Verificar Instalación

### 1. Health Check

```bash
curl http://localhost:5000/health
```

Deberías ver:

```json
{
  "status": "OK",
  "message": "CMS Backend is running"
}
```

### 2. Probar Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

Deberías recibir un token JWT.

### 3. Probar Endpoint Protegido

```bash
# Guarda el token de la respuesta anterior
TOKEN="tu_token_aqui"

curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

Deberías ver la lista de usuarios.

---

## 🗄️ Estructura de Base de Datos

### Tablas Creadas (28 tablas)

**Catálogos:**

- ROL
- ESPECIALIDAD
- TIPO_SANGRE
- OCUPACION
- ESTADO_CIVIL
- ESTADO_CITA
- TIPO_CITA
- ESTADO_CONSULTA
- ESTADO_CODIGO

**Core:**

- USUARIO
- MEDICO
- PACIENTE

**Geografía:**

- PAIS
- ESTADO
- CIUDAD
- COLONIA
- DIRECCION_PACIENTE
- DIRECCION_CLINICA

**Clínicas:**

- CLINICA
- CONSULTORIO

**Agenda:**

- CITA
- CONSULTA
- EPISODIO

**Archivos:**

- ARCHIVO
- ARCHIVO_ASOCIACION
- INTERPRETACION_ARCHIVO

**Seguros:**

- ASEGURADORA
- POLIZA

**Sistema:**

- NOTIFICACION
- ACCESO_CODIGO
- AUDITORIA

---

## 🔧 Configuración Avanzada

### Cambiar Puerto del Servidor

En `.env`:

```env
PORT=3001
```

### Configurar Múltiples Orígenes CORS

En `src/server.js`:

```javascript
cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
});
```

### Aumentar Pool de Conexiones

En `src/config/database.js`:

```javascript
const pool = new Pool({
  // ...
  max: 50, // aumentar de 20 a 50
  // ...
});
```

---

## 🐛 Solución de Problemas

### Error: "connect ECONNREFUSED"

**Problema:** PostgreSQL no está corriendo

**Solución:**

```bash
# Windows
net start postgresql-x64-14

# Linux/Mac
sudo service postgresql start
# o
brew services start postgresql
```

---

### Error: "password authentication failed"

**Problema:** Contraseña incorrecta en .env

**Solución:**

1. Verifica tu contraseña de PostgreSQL
2. Actualiza `DB_PASSWORD` en `.env`
3. Reinicia el servidor

---

### Error: "relation X does not exist"

**Problema:** Tablas no creadas

**Solución:**

```bash
npm run init-db
```

---

### Error: "Port 5000 already in use"

**Problema:** Puerto ocupado

**Solución:**

```bash
# Opción 1: Cambiar puerto en .env
PORT=5001

# Opción 2: Matar proceso en puerto 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Opción 3: Usar otro puerto temporalmente
PORT=5001 npm start
```

---

### Error: "Cannot find module"

**Problema:** Dependencias no instaladas

**Solución:**

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Monitoreo y Logs

### Ver Logs del Servidor

El servidor usa Morgan para logging HTTP:

```
GET /api/users 200 45.123 ms - 1234
```

### Logs de Base de Datos

Cada query se logea con:

- Texto de la query
- Duración en ms
- Número de filas afectadas

---

## 🔒 Seguridad

### Cambiar JWT Secret en Producción

```bash
# Generar secreto aleatorio
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado a `JWT_SECRET` en `.env`

### Hashing de Contraseñas

Las contraseñas se hashean automáticamente con bcrypt (10 rounds).

Para generar hash manualmente:

```javascript
const bcrypt = require("bcryptjs");
const hash = await bcrypt.hash("password123", 10);
console.log(hash);
```

---

## 🧪 Testing

### Probar Todos los Endpoints

```bash
# Instalar dependencias de testing (opcional)
npm install --save-dev jest supertest

# Ejecutar tests
npm test
```

### Probar Manualmente con Postman

1. Importa endpoints desde `API_ENDPOINTS.md`
2. Configura Environment variable: `{{baseUrl}}` = `http://localhost:5000`
3. Prueba el flujo completo

---

## 📦 Deployment

### Preparar para Producción

1. **Configurar variables de entorno del servidor**
2. **Cambiar NODE_ENV**:
   ```env
   NODE_ENV=production
   ```
3. **Usar HTTPS**
4. **Configurar límites de rate**
5. **Configurar logging profesional (Winston)**

### Ejemplo con PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start src/server.js --name cms-api

# Ver logs
pm2 logs cms-api

# Reiniciar
pm2 restart cms-api

# Detener
pm2 stop cms-api
```

---

## 📝 Checklist de Instalación

- [ ] Node.js instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `cms_medico` creada
- [ ] Dependencias npm instaladas
- [ ] Archivo `.env` configurado
- [ ] Base de datos inicializada (`npm run init-db`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Health check funcionando
- [ ] Login exitoso con usuario de prueba
- [ ] Frontend configurado para apuntar al backend

---

## 🎓 Próximos Pasos

1. ✅ **Conectar Frontend**: Actualizar `AuthContext.js` y crear servicios API
2. ✅ **Probar CRUD**: Verificar todas las operaciones
3. ✅ **Revisar Auditoría**: Verificar que se registren las acciones
4. ✅ **Optimizar Queries**: Agregar índices adicionales si es necesario
5. ✅ **Implementar Validaciones**: Usar express-validator
6. ✅ **Agregar Tests**: Crear tests unitarios y de integración

---

**¿Necesitas ayuda?** Revisa `README.md` y `API_ENDPOINTS.md` para más detalles.
