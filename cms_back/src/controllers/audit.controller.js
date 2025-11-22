const { query } = require("../config/database");

const getAuditLogs = async (req, res, next) => {
  try {
    const {
      entidad,
      accion,
      fecha_desde,
      fecha_hasta,
      usuario_id,
      limit = 10,
      offset = 0,
    } = req.query;

    const result = await query(
      `SELECT au.id, au.usuario_id, u.username, au.accion, au.entidad, au.entidad_id,
              au.fecha_hora, au.detalle
       FROM AUDITORIA au
       LEFT JOIN USUARIO u ON u.id = au.usuario_id
       WHERE (COALESCE($1::text, '') = '' OR au.entidad ILIKE '%' || COALESCE($1::text,'') || '%')
         AND (COALESCE($2::text, '') = '' OR au.accion  ILIKE '%' || COALESCE($2::text,'') || '%')
         AND ($3::timestamptz IS NULL OR au.fecha_hora >= $3::timestamptz)
         AND ($4::timestamptz IS NULL OR au.fecha_hora <  $4::timestamptz)
         AND ($5::int IS NULL OR au.usuario_id = $5::int)
       ORDER BY au.fecha_hora DESC
       LIMIT $6 OFFSET $7`,
      [
        entidad ?? null,
        accion ?? null,
        fecha_desde ?? null,
        fecha_hasta ?? null,
        usuario_id ?? null,
        limit,
        offset,
      ]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM AUDITORIA au
       WHERE (COALESCE($1::text, '') = '' OR au.entidad ILIKE '%' || COALESCE($1::text,'') || '%')
         AND (COALESCE($2::text, '') = '' OR au.accion  ILIKE '%' || COALESCE($2::text,'') || '%')
         AND ($3::timestamptz IS NULL OR au.fecha_hora >= $3::timestamptz)
         AND ($4::timestamptz IS NULL OR au.fecha_hora <  $4::timestamptz)
         AND ($5::int IS NULL OR au.usuario_id = $5::int)`,
      [
        entidad ?? null,
        accion ?? null,
        fecha_desde ?? null,
        fecha_hasta ?? null,
        usuario_id ?? null,
      ]
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

const getAuditStats = async (req, res, next) => {
  try {
    // Get activity stats for last 30 days
    const statsResult = await query(
      `SELECT entidad, COUNT(*) as count
       FROM AUDITORIA
       WHERE fecha_hora >= NOW() - INTERVAL '30 days'
       GROUP BY entidad
       ORDER BY count DESC
       LIMIT 10`
    );

    const actionStatsResult = await query(
      `SELECT accion, COUNT(*) as count
       FROM AUDITORIA
       WHERE fecha_hora >= NOW() - INTERVAL '30 days'
       GROUP BY accion
       ORDER BY count DESC`
    );

    res.json({
      entityStats: statsResult.rows,
      actionStats: actionStatsResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
  getAuditStats,
};
