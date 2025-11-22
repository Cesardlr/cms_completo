# 📂 Estructura del Proyecto Backend

## 🗂️ Árbol de Directorios

```
cms_back/
├── 📄 package.json              # Dependencias y scripts
├── 📄 .env.example              # Ejemplo de variables de entorno
├── 📄 .gitignore                # Archivos ignorados por git
├── 📄 README.md                 # Documentación principal
├── 📄 API_ENDPOINTS.md          # Documentación de endpoints
├── 📄 SETUP_GUIDE.md            # Guía de instalación detallada
├── 📄 QUICK_START.md            # Inicio rápido
├── 📄 PROJECT_STRUCTURE.md      # Este archivo
│
├── 📁 sql/                      # Scripts de base de datos
│   ├── schema.sql               # Esquema completo (CREATE TABLE)
│   ├── seed-data.sql            # Datos iniciales
│   └── init-db.js               # Script de inicialización
│
└── 📁 src/                      # Código fuente
    ├── 📄 server.js             # Punto de entrada principal
    │
    ├── 📁 config/               # Configuraciones
    │   └── database.js          # Conexión PostgreSQL
    │
    ├── 📁 middleware/           # Middleware de Express
    │   ├── auth.js              # Autenticación JWT
    │   └── errorHandler.js      # Manejo de errores global
    │
    ├── 📁 controllers/          # Lógica de negocio
    │   ├── auth.controller.js       # Login, getCurrentUser
    │   ├── user.controller.js       # CRUD usuarios
    │   ├── catalog.controller.js    # CRUD catálogos (genérico)
    │   ├── doctor.controller.js     # CRUD médicos
    │   ├── patient.controller.js    # CRUD pacientes + direcciones
    │   ├── geography.controller.js  # CRUD geografía (cascading)
    │   ├── clinic.controller.js     # CRUD clínicas + consultorios
    │   ├── appointment.controller.js # Citas, consultas, episodios
    │   ├── file.controller.js       # Archivos + asociaciones
    │   ├── insurance.controller.js  # Aseguradoras + pólizas
    │   ├── notification.controller.js # Notificaciones + códigos
    │   └── audit.controller.js      # Auditoría + estadísticas
    │
    ├── 📁 routes/               # Definición de rutas
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── catalog.routes.js
    │   ├── doctor.routes.js
    │   ├── patient.routes.js
    │   ├── geography.routes.js
    │   ├── clinic.routes.js
    │   ├── appointment.routes.js
    │   ├── file.routes.js
    │   ├── insurance.routes.js
    │   ├── notification.routes.js
    │   └── audit.routes.js
    │
    ├── 📁 services/             # Lógica de negocio compleja (future)
    └── 📁 utils/                # Utilidades
        └── auditLogger.js       # Logger automático de auditoría
```

---

## 📊 Estadísticas

| Categoría       | Cantidad |
| --------------- | -------- |
| **Controllers** | 12       |
| **Routes**      | 12       |
| **Middleware**  | 2        |
| **SQL Scripts** | 3        |
| **Endpoints**   | 100+     |
| **Tablas DB**   | 28       |

---

## 🎯 Responsabilidades por Archivo

### 📁 config/

#### `database.js`

- Configuración del pool de conexiones PostgreSQL
- Helper function `query()` para ejecutar SQL
- Logging de queries
- Manejo de errores de conexión

---

### 📁 middleware/

#### `auth.js`

**Funciones:**

- `authenticateToken()` - Verifica JWT en header Authorization
- `checkRole(roles)` - Verifica si usuario tiene rol permitido

**Uso:**

```javascript
router.use(authenticateToken);
router.post("/admin-only", checkRole(["admin"]), handler);
```

#### `errorHandler.js`

**Maneja:**

- Errores de PostgreSQL (23505 = duplicado, 23503 = FK, etc)
- Errores de validación
- Errores genéricos 500

---

### 📁 controllers/

#### `auth.controller.js`

- `login()` - Autenticación con bcrypt + generación JWT
- `getCurrentUser()` - Obtener datos del usuario autenticado

#### `user.controller.js`

- `getUsers()` - Lista con búsqueda y paginación
- `getUserById()` - Un usuario específico
- `createUser()` - Hash password + INSERT
- `updateUser()` - UPDATE usuario
- `updatePassword()` - Cambiar contraseña (hash)
- `deleteUser()` - DELETE + audit log

#### `catalog.controller.js`

- `createCatalogHandlers()` - Factory function genérica
- Genera CRUD para 8 catálogos diferentes
- Reutilizable y DRY

#### `doctor.controller.js`

- CRUD de médicos con JOIN a USUARIO y ESPECIALIDAD
- Búsqueda por username o cédula

#### `patient.controller.js`

- CRUD de pacientes con múltiples JOINs
- CRUD de direcciones de paciente (nested)
- `getPatientAddresses()` - Con JOIN a geografía completa

#### `geography.controller.js`

- CRUD para PAIS, ESTADO, CIUDAD, COLONIA
- Filtros para selects encadenados (`pais_id`, `estado_id`, `ciudad_id`)

#### `clinic.controller.js`

- CRUD de clínicas
- CRUD de direcciones de clínica
- CRUD de consultorios (filtrable por `clinica_id`)

#### `appointment.controller.js`

- CRUD de citas con filtros avanzados
- CRUD de consultas
- CRUD de episodios
- `closeEpisode()` - Cerrar episodio médico

#### `file.controller.js`

- CRUD de archivos
- CRUD de asociaciones de archivos
- CRUD de interpretaciones médicas

#### `insurance.controller.js`

- CRUD de aseguradoras
- CRUD de pólizas con JOINs

#### `notification.controller.js`

- CRUD de notificaciones
- CRUD de códigos de acceso

#### `audit.controller.js`

- `getAuditLogs()` - Con filtros múltiples
- `getAuditStats()` - Estadísticas de actividad

---

### 📁 routes/

Cada archivo de rutas:

1. Importa el controller correspondiente
2. Aplica middleware de autenticación
3. Define rutas RESTful
4. Exporta router

**Patrón estándar:**

```javascript
const express = require("express");
const router = express.Router();
const controller = require("../controllers/X.controller");
const { authenticateToken } = require("../middleware/auth");

router.use(authenticateToken);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
```

---

### 📁 utils/

#### `auditLogger.js`

- `logAudit()` - Función helper para registrar auditoría
- Llamada automática en CREATE/UPDATE/DELETE
- No lanza errores (fail silently)

---

### 📁 sql/

#### `schema.sql`

- DROP todas las tablas (orden correcto por FKs)
- CREATE 28 tablas
- CREATE índices para performance

#### `seed-data.sql`

- INSERT datos iniciales para catálogos
- INSERT usuarios de prueba (admin, editor)
- INSERT datos de ejemplo (clínicas, aseguradoras)

#### `init-db.js`

- Script Node.js para ejecutar schema + seed
- Feedback visual del proceso
- Muestra credenciales de prueba al final

---

## 🔄 Flujo de una Petición

```
1. Cliente → POST /api/users
2. server.js → Recibe petición
3. Middleware:
   - helmet (seguridad)
   - cors (permisos)
   - morgan (logging)
   - express.json() (parseo)
4. Router → /api/users → user.routes.js
5. Middleware → authenticateToken() (verifica JWT)
6. Controller → userController.createUser()
7. Database → query() ejecuta INSERT
8. Utils → logAudit() registra acción
9. Response → JSON de éxito
10. Error Handler → Si hay error, maneja y responde
```

---

## 🎨 Patrones de Diseño Utilizados

### 1. MVC (Model-View-Controller)

- **Routes** = Rutas (similar a View routes)
- **Controllers** = Lógica de negocio
- **Database** = Modelo (queries directas a PostgreSQL)

### 2. Middleware Pattern

- Autenticación
- Error handling
- Logging

### 3. Factory Pattern

- `createCatalogHandlers()` en catalog.controller
- Genera CRUD genérico para catálogos

### 4. Separation of Concerns

- Configuración separada de lógica
- Routes separadas de controllers
- Utils reutilizables

---

## 📦 Dependencias Explicadas

| Paquete               | Propósito                                      |
| --------------------- | ---------------------------------------------- |
| **express**           | Framework web, routing, middleware             |
| **pg**                | Cliente PostgreSQL nativo                      |
| **dotenv**            | Cargar variables de entorno desde .env         |
| **bcryptjs**          | Hash seguro de contraseñas                     |
| **jsonwebtoken**      | Generar y verificar tokens JWT                 |
| **cors**              | Permitir requests desde frontend               |
| **helmet**            | Headers de seguridad HTTP                      |
| **morgan**            | Logging de requests HTTP                       |
| **express-validator** | Validación de inputs (instalado, no usado aún) |
| **nodemon**           | Auto-reload en desarrollo                      |

---

## 🔐 Seguridad Implementada

✅ **JWT Tokens** - Expiración 24h  
✅ **bcrypt** - Hash de passwords (10 rounds)  
✅ **Helmet** - Protección XSS, clickjacking, etc  
✅ **CORS** - Solo frontend permitido  
✅ **SQL Injection** - Queries parametrizadas ($1, $2)  
✅ **FK Validation** - PostgreSQL valida relaciones  
✅ **Error Handling** - Mensajes seguros, no expone internals

---

## 📈 Performance

### Índices Creados

```sql
idx_cita_fecha_inicio       -- Filtrar citas por fecha
idx_consulta_fecha_hora     -- Filtrar consultas por fecha
idx_auditoria_fecha_hora    -- Filtrar auditoría por fecha
idx_auditoria_entidad       -- Filtrar por entidad
idx_auditoria_accion        -- Filtrar por acción
idx_poliza_vigencias        -- Buscar pólizas vigentes
idx_notificacion_fecha      -- Ordenar notificaciones
idx_usuario_username        -- Login rápido
idx_usuario_correo          -- Buscar por email
idx_medico_cedula           -- Buscar médicos
idx_paciente_usuario        -- JOIN rápido
idx_medico_usuario          -- JOIN rápido
```

### Connection Pool

- **Max Connections**: 20
- **Idle Timeout**: 30s
- **Connection Timeout**: 2s

---

## 🧪 Testing Manual

### Postman Collection

Importa esta colección:

```json
{
  "info": {
    "name": "CMS Médico API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"admin\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

## 🚀 Próximas Mejoras

### Corto Plazo

- [ ] Agregar validación con express-validator
- [ ] Implementar rate limiting
- [ ] Agregar tests con Jest
- [ ] Mejorar logging con Winston

### Mediano Plazo

- [ ] Implementar uploads de archivos reales
- [ ] Agregar cache con Redis
- [ ] Implementar WebSockets para notificaciones real-time
- [ ] Agregar documentación con Swagger/OpenAPI

### Largo Plazo

- [ ] Microservicios (separar módulos)
- [ ] GraphQL API alternativa
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

**Estructura limpia, escalable y mantenible** ✨
