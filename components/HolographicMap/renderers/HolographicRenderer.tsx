"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  holographicVertexShader,
  holographicFragmentShader,
} from "./../shaders/holographic";

interface HolographicRendererProps {
  /** The loaded glTF scene — will be traversed and re-materialized */
  scene: THREE.Group;
  accentColor: string;
  secondaryColor: string;
}

/**
 * Renders the scene as a flickering wireframe hologram.
 *
 * Strategy: for each mesh in the loaded scene we generate a matching
 * LineSegments object using EdgesGeometry. This gives clean edges
 * (only hard feature edges, no triangle diagonals) which reads much
 * better for architectural models than a naive `wireframe: true` flag.
 *
 * A faint ghost copy of the solid mesh is also rendered behind the
 * lines at very low opacity to give volumetric presence.
 */
export function HolographicRenderer({
  scene,
  accentColor,
  secondaryColor,
}: HolographicRendererProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  const { lineMaterial, ghostMaterial, processedScene } = useMemo(() => {
    const root = new THREE.Group();

    // 1. Shared material for the edge lines — the main visual.
    const lineMat = new THREE.ShaderMaterial({
      vertexShader: holographicVertexShader,
      fragmentShader: holographicFragmentShader,
      uniforms: {
        uAccentColor: { value: new THREE.Color(accentColor) },
        uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uOpacity: { value: 0.4 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // 2. Faint volumetric ghost — keeps silhouette readable.
    const ghostMat = new THREE.ShaderMaterial({
      vertexShader: holographicVertexShader,
      fragmentShader: holographicFragmentShader,
      uniforms: {
        uAccentColor: { value: new THREE.Color(accentColor) },
        uSecondaryColor: { value: new THREE.Color(secondaryColor) },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uOpacity: { value: 0.03 },
      },
      transparent: true,
      depthWrite: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    // Walk the source scene and, for each mesh, add:
    //   - a LineSegments (hard edges) using the line material,
    //   - a faint back-face mesh using the ghost material.
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Hard feature edges (15° threshold skips coplanar triangle diagonals).
        const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
        const lines = new THREE.LineSegments(edges, lineMat);
        lines.applyMatrix4(mesh.matrixWorld);
        root.add(lines);

        // Faint back-face ghost for volumetric hint.
        const ghost = new THREE.Mesh(mesh.geometry, ghostMat);
        ghost.applyMatrix4(mesh.matrixWorld);
        root.add(ghost);
      }
    });

    return {
      lineMaterial: lineMat,
      ghostMaterial: ghostMat,
      processedScene: root,
    };
  }, [scene, accentColor, secondaryColor, size.width, size.height]);

  // Keep uniforms synced with time and viewport size.
  useFrame((state) => {
    lineMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    ghostMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    lineMaterial.uniforms.uResolution.value.set(size.width, size.height);
    ghostMaterial.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <group ref={groupRef}>
      <primitive object={processedScene} />
    </group>
  );
}
