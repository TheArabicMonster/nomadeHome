"use client"

import { useRouter } from "next/navigation"

export default function AnkiPage() {
  const router = useRouter()

  const decks = [
    { id: "japanese-kanji", name: "JAPANESE_KANJI", cards: 1250, reviews: 42 },
    { id: "spanish-vocab", name: "SPANISH_VOCAB", cards: 850, reviews: 28 },
    { id: "cs2-economy", name: "CS2_ECONOMY", cards: 320, reviews: 15 },
  ]

  const stats = [
    { label: "TOTAL_DECKS", value: "3" },
    { label: "CARDS_LEARNED", value: "892" },
    { label: "DUE_TODAY", value: "87" },
  ]

  return (
    <div className="relative flex h-full flex-col bg-black p-4 sm:p-8 font-mono select-none min-h-screen">
      {/* scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* content */}
      <div className="relative z-0 max-w-7xl mx-auto w-full">
        {/* header */}
        <div className="mb-8 text-center">
          <div className="text-[7px] sm:text-[9px] tracking-[0.4em] text-orange-500/40 mb-2">
            MEMORY PROTOCOL
          </div>
          <div className="text-3xl sm:text-5xl font-black tracking-[0.25em] text-orange-500">
            ANKI SYSTEM
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        </div>

        {/* stats grid */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="border border-orange-500/15 bg-orange-500/3 p-2 sm:p-3"
            >
              <div className="text-[7px] sm:text-[9px] tracking-widest text-orange-500/40 mb-1">
                {label}
              </div>
              <div className="text-xl sm:text-3xl font-bold text-orange-400">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* main content grid - responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* decks list - full width on mobile, 2 cols on tablet, 1 col on desktop */}
          <div className="lg:col-span-2">
            <div className="border border-orange-500/20 bg-orange-500/5">
              <div className="border-b border-orange-500/20 px-3 sm:px-4 py-2">
                <div className="text-[8px] sm:text-[9px] tracking-[0.4em] text-orange-500/60 font-bold">
                  DECK_MANAGER
                </div>
              </div>
              <div className="divide-y divide-orange-500/10">
                {decks.map(({ id, name, cards, reviews }) => (
                  <div
                    key={id}
                    onClick={() => router.push(`/dashboard/anki/${id}`)}
                    className="p-3 sm:p-4 hover:bg-orange-500/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[9px] sm:text-[10px] font-bold text-orange-400 tracking-widest">
                        {name}
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-[8px] sm:text-[9px] text-orange-500/60">
                      <span>CARDS: {cards}</span>
                      <span>REVIEWS: {reviews}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar - full width on mobile, right col on desktop */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* session widget */}
            <div className="border border-orange-500/20 bg-orange-500/5 p-3 sm:p-4">
              <div className="text-[8px] sm:text-[9px] tracking-[0.4em] text-orange-500/60 font-bold mb-3">
                SESSION_STATUS
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9px] text-orange-500/60">
                    STREAK
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-orange-400">
                    7
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] sm:text-[9px] text-orange-500/60">
                    TODAY_REVIEW
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-orange-400">
                    42
                  </span>
                </div>
                <div className="h-px bg-orange-500/10 my-2" />
                <button className="w-full border border-orange-500/30 text-orange-400 py-2 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-orange-500/10 transition-colors">
                  START_SESSION
                </button>
              </div>
            </div>

            {/* controls widget */}
            <div className="border border-orange-500/20 bg-orange-500/5 p-3 sm:p-4">
              <div className="text-[8px] sm:text-[9px] tracking-[0.4em] text-orange-500/60 font-bold mb-3">
                CONTROLS
              </div>
              <div className="space-y-2">
                <button className="w-full border border-orange-500/30 text-orange-400 py-1.5 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-orange-500/10 transition-colors">
                  NEW_DECK
                </button>
                <button className="w-full border border-orange-500/30 text-orange-400 py-1.5 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-orange-500/10 transition-colors">
                  IMPORT
                </button>
                <button className="w-full border border-orange-500/30 text-orange-400 py-1.5 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-orange-500/10 transition-colors">
                  SETTINGS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-orange-500/20 mt-8 pt-4 text-center">
          <div className="text-[8px] sm:text-[9px] tracking-widest text-orange-500/20">
            ANKI_PROTOCOL: INITIALIZED
          </div>
        </div>
      </div>
    </div>
  )
}
