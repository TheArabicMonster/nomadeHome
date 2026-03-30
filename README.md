(*μ_μ)

# nomadeHome

Tableau de bord personnel pour VPS, inspiré de la D.A. du N.E.R.V. dans *Neon Genesis Evangelion*.
Accessible depuis le web, protégé par authentification JWT, regroupant tous les services du VPS dans une interface unifiée.

---

## Stack technique

| Couche | Outil |
|---|---|
| Frontend / Backend | Next.js 16 (App Router + API Routes) |
| UI | React 19, Tailwind CSS v4, @base-ui/react |
| Terminal web | xterm.js + WebSocket + node-pty |
| Auth | JWT (jose) + bcryptjs, cookies HTTP-only |
| Process manager | PM2 |
| Reverse proxy | Caddy (HTTPS automatique) |

---

## Fonctionnalités

### Authentification
- Page de login avec grille hexagonale animée (animation d'erreur sur accès refusé)
- Mot de passe unique haché en bcrypt, stocké dans `.env.local`
- JWT signé → cookie `nerv-session` (HTTP-only, 7 jours)
- Middleware Next.js protège toutes les routes `/dashboard/*`

### Dashboard — Status système
- Grille de 6 indicateurs de statut (MAGI-01/02/03, NETWORK, THREAT LEVEL, CORE ACCESS)
- Barres de progression : SYNC\_LINK, BUFFER\_LOAD, LATENCY
- Moniteur de ping VPS en temps réel

### Terminal
- Shell `/bin/bash` dans le navigateur via xterm.js
- Connexion WebSocket sécurisée par token JWT temporaire
- Redimensionnement dynamique du terminal (SIGWINCH)
- Serveur PTY standalone sur port configurable (`TERMINAL_PORT`, défaut 3002)

### Anki (Flashcards)
- Interface de gestion de decks de révision (style N.E.R.V.)
- Statistiques : cartes apprises, cartes à revoir, streak

### Uploads (Manga Feed)
- Drag-and-drop de fichiers manga/BD (CBZ, CBR, PDF, ZIP)
- Upload XHR avec barre de progression et journal de transfert
- Sélection de série, volume, tags

### Panel N.E.R.V. (Login)
- Horloge temps réel avec millisecondes
- Signaux bio-électriques style ECG des 3 pilotes (Rei, Shinji, Asuka)
- Taux de synchronisation simulés par pilote

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            NAVIGATEUR                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  /  — Login (app/page.tsx)                                   │  │
│  │  ┌───────────────────┐  ┌──────────────┐  ┌───────────────┐ │  │
│  │  │  NervPanel        │  │  HexGrid     │  │  LoginForm    │ │  │
│  │  │  (statuts, clock, │  │  (animation  │  │  (POST login) │ │  │
│  │  │   bio-signals)    │  │   hexagones) │  └───────────────┘ │  │
│  │  └───────────────────┘  └──────────────┘                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                          ↓ cookie nerv-session (JWT)                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  /dashboard — Layout (app/(protected)/dashboard/layout.tsx)  │  │
│  │  ┌─────────┐  ┌──────────────────────────────────────────┐  │  │
│  │  │ Sidebar │  │           Zone de contenu                │  │  │
│  │  │         │  │  ┌────────────┐  ┌───────────────────┐  │  │  │
│  │  │ DASH    │  │  │  /         │  │  /terminal         │  │  │  │
│  │  │ TERM    │  │  │  Status    │  │  xterm.js          │  │  │  │
│  │  │ ANKI    │  │  │  Système   │  │  ↕ WebSocket PTY   │  │  │  │
│  │  │ MANGA   │  │  └────────────┘  └───────────────────┘  │  │  │
│  │  └─────────┘  │  ┌────────────┐  ┌───────────────────┐  │  │  │
│  │               │  │  /anki     │  │  /uploads          │  │  │  │
│  │               │  │  Flashcards│  │  Drag-and-drop     │  │  │  │
│  │               │  │  Decks     │  │  manga (CBZ/PDF)   │  │  │  │
│  │               │  └────────────┘  └───────────────────┘  │  │  │
│  └───────────────┴─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌────────────────────┐      ┌────────────────────────┐
│  Next.js API Routes│      │  WebSocket PTY Server  │
│                    │      │  server/terminal-server │
│  POST /api/auth/   │      │  (port 3002 par défaut) │
│       login        │      │                        │
│  POST /api/auth/   │      │  Vérifie JWT → spawn   │
│       logout       │      │  /bin/bash via node-pty│
│  GET  /api/terminal│      │  Redim. dynamique      │
│       /token       │      └────────────────────────┘
│  GET  /api/health  │
└────────────────────┘
         │
         ▼
  middleware.ts
  (JWT vérifié sur
   toutes les routes
   /dashboard/*)
```

### Flux d'authentification

```
Client → POST /api/auth/login (password)
       ← JWT signé → cookie nerv-session (HTTP-only, 7j)

Request /dashboard/* → middleware.ts vérifie le cookie
  → Valide  : laisse passer
  → Invalide : redirige vers /
```

### Flux terminal

```
Page terminal → GET /api/terminal/token (JWT temporaire)
              → WebSocket wss://host/ws/terminal?token=...
              → PTY Server vérifie le token
              → spawn /bin/bash
              ↕ flux bidirectionnel (input/output + resize)
```

---

## Infrastructure

```
Internet
  └── Caddy (HTTPS automatique, port 443)
        ├── Next.js (App Router + API)  — via PM2
        └── WebSocket PTY Server        — via PM2
              └── /bin/bash (node-pty)
```

---

## Variables d'environnement

```env
# .env.local
SESSION_SECRET=...        # clé secrète pour signer les JWT de session
HASHED_PASSWORD=...       # mot de passe haché (bcrypt)
VPS_IP=...                # adresse IP du VPS pour le ping
TERMINAL_PORT=3002        # port du serveur WebSocket PTY (optionnel)
```

---

## Lancer le projet

```bash
# Installer les dépendances
npm install

# Développement
npm run dev              # Next.js avec Turbopack
npm run terminal         # Serveur PTY (dans un 2e terminal)

# Production
npm run build
pm2 start ecosystem.config.js
```

---

## Structure du projet

```
nomadeHome/
├── app/
│   ├── page.tsx                      # Login (HexGrid + NervPanel + LoginForm)
│   ├── layout.tsx                    # Root layout, theme provider
│   ├── globals.css                   # Tailwind + thème global
│   ├── api/
│   │   ├── auth/login/route.ts       # Authentification JWT
│   │   ├── auth/logout/route.ts      # Suppression cookie session
│   │   ├── terminal/token/route.ts   # Token WebSocket temporaire
│   │   └── health/route.ts           # Health check
│   └── (protected)/dashboard/
│       ├── layout.tsx                # Sidebar + header + footer
│       ├── page.tsx                  # Status système
│       ├── terminal/page.tsx         # Terminal xterm.js
│       ├── anki/page.tsx             # Gestion de decks Anki
│       └── uploads/page.tsx          # Upload manga/BD
├── components/
│   ├── bio-signal.tsx                # Waveform ECG pilotes EVA
│   ├── nerv-hexagone.tsx             # Composant hexagone
│   ├── memory-dump.tsx               # Memory dump UI
│   ├── pingMonitor.tsx               # Moniteur de ping
│   └── ui/button.tsx                 # Bouton de base
├── hooks/
│   └── use-container-size.ts         # ResizeObserver hook
├── server/
│   └── terminal-server.ts            # Serveur WebSocket + node-pty
├── lib/utils.ts                      # Utilitaires (cn, etc.)
├── middleware.ts                     # Protection JWT des routes
└── public/
    └── font/digital-7.ttf            # Police horloge digitale
```

---

## Direction artistique

Inspirée du système d'interface N.E.R.V. dans *Neon Genesis Evangelion* :
- Fond noir profond avec accents orange vif et rouge d'alerte
- Typographie monospace (Geist Mono + Digital-7 pour l'horloge)
- UI style "système opérationnel" : bordures fines, angles droits, données superposées
- Effets CRT : scanlines, vignette, glow phosphore
- Signaux bio-électriques des pilotes, noms en katakana, terminologie EVA
- Animations sobres : scan / boot / ripple sur erreur d'accès
