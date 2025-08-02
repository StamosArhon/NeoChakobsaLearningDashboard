#!/usr/bin/env python3
"""
chakobsa_scraper.py   •   2025-08-04
────────────────────────────────────
Scrapes every lemma under “Chakobsa lemmas” on
wiki.languageinvention.com → chakobsa.db

Saves:
  • lemma  (page title)
  • pos    (part-of-speech)
  • gloss  (all senses, “; ”-joined)
  • ipa    (IPA pronunciation)
  • orth   (HTML of <span>…Chakobsa…</span> for the glyph, hyphens replaced with commas)
  • url    (…/index.php?title=…)

Install:
    python -m pip install mwclient mwparserfromhell tqdm
"""

from __future__ import annotations

import re
import sys
import sqlite3
import warnings
from pathlib import Path
from urllib.parse import quote_plus

import mwclient
import mwparserfromhell
from tqdm import tqdm
from typing import Generator, Dict

warnings.filterwarnings("ignore", category=DeprecationWarning)

DB = Path(__file__).resolve().with_name("chakobsa.db")
ROOT_CAT = "Chakobsa lemmas"
site = mwclient.Site("wiki.languageinvention.com", scheme="https", path="/")

def all_lemma_pages(root: str = ROOT_CAT):
    queue: list[mwclient.listing.Category] = [site.categories[root]]
    seen: set[str] = set()
    while queue:
        cat = queue.pop(0)
        for p in cat:
            if p.namespace == 14 and p.name not in seen:
                seen.add(p.name)
                queue.append(site.categories[p.name])
            elif p.namespace == 0:
                yield p.name

LEMMATEXT_RX = re.compile(
    r"\{\{lexeme\|[Cc]hakobsa\}\}(.*?)(?=\{\{lexeme\||\Z)",
    re.S,
)
HEADER_RX    = re.compile(r"={3,}\s*([A-Za-z ]+?)\s*={3,}")
HEADTMP_RX   = re.compile(r"\{\{\s*head\|[^|}]+\|([a-zA-Z ]+)")
GLOSS_RX     = re.compile(r"#\s*([^#\n]+)")
IPA_RX       = re.compile(r"/([^/]+)/")

# Match the first Chakobsa glyph span anywhere in HTML
CHAKOBSA_SPAN_RX = re.compile(
    r'(<span[^>]+font-family\s*:\s*Chakobsa[^>]*>.*?</span>)',
    re.I | re.S
)

def parse_wikitext(text: str):
    m = LEMMATEXT_RX.search(text)
    chunk = m.group(1) if m else next(
        (str(s) for s in mwparserfromhell.parse(text)
                 .get_sections(matches=re.compile("Chakobsa", re.I), levels=[2])),
        ""
    )
    if not chunk:
        return None

    pm = HEADER_RX.search(chunk) or HEADTMP_RX.search(chunk)
    pos = pm.group(1).title() if pm else None

    gloss = "; ".join(g.group(1).strip()
                     for ln in chunk.splitlines()
                     if (g := GLOSS_RX.match(ln))) or None

    ipa = (IPA_RX.search(chunk) or [None, None])[1]

    return {"pos": pos, "gloss": gloss, "ipa": ipa}


def stream_scrape() -> Generator[Dict[str, int], None, None]:
    """Scrape the wiki and yield progress dictionaries."""
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS lexicon(
            lemma TEXT PRIMARY KEY,
            pos   TEXT,
            gloss TEXT,
            ipa   TEXT,
            orth  TEXT,
            url   TEXT
        )
        """
    )

    pages = list(all_lemma_pages())
    total = len(pages)
    inserted = 0

    yield {"status": "start", "total": total, "inserted": 0}

    debug_saved = 0

    for idx, title in enumerate(pages, 1):
        wikitext = site.pages[title].text()
        data = parse_wikitext(wikitext)
        if not data or not data["pos"]:
            yield {
                "status": "progress",
                "current": idx,
                "total": total,
                "inserted": inserted,
            }
            continue

        # 1. fetch rendered HTML
        resp = site.api("parse", page=title, prop="text")
        html_body = resp["parse"]["text"]["*"]

        # DEBUG: Save the HTML for inspection for the first 2 entries
        if debug_saved < 2:
            with open(f"DEBUG_{title}.html", "w", encoding="utf-8") as f:
                f.write(html_body)
            print(f"[DEBUG] Saved rendered HTML for {title} as DEBUG_{title}.html")
            debug_saved += 1

        # 2. extract first Chakobsa font span ANYWHERE in the page
        orth_html = None
        m2 = CHAKOBSA_SPAN_RX.search(html_body)
        if m2:
            # Replace hyphens with commas for Chakobsa font correctness
            orth_html = m2.group(1).replace("-", ",")

        url = f"https://wiki.languageinvention.com/index.php?title={quote_plus(title)}"
        cur.execute(
            "INSERT OR REPLACE INTO lexicon VALUES (?,?,?,?,?,?)",
            (title, data["pos"], data["gloss"], data["ipa"], orth_html, url),
        )
        inserted += 1

        yield {
            "status": "progress",
            "current": idx,
            "total": total,
            "inserted": inserted,
        }

    con.commit()
    con.close()
    yield {"status": "done", "total": total, "inserted": inserted}


def build_db():
    for _ in stream_scrape():
        pass
    
if __name__ == "__main__":
    build_db()
