from fastapi import FastAPI
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sqlite3
import asyncio
import threading
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = Path(__file__).resolve().parent / "chakobsa.db"

# Use a relative import so the module resolves whether the backend is executed
# directly (`python backend/server.py`) or via an import string
# (`uvicorn backend.server:app`).
from .chakobsa_scraper import stream_scrape


@app.get("/scrape")
async def scrape():
    async def event_stream():
        queue: asyncio.Queue = asyncio.Queue()

        def run():
            for update in stream_scrape():
                queue.put_nowait(update)
            queue.put_nowait(None)

        threading.Thread(target=run, daemon=True).start()

        while True:
            item = await queue.get()
            if item is None:
                break
            yield f"data: {json.dumps(item)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/dictionary")
async def dictionary():
    if not DB_PATH.exists():
        return JSONResponse(status_code=404, content={"error": "database missing"})
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT lemma, pos, gloss, ipa, orth, url FROM lexicon")
    entries = [
        {"lemma": l, "pos": p, "gloss": g, "ipa": i, "orth": o, "url": u}
        for l, p, g, i, o, u in cur.fetchall()
    ]
    con.close()
    return {"entries": entries}


if __name__ == "__main__":
    import uvicorn

    # Run directly without requiring an import string so `python backend/server.py`
    # works on systems where the project root is not on the module search path.
    uvicorn.run(app, host="0.0.0.0", port=8000)

