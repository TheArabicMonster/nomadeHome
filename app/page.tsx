"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useReducer, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MemoryDump } from "@/components/memory-dump"
import { NervHexagon } from "components/nerv-hexagone"
import { BioSignal } from "@/components/bio-signal"
import { useContainerSize } from "@/hooks/use-container-size"

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
      <div className="mb-6 flex-shrink-0 border-b border-orange-500/20 pb-6 -mx-8 px-8">
        <div className="text-xs pb-2 font-semibold tracking-[0.4em] text-orange-500/60">
          SPECIAL ORGANIZATION
        </div>
        <div className="flex items-center gap-1">
          <div className="text-6xl font-bold tracking-[-0.05em] text-red-600 leading-none"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            NERV
          </div>
          <div className="flex flex-col gap-1 text-lg font-bold tracking-[0.15em] text-black/60 flex-1 min-w-0"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <div style={{
                marginLeft: '10px',
                width: '100%',
                maxWidth: '310px',
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
                width: '100%',
                maxWidth: '320px',
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
      <div className="mb-6 flex-shrink-0">
        <div className="text-xs font-semibold tracking-[0.4em] text-orange-500/60 mb-1">
          SYSTEM TIME
        </div>
        <div className="flex items-baseline leading-none" style={{ fontFamily: "Digital7" }}>
          <span className="text-5xl md:text-8xl tabular-nums text-orange-500">{time}.</span>
          <span className="text-4xl md:text-6xl tabular-nums text-orange-500">{ms.toString().padStart(3, "0")}</span>
        </div>
        <div className="mt-2 text-xs font-semibold tracking-widest text-orange-500/70">
          {date}
        </div>
      </div>

      {/* status grid */}
      <div className="mb-6 flex-shrink-0 grid grid-cols-3 gap-1.5">
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

      <div className="outline outline-1 outline-orange-500/20 p-4">
        <div className="text-xs font-semibold tracking-[0.4em] text-orange-500/60 mb-2">
          NEURAL LINK
        </div>
        {/* bio signals */}
        <div className="flex flex-col gap-3">
          <BioSignal pilot="rei"    height={60} seed={3} />
          <BioSignal pilot="shinji" height={60} seed={1} />
          <BioSignal pilot="asuka"  height={60} seed={2} />
        </div>
      </div>
      

      {/* footer */}
      <div className="mt-auto flex-shrink-0 border-t border-orange-500/20 pt-3 -mx-8 px-8">
        <div className="text-[10px] font-medium tracking-widest text-orange-500/40">
          GEHIRN INFORMATION SYSTEMS v2.0 — UNAUTHORIZED ACCESS PROHIBITED
        </div>
      </div>
    </div>
  )
}

interface HexGridHandle {
  handleMouseMove: (clientX: number, clientY: number) => void
  triggerError: () => void
}

const HexGrid = forwardRef<HexGridHandle>(function HexGrid(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useContainerSize(containerRef)

  const trailRef    = useRef<Map<string, number>>(new Map())
  const errorRef    = useRef<Map<string, number>>(new Map())
  const rafRef      = useRef<number | null>(null)
  const lastTsRef   = useRef<number | null>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  const size    = 50
  const colStep = size * 0.76
  const rowStep = size * 0.92

  const { cols, rows, cells } = useMemo(() => {
    const c = width  > 0 ? Math.ceil(width  / colStep) + 2 : 0
    const r = height > 0 ? Math.ceil(height / rowStep) + 2 : 0

    const cells: { key: string; left: number; top: number }[] = []
    for (let col = 0; col < c; col++) {
      const offset = col % 2 === 1 ? rowStep / 2 : 0
      for (let row = 0; row < r; row++) {
        cells.push({
          key: `${col}-${row}`,
          left: col * colStep,
          top: row * rowStep + offset,
        })
      }
    }

    return { cols: c, rows: r, cells }
  }, [width, height, colStep, rowStep])

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return

    const tick = (timestamp: number) => {
      const dt = lastTsRef.current !== null ? timestamp - lastTsRef.current : 16
      lastTsRef.current = timestamp
      const decay = dt / 1500

      const trail = trailRef.current
      const error = errorRef.current
      let anyActive = false

      for (const [key, val] of trail) {
        const next = val - decay
        if (next <= 0.005) trail.delete(key)
        else { trail.set(key, next); anyActive = true }
      }

      for (const [key, val] of error) {
        const next = val - decay * 2.5
        if (next <= 0.005) error.delete(key)
        else { error.set(key, next); anyActive = true }
      }

      forceUpdate()

      if (anyActive) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
        lastTsRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useImperativeHandle(ref, () => ({
    handleMouseMove: (clientX: number, clientY: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left - size / 2
      const y = clientY - rect.top  - size / 2
      const col = Math.round(x / colStep)
      const row = Math.round((y - (col % 2 === 1 ? rowStep / 2 : 0)) / rowStep)
      const key = `${col}-${row}`
      trailRef.current.set(key, 1.0)
      startLoop()
    },
    triggerError: () => {
      if (!containerRef.current) return
      // annule les timeouts précédents
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      errorRef.current.clear()

      const rect = containerRef.current.getBoundingClientRect()
      const centerCol = Math.round((rect.width  / 2) / colStep)
      const centerRow = Math.round((rect.height / 2) / rowStep)

      // calcule la distance max pour normaliser les délais
      const maxDist = Math.sqrt(centerCol ** 2 + centerRow ** 2) || 1

      cells.forEach(({ key }) => {
        const [c, r] = key.split("-").map(Number)
        const dist = Math.sqrt((c - centerCol) ** 2 + (r - centerRow) ** 2)
        const delay = (dist / maxDist) * 600  // propagation sur 600ms
        const t = setTimeout(() => {
          errorRef.current.set(key, 1.0)
          startLoop()
        }, delay)
        timeoutsRef.current.push(t)
      })
    },
  }), [colStep, rowStep, cells, startLoop])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden opacity-[0.12]">
      {cells.map(({ key, left, top }) => (
        <div
          key={key}
          className="absolute"
          style={{ left, top }}
        >
          <NervHexagon
            size={size}
            intensity={Math.max(trailRef.current.get(key) ?? 0, errorRef.current.get(key) ?? 0)}
          />
        </div>
      ))}
    </div>
  )
})

function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const hexGridRef = useRef<HexGridHandle>(null)

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
        hexGridRef.current?.triggerError()
      }
    } catch {
      setError("CONNECTION ERROR — RETRY")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex h-full flex-col bg-[#050300] font-mono overflow-hidden"
      onMouseMove={(e) => hexGridRef.current?.handleMouseMove(e.clientX, e.clientY)}
    >
      <HexGrid ref={hexGridRef} />

      {/* Header NERV — mobile uniquement */}
      <div className="relative z-10 md:hidden flex-shrink-0 bg-black pt-5 pb-0 w-full">
        <div className="px-6 text-center text-xs pb-2 font-semibold tracking-[0.4em] text-orange-500/60">
          SPECIAL ORGANIZATION
        </div>
        <div className="px-6 flex items-center justify-center gap-1">
          <div
            className="text-4xl font-bold tracking-[-0.05em] text-red-600 leading-none"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            NERV
          </div>
          <div
            className="flex flex-col gap-1 text-[9px] font-bold tracking-[0.05em] text-black/60"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <div style={{
              marginLeft: '4px', paddingRight: '8px', height: '16px',
              background: 'red',
              clipPath: 'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%)',
              display: 'flex', alignItems: 'center', paddingLeft: '8px',
            }}>
              God&apos;s In His Heaven.
            </div>
            <div style={{
              paddingRight: '8px', height: '16px',
              background: 'red',
              clipPath: 'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%)',
              display: 'flex', alignItems: 'center', paddingLeft: '8px',
            }}>
              All&apos;s Right With The World.
            </div>
          </div>
        </div>
        {/* Séparateur vert avec bloom */}
        <div
          className="mt-4 w-full"
          style={{
            height: '1px',
            background: '#7FE54D',
            boxShadow: '0 0 6px #7FE54D, 0 0 16px rgba(127, 229, 77, 0.45)',
          }}
        />
      </div>

      {/* Formulaire — centré dans l'espace restant */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-6 md:p-10">
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
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex h-[100dvh] w-full fixed inset-0 overflow-hidden bg-black">
      {/* NervPanel — hidden on mobile, visible from md breakpoint */}
      <div className="hidden md:block md:w-[60%] h-full">
        <NervPanel />
      </div>
      {/* LoginForm — full screen on mobile, 40% on desktop */}
      <div className="w-full md:w-[40%] h-full border-l border-orange-500/20">
        <LoginForm />
      </div>
    </div>
  )
}
