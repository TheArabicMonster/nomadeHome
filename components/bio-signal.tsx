"use client"

import { useEffect, useRef } from "react"

const PILOT_PROFILES = {
  shinji: {
    baseAmplitude: 0.75,
    frequency: 1.0,
    chaos: 0.15,
    color: "#7FE54D",
    label: "PILOT_01",
    syncBase: 58.42,
  },
  asuka: {
    baseAmplitude: 1.3,
    frequency: 1.6,
    chaos: 0.55,
    color: "#7FE54D",
    label: "PILOT_02",
    syncBase: 89.15,
  },
  rei: {
    baseAmplitude: 0.18,
    frequency: 0.6,
    chaos: 0.02,
    color: "#7FE54D",
    label: "PILOT_00",
    syncBase: 0.0,
  },
} as const

type PilotKey = keyof typeof PILOT_PROFILES
type PilotProfile = (typeof PILOT_PROFILES)[PilotKey]

// Forme ECG : un cycle complet P-QRS-T sur phase [0,1]
function ecgBeat(phase: number, profile: PilotProfile): number {
  const amp = profile.baseAmplitude

  // P wave : petite bosse pré-QRS
  const p =
    phase > 0.05 && phase < 0.18
      ? Math.sin(((phase - 0.05) / 0.13) * Math.PI) * 0.12 * amp
      : 0

  // Q : légère dépression avant le spike
  const q =
    phase > 0.18 && phase < 0.22
      ? -Math.sin(((phase - 0.18) / 0.04) * Math.PI) * 0.08 * amp
      : 0

  // R : pic principal aigu et étroit
  const r =
    phase > 0.22 && phase < 0.32
      ? Math.sin(((phase - 0.22) / 0.1) * Math.PI) * amp
      : 0

  // S : dépression post-pic
  const s =
    phase > 0.32 && phase < 0.38
      ? -Math.sin(((phase - 0.32) / 0.06) * Math.PI) * 0.1 * amp
      : 0

  // T wave : bosse douce de repolarisation
  const t =
    phase > 0.42 && phase < 0.62
      ? Math.sin(((phase - 0.42) / 0.2) * Math.PI) * 0.18 * amp
      : 0

  return p + q + r + s + t
}

// Bruit de ligne de base (dépend du chaos du pilote)
function baselineNoise(t: number, chaos: number, seed: number): number {
  return (
    (Math.sin(t * 2.3 + seed) * 0.3 + Math.sin(t * 5.7 + seed * 1.7) * 0.15) *
    chaos *
    0.04
  )
}

// Variation du sync rate pour SyncCounter
function syncNoise(t: number, seed: number): number {
  return Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 3.1 + seed * 1.3) * 0.3
}

function calculateY(
  t: number,
  profile: PilotProfile,
  seed: number,
  height: number
): number {
  const { frequency, chaos } = profile
  const beatPeriod = 1 / frequency
  const phase = (t % beatPeriod) / beatPeriod

  // Légère arythmie selon le chaos du pilote
  const rrJitter = Math.sin(t * 0.3 + seed) * chaos * 0.08
  const jitteredPhase = Math.max(0, Math.min(1, phase + rrJitter))

  const beat = ecgBeat(jitteredPhase, profile)
  const noise = baselineNoise(t, chaos, seed)
  const raw = beat + noise

  return height / 2 - raw * (height / 2.2)
}

interface BioSignalProps {
  pilot?: PilotKey
  height?: number
  seed?: number
}

export function BioSignal({
  pilot = "shinji",
  height = 60,
  seed = 42,
}: BioSignalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const profile = PILOT_PROFILES[pilot]

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = wrapper.clientWidth

    // HiDPI
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const speed = 0.025
    const targetFps = 15
    const frameInterval = 1000 / targetFps
    let lastTime = 0

    const draw = (timestamp: number) => {
      if (timestamp - lastTime < frameInterval) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      lastTime = timestamp
      timeRef.current += speed

      // Phosphore trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)"
      ctx.fillRect(0, 0, width, height)

      // Signal line
      ctx.beginPath()
      ctx.strokeStyle = profile.color
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 8
      ctx.shadowColor = profile.color

      for (let x = 0; x < width; x++) {
        const t = timeRef.current - (width - x) * 0.012
        const y = calculateY(t, profile, seed, height)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [pilot, height, seed, profile]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ fontFamily: "Digital7, monospace" }}>
      {/* Ligne principale : label vertical + canvas */}
      <div className="flex">
        {/* Nom pilote vertical */}
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            color: "rgba(249,115,22,0.8)",
            width: "14px",
          }}
        >
          {profile.label}
        </span>

        {/* Canvas */}
        <div className="relative flex-1 border border-orange-500/15 overflow-hidden bg-black">
          <canvas ref={canvasRef} />

          {/* Scan line overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
          />
        </div>
      </div>

      {/* Labels bottom */}
      <div className="flex justify-between mt-0.5 pl-[14px]">
        <span className="text-[9px] tracking-[0.2em] text-orange-500/40">
          SYNC RATE
        </span>
        <SyncCounter profile={profile} seed={seed} />
      </div>
    </div>
  )
}

function SyncCounter({
  profile,
  seed,
}: {
  profile: PilotProfile
  seed: number
}) {
  const displayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (profile.syncBase === 0) {
      if (displayRef.current) displayRef.current.textContent = "00.00%"
      return
    }
    let t = 0
    const id = setInterval(() => {
      t += 0.1
      const val = profile.syncBase + syncNoise(t * 0.4, seed + 99) * 2.5
      if (displayRef.current)
        displayRef.current.textContent = `${val.toFixed(2).padStart(5, "0")}%`
    }, 100)
    return () => clearInterval(id)
  }, [profile, seed])

  return (
    <span
      ref={displayRef}
      className="text-[9px] tracking-[0.2em]"
      style={{ color: profile.color }}
    >
      {profile.syncBase === 0
        ? "00.00%"
        : `${profile.syncBase.toFixed(2)}%`}
    </span>
  )
}
