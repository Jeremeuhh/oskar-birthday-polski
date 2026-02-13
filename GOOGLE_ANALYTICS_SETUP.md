# 📊 Configuration Google Analytics

## Étapes pour activer le tracking :

### 1. Créer un compte Google Analytics
1. Va sur https://analytics.google.com/
2. Clique sur "Commencer la mesure"
3. Suis les étapes pour créer un compte

### 2. Créer une propriété
1. Nom de la propriété : "Anniversaire Oskar Pologne"
2. Fuseau horaire : France
3. Devise : EUR

### 3. Configurer un flux de données Web
1. Choisis "Web"
2. URL du site : `https://jeremeuhh.github.io`
3. Nom du flux : "Site Anniversaire Oskar"

### 4. Récupérer ton ID de mesure
Après création, tu verras un **ID de mesure** du type : `G-XXXXXXXXXX`

### 5. Remplacer l'ID dans le code
Dans le fichier `index.html`, remplace les **2 occurrences** de `G-XXXXXXXXXX` par ton vrai ID :

```html
<!-- Ligne 7 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TON-ID-ICI"></script>

<!-- Ligne 11 -->
gtag('config', 'TON-ID-ICI');
```

### 6. Déployer
```bash
git add index.html
git commit -m "Add Google Analytics tracking"
git push
```

### 7. Vérifier que ça marche
- Attends 2-3 minutes après le déploiement
- Va sur ton site : https://jeremeuhh.github.io/oskar-birthday-polski/
- Dans Google Analytics, tu verras les visites en temps réel dans 5-10 minutes

## 📈 Voir les statistiques

Dans Google Analytics, tu pourras voir :
- Nombre de visiteurs en temps réel
- Pages vues
- Durée moyenne des visites
- Localisation des visiteurs
- Appareils utilisés (mobile/desktop)

Les données apparaissent généralement sous 24-48h pour les rapports complets.
