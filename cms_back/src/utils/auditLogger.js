const { query } = require("../config/database");

const logAudit = async (userId, action, entity, entityId, detail = null) => {
  try {
    // Usar query directa
    await query(
      `INSERT INTO auditoria (usuario_id, accion, entidad, entidad_id, detalle) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, action, entity, entityId, detail]
    );
  } catch (error) {
    console.error("Error logging audit:", error);
    // Don't throw - audit logging shouldn't break the main operation
  }
};

module.exports = { logAudit };
