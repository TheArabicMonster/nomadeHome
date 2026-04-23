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
      <header className="relative flex h-14 flex-shrink-0 items-center justify-between border-b-2 border-orange-500/40 bg-black px-6 ">
        <div className="flex-1" />
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div
            className="text-4xl font-bold leading-none tracking-[-0.05em] text-red-600"
            style={{
              textShadow: `
                0 0 4px  rgba(255, 30, 0, 1),
                0 0 12px rgba(255, 20, 0, 0.9),
                0 0 25px rgba(220, 0,  0, 0.7),
                0 0 50px rgba(180, 0,  0, 0.4),
                0 0 90px rgba(140, 0,  0, 0.2)
              `,
            }}
          >
            NERV
          </div>
          <div className="flex flex-row gap-1 text-lg font-bold tracking-[0.15em] text-black/60 min-w-0">
            <div
              style={{
                marginLeft: '10px',
                height: '34px',
                background: 'red',
                clipPath: 'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '18px',
                paddingRight: '3px',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  textShadow: `
                    0 0 6px  rgba(0, 0, 0, 0.8),
                    0 0 14px rgba(0, 0, 0, 0.6),
                    0 0 28px rgba(0, 0, 0, 0.4)
                  `,
                }}
              >
                God&apos;S In His Heaven. All&apos;S Right With The World.
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-orange-400 animate-pulse" />
            <span
              className="text-sm font-bold tracking-widest text-orange-400"
              style={{
                textShadow: `
                  0 0 4px  rgba(255, 140, 0, 1),
                  0 0 10px rgba(255, 100, 0, 0.9),
                  0 0 20px rgba(255, 80,  0, 0.7),
                  0 0 40px rgba(255, 60,  0, 0.4),
                  0 0 80px rgba(255, 40,  0, 0.2)
                `,
              }}
            >
              ONLINE
            </span>
          </div>
          <div
            className="text-base font-bold tabular-nums text-orange-500"
            style={{
              textShadow: `
                0 0 3px  rgba(255, 160, 0, 1),
                0 0 8px  rgba(255, 110, 0, 0.95),
                0 0 18px rgba(255, 80,  0, 0.8),
                0 0 35px rgba(255, 50,  0, 0.5),
                0 0 70px rgba(200, 30,  0, 0.25)
              `,
            }}
          >
            {time}
          </div>
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
