import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationName = process.argv[2];
if (!migrationName) {
  console.error("❌ Please provide a migration name: npm run make:migration your_migration_name");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
const filename = `${timestamp}_${migrationName}.sql`;
const filePath = path.join(__dirname, "../src/database/migrations", filename);

fs.writeFileSync(filePath, `-- Migration: ${migrationName}\n\n`);
console.log(`✅ Created migration: ${filename}`);
