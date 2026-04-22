/**
 * TOPOGRAPHIC SHADER
 * ------------------
 * Renders a mesh as a series of parallel lines along the world-X axis,
 * with intensity that follows the height and a soft emissive glow.
 *
 * Visual reference: Evangelion EVA-01 scan screens (Image 2 inspiration).
 *
 * How it works:
 *   - We sample the world-space X coordinate in the fragment shader.
 *   - We take `mod(worldX, uLineSpacing)` to get a sawtooth pattern.
 *   - We use `fwidth()` to keep line thickness constant in screen space
 *     regardless of the surface's angle to the camera (crucial for
 *     preventing moiré on steep slopes).
 *   - The base surface is kept very dim (but not black) so the silhouette
 *     of the model still reads even between lines.
 */

export const topographicVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vHeight;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vHeight = worldPos.y;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const topographicFragmentShader = /* glsl */ `
  uniform vec3 uAccentColor;
  uniform float uLineSpacing;
  uniform float uLineWidth;
  uniform float uTime;
  uniform float uMinHeight;
  uniform float uMaxHeight;
  uniform float uBaseIntensity;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vHeight;

  // Anti-aliased line along world-X using screen-space derivatives.
  float parallelLine(float coord, float spacing, float width) {
    float m = mod(coord, spacing);
    float d = min(m, spacing - m);
    float aa = fwidth(coord) * width;
    return 1.0 - smoothstep(0.0, aa, d);
  }

  void main() {
    // --- CONTOUR LINES ---
    // Lignes de niveau (isolignes) : on trace une ligne à chaque
    // multiple de uLineSpacing sur l'axe Y monde. Ça donne les
    // rings horizontaux qui entourent le relief comme sur une carte
    // topographique papier.
    float minorLine = parallelLine(vWorldPosition.y, uLineSpacing, uLineWidth);

    // Lignes majeures toutes les 5 lignes mineures (courbes maîtresses).
    float majorLine = parallelLine(vWorldPosition.y, uLineSpacing * 5.0, uLineWidth * 1.6);

    // --- HAUTEUR NORMALISÉE ---
    float heightFactor = clamp(
      (vHeight - uMinHeight) / max(uMaxHeight - uMinHeight, 0.0001),
      0.0,
      1.0
    );

    // --- SURFACE DE BASE (opaque, pas noire) ---
    // Teinte sombre dépendant de l'orientation de la face vers la caméra,
    // pour que la silhouette se lise sans ré-introduire d'éclairage réaliste.
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float facing = clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0);
    float baseShade = uBaseIntensity + facing * 0.06;
    vec3 baseColor = uAccentColor * baseShade * (0.35 + heightFactor * 0.65);

    // --- SCAN SWEEP ---
    // Bande lumineuse qui monte lentement à travers le relief.
    float scanPos = fract(uTime * 0.15);
    float scanDist = abs(heightFactor - scanPos);
    float scanSweep = exp(-scanDist * 40.0) * 0.8;

    // --- ASSEMBLAGE DES LIGNES ---
    // Courbes mineures discrètes, courbes maîtresses éclatantes,
    // boost supplémentaire quand le scan les traverse.
    float heightBoost = mix(0.7, 1.3, heightFactor);
    vec3 minorColor = uAccentColor * minorLine * 0.55 * heightBoost;
    vec3 majorColor = uAccentColor * majorLine * 1.8 * heightBoost;
    vec3 scanColor  = uAccentColor * scanSweep;

    // --- RIM ---
    float rim = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);
    vec3 rimColor = uAccentColor * rim * 0.25;

    vec3 finalColor = baseColor + minorColor + majorColor + scanColor + rimColor;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
