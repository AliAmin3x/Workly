import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

// PUT /api/jobs/[id] - update a job
export async function PUT(request, { params }) {
  try {
    const db = await getDB();
    const id = params.id;
    const data = await request.json();
    const { title, company, location, date_posted, link, description, type } = data;

    // Check job exists
    const existing = await db.execute({
      sql: "SELECT * FROM jobs WHERE id = ?",
      args: [id],
    });
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = existing.rows[0];

    await db.execute({
      sql: `UPDATE jobs SET title=?, company=?, location=?, date_posted=?, link=?, description=?, type=? WHERE id=?`,
      args: [
        title ?? job.title,
        company ?? job.company,
        location ?? job.location,
        date_posted ?? job.date_posted,
        link ?? job.link,
        description ?? job.description,
        type ?? job.type,
        id,
      ],
    });

    const updated = await db.execute({
      sql: "SELECT * FROM jobs WHERE id = ?",
      args: [id],
    });

    return NextResponse.json(updated.rows[0]);
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - delete a job
export async function DELETE(request, { params }) {
  try {
    const db = await getDB();
    const id = params.id;

    const existing = await db.execute({
      sql: "SELECT * FROM jobs WHERE id = ?",
      args: [id],
    });
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await db.execute({
      sql: "DELETE FROM jobs WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
