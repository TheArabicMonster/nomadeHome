(*μ_μ)

# nomadeHome

Tableau de bord personnel pour VPS, inspiré de la D.A. du N.E.R.V. dans Neon Genesis Evangelion.
Accessible depuis le web via [thearabicmonster.mywire.org](https://thearabicmonster.mywire.org/), protégé par auth, regroupant tous les services du VPS dans une interface unifiée.

---

## Stack technique

- **Frontend / Backend** : Next.js (App Router + API Routes)
- **Reverse proxy** : Caddy (HTTPS automatique)
- **Process manager** : PM2
- **Terminal web** : ttyd

---

## Fonctionnalités

### Authentification
- Page de login protégeant l'accès à l'ensemble du site
- Un seul utilisateur, credentials écri manuellement dans `.env`
- Pas de création de compte — tout ajout d'utilisateur se fait à la main

### Dashboard
- Sidebar de navigation avec le nom et l'icône de chaque service
- Clic sur un service → affichage dans un iframe au centre de la page
- Design inspiré N.E.R.V. : dark, orange, typographie monospace, UI style terminal opérationnel

### Services intégrés

| Service | Description | Outil |
|---|---|---|
| Terminal | Shell zsh dans le navigateur | ttyd |
| Explorateur de fichiers | Terminal zsh avec yazi lancé automatiquement | ttyd (instance dédiée) |
| *(autres services à venir)* | Ajoutés au fur et à mesure via iframe + entrée sidebar | — |

---

## Architecture

```
nomadeHome (Next.js)
├── /                  → redirige vers /login si non authentifié
├── /login             → page d'authentification
├── /dashboard         → layout principal avec sidebar + zone iframe
│   ├── /terminal      → iframe → ttyd instance terminal
│   ├── /files         → iframe → ttyd instance yazi
│   └── /[service]     → iframe → port dédié sur le VPS
│
API Routes (Next.js)
├── POST /api/auth/login    → vérifie le mot de passe, retourne un token de session
└── GET  /api/auth/session  → vérifie si la session est valide
```

---

## Infrastructure

```
Internet
  └── Caddy (HTTPS + reverse proxy)
        └── Next.js via PM2
              ├── ttyd — terminal
              └── ttyd — yazi
```

Caddy expose uniquement le port 443. Les ports ttyd ne sont pas accessibles directement depuis l'extérieur — ils passent par le dashboard authentifié.

---

## Installation

### Prérequis
- Node.js, PM2
- ttyd installé sur le VPS
- Caddy configuré avec le domaine

### Variables d'environnement

```env
SESSION_SECRET=...          # clé secrète pour signer les sessions
HASHED_PASSWORD=...         # mot de passe haché (bcrypt)
```

### Lancer ttyd

```bash
# Terminal général
ttyd -p 7681 zsh

# Explorateur de fichiers (yazi)
ttyd -p 7682 zsh -c "yazi; zsh"
```

### Lancer le site

```bash
npm run build
pm2 start ecosystem.config.js
```

---

## Ajouter un service

1. Lancer le service sur un port dédié du VPS
2. Ajouter une entrée dans la config des services (nom, icône, port)
3. Caddy proxie le port si nécessaire
4. Le service apparaît automatiquement dans la sidebar

---

## Direction artistique

Inspirée du système d'interface du N.E.R.V. dans *Neon Genesis Evangelion* :
- Fond noir profond
- Accents orange vif et rouge d'alerte
- Typographie monospace
- Éléments UI style "système opérationnel" : bordures fines, angles droits, overlays de données
- Animations sobres, style scan / boot
