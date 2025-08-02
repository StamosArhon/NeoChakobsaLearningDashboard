import { InputHTMLAttributes } from 'react'

export default function SearchInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="w-full max-w-xl px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 text-lg backdrop-blur-md transition focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
    />
  )
}
