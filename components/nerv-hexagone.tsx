import React from "react"

interface NervHexagonProps {
  size?: number
  intensity?: number
}

export const NervHexagon = React.memo(function NervHexagon({
  size = 100,
  intensity,
}: NervHexagonProps) {
  const controlled = intensity !== undefined

  const smallBlur = controlled ? 4 + intensity! * 4 : undefined
  const bigBlur   = controlled ? 12 + intensity! * 12 : undefined
  const bigAlpha  = controlled
    ? Math.round(0x55 + intensity! * (0xaa - 0x55)).toString(16).padStart(2, "0")
    : undefined

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
          : undefined
      }
      className={
        controlled
          ? undefined
          : "group cursor-pointer [filter:drop-shadow(0_0_4px_#ff1a1a)_drop-shadow(0_0_12px_#ff000055)] transition-[filter] duration-700 hover:[filter:drop-shadow(0_0_8px_#ff1a1a)_drop-shadow(0_0_24px_#ff0000aa)]"
      }
    >
      <polygon
        points="25,5 75,5 100,50 75,95 25,95 0,50"
        style={controlled ? { fill: `rgba(255, 26, 26, ${intensity})` } : undefined}
        className={
          controlled
            ? "stroke-[#ff1a1a] stroke-[2]"
            : "fill-transparent stroke-[#ff1a1a] stroke-[2] transition-colors duration-700 group-hover:fill-[#ff1a1a]"
        }
      />
    </svg>
  )
})
