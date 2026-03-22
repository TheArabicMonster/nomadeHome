"use client"

import { useEffect, useRef, useState } from "react"
import "@xterm/xterm/css/xterm.css"

type ConnectionStatus = "connecting" | "active" | "disconnected"

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ConnectionStatus>("connecting")
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 })

  useEffect(() => {
    let terminal: InstanceType<typeof import("@xterm/xterm").Terminal> | null =
      null
    let fitAddon: InstanceType<
      typeof import("@xterm/addon-fit").FitAddon
    > | null = null
    let ws: WebSocket | null = null
    let resizeObserver: ResizeObserver | null = null
    let disposed = false

    const init = async () => {
      const { Terminal } = await import("@xterm/xterm")
      const { FitAddon } = await import("@xterm/addon-fit")
      if (disposed || !terminalRef.current) return

      terminal = new Terminal({
        theme: {
          background: "#000000",
          foreground: "#f97316",
          cursor: "#f97316",
          cursorAccent: "#000000",
          selectionBackground: "rgba(249, 115, 22, 0.3)",
          black: "#000000",
          red: "#ef4444",
          green: "#f97316",
          yellow: "#fb923c",
          blue: "#f97316",
          magenta: "#ea580c",
          cyan: "#fb923c",
          white: "#fed7aa",
          brightBlack: "#78716c",
          brightRed: "#ef4444",
          brightGreen: "#fb923c",
          brightYellow: "#fde68a",
          brightBlue: "#f97316",
          brightMagenta: "#fb923c",
          brightCyan: "#fde68a",
          brightWhite: "#fff7ed",
        },
        fontFamily:
          '"Geist Mono", "Fira Code", "Cascadia Code", monospace',
        fontSize: 14,
        cursorBlink: true,
        allowProposedApi: true,
      })

      fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)
      terminal.open(terminalRef.current)

      requestAnimationFrame(() => {
        if (disposed || !fitAddon || !terminal) return
        fitAddon.fit()
        setDimensions({ cols: terminal.cols, rows: terminal.rows })
      })

      // Fetch token from server (cookie is HttpOnly, not readable by JS)
      const tokenRes = await fetch("/api/terminal/token")
      if (!tokenRes.ok) {
        setStatus("disconnected")
        terminal.write("\r\n\x1b[31m  ERROR: Unauthorized — please log in again.\x1b[0m\r\n")
        return
      }
      const { token } = await tokenRes.json()

      setStatus("connecting")
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      ws = new WebSocket(
        `${wsProtocol}//${window.location.host}/ws/terminal?token=${token}`,
      )

      ws.onopen = () => {
        if (disposed) return
        setStatus("active")
        if (ws && terminal) {
          ws.send(
            JSON.stringify({
              type: "resize",
              cols: terminal.cols,
              rows: terminal.rows,
            }),
          )
        }
      }

      ws.onmessage = (e) => {
        if (disposed || !terminal) return
        terminal.write(e.data)
      }

      ws.onclose = () => {
        if (disposed) return
        setStatus("disconnected")
      }

      ws.onerror = () => {
        if (disposed) return
        setStatus("disconnected")
      }

      terminal.onData((data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(data)
        }
      })

      // Resize handling
      const handleResize = () => {
        if (disposed || !fitAddon || !terminal) return
        fitAddon.fit()
        setDimensions({ cols: terminal.cols, rows: terminal.rows })
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "resize",
              cols: terminal.cols,
              rows: terminal.rows,
            }),
          )
        }
      }

      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(terminalRef.current)
    }

    init()

    return () => {
      disposed = true
      if (resizeObserver) resizeObserver.disconnect()
      if (ws) ws.close()
      if (terminal) terminal.dispose()
    }
  }, [])

  const statusLabel =
    status === "active"
      ? "ACTIVE"
      : status === "connecting"
        ? "CONNECTING..."
        : "DISCONNECTED"

  const dotColor =
    status === "active"
      ? "bg-green-400 animate-pulse"
      : status === "connecting"
        ? "bg-yellow-400 animate-pulse"
        : "bg-red-400"

  return (
    <div className="flex h-full flex-col bg-black font-mono">
      {/* status bar */}
      <div className="flex h-8 flex-shrink-0 items-center justify-between border-b border-orange-500/20 px-4">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotColor}`} />
          <span className="text-[10px] tracking-widest text-orange-400">
            {statusLabel}
          </span>
        </div>
        <div className="text-[9px] tracking-[0.4em] text-orange-500/40">
          TERMINAL SESSION
        </div>
        <div className="text-[9px] tabular-nums text-orange-500/30">
          {dimensions.cols > 0
            ? `${dimensions.cols}x${dimensions.rows}`
            : "—"}
        </div>
      </div>

      {/* terminal container */}
      <div ref={terminalRef} className="flex-1 min-h-0 p-1" />
    </div>
  )
}
