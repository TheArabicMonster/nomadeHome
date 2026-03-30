"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HexState } from "@/components/nerv-hexagone"; // Ton type existant !

// Les types de transitions possibles
export type TransitionType = "boot" | "nav";
export type Point = { x: number; y: number };

// L'interface de notre contexte
interface TransitionContextType {
  isTransitioning: boolean;
  animationPhase: HexState;
  mode: TransitionType;
  origin: Point | null;
  isNavOpen: boolean;
  triggerTransition: (type: TransitionType, route: string, origin?: Point) => void;
  setIsNavOpen: (isOpen: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // --- ÉTATS GLOBAUX ---
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<HexState>("hidden");
  const [mode, setMode] = useState<TransitionType>("boot");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // --- MOTEUR D'ORCHESTRATION ---
  const triggerTransition = useCallback((type: TransitionType, targetRoute: string, clickOrigin?: Point) => {
    // Sécurité : ne pas relancer une transition si une est déjà en cours
    if (isTransitioning) return;

    setIsTransitioning(true);
    setMode(type);
    setOrigin(clickOrigin || null);
    setIsNavOpen(false); // On ferme le menu de navigation s'il était ouvert

    // Phase 1 : Apparition des contours rouges (propagation de l'onde)
    setAnimationPhase("outline");

    // Phase 2 : Remplissage rouge pour opacifier l'écran
    setTimeout(() => {
      setAnimationPhase("filled");
    }, 1000); // 400ms après le début

    // Phase 3 : On change la page "sous" le rouge (l'écran est tout rouge à ce moment là)
    setTimeout(() => {
      router.push(targetRoute);
    }, 1600); // 800ms après le début

    // Phase 4 : Disparition des hexagones pour révéler la nouvelle page
    setTimeout(() => {
      setAnimationPhase("fading");
    }, 2400); // On laisse 100ms à React pour bien monter la nouvelle page

    // Phase 5 : Remise à zéro
    setTimeout(() => {
      setAnimationPhase("hidden");
      setIsTransitioning(false);
      setOrigin(null);
    }, 3200); // Fin totale
  }, [isTransitioning, router]);

  // --- INTERCEPTION DE LA TOUCHE TAB ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // On empêche la touche TAB de faire son comportement par défaut (changer le focus)
      if (e.key === "Tab") {
        console.log("Touche TAB pressée");
        e.preventDefault();
        // On ne peut ouvrir le menu que si on n'est pas déjà en pleine cinématique
        if (!isTransitioning) {
          setIsNavOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning]);

  return (
    <TransitionContext.Provider value={{
      isTransitioning, animationPhase, mode, origin, isNavOpen, triggerTransition, setIsNavOpen
    }}>
      {children}
    </TransitionContext.Provider>
  );
}

// Hook personnalisé pour utiliser ce contexte facilement n'importe où
export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransitionContext must be used within TransitionProvider");
  return context;
};
