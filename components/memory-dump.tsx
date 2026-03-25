"use client"

import { useEffect, useState } from "react"

export function MemoryDump() {
  const [dataLines, setDataLines] = useState<string[]>([])

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

  return (
    <div className="flex-1 overflow-hidden">
      <div className="text-xs font-semibold tracking-[0.4em] text-orange-500/50 mb-2">
        MEMORY DUMP — LIVE
      </div>
      <div className="space-y-px">
        {dataLines.map((line, i) => (
          <div
            key={i}
            className="text-[11px] font-mono transition-all duration-300"
            style={{
              color: `rgba(251, 146, 60, ${0.08 + (i / dataLines.length) * 0.7})`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
