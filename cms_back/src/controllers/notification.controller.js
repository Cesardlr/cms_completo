const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

// NOTIFICACION
const getNotifications = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT n.id, n.mensaje, n.canal, n.fecha_envio, n.estado,
              u.username AS usuario, c.id AS cita_id, n.id_usuario, n.id_cita
       FROM NOTIFICACION n
       LEFT JOIN USUARIO u ON u.id = n.id_usuario
       LEFT JOIN CITA c ON c.id = n.id_cita
       WHERE (
         COALESCE($1::text, '') = ''
         OR n.estado ILIKE '%' || COALESCE($1::text,'') || '%'
         OR n.canal ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY COALESCE(n.fecha_envio, now()) DESC
       LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM NOTIFICACION
       WHERE (
         COALESCE($1::text, '') = ''
         OR estado ILIKE '%' || COALESCE($1::text,'') || '%'
         OR canal ILIKE '%' || COALESCE($1::text,'') || '%'
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
};

const createNotification = async (req, res, next) => {
  try {
    const { id_usuario, id_cita, mensaje, canal, fecha_envio, estado } =
      req.body;

    if (!mensaje || !canal) {
      return res.status(400).json({ error: "mensaje and canal are required" });
    }

    const result = await query(
      `INSERT INTO NOTIFICACION (id_usuario, id_cita, mensaje, canal, fecha_envio, estado)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        id_usuario || null,
        id_cita || null,
        mensaje,
        canal,
        fecha_envio || null,
        estado || "Pendiente",
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "NOTIFICACION", newId);

    res
      .status(201)
      .json({ id: newId, message: "Notification created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario, id_cita, mensaje, canal, fecha_envio, estado } =
      req.body;

    const result = await query(
      `UPDATE NOTIFICACION
       SET id_usuario=$2, id_cita=$3, mensaje=$4, canal=$5, fecha_envio=$6, estado=$7
       WHERE id=$1 RETURNING id`,
      [
        id,
        id_usuario || null,
        id_cita || null,
        mensaje,
        canal,
        fecha_envio || null,
        estado,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await logAudit(req.user.id, "UPDATE", "NOTIFICACION", id);

    res.json({
      id: result.rows[0].id,
      message: "Notification updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM NOTIFICACION WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "NOTIFICACION", id);

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ACCESO_CODIGO
const getAccessCodes = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT ac.id, ac.codigo, ac.expira_en, ac.usado_en,
              ec.nombre AS estado, u.username AS usuario,
              ac.id_estado_codigo, ac.id_usuario
       FROM ACCESO_CODIGO ac
       LEFT JOIN ESTADO_CODIGO ec ON ec.id = ac.id_estado_codigo
       LEFT JOIN USUARIO u ON u.id = ac.id_usuario
       WHERE (
         COALESCE($1::text, '') = ''
         OR ac.codigo ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY ac.id DESC LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM ACCESO_CODIGO
       WHERE (
         COALESCE($1::text, '') = ''
         OR codigo ILIKE '%' || COALESCE($1::text,'') || '%'
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
};

const createAccessCode = async (req, res, next) => {
  try {
    const { codigo, id_usuario, expira_en, usado_en, id_estado_codigo } =
      req.body;

    if (!codigo) {
      return res.status(400).json({ error: "codigo is required" });
    }

    const result = await query(
      `INSERT INTO ACCESO_CODIGO (codigo, id_usuario, expira_en, usado_en, id_estado_codigo)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [
        codigo,
        id_usuario || null,
        expira_en || null,
        usado_en || null,
        id_estado_codigo || null,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "ACCESO_CODIGO", newId);

    res
      .status(201)
      .json({ id: newId, message: "Access code created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateAccessCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codigo, id_usuario, expira_en, usado_en, id_estado_codigo } =
      req.body;

    const result = await query(
      `UPDATE ACCESO_CODIGO
       SET codigo=$2, id_usuario=$3, expira_en=$4, usado_en=$5, id_estado_codigo=$6
       WHERE id=$1 RETURNING id`,
      [
        id,
        codigo,
        id_usuario || null,
        expira_en || null,
        usado_en || null,
        id_estado_codigo || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Access code not found" });
    }

    await logAudit(req.user.id, "UPDATE", "ACCESO_CODIGO", id);

    res.json({
      id: result.rows[0].id,
      message: "Access code updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccessCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM ACCESO_CODIGO WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "ACCESO_CODIGO", id);

    res.json({ message: "Access code deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getAccessCodes,
  createAccessCode,
  updateAccessCode,
  deleteAccessCode,
};
