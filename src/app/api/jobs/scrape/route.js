import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

// GET /api/jobs/scrape - trigger scraping from actuarylist.com via the Python backend
// This route is a proxy-compatible stub. For full scraping, run the Python backend.
// When the Python backend is running at localhost:5000, it can be called directly.
// In production Next.js, scraping runs server-side via this route using a lightweight fetch approach.

export async function GET() {
  try {
    // Attempt to proxy to the Python scraper if it's running
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000";

    let scraped = [];
    try {
      const res = await fetch(`${pythonBackendUrl}/api/jobs/scrape`, {
        method: "GET",
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Python backend not available - return informative message
    }

    return NextResponse.json({
      message:
        "Scraper requires the Python backend to be running. Start it with: cd backend && python app.py",
      scraped: 0,
    });
  } catch (error) {
    console.error("Scrape route error:", error);
    return NextResponse.json({ error: "Scrape failed" }, { status: 500 });
  }
}
