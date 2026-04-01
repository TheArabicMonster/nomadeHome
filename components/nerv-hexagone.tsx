"use client";

import React from "react"
import { cn } from "@/lib/utils"

export type HexState = "hidden" | "outline" | "filled" | "fading"

interface NervHexagonProps {
  size?: number
  intensity?: number // Utilisé par l'ancien système (effet de souris)
  status?: HexState  // Utilisé par le nouveau système (cinématique de transition)
  delay?: number     // Utilisé pour la propagation de l'onde
  darkFill?: boolean // Fond noir forcé pour le mode navigation
}

export const NervHexagon = React.memo(function NervHexagon({
  size = 100,
  intensity,
  status,
  delay = 0,
  darkFill = false,
}: NervHexagonProps) {
  // On garde le mode "controlled" (souris) si on passe 'intensity' sans 'status'
  const controlled = intensity !== undefined && status === undefined

  const smallBlur = controlled ? 4 + intensity! * 4 : undefined
  const bigBlur   = controlled ? 12 + intensity! * 12 : undefined
  const bigAlpha  = controlled
    ? Math.round(0x55 + intensity! * (0xaa - 0x55)).toString(16).padStart(2, "0")
    : undefined

  // Définition des classes CSS en fonction du statut d'animation global
  let statusClasses = ""
  let svgClasses = ""

  if (status) {
    switch (status) {
      case "hidden":
        statusClasses = "fill-transparent stroke-transparent"
        svgClasses = "opacity-0"
        break
      case "outline":
        statusClasses = darkFill
          ? "fill-black stroke-[#ff1a1a] stroke-[2] group-hover:fill-[#5a0000]"
          : "fill-transparent stroke-[#ff1a1a] stroke-[2]"
        svgClasses = "opacity-100 [filter:drop-shadow(0_0_4px_#ff1a1a)_drop-shadow(0_0_12px_#ff000055)]"
        break
      case "filled":
        statusClasses = "fill-[#ff1a1a] stroke-[#ff1a1a] stroke-[2]"
        svgClasses = "opacity-100 [filter:drop-shadow(0_0_8px_#ff1a1a)_drop-shadow(0_0_24px_#ff0000aa)]"
        break
      case "fading":
        statusClasses = "fill-[#ff1a1a] stroke-[#ff1a1a] stroke-[2]"
        svgClasses = "opacity-0" // Disparaît
        break
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={
        controlled
          ? {
              filter: `drop-shadow(0 0 ${smallBlur}px #ff1a1a) drop-shadow(0 0 ${bigBlur}px #ff0000${bigAlpha})`,
              pointerEvents: "none",
            }
          : status
          ? {
              transitionDelay: `${delay}ms`, // C'est ici que la propagation magique s'opère !
              pointerEvents: "none",
            }
          : undefined
      }
      className={cn(
        controlled
          ? undefined
          : status
          ? `transition-all duration-300 ease-out ${svgClasses}`
          : "group cursor-pointer [filter:drop-shadow(0_0_4px_#ff1a1a)_drop-shadow(0_0_12px_#ff000055)] transition-[filter] duration-700 hover:[filter:drop-shadow(0_0_8px_#ff1a1a)_drop-shadow(0_0_24px_#ff0000aa)]"
      )}
    >
      <polygon
        points="25,5 75,5 100,50 75,95 25,95 0,50"
        style={
          controlled 
            ? { fill: `rgba(255, 26, 26, ${intensity})` } 
            : status 
            ? { transitionDelay: `${delay}ms` } 
            : undefined
        }
        className={cn(
          controlled
            ? "stroke-[#ff1a1a] stroke-[2]"
            : status
            ? `transition-colors duration-300 ease-out ${statusClasses}`
            : "fill-transparent stroke-[#ff1a1a] stroke-[2] transition-colors duration-700 group-hover:fill-[#ff1a1a]"
        )}
      />
    </svg>
  )
})
