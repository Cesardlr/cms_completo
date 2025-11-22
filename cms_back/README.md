# CMS Médico - Backend API

API RESTful para el sistema de gestión médica construido con Node.js, Express y PostgreSQL.

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 16+ instalado
- PostgreSQL 12+ instalado y corriendo
- npm o yarn

### Instalación

```bash
cd cms_back
npm install
```

### Configuración

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cms_medico
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
JWT_SECRET=tu_secreto_jwt_cambiar_en_produccion
```

### Inicializar Base de Datos

```bash
npm run init-db
```

Este comando:

- Crea todas las tablas necesarias
- Inserta datos iniciales (catálogos, usuarios de prueba)
- Configura índices para rendimiento

### Ejecutar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 🔐 Autenticación

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@cms.com",
    "role": "admin"
  }
}
```

### Uso del Token

Incluye el token en todas las peticiones subsecuentes:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📚 Endpoints API

### Usuarios

- `GET /api/users` - Listar usuarios (con búsqueda y paginación)
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `PATCH /api/users/:id/password` - Actualizar contraseña
- `DELETE /api/users/:id` - Eliminar usuario

### Catálogos Clínicos

Todos siguen el mismo patrón:

- `GET /api/catalogs/{catalog}` - Listar
- `POST /api/catalogs/{catalog}` - Crear
- `PUT /api/catalogs/{catalog}/:id` - Actualizar
- `DELETE /api/catalogs/{catalog}/:id` - Eliminar

Catálogos disponibles:

- `especialidades`
- `tipos-sangre`
- `ocupaciones`
- `estado-civil`
- `estado-cita`
- `tipo-cita`
- `estado-consulta`
- `estado-codigo`

### Médicos

- `GET /api/doctors` - Listar médicos
- `GET /api/doctors/:id` - Obtener médico
- `POST /api/doctors` - Crear médico
- `PUT /api/doctors/:id` - Actualizar médico
- `DELETE /api/doctors/:id` - Eliminar médico

### Pacientes

- `GET /api/patients` - Listar pacientes
- `GET /api/patients/:id` - Obtener paciente
- `POST /api/patients` - Crear paciente
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente
- `GET /api/patients/:id/addresses` - Direcciones del paciente
- `POST /api/patients/:id/addresses` - Agregar dirección
- `PUT /api/patients/:id/addresses/:addressId` - Actualizar dirección
- `DELETE /api/patients/:id/addresses/:addressId` - Eliminar dirección

### Geografía

- `GET /api/geography/paises` - Listar países
- `GET /api/geography/estados?pais_id=X` - Estados por país
- `GET /api/geography/ciudades?estado_id=X` - Ciudades por estado
- `GET /api/geography/colonias?ciudad_id=X` - Colonias por ciudad
- CRUD completo para cada uno

### Clínicas

- `GET /api/clinics` - Listar clínicas
- `GET /api/clinics/:id` - Obtener clínica
- `POST /api/clinics` - Crear clínica
- `PUT /api/clinics/:id` - Actualizar clínica
- `DELETE /api/clinics/:id` - Eliminar clínica
- `GET /api/clinics/:id/addresses` - Direcciones de clínica
- `GET /api/clinics/offices/list?clinica_id=X` - Consultorios

### Citas y Agenda

- `GET /api/appointments/citas` - Listar citas (con filtros)
- `POST /api/appointments/citas` - Crear cita
- `PUT /api/appointments/citas/:id` - Actualizar cita
- `DELETE /api/appointments/citas/:id` - Eliminar cita
- `GET /api/appointments/consultas` - Listar consultas
- `POST /api/appointments/consultas` - Crear consulta
- `GET /api/appointments/episodios?paciente_id=X` - Episodios
- `PATCH /api/appointments/episodios/:id/close` - Cerrar episodio

### Archivos

- `GET /api/files` - Listar archivos
- `POST /api/files` - Crear archivo
- `GET /api/files/associations?archivo_id=X` - Asociaciones
- `GET /api/files/interpretations?archivo_id=X` - Interpretaciones

### Aseguradoras

- `GET /api/insurance/companies` - Listar aseguradoras
- `POST /api/insurance/companies` - Crear aseguradora
- `GET /api/insurance/policies` - Listar pólizas
- `POST /api/insurance/policies` - Crear póliza

### Notificaciones

- `GET /api/notifications` - Listar notificaciones
- `POST /api/notifications` - Crear notificación
- `GET /api/notifications/access-codes` - Códigos de acceso
- `POST /api/notifications/access-codes` - Crear código

### Auditoría

- `GET /api/audit` - Registro de auditoría (con filtros)
- `GET /api/audit/stats` - Estadísticas de actividad

## 🔍 Parámetros de Consulta

### Búsqueda y Paginación

Todos los endpoints GET que devuelven listados soportan:

```
?search=texto     # Búsqueda en campos relevantes
&limit=10         # Registros por página (default: 10)
&offset=0         # Desplazamiento para paginación
```

Ejemplo:

```http
GET /api/users?search=juan&limit=20&offset=0
```

### Filtros Específicos

#### Citas

```
?fecha_desde=2024-01-01
&fecha_hasta=2024-12-31
&id_estado_cita=1
&id_tipo_cita=2
&medico_id=5
&paciente_id=10
```

#### Consultas

```
?fecha_desde=2024-01-01
&fecha_hasta=2024-12-31
&id_estado_consulta=1
&medico_id=5
&paciente_id=10
```

#### Auditoría

```
?entidad=USUARIO
&accion=CREATE
&fecha_desde=2024-01-01
&fecha_hasta=2024-12-31
&usuario_id=1
```

## 📊 Respuestas de la API

### Formato Estándar de Lista

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

### Formato de Éxito (Crear/Actualizar)

```json
{
  "id": 123,
  "message": "Created successfully"
}
```

### Formato de Error

```json
{
  "error": "Error message",
  "detail": "Additional details if available"
}
```

## 🛡️ Seguridad

- **JWT**: Tokens con expiración de 24 horas
- **bcrypt**: Hash de contraseñas con salt de 10 rounds
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para frontend específico
- **Validación**: Validación de FKs antes de insertar/actualizar

## 🗂️ Estructura del Proyecto

```
cms_back/
├── sql/
│   ├── schema.sql          # Esquema de base de datos
│   ├── seed-data.sql       # Datos iniciales
│   └── init-db.js          # Script de inicialización
├── src/
│   ├── config/
│   │   └── database.js     # Configuración PostgreSQL
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── catalog.controller.js
│   │   ├── doctor.controller.js
│   │   ├── patient.controller.js
│   │   ├── geography.controller.js
│   │   ├── clinic.controller.js
│   │   ├── appointment.controller.js
│   │   ├── file.controller.js
│   │   ├── insurance.controller.js
│   │   ├── notification.controller.js
│   │   └── audit.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── catalog.routes.js
│   │   ├── doctor.routes.js
│   │   ├── patient.routes.js
│   │   ├── geography.routes.js
│   │   ├── clinic.routes.js
│   │   ├── appointment.routes.js
│   │   ├── file.routes.js
│   │   ├── insurance.routes.js
│   │   ├── notification.routes.js
│   │   └── audit.routes.js
│   ├── middleware/
│   │   ├── auth.js          # Autenticación JWT
│   │   └── errorHandler.js # Manejo de errores
│   ├── utils/
│   │   └── auditLogger.js   # Registro automático
│   └── server.js            # Punto de entrada
├── .env.example             # Variables de entorno ejemplo
├── .gitignore
├── package.json
└── README.md
```

## 🔄 Auditoría Automática

Todas las operaciones CREATE, UPDATE y DELETE se registran automáticamente en la tabla AUDITORIA con:

- Usuario que realizó la acción
- Tipo de acción (CREATE/UPDATE/DELETE)
- Entidad afectada
- ID de la entidad
- Timestamp
- Detalles adicionales (JSON)

## 🧪 Testing

### Con curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Listar usuarios (con token)
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Con Postman/Insomnia:

1. Importa la colección desde `docs/api-collection.json` (si existe)
2. Configura el token en Authorization > Bearer Token
3. Prueba los endpoints

## 📈 KPIs y Dashboard

### Endpoints para Dashboard:

```http
GET /api/appointments/citas?fecha_desde=2024-11-11&fecha_hasta=2024-11-11
# Citas de hoy

GET /api/appointments/consultas?fecha_desde=2024-11-11&fecha_hasta=2024-11-11
# Consultas de hoy

GET /api/audit/stats
# Estadísticas de actividad
```

## 🐛 Solución de Problemas

### Error de conexión a base de datos:

1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Asegúrate que la base de datos existe:

```sql
CREATE DATABASE cms_medico;
```

### Error "relation does not exist":

Ejecuta la inicialización de base de datos:

```bash
npm run init-db
```

### Puerto en uso:

Cambia el puerto en `.env`:

```env
PORT=5001
```

## 📝 Notas Importantes

### Validaciones

- Todas las FKs se validan antes de insertar/actualizar
- PostgreSQL lanza error 23503 si la FK no existe
- El error handler devuelve mensaje amigable

### Transacciones

Para operaciones complejas, considera usar transacciones:

```javascript
const client = await pool.connect();
try {
  await client.query("BEGIN");
  // ... operaciones
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
}
```

### Paginación

Default: `limit=10, offset=0`

Calcular páginas en frontend:

```javascript
const page = Math.floor(offset / limit) + 1;
const totalPages = Math.ceil(total / limit);
```

## 🔒 Seguridad en Producción

- [ ] Cambiar `JWT_SECRET` a valor aleatorio fuerte
- [ ] Habilitar HTTPS
- [ ] Configurar rate limiting
- [ ] Implementar validación de inputs con express-validator
- [ ] Agregar logs con Winston o similar
- [ ] Configurar variables de entorno seguras
- [ ] Restringir CORS a dominio específico
- [ ] Implementar refresh tokens
- [ ] Agregar 2FA para usuarios admin

## 📊 Tecnologías

- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **pg** - Cliente PostgreSQL para Node
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Hashing de contraseñas
- **Helmet** - Seguridad HTTP headers
- **CORS** - Control de acceso cross-origin
- **Morgan** - Logging HTTP

## 📞 Soporte

Credenciales de prueba:

- **Usuario**: `admin` | **Password**: `password123`
- **Usuario**: `editor` | **Password**: `password123`

---

**Desarrollado para gestión médica eficiente** 🏥
