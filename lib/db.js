import path from "path";
import fs from "fs";

let db = null;

export async function getDb() {
  if (db) return db;

  const initSqlJs = (await import("sql.js")).default;
  const SQL = await initSqlJs();

  const dbPath = path.join(process.cwd(), "jobs.db");

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create table if not exists
  db.run(`
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

  saveDb();
  return db;
}

export function saveDb() {
  if (!db) return;
  const dbPath = path.join(process.cwd(), "jobs.db");
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function rowToJob(row) {
  const [id, title, company, location, type, description, date_posted, link, created_at] = row.values[0];
  return { id, title, company, location, type, description, date_posted, link, created_at };
}

export function rowsToJobs(result) {
  if (!result || result.length === 0) return [];
  const { columns, values } = result[0];
  return values.map((row) => {
    const obj = {};
    columns.forEach((col, i) => (obj[col] = row[i]));
    return obj;
  });
}
