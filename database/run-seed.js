const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const https = require("https");

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  process.env[key] = val;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const sql = fs.readFileSync(
    path.join(__dirname, "migrations", "003_reset_and_seed.sql"),
    "utf8"
  );

  console.log("Running seed SQL...");
  await pool.query(sql);
  console.log("Done! Database reset and seeded.");

  const res = await pool.query("SELECT role, COUNT(*)::int as count FROM users GROUP BY role");
  console.log("Users:", res.rows);

  const appt = await pool.query("SELECT doctor_id, COUNT(*)::int as count FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE GROUP BY doctor_id");
  console.log("Today's appointments by doctor:", appt.rows);

  await pool.end();
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
