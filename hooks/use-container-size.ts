import { useEffect, useRef, useState } from "react"

export function useContainerSize(ref: React.RefObject<HTMLElement | null>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = (width: number, height: number) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setSize({ width, height })
      }, 50)
    }

    // Mesure initiale synchrone pour éviter le flash
    const rect = el.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      update(width, height)
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [ref])

  return size
}
