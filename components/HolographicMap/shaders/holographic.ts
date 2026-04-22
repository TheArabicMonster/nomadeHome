/**
 * HOLOGRAPHIC SHADER
 * ------------------
 * Renders a mesh as a flickering wireframe with scanlines, depth fading,
 * and chromatic interference. Designed for architectural / urban models
 * where sharp vertical edges (buildings) read well as lines.
 *
 * Visual reference: Evangelion EVA subject readouts (Image 1 inspiration).
 *
 * IMPORTANT: this shader assumes the mesh is rendered with `wireframe: true`,
 * OR that the geometry has already been converted to line segments
 * (the renderer handles this — see HolographicRenderer.tsx).
 *
 * Alternative edges-only rendering uses barycentric coordinates to draw
 * only triangle edges without the long diagonal — giving a clean quad-like
 * wireframe even on triangulated meshes.
 */

export const holographicVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying vec3 vNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec4 viewPos = viewMatrix * worldPos;

    vWorldPosition = worldPos.xyz;
    vViewPosition = viewPos.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewPos;
  }
`;

export const holographicFragmentShader = /* glsl */ `
  uniform vec3 uAccentColor;
  uniform vec3 uSecondaryColor;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uOpacity;

  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying vec3 vNormal;

  // Pseudo-random for flicker.
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    // Depth-based alpha falloff — nearer geometry is brighter, creating
    // the sense of a volumetric hologram with thickness.
    float depth = length(vViewPosition);
    float depthFade = 1.0 - smoothstep(2.0, 40.0, depth);

    // Scanline pattern based on screen-Y — the iconic CRT readout look.
    float scanline = sin(gl_FragCoord.y * 0.8 + uTime * 2.0) * 0.5 + 0.5;
    scanline = mix(0.7, 1.0, scanline);

    // Horizontal interference band slowly drifting up through the image.
    float band = smoothstep(0.0, 0.02, abs(fract(uTime * 0.1 - gl_FragCoord.y / uResolution.y) - 0.5));
    float interference = 1.0 - band * 0.3;

    // Sub-frame flicker — subtle brightness jitter at ~10 Hz.
    float flickerSeed = floor(uTime * 10.0);
    float flicker = 0.85 + hash(flickerSeed) * 0.15;

    // Chromatic split: primary color on most lines, secondary on a
    // rotating subset for the interference layer.
    float colorMix = step(0.5, hash(floor(vWorldPosition.y * 3.0 + uTime * 0.3)));
    vec3 color = mix(uAccentColor, uSecondaryColor, colorMix * 0.35);

    float finalAlpha = depthFade * scanline * interference * flicker * uOpacity;

    gl_FragColor = vec4(color * (1.6 + scanline * 0.1), finalAlpha);
  }
`;
