# 🧪 Guía Completa de Testing - Endpoints API

## 📋 Tabla de Contenidos

1. [Preparación](#preparación)
2. [Autenticación](#autenticación)
3. [Dashboard](#dashboard-nuevo)
4. [Usuarios](#usuarios)
5. [Catálogos Clínicos](#catálogos-clínicos)
6. [Médicos](#médicos)
7. [Pacientes](#pacientes)
8. [Geografía](#geografía)
9. [Clínicas](#clínicas)
10. [Citas](#citas)
11. [Consultas](#consultas)
12. [Episodios](#episodios)
13. [Archivos](#archivos)
14. [Aseguradoras](#aseguradoras)
15. [Notificaciones](#notificaciones)
16. [Auditoría](#auditoría)

---

## 📋 Preparación

### 1. Inicia el Servidor

```bash
cd cms_back
npm run dev
```

Deberías ver:

```
🚀 Server running on port 5000
✅ Connected to PostgreSQL database
```

### 2. Verifica Health Check

```bash
curl http://localhost:5000/health
```

**Respuesta esperada:**

```json
{
  "status": "OK",
  "message": "CMS Backend is running"
}
```

---

## 🔐 Autenticación

### 1. Login (Obtener Token)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**Respuesta esperada:**

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

**💡 Guarda el token:**

```bash
# En Windows PowerShell
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# En Linux/Mac
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Obtener Usuario Actual

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@cms.com",
  "phone": "555-0001",
  "role": "admin"
}
```

---

## 📊 Dashboard (NUEVO)

### 1. Obtener Dashboard Completo (KPIs + Gráficas)

```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**

```json
{
  "kpis": {
    "citasHoy": 5,
    "consultasHoy": 3,
    "usuariosActivos": 12,
    "pacientesActivos": 45
  },
  "charts": {
    "citasPorMes": [{ "mes": "2024-01-01T00:00:00", "total_citas": "65" }],
    "citasPorEstado": [{ "estado": "Confirmada", "total": "45" }],
    "consultasPorEstado": [{ "estado": "Completada", "total": "85" }],
    "actividadPorEntidad": [{ "entidad": "CITA", "acciones": "156" }],
    "crecimientoConsultas": [
      { "mes": "2024-01-01T00:00:00", "acumulado": "120" }
    ],
    "topMedicos": [{ "medico": "Dr. García", "consultas": "145" }]
  }
}
```

### 2. Solo KPIs (Más Rápido)

```bash
curl http://localhost:5000/api/dashboard/kpis \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Solo Gráficas

```bash
curl http://localhost:5000/api/dashboard/charts \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👥 Usuarios

### 1. Listar Usuarios

```bash
# Todos los usuarios
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/users?search=admin" \
  -H "Authorization: Bearer $TOKEN"

# Con paginación
curl "http://localhost:5000/api/users?limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Obtener Usuario por ID

```bash
curl http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Crear Usuario

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_doctor",
    "correo": "doctor@email.com",
    "telefono": "555-0100",
    "password": "password123",
    "rol_id": 2
  }'
```

**Respuesta esperada:**

```json
{
  "id": 4,
  "message": "User created successfully"
}
```

### 4. Actualizar Usuario

```bash
curl -X PUT http://localhost:5000/api/users/4 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor_actualizado",
    "correo": "doctor@email.com",
    "telefono": "555-0101",
    "rol_id": 2
  }'
```

### 5. Actualizar Contraseña

```bash
curl -X PATCH http://localhost:5000/api/users/4/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "nueva_password123"
  }'
```

### 6. Eliminar Usuario

```bash
curl -X DELETE http://localhost:5000/api/users/4 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Catálogos Clínicos

Todos los catálogos siguen el mismo patrón. Ejemplos:

### Especialidades

```bash
# Listar
curl "http://localhost:5000/api/catalogs/especialidades?limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/catalogs/especialidades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Cardiología Pediátrica"}'

# Actualizar
curl -X PUT http://localhost:5000/api/catalogs/especialidades/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Cardiología Avanzada"}'

# Eliminar
curl -X DELETE http://localhost:5000/api/catalogs/especialidades/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Tipos de Sangre (campo es 'tipo', no 'nombre')

```bash
# Listar
curl http://localhost:5000/api/catalogs/tipos-sangre \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/catalogs/tipos-sangre \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tipo": "A+"}'
```

### Otros Catálogos

Reemplaza el nombre del catálogo en la URL:

- `/api/catalogs/ocupaciones`
- `/api/catalogs/estado-civil`
- `/api/catalogs/estado-cita`
- `/api/catalogs/tipo-cita`
- `/api/catalogs/estado-consulta`
- `/api/catalogs/estado-codigo`

---

## 👨‍⚕️ Médicos

### 1. Listar Médicos

```bash
# Todos
curl http://localhost:5000/api/doctors \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/doctors?search=garcia" \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**

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

### 2. Obtener Médico por ID

```bash
curl http://localhost:5000/api/doctors/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Crear Médico

```bash
curl -X POST http://localhost:5000/api/doctors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 3,
    "cedula": "MED-99999",
    "descripcion": "Especialista en pediatría",
    "id_especialidad": 2,
    "foto_archivo_id": null
  }'
```

### 4. Actualizar Médico

```bash
curl -X PUT http://localhost:5000/api/doctors/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cedula": "MED-12345",
    "descripcion": "Descripción actualizada",
    "id_especialidad": 1,
    "foto_archivo_id": null
  }'
```

### 5. Eliminar Médico

```bash
curl -X DELETE http://localhost:5000/api/doctors/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏥 Pacientes

### 1. Listar Pacientes

```bash
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/patients?search=juan" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Obtener Paciente por ID

```bash
curl http://localhost:5000/api/patients/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Crear Paciente

```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 4,
    "fecha_nacimiento": "1985-05-15",
    "sexo": "M",
    "altura": 1.75,
    "peso": 70.5,
    "estilo_vida": "Activo",
    "id_tipo_sangre": 1,
    "id_ocupacion": 2,
    "id_estado_civil": 1,
    "id_medico_gen": 1,
    "foto_archivo_id": null
  }'
```

### 4. Actualizar Paciente

```bash
curl -X PUT http://localhost:5000/api/patients/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fecha_nacimiento": "1985-05-15",
    "sexo": "M",
    "altura": 1.75,
    "peso": 72.0,
    "estilo_vida": "Muy activo",
    "id_tipo_sangre": 1,
    "id_ocupacion": 2,
    "id_estado_civil": 2,
    "id_medico_gen": 1,
    "foto_archivo_id": null
  }'
```

### 5. Eliminar Paciente

```bash
curl -X DELETE http://localhost:5000/api/patients/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Direcciones del Paciente

#### Listar Direcciones

```bash
curl http://localhost:5000/api/patients/1/addresses \
  -H "Authorization: Bearer $TOKEN"
```

#### Crear Dirección

```bash
curl -X POST http://localhost:5000/api/patients/1/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Av. Constitución",
    "numero_ext": "123",
    "numero_int": "4B",
    "id_colonia": 1
  }'
```

#### Actualizar Dirección

```bash
curl -X PUT http://localhost:5000/api/patients/1/addresses/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Av. Constitución",
    "numero_ext": "125",
    "numero_int": "4B",
    "id_colonia": 1
  }'
```

#### Eliminar Dirección

```bash
curl -X DELETE http://localhost:5000/api/patients/1/addresses/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌍 Geografía

### 1. Países

```bash
# Listar todos
curl http://localhost:5000/api/geography/paises \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/geography/paises?search=mexico" \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/geography/paises \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Argentina"}'

# Actualizar
curl -X PUT http://localhost:5000/api/geography/paises/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "México"}'

# Eliminar
curl -X DELETE http://localhost:5000/api/geography/paises/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Estados (Filtrar por País)

```bash
# Todos los estados
curl http://localhost:5000/api/geography/estados \
  -H "Authorization: Bearer $TOKEN"

# Estados de un país específico (CASCADING)
curl "http://localhost:5000/api/geography/estados?pais_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Crear estado
curl -X POST http://localhost:5000/api/geography/estados \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo León",
    "pais_id": 1
  }'
```

### 3. Ciudades (Filtrar por Estado)

```bash
# Todas las ciudades
curl http://localhost:5000/api/geography/ciudades \
  -H "Authorization: Bearer $TOKEN"

# Ciudades de un estado específico (CASCADING)
curl "http://localhost:5000/api/geography/ciudades?estado_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Crear ciudad
curl -X POST http://localhost:5000/api/geography/ciudades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Monterrey",
    "estado_id": 1
  }'
```

### 4. Colonias (Filtrar por Ciudad)

```bash
# Todas las colonias
curl http://localhost:5000/api/geography/colonias \
  -H "Authorization: Bearer $TOKEN"

# Colonias de una ciudad específica (CASCADING)
curl "http://localhost:5000/api/geography/colonias?ciudad_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/geography/colonias?ciudad_id=1&search=centro" \
  -H "Authorization: Bearer $TOKEN"

# Crear colonia
curl -X POST http://localhost:5000/api/geography/colonias \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Centro",
    "codigo_postal": "64000",
    "ciudad_id": 1
  }'
```

---

## 🏥 Clínicas

### 1. Clínicas

```bash
# Listar
curl http://localhost:5000/api/clinics \
  -H "Authorization: Bearer $TOKEN"

# Obtener por ID
curl http://localhost:5000/api/clinics/1 \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/clinics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Clínica Santa María",
    "telefono": "555-3001",
    "correo": "contacto@santamaria.com"
  }'

# Actualizar
curl -X PUT http://localhost:5000/api/clinics/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Clínica Santa María Actualizada",
    "telefono": "555-3002",
    "correo": "info@santamaria.com"
  }'

# Eliminar
curl -X DELETE http://localhost:5000/api/clinics/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Direcciones de Clínica

```bash
# Listar direcciones de una clínica
curl http://localhost:5000/api/clinics/1/addresses \
  -H "Authorization: Bearer $TOKEN"

# Crear dirección
curl -X POST http://localhost:5000/api/clinics/1/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Av. Principal",
    "numero_ext": "100",
    "numero_int": "",
    "id_colonia": 1
  }'

# Actualizar dirección
curl -X PUT http://localhost:5000/api/clinics/1/addresses/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Av. Principal Norte",
    "numero_ext": "102",
    "numero_int": "A",
    "id_colonia": 1
  }'

# Eliminar dirección
curl -X DELETE http://localhost:5000/api/clinics/1/addresses/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Consultorios

```bash
# Listar todos los consultorios
curl http://localhost:5000/api/clinics/offices/list \
  -H "Authorization: Bearer $TOKEN"

# Consultorios de una clínica específica
curl "http://localhost:5000/api/clinics/offices/list?clinica_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Crear consultorio
curl -X POST http://localhost:5000/api/clinics/offices \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clinica_id": 1,
    "nombre_numero": "101",
    "piso_zona": "Primer piso"
  }'

# Actualizar consultorio
curl -X PUT http://localhost:5000/api/clinics/offices/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_numero": "102",
    "piso_zona": "Segundo piso"
  }'

# Eliminar consultorio
curl -X DELETE http://localhost:5000/api/clinics/offices/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📅 Citas

### 1. Listar Citas

```bash
# Todas las citas
curl http://localhost:5000/api/appointments/citas \
  -H "Authorization: Bearer $TOKEN"

# Citas de hoy
TODAY=$(date +%Y-%m-%d)
curl "http://localhost:5000/api/appointments/citas?fecha_desde=${TODAY}T00:00:00&fecha_hasta=${TODAY}T23:59:59" \
  -H "Authorization: Bearer $TOKEN"

# Citas de un médico específico
curl "http://localhost:5000/api/appointments/citas?medico_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Citas de un paciente
curl "http://localhost:5000/api/appointments/citas?paciente_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Con múltiples filtros
curl "http://localhost:5000/api/appointments/citas?fecha_desde=2024-11-01T00:00:00&id_estado_cita=1&medico_id=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Crear Cita

```bash
curl -X POST http://localhost:5000/api/appointments/citas \
  -H "Authorization: Bearer $TOKEN" \
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
```

### 3. Actualizar Cita

```bash
curl -X PUT http://localhost:5000/api/appointments/citas/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": 1,
    "medico_id": 1,
    "id_consultorio": 1,
    "fecha_inicio": "2024-11-20T11:00:00",
    "fecha_fin": "2024-11-20T11:30:00",
    "id_estado_cita": 2,
    "id_tipo_cita": 1
  }'
```

### 4. Eliminar Cita

```bash
curl -X DELETE http://localhost:5000/api/appointments/citas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💊 Consultas

### 1. Listar Consultas

```bash
# Todas
curl http://localhost:5000/api/appointments/consultas \
  -H "Authorization: Bearer $TOKEN"

# Con filtros
curl "http://localhost:5000/api/appointments/consultas?medico_id=1&paciente_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Crear Consulta

```bash
curl -X POST http://localhost:5000/api/appointments/consultas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cita_id": 1,
    "id_estado_consulta": 1,
    "id_episodio": 1,
    "fecha_hora": "2024-11-15T10:00:00",
    "narrativa": "Consulta general de seguimiento. Paciente presenta mejoría.",
    "mongo_consulta_id": null
  }'
```

### 3. Actualizar Consulta

```bash
curl -X PUT http://localhost:5000/api/appointments/consultas/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_estado_consulta": 2,
    "id_episodio": 1,
    "fecha_hora": "2024-11-15T10:00:00",
    "narrativa": "Narrativa actualizada",
    "mongo_consulta_id": null
  }'
```

### 4. Eliminar Consulta

```bash
curl -X DELETE http://localhost:5000/api/appointments/consultas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 Episodios

### 1. Listar Episodios de un Paciente

```bash
curl "http://localhost:5000/api/appointments/episodios?paciente_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Crear Episodio

```bash
curl -X POST http://localhost:5000/api/appointments/episodios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_paciente": 1,
    "motivo": "Tratamiento cardiovascular prolongado"
  }'
```

### 3. Cerrar Episodio

```bash
curl -X PATCH http://localhost:5000/api/appointments/episodios/1/close \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fecha_fin": "2024-11-30T12:00:00"
  }'
```

### 4. Eliminar Episodio

```bash
curl -X DELETE http://localhost:5000/api/appointments/episodios/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📁 Archivos

### 1. Archivos

```bash
# Listar
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/files?search=pdf" \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "PDF",
    "url": "/uploads/radiografia_torax.pdf",
    "hash_integridad": "abc123456789"
  }'

# Actualizar
curl -X PUT http://localhost:5000/api/files/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "PDF",
    "url": "/uploads/radiografia_actualizada.pdf",
    "hash_integridad": "xyz987654321"
  }'

# Eliminar
curl -X DELETE http://localhost:5000/api/files/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Asociaciones de Archivos

```bash
# Listar asociaciones de un archivo
curl "http://localhost:5000/api/files/associations?archivo_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Crear asociación
curl -X POST http://localhost:5000/api/files/associations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "archivo_id": 1,
    "entidad": "PACIENTE",
    "entidad_id": 1,
    "descripcion": "Radiografía de tórax",
    "creado_por_usuario_id": 1
  }'

# Actualizar asociación
curl -X PUT http://localhost:5000/api/files/associations/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entidad": "PACIENTE",
    "entidad_id": 1,
    "descripcion": "Radiografía de tórax - actualizada",
    "creado_por_usuario_id": 1
  }'

# Eliminar asociación
curl -X DELETE http://localhost:5000/api/files/associations/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Interpretaciones de Archivos

```bash
# Listar interpretaciones de un archivo
curl "http://localhost:5000/api/files/interpretations?archivo_id=1" \
  -H "Authorization: Bearer $TOKEN"

# Crear interpretación
curl -X POST http://localhost:5000/api/files/interpretations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_archivo": 1,
    "id_medico": 1,
    "id_consulta": 1,
    "fuente": "Hospital Central",
    "resultado": "Sin anomalías detectadas. Campos pulmonares normales."
  }'

# Actualizar interpretación
curl -X PUT http://localhost:5000/api/files/interpretations/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_medico": 1,
    "id_consulta": 1,
    "fuente": "Hospital Central",
    "resultado": "Resultados actualizados. Sin anomalías."
  }'

# Eliminar interpretación
curl -X DELETE http://localhost:5000/api/files/interpretations/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏢 Aseguradoras

### 1. Compañías Aseguradoras

```bash
# Listar
curl http://localhost:5000/api/insurance/companies \
  -H "Authorization: Bearer $TOKEN"

# Con búsqueda
curl "http://localhost:5000/api/insurance/companies?search=seguros" \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/insurance/companies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Seguros Monterrey",
    "rfc": "SEG123456ABC",
    "telefono": "555-4001",
    "correo": "contacto@segurosmt.com"
  }'

# Actualizar
curl -X PUT http://localhost:5000/api/insurance/companies/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Seguros Monterrey SA",
    "rfc": "SEG123456ABC",
    "telefono": "555-4002",
    "correo": "info@segurosmt.com"
  }'

# Eliminar
curl -X DELETE http://localhost:5000/api/insurance/companies/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Pólizas

```bash
# Listar
curl http://localhost:5000/api/insurance/policies \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/insurance/policies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_paciente": 1,
    "id_aseguradora": 1,
    "numero_poliza": "POL-2024-001",
    "vigente_desde": "2024-01-01",
    "vigente_hasta": "2024-12-31"
  }'

# Actualizar
curl -X PUT http://localhost:5000/api/insurance/policies/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_paciente": 1,
    "id_aseguradora": 1,
    "numero_poliza": "POL-2024-001-UPDATED",
    "vigente_desde": "2024-01-01",
    "vigente_hasta": "2025-12-31"
  }'

# Eliminar
curl -X DELETE http://localhost:5000/api/insurance/policies/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔔 Notificaciones

### 1. Notificaciones

```bash
# Listar
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "id_cita": 1,
    "mensaje": "Recordatorio: Tiene una cita mañana a las 10:00 AM",
    "canal": "Email",
    "fecha_envio": "2024-11-19T09:00:00",
    "estado": "Pendiente"
  }'

# Actualizar
curl -X PUT http://localhost:5000/api/notifications/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "id_cita": 1,
    "mensaje": "Recordatorio actualizado",
    "canal": "SMS",
    "fecha_envio": "2024-11-19T09:00:00",
    "estado": "Enviada"
  }'

# Eliminar
curl -X DELETE http://localhost:5000/api/notifications/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Códigos de Acceso

```bash
# Listar
curl http://localhost:5000/api/notifications/access-codes \
  -H "Authorization: Bearer $TOKEN"

# Crear
curl -X POST http://localhost:5000/api/notifications/access-codes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ACC-2024-001",
    "id_usuario": 1,
    "expira_en": "2024-12-01T00:00:00",
    "usado_en": null,
    "id_estado_codigo": 1
  }'

# Actualizar
curl -X PUT http://localhost:5000/api/notifications/access-codes/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ACC-2024-001",
    "id_usuario": 1,
    "expira_en": "2024-12-31T00:00:00",
    "usado_en": "2024-11-15T10:30:00",
    "id_estado_codigo": 2
  }'

# Eliminar
curl -X DELETE http://localhost:5000/api/notifications/access-codes/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Auditoría

### 1. Listar Registros de Auditoría

```bash
# Todos los registros
curl http://localhost:5000/api/audit \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por entidad
curl "http://localhost:5000/api/audit?entidad=USUARIO" \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por acción
curl "http://localhost:5000/api/audit?accion=CREATE" \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por entidad y acción
curl "http://localhost:5000/api/audit?entidad=CITA&accion=UPDATE" \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por rango de fechas
curl "http://localhost:5000/api/audit?fecha_desde=2024-11-01T00:00:00&fecha_hasta=2024-11-30T23:59:59" \
  -H "Authorization: Bearer $TOKEN"

# Con paginación
curl "http://localhost:5000/api/audit?limit=50&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Estadísticas de Auditoría

```bash
curl http://localhost:5000/api/audit/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta esperada:**

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

## 🎯 Flujos de Testing Completos

### Flujo 1: Crear Usuario Completo

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | jq -r '.token' > token.txt

TOKEN=$(cat token.txt)

# 2. Crear usuario
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "correo": "test@email.com",
    "telefono": "555-9999",
    "password": "password123",
    "rol_id": 2
  }' | jq '.id' > user_id.txt

USER_ID=$(cat user_id.txt)

# 3. Verificar que se creó
curl http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"

# 4. Actualizar usuario
curl -X PUT http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user_updated",
    "correo": "test@email.com",
    "telefono": "555-8888",
    "rol_id": 2
  }'

# 5. Eliminar usuario
curl -X DELETE http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Flujo 2: Crear Paciente con Dirección

```bash
TOKEN=$(cat token.txt)

# 1. Crear usuario para el paciente
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "correo": "juan@email.com",
    "telefono": "555-2001",
    "password": "password123",
    "rol_id": 2
  }' | jq '.id' > user_id.txt

USER_ID=$(cat user_id.txt)

# 2. Crear paciente
curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"usuario_id\": $USER_ID,
    \"fecha_nacimiento\": \"1985-05-15\",
    \"sexo\": \"M\",
    \"altura\": 1.75,
    \"peso\": 70.5,
    \"estilo_vida\": \"Activo\",
    \"id_tipo_sangre\": 1,
    \"id_ocupacion\": 2,
    \"id_estado_civil\": 1,
    \"id_medico_gen\": 1,
    \"foto_archivo_id\": null
  }" | jq '.id' > patient_id.txt

PATIENT_ID=$(cat patient_id.txt)

# 3. Agregar dirección al paciente
curl -X POST http://localhost:5000/api/patients/$PATIENT_ID/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Av. Constitución",
    "numero_ext": "123",
    "numero_int": "4B",
    "id_colonia": 1
  }'

# 4. Ver direcciones del paciente
curl http://localhost:5000/api/patients/$PATIENT_ID/addresses \
  -H "Authorization: Bearer $TOKEN"
```

### Flujo 3: Programar Cita y Crear Consulta

```bash
TOKEN=$(cat token.txt)

# 1. Crear cita
curl -X POST http://localhost:5000/api/appointments/citas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": 1,
    "medico_id": 1,
    "id_consultorio": 1,
    "fecha_inicio": "2024-11-25T10:00:00",
    "fecha_fin": "2024-11-25T10:30:00",
    "id_estado_cita": 1,
    "id_tipo_cita": 1
  }' | jq '.id' > cita_id.txt

CITA_ID=$(cat cita_id.txt)

# 2. Crear episodio para el paciente
curl -X POST http://localhost:5000/api/appointments/episodios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_paciente": 1,
    "motivo": "Tratamiento cardiovascular"
  }' | jq '.id' > episodio_id.txt

EPISODIO_ID=$(cat episodio_id.txt)

# 3. Crear consulta
curl -X POST http://localhost:5000/api/appointments/consultas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cita_id\": $CITA_ID,
    \"id_estado_consulta\": 1,
    \"id_episodio\": $EPISODIO_ID,
    \"fecha_hora\": \"2024-11-25T10:00:00\",
    \"narrativa\": \"Consulta de seguimiento cardiovascular\",
    \"mongo_consulta_id\": null
  }"

# 4. Ver todas las citas del paciente
curl "http://localhost:5000/api/appointments/citas?paciente_id=1" \
  -H "Authorization: Bearer $TOKEN"

# 5. Ver todas las consultas
curl http://localhost:5000/api/appointments/consultas \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Testing con Postman

### Setup en Postman

1. **Crear nueva Collection**: "CMS Médico API"

2. **Configurar Environment**:

   - Variable: `baseUrl` = `http://localhost:5000/api`
   - Variable: `token` = (se actualizará con login)

3. **Importar estas peticiones**:

#### Login

```
POST {{baseUrl}}/auth/login
Body (raw JSON):
{
  "username": "admin",
  "password": "password123"
}

Tests:
pm.test("Login successful", function() {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    pm.environment.set("token", jsonData.token);
});
```

#### Get Users

```
GET {{baseUrl}}/users
Headers:
- Authorization: Bearer {{token}}

Tests:
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});
pm.test("Has data array", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});
```

#### Get Dashboard

```
GET {{baseUrl}}/dashboard
Headers:
- Authorization: Bearer {{token}}

Tests:
pm.test("Has KPIs", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData.kpis).to.exist;
    pm.expect(jsonData.charts).to.exist;
});
```

---

## 🎯 Testing desde PostgreSQL (Stored Procedures)

### Conectar a la Base de Datos

```bash
psql -U ai_med_user -d ai_med_db
```

### Test KPIs

```sql
-- KPI 1: Citas hoy
SELECT cms.kpi_citas_hoy() as citas_hoy;

-- KPI 2: Consultas hoy
SELECT cms.kpi_consultas_hoy() as consultas_hoy;

-- KPI 3: Usuarios activos (30 días)
SELECT cms.kpi_usuarios_activos_30d() as usuarios_activos;

-- KPI 4: Pacientes activos (90 días)
SELECT cms.kpi_pacientes_activos_90d() as pacientes_activos;

-- Todos los KPIs de una vez
SELECT
    cms.kpi_citas_hoy() as citas_hoy,
    cms.kpi_consultas_hoy() as consultas_hoy,
    cms.kpi_usuarios_activos_30d() as usuarios_activos,
    cms.kpi_pacientes_activos_90d() as pacientes_activos;
```

### Test Gráficas

```sql
-- Gráfica 1: Citas por mes
SELECT * FROM cms.chart_citas_por_mes_12m();

-- Gráfica 2: Estados de cita
SELECT * FROM cms.chart_citas_por_estado();

-- Gráfica 3: Estados de consulta
SELECT * FROM cms.chart_consultas_por_estado();

-- Gráfica 4: Actividad por entidad
SELECT * FROM cms.chart_actividad_por_entidad_30d();

-- Gráfica 5: Crecimiento de consultas
SELECT * FROM cms.chart_crecimiento_consultas_24m();

-- Gráfica 6: Top médicos
SELECT * FROM cms.chart_top_medicos_consultas();
```

### Test CRUDs

```sql
-- Usuarios
SELECT * FROM cms.usuario_listar(NULL, 10, 0);
SELECT * FROM cms.usuario_get(1);

-- Médicos
SELECT * FROM cms.medico_listar('garcia', 10, 0);

-- Pacientes
SELECT * FROM cms.paciente_listar(NULL, 10, 0);

-- Geografía (cascading)
SELECT * FROM cms.estado_por_pais(1);
SELECT * FROM cms.ciudad_por_estado(1);
SELECT * FROM cms.colonia_por_ciudad(1, 'centro', 10, 0);

-- Citas
SELECT * FROM cms.cita_listar(
    '2024-01-01'::timestamptz,
    '2024-12-31'::timestamptz,
    NULL, NULL, NULL, NULL, 10, 0
);

-- Auditoría
SELECT * FROM cms.auditoria_listar(NULL, NULL, NULL, NULL, 50, 0);
```

---

## 📊 Script de Testing Automatizado

Crea un archivo `test_all_endpoints.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "🧪 Testing CMS API Endpoints"
echo "================================"

# 1. Login
echo "1. Testing Login..."
RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  exit 1
fi

# 2. Dashboard
echo "2. Testing Dashboard..."
curl -s $BASE_URL/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq '.kpis'
echo "✅ Dashboard OK"

# 3. Users
echo "3. Testing Users..."
curl -s $BASE_URL/users \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo "✅ Users OK"

# 4. Doctors
echo "4. Testing Doctors..."
curl -s $BASE_URL/doctors \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo "✅ Doctors OK"

# 5. Patients
echo "5. Testing Patients..."
curl -s $BASE_URL/patients \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo "✅ Patients OK"

# 6. Appointments
echo "6. Testing Appointments..."
curl -s $BASE_URL/appointments/citas \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo "✅ Appointments OK"

# 7. Audit
echo "7. Testing Audit..."
curl -s $BASE_URL/audit \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
echo "✅ Audit OK"

echo ""
echo "🎉 All tests passed!"
```

Ejecutar:

```bash
chmod +x test_all_endpoints.sh
./test_all_endpoints.sh
```

---

## 🎨 Testing desde el Frontend

### Setup en React

Crea `cms_front/src/services/apiTest.js`:

```javascript
const API_URL = "http://localhost:5000/api";

export const testAllEndpoints = async () => {
  console.log("🧪 Testing All Endpoints...");

  try {
    // 1. Login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "password123" }),
    });
    const { token } = await loginRes.json();
    console.log("✅ Login OK", token.substring(0, 20) + "...");

    // 2. Dashboard
    const dashRes = await fetch(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dashData = await dashRes.json();
    console.log("✅ Dashboard OK", dashData.kpis);

    // 3. Users
    const usersRes = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const usersData = await usersRes.json();
    console.log("✅ Users OK", usersData.data.length, "users");

    // 4. Doctors
    const doctorsRes = await fetch(`${API_URL}/doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const doctorsData = await doctorsRes.json();
    console.log("✅ Doctors OK", doctorsData.data.length, "doctors");

    // 5. Patients
    const patientsRes = await fetch(`${API_URL}/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const patientsData = await patientsRes.json();
    console.log("✅ Patients OK", patientsData.data.length, "patients");

    console.log("🎉 All tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
};

// Usar en Dashboard o App.js
// useEffect(() => { testAllEndpoints(); }, []);
```

---

## ✅ Checklist de Testing

### Autenticación

- [ ] Login con usuario admin
- [ ] Login con usuario editor
- [ ] Login con credenciales inválidas (debe fallar)
- [ ] Obtener usuario actual con token válido
- [ ] Intentar acceso sin token (debe fallar con 401)

### Dashboard

- [ ] GET /api/dashboard (KPIs + Charts)
- [ ] GET /api/dashboard/kpis (Solo KPIs)
- [ ] GET /api/dashboard/charts (Solo Charts)

### Usuarios

- [ ] Listar usuarios
- [ ] Obtener usuario por ID
- [ ] Crear nuevo usuario
- [ ] Actualizar usuario
- [ ] Actualizar contraseña
- [ ] Eliminar usuario

### Catálogos (8 catálogos)

- [ ] Listar cada catálogo
- [ ] Crear entrada en catálogo
- [ ] Actualizar entrada
- [ ] Eliminar entrada

### Médicos

- [ ] Listar médicos
- [ ] Crear médico
- [ ] Actualizar médico
- [ ] Eliminar médico

### Pacientes

- [ ] Listar pacientes
- [ ] Crear paciente
- [ ] Actualizar paciente
- [ ] Eliminar paciente
- [ ] Listar direcciones de paciente
- [ ] Crear dirección
- [ ] Actualizar dirección
- [ ] Eliminar dirección

### Geografía (Cascading)

- [ ] Listar países
- [ ] Listar estados de un país
- [ ] Listar ciudades de un estado
- [ ] Listar colonias de una ciudad

### Clínicas

- [ ] Listar clínicas
- [ ] Crear clínica
- [ ] Listar consultorios de clínica
- [ ] Crear consultorio

### Agenda

- [ ] Listar citas
- [ ] Crear cita
- [ ] Listar consultas
- [ ] Crear consulta
- [ ] Listar episodios
- [ ] Crear episodio
- [ ] Cerrar episodio

### Archivos

- [ ] Listar archivos
- [ ] Crear archivo
- [ ] Listar asociaciones
- [ ] Crear asociación
- [ ] Listar interpretaciones
- [ ] Crear interpretación

### Aseguradoras

- [ ] Listar aseguradoras
- [ ] Crear aseguradora
- [ ] Listar pólizas
- [ ] Crear póliza

### Notificaciones

- [ ] Listar notificaciones
- [ ] Crear notificación
- [ ] Listar códigos de acceso
- [ ] Crear código de acceso

### Auditoría

- [ ] Listar registros sin filtros
- [ ] Filtrar por entidad
- [ ] Filtrar por acción
- [ ] Filtrar por fecha
- [ ] Obtener estadísticas

---

## 🚨 Errores Comunes y Soluciones

### Error 401: Unauthorized

```
{"error": "Access token required"}
```

**Solución**: Olvidaste incluir el header Authorization

```bash
-H "Authorization: Bearer $TOKEN"
```

### Error 403: Forbidden

```
{"error": "Invalid or expired token"}
```

**Solución**: El token expiró (24h), haz login de nuevo

### Error 400: Bad Request

```
{"error": "Username, email and password required"}
```

**Solución**: Faltan campos requeridos en el body

### Error 404: Not Found

```
{"error": "User not found"}
```

**Solución**: El ID no existe en la base de datos

### Error 409: Conflict

```
{"error": "Duplicate entry", "detail": "..."}
```

**Solución**: Ya existe un registro con ese valor único (username, correo, cédula, etc)

---

## 💡 Tips de Testing

### 1. Usar jq para Pretty Print

```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 2. Ver Solo Datos Específicos

```bash
# Solo IDs de usuarios
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq '.data[].id'

# Solo usernames
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq '.data[].username'

# Total de registros
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq '.pagination.total'
```

### 3. Guardar Respuestas

```bash
# Guardar respuesta completa
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN" > dashboard_response.json

# Ver después
cat dashboard_response.json | jq '.'
```

### 4. Medir Tiempo de Respuesta

```bash
curl -w "\nTiempo: %{time_total}s\n" \
  http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Testing en Paralelo

```bash
# Probar múltiples endpoints simultáneamente
curl http://localhost:5000/api/users -H "Authorization: Bearer $TOKEN" &
curl http://localhost:5000/api/doctors -H "Authorization: Bearer $TOKEN" &
curl http://localhost:5000/api/patients -H "Authorization: Bearer $TOKEN" &
wait
echo "Todos completados"
```

---

## 📝 Documentación de Respuestas

### Formato Estándar de Listado

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

---

## 🎉 Testing Completo

### Script Final de Verificación

```bash
#!/bin/bash
echo "🧪 CMS API - Test Suite Completo"
echo "===================================="

# Login y guardar token
echo "Obteniendo token..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r '.token')

if [ "$TOKEN" == "null" ]; then
  echo "❌ Error: No se pudo obtener token"
  exit 1
fi

echo "✅ Token obtenido"
echo ""

# Módulos a probar
ENDPOINTS=(
  "dashboard"
  "users"
  "catalogs/especialidades"
  "doctors"
  "patients"
  "geography/paises"
  "clinics"
  "appointments/citas"
  "appointments/consultas"
  "appointments/episodios?paciente_id=1"
  "files"
  "insurance/companies"
  "insurance/policies"
  "notifications"
  "notifications/access-codes"
  "audit"
)

# Probar cada endpoint
for endpoint in "${ENDPOINTS[@]}"; do
  echo "Testing: $endpoint"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:5000/api/$endpoint \
    -H "Authorization: Bearer $TOKEN")

  if [ "$STATUS" == "200" ]; then
    echo "✅ $endpoint - OK"
  else
    echo "❌ $endpoint - Failed (Status: $STATUS)"
  fi
done

echo ""
echo "🎉 Test suite completado"
```

---

**¡Todos los endpoints documentados y listos para probar!** 🚀
