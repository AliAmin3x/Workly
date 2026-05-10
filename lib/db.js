import { createClient } from "@libsql/client";

let client = null;

function getClient() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. " +
      "For local dev: create a free Turso DB at turso.tech and add it to .env.local. " +
      "For Vercel: add it in your project's Environment Variables."
    );
  }

  client = createClient({ url, authToken });
  return client;
}

export async function getDb() {
  const db = getClient();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT,
      location TEXT,
      type TEXT,
      description TEXT,
      date_posted TEXT,
      link TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  return db;
}
