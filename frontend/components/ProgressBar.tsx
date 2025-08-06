interface ProgressBarProps {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full h-3 bg-white/10 rounded-md overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-amber-300 rounded-md shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
