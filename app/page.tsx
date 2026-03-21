"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function NervPanel() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [dataLines, setDataLines] = useState<string[]>([])
  const [alertBlink, setAlertBlink] = useState(false)

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

  useEffect(() => {
    const gen = () => {
      const addr = Math.floor(Math.random() * 0xffff)
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")
      const bytes = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase(),
      ).join(" ")
      return `[${addr}] ${bytes}`
    }
    setDataLines(Array.from({ length: 14 }, gen))
    const id = setInterval(() => {
      setDataLines((prev) => [...prev.slice(1), gen()])
    }, 600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setAlertBlink((b) => !b), 1200)
    return () => clearInterval(id)
  }, [])

  const statuses = [
    { label: "MAGI-01", value: "ONLINE", ok: true },
    { label: "MAGI-02", value: "ONLINE", ok: true },
    { label: "MAGI-03", value: "ONLINE", ok: true },
    { label: "CORE ACCESS", value: "LOCKED", ok: false },
    { label: "NETWORK", value: "CONNECTED", ok: true },
    { label: "THREAT LVL", value: "NONE", ok: true },
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
        <div className="text-[10px] tracking-[0.4em] text-orange-500/40">
          SPECIAL ORGANIZATION
        </div>
        <div className="text-5xl font-black tracking-[0.25em] text-orange-500">
          N.E.R.V.
        </div>
        <div className="mt-1 text-[10px] tracking-[0.3em] text-orange-500/60">
          CENTRAL DOGMA — AUTHORIZED TERMINAL
        </div>
      </div>

      {/* clock */}
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.4em] text-orange-500/40 mb-1">
          SYSTEM TIME
        </div>
        <div className="text-7xl font-black tabular-nums text-orange-500 leading-none">
          {time}
        </div>
        <div className="mt-2 text-xs tracking-widest text-orange-500/50">
          {date}
        </div>
      </div>

      {/* status grid */}
      <div className="mb-6 grid grid-cols-3 gap-1.5">
        {statuses.map(({ label, value, ok }) => (
          <div
            key={label}
            className="border border-orange-500/15 bg-orange-500/3 p-2"
          >
            <div className="text-[9px] tracking-widest text-orange-500/40 mb-0.5">
              {label}
            </div>
            <div
              className={`flex items-center gap-1 text-[10px] font-bold tracking-widest ${ok ? "text-orange-400" : "text-red-400"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                  ok
                    ? "bg-orange-400 animate-pulse"
                    : alertBlink
                      ? "bg-red-400"
                      : "bg-red-900"
                }`}
              />
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* data stream */}
      <div className="flex-1 overflow-hidden">
        <div className="text-[9px] tracking-[0.4em] text-orange-500/30 mb-2">
          MEMORY DUMP — LIVE
        </div>
        <div className="space-y-px">
          {dataLines.map((line, i) => (
            <div
              key={i}
              className="text-[10px] font-mono transition-all duration-300"
              style={{
                color: `rgba(251, 146, 60, ${0.08 + (i / dataLines.length) * 0.7})`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="mt-4 border-t border-orange-500/20 pt-3">
        <div className="text-[9px] tracking-widest text-orange-500/20">
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
          <div className="text-[9px] tracking-[0.5em] text-orange-500/40 mb-2">
            TERMINAL ACCESS
          </div>
          <div className="text-2xl font-black tracking-[0.3em] text-orange-500">
            AUTHENTICATE
          </div>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[9px] tracking-[0.4em] text-orange-500/50">
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
            <div className="border border-red-500/30 py-2 text-center text-[10px] tracking-widest text-red-400">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full border border-orange-500/40 py-3 text-[11px] font-black tracking-[0.4em] text-orange-500 transition-all hover:border-orange-500 hover:bg-orange-500/8 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {loading ? "CONNECTING..." : "CONNECT"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <div className="text-[9px] tracking-widest text-orange-500/15">
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
