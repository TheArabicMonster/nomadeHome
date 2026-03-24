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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm sm:text-base tracking-[0.4em] font-bold text-orange-500/50 mb-2">
              STUDY_MODE
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-[0.2em] text-orange-500">
              {deck.name}
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm sm:text-base font-bold tracking-widest text-orange-500/60 hover:text-orange-500 transition-colors"
          >
            [RETURN]
          </button>
        </div>

        {/* progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-sm sm:text-base font-bold text-orange-500/70">
              PROGRESS
            </span>
            <span className="text-sm sm:text-base font-bold text-orange-500/70">
              {currentIndex + 1} / {deck.cards.length}
            </span>
          </div>
          <div className="h-2 w-full bg-orange-500/15 rounded-sm">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300 rounded-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="mb-10 border-3 border-orange-500/40 bg-orange-500/8 p-8 sm:p-16 cursor-pointer transition-all hover:border-orange-500/70 hover:bg-orange-500/15 min-h-72 sm:min-h-96 flex flex-col items-center justify-center"
        >
          <div className="text-base sm:text-lg tracking-[0.3em] font-black text-orange-500/50 mb-6 uppercase">
            {isFlipped ? "ANSWER" : "QUESTION"}
          </div>
          <div className="text-center">
            {isFlipped ? (
              <div className="text-4xl sm:text-6xl font-black text-orange-400 mb-4">
                {currentCard.back}
              </div>
            ) : (
              <div className="text-7xl sm:text-9xl font-black text-orange-500">
                {currentCard.front}
              </div>
            )}
          </div>
          <div className="mt-10 text-sm sm:text-base font-bold text-orange-500/50">
            [CLICK TO {isFlipped ? "FLIP_BACK" : "REVEAL"}]
          </div>
        </div>

        {/* response buttons */}
        <div className="mb-8">
          <div className="text-sm sm:text-base tracking-[0.3em] font-bold text-orange-500/60 mb-4 uppercase">
            How well did you know this?
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => handleResponse("again")}
              disabled={!isFlipped}
              className="border-2 border-red-500/40 bg-red-500/8 text-red-400 py-3 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-red-500/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              AGAIN
            </button>
            <button
              onClick={() => handleResponse("hard")}
              disabled={!isFlipped}
              className="border-2 border-orange-500/40 bg-orange-500/8 text-orange-400 py-3 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-orange-500/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              HARD
            </button>
            <button
              onClick={() => handleResponse("good")}
              disabled={!isFlipped}
              className="border-2 border-yellow-500/40 bg-yellow-500/8 text-yellow-400 py-3 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-yellow-500/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              GOOD
            </button>
            <button
              onClick={() => handleResponse("easy")}
              disabled={!isFlipped}
              className="border-2 border-green-500/40 bg-green-500/8 text-green-400 py-3 px-3 text-sm sm:text-base font-black tracking-wide hover:bg-green-500/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              EASY
            </button>
          </div>
        </div>

        {/* session stats */}
        <div className="border-2 border-orange-500/30 bg-orange-500/8 p-5">
          <div className="text-sm sm:text-base tracking-[0.3em] text-orange-500/70 font-black mb-5 uppercase">
            Session_Stats
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <div className="text-sm font-bold text-orange-500/70 mb-2">AGAIN</div>
              <div className="text-3xl sm:text-4xl font-black text-red-400">
                {sessionStats.again}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-orange-500/70 mb-2">HARD</div>
              <div className="text-3xl sm:text-4xl font-black text-orange-400">
                {sessionStats.hard}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-orange-500/70 mb-2">GOOD</div>
              <div className="text-3xl sm:text-4xl font-black text-yellow-400">
                {sessionStats.good}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-orange-500/70 mb-2">EASY</div>
              <div className="text-3xl sm:text-4xl font-black text-green-400">
                {sessionStats.easy}
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="border-t-2 border-orange-500/30 mt-10 pt-5 text-center">
          <div className="text-sm sm:text-base font-bold tracking-widest text-orange-500/30">
            STUDY_SESSION: ACTIVE
          </div>
        </div>
      </div>
    </div>
  )
}
