"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

// Fake deck data
const decksData: Record<string, any> = {
  "japanese-kanji": {
    name: "JAPANESE_KANJI",
    totalCards: 1250,
    currentIndex: 0,
    cards: [
      { id: 1, front: "木", back: "Tree / Wood (KI, MOKU)" },
      { id: 2, front: "火", back: "Fire (HI, KA)" },
      { id: 3, front: "水", back: "Water (MIZU, SUI)" },
      { id: 4, front: "金", back: "Gold / Metal (KIN, KON)" },
      { id: 5, front: "土", back: "Earth (TSUCHI, DO)" },
    ],
  },
}

export default function DeckStudyPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const deck = decksData[deckId] || decksData["japanese-kanji"]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  const currentCard = deck.cards[currentIndex]
  const progress = ((currentIndex + 1) / deck.cards.length) * 100

  const handleResponse = (type: "again" | "hard" | "good" | "easy") => {
    setSessionStats((prev) => ({ ...prev, [type]: prev[type] + 1 }))

    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // Session complete
      setCurrentIndex(0)
      setIsFlipped(false)
    }
  }

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
      <div className="relative z-0 max-w-2xl mx-auto w-full">
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-[7px] sm:text-[9px] tracking-[0.4em] text-orange-500/40 mb-1">
              STUDY_MODE
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-orange-500">
              {deck.name}
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="text-[8px] sm:text-[9px] tracking-widest text-orange-500/50 hover:text-orange-500 transition-colors"
          >
            [RETURN]
          </button>
        </div>

        {/* progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-[8px] sm:text-[9px] text-orange-500/60">
              PROGRESS
            </span>
            <span className="text-[8px] sm:text-[9px] text-orange-500/60">
              {currentIndex + 1} / {deck.cards.length}
            </span>
          </div>
          <div className="h-1 w-full bg-orange-500/10">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="mb-8 border-2 border-orange-500/30 bg-orange-500/5 p-6 sm:p-12 cursor-pointer transition-all hover:border-orange-500/60 hover:bg-orange-500/10 min-h-64 sm:min-h-80 flex flex-col items-center justify-center"
        >
          <div className="text-[9px] tracking-[0.4em] text-orange-500/40 mb-4 uppercase">
            {isFlipped ? "ANSWER" : "QUESTION"}
          </div>
          <div className="text-center">
            {isFlipped ? (
              <div className="text-3xl sm:text-5xl font-bold text-orange-400 mb-4">
                {currentCard.back}
              </div>
            ) : (
              <div className="text-6xl sm:text-8xl font-black text-orange-500">
                {currentCard.front}
              </div>
            )}
          </div>
          <div className="mt-8 text-[8px] sm:text-[9px] text-orange-500/40">
            [CLICK TO {isFlipped ? "FLIP_BACK" : "REVEAL"}]
          </div>
        </div>

        {/* response buttons */}
        <div className="mb-8">
          <div className="text-[8px] sm:text-[9px] tracking-[0.4em] text-orange-500/40 mb-3 uppercase">
            How well did you know this?
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => handleResponse("again")}
              disabled={!isFlipped}
              className="border border-red-500/30 bg-red-500/5 text-red-400 py-2 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              AGAIN
            </button>
            <button
              onClick={() => handleResponse("hard")}
              disabled={!isFlipped}
              className="border border-orange-500/30 bg-orange-500/5 text-orange-400 py-2 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-orange-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              HARD
            </button>
            <button
              onClick={() => handleResponse("good")}
              disabled={!isFlipped}
              className="border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 py-2 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-yellow-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              GOOD
            </button>
            <button
              onClick={() => handleResponse("easy")}
              disabled={!isFlipped}
              className="border border-green-500/30 bg-green-500/5 text-green-400 py-2 px-2 text-[8px] sm:text-[9px] font-bold tracking-widest hover:bg-green-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              EASY
            </button>
          </div>
        </div>

        {/* session stats */}
        <div className="border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="text-[8px] sm:text-[9px] tracking-[0.4em] text-orange-500/40 mb-3 uppercase">
            Session_Stats
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[8px] text-orange-500/60 mb-1">AGAIN</div>
              <div className="text-2xl sm:text-3xl font-bold text-red-400">
                {sessionStats.again}
              </div>
            </div>
            <div>
              <div className="text-[8px] text-orange-500/60 mb-1">HARD</div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">
                {sessionStats.hard}
              </div>
            </div>
            <div>
              <div className="text-[8px] text-orange-500/60 mb-1">GOOD</div>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                {sessionStats.good}
              </div>
            </div>
            <div>
              <div className="text-[8px] text-orange-500/60 mb-1">EASY</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {sessionStats.easy}
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-orange-500/20 mt-8 pt-4 text-center">
          <div className="text-[8px] sm:text-[9px] tracking-widest text-orange-500/20">
            STUDY_SESSION: ACTIVE
          </div>
        </div>
      </div>
    </div>
  )
}
