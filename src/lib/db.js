import { createClient } from "@libsql/client";
import path from "path";

let client;

function getClient() {
  if (!client) {
    const dbPath = path.join(process.cwd(), "jobs.db");
    client = createClient({
      url: `file:${dbPath}`,
    });
  }
  return client;
}

export async function initDB() {
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

export async function getDB() {
  const db = getClient();
  // Ensure table exists
  await initDB();
  return db;
}
