const bcrypt = require("bcryptjs");
const { query } = require("../src/config/database");

// Función para generar username único basado en nombre y email
function generateUsername(nombre, correo, existingUsernames) {
  // Intentar usar el email sin el dominio
  if (correo) {
    const emailPart = correo.split("@")[0];
    if (!existingUsernames.has(emailPart.toLowerCase())) {
      return emailPart;
    }
  }

  // Si no funciona, usar el nombre
  if (nombre) {
    const nameParts = nombre.toLowerCase().split(" ");
    let baseUsername = nameParts.join(".");

    // Si ya existe, agregar números
    let username = baseUsername;
    let counter = 1;
    while (existingUsernames.has(username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }
    return username;
  }

  // Fallback
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

// Función para generar password temporal
function generatePassword() {
  return "password123"; // Password temporal, el usuario deberá cambiarlo
}

async function createMissingUsers() {
  try {
    console.log("🔍 Buscando pacientes y médicos sin usuario...\n");

    // Obtener todos los usernames existentes
    const existingUsers = await query("SELECT username FROM USUARIO");
    const existingUsernames = new Set(
      existingUsers.rows.map((u) => u.username.toLowerCase())
    );

    // Buscar pacientes sin usuario_id
    const patientsWithoutUser = await query(
      "SELECT id, nombre, correo FROM PACIENTE WHERE usuario_id IS NULL"
    );

    console.log(
      `📋 Encontrados ${patientsWithoutUser.rows.length} pacientes sin usuario`
    );

    // Crear usuarios para pacientes
    for (const patient of patientsWithoutUser.rows) {
      try {
        const username = generateUsername(
          patient.nombre,
          patient.correo,
          existingUsernames
        );
        const password = generatePassword();
        const password_hash = await bcrypt.hash(password, 10);
        const rol_id = 3; // Paciente

        // Crear usuario
        const userResult = await query(
          `INSERT INTO USUARIO (username, correo, telefono, password_hash, rol_id) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [username, patient.correo || null, null, password_hash, rol_id]
        );

        const userId = userResult.rows[0].id;

        // Actualizar paciente con el nuevo usuario_id
        await query("UPDATE PACIENTE SET usuario_id = $1 WHERE id = $2", [
          userId,
          patient.id,
        ]);

        existingUsernames.add(username.toLowerCase());

        console.log(
          `  ✅ Paciente "${patient.nombre}" -> Usuario: ${username} (ID: ${userId})`
        );
      } catch (error) {
        console.error(
          `  ❌ Error creando usuario para paciente ${patient.nombre}:`,
          error.message
        );
      }
    }

    // Buscar médicos sin usuario_id
    const doctorsWithoutUser = await query(
      "SELECT id, nombre, correo FROM MEDICO WHERE usuario_id IS NULL"
    );

    console.log(
      `\n👨‍⚕️ Encontrados ${doctorsWithoutUser.rows.length} médicos sin usuario`
    );

    // Crear usuarios para médicos
    for (const doctor of doctorsWithoutUser.rows) {
      try {
        const username = generateUsername(
          doctor.nombre,
          doctor.correo,
          existingUsernames
        );
        const password = generatePassword();
        const password_hash = await bcrypt.hash(password, 10);
        const rol_id = 2; // Médico

        // Crear usuario
        const userResult = await query(
          `INSERT INTO USUARIO (username, correo, telefono, password_hash, rol_id) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [username, doctor.correo || null, null, password_hash, rol_id]
        );

        const userId = userResult.rows[0].id;

        // Actualizar médico con el nuevo usuario_id
        await query("UPDATE MEDICO SET usuario_id = $1 WHERE id = $2", [
          userId,
          doctor.id,
        ]);

        existingUsernames.add(username.toLowerCase());

        console.log(
          `  ✅ Médico "${doctor.nombre}" -> Usuario: ${username} (ID: ${userId})`
        );
      } catch (error) {
        console.error(
          `  ❌ Error creando usuario para médico ${doctor.nombre}:`,
          error.message
        );
      }
    }

    console.log("\n✅ Proceso completado!");
    console.log(
      "\n📝 Nota: La contraseña temporal para todos los usuarios es: password123"
    );
    console.log(
      "   Se recomienda que los usuarios cambien su contraseña al iniciar sesión.\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error general:", error);
    process.exit(1);
  }
}

createMissingUsers();
