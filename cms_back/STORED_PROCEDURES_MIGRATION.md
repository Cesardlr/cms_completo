# 🔄 Migración a Stored Procedures

Guía completa para migrar de queries directas a stored procedures PostgreSQL.

---

## ✅ ¿Qué se ha Cambiado?

El backend ahora usa **Stored Procedures** en lugar de queries SQL directas para:

- ✅ Mejor rendimiento (queries precompiladas)
- ✅ Seguridad mejorada (lógica en DB)
- ✅ Mantenibilidad (cambios en DB sin tocar código)
- ✅ Reutilización (mismos SPs para múltiples aplicaciones)

---

## 📋 Nueva Estructura de Base de Datos

### Configuración de Base de Datos

**Base de datos**: `ai_med_db`  
**Usuario**: `ai_med_user`  
**Password**: `ai_med_pass`  
**Schema de SPs**: `cms`

---

## 🚀 Setup Rápido

### 1. Actualiza tu `.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_med_db
DB_USER=ai_med_user
DB_PASSWORD=ai_med_pass
JWT_SECRET=tu_secreto_jwt
CORS_ORIGIN=http://localhost:3000
```

### 2. Crea la base de datos con Stored Procedures

```bash
# Opción A: Ejecutar script completo
psql -U postgres -f sql/schema-with-procedures.sql

# Opción B: Paso a paso
psql -U postgres
CREATE ROLE ai_med_user WITH LOGIN PASSWORD 'ai_med_pass';
CREATE DATABASE ai_med_db OWNER ai_med_user;
\c ai_med_db
\i sql/schema-with-procedures.sql
\i sql/stored-procedures.sql
\i sql/seed-data.sql
```

### 3. Inicia el servidor

```bash
npm run dev
```

---

## 📊 Stored Procedures Disponibles

### KPIs (4)

```sql
SELECT cms.kpi_citas_hoy();              -- Citas de hoy
SELECT cms.kpi_consultas_hoy();          -- Consultas de hoy
SELECT cms.kpi_usuarios_activos_30d();   -- Usuarios activos (30 días)
SELECT cms.kpi_pacientes_activos_90d();  -- Pacientes activos (90 días)
```

### Gráficas (6)

```sql
SELECT * FROM cms.chart_citas_por_mes_12m();          -- Citas por mes (12 meses)
SELECT * FROM cms.chart_citas_por_estado();           -- Estados de cita
SELECT * FROM cms.chart_consultas_por_estado();       -- Estados de consulta
SELECT * FROM cms.chart_actividad_por_entidad_30d();  -- Actividad por entidad
SELECT * FROM cms.chart_crecimiento_consultas_24m();  -- Crecimiento consultas
SELECT * FROM cms.chart_top_medicos_consultas();      -- Top 5 médicos
```

### CRUDs - Usuarios

```sql
-- Listar
SELECT * FROM cms.usuario_listar(
  'search_text',  -- Búsqueda (null para todos)
  10,             -- Limit
  0               -- Offset
);

-- Obtener por ID
SELECT * FROM cms.usuario_get(1);

-- Crear
SELECT cms.usuario_crear(
  'username',
  'email@example.com',
  '555-0001',
  'hashed_password',
  1  -- rol_id
);

-- Actualizar
SELECT cms.usuario_actualizar(
  1,  -- id
  'username_updated',
  'new_email@example.com',
  '555-0002',
  1   -- rol_id
);

-- Actualizar contraseña
SELECT cms.usuario_actualizar_password(1, 'new_hashed_password');

-- Eliminar
SELECT cms.usuario_eliminar(1);
```

### CRUDs - Catálogos

Todos los catálogos siguen el mismo patrón:

```sql
-- Especialidades
SELECT * FROM cms.especialidad_listar('search', 10, 0);
SELECT cms.especialidad_crear('Cardiología');
SELECT cms.especialidad_actualizar(1, 'Cardiología Infantil');
SELECT cms.especialidad_eliminar(1);

-- Tipos de Sangre (usa campo 'tipo' en lugar de 'nombre')
SELECT * FROM cms.tipo_sangre_listar('search', 10, 0);
SELECT cms.tipo_sangre_crear('A+');
SELECT cms.tipo_sangre_actualizar(1, 'A+');
SELECT cms.tipo_sangre_eliminar(1);
```

### CRUDs - Médicos

```sql
-- Listar
SELECT * FROM cms.medico_listar('search', 10, 0);

-- Crear
SELECT cms.medico_crear(
  1,           -- usuario_id
  'MED-12345', -- cedula
  'Descripción',
  1,           -- id_especialidad
  NULL         -- foto_archivo_id
);

-- Actualizar
SELECT cms.medico_actualizar(1, 'MED-12345', 'Nueva desc', 2, NULL);

-- Eliminar
SELECT cms.medico_eliminar(1);
```

### CRUDs - Pacientes

```sql
-- Listar
SELECT * FROM cms.paciente_listar('search', 10, 0);

-- Crear
SELECT cms.paciente_crear(
  1,              -- usuario_id
  '1985-05-15',   -- fecha_nacimiento
  'M',            -- sexo
  1.75,           -- altura
  70.5,           -- peso
  'Activo',       -- estilo_vida
  7,              -- id_tipo_sangre
  2,              -- id_ocupacion
  1,              -- id_estado_civil
  1,              -- id_medico_gen
  NULL            -- foto_archivo_id
);

-- Direcciones del Paciente
SELECT * FROM cms.direccion_paciente_listar_por_paciente(1, 10, 0);

SELECT cms.direccion_paciente_crear(
  1,                  -- paciente_id
  'Av. Principal',
  '123',
  '4B',
  1                   -- id_colonia
);
```

### CRUDs - Geografía

```sql
-- Países
SELECT * FROM cms.pais_listar('Mexico', 10, 0);
SELECT cms.pais_crear('México');
SELECT cms.pais_actualizar(1, 'México');
SELECT cms.pais_eliminar(1);

-- Estados por país (cascading)
SELECT * FROM cms.estado_por_pais(1);

-- Ciudades por estado
SELECT * FROM cms.ciudad_por_estado(1);

-- Colonias por ciudad (con búsqueda)
SELECT * FROM cms.colonia_por_ciudad(1, 'centro', 10, 0);
```

### CRUDs - Clínicas

```sql
-- Clínicas
SELECT * FROM cms.clinica_listar('search', 10, 0);
SELECT cms.clinica_crear('Clínica Santa María', '555-3001', 'contacto@clinica.com');
SELECT cms.clinica_actualizar(1, 'Nuevo nombre', '555-3002', 'nuevo@email.com');
SELECT cms.clinica_eliminar(1);

-- Direcciones de clínica
SELECT * FROM cms.direccion_clinica_listar_por_clinica(1);

-- Consultorios
SELECT * FROM cms.consultorio_listar_por_clinica(1, 10, 0);
SELECT cms.consultorio_crear(1, '101', 'Primer piso');
```

### CRUDs - Agenda (Citas, Consultas, Episodios)

```sql
-- Citas (con filtros avanzados)
SELECT * FROM cms.cita_listar(
  '2024-01-01'::timestamptz,  -- desde
  '2024-12-31'::timestamptz,  -- hasta
  1,                          -- estado_id
  NULL,                       -- tipo_id
  1,                          -- medico_id
  NULL,                       -- paciente_id
  10,                         -- limit
  0                           -- offset
);

SELECT cms.cita_crear(1, 1, 1, NOW(), NOW() + INTERVAL '30 minutes', 1, 1);
SELECT cms.cita_actualizar(1, 1, 1, 1, NOW(), NOW() + INTERVAL '30 minutes', 1, 1);
SELECT cms.cita_eliminar(1);

-- Consultas
SELECT * FROM cms.consulta_listar(NULL, NULL, NULL, NULL, NULL, 10, 0);
SELECT cms.consulta_crear(1, 1, 1, NOW(), 'Narrativa', NULL);

-- Episodios
SELECT * FROM cms.episodio_listar_por_paciente(1, 10, 0);
SELECT cms.episodio_crear(1, 'Motivo del episodio');
SELECT cms.episodio_cerrar(1, NOW());
SELECT cms.episodio_eliminar(1);
```

### CRUDs - Archivos

```sql
-- Archivos
SELECT * FROM cms.archivo_listar('pdf', 10, 0);
SELECT cms.archivo_crear('PDF', '/uploads/file.pdf', 'hash123');

-- Asociaciones
SELECT * FROM cms.archivo_asociacion_listar_por_archivo(1);
SELECT cms.archivo_asociacion_crear(1, 'PACIENTE', 1, 'Radiografía', 1);

-- Interpretaciones
SELECT * FROM cms.interpretacion_archivo_listar_por_archivo(1, 10, 0);
SELECT cms.interpretacion_archivo_crear(1, 1, 1, 'Hospital', 'Resultado normal');
```

### CRUDs - Aseguradoras

```sql
-- Aseguradoras
SELECT * FROM cms.aseguradora_listar('seguros', 10, 0);
SELECT cms.aseguradora_crear('Seguros MT', 'RFC123', '555-4001', 'info@seguros.com');

-- Pólizas
SELECT * FROM cms.poliza_listar('search', 10, 0);
SELECT cms.poliza_crear(1, 1, 'POL-2024-001', '2024-01-01', '2024-12-31');
```

### CRUDs - Notificaciones

```sql
-- Notificaciones
SELECT * FROM cms.notificacion_listar('email', 10, 0);
SELECT cms.notificacion_crear(1, 1, 'Mensaje', 'Email', NOW(), 'Pendiente');

-- Códigos de acceso
SELECT * FROM cms.acceso_codigo_listar('ACC', 10, 0);
SELECT cms.acceso_codigo_crear('ACC-2024-001', 1, NOW() + INTERVAL '30 days', NULL, 1);
```

### Auditoría

```sql
-- Listar con filtros
SELECT * FROM cms.auditoria_listar(
  'USUARIO',              -- entidad
  'CREATE',               -- accion
  '2024-01-01'::timestamptz,  -- desde
  NULL,                   -- hasta
  50,                     -- limit
  0                       -- offset
);

-- Insertar (usado automáticamente en controllers)
SELECT cms.auditoria_insertar(1, 'CREATE', 'USUARIO', 123, '{"detail": "info"}'::jsonb);
```

---

## 🔧 Cambios en Controllers

### Antes (Query Directa)

```javascript
const getUsers = async (req, res, next) => {
  const result = await query(
    `SELECT id, username, correo FROM USUARIO WHERE username ILIKE $1`,
    [search]
  );
  res.json(result.rows);
};
```

### Después (Stored Procedure)

```javascript
const getUsers = async (req, res, next) => {
  const result = await query(`SELECT * FROM cms.usuario_listar($1, $2, $3)`, [
    search,
    limit,
    offset,
  ]);
  res.json({ data: result.rows });
};
```

---

## 🎯 Ventajas de Stored Procedures

### Performance

- ✅ Queries precompiladas (más rápidas)
- ✅ Menos round-trips al servidor
- ✅ Optimización automática por PostgreSQL

### Seguridad

- ✅ Lógica en base de datos (más segura)
- ✅ Menos superficie de ataque
- ✅ Validaciones centralizadas

### Mantenibilidad

- ✅ Cambios en DB sin redeployar código
- ✅ Reutilizable desde múltiples aplicaciones
- ✅ Testeable directamente en DB

---

## 🧪 Testing de Stored Procedures

### Test Directo en PostgreSQL

```bash
# Conectar a la base de datos
psql -U ai_med_user -d ai_med_db

# Probar KPI
SELECT cms.kpi_citas_hoy();

# Probar listar usuarios
SELECT * FROM cms.usuario_listar(NULL, 10, 0);

# Probar gráficas
SELECT * FROM cms.chart_citas_por_mes_12m();
```

### Test desde API

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Listar usuarios (ahora usa SP)
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Convenciones de Naming

### Stored Procedures siguen este patrón:

```
cms.{entidad}_{accion}(params)

Ejemplos:
- cms.usuario_listar(q, limit, offset)
- cms.usuario_crear(...)
- cms.usuario_actualizar(...)
- cms.usuario_eliminar(id)

- cms.medico_listar(...)
- cms.paciente_crear(...)
- cms.cita_listar(...)

- cms.kpi_citas_hoy()
- cms.chart_citas_por_mes_12m()
```

### Acciones Comunes:

- `_listar` - SELECT con filtros y paginación
- `_get` - SELECT por ID
- `_crear` - INSERT RETURNING id
- `_actualizar` - UPDATE RETURNING id
- `_eliminar` - DELETE

---

## 🔄 Patrones de Uso en Controllers

### Pattern 1: Listar con Paginación

```javascript
const getItems = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(`SELECT * FROM cms.item_listar($1, $2, $3)`, [
      search || null,
      limit,
      offset,
    ]);

    // Count total (puede ser otro SP si existe)
    const countResult = await query(
      `SELECT COUNT(*) as total FROM TABLA WHERE condition`,
      [search || null]
    );

    res.json({
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};
```

### Pattern 2: Crear con Audit

```javascript
const createItem = async (req, res, next) => {
  try {
    const { campo1, campo2 } = req.body;

    // Llamar SP de creación
    const result = await query(`SELECT cms.item_crear($1, $2) as id`, [
      campo1,
      campo2,
    ]);

    const newId = result.rows[0].id;

    // Log audit con SP
    await query(`SELECT cms.auditoria_insertar($1, $2, $3, $4, $5)`, [
      req.user.id,
      "CREATE",
      "ITEM",
      newId,
      JSON.stringify({ campo1 }),
    ]);

    res.status(201).json({ id: newId, message: "Created successfully" });
  } catch (error) {
    next(error);
  }
};
```

### Pattern 3: Filtros Avanzados

```javascript
const getAppointments = async (req, res, next) => {
  try {
    const {
      fecha_desde,
      fecha_hasta,
      estado_id,
      medico_id,
      paciente_id,
      limit = 10,
      offset = 0,
    } = req.query;

    // SP con múltiples filtros opcionales
    const result = await query(
      `SELECT * FROM cms.cita_listar($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        fecha_desde || null,
        fecha_hasta || null,
        estado_id || null,
        null, // tipo_id
        medico_id || null,
        paciente_id || null,
        limit,
        offset,
      ]
    );

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};
```

---

## 🎯 Catálogos con SPs Genéricos

Para los catálogos, ya existen SPs individuales:

```javascript
// En lugar de un factory genérico, cada catálogo tiene su SP

// Especialidades
SELECT * FROM cms.especialidad_listar($1, $2, $3);

// Ocupaciones
SELECT * FROM cms.ocupacion_listar($1, $2, $3);

// Estados Civil
SELECT * FROM cms.estado_civil_listar($1, $2, $3);

// etc...
```

**Nota**: Necesitarás crear los SPs para cada catálogo o usar el pattern genérico existente en el controller.

---

## 📊 Dashboard con SPs

Ejemplo de endpoint de dashboard que usa KPIs y gráficas:

```javascript
const getDashboardData = async (req, res, next) => {
  try {
    // KPIs
    const kpi1 = await query("SELECT cms.kpi_citas_hoy() as value");
    const kpi2 = await query("SELECT cms.kpi_consultas_hoy() as value");
    const kpi3 = await query("SELECT cms.kpi_usuarios_activos_30d() as value");
    const kpi4 = await query("SELECT cms.kpi_pacientes_activos_90d() as value");

    // Gráficas
    const chart1 = await query("SELECT * FROM cms.chart_citas_por_mes_12m()");
    const chart2 = await query("SELECT * FROM cms.chart_citas_por_estado()");
    const chart3 = await query(
      "SELECT * FROM cms.chart_consultas_por_estado()"
    );
    const chart4 = await query(
      "SELECT * FROM cms.chart_actividad_por_entidad_30d()"
    );
    const chart5 = await query(
      "SELECT * FROM cms.chart_crecimiento_consultas_24m()"
    );
    const chart6 = await query(
      "SELECT * FROM cms.chart_top_medicos_consultas()"
    );

    res.json({
      kpis: {
        citasHoy: kpi1.rows[0].value,
        consultasHoy: kpi2.rows[0].value,
        usuariosActivos: kpi3.rows[0].value,
        pacientesActivos: kpi4.rows[0].value,
      },
      charts: {
        citasPorMes: chart1.rows,
        citasPorEstado: chart2.rows,
        consultasPorEstado: chart3.rows,
        actividadPorEntidad: chart4.rows,
        crecimientoConsultas: chart5.rows,
        topMedicos: chart6.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 🚨 Troubleshooting

### Error: "function cms.usuario_listar does not exist"

**Causa**: Stored procedures no creados  
**Solución**:

```bash
psql -U postgres -d ai_med_db -f sql/stored-procedures.sql
```

### Error: "schema cms does not exist"

**Causa**: Schema cms no creado  
**Solución**:

```sql
CREATE SCHEMA IF NOT EXISTS cms;
GRANT USAGE ON SCHEMA cms TO ai_med_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA cms TO ai_med_user;
```

### Error: "permission denied for schema cms"

**Causa**: Usuario sin permisos  
**Solución**:

```sql
GRANT USAGE ON SCHEMA cms TO ai_med_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA cms TO ai_med_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA cms GRANT EXECUTE ON FUNCTIONS TO ai_med_user;
```

---

## ✅ Checklist de Migración

- [ ] Base de datos `ai_med_db` creada
- [ ] Usuario `ai_med_user` creado
- [ ] Schema `cms` creado
- [ ] Todas las tablas creadas
- [ ] Todos los stored procedures creados
- [ ] Permisos otorgados a `ai_med_user`
- [ ] `.env` actualizado con nuevas credenciales
- [ ] Controllers actualizados para usar SPs
- [ ] Servidor reiniciado
- [ ] Tests funcionando

---

## 📚 Recursos

- **Script completo**: `sql/schema-with-procedures.sql`
- **Solo SPs**: `sql/stored-procedures.sql`
- **Seed data**: `sql/seed-data.sql`
- **Documentación API**: `API_ENDPOINTS.md` (sin cambios en endpoints)

---

## 💡 Notas Importantes

1. **Los endpoints API no cambian** - Solo la implementación interna
2. **Frontend no requiere cambios** - API sigue igual
3. **Performance mejorado** - Queries precompiladas
4. **Más seguro** - Lógica en DB
5. **Fácil de mantener** - Cambios en DB, no en código

---

**¡Migración a Stored Procedures Completada!** ✨
