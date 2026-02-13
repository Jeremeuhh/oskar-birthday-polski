# 🇵🇱 Oskar Birthday Trip — Site d'organisation

Site web pour organiser le voyage d'anniversaire en Pologne : proposition de logements, vote par classement, commentaires et carte interactive.

## Stack technique

- **Frontend** : React 19 + Vite 6 + TypeScript
- **UI** : Pico CSS (CDN)
- **Backend / DB** : Supabase (auth email/password + PostgreSQL + RLS)
- **Carte** : Leaflet.js + OpenStreetMap (gratuit, sans API key)
- **Déploiement** : GitHub Pages (via GitHub Actions)

## 🚀 Installation locale

### 1. Cloner et installer

```bash
git clone <repo-url>
cd oskar-birthday-polski
npm install
```

### 2. Configurer Supabase

1. Crée un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Récupère les credentials : **Dashboard → Settings → API**
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
3. Copie `.env.example` → `.env` et remplis avec tes credentials :

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### 3. Créer les tables Supabase

1. Va dans **Dashboard → SQL Editor**
2. Copie-colle le contenu du fichier `supabase/migration.sql`
3. Exécute (bouton **Run**)

### 4. Configurer l'authentification

**Pour dev/test rapide** (pas d'email de confirmation) :
- Va dans **Dashboard → Authentication → Settings**
- Désactive **"Enable email confirmations"**

**Pour production** (emails de confirmation) :
- Configure un SMTP dans **Settings → Auth → SMTP Settings**
- Ou utilise le serveur Supabase par défaut (limité)

### 5. Lancer en dev

```bash
npm run dev
```

→ Ouvre [http://localhost:5173](http://localhost:5173)

## 📦 Déploiement sur GitHub Pages

### 1. Créer le repo GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <ton-repo-url>
git push -u origin main
```

### 2. Configurer les secrets GitHub

Va dans **Settings → Secrets and variables → Actions** et ajoute :

- `VITE_SUPABASE_URL` = ton URL Supabase
- `VITE_SUPABASE_ANON_KEY` = ta clé publique

### 3. Activer GitHub Pages

Va dans **Settings → Pages** :
- Source : **GitHub Actions**

### 4. Pousser sur `main`

```bash
git push origin main
```

→ Le workflow `.github/workflows/deploy.yml` build et déploie automatiquement

→ Ton site sera accessible sur `https://<username>.github.io/oskar-birthday-polski/`

## 🛠️ Structure du projet

```
oskar-birthday-polski/
├── .github/workflows/deploy.yml  # CI/CD GitHub Pages
├── supabase/migration.sql        # Tables + RLS policies
├── src/
│   ├── components/
│   │   ├── AccommodationCard.tsx      # Carte logement avec score
│   │   ├── AccommodationForm.tsx      # Ajout logement + géocodage
│   │   ├── AccommodationMap.tsx       # Carte Leaflet interactive
│   │   ├── CommentSection.tsx         # Commentaires
│   │   ├── RankingList.tsx
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx                   # Liste + carte côte à côte
│   │   ├── Login.tsx                  # Connexion/inscription email
│   │   └── Ranking.tsx                # Drag & drop classement
│   ├── context/AuthContext.tsx        # Auth Supabase
│   └── lib/
│       ├── supabase.ts               # Client Supabase
│       └── types.ts                  # Types TypeScript
└── vite.config.ts                    # Config base path
```

## 🗺️ Fonctionnalités

### Page Logements (`/`)

- **Liste** des logements avec photo, nom, prix, ville, score agrégé
- **Carte interactive** Leaflet avec markers cliquables
- **Ajouter un logement** : formulaire avec géocodage automatique (API Nominatim)
- **Commentaires** : expandable sous chaque logement

### Page Classement (`/ranking`)

- **Classement personnel** : drag & drop pour ordonner les logements du préféré au moins aimé
- **Classement du groupe** : agrégation Borda count (position N = N points)
- Score mis à jour dès qu'un pote sauvegarde son classement

### Authentification

- Inscription avec email + mot de passe + nom
- Connexion classique
- Session persistée (Supabase auth)

## 🔒 Sécurité

- **Row-Level Security (RLS)** activé sur toutes les tables
- Chaque utilisateur ne peut modifier que ses propres classements et commentaires
- La clé `VITE_SUPABASE_ANON_KEY` est publique (c'est normal), la sécurité est assurée par RLS

## 📝 Contributions

Pour ajouter des features :
1. Fork le repo
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Ajout ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

---

**Bon voyage en Pologne ! 🇵🇱🎉**
