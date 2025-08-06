import { FileText } from 'lucide-react'

interface WordCardProps {
  lemma: string
  orth: string | null
  ipa: string | null
  gloss: string | null
  url: string
}

export default function WordCard({ lemma, orth, ipa, gloss, url }: WordCardProps) {
  const meanings = gloss ? gloss.split(/;\s*/).filter(Boolean) : []

  return (
    <div className="relative aspect-square bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center backdrop-blur-md">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-orange-500 hover:bg-orange-500/20"
      >
        <FileText className="w-4 h-4" />
      </a>
      {orth ? (
        <div className="text-5xl mb-2" dangerouslySetInnerHTML={{ __html: orth }} />
      ) : (
        <div className="font-chakobsa text-5xl mb-2">{lemma}</div>
      )}
      <div className="text-sm text-slate-300 mb-2">
        <span>{lemma}</span>
        {ipa && <span className="ml-2 text-slate-500">/{ipa}/</span>}
      </div>
      <div className="w-full border-t border-white/10 my-2" />
      {meanings.length > 0 && (
        <div className="text-sm text-left w-full overflow-y-auto">
          <div className="font-semibold mb-1">Meaning</div>
          <ol className="list-decimal list-inside space-y-1">
            {meanings.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
