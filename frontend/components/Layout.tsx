"use client"

import { useState, ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import MenuToggle from './MenuToggle'

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-slate-200 overflow-x-hidden">
      <Header />
      <MenuToggle onClick={() => setOpen(!open)} />
      <Sidebar open={open} close={() => setOpen(false)} />
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-30 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setOpen(false)}
      />
      <main className={`pt-[70px] transition-all ${open ? 'ml-[280px]' : ''}`}>
        <div className="p-10">{children}</div>
      </main>
    </div>
  )
}
