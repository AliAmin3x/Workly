import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const db = await getDb();
    const id = params.id;
    const data = await request.json();

    const existing = await db.execute({ sql: "SELECT * FROM jobs WHERE id = ?", args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = existing.rows[0];
    await db.execute({
      sql: `UPDATE jobs SET title=?, company=?, location=?, type=?, description=?, date_posted=?, link=? WHERE id=?`,
      args: [
        data.title ?? job.title,
        data.company ?? job.company,
        data.location ?? job.location,
        data.type ?? job.type,
        data.description ?? job.description,
        data.date_posted ?? job.date_posted,
        data.link ?? job.link,
        id,
      ],
    });

    const updated = await db.execute({ sql: "SELECT * FROM jobs WHERE id = ?", args: [id] });
    return NextResponse.json(updated.rows[0]);
  } catch (error) {
    console.error("PUT /api/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const id = params.id;

    const existing = await db.execute({ sql: "SELECT * FROM jobs WHERE id = ?", args: [id] });
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await db.execute({ sql: "DELETE FROM jobs WHERE id = ?", args: [id] });
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/jobs/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete job" }, { status: 500 });
  }
}
