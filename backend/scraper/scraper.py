from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import os
import time


def scrape_jobs():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    # Use system chromium if available (Docker), otherwise let webdriver-manager handle it
    chrome_bin = os.environ.get("CHROME_BIN")
    chromedriver_path = os.environ.get("CHROMEDRIVER_PATH")

    if chrome_bin:
        options.binary_location = chrome_bin

    if chromedriver_path:
        service = Service(chromedriver_path)
    else:
        from webdriver_manager.chrome import ChromeDriverManager
        service = Service(ChromeDriverManager().install())

    driver = webdriver.Chrome(service=service, options=options)

    try:
        url = "https://www.actuarylist.com/"
        driver.get(url)
        time.sleep(3)

        soup = BeautifulSoup(driver.page_source, "html.parser")
        job_cards = soup.select("article div[class^='Job_job-card']")
        print(f"Found {len(job_cards)} job cards")

        jobs = []
        for job in job_cards:
            title_el = job.select_one("p.Job_job-card__position__ic1rc")
            company_el = job.select_one("p.Job_job-card__company__7T9qY")
            location_el = job.select_one("div.Job_job-card__locations__x1exr")
            date_el = job.select_one("p.Job_job-card__posted-on__NCZaJ")
            link_el = job.select_one("a.Job_job-page-link__a5I5g")

            title = title_el.get_text(strip=True) if title_el else None
            company = company_el.get_text(strip=True) if company_el else None
            location = location_el.get_text(strip=True) if location_el else None
            date_posted = date_el.get_text(strip=True) if date_el else None
            link = (
                "https://www.actuarylist.com" + link_el["href"]
                if link_el and link_el.get("href")
                else None
            )

            if not title or not link:
                continue

            jobs.append({
                "title": title,
                "company": company,
                "location": location,
                "date_posted": date_posted,
                "link": link,
                "description": None,
            })

        return jobs

    except Exception as e:
        print(f"Error during scraping: {e}")
        return []

    finally:
        driver.quit()
