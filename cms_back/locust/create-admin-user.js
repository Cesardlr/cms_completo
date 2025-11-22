const bcrypt = require("bcryptjs");
const { query } = require("../src/config/database");

async function createAdminUser() {
  try {
    const username = "admin";
    const password = "password";
    const correo = "admin@cms.com";
    const telefono = null;
    const rol_id = 1; // Administrador

    // Check if admin user already exists
    const existingUser = await query(
      "SELECT id FROM USUARIO WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      console.log("❌ User 'admin' already exists!");
      console.log("Updating password...");

      // Update password
      const password_hash = await bcrypt.hash(password, 10);
      await query(
        "UPDATE USUARIO SET password_hash = $1, rol_id = $2 WHERE username = $3",
        [password_hash, rol_id, username]
      );
      console.log("✅ Admin user password updated successfully!");
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: Administrador (ID: ${rol_id})`);
      process.exit(0);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await query(
      `INSERT INTO USUARIO (username, correo, telefono, password_hash, rol_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [username, correo, telefono, password_hash, rol_id]
    );

    console.log("✅ Admin user created successfully!");
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Email: ${correo}`);
    console.log(`   Role: Administrador (ID: ${rol_id})`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
