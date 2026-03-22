import { config } from "dotenv"
import * as path from "path"
import { URL, fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { WebSocketServer } from "ws"
import * as pty from "node-pty"
import { jwtVerify } from "jose"

config({ path: path.resolve(__dirname, "../.env.local") })

const PORT = Number(process.env.TERMINAL_PORT) || 3002

const wss = new WebSocketServer({ port: PORT })

console.log(`Terminal server listening on port ${PORT}`)

wss.on("connection", async (ws, req) => {
  const url = new URL(req.url ?? "", `http://${req.headers.host}`)
  const token = url.searchParams.get("token")

  if (!token || !process.env.SESSION_SECRET) {
    ws.close(1008, "Policy Violation")
    return
  }

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET)
    await jwtVerify(token, secret)
  } catch {
    ws.close(1008, "Policy Violation")
    return
  }

  console.log("Terminal connection opened")

  const shell = pty.spawn("/bin/bash", [], {
    name: "xterm-256color",
    cwd: process.env.HOME || "/home/ubuntu",
    env: process.env as Record<string, string>,
    cols: 80,
    rows: 24,
  })

  shell.onData((data) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(data)
    }
  })

  shell.onExit(() => {
    console.log("Terminal connection closed (pty exited)")
    if (ws.readyState === ws.OPEN) {
      ws.close()
    }
  })

  ws.on("message", (message) => {
    const msg = message.toString()
    try {
      const parsed = JSON.parse(msg)
      if (parsed.type === "resize" && parsed.cols && parsed.rows) {
        shell.resize(parsed.cols, parsed.rows)
        return
      }
    } catch {
      // not JSON, treat as raw input
    }
    shell.write(msg)
  })

  ws.on("close", () => {
    console.log("Terminal connection closed (ws closed)")
    shell.kill()
  })
})
