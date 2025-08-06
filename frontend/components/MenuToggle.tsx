"use client"

interface MenuToggleProps {
  onClick: () => void
}

export default function MenuToggle({ onClick }: MenuToggleProps) {
  return (
    <button
      aria-label="toggle menu"
      onClick={onClick}
      className="fixed top-5 left-5 z-50 bg-orange-500/20 border border-orange-500/30 rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer transition hover:bg-orange-500/30 hover:scale-105 backdrop-blur-md"
    >
      <div className="space-y-1.5">
        <span className="block w-6 h-0.5 bg-orange-500 rounded"></span>
        <span className="block w-6 h-0.5 bg-orange-500 rounded"></span>
        <span className="block w-6 h-0.5 bg-orange-500 rounded"></span>
      </div>
    </button>
  )
}
