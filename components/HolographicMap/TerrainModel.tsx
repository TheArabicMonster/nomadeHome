"use client";

import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RenderMode } from "./types";
import { TopographicRenderer } from "./renderers/TopographicRenderer";
import { HolographicRenderer } from "./renderers/HolographicRenderer";

interface TerrainModelProps { 
  modelUrl: string;          // URL du modèle 3D
  mode: RenderMode;          // Mode de rendu
  modelScale: number;        // Échelle du modèle
  autoRotateSpeed: number;   // Vitesse de rotation
  lineSpacing: number;       // Espacement des lignes
  accentColor: string;       // Couleur principale
  secondaryColor: string;    // Couleur secondaire
}

/**
 * COMPOSANT DE MODÈLE DE TERRAIN
 * ==============================
 * 
 * RÔLE GLOBAL :
 * -------------
 * Ce composant charge un modèle 3D (format glTF/GLB) et le rend avec le
 * renderer approprié selon le mode sélectionné.
 * 
 * RESPONSABILITÉS :
 * ----------------
 * 1. Chargement du modèle 3D depuis l'URL fournie
 * 2. Calcul automatique du centrage du modèle
 * 3. Gestion de la rotation automatique
 * 4. Dispatch vers le renderer approprié (topographic ou holographic)
 * 
 * CENTRAGE AUTOMATIQUE :
 * ---------------------
 * Les modèles exportés depuis des logiciels de photogrammétrie ont souvent
 * leur point d'origine (pivot) dans un coin plutôt qu'au centre du modèle.
 * Sans correction, le modèle tournerait autour de ce coin, créant un effet
 * de rotation étrange.
 * 
 * SOLUTION :
 * On calcule le centre géométrique du modèle (centre de la bounding box)
 * et on déplace le modèle pour que ce centre soit à l'origine (0, 0, 0).
 * Ainsi, le modèle tourne autour de son propre centre.
 * 
 * MISE À L'ÉCHELLE :
 * -----------------
 * Les modèles peuvent avoir des unités très différentes (mètres, centimètres,
 * unités arbitraires). La propriété `modelScale` permet d'ajuster la taille
 * pour que le modèle s'affiche à une taille raisonnable.
 * 
 * ROTATION AUTOMATIQUE :
 * ---------------------
 * Le modèle tourne lentement autour de l'axe Y (vertical) pour montrer
 * toutes les faces. La vitesse est contrôlée par `autoRotateSpeed`.
 */
export function TerrainModel({
  modelUrl,
  mode,
  modelScale,
  autoRotateSpeed,
  lineSpacing,
  accentColor,
  secondaryColor,
}: TerrainModelProps) {
  
  // CHARGEMENT DU MODÈLE 3D
  // =======================
  // useGLTF est un hook de @react-three/drei qui charge les modèles glTF/GLB.
  // Il gère le chargement asynchrone et retourne la scène Three.js.
  const { scene } = useGLTF(modelUrl);
  
  // RÉFÉRENCE AU GROUPE DE ROTATION
  // ================================
  // Cette référence permet d'accéder au groupe Three.js pour le manipuler.
  // On l'utilise pour appliquer la rotation automatique.
  const pivotRef = useRef<THREE.Group>(null);

  // ROTATION AUTOMATIQUE
  // ====================
  // useFrame est un hook de React Three Fiber qui s'exécute à chaque frame.
  // C'est l'équivalent d'une boucle d'animation en Three.js pur.
  useFrame(() => {
    if (pivotRef.current) {
      // Incrémente la rotation autour de l'axe Y
      // La valeur autoRotateSpeed est en radians par frame
      // 0.002 ≈ 0.11 degrés par frame ≈ 6.6 degrés par seconde à 60 FPS
      pivotRef.current.rotation.y += autoRotateSpeed;
    }
  });

  // CALCUL DU CENTRAGE + NORMALISATION AUTOMATIQUE DE LA TAILLE
  // ============================================================
  // Les .glb peuvent être exportés en unités très variées (mètres,
  // centimètres, unités arbitraires). Sans normalisation, un modèle
  // de montagne en mètres peut faire des milliers d'unités three.js,
  // ce qui place la caméra à l'intérieur du modèle -> on ne voit rien.
  //
  // On normalise donc automatiquement la plus grande dimension du
  // modèle à 6 unités, et `modelScale` devient un multiplicateur
  // par-dessus cette normalisation.
  const { centerOffset, autoFitScale, localMinY, localMaxY, localCenterY } = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(scene);
    const center = bbox.getCenter(new THREE.Vector3());
    const sizeVec = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
    const target = 6; // taille cible de la plus grande dimension
    const fit = maxDim > 0 ? target / maxDim : 1;
    return {
      centerOffset: center.clone().multiplyScalar(-1),
      autoFitScale: fit,
      localMinY: bbox.min.y,
      localMaxY: bbox.max.y,
      localCenterY: center.y,
    };
  }, [scene]);

  // Bornes Y post-transformation (centrage + scale) — ce que voit le shader
  // via `vWorldPosition.y`. Nécessaire pour que `heightFactor` couvre 0..1.
  const totalScale = autoFitScale * modelScale;
  const worldMinY = (localMinY - localCenterY) * totalScale;
  const worldMaxY = (localMaxY - localCenterY) * totalScale;

  // RENDU JSX
  // =========
  return (
    <group ref={pivotRef} scale={autoFitScale * modelScale}>
      <group position={centerOffset}>
        {mode === "topographic" ? (
          <TopographicRenderer
            scene={scene as THREE.Group}
            accentColor={accentColor}
            lineSpacing={lineSpacing}
            worldMinY={worldMinY}
            worldMaxY={worldMaxY}
          />
        ) : (
          <HolographicRenderer
            scene={scene as THREE.Group}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        )}
      </group>
    </group>
  );
}
