const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "cms_medico",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

const initDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    // Read and execute schema
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📋 Creating tables...");
    await pool.query(schema);
    console.log("✅ Tables created successfully");

    // Read and execute seed data
    const seedPath = path.join(__dirname, "seed-data.sql");
    const seedData = fs.readFileSync(seedPath, "utf8");

    console.log("🌱 Seeding initial data...");
    await pool.query(seedData);
    console.log("✅ Seed data inserted successfully");

    console.log("🎉 Database initialized successfully!");

    // Test login
    console.log("\n📝 Test credentials:");
    console.log("   Username: admin");
    console.log("   Password: password123");
    console.log("   ---");
    console.log("   Username: editor");
    console.log("   Password: password123");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    await pool.end();
    process.exit(1);
  }
};

initDatabase();
