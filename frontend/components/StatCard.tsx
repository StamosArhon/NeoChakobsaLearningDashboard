interface StatCardProps {
  number: string
  label: string
}

export default function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl hover:border-orange-500/30">
      <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-300 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-slate-400 text-lg">{label}</div>
    </div>
  )
}
