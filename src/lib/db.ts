import { pendingMigrations } from "../../scripts/migration-plan.mjs";

/** Which database backend is active. */
export type DbSource = "turso" | "pglite";

const env = typeof process !== "undefined" ? process.env : undefined;
const tursoUrl = env?.TURSO_DATABASE_URL?.trim() || env?.TURSO_URL?.trim();
const tursoToken = env?.TURSO_AUTH_TOKEN?.trim();
const isVercel = env?.VERCEL === "1";

if (isVercel && (!tursoUrl || !tursoToken)) {
  throw new Error(
    "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required on Vercel. Configure the Turso database in the Vercel project environment variables.",
  );
}

export const dbSource: DbSource = tursoUrl && tursoToken ? "turso" : "pglite";

export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __tursoSqlPromise__?: Promise<Sql>;
  __tursoClient__?: import("@libsql/client").Client;
  __tursoSchemaPromise__?: Promise<void>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;

type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

async function createTursoSql(): Promise<Sql> {
  if (!tursoUrl || !tursoToken) throw new Error("Turso credentials are not configured");

  globalRef.__tursoSqlPromise__ ??= (async () => {
    const { createClient } = await import("@libsql/client");
    const client = createClient({ url: tursoUrl, authToken: tursoToken });
    globalRef.__tursoClient__ = client;

    // SQLite schema used by the production Turso database. This is intentionally
    // idempotent so an existing database is left untouched except for the
    // additive second-photo columns required by the Telegram album feature.
    globalRef.__tursoSchemaPromise__ ??= (async () => {
      await client.batch([
        { sql: "CREATE TABLE IF NOT EXISTS telegram_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT NOT NULL, message_id INTEGER NOT NULL, chat_username TEXT, chat_title TEXT, text TEXT NOT NULL DEFAULT '', published_at TEXT NOT NULL, photo_file_id TEXT, photo_data BLOB, photo_mime_type TEXT, photo_data_2 BLOB, photo_mime_type_2 TEXT, message_url TEXT, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(chat_id, message_id))" },
        { sql: "CREATE INDEX IF NOT EXISTS telegram_posts_published_at_idx ON telegram_posts (published_at DESC)" },
        { sql: "CREATE INDEX IF NOT EXISTS telegram_posts_chat_id_idx ON telegram_posts (chat_id)" },
      ], "write");

      const columns = await client.execute("PRAGMA table_info(telegram_posts)");
      const names = new Set(columns.rows.map((row) => String(row.name)));
      const additions = [];
      if (!names.has("photo_data_2")) additions.push({ sql: "ALTER TABLE telegram_posts ADD COLUMN photo_data_2 BLOB" });
      if (!names.has("photo_mime_type_2")) additions.push({ sql: "ALTER TABLE telegram_posts ADD COLUMN photo_mime_type_2 TEXT" });
      if (additions.length) await client.batch(additions, "write");
    })();
    await globalRef.__tursoSchemaPromise__;

    return toSql(async <T>(text: string, params: unknown[]) => {
      const result = await client.execute({ sql: text, args: params as import("@libsql/client").InValue[] });
      return result.rows as unknown as T[];
    });
  })().catch((err) => {
    globalRef.__tursoSqlPromise__ = undefined;
    globalRef.__tursoSchemaPromise__ = undefined;
    throw err;
  });

  return globalRef.__tursoSqlPromise__;
}

async function createPgliteSql(): Promise<Sql> {
  globalRef.__pgliteInstance__ ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite("memory://", {
      parsers: {
        [OID_INT8]: Number,
        [OID_DATE]: identity,
        [OID_INTERVAL]: identity,
      },
    });
    await pg.waitReady;
    await pg.exec(
      "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
    );
    return pg;
  })().catch((err) => {
    globalRef.__pgliteInstance__ = undefined;
    throw err;
  });

  const pg = await globalRef.__pgliteInstance__;
  const migrate = async (): Promise<void> => {
    const migrations = import.meta.glob("/migrations/**/*.sql", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const doneRows = await pg.query<{ name: string }>("select name from _migrations");
    const done = doneRows.rows.map((r) => r.name);
    const paths = Object.keys(migrations).map((path) => path.replace(/^\/migrations\//, ""));
    for (const { name, path } of pendingMigrations(paths, done)) {
      const sourcePath = `/migrations/${path}`;
      await pg.transaction(async (tx) => {
        await tx.exec(migrations[sourcePath]);
        await tx.query("insert into _migrations (name) values ($1)", [name]);
      });
    }
  };

  const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => undefined).then(migrate);
  globalRef.__pgliteMigrateChain__ = pass;
  await pass;
  return toSql(async <T>(text: string, params: unknown[]) => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  });
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error("@/lib/db is server-only — call getSql() from a server route or loader.");
  }
  return dbSource === "turso" ? createTursoSql() : createPgliteSql();
}

export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null;
    throw err;
  });
  return sqlPromise;
}

export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (dbSource !== "pglite") throw new Error("getPglite() is only available on the PGLite fallback");
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGLite instance failed to initialize");
  return pg;
}

export function ensureDbReady(): Promise<void> {
  if (dbSource !== "pglite") return Promise.resolve();
  return getSql().then(() => undefined);
}

const globalBoot = globalThis as typeof globalThis & { __pgBootstrapPromise__?: Promise<void> };
if (typeof window === "undefined" && dbSource === "pglite") {
  globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
    globalBoot.__pgBootstrapPromise__ = undefined;
    console.error("[db] PGLite bootstrap failed:", err);
    throw err;
  });
}
