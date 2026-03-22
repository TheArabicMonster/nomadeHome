"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "DASHBOARD", href: "/dashboard", enabled: true },
  { label: "TERMINAL", href: "/dashboard/terminal", enabled: true },
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

      {/* vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* header */}
      <header className="flex h-10 flex-shrink-0 items-center justify-between border-b border-orange-500/20 bg-black px-4">
        <div className="text-sm font-black tracking-[0.3em] text-orange-500">
          N.E.R.V.
        </div>
        <div className="text-[9px] tracking-[0.4em] text-orange-500/40">
          CENTRAL DOGMA
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] tracking-widest text-orange-400">
              ONLINE
            </span>
          </div>
          <div className="text-sm tabular-nums text-orange-500">{time}</div>
        </div>
      </header>

      {/* body */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <aside className="flex w-[200px] flex-shrink-0 flex-col border-r border-orange-500/20 bg-[#050300]">
          {/* sidebar header */}
          <div className="px-4 pt-5 pb-4">
            <div className="text-[9px] tracking-[0.4em] text-orange-500/40">
              OPERATOR
            </div>
            <div className="text-lg font-black tracking-[0.3em] text-orange-500">
              TERMINAL
            </div>
            <div className="mt-3 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />
          </div>

          {/* nav links */}
          <nav className="flex flex-1 flex-col gap-1 px-4">
            {navLinks.map(({ label, href, enabled }) => {
              const isActive = enabled && pathname === href

              return (
                <button
                  key={label}
                  onClick={() => enabled && router.push(href)}
                  disabled={!enabled}
                  className={cn(
                    "text-left text-[10px] tracking-[0.3em] font-bold py-2 transition-colors",
                    isActive
                      ? "border-l-2 border-orange-500 pl-3 text-orange-500"
                      : enabled
                        ? "pl-3 text-orange-500/30 hover:text-orange-500/60"
                        : "pl-3 text-orange-500/15 cursor-not-allowed",
                  )}
                >
                  {label}
                </button>
              )
            })}
          </nav>

          {/* disconnect */}
          <div className="px-4 pb-4">
            <div className="mb-3 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />
            <button
              onClick={handleDisconnect}
              className="text-[10px] tracking-[0.3em] text-red-400/50 transition-colors hover:text-red-400"
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
