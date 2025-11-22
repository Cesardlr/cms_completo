# CMS Médico - Sistema de Gestión Clínica

Sistema completo de gestión médica con React. Este es un **MVP frontend** sin conexión a base de datos, diseñado para demostrar todas las funcionalidades del sistema.

## 🚀 Inicio Rápido

### Instalación

```bash
cd cms_front
npm install
```

### Ejecutar Aplicación

```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 🔐 Acceso al Sistema

### Credenciales de Prueba

- **Usuario**: `admin` o `editor`
- **Contraseña**: cualquier texto

El sistema acepta cualquier combinación para propósitos de demostración.

## 📋 Funcionalidades Implementadas

### 1. **Autenticación**

- ✅ Login con usuarios admin y editor
- ✅ Persistencia de sesión con localStorage
- ✅ Logout
- ✅ Rutas protegidas

### 2. **Dashboard**

- ✅ 4 KPIs principales:
  - Citas hoy
  - Consultas hoy
  - Usuarios activos (30 días)
  - Pacientes activos (90 días)
- ✅ 6 gráficas interactivas:
  - Citas por mes (línea)
  - Estados de cita (pastel)
  - Estados de consulta (barras)
  - Actividad por entidad (barras)
  - Crecimiento de consultas (línea)
  - Top 5 médicos (barras)

### 3. **Gestión de Usuarios**

- ✅ CRUD completo
- ✅ Asignación de roles (Admin/Editor)
- ✅ Búsqueda y filtrado
- ✅ Paginación

### 4. **Catálogos Clínicos**

- ✅ Especialidades
- ✅ Tipos de Sangre
- ✅ Ocupaciones
- ✅ Estado Civil
- ✅ Estados de Cita
- ✅ Tipos de Cita
- ✅ Estados de Consulta
- ✅ Estados de Código

### 5. **Gestión de Personas**

- ✅ Médicos (con cédula, especialidad, descripción)
- ✅ Pacientes (con datos completos, tipo sangre, médico general)

### 6. **Geografía**

- ✅ Países
- ✅ Estados
- ✅ Ciudades
- ✅ Colonias (con código postal)
- ✅ Selects encadenados

### 7. **Clínicas**

- ✅ CRUD de Clínicas
- ✅ Gestión de Consultorios
- ✅ Estados de disponibilidad

### 8. **Agenda**

- ✅ CRUD de Citas
- ✅ **Calendario Mensual** con vista de citas
- ✅ Gestión de Consultas
- ✅ Episodios (abrir/cerrar)

### 9. **Archivos**

- ✅ Subida de archivos (simulada)
- ✅ Asociaciones (categorías, etiquetas)
- ✅ Interpretaciones médicas

### 10. **Aseguradoras**

- ✅ CRUD de Aseguradoras
- ✅ Gestión de Pólizas con vigencias

### 11. **Notificaciones**

- ✅ Gestión de notificaciones
- ✅ Múltiples canales (Email, SMS, Push)
- ✅ Códigos de acceso temporal

### 12. **Auditoría y Reportes**

- ✅ Registro de auditoría con filtros
- ✅ **Exportación a CSV**
- ✅ **Exportación a PDF**
- ✅ Filtros por usuario, entidad, acción

## 🎨 Estructura del Proyecto

```
cms_front/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizables
│   │   │   ├── Table.js     # Tabla de datos
│   │   │   ├── Modal.js     # Ventana modal
│   │   │   ├── SearchBar.js # Barra de búsqueda
│   │   │   ├── Pagination.js # Paginación
│   │   │   └── KPICard.js   # Tarjeta de KPI
│   │   └── layout/          # Componentes de layout
│   │       ├── Sidebar.js   # Menú lateral
│   │       ├── Header.js    # Cabecera
│   │       └── MainLayout.js # Layout principal
│   ├── pages/
│   │   ├── auth/            # Autenticación
│   │   ├── dashboard/       # Dashboard
│   │   ├── users/           # Usuarios
│   │   ├── catalogs/        # Catálogos clínicos
│   │   ├── people/          # Médicos y pacientes
│   │   ├── geography/       # Geografía
│   │   ├── clinics/         # Clínicas
│   │   ├── appointments/    # Citas y calendario
│   │   ├── files/           # Archivos
│   │   ├── insurance/       # Aseguradoras
│   │   ├── notifications/   # Notificaciones
│   │   └── audit/           # Auditoría
│   ├── context/
│   │   └── AuthContext.js   # Contexto de autenticación
│   ├── utils/
│   │   └── exportUtils.js   # Utilidades de exportación
│   ├── styles/
│   │   └── global.css       # Estilos globales
│   └── App.js               # Configuración de rutas
```

## 🎯 Características Destacadas

### Componentes Reutilizables

- **GenericCatalog**: Componente genérico para todos los catálogos
- **Table**: Tabla con acciones de editar/eliminar
- **Modal**: Modal responsive para formularios
- **SearchBar**: Búsqueda con debounce
- **Pagination**: Paginación completa

### Diseño Moderno

- ✨ UI/UX profesional y limpia
- 📱 Diseño responsive
- 🎨 Paleta de colores consistente
- 🔄 Animaciones suaves
- 📊 Gráficas interactivas con Chart.js

### Experiencia de Usuario

- 🔍 Búsqueda en tiempo real
- 📄 Paginación automática
- 🏷️ Badges de estado con colores
- ⚡ Navegación rápida
- 💾 Persistencia de sesión

## 🛠️ Tecnologías Utilizadas

- **React 19.2** - Framework principal
- **React Router 6** - Navegación
- **Chart.js 4** - Gráficas
- **jsPDF** - Exportación PDF
- **CSS Variables** - Theming
- **LocalStorage** - Persistencia

## 📚 Guía de Uso

### 1. Iniciar Sesión

- Acceder a `/login`
- Usar credenciales: `admin` / cualquier contraseña
- Se redirige automáticamente al Dashboard

### 2. Navegar por el Sistema

- Usar el menú lateral para acceder a diferentes módulos
- Los menús con subítems se expanden al hacer clic

### 3. Gestionar Datos

- **Crear**: Botón "+ Agregar" en cada listado
- **Editar**: Botón "Editar" en la tabla
- **Eliminar**: Botón "Eliminar" con confirmación
- **Buscar**: Usar la barra de búsqueda

### 4. Exportar Reportes

- Ir a la página de Auditoría
- Aplicar filtros si es necesario
- Clic en "Exportar CSV" o "Exportar PDF"

### 5. Ver Calendario

- Ir a Agenda → Calendario
- Ver citas del mes
- Clic en un día para ver detalles

## 🔄 Próximos Pasos (Integración Backend)

Para conectar con una base de datos real:

1. **Crear servicios API**:

```javascript
// services/api.js
export const getUsers = () => fetch("/api/users");
export const createUser = (data) =>
  fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
```

2. **Reemplazar datos mock**:

```javascript
// Antes
const [users, setUsers] = useState([...mockData]);

// Después
useEffect(() => {
  getUsers().then((data) => setUsers(data));
}, []);
```

3. **Implementar autenticación real**:

```javascript
// AuthContext.js
const login = async (username, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  setUser(data.user);
  localStorage.setItem("token", data.token);
};
```

## 🐛 Notas Importantes

- **Sin Backend**: Todos los datos son locales y se reinician al recargar
- **Mock Data**: Datos de ejemplo precargados
- **Validaciones**: Validaciones básicas en frontend
- **Sin Autenticación Real**: Login simulado para demostración

## 📞 Soporte

Para dudas o problemas:

1. Verificar que todas las dependencias estén instaladas
2. Limpiar caché: `npm cache clean --force`
3. Reinstalar: `rm -rf node_modules package-lock.json && npm install`

## 📝 Licencia

Este es un proyecto MVP para demostración.

---

**Desarrollado con ❤️ para gestión médica eficiente**
