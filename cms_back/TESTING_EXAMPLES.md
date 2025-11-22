# 🎯 Ejemplos Prácticos de Testing

Guía paso a paso con ejemplos reales para probar cada endpoint.

---

## 🚀 Setup Inicial (30 segundos)

### 1. Asegúrate que el servidor esté corriendo

```bash
cd cms_back
npm run dev
```

Deberías ver:

```
🚀 Server running on port 5000
📊 Environment: development
🔗 API: http://localhost:5000
✅ Connected to PostgreSQL database
```

### 2. Obtén un Token de Acceso

**Windows PowerShell:**

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{username="admin";password="password123"} | ConvertTo-Json) -ContentType "application/json"
$TOKEN = $response.token
Write-Host "Token: $TOKEN"
```

**Linux/Mac:**

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

---

## 📊 Ejemplo 1: Dashboard Completo

### Obtener KPIs y Gráficas

```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

**Lo que verás:**

```json
{
  "kpis": {
    "citasHoy": 5,
    "consultasHoy": 3,
    "usuariosActivos": 12,
    "pacientesActivos": 45
  },
  "charts": {
    "citasPorMes": [
      {"mes": "2024-01-01T00:00:00.000Z", "total_citas": "65"},
      {"mes": "2024-02-01T00:00:00.000Z", "total_citas": "78"},
      ...
    ],
    "topMedicos": [
      {"medico": "Dr. García", "consultas": "145"},
      {"medico": "Dra. Martínez", "consultas": "132"},
      ...
    ]
  }
}
```

### Usar en Frontend

```javascript
// En Dashboard.js
useEffect(() => {
  fetch("http://localhost:5000/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("KPIs:", data.kpis);
      console.log("Charts:", data.charts);
      setKpis(data.kpis);
      setCharts(data.charts);
    });
}, []);
```

---

## 👥 Ejemplo 2: CRUD Completo de Usuarios

### Paso a Paso

```bash
# 1. Ver usuarios actuales
echo "📋 Usuarios actuales:"
curl -s http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {id, username, correo}'

# 2. Crear nuevo usuario
echo "➕ Creando usuario..."
NEW_USER=$(curl -s -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_doctor",
    "correo": "test_doctor@cms.com",
    "telefono": "555-9999",
    "password": "password123",
    "rol_id": 2
  }')

USER_ID=$(echo $NEW_USER | jq -r '.id')
echo "✅ Usuario creado con ID: $USER_ID"

# 3. Verificar que se creó
echo "🔍 Verificando usuario creado..."
curl -s http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 4. Actualizar usuario
echo "✏️ Actualizando usuario..."
curl -s -X PUT http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_doctor_updated",
    "correo": "test_doctor@cms.com",
    "telefono": "555-8888",
    "rol_id": 2
  }' | jq '.'

# 5. Verificar actualización
curl -s http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '{username, correo, telefono}'

# 6. Eliminar usuario
echo "🗑️ Eliminando usuario..."
curl -s -X DELETE http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# 7. Verificar que se eliminó (debe dar 404)
curl -s http://localhost:5000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏥 Ejemplo 3: Flujo Completo de Paciente

### Crear Paciente con Todo

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r '.token')

echo "📝 Flujo Completo: Crear Paciente con Dirección"
echo "==============================================="

# 1. Crear usuario base
echo "1️⃣ Creando usuario..."
USER_ID=$(curl -s -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "maria_gonzalez",
    "correo": "maria@email.com",
    "telefono": "555-2002",
    "password": "password123",
    "rol_id": 2
  }' | jq -r '.id')

echo "✅ Usuario creado: ID $USER_ID"

# 2. Crear paciente
echo "2️⃣ Creando paciente..."
PATIENT_ID=$(curl -s -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"usuario_id\": $USER_ID,
    \"fecha_nacimiento\": \"1990-08-22\",
    \"sexo\": \"F\",
    \"altura\": 1.65,
    \"peso\": 58.5,
    \"estilo_vida\": \"Sedentario\",
    \"id_tipo_sangre\": 2,
    \"id_ocupacion\": 3,
    \"id_estado_civil\": 1,
    \"id_medico_gen\": 1,
    \"foto_archivo_id\": null
  }" | jq -r '.id')

echo "✅ Paciente creado: ID $PATIENT_ID"

# 3. Agregar dirección
echo "3️⃣ Agregando dirección..."
ADDRESS_ID=$(curl -s -X POST http://localhost:5000/api/patients/$PATIENT_ID/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calle": "Calle Juárez",
    "numero_ext": "456",
    "numero_int": "Depto 3",
    "id_colonia": 1
  }' | jq -r '.id')

echo "✅ Dirección creada: ID $ADDRESS_ID"

# 4. Ver paciente completo
echo "4️⃣ Datos completos del paciente:"
curl -s http://localhost:5000/api/patients/$PATIENT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 5. Ver direcciones
echo "5️⃣ Direcciones del paciente:"
curl -s http://localhost:5000/api/patients/$PATIENT_ID/addresses \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "✅ Flujo completado exitosamente!"
```

---

## 📅 Ejemplo 4: Programar Cita Completa

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r '.token')

echo "📅 Flujo: Programar Cita y Consulta"
echo "===================================="

# 1. Crear cita para mañana a las 10 AM
TOMORROW=$(date -d "+1 day" +%Y-%m-%d)

echo "1️⃣ Programando cita para $TOMORROW..."
CITA_ID=$(curl -s -X POST http://localhost:5000/api/appointments/citas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"paciente_id\": 1,
    \"medico_id\": 1,
    \"id_consultorio\": 1,
    \"fecha_inicio\": \"${TOMORROW}T10:00:00\",
    \"fecha_fin\": \"${TOMORROW}T10:30:00\",
    \"id_estado_cita\": 1,
    \"id_tipo_cita\": 1
  }" | jq -r '.id')

echo "✅ Cita programada: ID $CITA_ID"

# 2. Crear episodio
echo "2️⃣ Creando episodio médico..."
EPISODIO_ID=$(curl -s -X POST http://localhost:5000/api/appointments/episodios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_paciente": 1,
    "motivo": "Seguimiento post-operatorio"
  }' | jq -r '.id')

echo "✅ Episodio creado: ID $EPISODIO_ID"

# 3. Crear consulta para la cita
echo "3️⃣ Creando consulta..."
CONSULTA_ID=$(curl -s -X POST http://localhost:5000/api/appointments/consultas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"cita_id\": $CITA_ID,
    \"id_estado_consulta\": 1,
    \"id_episodio\": $EPISODIO_ID,
    \"fecha_hora\": \"${TOMORROW}T10:00:00\",
    \"narrativa\": \"Paciente acude a consulta de seguimiento. Se encuentra estable.\",
    \"mongo_consulta_id\": null
  }" | jq -r '.id')

echo "✅ Consulta creada: ID $CONSULTA_ID"

# 4. Ver la cita completa
echo "4️⃣ Datos completos de la cita:"
curl -s "http://localhost:5000/api/appointments/citas?paciente_id=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[0]'

echo ""
echo "✅ Flujo de cita completado!"
```

---

## 🔍 Ejemplo 5: Búsquedas Avanzadas

### Buscar en Múltiples Entidades

```bash
SEARCH_TERM="garcia"

echo "🔍 Buscando '$SEARCH_TERM' en todas las entidades..."

# Usuarios
echo "👥 Usuarios:"
curl -s "http://localhost:5000/api/users?search=$SEARCH_TERM" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[].username'

# Médicos
echo "👨‍⚕️ Médicos:"
curl -s "http://localhost:5000/api/doctors?search=$SEARCH_TERM" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {username, cedula}'

# Pacientes
echo "🏥 Pacientes:"
curl -s "http://localhost:5000/api/patients?search=$SEARCH_TERM" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {username, correo}'
```

---

## 📊 Ejemplo 6: Reportes y Auditoría

### Generar Reporte de Actividad

```bash
echo "📊 Reporte de Actividad del Sistema"
echo "===================================="

# 1. Estadísticas generales
echo "📈 Estadísticas:"
curl -s http://localhost:5000/api/audit/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 2. Últimas 10 acciones
echo "📝 Últimas 10 acciones:"
curl -s "http://localhost:5000/api/audit?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {fecha_hora, username, accion, entidad}'

# 3. Todas las creaciones del día
TODAY=$(date +%Y-%m-%d)
echo "➕ Creaciones de hoy ($TODAY):"
curl -s "http://localhost:5000/api/audit?accion=CREATE&fecha_desde=${TODAY}T00:00:00" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {hora: .fecha_hora, quien: .username, que: .entidad}'

# 4. Actividad por usuario
echo "👤 Actividad por usuario:"
curl -s http://localhost:5000/api/audit \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data | group_by(.username) | map({user: .[0].username, acciones: length})'
```

---

## 🌍 Ejemplo 7: Selects Encadenados (Geografía)

### Flow Completo de Selección

```bash
echo "🌍 Navegación Geográfica Cascading"
echo "==================================="

# 1. Listar países
echo "1️⃣ Países disponibles:"
curl -s http://localhost:5000/api/geography/paises \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {id, nombre}'

# 2. Seleccionar país (México = 1)
PAIS_ID=1
echo "2️⃣ Estados de México:"
curl -s "http://localhost:5000/api/geography/estados?pais_id=$PAIS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {id, nombre}'

# 3. Seleccionar estado (Nuevo León = 1)
ESTADO_ID=1
echo "3️⃣ Ciudades de Nuevo León:"
curl -s "http://localhost:5000/api/geography/ciudades?estado_id=$ESTADO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {id, nombre}'

# 4. Seleccionar ciudad (Monterrey = 1)
CIUDAD_ID=1
echo "4️⃣ Colonias de Monterrey:"
curl -s "http://localhost:5000/api/geography/colonias?ciudad_id=$CIUDAD_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {id, nombre, codigo_postal}'

# 5. Buscar colonia específica
echo "5️⃣ Buscar 'centro' en colonias:"
curl -s "http://localhost:5000/api/geography/colonias?ciudad_id=$CIUDAD_ID&search=centro" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {nombre, codigo_postal}'
```

---

## 🧪 Ejemplo 8: Testing de Performance

### Medir Tiempo de Respuesta

```bash
echo "⏱️ Midiendo Performance de Endpoints"
echo "======================================"

endpoints=(
  "dashboard"
  "dashboard/kpis"
  "users"
  "doctors"
  "patients"
  "appointments/citas"
  "audit"
)

for endpoint in "${endpoints[@]}"; do
  echo -n "Testing /$endpoint ... "
  time=$(curl -s -w "%{time_total}" -o /dev/null \
    http://localhost:5000/api/$endpoint \
    -H "Authorization: Bearer $TOKEN")
  echo "${time}s"
done
```

**Resultado esperado:**

```
Testing /dashboard ... 0.145s
Testing /dashboard/kpis ... 0.082s
Testing /users ... 0.034s
Testing /doctors ... 0.038s
Testing /patients ... 0.045s
Testing /appointments/citas ... 0.052s
Testing /audit ... 0.061s
```

---

## 🎮 Ejemplo 9: Test de Filtros Avanzados

### Citas con Múltiples Filtros

```bash
echo "🔍 Testing Filtros de Citas"
echo "==========================="

# Preparar fechas
HOY=$(date +%Y-%m-%d)
MANANA=$(date -d "+1 day" +%Y-%m-%d)
MES_INICIO=$(date +%Y-%m-01)
MES_FIN=$(date +%Y-%m-31)

# 1. Citas de hoy
echo "📅 Citas de hoy ($HOY):"
curl -s "http://localhost:5000/api/appointments/citas?fecha_desde=${HOY}T00:00:00&fecha_hasta=${HOY}T23:59:59" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'

# 2. Citas del mes
echo "📅 Citas del mes:"
curl -s "http://localhost:5000/api/appointments/citas?fecha_desde=${MES_INICIO}T00:00:00&fecha_hasta=${MES_FIN}T23:59:59" \
  -H "Authorization: Bearer $TOKEN" | jq '.pagination.total'

# 3. Citas de un médico específico
echo "👨‍⚕️ Citas del médico ID 1:"
curl -s "http://localhost:5000/api/appointments/citas?medico_id=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'

# 4. Citas confirmadas
echo "✅ Citas confirmadas:"
curl -s "http://localhost:5000/api/appointments/citas?id_estado_cita=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'

# 5. Combinación de filtros
echo "🎯 Citas confirmadas del médico 1 este mes:"
curl -s "http://localhost:5000/api/appointments/citas?fecha_desde=${MES_INICIO}T00:00:00&medico_id=1&id_estado_cita=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {fecha_inicio, paciente, estado}'
```

---

## 📊 Ejemplo 10: Dashboard en Tiempo Real

### Script para Monitoreo Continuo

```bash
#!/bin/bash
# Guarda como monitor_dashboard.sh

TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' | jq -r '.token')

echo "📊 Monitor de Dashboard CMS"
echo "============================"

while true; do
  clear
  echo "🔄 Actualizando... $(date +%H:%M:%S)"
  echo ""

  # KPIs
  KPIS=$(curl -s http://localhost:5000/api/dashboard/kpis \
    -H "Authorization: Bearer $TOKEN")

  echo "📊 KPIs:"
  echo "  📅 Citas hoy:         $(echo $KPIS | jq -r '.citasHoy')"
  echo "  🏥 Consultas hoy:     $(echo $KPIS | jq -r '.consultasHoy')"
  echo "  👥 Usuarios activos:  $(echo $KPIS | jq -r '.usuariosActivos')"
  echo "  👨‍⚕️ Pacientes activos: $(echo $KPIS | jq -r '.pacientesActivos')"

  echo ""
  echo "Presiona Ctrl+C para salir"
  sleep 5
done
```

---

## 🎯 Quick Test Commands

### Test Rápido de Todo

```bash
# Guarda tu token primero
TOKEN="tu_token_aqui"

# Dashboard
curl http://localhost:5000/api/dashboard/kpis -H "Authorization: Bearer $TOKEN" | jq '.'

# Usuarios
curl http://localhost:5000/api/users?limit=5 -H "Authorization: Bearer $TOKEN" | jq '.data[].username'

# Médicos
curl http://localhost:5000/api/doctors -H "Authorization: Bearer $TOKEN" | jq '.data[].cedula'

# Pacientes
curl http://localhost:5000/api/patients -H "Authorization: Bearer $TOKEN" | jq '.data[].username'

# Citas de hoy
TODAY=$(date +%Y-%m-%d)
curl "http://localhost:5000/api/appointments/citas?fecha_desde=${TODAY}T00:00:00" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'

# Auditoría última hora
curl http://localhost:5000/api/audit?limit=20 -H "Authorization: Bearer $TOKEN" \
  | jq '.data[] | {hora: .fecha_hora, quien: .username, que: .accion, donde: .entidad}'
```

---

## 💡 Pro Tips

### 1. Alias para Testing Rápido

Agrega a tu `.bashrc` o `.zshrc`:

```bash
alias cms-login='TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"password123\"}" | jq -r ".token"); echo "Token: $TOKEN"; export CMS_TOKEN=$TOKEN'

alias cms-test='curl -H "Authorization: Bearer $CMS_TOKEN"'

alias cms-dashboard='curl http://localhost:5000/api/dashboard -H "Authorization: Bearer $CMS_TOKEN" | jq "."'
```

Uso:

```bash
cms-login
cms-dashboard
cms-test http://localhost:5000/api/users | jq '.'
```

### 2. Variables de Entorno

```bash
# .env.test
export API_URL="http://localhost:5000/api"
export TEST_USER="admin"
export TEST_PASS="password123"

# Cargar
source .env.test

# Usar
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}"
```

### 3. JSON Pretty en Windows

```powershell
# Instalar jq para Windows
# O usar PowerShell nativo:
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/users" `
  -Headers @{Authorization="Bearer $TOKEN"}
$response | ConvertTo-Json -Depth 10
```

---

## 🎉 Resumen

**Tienes 3 formas de probar los endpoints:**

1. **curl** - Línea de comandos (rápido)
2. **Postman** - Interfaz gráfica (visual)
3. **PostgreSQL** - Directo con SPs (testing interno)

**125+ endpoints listos para probar** ✅

**Siguiente paso**: Elige un método y empieza a probar! 🚀
