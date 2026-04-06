import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { createClient } from "@libsql/client";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_DB_URL || process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_TOKEN || process.env.DATABASE_TOKEN;

if (!url) {
  console.error("No database URL found");
  process.exit(1);
}

const client = createClient({ url, authToken: authToken || undefined });

async function main() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error("Usage: tsx scripts/run-migration.ts <sql-file>");
    process.exit(1);
  }

  const sql = readFileSync(sqlFile, "utf-8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`Running ${statements.length} statements from ${sqlFile}...`);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log("  OK:", stmt.substring(0, 60) + "...");
    } catch (err) {
      console.error("  ERROR:", stmt.substring(0, 60) + "...");
      console.error("  ", err instanceof Error ? err.message : err);
    }
  }

  console.log("Done.");
}

main().catch(console.error);
