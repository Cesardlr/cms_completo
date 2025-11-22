# 🔌 Documentación Completa de Endpoints API

## Base URL

```
http://localhost:5000/api
```

---

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

**Respuesta:**

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

### Obtener Usuario Actual

```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## 👥 Usuarios

### Listar Usuarios

```http
GET /api/users?search=juan&limit=10&offset=0
Authorization: Bearer {token}
```

### Obtener Usuario por ID

```http
GET /api/users/1
Authorization: Bearer {token}
```

### Crear Usuario

```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "doctor1",
  "correo": "doctor1@cms.com",
  "telefono": "555-0001",
  "password": "password123",
  "rol_id": 2
}
```

### Actualizar Usuario

```http
PUT /api/users/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "doctor1_updated",
  "correo": "doctor1@cms.com",
  "telefono": "555-0002",
  "rol_id": 2
}
```

### Actualizar Contraseña

```http
PATCH /api/users/1/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "new_password123"
}
```

### Eliminar Usuario

```http
DELETE /api/users/1
Authorization: Bearer {token}
```

---

## 📋 Catálogos Clínicos

### Patrón General

Todos los catálogos siguen el mismo patrón:

**Listar:**

```http
GET /api/catalogs/{catalog}?search=texto&limit=10&offset=0
```

**Crear:**

```http
POST /api/catalogs/{catalog}
{
  "nombre": "Valor" // o "tipo" para tipos-sangre
}
```

**Actualizar:**

```http
PUT /api/catalogs/{catalog}/1
{
  "nombre": "Nuevo Valor"
}
```

**Eliminar:**

```http
DELETE /api/catalogs/{catalog}/1
```

### Catálogos Disponibles

1. `/api/catalogs/especialidades` - campo: `nombre`
2. `/api/catalogs/tipos-sangre` - campo: `tipo`
3. `/api/catalogs/ocupaciones` - campo: `nombre`
4. `/api/catalogs/estado-civil` - campo: `nombre`
5. `/api/catalogs/estado-cita` - campo: `nombre`
6. `/api/catalogs/tipo-cita` - campo: `nombre`
7. `/api/catalogs/estado-consulta` - campo: `nombre`
8. `/api/catalogs/estado-codigo` - campo: `nombre`

---

## 👨‍⚕️ Médicos

### Listar Médicos

```http
GET /api/doctors?search=garcia&limit=10&offset=0
Authorization: Bearer {token}
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": 1,
      "username": "doctor1",
      "correo": "doctor1@cms.com",
      "cedula": "MED-12345",
      "descripcion": "Especialista cardiovascular",
      "especialidad": "Cardiología",
      "id_especialidad": 1,
      "foto_archivo_id": null
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

### Crear Médico

```http
POST /api/doctors
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 3,
  "cedula": "MED-12345",
  "descripcion": "Especialista en cardiología",
  "id_especialidad": 1,
  "foto_archivo_id": null
}
```

---

## 🏥 Pacientes

### Listar Pacientes

```http
GET /api/patients?search=juan&limit=10&offset=0
Authorization: Bearer {token}
```

### Crear Paciente

```http
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 4,
  "fecha_nacimiento": "1985-05-15",
  "sexo": "M",
  "altura": 1.75,
  "peso": 70.5,
  "estilo_vida": "Activo",
  "id_tipo_sangre": 7,
  "id_ocupacion": 2,
  "id_estado_civil": 1,
  "id_medico_gen": 1,
  "foto_archivo_id": null
}
```

### Direcciones del Paciente

```http
GET /api/patients/1/addresses
Authorization: Bearer {token}
```

```http
POST /api/patients/1/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "calle": "Av. Constitución",
  "numero_ext": "123",
  "numero_int": "4B",
  "id_colonia": 1
}
```

---

## 🌍 Geografía (Selects Encadenados)

### Países

```http
GET /api/geography/paises?search=mexico
```

### Estados por País

```http
GET /api/geography/estados?pais_id=1
```

### Ciudades por Estado

```http
GET /api/geography/ciudades?estado_id=1
```

### Colonias por Ciudad

```http
GET /api/geography/colonias?ciudad_id=1&search=centro
```

**Ejemplo de flujo:**

1. Usuario selecciona país → GET estados con `pais_id`
2. Usuario selecciona estado → GET ciudades con `estado_id`
3. Usuario selecciona ciudad → GET colonias con `ciudad_id`

---

## 🏥 Clínicas

### Listar Clínicas

```http
GET /api/clinics?search=santa&limit=10&offset=0
```

### Crear Clínica

```http
POST /api/clinics
Content-Type: application/json

{
  "nombre": "Clínica Santa María",
  "telefono": "555-3001",
  "correo": "contacto@santamaria.com"
}
```

### Direcciones de Clínica

```http
GET /api/clinics/1/addresses
```

### Consultorios

```http
GET /api/clinics/offices/list?clinica_id=1
```

```http
POST /api/clinics/offices
{
  "clinica_id": 1,
  "nombre_numero": "101",
  "piso_zona": "Primer piso"
}
```

---

## 📅 Agenda (Citas, Consultas, Episodios)

### Citas

**Listar con filtros:**

```http
GET /api/appointments/citas?fecha_desde=2024-11-01&fecha_hasta=2024-11-30&medico_id=1
```

**Crear Cita:**

```http
POST /api/appointments/citas
{
  "paciente_id": 1,
  "medico_id": 1,
  "id_consultorio": 1,
  "fecha_inicio": "2024-11-15T10:00:00",
  "fecha_fin": "2024-11-15T10:30:00",
  "id_estado_cita": 1,
  "id_tipo_cita": 1
}
```

### Consultas

**Listar:**

```http
GET /api/appointments/consultas?paciente_id=1&limit=20
```

**Crear:**

```http
POST /api/appointments/consultas
{
  "cita_id": 1,
  "id_estado_consulta": 1,
  "id_episodio": 1,
  "fecha_hora": "2024-11-15T10:00:00",
  "narrativa": "Consulta de seguimiento cardiovascular",
  "mongo_consulta_id": null
}
```

### Episodios

**Listar por Paciente:**

```http
GET /api/appointments/episodios?paciente_id=1
```

**Crear:**

```http
POST /api/appointments/episodios
{
  "id_paciente": 1,
  "motivo": "Tratamiento cardiovascular"
}
```

**Cerrar Episodio:**

```http
PATCH /api/appointments/episodios/1/close
{
  "fecha_fin": "2024-11-30T12:00:00"
}
```

---

## 📁 Archivos

### Listar Archivos

```http
GET /api/files?search=pdf&limit=10
```

### Crear Archivo

```http
POST /api/files
{
  "tipo": "PDF",
  "url": "/uploads/radiografia.pdf",
  "hash_integridad": "abc123..."
}
```

### Asociaciones

```http
GET /api/files/associations?archivo_id=1
```

```http
POST /api/files/associations
{
  "archivo_id": 1,
  "entidad": "PACIENTE",
  "entidad_id": 1,
  "descripcion": "Radiografía de tórax",
  "creado_por_usuario_id": 1
}
```

### Interpretaciones

```http
GET /api/files/interpretations?archivo_id=1
```

```http
POST /api/files/interpretations
{
  "id_archivo": 1,
  "id_medico": 1,
  "id_consulta": 1,
  "fuente": "Hospital Central",
  "resultado": "Sin anomalías detectadas"
}
```

---

## 🏢 Aseguradoras

### Aseguradoras

```http
GET /api/insurance/companies?search=seguros
POST /api/insurance/companies
{
  "nombre": "Seguros Monterrey",
  "rfc": "SEG123456ABC",
  "telefono": "555-4001",
  "correo": "contacto@segurosmt.com"
}
```

### Pólizas

```http
GET /api/insurance/policies?search=juan
POST /api/insurance/policies
{
  "id_paciente": 1,
  "id_aseguradora": 1,
  "numero_poliza": "POL-2024-001",
  "vigente_desde": "2024-01-01",
  "vigente_hasta": "2024-12-31"
}
```

---

## 🔔 Notificaciones

### Notificaciones

```http
GET /api/notifications?search=email
POST /api/notifications
{
  "id_usuario": 1,
  "id_cita": 1,
  "mensaje": "Recordatorio: Cita mañana a las 10:00 AM",
  "canal": "Email",
  "fecha_envio": "2024-11-14T09:00:00",
  "estado": "Pendiente"
}
```

### Códigos de Acceso

```http
GET /api/notifications/access-codes
POST /api/notifications/access-codes
{
  "codigo": "ACC-2024-001",
  "id_usuario": 1,
  "expira_en": "2024-12-01T00:00:00",
  "usado_en": null,
  "id_estado_codigo": 1
}
```

---

## 📝 Auditoría

### Listar Registros de Auditoría

```http
GET /api/audit?entidad=USUARIO&accion=CREATE&fecha_desde=2024-11-01&limit=50
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": 1,
      "usuario_id": 1,
      "username": "admin",
      "accion": "CREATE",
      "entidad": "USUARIO",
      "entidad_id": 3,
      "fecha_hora": "2024-11-15T10:30:00",
      "detalle": { "username": "doctor1" }
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

### Estadísticas de Auditoría

```http
GET /api/audit/stats
```

**Respuesta:**

```json
{
  "entityStats": [
    { "entidad": "CITA", "count": "45" },
    { "entidad": "USUARIO", "count": "23" }
  ],
  "actionStats": [
    { "accion": "CREATE", "count": "67" },
    { "accion": "UPDATE", "count": "45" }
  ]
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado                                |
| ------ | ------------------------------------------ |
| 200    | OK - Solicitud exitosa                     |
| 201    | Created - Recurso creado                   |
| 400    | Bad Request - Datos inválidos              |
| 401    | Unauthorized - No autenticado              |
| 403    | Forbidden - Sin permisos                   |
| 404    | Not Found - Recurso no encontrado          |
| 409    | Conflict - Duplicado (unique constraint)   |
| 500    | Internal Server Error - Error del servidor |

---

## 🔄 Ejemplos de Uso Completo

### Flujo Completo: Crear Paciente con Dirección

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | jq -r '.token' > token.txt

# 2. Crear Usuario para Paciente
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $(cat token.txt)" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "correo": "juan@email.com",
    "telefono": "555-2001",
    "password": "password123",
    "rol_id": 2
  }' | jq '.id' > user_id.txt

# 3. Crear Paciente
curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $(cat token.txt)" \
  -H "Content-Type: application/json" \
  -d "{
    \"usuario_id\": $(cat user_id.txt),
    \"fecha_nacimiento\": \"1985-05-15\",
    \"sexo\": \"M\",
    \"id_tipo_sangre\": 7
  }" | jq '.id' > patient_id.txt

# 4. Agregar Dirección
curl -X POST http://localhost:5000/api/patients/$(cat patient_id.txt)/addresses \
  -H "Authorization: Bearer $(cat token.txt)" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Av. Constitución",
    "numero_ext": "123",
    "numero_int": "4B",
    "id_colonia": 1
  }'
```

### Flujo: Programar Cita

```bash
# 1. Crear Cita
curl -X POST http://localhost:5000/api/appointments/citas \
  -H "Authorization: Bearer $(cat token.txt)" \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": 1,
    "medico_id": 1,
    "id_consultorio": 1,
    "fecha_inicio": "2024-11-20T10:00:00",
    "fecha_fin": "2024-11-20T10:30:00",
    "id_estado_cita": 1,
    "id_tipo_cita": 1
  }'

# 2. Crear Consulta para la Cita
curl -X POST http://localhost:5000/api/appointments/consultas \
  -H "Authorization: Bearer $(cat token.txt)" \
  -H "Content-Type: application/json" \
  -d '{
    "cita_id": 1,
    "id_estado_consulta": 1,
    "narrativa": "Consulta general de seguimiento"
  }'
```

---

## 🎯 Filtros Avanzados

### Citas por Rango de Fechas

```http
GET /api/appointments/citas?fecha_desde=2024-11-01&fecha_hasta=2024-11-30
```

### Citas de un Médico Específico

```http
GET /api/appointments/citas?medico_id=1&id_estado_cita=1
```

### Auditoría Filtrada

```http
GET /api/audit?entidad=CITA&accion=CREATE&fecha_desde=2024-11-01
```

---

## 💡 Tips

1. **Paginación**: Siempre usa `limit` y `offset` para listas grandes
2. **Búsqueda**: El parámetro `search` funciona con ILIKE (case-insensitive)
3. **Fechas**: Usa formato ISO 8601 (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
4. **NULLs**: Campos opcionales pueden omitirse o enviarse como `null`
5. **Auditoría**: Se registra automáticamente, no requiere acción manual

---

**Todos los endpoints requieren autenticación excepto `/api/auth/login`** 🔒
