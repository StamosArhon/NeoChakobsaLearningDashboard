import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Entry = {
  lemma: string
  orth: string | null
}

export default function Dictionary() {
  const { data } = useSWR<{entries: Entry[]}>('http://localhost:8000/dictionary', fetcher)

  if (!data) return <p>Loading...</p>

  const grouped: Record<string, Entry[]> = {}
  for (const e of data.entries) {
    const letter = e.lemma[0].toUpperCase()
    grouped[letter] = grouped[letter] || []
    grouped[letter].push(e)
  }

  return (
    <div>
      {Object.keys(grouped).sort().map(letter => (
        <section key={letter} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{letter}</h2>
          <div className="grid grid-cols-5 gap-2">
            {grouped[letter].map(e => (
              <div key={e.lemma} className="p-2 border">
                <span style={{fontFamily: 'Chakobsa'}} dangerouslySetInnerHTML={{__html: e.orth || ''}} />
                <div>{e.lemma}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
