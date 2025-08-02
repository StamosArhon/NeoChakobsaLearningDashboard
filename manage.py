#!/usr/bin/env python3
"""Project management script.

Usage:
  python manage.py install  # install backend and frontend deps
  python manage.py dev      # run backend and frontend concurrently
"""
from __future__ import annotations
import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / 'frontend'
BACKEND = ROOT / 'backend'


def install() -> None:
  subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'fastapi', 'uvicorn', 'mwclient', 'mwparserfromhell', 'tqdm'])
  subprocess.check_call(['npm', 'install'], cwd=FRONTEND)


def dev() -> None:
  backend = subprocess.Popen([sys.executable, 'backend/server.py'], cwd=ROOT)
  frontend = subprocess.Popen(['npm', 'run', 'dev'], cwd=FRONTEND)
  try:
    backend.wait()
    frontend.wait()
  finally:
    for p in (backend, frontend):
      if p.poll() is None:
        p.terminate()
        p.wait()


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('command', choices=['install', 'dev'])
  args = parser.parse_args()
  globals()[args.command]()
