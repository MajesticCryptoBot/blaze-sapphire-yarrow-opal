#!/usr/bin/env node
/**
 * Deploy-time database migrator (node-postgres, `pg`).
 *
 * Runs during `npm run build` — on every Vercel deploy — applying pending SQL
 * files under ../migrations to DATABASE_URL. Files may live in subdirectories
 * (currently migrations/auth/). Each file is applied in one transaction and
 * recorded in `_migrations`, so it runs once and is safe to re-run.
 *
 * Auth migrations are included only when VITE_AUTH_ENABLED is not "false".
 * No DATABASE_URL (local / preview builds) -> skip; the PGLite fallback applies
 * the same enabled files at startup instead (see src/lib/db.ts).
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import pg from "pg";
import { pendingMigrations } from "./migration-plan.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.log(
    "[migrate] DATABASE_URL not set — skipping (the PGLite fallback migrates itself).",
  );
  process.exit(0);
}

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

/** Recursively collect migration files as paths relative to migrations/. */
async function collectMigrationFiles(dir = migrationsDir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMigrationFiles(absolute)));
    } else if (entry.isFile() && entry.name.endsWith(".sql")) {
      files.push(relative(migrationsDir, absolute).replaceAll("\\", "/"));
    }
  }
  return files;
}

async function main() {
  let entries;
  try {
    entries = await collectMigrationFiles();
  } catch {
    console.log("[migrate] no migrations/ directory — nothing to do.");
    return;
  }

  if (pendingMigrations(entries, []).length === 0) {
    console.log("[migrate] no enabled migrations — nothing to do.");
    return;
  }

  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    await client.query(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const applied = (await client.query("SELECT name FROM _migrations")).rows.map(
      (r) => r.name,
    );

    let count = 0;
    for (const { name, path } of pendingMigrations(entries, applied)) {
      const text = await readFile(join(migrationsDir, path), "utf8");
      try {
        await client.query("BEGIN");
        await client.query(text);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
      } catch (err) {
        console.error(`[migrate] error applying ${path}`);
        try {
          await client.query("ROLLBACK");
        } catch {
          // ROLLBACK fails when the connection died — keep the original error.
        }
        throw err;
      }
      console.log(`[migrate] applied ${path}`);
      count += 1;
    }
    console.log(count ? `[migrate] done — ${count} migration(s) applied.` : "[migrate] up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err?.message || err);
  for (const key of ["code", "detail", "hint", "position", "where"]) {
    if (err?.[key] != null) console.error(`[migrate]   ${key}: ${err[key]}`);
  }
  process.exit(1);
});
