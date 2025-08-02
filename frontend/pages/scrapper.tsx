import { useState } from 'react'

export default function Scrapper() {
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)

  const runScrape = async () => {
    setRunning(true)
    setProgress(0)
    const res = await fetch('http://localhost:8000/scrape', { method: 'POST' })
    if (!res.ok) {
      setRunning(false)
      return
    }
    // fake progress for demo
    let pct = 0
    const interval = setInterval(() => {
      pct += 10
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(interval)
        setRunning(false)
      }
    }, 500)
  }

  return (
    <div className="space-y-4 w-64">
      <button className="px-4 py-2 bg-blue-500 text-white" onClick={runScrape} disabled={running}>
        Run Scraper
      </button>
      {running && (
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {!running && progress === 100 && <p>Scrape complete!</p>}
    </div>
  )
}
