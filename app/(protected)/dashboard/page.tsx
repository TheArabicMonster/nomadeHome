import { env } from "process"

export default function DashboardPage() {
  const statuses = [
    { label: "MAGI-01", value: "ONLINE", ok: true },
    { label: "MAGI-02", value: "ONLINE", ok: true },
    { label: "MAGI-03", value: "ONLINE", ok: true },
    { label: "ENCRYPTION", value: "ACTIVE", ok: true },
    { label: "FIREWALL", value: "NOMINAL", ok: true },
    { label: "SYNC", value: "CONNECTED", ok: true },
  ]

  const bars = [
    { label: "SYNC_LINK", value: "99.9%", percent: 99.9, bright: true },
    { label: "BUFFER_LOAD", value: "12.4%", percent: 12.4, bright: false },
    { label: "LATENCY", value: "4ms", percent: 4, bright: false },
  ]

  const pingData = {
    avg: "15ms",
    min: "12ms",
    max: "20ms",
    loss: "0%"
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-black p-8 font-mono select-none">
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="w-full max-w-xl">
        {/* header */}
        <div className="mb-6 text-center">
          <div className="text-[9px] tracking-[0.4em] text-orange-500/40 mb-2">
            SYSTEM STATUS
          </div>
          <div className="text-5xl font-black tracking-[0.25em] text-orange-500">
            SYSTEM STANDBY
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
        </div>

        {/* status grid */}
        <div className="mb-6 grid grid-cols-3 gap-1.5">
          {statuses.map(({ label, value, ok }) => (
            <div
              key={label}
              className="border border-orange-500/15 bg-orange-500/3 p-2"
            >
              <div className="text-[9px] tracking-widest text-orange-500/40 mb-0.5">
                {label}
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold tracking-widest ${ok ? "text-orange-400" : "text-red-400"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${ok ? "bg-orange-400 animate-pulse" : "bg-red-400"}`}
                />
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* progress bars */}
        <div className="mb-6 space-y-3">
          {bars.map(({ label, value, percent, bright }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] tracking-[0.4em] text-orange-500/40">
                  {label}
                </span>
                <span className="text-[10px] font-bold text-orange-400">
                  {value}
                </span>
              </div>
              <div className="h-1 w-full bg-orange-500/10">
                <div
                  className={bright ? "h-full bg-orange-400" : "h-full bg-orange-500/60"}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ping du vps */}
        <div className="mb-6 col-span-3 text-orange-400">
          <div className="flex justify-between gap-2 text-[10px] font-bold tracking-widest mb-1">
            <span>PING MONITOR</span>
            <span>{env.VPS_IP}</span>
          </div>
          <div>
            
          </div>
          <div className="flex gap-4 text-[10px] font-bold tracking-widest">
            <span>AVG: {pingData?.avg ?? "N/A"}</span>
            <span>MIN: {pingData?.min ?? "N/A"}</span>
            <span>MAX: {pingData?.max ?? "N/A"}</span>
            <span>LOSS: {pingData?.loss ?? "N/A"}</span>
          </div>
        </div>  

        {/* footer */}
        <div className="border-t border-orange-500/20 pt-3 text-center">
          <div className="text-[9px] tracking-widest text-orange-500/20">
            CORE_STATUS: ALL SYSTEMS NOMINAL
          </div>
        </div>
      </div>
    </div>
  )
}
