"use client";

import { Scene } from "./Scene";
import { HudFrame } from "./HudFrame";
import { HolographicMapProps } from "./types";

/**
 * Top-level client component. Composes the R3F Canvas (with shader-based
 * terrain + post-processing) and the CSS HUD overlay.
 *
 * Usage:
 *   import { HolographicMap } from "@/components/HolographicMap";
 *
 *   // Natural terrain — parallel topographic lines
 *   <HolographicMap
 *     modelUrl="/models/fuji.glb"
 *     mode="topographic"
 *     subject="MT. FUJI"
 *     code="GEO-01"
 *     modelScale={0.5}
 *     lineSpacing={1.5}
 *   />
 *
 *   // Urban / dense structure — wireframe hologram
 *   <HolographicMap
 *     modelUrl="/models/tokyo-tower.glb"
 *     mode="holographic"
 *     subject="TOKYO TOWER"
 *     code="URB-07"
 *     modelScale={0.2}
 *   />
 */
export function HolographicMap({
  modelUrl,
  mode,
  subject = "UNKNOWN",
  code = "---",
  modelScale = 1,
  autoRotateSpeed = 0.002,
  lineSpacing = 0.4,
  accentColor = "#ff6a00",
  secondaryColor = "#ff2d55",
  height = "45vh",
}: HolographicMapProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <Scene
        modelUrl={modelUrl}
        mode={mode}
        modelScale={modelScale}
        autoRotateSpeed={autoRotateSpeed}
        lineSpacing={lineSpacing}
        accentColor={accentColor}
        secondaryColor={secondaryColor}
      />
      <HudFrame
        subject={subject}
        code={code}
        mode={mode}
        accentColor={accentColor}
      />
    </div>
  );
}
