"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MemoryDump } from "@/components/memory-dump"
import { BioSignal } from "@/components/bio-signal"

function NervPanel() {
  const [time, setTime] = useState("")
  const [ms, setMs] = useState(0)
  const [date, setDate] = useState("")
  const [alertBlink, setAlertBlink] = useState(false)

  //pour les secondes minutes heures
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toTimeString().slice(0, 8))
      setDate(
        now
          .toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toUpperCase(),
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  //pour les millisecondes 
  useEffect(() => {
    const id = setInterval(() => {
      setMs(prev => (prev + 16) % 1000)
    }, 16)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setAlertBlink((b) => !b), 1200)
    return () => clearInterval(id)
  }, [])

  const statuses = [
    { label: "MAGI-01", value: "ONLINE", kanji: "稼働", ok: true },
    { label: "MAGI-02", value: "ONLINE", kanji: "稼働", ok: true },
    { label: "MAGI-03", value: "ONLINE", kanji: "稼働", ok: true },
    { label: "CORE ACCESS", value: "LOCKED", kanji: "施錠", ok: false },
    { label: "NETWORK", value: "CONNECTED", kanji: "接続", ok: true },
    { label: "THREAT LVL", value: "NONE", kanji: "無", ok: true },
  ]

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black p-8 font-mono select-none">
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* header */}
      <div className="mb-6 border-b border-orange-500/20 pb-6">
        <div className="text-xs pb-2 font-semibold tracking-[0.4em] text-orange-500/60">
          SPECIAL ORGANIZATION
        </div>
        <div className="flex items-center gap-1">
          <div className="text-6xl font-bold tracking-[-0.05em] text-red-600 leading-none"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            NERV
          </div>
          <div className="flex flex-col gap-1 text-lg font-bold tracking-[0.15em] text-black/60"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <div style={{
                marginLeft: '10px',
                width: '310px',
                height: '28px',
                background: 'red',
                clipPath: 'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px'
              }}>
              God&apos;S In His Heaven.
            </div>
            <div style={{
                width: '320px',
                height: '28px',
                background: 'red',
                clipPath: 'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px'
              }}>
              All&apos;S Right With The World.
            </div>
          </div>
        </div>
      </div>

      {/* clock */}
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-[0.4em] text-orange-500/60 mb-1">
          SYSTEM TIME
        </div>
        <div className="flex items-baseline leading-none" style={{ fontFamily: "Digital7" }}>
          <span className="text-9xl tabular-nums text-orange-500">{time}.</span>
          <span className="text-6xl tabular-nums text-orange-500">{ms.toString().padStart(3, "0")}</span>
        </div>
        <div className="mt-2 text-xs font-semibold tracking-widest text-orange-500/70">
          {date}
        </div>
      </div>

      {/* status grid */}
      <div className="mb-6 grid grid-cols-3 gap-1.5">
        {statuses.map(({ label, value, kanji, ok }) => {
          const isNone = value.toLowerCase() === 'none';
          const isLocked = value.toLowerCase() === 'locked';
          const statusColor = isNone ? '#6b7280' : ok ? '#64C832' : '#ee3a3ad5';
          const kanjiColor = isNone ? '#6b728040' : ok ? '#64C83259' : isLocked ? '#ff1a1a99' : '#f8717140';
          const glowColor = isNone ? 'rgba(107,114,128,0.4)' : ok ? 'rgba(100,200,50,0.5)' : isLocked ? 'rgba(255, 26, 26, 0.56)' : 'rgba(248,113,113,0.5)';
          return (
          <div
            key={label}
            className="relative border border-orange-500/15 bg-orange-500/3 p-2 pr-8 overflow-hidden"
          >
            <div className="text-[10px] font-semibold tracking-widest text-orange-500/60 mb-0.5">
              {label}
            </div>
            <div
              className="flex items-center gap-1 text-xs font-bold tracking-widest"
              style={{ color: statusColor }}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${ok && !isNone ? "animate-pulse" : alertBlink && !isNone ? "bg-red-400" : ""}`}
                style={{ background: statusColor }}
              />
              <span style={{ color: statusColor ?? (alertBlink ? '#f87171' : '#f87171') }}>{value}</span>
            </div>
            {/* Kanji — collé à droite, pleine hauteur */}
            <div
              className="absolute inset-y-0 right-0 flex items-center justify-center px-[3px] font-black text-base"
              style={{ color: kanjiColor }}
            >
              <span
                className="[writing-mode:vertical-rl] [letter-spacing:0.05em]"
                style={{
                  fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'MS Gothic', sans-serif",
                  textShadow: `0 0 8px ${glowColor}`,
                }}
              >
                {kanji}
              </span>
            </div>
          </div>
        );
        })}
      </div>

      <div>
        {/* bio signals */}
        <div className="mb-6 flex flex-col gap-3">
          <BioSignal pilot="shinji" height={60} seed={1} />
          <BioSignal pilot="asuka"  height={60} seed={2} />
          <BioSignal pilot="rei"    height={60} seed={3} />
        </div>
      </div>
      

      {/* footer */}
      <div className="mt-4 border-t border-orange-500/20 pt-3">
        <div className="text-[10px] font-medium tracking-widest text-orange-500/40">
          GEHIRN INFORMATION SYSTEMS v2.0 — UNAUTHORIZED ACCESS PROHIBITED
        </div>
      </div>
    </div>
  )
}

function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push("/dashboard")
      } else {
        setError("ACCESS DENIED — INVALID CREDENTIALS")
      }
    } catch {
      setError("CONNECTION ERROR — RETRY")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#050300] p-10 font-mono">
      <div className="w-full max-w-[280px]">
        {/* header */}
        <div className="mb-10 text-center">
          <div className="text-xs font-semibold tracking-[0.5em] text-orange-500/60 mb-2">
            TERMINAL ACCESS
          </div>
          <div className="text-2xl font-black tracking-[0.3em] text-orange-500">
            AUTHENTICATE
          </div>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.4em] text-orange-500/70">
              ACCESS CODE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-orange-500/25 bg-transparent px-4 py-3 font-mono text-sm tracking-widest text-orange-400 outline-none transition-colors placeholder:text-orange-500/15 focus:border-orange-500/70"
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="border border-red-500/50 py-2 text-center text-xs font-bold tracking-widest text-red-400">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full border border-orange-500/40 py-3 text-sm font-black tracking-[0.4em] text-orange-500 transition-all hover:border-orange-500 hover:bg-orange-500/8 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {loading ? "CONNECTING..." : "CONNECT"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <div className="text-xs font-medium tracking-widest text-orange-500/40">
            GEHIRN INFORMATION SYSTEMS
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <div className="w-[60%]">
        <NervPanel />
      </div>
      <div className="w-[40%] border-l border-orange-500/20">
        <LoginForm />
      </div>
    </div>
  )
}
