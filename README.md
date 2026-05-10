# Workly

A full-stack job tracking and discovery app built with **Next.js** (frontend + API routes) and **SQLite** via `@libsql/client`.

The original project had a separate React (CRA) frontend and Flask/Python backend. This repo combines both into a single Next.js monorepo — the frontend and API routes live in Next.js, while the original Python backend (including the Selenium scraper) is preserved in the `backend/` folder.

## Project Structure

```
workly/
├── src/
│   ├── app/
│   │   ├── api/jobs/
│   │   │   ├── route.js            # GET (list/filter) + POST (create)
│   │   │   ├── [id]/route.js       # PUT (update) + DELETE (delete)
│   │   │   └── scrape/route.js     # GET (proxy to Python scraper)
│   │   ├── Dashboard.jsx           # Main page component (client)
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── JobCard.jsx
│   │   ├── JobFormModal.jsx
│   │   ├── FilterJob.jsx
│   │   ├── DeleteJob.jsx
│   │   └── Modal.jsx
│   └── lib/
│       └── db.js                   # SQLite client (libsql)
├── backend/                        # Original Flask/Python backend + Selenium scraper
│   ├── app.py
│   ├── config.py
│   ├── db.py
│   ├── requirements.txt
│   ├── models/job.py
│   ├── routes/job_routes.py
│   └── scraper/scraper.py
└── package.json
```

## Getting Started

### Next.js App (frontend + API)

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

### Python Backend (optional — for Selenium scraping)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Flask backend runs at http://localhost:5000

> The Next.js `/api/jobs/scrape` route will automatically proxy to the Python backend when it's running.

## API Endpoints (Next.js)

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| GET    | /api/jobs          | List / filter jobs             |
| POST   | /api/jobs          | Create a new job               |
| PUT    | /api/jobs/:id      | Update an existing job         |
| DELETE | /api/jobs/:id      | Delete a job                   |
| GET    | /api/jobs/scrape   | Trigger scrape via Python backend |

## Environment Variables

Create a `.env.local` file in the root if you want to customize:

```env
PYTHON_BACKEND_URL=http://127.0.0.1:5000
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Lucide React
- **Backend (API)**: Next.js API Routes
- **Database**: SQLite via `@libsql/client`
- **Scraper**: Python + Selenium + BeautifulSoup (in `backend/`)

## Deploying to Vercel

This is a pure **Next.js** app — deploy it as a single web service, not two services.

### Step 1 — Create a free Turso database

```bash
npm install -g @tursodatabase/cli
turso auth login
turso db create workly
turso db show workly        # copy the URL
turso db tokens create workly  # copy the token
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import **AliAmin3x/Workly**
2. Set the **Root Directory** to `./` (the default)
3. Select **Next.js** as the framework (it should auto-detect)
4. Under **Environment Variables**, add:
   - `TURSO_DATABASE_URL` → your Turso DB URL (`libsql://workly-...turso.io`)
   - `TURSO_AUTH_TOKEN` → your Turso auth token
5. Click **Deploy**

> **Important:** On the Vercel import screen, if you see two services (backend + frontend), ignore the `vercel.json` suggestion — just scroll down, set Root Directory to `./`, and deploy as a single Next.js project. The `.vercelignore` file will hide the Python backend folder.

### Local development

Create `.env.local` in the project root:

```env
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-token-here
```

Then:

```bash
npm install
npm run dev
```
