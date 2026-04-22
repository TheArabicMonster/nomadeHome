"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { TerrainModel } from "./TerrainModel";
import { HolographicMapProps } from "./types";

/**
 * The R3F Canvas wrapper. Sets up camera, background, lighting (minimal —
 * most light comes from emissive shaders), and the post-processing stack
 * that is ESSENTIAL for the holographic look:
 *
 *   Bloom    — makes emissive lines glow like real CRT phosphor
 *   Noise    — subtle grain, sells the "broadcast signal" feeling
 *   Vignette — darkens corners, focuses attention on the subject
 */
export function Scene({
  modelUrl,
  mode,
  modelScale = 1,
  autoRotateSpeed = 0.002,
  lineSpacing = 2,
  accentColor = "#ff6a00",
  secondaryColor = "#ff2d55",
}: Omit<HolographicMapProps, "subject" | "code" | "height">) {
  return (
    <Canvas
      camera={{
        position: [0, 3, 12],
        fov: 35,
        near: 0.1,
        far: 1000,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
    >
      {/* Pure black background, not a dark gray — the NERV aesthetic
          relies on maximum contrast with the glowing lines. */}
      <color attach="background" args={["#000000"]} />

      {/* Minimal fill light — shaders are mostly emissive, but this
          rescues any base-material fragments that might slip through. */}
      <ambientLight intensity={0.05} />

      <Suspense fallback={null}>
        <TerrainModel
          modelUrl={modelUrl}
          mode={mode}
          modelScale={modelScale}
          autoRotateSpeed={autoRotateSpeed}
          lineSpacing={lineSpacing}
          accentColor={accentColor}
          secondaryColor={secondaryColor}
        />
      </Suspense>

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={mode === "holographic" ? 0.57 : 1.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.7}
          mipmapBlur
        />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.15} />
        <Vignette eskil={false} offset={0.5} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  );
}
