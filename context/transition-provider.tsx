"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HexState } from "@/components/nerv-hexagone"; // Ton type existant !

// Les types de transitions possibles
export type TransitionType = "boot" | "nav";
export type Point = { x: number; y: number };

export type NavPhase = "closed" | "display" | "hide";
const NAV_HIDE_DURATION_MS = 320;

// L'interface de notre contexte
interface TransitionContextType {
  isTransitioning: boolean;
  animationPhase: HexState;
  mode: TransitionType;
  origin: Point | null;
  isNavOpen: boolean;
  navPhase: NavPhase;
  triggerTransition: (type: TransitionType, route: string, origin?: Point) => void;
  setIsNavOpen: (isOpen: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const navHideTimeoutRef = useRef<number | null>(null);
  // --- ÉTATS GLOBAUX ---
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<HexState>("hidden");
  const [mode, setMode] = useState<TransitionType>("boot");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navPhase, setNavPhase] = useState<NavPhase>("closed");

  const clearNavHideTimeout = useCallback(() => {
    if (navHideTimeoutRef.current !== null) {
      window.clearTimeout(navHideTimeoutRef.current);
      navHideTimeoutRef.current = null;
    }
  }, []);

  const openNav = useCallback(() => {
    clearNavHideTimeout();
    setIsNavOpen(true);
    requestAnimationFrame(() => {
      setNavPhase("display");
    });
  }, [clearNavHideTimeout]);

  const closeNavWithAnimation = useCallback(() => {
    if (!isNavOpen && navPhase === "closed") return;

    clearNavHideTimeout();
    setNavPhase("hide");
    navHideTimeoutRef.current = window.setTimeout(() => {
      setNavPhase("closed");
      setIsNavOpen(false);
      navHideTimeoutRef.current = null;
    }, NAV_HIDE_DURATION_MS);
  }, [clearNavHideTimeout, isNavOpen, navPhase]);

  // --- MOTEUR D'ORCHESTRATION ---
  const triggerTransition = useCallback((type: TransitionType, targetRoute: string, clickOrigin?: Point) => {
    // Sécurité : ne pas relancer une transition si une est déjà en cours
    if (isTransitioning) return;

    // Prefetch la route cible immédiatement pour que router.push soit quasi-instantané
    // (évite le pic CPU de chargement RSC pendant que l'anim tourne)
    try { router.prefetch(targetRoute); } catch {}

    clearNavHideTimeout();
    setIsTransitioning(true);
    setMode(type);
    setOrigin(clickOrigin || null);
    setIsNavOpen(false); // On ferme le menu de navigation s'il était ouvert
    setNavPhase("closed");
    // Phase 1 : reset puis apparition des contours rouges (propagation de l'onde)
    setAnimationPhase("hidden");
    requestAnimationFrame(() => {
      setAnimationPhase("outline");
    });

    // Phase 2 : Remplissage rouge pour opacifier l'écran
    setTimeout(() => {
      setAnimationPhase("filled");
    }, 1000); // 400ms après le début

    // Phase 3 : On change la page "sous" le rouge (l'écran est tout rouge à ce moment là)
    setTimeout(() => {
      React.startTransition(() => {
        router.push(targetRoute);
      });
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
  }, [clearNavHideTimeout, isTransitioning, router]);

  // --- INTERCEPTION DE LA TOUCHE TAB ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // On empêche la touche TAB de faire son comportement par défaut (changer le focus)
      if (e.key === "Tab") {
        console.log("Touche TAB pressée");
        console.log(pathname);
        e.preventDefault();
        
        //si on est sur page acceuil, pas prendre en compte la touche tab.
        if (pathname === "/"){
          return;
        }

        // peut ouvrir menu nav seulement si pas sur page acceuil et pas en transition
        if (!isTransitioning && pathname !== "/") {
          if (navPhase === "display") {
            closeNavWithAnimation();
          } else {
            openNav();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeNavWithAnimation, isTransitioning, navPhase, openNav, pathname]);

  useEffect(() => {
    return () => {
      clearNavHideTimeout();
    };
  }, [clearNavHideTimeout]);

  return (
    <TransitionContext.Provider value={{
      isTransitioning, animationPhase, mode, origin, isNavOpen, navPhase, triggerTransition, setIsNavOpen
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
