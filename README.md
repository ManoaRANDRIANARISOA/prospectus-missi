# Missi Innovation — Portail des Solutions Métiers & Dossiers Commerciaux

Ce projet regroupe l'ensemble des catalogues officiels, propositions commerciales segmentées, fiches prospectus et guides techniques de **Missi Innovation** pour la suite logicielle **Study Agent Pro**, **ResiPro** et les offres partenaires.

---

## 🏛️ Arborescence Modulaire (Normes Web & Production Ready)

Le projet adopte les standards de l'industrie :
- **Séparation Stricte Public / Privé** : Tout le contenu exposé en ligne réside dans `public/`. Les scripts, variables d'environnement (`.env`) et configurations système restent protégés à la racine.
- **Organisation par Domaine Métier** : Les pages sont regroupées par secteur d'activité (`education/`, `entreprises/`, `hotellerie/`, `web/`, `docs/`).
- **URLs Propres (Kebab-case)** : Noms de fichiers explicites, modernes et optimisés SEO.
- **Rétrocompatibilité Totale** : Règles de redirection 301 configurées dans `firebase.json` pour garantir que tout ancien lien partagé par email ou WhatsApp continue de fonctionner immédiatement.

```
prospectus-missi/
├── public/                                           # Racine publique servie aux utilisateurs
│   ├── index.html                                    # Portail central & Catalogue officiel interactif
│   │
│   ├── education/                                    # Pôle Éducation (Study Agent Pro)
│   │   ├── presentation-visuelle.html                # Dossier A4 HD avec 12 captures réelles (zoom interactif)
│   │   ├── offre-petite-structure.html               # Formule Essentielle (< 300 élèves)
│   │   ├── offre-moyenne-structure.html              # Formule Performance (300 à 1000 élèves)
│   │   ├── offre-grande-structure.html               # Formule Prestige & Multi-Campus (> 1000 élèves)
│   │   ├── proposition-papier-art.html               # Variante A/B : Style Atelier Papier d'Art
│   │   ├── proposition-bento-glass.html              # Variante A/B : Style Bento Glassmorphism
│   │   ├── perspectives-atelier-3d.html              # Perspectives & évolutions futures (Atelier 3D)
│   │   └── perspectives-bento-ui.html                # Perspectives & évolutions futures (Bento UI)
│   │
│   ├── entreprises/                                  # Pôle Entreprises & PME (Missi Innovation Enterprise)
│   │   └── erp-societe.html                          # Proposition ERP : Facturation NIF/STAT, Stocks & RH
│   │
│   ├── hotellerie/                                   # Pôle Hôtellerie & Restauration (ResiPro)
│   │   └── resipro.html                              # Proposition Progiciel Hôtels, Lodges & Restaurants
│   │
│   ├── web/                                          # Pôle Présence Numérique & Vitrine
│   │   └── site-vitrine.html                         # Proposition One-Page Haute Conversion & Google Maps
│   │
│   ├── docs/                                         # Pôle Manuels d'Exploitation & Guides d'Ingénierie
│   │   ├── guide-utilisateur.html                    # Manuel utilisateur intégral terrain (2 349 lignes)
│   │   ├── guide-sauvegardes-multipostes.html        # Guide sauvegardes SQLite, réseau LAN & reprises
│   │   └── guide-architecture-multi-tenant.html      # Guide SaaS Multi-Tenant & synchronisation Cloud
│   │
│   └── assets/                                       # Ressources statiques optimisées
│       └── img/                                      # Logo vectoriel officiel & 13 captures d'écran actives
│
├── archive/                                          # Archives hors-production (non déployées)
│   └── raw-screenshots/                              # 15 captures brutes d'origine sauvegardées
│
├── scripts/                                          # Scripts d'automatisation & CI/CD
│   └── deploy-supabase.mjs                           # Déploiement automatisé vers Supabase Storage
│
├── firebase.json                                     # Configuration Firebase Hosting (public: "public" + 301 redirects)
├── .firebaserc                                       # Projet Firebase actif ("missi-inovation")
├── package.json                                      # Dépendances npm et scripts de lancement
├── .env.example                                      # Gabarit des variables d'environnement
└── README.md                                         # Ce document
```

---

## 🚀 Démarrage & Prévisualisation Locale

Pour lancer le serveur local de test :

```bash
# Lancer le serveur local sur le dossier public/
npm start
# ou
npm run dev
# ou
npx serve public -p 5000
```

Accédez à [http://localhost:5000](http://localhost:5000) pour afficher le catalogue d'accueil.

---

## 🌐 Déploiement en Ligne

### 1. Déploiement Firebase Hosting (Production)
Le site en production est hébergé sur :
👉 **https://missi-inovation.web.app**

Pour déployer les mises à jour en un clic :
```bash
npm run deploy:firebase
# ou
firebase deploy --only hosting
```
*Note : Grâce au dossier `public/`, seuls les fichiers web sont téléversés. Vos fichiers sensibles (`.env`, `scripts/`, etc.) sont physiquement isolés et exclus du serveur.*

### 2. Déploiement Supabase Storage (Alternative CDN)
Pour héberger et synchroniser les pages dans un bucket public Supabase :
```bash
npm run deploy:supabase
```
Le script `scripts/deploy-supabase.mjs` analyse le dossier `public/` et met à jour l'ensemble des fichiers avec leurs bons types MIME.

---

## 🔒 Intégrité des Liens & Conception
- **100% Hors-Ligne & Autonome** : Tous les fichiers HTML intègrent leurs styles CSS, polices et icônes sans dépendre d'un runtime externe.
- **Impression A4 Standardisée** : Chaque proposition commerciale intègre des règles CSS `@media print` calibrées au millimètre pour une impression physique impeccable.
- **Zéro Lien Mort** : L'ensemble des 78 liens relatifs et références d'images ont été scannés et validés.
