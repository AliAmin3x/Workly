import { NextResponse } from "next/server";
import { getDb, saveDb, rowsToJobs } from "@/lib/db";

// GET /api/jobs - fetch all jobs with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const jobType = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";
    const tags = searchParams.get("tags") || "";

    const db = await getDb();

    let query = "SELECT * FROM jobs WHERE 1=1";
    const params = [];

    if (keyword) {
      query += " AND (title LIKE ? OR company LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (jobType && jobType.toLowerCase() !== "all") {
      query += " AND type LIKE ?";
      params.push(`%${jobType}%`);
    }

    if (location && location.toLowerCase() !== "all") {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    if (tags) {
      const tagList = tags.split(",").filter(Boolean);
      if (tagList.length > 0) {
        const tagConditions = tagList.map(() => "description LIKE ?").join(" OR ");
        query += ` AND (${tagConditions})`;
        tagList.forEach((t) => params.push(`%${t}%`));
      }
    }

    query += " ORDER BY id DESC";

    const result = db.exec(query, params);
    const jobs = rowsToJobs(result);

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST /api/jobs - add a new job
export async function POST(request) {
  try {
    const data = await request.json();
    const { title, company, location, type, description, date_posted, link } = data;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = await getDb();

    db.run(
      `INSERT INTO jobs (title, company, location, type, description, date_posted, link)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, company || null, location || null, type || null, description || null, date_posted || null, link || null]
    );

    saveDb();

    const result = db.exec("SELECT * FROM jobs ORDER BY id DESC LIMIT 1");
    const jobs = rowsToJobs(result);

    return NextResponse.json(jobs[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
