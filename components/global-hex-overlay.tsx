"use client";

import React, { useMemo, useRef } from "react";
import { useTransitionContext } from "@/context/transition-provider";
import { useContainerSize } from "@/hooks/use-container-size";
import { NervHexagon } from "@/components/nerv-hexagone";

export function GlobalHexOverlay() {
  const { animationPhase, isNavOpen, origin } = useTransitionContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);

  // --- Logique de la grille (adaptée de app/page.tsx) ---
  const size = 50;
  const colStep = size * 0.76;
  const rowStep = size * 0.92;

  const cells = useMemo(() => {
    // On attend d'avoir les dimensions pour calculer la grille
    if (width === 0 || height === 0) return [];

    const cols = Math.ceil(width / colStep) + 2;
    const rows = Math.ceil(height / rowStep) + 2;

    // Déterminer le point d'origine de l'onde de propagation
    const originPoint = origin
      ? { x: origin.x, y: origin.y } // Origine du clic pour la nav
      : { x: width / 2, y: height / 2 }; // Centre de l'écran pour le boot

    const cellData: { key: string; left: number; top: number; delay: number }[] = [];
    for (let col = 0; col < cols; col++) {
      const offset = col % 2 === 1 ? rowStep / 2 : 0;
      for (let row = 0; row < rows; row++) {
        const left = col * colStep;
        const top = row * rowStep + offset;

        // --- CŒUR DE LA PROPAGATION ---
        // 1. Calcul de la distance euclidienne par rapport à l'origine
        const dx = left - originPoint.x;
        const dy = top - originPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. Conversion de la distance en délai (en ms)
        const delay = distance * 0.7; // Coefficient de vitesse de l'onde

        cellData.push({ key: `${col}-${row}`, left, top, delay });
      }
    }
    return cellData;
  }, [width, height, colStep, rowStep, origin]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        pointerEvents: isNavOpen ? "auto" : "none",
      }}
    >
      {cells.map(({ key, left, top, delay }) => (
        <div key={key} className="absolute" style={{ left, top }}>
          <NervHexagon size={size} status={animationPhase} delay={delay} />
        </div>
      ))}
    </div>
  );
}
