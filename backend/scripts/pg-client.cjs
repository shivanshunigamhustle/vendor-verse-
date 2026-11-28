// Shared PostgreSQL client helper for CLI scripts.
const { Client } = require("pg");

function stripSslParams(connectionString) {
  try {
    const parsed = new URL(connectionString);
    if (
      !parsed.searchParams.has("ssl") &&
      !parsed.searchParams.has("sslmode") &&
      !parsed.searchParams.has("uselibpqcompat")
    ) {
      return connectionString;
    }
    parsed.searchParams.delete("ssl");
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("uselibpqcompat");
    return parsed.toString();
  } catch {
    return connectionString;
  }
}

/**
 * Builds a `pg.Client` using `DATABASE_URL` and `DATABASE_SSL`.
 * Accepts self-signed certificates when `DATABASE_SSL=true` (e.g. Render Postgres).
 */
function createPgClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is required");
  const ssl =
    process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false;
  const client = new Client({
    connectionString: stripSslParams(connectionString),
    ssl,
  });
  client.on("error", (error) =>
    console.error(`PostgreSQL connection lost: ${error.message}`),
  );
  return client;
}

module.exports = { createPgClient };
