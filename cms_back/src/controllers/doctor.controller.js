const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

const getDoctors = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT m.id, m.nombre, u.username, COALESCE(u.correo, m.correo) as correo, COALESCE(u.telefono, m.telefono) as telefono, m.cedula, m.descripcion, m.ubicacion,
              e.nombre AS especialidad, m.id_especialidad, m.usuario_id,
              a.url AS foto_perfil
       FROM MEDICO m
       LEFT JOIN USUARIO u ON u.id = m.usuario_id
       LEFT JOIN ESPECIALIDAD e ON e.id = m.id_especialidad
       LEFT JOIN ARCHIVO_ASOCIACION aa ON aa.entidad = 'MEDICO' AND aa.entidad_id = m.id AND aa.descripcion = 'Foto de perfil'
       LEFT JOIN ARCHIVO a ON a.id = aa.archivo_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR u.username ILIKE '%' || COALESCE($1::text,'') || '%'
         OR m.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR m.cedula ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY m.id DESC
       LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM MEDICO m
       LEFT JOIN USUARIO u ON u.id = m.usuario_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR u.username ILIKE '%' || COALESCE($1::text,'') || '%'
         OR m.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR m.cedula ILIKE '%' || COALESCE($1::text,'') || '%'
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

const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT m.id, m.nombre, u.username, COALESCE(u.correo, m.correo) as correo, COALESCE(u.telefono, m.telefono) as telefono, m.cedula, m.descripcion, m.ubicacion,
              e.nombre AS especialidad, m.id_especialidad, m.usuario_id,
              a.url AS foto_perfil
       FROM MEDICO m
       LEFT JOIN USUARIO u ON u.id = m.usuario_id
       LEFT JOIN ESPECIALIDAD e ON e.id = m.id_especialidad
       LEFT JOIN ARCHIVO_ASOCIACION aa ON aa.entidad = 'MEDICO' AND aa.entidad_id = m.id AND aa.descripcion = 'Foto de perfil'
       LEFT JOIN ARCHIVO a ON a.id = aa.archivo_id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const {
      usuario_id,
      nombre,
      cedula,
      descripcion,
      id_especialidad,
      id_direccion,
      telefono,
      correo,
      ubicacion,
    } = req.body;

    if (!usuario_id || !nombre || !cedula) {
      return res
        .status(400)
        .json({ error: "usuario_id, nombre and cedula are required" });
    }

    const result = await query(
      `INSERT INTO MEDICO (usuario_id, nombre, cedula, descripcion, id_especialidad, id_direccion, telefono, correo, ubicacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        usuario_id,
        nombre,
        cedula,
        descripcion || null,
        id_especialidad || null,
        id_direccion || null,
        telefono || null,
        correo || null,
        ubicacion || null,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(
      req.user.id,
      "CREATE",
      "MEDICO",
      newId,
      JSON.stringify({ nombre, cedula })
    );

    res.status(201).json({ id: newId, message: "Doctor created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      cedula,
      descripcion,
      id_especialidad,
      id_direccion,
      telefono,
      correo,
      ubicacion,
    } = req.body;

    const result = await query(
      `UPDATE MEDICO
       SET nombre = $2, cedula = $3, descripcion = $4, id_especialidad = $5, id_direccion = $6, telefono = $7, correo = $8, ubicacion = $9
       WHERE id = $1
       RETURNING id`,
      [
        id,
        nombre,
        cedula,
        descripcion || null,
        id_especialidad || null,
        id_direccion || null,
        telefono || null,
        correo || null,
        ubicacion || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await logAudit(
      req.user.id,
      "UPDATE",
      "MEDICO",
      id,
      JSON.stringify({ nombre, cedula })
    );

    res.json({ id: result.rows[0].id, message: "Doctor updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM MEDICO WHERE id = $1", [id]);
    await logAudit(req.user.id, "DELETE", "MEDICO", id);

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
