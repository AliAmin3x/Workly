// Scraper using fetch + cheerio (Node.js compatible)
// Falls back gracefully if scraping fails

export async function scrapeJobs() {
  try {
    const response = await fetch("https://www.actuarylist.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error("Failed to fetch actuarylist:", response.status);
      return [];
    }

    const html = await response.text();

    // Simple regex-based extraction since we can't use Selenium in Next.js
    const jobs = [];

    // Extract job cards via regex patterns matching the site structure
    const cardPattern =
      /<article[^>]*>([\s\S]*?)<\/article>/gi;
    const cards = [...html.matchAll(cardPattern)];

    for (const card of cards) {
      const cardHtml = card[1];

      const titleMatch = cardHtml.match(
        /class="[^"]*job-card__position[^"]*"[^>]*>([^<]+)</
      );
      const companyMatch = cardHtml.match(
        /class="[^"]*job-card__company[^"]*"[^>]*>([^<]+)</
      );
      const locationMatch = cardHtml.match(
        /class="[^"]*job-card__locations[^"]*"[^>]*>([\s\S]*?)<\/div>/
      );
      const dateMatch = cardHtml.match(
        /class="[^"]*job-card__posted[^"]*"[^>]*>([^<]+)</
      );
      const linkMatch = cardHtml.match(/href="(\/jobs\/[^"]+)"/);

      const title = titleMatch ? titleMatch[1].trim() : null;
      const company = companyMatch ? companyMatch[1].trim() : null;
      const location = locationMatch
        ? locationMatch[1].replace(/<[^>]+>/g, "").trim()
        : null;
      const date_posted = dateMatch ? dateMatch[1].trim() : null;
      const link = linkMatch
        ? `https://www.actuarylist.com${linkMatch[1]}`
        : null;

      if (title && link) {
        jobs.push({
          title,
          company,
          location,
          date_posted,
          link,
          description: null,
          type: null,
        });
      }
    }

    return jobs;
  } catch (err) {
    console.error("Scraping error:", err.message);
    return [];
  }
}
