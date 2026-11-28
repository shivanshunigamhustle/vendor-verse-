// Shared PostgreSQL client helper for CLI scripts.
const { Client } = require("pg");

/**
 * Builds a `pg.Client` using `DATABASE_URL` and `DATABASE_SSL`.
 * Accepts self-signed certificates when `DATABASE_SSL=true` (e.g. Render Postgres).
 */
function createPgClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is required");
  const ssl =
    process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false;
  const client = new Client({ connectionString, ssl });
  client.on("error", (error) =>
    console.error(`PostgreSQL connection lost: ${error.message}`),
  );
  return client;
}

module.exports = { createPgClient };
