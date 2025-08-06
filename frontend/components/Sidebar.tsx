"use client"

import Link from 'next/link'
import { useRouter } from 'next/router'

interface SidebarProps {
  open: boolean
  close: () => void
}

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/scrapper', label: 'Scrapper' },
  { href: '/dictionary', label: 'Dictionary' },
]

export default function Sidebar({ open, close }: SidebarProps) {
  const router = useRouter()
  return (
    <aside
      className={`fixed top-0 -left-[280px] w-[280px] h-full bg-[rgba(15,15,35,0.95)] backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 pt-[90px] ${
        open ? 'left-0' : ''
      }`}
    >
      <nav className="p-5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={close}
            className={`flex items-center px-5 py-3 mb-2 rounded-xl font-medium border border-transparent transition hover:bg-orange-500/10 hover:border-orange-500/30 hover:translate-x-1 ${
              router.pathname === item.href
                ? 'bg-gradient-to-r from-orange-500/20 to-amber-300/10 border-orange-500/50'
                : ''
            }`}
          >
            <div className="w-5 h-5 bg-orange-500 rounded mr-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
