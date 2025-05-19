import fs from "fs/promises";
import pool from "../config/db.js";

async function runSQLFile(filePath) {
  const sql = await fs.readFile(filePath, "utf-8");
  await pool.query(sql);
  console.log(`✅ ${filePath} executed successfully.`);
}

async function init() {
  try {
    await runSQLFile("db/schema.sql");
    await runSQLFile("db/seed.sql");
    console.log("🎉 Database initialized.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error initializing DB:", err.message);
    process.exit(1);
  }
}

init();
