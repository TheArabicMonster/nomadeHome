import PingMonitor from "@/components/pingMonitor"
import {HolographicMap} from "@/components/HolographicMap/HolographicMap"
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

      {/* vignette
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      /> */}

      <div className="w-full max-w-2xl bg-black">
        {/* header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-base font-bold tracking-[0.4em] text-orange-500/50">
            SYSTEM STATUS
          </div>
          <div className="text-6xl font-black tracking-[0.25em] text-orange-500">
            SYSTEM STANDBY
          </div>
          <div className="mt-6 h-1.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        </div>

        {/* status grid */}
        {/* <div className="mb-8 grid grid-cols-3 gap-2.5">
          {statuses.map(({ label, value, ok }) => (
            <div
              key={label}
              className="border-2 border-orange-500/30 bg-orange-500/8 p-3.5"
            >
              <div className="mb-1.5 text-sm font-bold tracking-widest text-orange-500/60">
                {label}
              </div>
              <div
                className={`flex items-center gap-2 text-base font-black tracking-widest ${ok ? "text-orange-400" : "text-red-400"}`}
              >
                <span
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${ok ? "animate-pulse bg-orange-400" : "bg-red-400"}`}
                />
                {value}
              </div>
            </div>
          ))}
        </div> */}

        {/* progress bars */}
        {/* <div className="mb-8 space-y-4">
          {bars.map(({ label, value, percent, bright }) => (
            <div key={label}>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-sm font-bold tracking-[0.3em] text-orange-500/60">
                  {label}
                </span>
                <span className="text-base font-black text-orange-400">
                  {value}
                </span>
              </div>
              <div className="h-2 w-full rounded-sm bg-orange-500/15">
                <div
                  className={`rounded-sm transition-all ${bright ? "h-full bg-orange-400" : "h-full bg-orange-500/60"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
        </div> */}

        {/* ping du vps */}
        {/* <PingMonitor /> */}
        
        {/* Mont Fuji */}
        <HolographicMap
          modelUrl="/models/fuji-san.glb"
          mode="topographic"
          subject="MT. FUJI"
          code="GEO-01"
          modelScale={1}
          lineSpacing={0.08}
        /> 

        {/* Eva-01 */}
        {/* <HolographicMap
          modelUrl="/models/eva-01.glb"
          mode="holographic"
          subject="NEW YORK CITY"
          code="URB-08"
          modelScale={0.5}
        /> */}

        {/* NYC block */}
        {/* <HolographicMap
          modelUrl="/models/new_york_city.glb"
          mode="holographic"
          subject="NEW YORK CITY"
          code="URB-08"
          modelScale={0.8}
        /> */}

        {/* footer */}
        <div className="mt-auto border-t-2 border-orange-500/30 pt-5 text-center">
          <div className="text-sm font-bold tracking-widest text-orange-500/30">
            CORE_STATUS: ALL SYSTEMS NOMINAL
          </div>
        </div>
      </div>
    </div>
  )
}
