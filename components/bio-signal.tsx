"use client"

import { useEffect, useRef } from "react"

const PILOT_PROFILES = {
  shinji: {
    baseAmplitude: 0.6,
    frequency: 1.0,
    chaos: 0.4,
    color: "#7FE54D",
    label: "PILOT_01",
    syncBase: 58.42,
  },
  asuka: {
    baseAmplitude: 1.4,
    frequency: 1.8,
    chaos: 0.9,
    color: "#7FE54D",
    label: "PILOT_02",
    syncBase: 89.15,
  },
  rei: {
    baseAmplitude: 0.3,
    frequency: 0.5,
    chaos: 0.1,
    color: "#7FE54D",
    label: "PILOT_00",
    syncBase: 0.0,
  },
} as const

type PilotKey = keyof typeof PILOT_PROFILES

// Simplex-like noise via multiple sines (no external dep)
function pseudoNoise(t: number, seed: number): number {
  return (
    Math.sin(t * 1.7 + seed) * 0.5 +
    Math.sin(t * 3.1 + seed * 1.3) * 0.3 +
    Math.sin(t * 7.3 + seed * 0.7) * 0.15 +
    Math.sin(t * 13.7 + seed * 2.1) * 0.05
  )
}

// Spike events: sharp brief peaks at pseudo-random intervals
function spikeEvent(t: number, seed: number, freq: number): number {
  const phase = (t * freq * 0.3 + seed) % (Math.PI * 2)
  const trigger = Math.sin(phase * 7.4 + seed * 3.1)
  if (trigger > 0.97) {
    return Math.exp(-((phase % 0.5) ** 2) * 40) * 1.5
  }
  return 0
}

function calculateY(
  t: number,
  profile: (typeof PILOT_PROFILES)[PilotKey],
  seed: number,
  height: number
): number {
  const { baseAmplitude, frequency, chaos } = profile
  const base = Math.sin(t * frequency * 2) * baseAmplitude
  const noise = pseudoNoise(t * chaos, seed) * chaos * 0.6
  const spike = spikeEvent(t, seed, frequency)
  const raw = base + noise + spike
  return height / 2 - raw * (height / 4)
}

interface BioSignalProps {
  pilot?: PilotKey
  width?: number
  height?: number
  seed?: number
}

export function BioSignal({
  pilot = "shinji",
  width = 280,
  height = 60,
  seed = 42,
}: BioSignalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const profile = PILOT_PROFILES[pilot]

  // Sync rate oscillates around syncBase
  const syncRef = useRef(profile.syncBase)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // HiDPI
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const speed = 0.025
    const targetFps = 25
    const frameInterval = 1000 / targetFps
    let lastTime = 0

    const draw = (timestamp: number) => {
      if (timestamp - lastTime < frameInterval) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      lastTime = timestamp
      timeRef.current += speed

      // Phosphore trail — ne pas effacer totalement
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

      // Sync rate drift
      syncRef.current =
        profile.syncBase +
        pseudoNoise(timeRef.current * 0.4, seed + 99) * 2.5

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [pilot, width, height, seed, profile])  // eslint-disable-line react-hooks/exhaustive-deps

  const syncDisplay =
    pilot === "rei"
      ? "00.00"
      : syncRef.current.toFixed(2).padStart(5, "0")

  return (
    <div className="relative" style={{ width, fontFamily: "Digital7, monospace" }}>
      {/* Labels top */}
      <div className="flex justify-between mb-0.5">
        <span className="text-[9px] tracking-[0.3em] text-orange-500/50">
          {profile.label}
        </span>
        <span className="text-[9px] tracking-[0.2em] text-orange-500/50">
          NEURAL LINK
        </span>
      </div>

      {/* Canvas */}
      <div className="relative border border-orange-500/15 overflow-hidden bg-black">
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

      {/* Labels bottom */}
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] tracking-[0.2em] text-orange-500/40">
          SYNC RATE
        </span>
        <SyncCounter profile={profile} seed={seed} />
      </div>
    </div>
  )
}

// Separate component so sync counter re-renders at 10fps independently
function SyncCounter({
  profile,
  seed,
}: {
  profile: (typeof PILOT_PROFILES)[PilotKey]
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
      const val =
        profile.syncBase + pseudoNoise(t * 0.4, seed + 99) * 2.5
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
