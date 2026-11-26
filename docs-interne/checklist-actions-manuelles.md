# Checklist des Actions Humaines Obligatoires (Dans l'Ordre)

> **Important :** Tout ce qui dépendait du code est prêt sur la branche `feat/seo-architecture-commercial-v3`. Il ne reste que les **7 actions manuelles ci-dessous** (temps total estimé : **~35 minutes**).

---

## Étape 1 — Créer l'email pro gratuit et remplacer `missiinnovation@gmail.com` (~5 min)
1. **Option immédiate 0 € (2 min)** : Créez une adresse dédiée gratuite (ex. `missi.innovation.contact@gmail.com` ou Zoho/Proton gratuit) dédiée exclusivement au pro/recrutement pour ne jamais exposer votre Gmail personnel.
2. Remplacez partout `missiinnovation@gmail.com` dans `public/` et `commercial/` par cette adresse active (puis faites de même le jour où vous achèterez `@missi-innovation.com`).

---

## Étape 2 — Configurer la base Supabase, Admin & Notifications (~10 min)
1. **Créer la table + RLS (`2 min`)** :
   - Ouvrez votre dashboard Supabase (projet `uigqxexsfbjfxbnkrjfc`) -> **SQL Editor**.
   - Collez et exécutez l'intégralité de [supabase/schema.sql](file:///c:/wrk/prospectus-missi/supabase/schema.sql).
2. **Créer votre compte Admin (`2 min`)** :
   - Dans Supabase -> **Authentication -> Providers / Settings** : désactivez *Allow new users to sign up* (crucial pour que personne d'autre ne puisse s'inscrire !).
   - Dans **Authentication -> Users -> Add user**, créez votre email + mot de passe admin pour vous connecter sur `https://missi-innovation.web.app/admin`.
3. **Activer la notification automatique Telegram (gratuit, `6 min`)** :
   - Sur Telegram, parlez à `@BotFather` (`/newbot`) pour obtenir `TELEGRAM_BOT_TOKEN`, puis à `@userinfobot` pour obtenir votre `TELEGRAM_CHAT_ID`.
   - Déployez la fonction Edge :
     ```powershell
     npx supabase functions deploy notify-booking --project-ref uigqxexsfbjfxbnkrjfc --no-verify-jwt
     npx supabase secrets set TELEGRAM_BOT_TOKEN="<VOTRE_TOKEN>" TELEGRAM_CHAT_ID="<VOTRE_CHAT_ID>" WEBHOOK_SECRET="<SECRET_ALEATOIRE>" --project-ref uigqxexsfbjfxbnkrjfc
     ```
   - Dans Supabase -> **Database -> Webhooks -> Create a new hook** :
     - Table : `bookings`, Event : `INSERT`
     - URL : `https://uigqxexsfbjfxbnkrjfc.supabase.co/functions/v1/notify-booking`
     - Header : `x-webhook-secret: <SECRET_ALEATOIRE>`

---

## Étape 3 — Supprimer le fichier `google*.html` inutilisé (~1 min)
- Vérifiez dans Google Search Console lequel des deux fichiers correspond à votre propriété active (`https://missi-innovation.web.app/`), et supprimez l'autre fichier de `public/` :
  - `public/google838b3fd2b725598c.html` OU `public/googlebace21373924e5d5.html`.

---

## Étape 4 — Déployer sur Firebase Hosting (~3 min)
1. Vérifiez votre ciblage (la cible `missi-inovation` redirige en 301 vers `https://missi-innovation.web.app/`):
   ```powershell
   firebase target:apply hosting missi-innovation missi-innovation --project missi-inovation
   firebase target:apply hosting missi-inovation missi-inovation --project missi-inovation
   ```
2. Déployez :
   ```powershell
   firebase deploy --only hosting --project missi-inovation
   ```
3. Vérifiez les réponses HTTP :
   ```powershell
   curl -I https://missi-innovation.web.app/
   curl -I https://missi-innovation.web.app/en
   curl -I https://missi-innovation.web.app/mg
   curl -I https://missi-innovation.web.app/configurateur.html
   curl -I https://missi-inovation.web.app/
   ```
4. Testez en direct une réservation factice sur `/mg` ou `/`, vérifiez la réception de la notification Telegram et sa visibilité dans `https://missi-innovation.web.app/admin` (puis supprimez le test).

---

## Étape 5 — Google Search Console (~5 min)
1. Supprimez ou ignorez la propriété en double `missi-inovation.web.app` (1 « n »).
2. Dans `https://missi-innovation.web.app/` -> **Sitemaps** -> soumettez `sitemap.xml` (contient `/`, `/en`, `/mg` et les 9 pages publiques sans `.html`).
3. Dans **Inspection de l'URL**, testez et cliquez sur **Demander une indexation** pour :
   - `https://missi-innovation.web.app/`
   - `https://missi-innovation.web.app/en`
   - `https://missi-innovation.web.app/mg`
   - `https://missi-innovation.web.app/configurateur`
   - `https://missi-innovation.web.app/services/prestations-sur-mesure-et-securite`

---

## Étape 6 — Créer les Backlinks Gratuits d'Autorité (~10 min)
Pour faire disparaître *« Aucune page d'origine détectée »*, créez et liez vers `https://missi-innovation.web.app/` (et `/mg`) :
1. **Google Business Profile** (Antananarivo, `+261 34 71 517 89`, URL `/mg`).
2. **Page Entreprise LinkedIn** (Missi Innovation, URL `/`).
3. **Page Facebook Professionnelle** (Missi Innovation Madagascar, URL `/mg`).
4. **Profil / Organisation GitHub** (URL `/`).

---

## Étape 7 — Feuille de Route future `.com` + Zoho Mail Free (~15 min le jour de l'achat)
1. Achetez `missi-innovation.com` (~10–12 €/an) avant de lancer une grosse prospection froide Europe.
2. Liez-le gratuitement dans **Firebase Hosting -> Add custom domain** (SSL automatique).
3. Configurez **Zoho Mail Free** (gratuit, DNS `MX`, `SPF`, `DKIM`) pour obtenir `missiinnovation@gmail.com`, puis remplacez votre adresse email temporaire partout dans le dépôt.
