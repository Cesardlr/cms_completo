const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

// Generic catalog handler
const createCatalogHandlers = (tableName, fieldName = "nombre", entityName) => {
  return {
    getAll: async (req, res, next) => {
      try {
        const { search, limit = 10, offset = 0 } = req.query;

        const result = await query(
          `SELECT id, ${fieldName}
           FROM ${tableName}
           WHERE (
             COALESCE($1::text, '') = ''
             OR ${fieldName} ILIKE '%' || COALESCE($1::text,'') || '%'
           )
           ORDER BY ${fieldName} ASC
           LIMIT $2 OFFSET $3`,
          [search ?? null, limit, offset]
        );

        const countResult = await query(
          `SELECT COUNT(*) AS total FROM ${tableName}
           WHERE (
             COALESCE($1::text, '') = ''
             OR ${fieldName} ILIKE '%' || COALESCE($1::text,'') || '%'
           )`,
          [search ?? null]
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
    },

    getById: async (req, res, next) => {
      try {
        const { id } = req.params;

        const result = await query(
          `SELECT id, ${fieldName} FROM ${tableName} WHERE id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Record not found" });
        }

        res.json(result.rows[0]);
      } catch (error) {
        next(error);
      }
    },

    create: async (req, res, next) => {
      try {
        const value = req.body[fieldName];

        if (!value) {
          return res.status(400).json({ error: `${fieldName} is required` });
        }

        const result = await query(
          `INSERT INTO ${tableName} (${fieldName}) VALUES ($1) RETURNING id`,
          [value]
        );

        const newId = result.rows[0].id;
        await logAudit(req.user.id, "CREATE", entityName || tableName, newId);

        res.status(201).json({ id: newId, message: "Created successfully" });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const { id } = req.params;
        const value = req.body[fieldName];

        if (!value) {
          return res.status(400).json({ error: `${fieldName} is required` });
        }

        const result = await query(
          `UPDATE ${tableName} SET ${fieldName} = $2 WHERE id = $1 RETURNING id`,
          [id, value]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Record not found" });
        }

        await logAudit(req.user.id, "UPDATE", entityName || tableName, id);

        res.json({ id: result.rows[0].id, message: "Updated successfully" });
      } catch (error) {
        next(error);
      }
    },

    delete: async (req, res, next) => {
      try {
        const { id } = req.params;

        await query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

        await logAudit(req.user.id, "DELETE", entityName || tableName, id);

        res.json({ message: "Deleted successfully" });
      } catch (error) {
        next(error);
      }
    },
  };
};

// Create handlers for each catalog
const especialidadHandlers = createCatalogHandlers(
  "ESPECIALIDAD",
  "nombre",
  "ESPECIALIDAD"
);
const tipoSangreHandlers = createCatalogHandlers(
  "TIPO_SANGRE",
  "tipo",
  "TIPO_SANGRE"
);
const ocupacionHandlers = createCatalogHandlers(
  "OCUPACION",
  "nombre",
  "OCUPACION"
);
const estadoCivilHandlers = createCatalogHandlers(
  "ESTADO_CIVIL",
  "nombre",
  "ESTADO_CIVIL"
);
const estadoCitaHandlers = createCatalogHandlers(
  "ESTADO_CITA",
  "nombre",
  "ESTADO_CITA"
);
const tipoCitaHandlers = createCatalogHandlers(
  "TIPO_CITA",
  "nombre",
  "TIPO_CITA"
);
const estadoConsultaHandlers = createCatalogHandlers(
  "ESTADO_CONSULTA",
  "nombre",
  "ESTADO_CONSULTA"
);
const estadoCodigoHandlers = createCatalogHandlers(
  "ESTADO_CODIGO",
  "nombre",
  "ESTADO_CODIGO"
);

module.exports = {
  especialidadHandlers,
  tipoSangreHandlers,
  ocupacionHandlers,
  estadoCivilHandlers,
  estadoCitaHandlers,
  tipoCitaHandlers,
  estadoConsultaHandlers,
  estadoCodigoHandlers,
};
