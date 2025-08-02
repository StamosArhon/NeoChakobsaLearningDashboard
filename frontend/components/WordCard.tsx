interface WordCardProps {
  lemma: string
  orth: string | null
}

export default function WordCard({ lemma, orth }: WordCardProps) {
  const glyph = orth || lemma

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      <div
        className="text-orange-500 font-chakobsa text-lg font-semibold mb-2"
        dangerouslySetInnerHTML={{ __html: glyph }}
      />
      <div className="text-slate-400 text-sm">{lemma}</div>
    </div>
  )
}
