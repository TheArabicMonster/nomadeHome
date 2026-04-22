/**
 * Rendering modes for the HolographicMap component.
 *
 * - `topographic`: parallel lines rendering, best for natural terrain
 *   with smooth elevation gradients (mountains, valleys, coastlines).
 *
 * - `holographic`: wireframe edges rendering with scanlines and flicker,
 *   best for urban / architectural models with sharp vertical discontinuities
 *   (buildings, towers, dense city blocks).
 */
export type RenderMode = "topographic" | "holographic";

export interface HolographicMapProps {
  /** Path to the .glb / .gltf model, relative to /public (e.g. "/models/fuji.glb") */
  modelUrl: string;
  /** Rendering mode — pick based on the terrain type */
  mode: RenderMode;
  /** Label displayed in the HUD (e.g. "MT. FUJI", "TOKYO TOWER") */
  subject?: string;
  /** Classification code shown in the HUD top-right (e.g. "EVA-01") */
  code?: string;
  /** Uniform scale applied to the model (tweak per asset) */
  modelScale?: number;
  /** Y-rotation speed, radians per frame (default: 0.002) */
  autoRotateSpeed?: number;
  /** Topographic mode only: world-space spacing between parallel lines */
  lineSpacing?: number;
  /** Primary accent color (hex). Default matches NERV orange */
  accentColor?: string;
  /** Optional secondary accent for the holographic mode's interference layer */
  secondaryColor?: string;
  /** Height of the container (CSS value). Default: "100vh" */
  height?: string;
}
