# 🗺️ Mapa de Rutas del CMS Médico

## 🔐 Rutas Públicas

| Ruta     | Descripción                |
| -------- | -------------------------- |
| `/login` | Página de inicio de sesión |

## 🏠 Ruta Principal

| Ruta | Descripción | Redirección    |
| ---- | ----------- | -------------- |
| `/`  | Raíz        | → `/dashboard` |

## 📊 Dashboard

| Ruta         | Descripción                             |
| ------------ | --------------------------------------- |
| `/dashboard` | Dashboard principal con KPIs y gráficas |

## 👥 Gestión de Usuarios

| Ruta     | Descripción                               |
| -------- | ----------------------------------------- |
| `/users` | Listado y gestión de usuarios del sistema |

## 📋 Catálogos Clínicos

| Ruta                            | Catálogo            | Descripción                          |
| ------------------------------- | ------------------- | ------------------------------------ |
| `/catalogs/specialties`         | Especialidades      | Especialidades médicas               |
| `/catalogs/blood-types`         | Tipos de Sangre     | Tipos sanguíneos (A+, B+, etc)       |
| `/catalogs/occupations`         | Ocupaciones         | Ocupaciones de pacientes             |
| `/catalogs/marital-status`      | Estado Civil        | Estados civiles                      |
| `/catalogs/appointment-status`  | Estados de Cita     | Estados (Confirmada, Pendiente, etc) |
| `/catalogs/appointment-types`   | Tipos de Cita       | Tipos (Consulta, Seguimiento, etc)   |
| `/catalogs/consultation-status` | Estados de Consulta | Estados de consultas médicas         |
| `/catalogs/code-status`         | Estados de Código   | Estados de códigos de acceso         |

## 👨‍⚕️ Gestión de Personas

| Ruta               | Descripción                               |
| ------------------ | ----------------------------------------- |
| `/people/doctors`  | Gestión de médicos (cédula, especialidad) |
| `/people/patients` | Gestión de pacientes (datos completos)    |

## 🌍 Geografía

| Ruta                   | Descripción                           |
| ---------------------- | ------------------------------------- |
| `/geography/countries` | Catálogo de países                    |
| `/geography/states`    | Catálogo de estados/provincias        |
| `/geography/cities`    | Catálogo de ciudades                  |
| `/geography/colonies`  | Catálogo de colonias/códigos postales |

## 🏥 Clínicas

| Ruta               | Descripción             |
| ------------------ | ----------------------- |
| `/clinics/list`    | Listado de clínicas     |
| `/clinics/offices` | Gestión de consultorios |

## 📅 Agenda y Citas

| Ruta                          | Descripción                      | Destacado                 |
| ----------------------------- | -------------------------------- | ------------------------- |
| `/appointments/list`          | Listado de citas médicas         |                           |
| `/appointments/calendar`      | Vista de calendario mensual      | ⭐ Calendario interactivo |
| `/appointments/consultations` | Gestión de consultas             |                           |
| `/appointments/episodes`      | Episodios médicos (abrir/cerrar) |                           |

## 📁 Archivos

| Ruta                     | Descripción                           |
| ------------------------ | ------------------------------------- |
| `/files/list`            | Gestión de archivos médicos           |
| `/files/associations`    | Asociaciones y categorías de archivos |
| `/files/interpretations` | Interpretaciones médicas de archivos  |

## 🏢 Aseguradoras

| Ruta                   | Descripción                        |
| ---------------------- | ---------------------------------- |
| `/insurance/companies` | Catálogo de compañías aseguradoras |
| `/insurance/policies`  | Gestión de pólizas (vigencias)     |

## 🔔 Notificaciones

| Ruta                          | Descripción                |
| ----------------------------- | -------------------------- |
| `/notifications/list`         | Sistema de notificaciones  |
| `/notifications/access-codes` | Códigos de acceso temporal |

## 📝 Auditoría y Reportes

| Ruta     | Descripción           | Destacado              |
| -------- | --------------------- | ---------------------- |
| `/audit` | Registro de auditoría | ⭐ Exportación CSV/PDF |

## 🎯 Rutas por Módulo

### Acceso y Sesión

- Login: `/login`
- Dashboard: `/dashboard`

### Administración

- Usuarios: `/users`

### Catálogos (8 rutas)

- Especialidades, Tipos Sangre, Ocupaciones, Estado Civil
- Estados Cita, Tipos Cita, Estados Consulta, Estados Código

### Personas (2 rutas)

- Médicos, Pacientes

### Geografía (4 rutas)

- Países, Estados, Ciudades, Colonias

### Clínicas (2 rutas)

- Clínicas, Consultorios

### Agenda (4 rutas)

- Citas, Calendario, Consultas, Episodios

### Archivos (3 rutas)

- Archivos, Asociaciones, Interpretaciones

### Aseguradoras (2 rutas)

- Compañías, Pólizas

### Notificaciones (2 rutas)

- Notificaciones, Códigos de Acceso

### Auditoría (1 ruta)

- Auditoría

## 📊 Resumen

| Categoría          | Cantidad |
| ------------------ | -------- |
| **Total de Rutas** | **40+**  |
| Rutas Públicas     | 1        |
| Dashboard          | 1        |
| Usuarios           | 1        |
| Catálogos          | 8        |
| Personas           | 2        |
| Geografía          | 4        |
| Clínicas           | 2        |
| Agenda             | 4        |
| Archivos           | 3        |
| Aseguradoras       | 2        |
| Notificaciones     | 2        |
| Auditoría          | 1        |

## 🔒 Protección de Rutas

Todas las rutas excepto `/login` están protegidas por autenticación.

Si un usuario no autenticado intenta acceder:

- ❌ Acceso denegado
- ↪️ Redirección automática a `/login`

## 🚀 Navegación Rápida

### Desde el Sidebar

El menú lateral organiza las rutas en grupos expandibles:

```
📊 Dashboard
👥 Usuarios
📋 Catálogos Clínicos
  ├── Especialidades
  ├── Tipo Sangre
  ├── Ocupación
  ├── Estado Civil
  ├── Estado Cita
  ├── Tipo Cita
  ├── Estado Consulta
  └── Estado Código
👨‍⚕️ Personas
  ├── Médicos
  └── Pacientes
🌍 Geografía
  ├── Países
  ├── Estados
  ├── Ciudades
  └── Colonias
🏥 Clínicas
  ├── Clínicas
  └── Consultorios
📅 Agenda
  ├── Citas
  ├── Calendario
  ├── Consultas
  └── Episodios
📁 Archivos
  ├── Archivos
  ├── Asociaciones
  └── Interpretaciones
🏢 Aseguradoras
  ├── Aseguradoras
  └── Pólizas
🔔 Notificaciones
  ├── Notificaciones
  └── Códigos Acceso
📝 Auditoría
```

## 💡 Tips de Navegación

1. **Menú Lateral**: Clic en grupos para expandir/contraer
2. **Ruta Activa**: Se resalta en azul en el menú
3. **Breadcrumbs**: El header muestra la ubicación actual
4. **Navegación Directa**: Puedes copiar/pegar URLs directamente

## 🔄 Redirecciones

| De                          | A            | Razón                  |
| --------------------------- | ------------ | ---------------------- |
| `/`                         | `/dashboard` | Ruta por defecto       |
| Cualquier ruta inválida     | `/dashboard` | Manejo de 404          |
| Rutas protegidas (sin auth) | `/login`     | Requiere autenticación |

---

**Todas las rutas están completamente funcionales y listas para usar** ✨
