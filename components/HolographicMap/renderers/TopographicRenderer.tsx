"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { topographicVertexShader, topographicFragmentShader } from "./../shaders/topographic";

interface TopographicRendererProps {
  /** The loaded glTF scene — will be traversed and re-materialized */
  scene: THREE.Group;
  accentColor: string;
  lineSpacing: number;
  /** Post-transform (world-space) Y bounds — required for correct
   *  height tinting since the shader reads `vWorldPosition.y`. */
  worldMinY: number;
  worldMaxY: number;
}

/**
 * Applies the topographic (parallel lines) shader to every mesh in
 * the loaded glTF scene. Height bounds are provided by the parent
 * (TerrainModel) since it knows the final center/scale applied above
 * this component.
 */
export function TopographicRenderer({
  scene,
  accentColor,
  lineSpacing,
  worldMinY,
  worldMaxY,
}: TopographicRendererProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Build a single shared ShaderMaterial to avoid re-compiling per-mesh.
  const { material, processedScene } = useMemo(() => {
    const clone = scene.clone(true);

    const mat = new THREE.ShaderMaterial({
      vertexShader: topographicVertexShader,
      fragmentShader: topographicFragmentShader,
      uniforms: {
        uAccentColor: { value: new THREE.Color(accentColor) },
        uLineSpacing: { value: lineSpacing },
        uLineWidth: { value: 1.5 },
        uTime: { value: 0 },
        uMinHeight: { value: worldMinY },
        uMaxHeight: { value: worldMaxY },
        uBaseIntensity: { value: 0.08 },
      },
      // FrontSide + depth-write standard pour que le mesh soit opaque :
      // on ne veut pas voir les lignes de l'autre côté à travers le relief.
      side: THREE.FrontSide,
      transparent: false,
      depthWrite: true,
      depthTest: true,
    });

    // Replace every material in the cloned scene.
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = mat;
        // Disable frustum culling quirks on flat plates.
        mesh.frustumCulled = true;
      }
    });

    return { material: mat, processedScene: clone };
    // worldMinY/worldMaxY updates are handled by the effect below so we
    // don't rebuild the material (and lose its compiled shader) on resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, accentColor, lineSpacing]);

  // Keep height bounds uniforms in sync if the parent recomputes them.
  useEffect(() => {
    material.uniforms.uMinHeight.value = worldMinY;
    material.uniforms.uMaxHeight.value = worldMaxY;
  }, [material, worldMinY, worldMaxY]);

  // Animate time uniform for the scan sweep.
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={groupRef}>
      <primitive object={processedScene} />
    </group>
  );
}
