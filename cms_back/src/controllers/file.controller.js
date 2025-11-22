const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

// ARCHIVO
const getFiles = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    // Obtener archivos con sus asociaciones (tablas en minúsculas)
    const result = await query(
      `SELECT 
         a.id, 
         a.tipo, 
         a.url, 
         a.hash_integridad, 
         a.creado_en,
         aa.id AS asociacion_id,
         aa.entidad,
         aa.entidad_id,
         aa.descripcion AS asociacion_descripcion,
         aa.fecha_creacion AS asociacion_fecha,
         u.username AS autor_username,
         -- Información de la entidad asociada
         CASE 
           WHEN aa.entidad = 'PACIENTE' THEN p.nombre
           WHEN aa.entidad = 'MEDICO' THEN m.nombre
           WHEN aa.entidad = 'CONSULTA' THEN CONCAT('Consulta #', co.id::text)
           WHEN aa.entidad = 'EPISODIO' THEN CONCAT('Episodio #', e.id::text)
           WHEN aa.entidad = 'CITA' THEN CONCAT('Cita #', c.id::text)
           ELSE NULL
         END AS entidad_nombre
       FROM archivo a
       LEFT JOIN archivo_asociacion aa ON aa.archivo_id = a.id
       LEFT JOIN usuario u ON u.id = aa.creado_por_usuario_id
       LEFT JOIN paciente p ON aa.entidad = 'PACIENTE' AND p.id = aa.entidad_id
       LEFT JOIN medico m ON aa.entidad = 'MEDICO' AND m.id = aa.entidad_id
       LEFT JOIN consulta co ON aa.entidad = 'CONSULTA' AND co.id = aa.entidad_id
       LEFT JOIN episodio e ON aa.entidad = 'EPISODIO' AND e.id = aa.entidad_id
       LEFT JOIN cita c ON aa.entidad = 'CITA' AND c.id = aa.entidad_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR a.tipo ILIKE '%' || COALESCE($1::text,'') || '%'
         OR a.url ILIKE '%' || COALESCE($1::text,'') || '%'
         OR p.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR m.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
       )
       ORDER BY a.creado_en DESC
       LIMIT $2 OFFSET $3`,
      [search ?? null, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(DISTINCT a.id) AS total 
       FROM archivo a
       LEFT JOIN archivo_asociacion aa ON aa.archivo_id = a.id
       LEFT JOIN paciente p ON aa.entidad = 'PACIENTE' AND p.id = aa.entidad_id
       LEFT JOIN medico m ON aa.entidad = 'MEDICO' AND m.id = aa.entidad_id
       WHERE (
         COALESCE($1::text, '') = ''
         OR a.tipo ILIKE '%' || COALESCE($1::text,'') || '%'
         OR a.url ILIKE '%' || COALESCE($1::text,'') || '%'
         OR p.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
         OR m.nombre ILIKE '%' || COALESCE($1::text,'') || '%'
       )`,
      [search ?? null]
    );

    console.log("Files query result:", result.rows.length, "files found");
    console.log("Total count:", countResult.rows[0].total);

    res.json({
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error in getFiles:", error);
    next(error);
  }
};

const createFile = async (req, res, next) => {
  try {
    const {
      tipo,
      url,
      hash_integridad,
      // Parámetros de asociación opcionales
      entidad,
      entidad_id,
      descripcion,
    } = req.body;

    if (!tipo || !url) {
      return res.status(400).json({ error: "tipo and url are required" });
    }

    // Crear el archivo
    const result = await query(
      "INSERT INTO archivo (tipo, url, hash_integridad) VALUES ($1,$2,$3) RETURNING id",
      [tipo, url, hash_integridad || null]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "ARCHIVO", newId);

    // Si se proporcionan datos de asociación, crear la asociación automáticamente
    let associationId = null;
    if (entidad && entidad_id) {
      try {
        const associationResult = await query(
          `INSERT INTO archivo_asociacion (archivo_id, entidad, entidad_id, descripcion, creado_por_usuario_id)
           VALUES ($1,$2,$3,$4,$5) RETURNING id`,
          [newId, entidad, entidad_id, descripcion || null, req.user.id]
        );
        associationId = associationResult.rows[0].id;
        await logAudit(
          req.user.id,
          "CREATE",
          "ARCHIVO_ASOCIACION",
          associationId
        );
      } catch (assocError) {
        console.error("Error creating file association:", assocError);
        // No fallar si la asociación falla, pero registrar el error
      }
    }

    res.status(201).json({
      id: newId,
      association_id: associationId,
      message: associationId
        ? "File created and associated successfully"
        : "File created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, url, hash_integridad } = req.body;

    const result = await query(
      "UPDATE archivo SET tipo=$2, url=$3, hash_integridad=$4 WHERE id=$1 RETURNING id",
      [id, tipo, url, hash_integridad || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    await logAudit(req.user.id, "UPDATE", "ARCHIVO", id);

    res.json({ id: result.rows[0].id, message: "File updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM archivo WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "ARCHIVO", id);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ARCHIVO_ASOCIACION
const getFileAssociations = async (req, res, next) => {
  try {
    const { archivo_id } = req.query;

    const result = await query(
      `SELECT aa.id, aa.entidad, aa.entidad_id, aa.descripcion,
              aa.creado_por_usuario_id AS autor_id, u.username AS autor, aa.fecha_creacion, aa.archivo_id,
              a.url AS archivo_url, a.tipo AS archivo_tipo
       FROM archivo_asociacion aa
       LEFT JOIN usuario u ON u.id = aa.creado_por_usuario_id
       JOIN archivo a ON a.id = aa.archivo_id
       WHERE ($1::int IS NULL OR aa.archivo_id = $1::int)
       ORDER BY aa.fecha_creacion DESC`,
      [archivo_id || null]
    );

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
};

const createFileAssociation = async (req, res, next) => {
  try {
    const {
      archivo_id,
      entidad,
      entidad_id,
      descripcion,
      creado_por_usuario_id,
    } = req.body;

    const result = await query(
      `INSERT INTO archivo_asociacion (archivo_id, entidad, entidad_id, descripcion, creado_por_usuario_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [
        archivo_id,
        entidad,
        entidad_id || null,
        descripcion || null,
        creado_por_usuario_id || req.user.id,
      ]
    );

    const newId = result.rows[0].id;
    await logAudit(req.user.id, "CREATE", "ARCHIVO_ASOCIACION", newId);

    res
      .status(201)
      .json({ id: newId, message: "Association created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateFileAssociation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { entidad, entidad_id, descripcion, creado_por_usuario_id } =
      req.body;

    const result = await query(
      `UPDATE archivo_asociacion
       SET entidad=$2, entidad_id=$3, descripcion=$4, creado_por_usuario_id=$5
       WHERE id=$1 RETURNING id`,
      [
        id,
        entidad,
        entidad_id || null,
        descripcion || null,
        creado_por_usuario_id || null,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Association not found" });
    }

    await logAudit(req.user.id, "UPDATE", "ARCHIVO_ASOCIACION", id);

    res.json({
      id: result.rows[0].id,
      message: "Association updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteFileAssociation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM archivo_asociacion WHERE id=$1", [id]);
    await logAudit(req.user.id, "DELETE", "ARCHIVO_ASOCIACION", id);

    res.json({ message: "Association deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFiles,
  createFile,
  updateFile,
  deleteFile,
  getFileAssociations,
  createFileAssociation,
  updateFileAssociation,
  deleteFileAssociation,
};
