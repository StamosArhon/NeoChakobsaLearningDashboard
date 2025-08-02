import Link from 'next/link'
import { useState } from 'react'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex">
      <button
        className="p-2 m-2 bg-gray-200" onClick={() => setOpen(!open)}
        aria-label="toggle menu"
      >☰</button>
      {open && (
        <nav className="bg-gray-100 p-4 w-40 space-y-2">
          <Link href="/">Dashboard</Link>
          <Link href="/scrapper">Scrapper</Link>
          <Link href="/dictionary">Dictionary</Link>
        </nav>
      )}
    </div>
  )
}
