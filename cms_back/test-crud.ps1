# Script de Testing CRUD Completo
# Ejecutar con:
#   powershell -ExecutionPolicy Bypass -File .\crud-test-api.ps1

# ================== CONFIG ==================
$TOKEN  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MDE3NDcxOSwiZXhwIjoxNzYwMjYxMTE5fQ.WKTXq1ejptETEew0TsgexZZ_dvGgMSgB0yRhXHK6EOU'
$ApiUrl = 'http://localhost:5000/api'

$Headers = @{
  Authorization = "Bearer $TOKEN"
  'Content-Type' = 'application/json'
}

function Invoke-Api {
  param(
    [Parameter(Mandatory)][string]$Uri,
    [ValidateSet('GET','POST','PUT','PATCH','DELETE')][string]$Method = 'GET',
    [object]$Body = $null,
    [hashtable]$Headers
  )
  try {
    if ($Body -ne $null) {
      $json = if ($Body -is [string]) { $Body } else { ($Body | ConvertTo-Json -Depth 6) }
      return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -Body $json
    } else {
      return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers
    }
  }
  catch {
    Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red
    if ($_.Exception.Response -and $_.Exception.Response.ContentLength -gt 0) {
      try {
        $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $resp = $sr.ReadToEnd()
        Write-Host "Respuesta del servidor:" -ForegroundColor DarkYellow
        Write-Host $resp
      } catch {}
    }
  }
}

Write-Host "CMS API - CRUD Testing" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

# ========== 1. CREAR USUARIO ==========
Write-Host "`n1) Creando Usuario..." -ForegroundColor Yellow
$newUser = @{
  username = ("test_user_{0}" -f (Get-Random -Minimum 1000 -Maximum 9999))
  correo   = ("test{0}@email.com" -f (Get-Random -Minimum 100 -Maximum 999))
  telefono = ("555-{0}" -f (Get-Random -Minimum 1000 -Maximum 9999))
  password = "password123"
  rol_id   = 2
}
try {
  $userCreated = Invoke-Api -Uri "$ApiUrl/users" -Method POST -Headers $Headers -Body $newUser
  $userId = $userCreated.id
  Write-Host ("OK Usuario creado. ID: {0}" -f $userId) -ForegroundColor Green

  $user = Invoke-Api -Uri "$ApiUrl/users/$userId" -Headers $Headers
  if ($user) { Write-Host ("Datos: {0} - {1}" -f $user.username, $user.correo) }

  $updateUser = @{
    username = ($user.username + "_updated")
    correo   = $user.correo
    telefono = "555-9999"
    rol_id   = 2
  }
  $updated = Invoke-Api -Uri "$ApiUrl/users/$userId" -Method PUT -Headers $Headers -Body $updateUser
  if ($updated) { Write-Host "OK Usuario actualizado" -ForegroundColor Green }

  # Eliminar usuario (descomentar si deseas borrar)
  # Invoke-Api -Uri "$ApiUrl/users/$userId" -Method DELETE -Headers $Headers
  # Write-Host "OK Usuario eliminado" -ForegroundColor Green
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 2. CREAR ESPECIALIDAD ==========
Write-Host "`n2) Creando Especialidad..." -ForegroundColor Yellow
$newEspecialidad = @{
  nombre = ("Cardiologia Test {0}" -f (Get-Random -Minimum 100 -Maximum 999))
}
try {
  $espCreated = Invoke-Api -Uri "$ApiUrl/catalogs/especialidades" -Method POST -Headers $Headers -Body $newEspecialidad
  $espId = $espCreated.id
  Write-Host ("OK Especialidad creada. ID: {0}" -f $espId) -ForegroundColor Green

  $esp = Invoke-Api -Uri "$ApiUrl/catalogs/especialidades/$espId" -Headers $Headers
  if ($esp) { Write-Host ("Nombre: {0}" -f $esp.nombre) }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 3. CREAR CLINICA ==========
Write-Host "`n3) Creando Clinica..." -ForegroundColor Yellow
$newClinica = @{
  nombre   = ("Clinica Test {0}" -f (Get-Random -Minimum 100 -Maximum 999))
  telefono = ("555-{0}" -f (Get-Random -Minimum 1000 -Maximum 9999))
  correo   = ("clinica{0}@test.com" -f (Get-Random -Minimum 100 -Maximum 999))
}
try {
  $clinicaCreated = Invoke-Api -Uri "$ApiUrl/clinics" -Method POST -Headers $Headers -Body $newClinica
  $clinicaId = $clinicaCreated.id
  Write-Host ("OK Clinica creada. ID: {0}" -f $clinicaId) -ForegroundColor Green

  $clinica = Invoke-Api -Uri "$ApiUrl/clinics/$clinicaId" -Headers $Headers
  if ($clinica) { Write-Host ("Nombre: {0}" -f $clinica.nombre) }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 4. LISTAR CITAS ==========
Write-Host "`n4) Listando Citas..." -ForegroundColor Yellow
try {
  $citas = Invoke-Api -Uri "$ApiUrl/appointments/citas?limit=3" -Headers $Headers
  if ($citas) { Write-Host ("OK Total citas: {0}" -f $citas.pagination.total) -ForegroundColor Green }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 5. LISTAR CONSULTAS ==========
Write-Host "`n5) Listando Consultas..." -ForegroundColor Yellow
try {
  $consultas = Invoke-Api -Uri "$ApiUrl/appointments/consultas?limit=3" -Headers $Headers
  if ($consultas) { Write-Host ("OK Total consultas: {0}" -f $consultas.pagination.total) -ForegroundColor Green }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 6. GEOGRAFIA CASCADING ==========
Write-Host "`n6) Geografia Cascading..." -ForegroundColor Yellow
try {
  $paises = Invoke-Api -Uri "$ApiUrl/geography/paises?limit=1" -Headers $Headers
  if ($paises -and $paises.data.Count -gt 0) {
    $paisId = $paises.data[0].id
    $paisNombre = $paises.data[0].nombre
    Write-Host ("Pais: {0} (ID: {1})" -f $paisNombre, $paisId)

    $estados = Invoke-Api -Uri "$ApiUrl/geography/estados?pais_id=$paisId" -Headers $Headers
    if ($estados -and $estados.data.Count -gt 0) {
      $estadoId = $estados.data[0].id
      $estadoNombre = $estados.data[0].nombre
      Write-Host ("  Estado: {0} (ID: {1})" -f $estadoNombre, $estadoId)

      $ciudades = Invoke-Api -Uri "$ApiUrl/geography/ciudades?estado_id=$estadoId" -Headers $Headers
      if ($ciudades -and $ciudades.data.Count -gt 0) {
        $ciudadId = $ciudades.data[0].id
        $ciudadNombre = $ciudades.data[0].nombre
        Write-Host ("    Ciudad: {0} (ID: {1})" -f $ciudadNombre, $ciudadId)

        $colonias = Invoke-Api -Uri "$ApiUrl/geography/colonias?ciudad_id=$ciudadId&limit=2" -Headers $Headers
        if ($colonias) {
          Write-Host ("      Colonias: {0} encontradas" -f $colonias.data.Count)
        }
      }
    }
  }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 7. ASEGURADORAS Y POLIZAS ==========
Write-Host "`n7) Aseguradoras y Polizas..." -ForegroundColor Yellow
try {
  $aseguradoras = Invoke-Api -Uri "$ApiUrl/insurance/companies?limit=3" -Headers $Headers
  if ($aseguradoras) { Write-Host ("OK Total aseguradoras: {0}" -f $aseguradoras.pagination.total) -ForegroundColor Green }

  $polizas = Invoke-Api -Uri "$ApiUrl/insurance/policies?limit=3" -Headers $Headers
  if ($polizas) { Write-Host ("OK Total polizas: {0}" -f $polizas.pagination.total) -ForegroundColor Green }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

# ========== 8. AUDITORIA ==========
Write-Host "`n8) Auditoria..." -ForegroundColor Yellow
try {
  $audit = Invoke-Api -Uri "$ApiUrl/audit?limit=5" -Headers $Headers
  if ($audit) {
    Write-Host ("OK Total registros: {0}" -f $audit.pagination.total) -ForegroundColor Green
    Write-Host "Ultimas acciones:"
    $audit.data | ForEach-Object {
      Write-Host ("  - {0} en {1} por {2}" -f $_.accion, $_.entidad, $_.username)
    }
  }
}
catch { Write-Host ("Error: {0}" -f $_.Exception.Message) -ForegroundColor Red }

Write-Host "`n[OK] Testing Completado!" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Cyan
