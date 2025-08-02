#!/usr/bin/env python3
"""
generate_preview.py

Reads chakobsa.db, pulls ALL entries with orth<>NULL,
and writes preview.html that uses your Chakobsa TTF to render them.
"""

import sqlite3
from urllib.parse import quote_plus

# 1) Read all entries with non-null orth
con = sqlite3.connect("chakobsa.db")
cur = con.cursor()
cur.execute("""
    SELECT lemma, orth
      FROM lexicon
     WHERE orth IS NOT NULL
""")
samples = cur.fetchall()
con.close()

# 2) Build the HTML
html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Chakobsa Glyph Preview</title>
  <style>
    @font-face {
      font-family: "Chakobsa";
      src: url("2021-chakobsa.ttf") format("truetype");
    }
    body { font-family: sans-serif; padding: 2rem; }
    .entry { margin-bottom: 2.5rem; }
    .glyph { font-family: "Chakobsa"; font-size: 3rem; }
    .label { margin-top: 0.5rem; color: #555; font-size: 1.2rem; }
  </style>
</head>
<body>
  <h1>Chakobsa Orthographic Preview</h1>
"""

for lemma, orth in samples:
    html += f"""
  <div class="entry">
    <div class="glyph">{orth}</div>
    <div class="label">{lemma}</div>
  </div>
"""

html += """
</body>
</html>
"""

# 3) Write it out
with open("preview.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Generated preview.html – open this in your browser to check the glyphs.")
