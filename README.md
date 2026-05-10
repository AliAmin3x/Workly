# Workly

A full-stack job tracking and discovery app built with **Next.js** (frontend + API routes) and **SQLite** via `@libsql/client`.

The original project had a separate React (CRA) frontend and Flask/Python backend. This repo combines both into a single Next.js monorepo.

## Project Structure

```
workly/
├── src/
│   ├── app/
│   │   ├── api/jobs/
│   │   │   ├── route.js          # GET + POST
│   │   │   └── [id]/route.js     # PUT + DELETE
│   │   ├── Dashboard.jsx
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
│       └── db.js                 # SQLite client
├── backend/                      # Original Flask/Python backend (reference + scraper)
└── package.json
```

## Getting Started

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

## API Endpoints

| Method | Endpoint        | Description        |
|--------|-----------------|--------------------|
| GET    | /api/jobs       | List/filter jobs   |
| POST   | /api/jobs       | Create a job       |
| PUT    | /api/jobs/:id   | Update a job       |
| DELETE | /api/jobs/:id   | Delete a job       |

## Original Python Backend

The `backend/` folder has the original Flask app + Selenium scraper. To run standalone:

```bash
cd backend
pip install -r requirements.txt
python app.py
```
