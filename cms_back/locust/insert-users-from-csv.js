const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { query } = require("../src/config/database");

/**
 * Script to insert users from users.csv into the database
 * CSV format: email,password
 */

async function insertUsersFromCSV() {
  try {
    const csvPath = path.join(__dirname, "users.csv");

    if (!fs.existsSync(csvPath)) {
      console.error(`❌ Error: ${csvPath} not found!`);
      process.exit(1);
    }

    console.log("📖 Reading users.csv...\n");

    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.trim().split("\n");

    // Skip header line
    const dataLines = lines.slice(1).filter((line) => line.trim() !== "");

    console.log(`📋 Found ${dataLines.length} users in CSV\n`);

    // Get existing usernames and emails to avoid duplicates
    const existingUsers = await query("SELECT username, correo FROM USUARIO");
    const existingUsernames = new Set(
      existingUsers.rows.map((u) => u.username.toLowerCase())
    );
    const existingEmails = new Set(
      existingUsers.rows.map((u) => u.correo?.toLowerCase()).filter(Boolean)
    );

    // Get available roles (default to rol_id = 3 for Paciente if exists, otherwise 2 for editor)
    const rolesResult = await query("SELECT id, nombre FROM ROL ORDER BY id");
    const roles = rolesResult.rows;
    const defaultRolId =
      roles.find((r) => r.nombre.toLowerCase() === "paciente")?.id ||
      roles.find((r) => r.nombre.toLowerCase() === "editor")?.id ||
      roles[0]?.id ||
      3;

    console.log(`📌 Using default role_id: ${defaultRolId}\n`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    // Process each line
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      try {
        // Parse CSV line (handle quoted values)
        const [email, password] = line
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""));

        if (!email || !password) {
          console.log(`⚠️  Skipping line ${i + 2}: missing email or password`);
          skipped++;
          continue;
        }

        // Check if email already exists
        if (existingEmails.has(email.toLowerCase())) {
          console.log(`⏭️  Skipping ${email}: email already exists`);
          skipped++;
          continue;
        }

        // Generate username from email (use part before @)
        let username = email.split("@")[0];

        // Ensure username is unique
        let finalUsername = username;
        let counter = 1;
        while (existingUsernames.has(finalUsername.toLowerCase())) {
          finalUsername = `${username}${counter}`;
          counter++;
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user
        const result = await query(
          `INSERT INTO USUARIO (username, correo, telefono, password_hash, rol_id) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [finalUsername, email, null, password_hash, defaultRolId]
        );

        const userId = result.rows[0].id;

        // Update tracking sets
        existingUsernames.add(finalUsername.toLowerCase());
        existingEmails.add(email.toLowerCase());

        inserted++;

        if ((i + 1) % 50 === 0) {
          console.log(`  ✅ Processed ${i + 1}/${dataLines.length} users...`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error processing line ${i + 2}:`, error.message);

        // If it's a duplicate key error, skip it
        if (error.code === "23505") {
          skipped++;
          console.log(`   (Duplicate entry, skipping)`);
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 Summary:");
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log("=".repeat(50) + "\n");

    if (inserted > 0) {
      console.log("✅ Users inserted successfully!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run the script
insertUsersFromCSV();
