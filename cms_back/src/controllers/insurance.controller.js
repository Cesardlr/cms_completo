const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

// ASEGURADORA
const getInsuranceCompanies = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT id, nombre, rfc, telefono, correo
       FROM ASEGURADORA
       WHERE (
         COALESCE($1::text, '') = ''
         OR nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR rfc ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY id DESC LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM ASEGURADORA
       WHERE (
         COALESCE($1::text, '') = ''
         OR nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR rfc ILIKE '%' || COALESCE($1::text,'') || '%'
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

const getInsuranceCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      "SELECT id, nombre, rfc, telefono, correo FROM ASEGURADORA WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Insurance company not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createInsuranceCompany = async (req, res, next) => {
  try {
    const { nombre, rfc, telefono, correo } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "nombre is required" });
    }

    const result = await query(
      "INSERT INTO ASEGURADORA (nombre, rfc, telefono, correo) VALUES ($1,$2,$3,$4) RETURNING id",
      [nombre, rfc || null, telefono || null, correo || null]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "ASEGURADORA", newId);

    res
      .status(201)
      .json({ id: newId, message: "Insurance company created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateInsuranceCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, rfc, telefono, correo } = req.body;

    const result = await query(
      "UPDATE ASEGURADORA SET nombre=$2, rfc=$3, telefono=$4, correo=$5 WHERE id=$1 RETURNING id",
      [id, nombre, rfc || null, telefono || null, correo || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Insurance company not found" });
    }

    await logAudit(req.user.id, "UPDATE", "ASEGURADORA", id);

    res.json({
      id: result.rows[0].id,
      message: "Insurance company updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteInsuranceCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM ASEGURADORA WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "ASEGURADORA", id);

    res.json({ message: "Insurance company deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POLIZA
const getPolicies = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT po.id, po.numero_poliza, po.vigente_desde, po.vigente_hasta,
              a.nombre AS aseguradora, p.id AS paciente_id, u.username AS paciente,
              po.id_aseguradora, po.id_paciente
       FROM POLIZA po
       JOIN ASEGURADORA a ON a.id = po.id_aseguradora
       JOIN PACIENTE p ON p.id = po.id_paciente
       JOIN USUARIO u ON u.id = p.usuario_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR u.username ILIKE '%' || COALESCE($1::text,'') || '%'
         OR po.numero_poliza ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY po.id DESC LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM POLIZA po
       JOIN PACIENTE p ON p.id = po.id_paciente
       JOIN USUARIO u ON u.id = p.usuario_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR u.username ILIKE '%' || COALESCE($1::text,'') || '%'
         OR po.numero_poliza ILIKE '%' || COALESCE($1::text,'') || '%'
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

const getPolicyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT po.id, po.numero_poliza, po.vigente_desde, po.vigente_hasta,
              a.nombre AS aseguradora, p.id AS paciente_id, u.username AS paciente,
              po.id_aseguradora, po.id_paciente
       FROM POLIZA po
       JOIN ASEGURADORA a ON a.id = po.id_aseguradora
       JOIN PACIENTE p ON p.id = po.id_paciente
       JOIN USUARIO u ON u.id = p.usuario_id
       WHERE po.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createPolicy = async (req, res, next) => {
  try {
    const {
      id_paciente,
      id_aseguradora,
      numero_poliza,
      vigente_desde,
      vigente_hasta,
    } = req.body;

    if (!id_paciente || !id_aseguradora || !numero_poliza) {
      return res.status(400).json({
        error: "id_paciente, id_aseguradora and numero_poliza are required",
      });
    }

    const result = await query(
      `INSERT INTO POLIZA (id_paciente, id_aseguradora, numero_poliza, vigente_desde, vigente_hasta)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [
        id_paciente,
        id_aseguradora,
        numero_poliza,
        vigente_desde || null,
        vigente_hasta || null,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "POLIZA", newId);

    res.status(201).json({ id: newId, message: "Policy created successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_paciente,
      id_aseguradora,
      numero_poliza,
      vigente_desde,
      vigente_hasta,
    } = req.body;

    const result = await query(
      `UPDATE POLIZA
       SET id_paciente=$2, id_aseguradora=$3, numero_poliza=$4, vigente_desde=$5, vigente_hasta=$6
       WHERE id=$1 RETURNING id`,
      [
        id,
        id_paciente,
        id_aseguradora,
        numero_poliza,
        vigente_desde || null,
        vigente_hasta || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Policy not found" });
    }

    await logAudit(req.user.id, "UPDATE", "POLIZA", id);

    res.json({ id: result.rows[0].id, message: "Policy updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deletePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM POLIZA WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "POLIZA", id);

    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInsuranceCompanies,
  getInsuranceCompanyById,
  createInsuranceCompany,
  updateInsuranceCompany,
  deleteInsuranceCompany,
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
