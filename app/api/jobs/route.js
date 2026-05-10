import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword") || "";
    const jobType = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";
    const tags = searchParams.get("tags") || "";

    let sql = "SELECT * FROM jobs WHERE 1=1";
    const args = [];

    if (keyword) {
      sql += " AND (title LIKE ? OR company LIKE ?)";
      args.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (jobType && jobType.toLowerCase() !== "all") {
      sql += " AND type LIKE ?";
      args.push(`%${jobType}%`);
    }
    if (location && location.toLowerCase() !== "all") {
      sql += " AND location LIKE ?";
      args.push(`%${location}%`);
    }
    if (tags) {
      const tagList = tags.split(",").filter(Boolean);
      if (tagList.length > 0) {
        const clauses = tagList.map(() => "description LIKE ?").join(" OR ");
        sql += ` AND (${clauses})`;
        tagList.forEach((t) => args.push(`%${t}%`));
      }
    }

    sql += " ORDER BY id DESC";

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    const { title, company, location, type, description, date_posted, link } = data;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const result = await db.execute({
      sql: `INSERT INTO jobs (title, company, location, type, description, date_posted, link)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [title, company || null, location || null, type || null, description || null, date_posted || null, link || null],
    });

    const newJob = await db.execute({
      sql: "SELECT * FROM jobs WHERE id = ?",
      args: [result.lastInsertRowid],
    });

    return NextResponse.json(newJob.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: error.message || "Failed to create job" }, { status: 500 });
  }
}
