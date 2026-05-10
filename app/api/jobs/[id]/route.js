import { NextResponse } from "next/server";
import { getDb, saveDb, rowsToJobs } from "@/lib/db";

// PUT /api/jobs/[id] - update a job
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const data = await request.json();
    const { title, company, location, type, description, date_posted, link } = data;

    const db = await getDb();

    // Check if job exists
    const existing = db.exec("SELECT * FROM jobs WHERE id = ?", [id]);
    if (!existing || existing.length === 0 || existing[0].values.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    db.run(
      `UPDATE jobs SET
        title = COALESCE(?, title),
        company = COALESCE(?, company),
        location = COALESCE(?, location),
        type = COALESCE(?, type),
        description = COALESCE(?, description),
        date_posted = COALESCE(?, date_posted),
        link = COALESCE(?, link)
       WHERE id = ?`,
      [title, company, location, type, description, date_posted, link, id]
    );

    saveDb();

    const result = db.exec("SELECT * FROM jobs WHERE id = ?", [id]);
    const jobs = rowsToJobs(result);

    return NextResponse.json(jobs[0]);
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - delete a job
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const db = await getDb();

    const existing = db.exec("SELECT * FROM jobs WHERE id = ?", [id]);
    if (!existing || existing.length === 0 || existing[0].values.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    db.run("DELETE FROM jobs WHERE id = ?", [id]);
    saveDb();

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
