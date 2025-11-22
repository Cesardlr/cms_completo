# 🔗 Guía de Integración Frontend-Backend

## ✅ Configuración Completada

### 1. Servicios API Creados

- ✅ `api.js` - Servicio base para todas las peticiones HTTP
- ✅ `authService.js` - Manejo de autenticación
- ✅ `dashboardService.js` - KPIs y gráficos
- ✅ `userService.js` - Gestión de usuarios
- ✅ `doctorService.js` - Gestión de médicos
- ✅ `patientService.js` - Gestión de pacientes
- ✅ `geographyService.js` - Datos geográficos
- ✅ `catalogService.js` - Catálogos del sistema

### 2. Contexto de Autenticación Actualizado

- ✅ `AuthContext.js` - Ahora usa el servicio real de autenticación
- ✅ `Login.js` - Manejo asíncrono de login con el backend

### 3. Dashboard Conectado

- ✅ `Dashboard.js` - Ahora obtiene datos reales del backend
- ✅ Indicadores de carga y manejo de errores
- ✅ Fallback a datos mock en caso de error

### 4. Hooks y Componentes

- ✅ `useApi.js` - Hook personalizado para manejo de API
- ✅ `Loading.js` - Componente de carga reutilizable

## 🚀 Cómo Usar

### 1. Iniciar el Backend

```bash
cd cms_back
npm start
```

### 2. Iniciar el Frontend

```bash
cd cms_front
npm start
```

### 3. Credenciales de Prueba

- **Usuario**: `user1`
- **Contraseña**: `password123`

## 📋 Endpoints Disponibles

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil

### Dashboard

- `GET /api/dashboard/kpis` - KPIs del sistema
- `GET /api/dashboard/charts` - Datos de gráficos
- `GET /api/dashboard` - Todos los datos

### Usuarios

- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

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

### Geografía

- `GET /api/geography/paises` - Países
- `GET /api/geography/estados` - Estados
- `GET /api/geography/ciudades` - Ciudades
- `GET /api/geography/colonias` - Colonias

### Catálogos

- `GET /api/catalogs/especialidades` - Especialidades
- `GET /api/catalogs/tipos-sangre` - Tipos de sangre
- `GET /api/catalogs/ocupaciones` - Ocupaciones
- `GET /api/catalogs/estado-civil` - Estado civil
- `GET /api/catalogs/estado-cita` - Estados de cita
- `GET /api/catalogs/tipo-cita` - Tipos de cita
- `GET /api/catalogs/estado-consulta` - Estados de consulta
- `GET /api/catalogs/estado-codigo` - Estados de código

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en `cms_front`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
```

### CORS

El backend ya está configurado para aceptar peticiones desde `http://localhost:3000`.

## 🧪 Testing

### Scripts de Prueba

```bash
# Backend
cd cms_back
.\test-api.ps1

# Frontend
cd cms_front
npm start
```

## 📝 Próximos Pasos

1. **Conectar más páginas**: Actualizar Users, Doctors, Patients, etc.
2. **Manejo de errores**: Implementar notificaciones globales
3. **Cache**: Implementar cache para datos que no cambian frecuentemente
4. **Optimización**: Lazy loading y paginación
5. **Testing**: Tests unitarios y de integración

## 🐛 Solución de Problemas

### Error de CORS

- Verificar que el backend esté corriendo en puerto 5000
- Verificar configuración de CORS en `server.js`

### Error de Autenticación

- Verificar que el token se esté guardando correctamente
- Verificar que el backend esté devolviendo el token

### Error de Conexión

- Verificar que ambos servidores estén corriendo
- Verificar la URL de la API en la configuración
