import { useEffect, useRef, useState } from "react"

interface Size {
  width: number
  height: number
}

export function useContainerSize(ref: React.RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function commit(width: number, height: number): void {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setSize((prev) => {
          if (prev.width === width && prev.height === height) return prev
          return { width, height }
        })
      })
    }

    // Mesure initiale synchrone pour éviter le flash
    const rect = el.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      commit(width, height)
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [ref])

  return size
}
