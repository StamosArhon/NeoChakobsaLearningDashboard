import useSWR from 'swr'
import { useState } from 'react'
import SearchInput from '../components/SearchInput'
import LetterSection from '../components/LetterSection'

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('failed to load')
    return r.json()
  })

type Entry = {
  lemma: string
  orth: string | null
  ipa: string | null
  gloss: string | null
  url: string
}

export default function Dictionary() {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  const { data, error } = useSWR<{ entries: Entry[] }>(
    `${api}/dictionary`,
    fetcher
  )
  const [query, setQuery] = useState('')

  if (error) return <p>Failed to load</p>
  if (!data?.entries) return <p>Loading...</p>

  const filtered = data.entries.filter(
    (e) =>
      e.lemma.toLowerCase().includes(query.toLowerCase()) ||
      (e.orth || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.gloss || '').toLowerCase().includes(query.toLowerCase())
  )

  const grouped: Record<string, Entry[]> = {}
  for (const e of filtered) {
    const letter = e.lemma[0].toUpperCase()
    grouped[letter] = grouped[letter] || []
    grouped[letter].push(e)
  }

  return (
    <div>
      <div className="mb-10">
        <SearchInput
          placeholder="Search Neo-Chakobsa words..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {Object.keys(grouped)
        .sort()
        .map((letter) => (
          <LetterSection key={letter} letter={letter} entries={grouped[letter]} />
        ))}
    </div>
  )
}
