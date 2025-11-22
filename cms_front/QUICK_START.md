# 🚀 Guía de Inicio Rápido - CMS Médico

## Pasos para Ejecutar

### 1. Instalar Dependencias (si no está hecho)

```bash
cd cms_front
npm install
```

### 2. Iniciar el Servidor de Desarrollo

```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔐 Credenciales de Acceso

**Usuario**: `admin` o `editor`  
**Contraseña**: cualquier texto (ej: `123456`)

El rol será asignado automáticamente según el usuario:

- `admin` → Rol Administrador
- `editor` → Rol Editor

## 🗺️ Navegación Rápida

### Módulos Principales:

1. **📊 Dashboard** - `/dashboard`

   - Vista de KPIs y gráficas
   - Estadísticas en tiempo real (simuladas)

2. **👥 Usuarios** - `/users`

   - Gestión de usuarios del sistema
   - CRUD completo

3. **📋 Catálogos** - `/catalogs/*`

   - 8 catálogos clínicos diferentes
   - Especialidades, tipos de sangre, etc.

4. **👨‍⚕️ Personas** - `/people/*`

   - Médicos con especialidades
   - Pacientes con historiales

5. **🌍 Geografía** - `/geography/*`

   - Países, Estados, Ciudades, Colonias
   - Estructura jerárquica

6. **🏥 Clínicas** - `/clinics/*`

   - Gestión de clínicas
   - Consultorios y disponibilidad

7. **📅 Agenda** - `/appointments/*`

   - Citas médicas
   - **Calendario mensual interactivo**
   - Consultas y episodios

8. **📁 Archivos** - `/files/*`

   - Gestión documental
   - Asociaciones e interpretaciones

9. **🏢 Aseguradoras** - `/insurance/*`

   - Compañías aseguradoras
   - Pólizas y vigencias

10. **🔔 Notificaciones** - `/notifications/*`

    - Sistema de notificaciones
    - Códigos de acceso

11. **📝 Auditoría** - `/audit`
    - Registro de actividades
    - **Exportación CSV y PDF**

## ⚡ Funcionalidades Destacadas

### 🔍 Búsqueda

Todas las páginas de listado tienen búsqueda en tiempo real.

### 📄 Paginación

Los listados se paginan automáticamente (10 items por página).

### ✏️ CRUD

- **Crear**: Botón "+ Agregar"
- **Editar**: Botón "Editar" en cada fila
- **Eliminar**: Botón "Eliminar" con confirmación

### 📊 Gráficas

Dashboard con 6 gráficas interactivas usando Chart.js.

### 📅 Calendario

Vista mensual con indicadores de citas programadas.

### 📥 Exportación

Auditoría permite exportar a CSV o PDF.

## 🎨 Características de UI/UX

- ✨ Diseño moderno y profesional
- 📱 Responsive (se adapta a móviles)
- 🎯 Navegación intuitiva
- 🔄 Transiciones suaves
- 🏷️ Estados con colores (badges)
- 💾 Sesión persistente

## 📝 Datos de Prueba

El sistema viene precargado con datos de ejemplo:

- 3 usuarios
- 2 médicos
- 2 pacientes
- 5 especialidades
- 8 tipos de sangre
- Y más...

**Nota**: Los datos son volátiles y se reinician al recargar la página.

## 🔧 Solución de Problemas

### La app no inicia:

```bash
# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install
npm start
```

### Error de puerto ocupado:

El servidor usa el puerto 3000 por defecto. Si está ocupado, React te ofrecerá usar otro puerto automáticamente.

### Cambios no se reflejan:

Presiona `Ctrl + R` (Windows/Linux) o `Cmd + R` (Mac) para recargar.

## 📚 Próximos Pasos

1. ✅ **Explorar el sistema** - Navega por todos los módulos
2. ✅ **Probar CRUD** - Crea, edita y elimina registros
3. ✅ **Ver gráficas** - Explora el dashboard
4. ✅ **Usar calendario** - Programa y visualiza citas
5. ✅ **Exportar reportes** - Prueba CSV y PDF en auditoría

## 💡 Tips

- El menú lateral se expande para mostrar submódulos
- Los filtros en auditoría son combinables
- Puedes cambiar entre usuarios admin y editor para ver ambos roles
- Las acciones se registran en auditoría (simulado)

## 📞 ¿Necesitas Ayuda?

Este es un MVP frontend sin backend. Todos los datos son locales y de ejemplo.

Para integración con backend real, consulta `README_CMS.md` sección "Próximos Pasos".

---

**¡Disfruta explorando el CMS Médico! 🏥💻**
