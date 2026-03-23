import { env } from "process";

export default function PingMonitor() {
  <div className="mb-6 col-span-3 text-orange-400">
    <div className="flex justify-between gap-2 text-[10px] font-bold tracking-widest mb-1">
      <span>PING MONITOR</span>
      <span>{env.VPS_IP}</span>
    </div>
    <div></div>
    <div className="flex gap-4 text-[10px] font-bold tracking-widest">
      <span>AVG: {pingData?.avg ?? "N/A"}</span>
      <span>MIN: {pingData?.min ?? "N/A"}</span>
      <span>MAX: {pingData?.max ?? "N/A"}</span>
      <span>LOSS: {pingData?.loss ?? "N/A"}</span>
    </div>
  </div>;
}
