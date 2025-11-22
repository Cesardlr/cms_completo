const bcrypt = require("bcryptjs");
const { query } = require("../config/database");
const { logAudit } = require("../utils/auditLogger");

const getUsers = async (req, res, next) => {
  try {
    const { search, limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT u.id, u.username, u.correo, u.telefono, u.rol_id, r.nombre as rol_nombre
       FROM usuario u
       LEFT JOIN rol r ON u.rol_id = r.id
       WHERE ($1::text IS NULL OR u.username ILIKE '%' || $1 || '%' OR u.correo ILIKE '%' || $1 || '%')
       ORDER BY u.id DESC
       LIMIT $2 OFFSET $3`,
      [search || null, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) AS total
           FROM usuario
          WHERE (
            $1::text IS NULL
            OR username ILIKE '%' || $1 || '%'
            OR correo   ILIKE '%' || $1 || '%'
          )`,
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

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT u.id, u.username, u.correo, u.telefono, u.rol_id, r.nombre as rol_nombre 
       FROM usuario u
       LEFT JOIN rol r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, correo, telefono, password, rol_id } = req.body;

    if (!username || !correo || !password) {
      return res
        .status(400)
        .json({ error: "Username, email and password required" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO usuario (username, correo, telefono, password_hash, rol_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        username,
        correo,
        telefono || null,
        password_hash,
        rol_id || 3, // Default to Paciente (3)
      ]
    );

    const newUserId = result.rows[0].id;

    // Log audit
    await logAudit(
      req.user.id,
      "CREATE",
      "USUARIO",
      newUserId,
      JSON.stringify({ username, correo })
    );

    res
      .status(201)
      .json({ id: newUserId, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, correo, telefono, rol_id } = req.body;

    const result = await query(
      `UPDATE usuario 
       SET username=$2, correo=$3, telefono=$4, rol_id=$5 
       WHERE id=$1 RETURNING id`,
      [id, username, correo, telefono || null, rol_id || null]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log audit
    await logAudit(
      req.user.id,
      "UPDATE",
      "USUARIO",
      id,
      JSON.stringify({ username, correo })
    );

    res.json({ id: result.rows[0].id, message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(
      `UPDATE usuario SET password_hash=$2 WHERE id=$1`,
      [id, password_hash]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query("DELETE FROM usuario WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log audit
    await logAudit(req.user.id, "DELETE", "USUARIO", id, null);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
