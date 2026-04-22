"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTransitionContext } from "@/context/transition-provider";
import { useContainerSize } from "@/hooks/use-container-size";
import { NervHexagon } from "@/components/nerv-hexagone";
import { DASHBOARD_NAV_LINKS } from "@/lib/navLinks";
import Image from "next/image";

type Cell = {
  key: string;
  left: number;
  top: number;
  delay: number;
  col: number;
  row: number;
};

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(items: T[], random: () => number) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function getNeighborCoords(col: number, row: number): Array<[number, number]> {
  if (col % 2 === 0) {
    return [
      [col - 1, row - 1],
      [col, row - 1],
      [col + 1, row - 1],
      [col - 1, row],
      [col + 1, row],
      [col, row + 1],
    ];
  }

  return [
    [col - 1, row],
    [col, row - 1],
    [col + 1, row],
    [col - 1, row + 1],
    [col + 1, row + 1],
    [col, row + 1],
  ];
}

export function GlobalHexOverlay() {
  const { animationPhase, isNavOpen, navPhase, origin, triggerTransition, isTransitioning } = useTransitionContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const [displaySeed, setDisplaySeed] = useState(1);
  const previousNavPhaseRef = useRef(navPhase);

  // On ne monte les hexagones QUE lorsqu'ils sont nécessaires
  // (transition en cours OU menu nav ouvert). Sinon, 1250+ SVG inutiles dans le DOM.
  const shouldRenderCells = isTransitioning || isNavOpen;

  useEffect(() => {
    if (navPhase === "display" && previousNavPhaseRef.current !== "display") {
      setDisplaySeed(Math.floor(Math.random() * 0x7fffffff));
    }
    previousNavPhaseRef.current = navPhase;
  }, [navPhase]);

  // --- Logique de la grille (adaptée de app/page.tsx) ---
  const size = 50;
  const colStep = size * 0.76;
  const rowStep = size * 0.92;

  const cells = useMemo(() => {
    // On attend d'avoir les dimensions pour calculer la grille
    if (width === 0 || height === 0) return [];
    // Skip le calcul si rien à afficher
    if (!shouldRenderCells) return [];

    const cols = Math.ceil(width / colStep) + 2;
    const rows = Math.ceil(height / rowStep) + 2;

    // Déterminer le point d'origine de l'onde de propagation
    const originPoint = origin
      ? { x: origin.x, y: origin.y } // Origine du clic pour la nav
      : { x: width / 2, y: height / 2 }; // Centre de l'écran pour le boot

    const cellData: Cell[] = [];
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

        cellData.push({ key: `${col}-${row}`, left, top, delay, col, row });
      }
    }
    return cellData;
  }, [width, height, colStep, rowStep, origin, shouldRenderCells]);

  const displayCells = useMemo(() => {
    if (navPhase !== "display") return cells;
    if (cells.length === 0) return [];

    const targetCount = Math.min(DASHBOARD_NAV_LINKS.length, cells.length);
    if (targetCount === 0) return [];

    const centerX = width / 2;
    const centerY = height / 2;

    let centerCell = cells[0];
    let minDistance = Number.POSITIVE_INFINITY;

    for (const cell of cells) {
      const dx = cell.left - centerX;
      const dy = cell.top - centerY;
      const distance = dx * dx + dy * dy;
      if (distance < minDistance) {
        minDistance = distance;
        centerCell = cell;
      }
    }

    const byCoords = new Map<string, Cell>();
    for (const cell of cells) {
      byCoords.set(`${cell.col}:${cell.row}`, cell);
    }

    const random = mulberry32(displaySeed);
    const selected: Cell[] = [];
    const visited = new Set<string>([centerCell.key]);
    let frontier: Cell[] = [centerCell];

    while (frontier.length > 0 && selected.length < targetCount) {
      const ring = [...frontier];
      frontier = [];
      shuffleInPlace(ring, random);

      for (const cell of ring) {
        if (selected.length >= targetCount) break;
        selected.push(cell);
      }

      for (const cell of ring) {
        const neighbors: Cell[] = [];
        for (const [neighborCol, neighborRow] of getNeighborCoords(cell.col, cell.row)) {
          const neighbor = byCoords.get(`${neighborCol}:${neighborRow}`);
          if (!neighbor || visited.has(neighbor.key)) continue;

          visited.add(neighbor.key);
          neighbors.push(neighbor);
        }

        shuffleInPlace(neighbors, random);
        frontier.push(...neighbors);
      }
    }

    return selected;
  }, [cells, navPhase, width, height, displaySeed]);

  const isNavDisplayOpen = isNavOpen && navPhase === "display";
  const navEntryStaggerMs = 30;

  const navCellIndices = useMemo(() => {
    if (!isNavDisplayOpen) return new Map<string, number>();

    const indices = new Map<string, number>();
    for (let index = 0; index < displayCells.length; index++) {
      indices.set(displayCells[index].key, index);
    }

    return indices;
  }, [displayCells, isNavDisplayOpen]);

  return (
    <>
      <style jsx global>{`
        @keyframes hex-holo-enter {
          0% {
            opacity: 0;
            transform: translateY(6px) scale(0.82);
            filter: brightness(1.8) saturate(1.6) blur(1px);
          }
          35% {
            opacity: 1;
            transform: translateY(0) scale(1.04);
            filter: brightness(1.45) saturate(1.4) drop-shadow(0 0 14px rgba(108, 255, 232, 0.55));
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: brightness(1) saturate(1);
          }
        }

        .hex-holo-enter {
          animation-name: hex-holo-enter;
          animation-duration: 460ms;
          animation-timing-function: cubic-bezier(0.2, 0.85, 0.2, 1);
          animation-fill-mode: both;
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed inset-0 z-50 overflow-hidden"
        style={{
          pointerEvents: isNavOpen ? "auto" : "none",
          // Isole le layer de compositing et limite la zone de paint
          contain: "strict",
          willChange: shouldRenderCells ? "contents" : "auto",
          // Filtre global : remplace 2500+ drop-shadow individuels par UN SEUL
          filter:
            shouldRenderCells && (animationPhase === "outline" || animationPhase === "filled")
              ? "drop-shadow(0 0 4px #ff1a1a)"
              : undefined,
        }}
      >
        {cells.map(({ key, left, top, delay }) => {
          const navIndex = navCellIndices.get(key);
          const navItem = navIndex !== undefined ? DASHBOARD_NAV_LINKS[navIndex] : undefined;
          const isDisplayCell = navIndex !== undefined;
          const canNavigate = Boolean(navItem?.enabled && navItem.href && navItem.href !== "#");
          const status = isNavDisplayOpen
            ? isDisplayCell
              ? "outline"
              : "hidden"
            : animationPhase;

          return (
            <div
              key={key}
              className={`absolute group ${isNavDisplayOpen && isDisplayCell ? "hex-holo-enter" : ""} ${canNavigate ? "cursor-pointer" : ""}`}
              style={{
                left,
                top,
                animationDelay:
                  isNavDisplayOpen && navIndex !== undefined ? `${navIndex * navEntryStaggerMs}ms` : undefined,
              }}
              onClick={
                canNavigate && navItem
                  ? (e) =>
                      triggerTransition("nav", navItem.href, {
                        x: e.clientX,
                        y: e.clientY,
                      })
                  : undefined
              }
            >
              <NervHexagon
                size={size}
                status={status}
                delay={delay}
                darkFill={isNavDisplayOpen && isDisplayCell}
              />

              {navItem ? (
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={navItem.icon}
                    alt={navItem.label}
                    width={20}
                    height={20}
                    className="opacity-95 [filter:brightness(0)_invert(1)_drop-shadow(0_0_6px_rgba(255,80,80,0.45))]"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
