import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL;

    if (!pythonBackendUrl) {
      return NextResponse.json({
        message: "PYTHON_BACKEND_URL is not set. Add your Railway backend URL to Vercel environment variables.",
        scraped: 0,
      });
    }

    const res = await fetch(`${pythonBackendUrl}/api/jobs/scrape`, {
      signal: AbortSignal.timeout(60000), // scraping takes time
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Scrape proxy error:", error);
    return NextResponse.json(
      { error: "Scraping failed. Make sure the Python backend is running." },
      { status: 500 }
    );
  }
}
