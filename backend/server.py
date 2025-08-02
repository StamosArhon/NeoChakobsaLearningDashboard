from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import JSONResponse
from pathlib import Path
import sqlite3
import subprocess

app = FastAPI()

DB_PATH = Path(__file__).resolve().parent / "chakobsa.db"

@app.post("/scrape")
async def scrape(background_tasks: BackgroundTasks):
    def run_scraper():
        subprocess.run(["python", "backend/chakobsa_scraper.py"], check=True)
    background_tasks.add_task(run_scraper)
    return {"status": "started"}

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

