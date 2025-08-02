# NeoChakobsaLearningDashboard

This project contains a small backend written in Python and a front end built with Next.js.

## Structure

- `backend/` – Python utilities and the API server.
- `frontend/` – Next.js PWA user interface.

The backend exposes an endpoint for scraping the Chakobsa wiki and a second one for fetching the saved dictionary entries. The frontend consumes these endpoints and renders the dashboard.

### Running the Backend

Create a virtual environment and install the requirements:

```bash
pip install fastapi uvicorn mwclient mwparserfromhell tqdm
```

Start the server:

```bash
python backend/server.py
```

The server listens on port `8000` by default.

### Running the Frontend

Install the dependencies and start the Next.js development server.  The UI
expects the API base URL in `NEXT_PUBLIC_API_BASE_URL` (defaults to
`http://localhost:8000`):

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env
npm run dev
```

Place `chakobsa.ttf` in `frontend/public/fonts/` so that the glyphs render correctly.
