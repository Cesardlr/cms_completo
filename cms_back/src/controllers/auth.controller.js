const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/database");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    // Get user from database
    const result = await query(
      `SELECT u.id, u.username, u.correo, u.password_hash, u.rol_id, r.nombre as rol_nombre
       FROM USUARIO u
       LEFT JOIN ROL r ON r.id = u.rol_id
       WHERE u.username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.rol_nombre || "editor",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.correo,
        role: user.rol_nombre || "editor",
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.correo, u.telefono, u.rol_id, r.nombre as rol_nombre
       FROM USUARIO u
       LEFT JOIN ROL r ON r.id = u.rol_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.correo,
      phone: user.telefono,
      role: user.rol_nombre,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getCurrentUser,
};
