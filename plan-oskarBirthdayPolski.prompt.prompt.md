# Plan: Site d'organisation du voyage en Pologne pour l'anniversaire d'Oskar

**TL;DR** — Un site React + Vite hébergé sur GitHub Pages (déploiement automatique via GitHub Actions), avec Supabase pour l'authentification email/password, la base de données (logements, classements, commentaires), et Leaflet.js pour la carte interactive. Chaque pote se connecte avec son email, consulte les logements proposés sur une carte de la Pologne, les classe par préférence via drag & drop, et peut commenter. Le classement agrégé détermine le logement favori du groupe. Stack 100% gratuite (free tier).

---

## Steps

### 1. Initialiser le projet
- Créer le repo `oskar-birthday-polski` sur GitHub
- Scaffolder avec `npm create vite@latest` (template React + TypeScript)
- Configurer `vite.config.ts` avec `base: '/oskar-birthday-polski/'` pour GitHub Pages
- Installer les dépendances : `@supabase/supabase-js`, `react-leaflet`, `leaflet`, `react-router-dom`, `@dnd-kit/core` + `@dnd-kit/sortable` (pour le drag & drop du classement)
- Utiliser `HashRouter` pour le routing (évite les 404 sur GitHub Pages)

### 2. Configurer le déploiement GitHub Actions
- Créer `.github/workflows/deploy.yml` : à chaque push sur `main`, build Vite → déploiement GitHub Pages
- Stocker les variables Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en tant que secrets du repo (injectés au build)

### 3. Configurer Supabase
- Créer un projet Supabase (free tier)
- Activer l'**authentification Email** dans Auth → Providers (activé par défaut)
- Pour dev/test rapide : désactiver la confirmation d'email dans Auth → Settings → "Disable email confirmation"
- Pour production : configurer un SMTP pour l'envoi d'emails de confirmation
- Créer les tables :

  | Table | Colonnes clés | Rôle |
  |---|---|---|
  | `accommodations` | `id`, `name`, `description`, `url` (lien booking), `image_url`, `price_per_night`, `lat`, `lng`, `city`, `added_by` (FK auth.users), `created_at` | Stocke les logements proposés |
  | `rankings` | `id`, `user_id` (FK), `accommodation_id` (FK), `position` (int), `updated_at` — UNIQUE(`user_id`, `accommodation_id`) | Stocke le classement de chaque pote |
  | `comments` | `id`, `user_id` (FK), `accommodation_id` (FK), `body` (text), `created_at` | Commentaires par logement |

- Configurer les politiques RLS :
  - Tout utilisateur authentifié peut lire les logements, classements et commentaires
  - Chaque utilisateur ne peut modifier que ses propres classements et commentaires
  - N'importe quel utilisateur authentifié peut ajouter un logement ; seul le créateur peut le supprimer

### 4. Créer le client Supabase et l'auth
- Initialiser le client Supabase dans un fichier `src/lib/supabase.ts`
- Créer un `AuthProvider` (React Context) qui gère la session avec email/password
- Page de login avec formulaire email/password et option d'inscription
- Protéger les routes : seuls les utilisateurs connectés accèdent au site

### 5. Page principale : Liste & Carte des logements
- Layout en deux colonnes (ou tabs sur mobile) :
  - **Gauche** : liste des logements avec photo, nom, prix, lien, ville, score agrégé du classement
  - **Droite** : carte Leaflet + OpenStreetMap avec un marker par logement. Au clic sur un marker → popup avec les infos du logement
- Bouton "Ajouter un logement" ouvrant un formulaire (nom, URL, image, prix/nuit, coordonnées GPS ou recherche de ville)
- Pour les coordonnées : utiliser l'API Nominatim (gratuite, OpenStreetMap) pour géocoder une adresse/ville en lat/lng automatiquement

### 6. Page de classement (drag & drop)
- Chaque pote voit tous les logements dans une liste qu'il peut ordonner par glisser-déposer (`@dnd-kit/sortable`)
- L'ordre est sauvegardé dans la table `rankings` (position 1 = favori)
- Le classement agrégé du groupe est calculé côté client : on attribue des points inversement proportionnels à la position (1er = N pts, 2e = N-1, etc.) et on somme pour chaque logement
- Le résultat agrégé est affiché sur la page principale (tri par score)

### 7. Section commentaires
- Sous chaque logement (dans une vue détail ou en expandable), afficher les commentaires existants
- Formulaire pour ajouter un commentaire (textarea + bouton)
- Afficher le nom (Google display name) et l'heure du commentaire

### 8. Structure des fichiers

```
oskar-birthday-polski/
├── .github/workflows/deploy.yml
├── public/
├── src/
│   ├── components/
│   │   ├── AccommodationCard.tsx
│   │   ├── AccommodationForm.tsx
│   │   ├── AccommodationMap.tsx
│   │   ├── CommentSection.tsx
│   │   ├── RankingList.tsx
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx          (liste + carte)
│   │   ├── Ranking.tsx       (classement perso + agrégé)
│   │   └── Login.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── types.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## Verification

1. **Déploiement** : push sur `main` → vérifier que le site est live sur `https://<user>.github.io/oskar-birthday-polski/`
2. **Auth** : créer un compte avec email/password → se connecter → le nom s'affiche dans la navbar
3. **Ajout de logement** : remplir le formulaire → le logement apparaît dans la liste ET sur la carte avec un marker
4. **Classement** : drag & drop les logements → rafraîchir la page → l'ordre est conservé (persisté dans Supabase)
5. **Score agrégé** : demander à un 2e pote de classer → vérifier que le score global se met à jour
6. **Commentaires** : ajouter un commentaire sous un logement → il apparaît avec le nom et l'heure
7. **RLS** : tenter de supprimer le classement d'un autre utilisateur via la console → refusé

---

## Decisions

- **Auth : Email/Password** — inscription et connexion classiques, pas besoin de compte Google
- **Vote : système de classement** via drag & drop plutôt qu'upvote/downvote, agrégé par points (Borda count)
- **Carte : Leaflet + OpenStreetMap** — gratuit, sans API key, suffisant pour le use case
- **Framework : React + Vite + TypeScript** — léger, DX rapide, deploy trivial sur GitHub Pages
- **Géocodage : API Nominatim** (OpenStreetMap) pour convertir une adresse en coordonnées, gratuit
- **CSS : Pico CSS** — propre sans effort, cohérent avec "fonctionnel d'abord, esthétique si possible"
- **Routing : HashRouter** — contourne la limitation de GitHub Pages sur les routes SPA
