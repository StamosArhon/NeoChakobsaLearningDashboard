import WordCard from './WordCard'

interface Entry {
  lemma: string
  orth: string | null
}

export default function LetterSection({
  letter,
  entries,
}: {
  letter: string
  entries: Entry[]
}) {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold mb-6 border-b-2 pb-2 border-orange-500/30 bg-gradient-to-r from-orange-500 to-amber-300 bg-clip-text text-transparent">
        {letter}
      </h3>
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {entries.map((e) => (
          <WordCard key={e.lemma} lemma={e.lemma} orth={e.orth} />
        ))}
      </div>
    </section>
  )
}
