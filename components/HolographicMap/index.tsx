"use client";

import dynamic from "next/dynamic";
import type { HolographicMapProps } from "./types";

/**
 * PUBLIC ENTRY POINT.
 *
 * The actual component is wrapped in a `next/dynamic` import with
 * `ssr: false` because:
 *
 *   1. three.js / R3F rely on WebGL and `window`, which don't exist
 *      during server rendering.
 *   2. The glTF loader accesses Blob / URL APIs that are browser-only.
 *   3. Bundling three.js in the server chunk is wasteful — it can
 *      easily add 600kB+ of dead weight.
 *
 * With `ssr: false`, the whole R3F tree is code-split into a separate
 * client chunk that only loads when the component mounts.
 */
const HolographicMapDynamic = dynamic<HolographicMapProps>(
  () => import("./HolographicMap").then((m) => m.HolographicMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          color: "#ff6a00",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          fontSize: "12px",
          letterSpacing: "0.2em",
        }}
      >
        INITIALIZING SCAN...
      </div>
    ),
  }
);

export { HolographicMapDynamic as HolographicMap };
export type { HolographicMapProps, RenderMode } from "./types";
