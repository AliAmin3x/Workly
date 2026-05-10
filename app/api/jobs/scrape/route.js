import { NextResponse } from "next/server";
import { getDb, saveDb, rowsToJobs } from "@/lib/db";
import { scrapeJobs } from "@/lib/scraper";

// GET /api/jobs/scrape - scrape and save jobs
export async function GET() {
  try {
    const scrapedJobs = await scrapeJobs();
    console.log("Scraped jobs count:", scrapedJobs.length);

    const db = await getDb();
    let savedCount = 0;

    for (const jobData of scrapedJobs) {
      // Avoid duplicates based on link
      if (jobData.link) {
        const existing = db.exec("SELECT id FROM jobs WHERE link = ?", [jobData.link]);
        if (existing.length > 0 && existing[0].values.length > 0) continue;
      }

      db.run(
        `INSERT INTO jobs (title, company, location, type, description, date_posted, link)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          jobData.title,
          jobData.company || null,
          jobData.location || null,
          jobData.type || null,
          jobData.description || null,
          jobData.date_posted || null,
          jobData.link || null,
        ]
      );
      savedCount++;
    }

    saveDb();

    return NextResponse.json({
      message: `${savedCount} new jobs scraped and saved successfully.`,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
