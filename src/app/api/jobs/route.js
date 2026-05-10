import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

// GET /api/jobs - list jobs with optional filters
export async function GET(request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword") || "";
    const type = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";
    const tags = searchParams.get("tags") || "";

    let sql = "SELECT * FROM jobs WHERE 1=1";
    const args = [];

    if (keyword) {
      sql += " AND (title LIKE ? OR company LIKE ?)";
      args.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (type && type.toLowerCase() !== "all") {
      sql += " AND type LIKE ?";
      args.push(`%${type}%`);
    }

    if (location && location.toLowerCase() !== "all") {
      sql += " AND location LIKE ?";
      args.push(`%${location}%`);
    }

    if (tags) {
      const tagList = tags.split(",").filter(Boolean);
      if (tagList.length > 0) {
        const tagClauses = tagList.map(() => "description LIKE ?").join(" OR ");
        sql += ` AND (${tagClauses})`;
        tagList.forEach((t) => args.push(`%${t}%`));
      }
    }

    sql += " ORDER BY id DESC";

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST /api/jobs - create a new job
export async function POST(request) {
  try {
    const db = await getDB();
    const data = await request.json();
    const { title, company, location, date_posted, link, description, type } = data;

    const result = await db.execute({
      sql: `INSERT INTO jobs (title, company, location, date_posted, link, description, type)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [title, company, location, date_posted, link, description, type],
    });

    const newJob = await db.execute({
      sql: "SELECT * FROM jobs WHERE id = ?",
      args: [result.lastInsertRowid],
    });

    return NextResponse.json(newJob.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
