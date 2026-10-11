# Missi Innovation — Prospectus, Vitrine Commerciale & Portail Offres

Ce projet autonome regroupe l'ensemble des catalogues officiels, propositions commerciales segmentées, fiches prospectus et guides visuels de **Missi Innovation** pour la suite **Study Agent** et **ResiPro**.

---

## 📂 Structure du Projet

```
prospectus-missi/
├── index.html                                        # Portail central & Catalogue officiel
├── prospectus_presentation_visuelle.html             # Prospectus A4 haute fidélité avec visuels
├── proposition_commerciale.html                      # Proposition commerciale standard
├── proposition_commerciale_petite_structure.html     # Offre calibrée Petites Écoles (< 200 élèves)
├── proposition_commerciale_moyenne_structure.html    # Offre calibrée Moyennes Écoles (200 - 800)
├── proposition_commerciale_grande_structure.html     # Offre calibrée Grandes Écoles (> 800 élèves)
├── proposition_commerciale_societe.html              # Offre Grands Comptes & Sociétés
├── proposition_commerciale_bento_glass.html          # Proposition prestige Bento Glassmorphism
├── resipro_proposition_commerciale.html              # Proposition dédiée progiciel ResiPro
├── onepage_site_vitrine_commerciale.html             # Landing page vitrine interactive
├── guide_utilisateur_et_avantages_pro.html          # Guide utilisateur complet & fiches métiers
├── guide_sauvegardes_et_topologie_multipostes.html   # Guide technique sauvegardes & réseau
├── perspectives_ameliorations_atelier_3d.html        # Démo 3D & perspectives roadmap
├── perspectives_ameliorations_bento_ui.html          # Démo Bento UI & perspectives roadmap
├── multi-tenant-guide.html                           # Guide architecture SaaS & multi-tenant
├── img/                                              # 29 captures d'écran, logos officiels & assets SVG
├── firebase.json                                     # Configuration Firebase Hosting (missi-inovation)
├── .firebaserc                                       # Projet Firebase par défaut ("missi-inovation")
├── deploy-supabase.mjs                               # Script d'upload automatisé vers Supabase Storage
├── package.json                                      # Commandes de prévisualisation et déploiement
└── README.md                                         # Ce document
```

---

## 🚀 Démarrage & Prévisualisation Locale

Pour tester et consulter les documents dans votre navigateur :

```bash
# Lancer le serveur local
npm start
# ou
npx serve . -p 5000
```

Accédez ensuite à [http://localhost:5000](http://localhost:5000) pour ouvrir le portail d'accueil.

---

## 🌐 Déploiement en Ligne

### 1. Déploiement Firebase Hosting (Actuel & Production)
Le site en production reste accessible sur :
👉 **https://missi-inovation.web.app**

Pour déployer les mises à jour :
```bash
npm run deploy:firebase
# ou
firebase deploy --only hosting
```

### 2. Déploiement Supabase Storage (Alternative Cloud)
Pour héberger l'ensemble des fichiers dans un bucket public Supabase :
```bash
npm run deploy:supabase
```
Le script crée automatiquement le bucket public `prospectus` et téléverse l'intégralité des HTML et images avec leurs bons types MIME.

---

## 🔒 Intégrité des Liens
Tous les fichiers HTML sont 100% autonomes :
- Styles CSS intégrés et optimisés pour l'impression A4 et l'affichage responsive.
- Liens relatifs testés et validés sans aucun lien mort.
- Répertoire d'images `img/` complet (aucun asset externe manquant).
