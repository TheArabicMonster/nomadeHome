"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toTimeString().slice(0, 8))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black font-mono">
      {/* scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* vignette
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      /> */}

      {/* header */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b-2 border-orange-500/40 bg-black px-6">
        <div className="text-xl font-black tracking-[0.3em] text-orange-500">
          N.E.R.V.
        </div>
        <div className="text-sm tracking-[0.4em] font-bold text-orange-500/60">
          CENTRAL DOGMA
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-sm font-bold tracking-widest text-orange-400">
              ONLINE
            </span>
          </div>
          <div className="text-base font-bold tabular-nums text-orange-500">{time}</div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* main content */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-black">{children}</main>
      </div>

      {/* footer */}
      <footer className="flex h-7 flex-shrink-0 items-center justify-between border-t border-orange-500/20 bg-black px-4">
        <div className="text-[9px] tracking-widest text-orange-500/20">
          GEHIRN INFORMATION SYSTEMS v2.0 — UNAUTHORIZED ACCESS PROHIBITED
        </div>
        <div className="flex gap-4">
          <span className="text-[9px] text-orange-500/20">TX: 0.0 KB/s</span>
          <span className="text-[9px] text-orange-500/20">RX: 0.0 KB/s</span>
        </div>
      </footer>
    </div>
  )
}
