const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

// CITA
const getAppointments = async (req, res, next) => {
  try {
    const {
      fecha_desde,
      fecha_hasta,
      id_estado_cita,
      id_tipo_cita,
      medico_id,
      paciente_id,
      limit = 10,
      offset = 0,
    } = req.query;

    const result = await query(
      `SELECT c.id, c.fecha_inicio, c.fecha_fin,
              ec.nombre AS estado, tc.nombre AS tipo,
              p.id AS paciente_id, p.nombre AS paciente,
              m.id AS medico_id, m.nombre AS medico,
              c.id_estado_cita, c.id_tipo_cita
       FROM cita c
       LEFT JOIN estado_cita ec ON ec.id = c.id_estado_cita
       LEFT JOIN tipo_cita   tc ON tc.id = c.id_tipo_cita
       LEFT JOIN paciente    p  ON p.id = c.paciente_id
       LEFT JOIN medico      m  ON m.id = c.medico_id
       WHERE ($1::timestamptz IS NULL OR c.fecha_inicio >= $1::timestamptz)
         AND ($2::timestamptz IS NULL OR c.fecha_inicio <  $2::timestamptz)
         AND ($3::int IS NULL OR c.id_estado_cita = $3::int)
         AND ($4::int IS NULL OR c.id_tipo_cita   = $4::int)
         AND ($5::int IS NULL OR c.medico_id      = $5::int)
         AND ($6::int IS NULL OR c.paciente_id    = $6::int)
       ORDER BY c.fecha_inicio DESC
       LIMIT $7 OFFSET $8`,
      [
        fecha_desde ?? null,
        fecha_hasta ?? null,
        id_estado_cita ?? null,
        id_tipo_cita ?? null,
        medico_id ?? null,
        paciente_id ?? null,
        limit,
        offset,
      ]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM cita c
       WHERE ($1::timestamptz IS NULL OR c.fecha_inicio >= $1::timestamptz)
         AND ($2::timestamptz IS NULL OR c.fecha_inicio <  $2::timestamptz)
         AND ($3::int IS NULL OR c.id_estado_cita = $3::int)
         AND ($4::int IS NULL OR c.id_tipo_cita   = $4::int)
         AND ($5::int IS NULL OR c.medico_id      = $5::int)
         AND ($6::int IS NULL OR c.paciente_id    = $6::int)`,
      [
        fecha_desde ?? null,
        fecha_hasta ?? null,
        id_estado_cita ?? null,
        id_tipo_cita ?? null,
        medico_id ?? null,
        paciente_id ?? null,
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

const createAppointment = async (req, res, next) => {
  try {
    const {
      paciente_id,
      medico_id,
      fecha_inicio,
      fecha_fin,
      id_estado_cita,
      id_tipo_cita,
    } = req.body;

    if (!paciente_id || !medico_id || !fecha_inicio) {
      return res.status(400).json({
        error: "paciente_id, medico_id, and fecha_inicio are required",
      });
    }

    const result = await query(
      `INSERT INTO cita (paciente_id, medico_id, fecha_inicio, fecha_fin, id_estado_cita, id_tipo_cita)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [
        paciente_id,
        medico_id,
        fecha_inicio,
        fecha_fin || null,
        id_estado_cita || null,
        id_tipo_cita || null,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "CITA", newId);

    res
      .status(201)
      .json({ id: newId, message: "Appointment created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      paciente_id,
      medico_id,
      fecha_inicio,
      fecha_fin,
      id_estado_cita,
      id_tipo_cita,
    } = req.body;

    const result = await query(
      `UPDATE cita
       SET paciente_id=$2, medico_id=$3,
           fecha_inicio=$4, fecha_fin=$5, id_estado_cita=$6, id_tipo_cita=$7
       WHERE id=$1
       RETURNING id`,
      [
        id,
        paciente_id,
        medico_id,
        fecha_inicio,
        fecha_fin || null,
        id_estado_cita || null,
        id_tipo_cita || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await logAudit(req.user.id, "UPDATE", "CITA", id);

    res.json({
      id: result.rows[0].id,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM cita WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "CITA", id);

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// CONSULTA
const getConsultations = async (req, res, next) => {
  try {
    const {
      fecha_desde,
      fecha_hasta,
      id_estado_consulta,
      medico_id,
      paciente_id,
      limit = 10,
      offset = 0,
    } = req.query;

    // Query to get all consultations - using uppercase table names to match database
    const result = await query(
      `SELECT co.id, co.fecha_hora, 
              co.cita_id, 
              co.narrativa, co.diagnostico_final, co.id_episodio, 
              co.id_estado_consulta, co.mongo_consulta_id,
              co.id_paciente, co.id_medico,
              ecn.nombre AS estado_consulta,
              p.nombre AS paciente,
              m.nombre AS medico
       FROM CONSULTA co
       LEFT JOIN ESTADO_CONSULTA ecn ON ecn.id = co.id_estado_consulta
       LEFT JOIN PACIENTE p ON p.id = co.id_paciente
       LEFT JOIN MEDICO m ON m.id = co.id_medico
       WHERE ($1::timestamptz IS NULL OR co.fecha_hora >= $1::timestamptz)
         AND ($2::timestamptz IS NULL OR co.fecha_hora <  $2::timestamptz)
         AND ($3::int IS NULL OR co.id_estado_consulta = $3::int)
         AND ($4::int IS NULL OR co.id_medico = $4::int)
         AND ($5::int IS NULL OR co.id_paciente = $5::int)
       ORDER BY co.fecha_hora DESC
       LIMIT $6 OFFSET $7`,
      [
        fecha_desde ?? null,
        fecha_hasta ?? null,
        id_estado_consulta ?? null,
        medico_id ?? null,
        paciente_id ?? null,
        limit,
        offset,
      ]
    );

    const countResult = await query(
      `SELECT COUNT(*) AS total FROM CONSULTA co
       WHERE ($1::timestamptz IS NULL OR co.fecha_hora >= $1::timestamptz)
         AND ($2::timestamptz IS NULL OR co.fecha_hora <  $2::timestamptz)
         AND ($3::int IS NULL OR co.id_estado_consulta = $3::int)
         AND ($4::int IS NULL OR co.id_medico = $4::int)
         AND ($5::int IS NULL OR co.id_paciente = $5::int)`,
      [
        fecha_desde ?? null,
        fecha_hasta ?? null,
        id_estado_consulta ?? null,
        medico_id ?? null,
        paciente_id ?? null,
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

const createConsultation = async (req, res, next) => {
  try {
    const {
      cita_id,
      id_estado_consulta,
      id_episodio,
      id_paciente,
      id_medico,
      fecha_hora,
      narrativa,
      diagnostico_final,
      mongo_consulta_id,
    } = req.body;

    if (!cita_id || !id_paciente || !id_medico) {
      return res
        .status(400)
        .json({ error: "cita_id, id_paciente, and id_medico are required" });
    }

    const result = await query(
      `INSERT INTO CONSULTA (cita_id, id_estado_consulta, id_episodio, id_paciente, id_medico, fecha_hora, narrativa, diagnostico_final, mongo_consulta_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        cita_id,
        id_estado_consulta || null,
        id_episodio || null,
        id_paciente,
        id_medico,
        fecha_hora || null,
        narrativa || null,
        diagnostico_final || null,
        mongo_consulta_id || null,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "CONSULTA", newId);

    res
      .status(201)
      .json({ id: newId, message: "Consultation created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_estado_consulta,
      id_episodio,
      fecha_hora,
      narrativa,
      diagnostico_final,
      mongo_consulta_id,
    } = req.body;

    const result = await query(
      `UPDATE CONSULTA
       SET id_estado_consulta=$2, id_episodio=$3, fecha_hora=$4, narrativa=$5, diagnostico_final=$6, mongo_consulta_id=$7
       WHERE id=$1
       RETURNING id`,
      [
        id,
        id_estado_consulta || null,
        id_episodio || null,
        fecha_hora || null,
        narrativa || null,
        diagnostico_final || null,
        mongo_consulta_id || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    await logAudit(req.user.id, "UPDATE", "CONSULTA", id);

    res.json({
      id: result.rows[0].id,
      message: "Consultation updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM CONSULTA WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "CONSULTA", id);

    res.json({ message: "Consultation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// EPISODIO
const getEpisodes = async (req, res, next) => {
  try {
    const { paciente_id, limit = 10, offset = 0 } = req.query;

    let queryText = `SELECT e.id, e.id_paciente, e.fecha_inicio, e.fecha_fin, e.motivo,
                            p.nombre AS paciente
                     FROM episodio e
                     JOIN paciente p ON p.id = e.id_paciente
                     WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (paciente_id) {
      queryText += ` AND e.id_paciente = $${paramCount}`;
      params.push(paciente_id);
      paramCount++;
    }

    queryText += ` ORDER BY COALESCE(e.fecha_fin, e.fecha_inicio) DESC LIMIT $${paramCount} OFFSET $${
      paramCount + 1
    }`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

const createEpisode = async (req, res, next) => {
  try {
    const { id_paciente, motivo } = req.body;

    if (!id_paciente) {
      return res.status(400).json({ error: "id_paciente is required" });
    }

    const result = await query(
      "INSERT INTO episodio (id_paciente, motivo) VALUES ($1, $2) RETURNING id",
      [id_paciente, motivo || null]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "EPISODIO", newId);

    res
      .status(201)
      .json({ id: newId, message: "Episode created successfully" });
  } catch (error) {
    next(error);
  }
};

const closeEpisode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha_fin } = req.body;

    const result = await query(
      "UPDATE episodio SET fecha_fin = $2 WHERE id = $1 RETURNING id",
      [id, fecha_fin || new Date().toISOString()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Episode not found" });
    }

    await logAudit(
      req.user.id,
      "UPDATE",
      "EPISODIO",
      id,
      JSON.stringify({ action: "closed" })
    );

    res.json({ id: result.rows[0].id, message: "Episode closed successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteEpisode = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM episodio WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "EPISODIO", id);

    res.json({ message: "Episode deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getEpisodes,
  createEpisode,
  closeEpisode,
  deleteEpisode,
};
