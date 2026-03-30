# Feature: Système de Transitions Hexagonales Personnalisées

Ce document détaille l'architecture et le plan d'implémentation pour un système de transitions de page personnalisé, inspiré de l'interface N.E.R.V.

## 1. Objectif

Créer deux types de transitions animées basées sur une grille d'hexagones :

### A. Transition d'Initialisation ("Boot")
- **Déclencheur** : Connexion réussie sur la page `/`.
- **Destination** : Page `/dashboard`.
- **Animation** : Une séquence cinématique plein écran :
  1.  Un hexagone central apparaît (bords rouges, fond noir).
  2.  Propagation d'hexagones similaires (en `outline`) du centre vers l'extérieur.
  3.  Remplissage en rouge des hexagones, en partant du centre.
  4.  Fondu enchaîné (`fade-out`) des hexagones, en partant du centre, pour révéler la page `/dashboard` qui a été chargée en arrière-plan.

### B. Transition de Navigation Interne ("TAB Nav")
- **Déclencheur** : Appui sur la touche `Tab` sur les pages du `/dashboard`.
- **Animation** :
  1.  Un overlay semi-transparent apparaît avec une grille d'hexagones au centre. Chaque hexagone contient le nom d'une sous-page (ex: "TERMINAL", "ANKI").
  2.  Au clic sur un hexagone :
      a. Une onde de propagation (similaire à la transition "Boot", mais plus rapide) part de l'hexagone cliqué.
      b. La page change vers la destination demandée.

L'objectif principal est de **réutiliser le même "moteur" d'animation hexagonal** pour ces deux cas d'usage.

---

## 2. Architecture Proposée

Pour éviter la duplication de code et assurer une intégration fluide, le système doit être centralisé et non dispersé dans les composants de page.

### Composant 1 : Le `TransitionProvider` (Contexte Global)
- **Fichier** : `context/transition-provider.tsx` (à créer).
- **Rôle** :
  - Maintenir l'état global des transitions (`isTransitioning`, `animationPhase`, `targetRoute`).
  - Exposer une fonction `triggerTransition(type, route, origin)`.
  - Gérer la logique de séquençage des animations via des `setTimeout`.
  - Gérer l'écouteur d'événement pour la touche `Tab`.
- **Placement** : Doit enrober `{children}` dans le `app/layout.tsx` racine.

### Composant 2 : Le `GlobalHexOverlay` (Couche Visuelle)
- **Fichier** : `components/global-hex-overlay.tsx` (à créer).
- **Rôle** :
  - C'est le "moteur" visuel. Il ne connaît pas la logique métier.
  - Il s'abonne au `TransitionContext` pour savoir quand et comment s'afficher.
  - Il reçoit des `props` pour contrôler l'animation :
    - `status: 'hidden' | 'outline' | 'fill' | 'fade'`
    - `origin: { x: number, y: number }` (coordonnées du point de départ de l'onde)
    - `mode: 'boot' | 'nav'` (pour afficher ou non le texte dans les hexagones).
- **Placement** : Doit être rendu dans `app/layout.tsx`, au-dessus de `{children}`, avec un `z-index` élevé et `position: fixed`.

### Composant 3 : Le `NervHexagon` (Atome)
- **Fichier** : `components/nerv-hexagone.tsx` (existant).
- **Rôle** : Reste un composant de rendu pur qui dessine un seul hexagone. Son apparence (couleur, opacité) est contrôlée par les `props` passées par `GlobalHexOverlay`.

---

## 3. Logique de Propagation (Le Cœur du Système)

La propagation du centre vers l'extérieur est la clé de la réutilisabilité.

1.  **Calcul de la distance** : Pour chaque hexagone de la grille, on calcule sa distance euclidienne par rapport au point d'origine de l'animation (`origin`).
    ```javascript
    // Dans GlobalHexOverlay
    const distance = Math.sqrt((hex.x - origin.x) ** 2 + (hex.y - origin.y) ** 2);
    ```
2.  **Délai d'animation CSS** : Cette distance est utilisée pour calculer un `animation-delay` (ou `transition-delay`) pour chaque hexagone.
    ```javascript
    const delay = distance * C; // C est un coefficient de vitesse
    ```
3.  **Déclenchement par classe** : Le `TransitionProvider` change l'état global (ex: de `outline` à `fill`). Le `GlobalHexOverlay` reçoit ce nouvel état et applique une classe CSS à tous les hexagones. Grâce au `delay` individuel, l'animation se propage naturellement en onde.

---

## 4. Plan d'Implémentation

1.  **Supprimer la transition actuelle** : Retirer le fichier `app/(protected)/dashboard/template.tsx` pour éviter les conflits.

2.  **Créer le `TransitionProvider`** :
    - Mettre en place le Contexte React avec les états de base (`isTransitioning`, etc.).
    - L'intégrer dans `app/layout.tsx`.

3.  **Créer le `GlobalHexOverlay`** :
    - Placer ce composant dans `app/layout.tsx`.
    - Adapter la logique de grille existante de `app/page.tsx` pour la rendre générique et contrôlable par `props`.
    - Implémenter la logique de délai basé sur la distance.

4.  **Implémenter la fonction `triggerTransition`** :
    - Dans le `TransitionProvider`, créer la fonction qui orchestre les `setTimeout` pour les différentes phases de l'animation (`outline`, `fill`, `fade`).
    - C'est cette fonction qui appellera `router.push(targetRoute)` au bon moment (pendant la phase `fill`, quand l'écran est opaque).

5.  **Connecter les Déclencheurs** :
    - **Login** : Dans `LoginForm`, au lieu de `router.push('/dashboard')`, appeler `triggerTransition('boot', '/dashboard')`.
    - **Navigation TAB** :
        - Dans le `TransitionProvider`, ajouter un `useEffect` pour écouter l'appui sur `Tab`.
        - Au clic sur un hexagone de navigation, appeler `triggerTransition('nav', '/la-page-cible', { x: clicX, y: clicY })`.

6.  **Nettoyage** :
    - Extraire la logique de la grille hexagonale de `app/page.tsx` (le `HexGrid` actuel) pour la fusionner dans le `GlobalHexOverlay`. La page de login n'appellera plus que `handleMouseMove` sur le `ref` de l'overlay.

---

## 5. Comment Réutiliser le Code

Le même composant `GlobalHexOverlay` est utilisé pour les deux transitions. La seule chose qui change est la manière dont on l'appelle via le `TransitionProvider` :

- **Pour le "Boot"** : `triggerTransition('boot', '/dashboard')`. L'overlay utilisera une origine par défaut (le centre de l'écran) et jouera la séquence cinématique complète.

- **Pour la "Navigation"** : `triggerTransition('nav', '/terminal', { x: 123, y: 456 })`. L'overlay utilisera les coordonnées du clic comme origine de l'onde et jouera une séquence plus rapide.

Cette architecture centralisée garantit que toute modification ou amélioration du "moteur hexagonal" profitera aux deux types de transition.