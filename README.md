# Workly — Job Board App (Next.js Full-Stack)

A full-stack job board built with **Next.js 14 (App Router)**, combining the original Flask backend and React CRA frontend into one unified project.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite via `sql.js`
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Project Structure
```
workly/
├── app/
│   ├── api/jobs/
│   │   ├── route.js          # GET (list+filter), POST (create)
│   │   ├── [id]/route.js     # PUT (update), DELETE
│   │   └── scrape/route.js   # GET (scrape actuarylist.com)
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Dashboard.jsx
│   │   ├── JobCard.jsx
│   │   ├── JobFormModal.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── FilterPanel.jsx
│   │   └── Modal.jsx
│   ├── globals.css
│   ├── layout.js
│   └── page.js
└── lib/
    ├── db.js        # SQLite utility
    └── scraper.js   # Fetch-based scraper
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## API Endpoints

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | /api/jobs        | List jobs with filters|
| POST   | /api/jobs        | Create job            |
| PUT    | /api/jobs/:id    | Update job            |
| DELETE | /api/jobs/:id    | Delete job            |
| GET    | /api/jobs/scrape | Scrape actuarylist    |
