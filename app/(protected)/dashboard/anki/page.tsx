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
        <div className="mb-10 text-center">
          <div className="text-sm sm:text-base tracking-[0.4em] font-bold text-orange-500/50 mb-3">
            MEMORY PROTOCOL
          </div>
          <div className="text-5xl sm:text-7xl font-black tracking-[0.25em] text-orange-500">
            ANKI SYSTEM
          </div>
          <div className="mt-6 h-1.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        </div>

        {/* stats grid */}
        <div className="mb-10 grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="border-2 border-orange-500/30 bg-orange-500/5 p-4 sm:p-5"
            >
              <div className="text-xs sm:text-sm tracking-widest font-bold text-orange-500/50 mb-2">
                {label}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-orange-400">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* main content grid - responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* decks list - full width on mobile, 2 cols on tablet, 1 col on desktop */}
          <div className="lg:col-span-2">
            <div className="border-2 border-orange-500/30 bg-orange-500/5">
              <div className="border-b-2 border-orange-500/30 px-5 sm:px-6 py-4">
                <div className="text-sm sm:text-base tracking-[0.3em] text-orange-500/70 font-black">
                  DECK_MANAGER
                </div>
              </div>
              <div className="divide-y divide-orange-500/20">
                {decks.map(({ id, name, cards, reviews }) => (
                  <div
                    key={id}
                    onClick={() => router.push(`/dashboard/anki/${id}`)}
                    className="p-4 sm:p-5 hover:bg-orange-500/15 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-base sm:text-lg font-black text-orange-400 tracking-wide">
                        {name}
                      </div>
                      <div className="h-2.5 w-2.5 rounded-full bg-orange-400 animate-pulse" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-sm sm:text-base font-bold text-orange-500/70">
                      <span>CARDS: {cards}</span>
                      <span>REVIEWS: {reviews}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar - full width on mobile, right col on desktop */}
          <div className="lg:col-span-1 space-y-5 sm:space-y-6">
            {/* session widget */}
            <div className="border-2 border-orange-500/30 bg-orange-500/5 p-4 sm:p-5">
              <div className="text-sm sm:text-base tracking-[0.3em] text-orange-500/70 font-black mb-4">
                SESSION_STATUS
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-orange-500/70">
                    STREAK
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-orange-400">
                    7
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-orange-500/70">
                    TODAY_REVIEW
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-orange-400">
                    42
                  </span>
                </div>
                <div className="h-1 bg-orange-500/20 my-3" />
                <button className="w-full border-2 border-orange-500/40 text-orange-400 py-2.5 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-orange-500/15 transition-colors">
                  START_SESSION
                </button>
              </div>
            </div>

            {/* controls widget */}
            <div className="border-2 border-orange-500/30 bg-orange-500/5 p-4 sm:p-5">
              <div className="text-sm sm:text-base tracking-[0.3em] text-orange-500/70 font-black mb-4">
                CONTROLS
              </div>
              <div className="space-y-2.5">
                <button className="w-full border-2 border-orange-500/40 text-orange-400 py-2.5 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-orange-500/15 transition-colors">
                  NEW_DECK
                </button>
                <button className="w-full border-2 border-orange-500/40 text-orange-400 py-2.5 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-orange-500/15 transition-colors">
                  IMPORT
                </button>
                <button className="w-full border-2 border-orange-500/40 text-orange-400 py-2.5 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-orange-500/15 transition-colors">
                  SETTINGS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t-2 border-orange-500/30 mt-10 pt-5 text-center">
          <div className="text-xs sm:text-sm tracking-widest font-bold text-orange-500/30">
            ANKI_PROTOCOL: INITIALIZED
          </div>
        </div>
      </div>
    </div>
  )
}
