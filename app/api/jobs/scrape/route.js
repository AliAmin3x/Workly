import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000";

    try {
      const res = await fetch(`${pythonBackendUrl}/api/jobs/scrape`, {
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Python backend not running
    }

    return NextResponse.json({
      message: "Scraper requires the Python backend. Run: cd backend && python app.py",
      scraped: 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Scrape failed" }, { status: 500 });
  }
}
