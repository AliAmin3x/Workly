import { NextResponse } from "next/server";

export async function GET() {
  const pythonBackendUrl = process.env.PYTHON_BACKEND_URL;

  // Not configured yet
  if (!pythonBackendUrl) {
    return NextResponse.json({
      message: "Scraper not configured. Set PYTHON_BACKEND_URL in Vercel environment variables.",
      scraped: 0,
    }, { status: 200 });
  }

  try {
    const res = await fetch(`${pythonBackendUrl}/api/jobs/scrape`, {
      signal: AbortSignal.timeout(60000),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend error (${res.status}): ${text}` },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    const msg = error.name === "TimeoutError"
      ? "Request timed out — scraping takes a while, try again."
      : `Could not reach backend at ${pythonBackendUrl}: ${error.message}`;

    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
