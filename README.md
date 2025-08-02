# NeoChakobsaLearningDashboard

This project contains a small backend written in Python and a front end built with Next.js.

## Structure

- `backend/` – Python utilities and the API server.
- `frontend/` – Next.js PWA user interface.

The backend exposes an endpoint for scraping the Chakobsa wiki and a second one for fetching the saved dictionary entries. The frontend consumes these endpoints and renders the dashboard.

### Installation & Development

From the repository root the helper script `manage.py` installs all
dependencies and starts both the backend and frontend:

```bash
# install python packages and frontend dependencies
python manage.py install

# start uvicorn and the Next.js dev server together
python manage.py dev
```

The UI expects the API base URL in `NEXT_PUBLIC_API_BASE_URL` (defaults to
`http://localhost:8000`).  Place `chakobsa.ttf` in
`frontend/public/fonts/` so that the glyphs render correctly.
