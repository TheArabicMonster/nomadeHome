"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "DASHBOARD", href: "/dashboard", enabled: true },
  { label: "TERMINAL", href: "/dashboard/terminal", enabled: true },
  { label: "ANKI", href: "/dashboard/anki", enabled: true },
  { label: "MANGA FEED", href: "/dashboard/uploads", enabled: true },
  { label: "NETWORK", href: "#", enabled: false },
  { label: "SETTINGS", href: "#", enabled: false },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
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

  const handleDisconnect = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

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

      {/* body */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <aside className="flex w-56 flex-shrink-0 flex-col border-r-2 border-orange-500/30 bg-[#050300]">
          {/* sidebar header */}
          <div className="px-6 pt-6 pb-5">
            <div className="text-sm tracking-[0.4em] font-bold text-orange-500/50">
              OPERATOR
            </div>
            <div className="text-2xl font-black tracking-[0.3em] text-orange-500">
              TERMINAL
            </div>
            <div className="mt-4 h-1 bg-gradient-to-r from-orange-500/60 to-transparent" />
          </div>

          {/* nav links */}
          <nav className="flex flex-1 flex-col gap-2 px-6">
            {navLinks.map(({ label, href, enabled }) => {
              const isActive = enabled && pathname === href

              return (
                <button
                  key={label}
                  onClick={() => enabled && router.push(href)}
                  disabled={!enabled}
                  className={cn(
                    "text-left text-sm tracking-[0.2em] font-black py-3 transition-colors",
                    isActive
                      ? "border-l-4 border-orange-500 pl-4 text-orange-500"
                      : enabled
                        ? "pl-4 text-orange-500/40 hover:text-orange-500/70"
                        : "pl-4 text-orange-500/15 cursor-not-allowed",
                  )}
                >
                  {label}
                </button>
              )
            })}
          </nav>

          {/* disconnect */}
          <div className="px-6 pb-5">
            <div className="mb-4 h-1 bg-gradient-to-r from-orange-500/60 to-transparent" />
            <button
              onClick={handleDisconnect}
              className="text-sm tracking-[0.2em] font-bold text-red-400/60 transition-colors hover:text-red-400"
            >
              DISCONNECT
            </button>
          </div>
        </aside>

        {/* main content */}
        <main className="flex-1 overflow-y-auto bg-black">{children}</main>
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
