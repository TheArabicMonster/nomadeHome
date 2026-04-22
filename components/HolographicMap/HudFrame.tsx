"use client";

import { useEffect, useState } from "react";

interface HudFrameProps {
  subject: string;
  code: string;
  mode: string;
  accentColor: string;
}

/**
 * Pure CSS/HTML overlay in the NERV aesthetic.
 *
 * All decorative chrome (corner brackets, tick marks, scrolling data,
 * timestamp) lives here — NOT in three.js. This is the right call:
 * CSS gives pixel-perfect rendering at any resolution, and DOM text
 * is selectable/accessible.
 *
 * The overlay is `pointer-events: none` so the underlying canvas
 * (and any future controls) remains interactive.
 */
export function HudFrame({ subject, code, mode, accentColor }: HudFrameProps) {
  const [timestamp, setTimestamp] = useState("00:00:00.00");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const diff = (Date.now() - start) / 1000;
      setElapsed(diff);
      const mins = Math.floor(diff / 60);
      const secs = Math.floor(diff % 60);
      const cs = Math.floor((diff % 1) * 100);
      setTimestamp(
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(cs).padStart(2, "0")}`
      );
    }, 33);
    return () => clearInterval(id);
  }, []);

  const styles = {
    "--accent": accentColor,
  } as React.CSSProperties;

  return (
    <>
      <div className="nerv-hud" style={styles}>
        {/* Corner brackets — the signature NERV frame */}
        <div className="nerv-corner nerv-corner-tl" />
        <div className="nerv-corner nerv-corner-tr" />
        <div className="nerv-corner nerv-corner-bl" />
        <div className="nerv-corner nerv-corner-br" />

        {/* Top-right subject identification block */}
        <div className="nerv-subject-block">
          <div className="nerv-code-row">
            <span className="nerv-plusminus">± </span>
            <span className="nerv-timer">{timestamp}</span>
            <span className="nerv-serial">· {Math.floor(elapsed * 1000) % 100000}</span>
          </div>
          <div className="nerv-code-box">{code}</div>
          <div className="nerv-subject">SUBJECT:</div>
          <div className="nerv-subject-name">{subject}</div>
        </div>

        {/* Top-left mode indicator */}
        <div className="nerv-mode-block">
          <div className="nerv-mode-label">ANALYSIS MODE</div>
          <div className="nerv-mode-value">{mode.toUpperCase()}</div>
          <div className="nerv-mode-status">
            <span className="nerv-pulse" />
            <span>LIVE SCAN</span>
          </div>
        </div>

        {/* Bottom ruler — echoes the -5 to +5 scale from the inspiration */}
        <div className="nerv-ruler">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="nerv-ruler-tick">
              <span className="nerv-ruler-mark">|</span>
              <span className="nerv-ruler-label">
                {i - 5 >= 0 ? `+${i - 5}` : i - 5}
              </span>
            </div>
          ))}
        </div>

        {/* Left vertical graduation */}
        <div className="nerv-ladder">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="nerv-ladder-tick"
              style={{ opacity: i % 4 === 0 ? 1 : 0.4 }}
            />
          ))}
        </div>

        {/* Bottom-right scrolling data readout */}
        <div className="nerv-data-readout">
          <div>LAT 35.3606° N</div>
          <div>LON 138.7274° E</div>
          <div>ELEV 3776.24 M</div>
          <div>SIGNAL {(95 + Math.sin(elapsed) * 4).toFixed(2)}%</div>
        </div>
      </div>

      <style jsx>{`
        .nerv-hud {
          position: absolute;
          inset: 0;
          pointer-events: none;
          font-family: "JetBrains Mono", "IBM Plex Mono", "Courier New", monospace;
          color: var(--accent);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ---- Corner brackets ---- */
        .nerv-corner {
          position: absolute;
          width: 32px;
          height: 32px;
          border-color: var(--accent);
          border-style: solid;
          border-width: 0;
        }
        .nerv-corner-tl {
          top: 24px;
          left: 24px;
          border-top-width: 2px;
          border-left-width: 2px;
        }
        .nerv-corner-tr {
          top: 24px;
          right: 24px;
          border-top-width: 2px;
          border-right-width: 2px;
        }
        .nerv-corner-bl {
          bottom: 24px;
          left: 24px;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }
        .nerv-corner-br {
          bottom: 24px;
          right: 24px;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        /* ---- Top-right subject block ---- */
        .nerv-subject-block {
          position: absolute;
          top: 36px;
          right: 56px;
          text-align: right;
          line-height: 1.5;
        }
        .nerv-code-row {
          font-size: 10px;
          opacity: 0.85;
          margin-bottom: 6px;
        }
        .nerv-plusminus {
          opacity: 0.6;
        }
        .nerv-timer {
          font-variant-numeric: tabular-nums;
        }
        .nerv-serial {
          opacity: 0.6;
          margin-left: 4px;
        }
        .nerv-code-box {
          display: inline-block;
          padding: 4px 10px;
          border: 1.5px solid var(--accent);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
        }
        .nerv-subject {
          font-size: 10px;
          opacity: 0.7;
        }
        .nerv-subject-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /* ---- Top-left mode block ---- */
        .nerv-mode-block {
          position: absolute;
          top: 36px;
          left: 56px;
          line-height: 1.5;
        }
        .nerv-mode-label {
          font-size: 9px;
          opacity: 0.6;
        }
        .nerv-mode-value {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }
        .nerv-mode-status {
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.85;
        }
        .nerv-pulse {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }

        /* ---- Bottom ruler ---- */
        .nerv-ruler {
          position: absolute;
          bottom: 32px;
          left: 60px;
          right: 60px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
        }
        .nerv-ruler-tick {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          opacity: 0.7;
        }
        .nerv-ruler-mark {
          opacity: 0.5;
        }

        /* ---- Left ladder ---- */
        .nerv-ladder {
          position: absolute;
          top: 80px;
          bottom: 80px;
          left: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .nerv-ladder-tick {
          width: 12px;
          height: 1px;
          background: var(--accent);
        }

        /* ---- Bottom-right readout ---- */
        .nerv-data-readout {
          position: absolute;
          bottom: 60px;
          right: 56px;
          font-size: 10px;
          text-align: right;
          line-height: 1.6;
          opacity: 0.75;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </>
  );
}
