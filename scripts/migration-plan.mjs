// @ts-check
/**
 * Migration bookkeeping shared by the deploy and PGLite appliers.
 *
 * Auth is intentionally opt-in. When VITE_AUTH_ENABLED is not "false", the
 * migration under migrations/auth/ is included automatically. When auth is
 * explicitly disabled, auth tables are not created.
 *
 * Applied files are keyed by BASENAME, so the same migration applies once even
 * if its path changes. This keeps the deploy and PGLite migration ledgers in
 * sync while allowing optional migrations to live in subdirectories.
 */

/**
 * The `_migrations` key for a migration path (or bare filename).
 * @param {string} path
 * @returns {string}
 */
export function migrationName(path) {
  return path.split("/").pop() ?? path;
}

/**
 * @param {string} path
 * @returns {boolean}
 */
export function isMigrationFile(path) {
  return path.endsWith(".sql");
}

/**
 * Whether this migration is enabled by the current application configuration.
 * Auth migrations are opt-in so a project with VITE_AUTH_ENABLED=false keeps
 * the lightweight dev database and does not create Better Auth tables.
 * @param {string} path
 * @param {Record<string, string | undefined>} [env]
 * @returns {boolean}
 */
export function isMigrationEnabled(path, env = process.env) {
  if (!isMigrationFile(path)) return false;
  if (path.startsWith("auth/") || path.includes("/auth/")) {
    return env.VITE_AUTH_ENABLED !== "false";
  }
  return true;
}

/**
 * Migrations in `paths` that are not yet in `applied`, in apply order.
 * Paths may be nested (for example `auth/0001_auth.sql`).
 * @param {Iterable<string>} paths
 * @param {Iterable<string>} applied
 * @param {Record<string, string | undefined>} [env]
 * @returns {Array<{ name: string, path: string }>}
 */
export function pendingMigrations(paths, applied, env = process.env) {
  const done = new Set(applied);
  return [...paths]
    .filter((path) => isMigrationEnabled(path, env))
    .map((path) => ({ name: migrationName(path), path }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(({ name }) => !done.has(name));
}
