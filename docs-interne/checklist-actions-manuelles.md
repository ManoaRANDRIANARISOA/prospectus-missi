# Checklist des Actions Humaines Obligatoires (Architecture 100 % Firebase + Email Gratuit)

> **Architecture active :** Hébergement, Base de données (**Cloud Firestore**), Sécurité (**`firestore.rules`**) et Connexion Admin (**Firebase Auth**) sont **100 % sur votre projet Firebase `missi-inovation` (plan Spark gratuit, aucune mise en pause)**, sans dépendre de Supabase (`ProjectOne` reste intact pour votre app scolaire).

---

## Étape 1 — Créer votre compte Admin Firebase Auth (~2 min)
1. Ouvrez **Firebase Console (`missi-inovation`)** -> **Authentication** :
   `https://console.firebase.google.com/project/missi-inovation/authentication/users`
2. Dans **Users -> Add user**, créez :
   - Email : `missiinnovation@gmail.com`
   - Mot de passe : *(choisissez un mot de passe fort)*
3. Dans **Authentication -> Settings -> User actions** :
   - **Décochez** *Enable create (sign-up)* et sauvegardez *(important : empêche quiconque de créer un autre compte)*.

---

## Étape 2 — Activer les notifications Email gratuites sur chaque RDV (~2 min, sans carte bancaire)
*(Les réservations sont déjà enregistrées dans Firestore + visibles sur `/admin`, et le bouton WhatsApp client fonctionne déjà sans clé.)*
Pour recevoir en plus un **email automatique sur `missiinnovation@gmail.com`** dès qu'un prospect réserve :
1. Allez sur [web3forms.com](https://web3forms.com/), entrez `missiinnovation@gmail.com` et cliquez sur **Create Access Key** (gratuit, 250 soumissions/mois, aucune carte requise).
2. Copiez la clé publique reçue (ex. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) et collez-la dans [site-config.js](file:///c:/wrk/prospectus-missi/public/assets/js/site-config.js) à la ligne :
   ```js
   WEB3FORMS_ACCESS_KEY: 'VOTRE_CLE_ICI',
   ```
3. Redéployez uniquement le site statique : `npx firebase-tools deploy --only hosting`.

---

## Étape 3 — Google Search Console (~3 min)
1. Dans **Google Search Console** -> propriété `https://missi-innovation.web.app/` :
2. **Sitemaps** -> soumettez `https://missi-innovation.web.app/sitemap.xml`.
3. Optionnel : utilisez **Inspection de l'URL -> Demander une indexation** sur `/`, `/en`, `/mg`.

---

## Étape 4 — Test final bout-en-bout (~2 min)
1. Ouvrez `https://missi-innovation.web.app/` -> cliquez sur **Planifier un échange 20 min** et envoyez une demande test.
2. Vérifiez l'arrivée de l'email sur `missiinnovation@gmail.com` (si Step 2 configuré) puis connectez-vous sur `https://missi-innovation.web.app/admin` avec `missiinnovation@gmail.com` pour voir et supprimer la demande test.
