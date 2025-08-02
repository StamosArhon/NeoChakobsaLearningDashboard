import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'

export default function Scrapper() {
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState('Fetching vocabulary data...')
  const [items, setItems] = useState('0 / 0 items processed')

  const runScrape = () => {
    setRunning(true)
    setProgress(0)
    setStatus('Connecting to data source...')
    setItems('0 / 0 items processed')
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    const es = new EventSource(`${api}/scrape`)
    es.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      if (data.status === 'start') {
        setItems(`0 / ${data.total} items processed`)
      } else if (data.status === 'progress') {
        const pct = (data.current / data.total) * 100
        setProgress(pct)
        setStatus('Fetching vocabulary data...')
        setItems(`${data.inserted} / ${data.total} items processed`)
      } else if (data.status === 'done') {
        setProgress(100)
        setStatus('✅ Scrapping completed successfully!')
        setItems(`${data.inserted} / ${data.total} items processed`)
        es.close()
        setTimeout(() => {
          setRunning(false)
          setProgress(0)
          setStatus('Fetching vocabulary data...')
          setItems('0 / 0 items processed')
        }, 3000)
      }
    }
    es.onerror = () => {
      setStatus('❌ Failed to reach backend')
      setRunning(false)
      es.close()
    }
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-3xl mb-8 bg-gradient-to-r from-orange-500 to-amber-300 bg-clip-text text-transparent">Data Scrapper</h2>
      <p className="text-slate-400 mb-10 text-lg">
        Fetch the latest Neo-Chakobsa language data from external sources
      </p>
      {!running && (
        <button
          className="px-10 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-amber-300 shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(249,115,22,0.4)]"
          onClick={runScrape}
        >
          Start Scrapping
        </button>
      )}
      {running && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-8">
          <h3 className="mb-4">Scrapping in Progress...</h3>
          <ProgressBar progress={progress} />
          <div className="flex justify-between text-sm text-slate-400 mt-4">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 text-slate-400 text-sm">{items}</div>
        </div>
      )}
    </div>
  )
}
