import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, "../src/database/migrations");
const DB_NAME = "temanbaru";

const getAppliedMigrations = () => {
  try {
    const output = execSync(
      `wrangler d1 execute ${DB_NAME} --command "SELECT name FROM migrations;" --json`
    ).toString();

    const parsed = JSON.parse(output);
    if (!parsed || !Array.isArray(parsed) || !parsed[0]?.results) {
      console.warn("⚠️ Unexpected format for migration query result:", parsed);
      return [];
    }
    return parsed[0].results.map((row: any) => row.name);
  } catch (e) {
    console.log("ℹ️ No 'migrations' table found. Creating...");
    execSync(
      `wrangler d1 execute ${DB_NAME} --command "CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY);"`
    );
    return [];
  }
};

const applyMigration = (file: string) => {
  console.log(`🔄 Applying migration: ${file}`);
  execSync(
    `wrangler d1 execute ${DB_NAME} --file="${path.join(MIGRATIONS_DIR, file)}"`
  );
  execSync(
    `wrangler d1 execute ${DB_NAME} --command "INSERT INTO migrations (name) VALUES ('${file}');"`
  );
};

const run = async () => {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const applied = getAppliedMigrations();

  const pending = files.filter((f) => !applied.includes(f));
  if (pending.length === 0) {
    console.log("✅ All migrations are up to date.");
    return;
  }

  for (const file of pending) {
    applyMigration(file);
  }

  console.log("✅ Done applying migrations.");
};

run();
