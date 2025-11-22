const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

const getPatients = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT p.id, p.nombre, u.username, COALESCE(u.correo, p.correo) as correo, COALESCE(u.telefono, p.telefono) as telefono, p.fecha_nacimiento, p.sexo,
              p.altura, p.peso, p.estilo_vida, p.alergias,
              ts.tipo AS tipo_sangre, oc.nombre AS ocupacion, ec.nombre AS estado_civil,
              mg.id AS medico_gen_id, mg.nombre AS medico_gen,
              p.usuario_id, p.direccion, p.nss,
              p.id_tipo_sangre, p.id_ocupacion, p.id_estado_civil, p.id_medico_gen,
              a.url AS foto_perfil
       FROM PACIENTE p
       LEFT JOIN USUARIO u ON u.id = p.usuario_id
       LEFT JOIN TIPO_SANGRE ts ON ts.id = p.id_tipo_sangre
       LEFT JOIN OCUPACION oc ON oc.id = p.id_ocupacion
       LEFT JOIN ESTADO_CIVIL ec ON ec.id = p.id_estado_civil
       LEFT JOIN MEDICO mg ON mg.id = p.id_medico_gen
       LEFT JOIN ARCHIVO_ASOCIACION aa ON aa.entidad = 'PACIENTE' AND aa.entidad_id = p.id AND aa.descripcion = 'Foto de perfil'
       LEFT JOIN ARCHIVO a ON a.id = aa.archivo_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR u.username ILIKE '%' || COALESCE($1::text,'') || '%'
         OR p.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR COALESCE(u.correo, p.correo) ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY p.id DESC
       LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM PACIENTE p
       LEFT JOIN USUARIO u ON u.id = p.usuario_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR u.username ILIKE '%' || COALESCE($1::text,'') || '%'
         OR p.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR COALESCE(u.correo, p.correo) ILIKE '%' || COALESCE($1::text,'') || '%'
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

const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.id, p.nombre, u.username, COALESCE(u.correo, p.correo) as correo, COALESCE(u.telefono, p.telefono) as telefono, p.fecha_nacimiento, p.sexo,
              p.altura, p.peso, p.estilo_vida, p.alergias,
              ts.tipo AS tipo_sangre, oc.nombre AS ocupacion, ec.nombre AS estado_civil,
              mg.id AS medico_gen_id, mg.nombre AS medico_gen,
              p.usuario_id, p.direccion, p.nss,
              p.id_tipo_sangre, p.id_ocupacion, p.id_estado_civil, p.id_medico_gen,
              a.url AS foto_perfil
       FROM PACIENTE p
       LEFT JOIN USUARIO u ON u.id = p.usuario_id
       LEFT JOIN TIPO_SANGRE ts ON ts.id = p.id_tipo_sangre
       LEFT JOIN OCUPACION oc ON oc.id = p.id_ocupacion
       LEFT JOIN ESTADO_CIVIL ec ON ec.id = p.id_estado_civil
       LEFT JOIN MEDICO mg ON mg.id = p.id_medico_gen
       LEFT JOIN ARCHIVO_ASOCIACION aa ON aa.entidad = 'PACIENTE' AND aa.entidad_id = p.id AND aa.descripcion = 'Foto de perfil'
       LEFT JOIN ARCHIVO a ON a.id = aa.archivo_id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createPatient = async (req, res, next) => {
  try {
    const {
      usuario_id,
      nombre,
      fecha_nacimiento,
      sexo,
      altura,
      peso,
      estilo_vida,
      alergias,
      id_tipo_sangre,
      id_ocupacion,
      id_estado_civil,
      id_medico_gen,
      telefono,
      correo,
      direccion,
      ocupacion,
      nss,
    } = req.body;

    if (!usuario_id || !nombre) {
      return res
        .status(400)
        .json({ error: "usuario_id and nombre are required" });
    }

    const result = await query(
      `INSERT INTO PACIENTE (
        usuario_id, nombre, fecha_nacimiento, sexo, altura, peso, estilo_vida, alergias,
        id_tipo_sangre, id_ocupacion, id_estado_civil, id_medico_gen,
        telefono, correo, direccion, ocupacion, nss
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING id`,
      [
        usuario_id,
        nombre,
        fecha_nacimiento || null,
        sexo || null,
        altura || null,
        peso || null,
        estilo_vida || null,
        alergias || null,
        id_tipo_sangre || null,
        id_ocupacion || null,
        id_estado_civil || null,
        id_medico_gen || null,
        telefono || null,
        correo || null,
        direccion || null,
        ocupacion || null,
        nss || null,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "PACIENTE", newId);

    res
      .status(201)
      .json({ id: newId, message: "Patient created successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fecha_nacimiento,
      sexo,
      altura,
      peso,
      estilo_vida,
      alergias,
      id_tipo_sangre,
      id_ocupacion,
      id_estado_civil,
      id_medico_gen,
      telefono,
      correo,
      direccion,
      ocupacion,
      nss,
    } = req.body;

    const result = await query(
      `UPDATE PACIENTE
       SET nombre=$2, fecha_nacimiento=$3, sexo=$4, altura=$5, peso=$6, estilo_vida=$7,
           alergias=$8, id_tipo_sangre=$9, id_ocupacion=$10, id_estado_civil=$11, id_medico_gen=$12,
           telefono=$13, correo=$14, direccion=$15, ocupacion=$16, nss=$17
       WHERE id = $1
       RETURNING id`,
      [
        id,
        nombre || null,
        fecha_nacimiento || null,
        sexo || null,
        altura || null,
        peso || null,
        estilo_vida || null,
        alergias || null,
        id_tipo_sangre || null,
        id_ocupacion || null,
        id_estado_civil || null,
        id_medico_gen || null,
        telefono || null,
        correo || null,
        direccion || null,
        ocupacion || null,
        nss || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    await logAudit(req.user.id, "UPDATE", "PACIENTE", id);

    res.json({
      id: result.rows[0].id,
      message: "Patient updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM PACIENTE WHERE id = $1", [id]);
    await logAudit(req.user.id, "DELETE", "PACIENTE", id);

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Patient Addresses
const getPatientAddresses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT d.id, d.calle, d.numero_ext, d.numero_int,
              co.nombre AS colonia, co.codigo_postal, d.id_colonia,
              ci.nombre AS ciudad, es.nombre AS estado, pa.nombre AS pais
       FROM DIRECCION_PACIENTE d
       JOIN COLONIA co ON co.id = d.id_colonia
       JOIN CIUDAD ci  ON ci.id = co.ciudad_id
       JOIN ESTADO es  ON es.id = ci.estado_id
       JOIN PAIS pa    ON pa.id = es.pais_id
       WHERE d.paciente_id = $1
       ORDER BY d.id DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

const createPatientAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { calle, numero_ext, numero_int, id_colonia } = req.body;

    if (!calle || !id_colonia) {
      return res
        .status(400)
        .json({ error: "calle and id_colonia are required" });
    }

    const result = await query(
      `INSERT INTO DIRECCION_PACIENTE (paciente_id, calle, numero_ext, numero_int, id_colonia)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [id, calle, numero_ext || null, numero_int || null, id_colonia]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "DIRECCION_PACIENTE", newId);

    res
      .status(201)
      .json({ id: newId, message: "Address created successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePatientAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { calle, numero_ext, numero_int, id_colonia } = req.body;

    const result = await query(
      `UPDATE DIRECCION_PACIENTE
       SET calle=$2, numero_ext=$3, numero_int=$4, id_colonia=$5
       WHERE id = $1
       RETURNING id`,
      [addressId, calle, numero_ext || null, numero_int || null, id_colonia]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    await logAudit(req.user.id, "UPDATE", "DIRECCION_PACIENTE", addressId);

    res.json({
      id: result.rows[0].id,
      message: "Address updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deletePatientAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    await query("DELETE FROM DIRECCION_PACIENTE WHERE id = $1", [addressId]);
    await logAudit(req.user.id, "DELETE", "DIRECCION_PACIENTE", addressId);

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAddresses,
  createPatientAddress,
  updatePatientAddress,
  deletePatientAddress,
};
