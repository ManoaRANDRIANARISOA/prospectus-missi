# Kit de Prospection Commerciale B2B — Missi Innovation (Jour 1)

Ce document regroupe les pitchs, les URLs officielles (Architecture Option A sur `https://missi-innovation.web.app`), la grille tarifaire exacte vérifiée dans `PropComm/` et `public/`, la méthode BANT, les scripts prêts à l'emploi et les réponses aux 5 objections classiques.

---

## 0. Repères des Liens à Envoyer aux Prospects

- **International FR (Europe / Francophonie) :** `https://missi-innovation.web.app/`
- **International EN (Global) :** `https://missi-innovation.web.app/en`
- **Local Madagascar & Océan Indien :** `https://missi-innovation.web.app/mg`
- **Configurateur de devis en Ariary :** `https://missi-innovation.web.app/configurateur`
- **Prise de RDV intégrée (20 min) :** bouton *Planifier un appel / une démo* directement sur `/`, `/en` ou `/mg`

---

## 1. Pitchs 20 secondes

### Version Locale (Madagascar — `/mg`)
> « Bonjour [Prénom], je représente Missi Innovation à Antananarivo. Nous équipons les [écoles / hôtels / PME / tour-opérateurs] avec des logiciels de gestion **100 % hors-ligne** — jamais bloqués par les coupures Internet ou JIRAMA — conformes **NIF/STAT**, avec billetage de caisse scellé pour stopper les écarts. Nos équipes installent et forment sur site sous 48h, dès 69 000 à 199 000 Ar/mois selon la taille. Je peux vous montrer concrètement en 20 minutes comment sécuriser vos encaissements cette semaine ? »

### Version Internationale — Tech & IA (Europe / Global — `/` et `/en`)
> « Bonjour [Prénom], chez Missi Innovation, nous mettons à disposition des PME, startups et agences européennes une équipe d'ingénieurs sur le même fuseau horaire ouvré (UTC+3, +1h/+2h vs Paris). Nous livrons des applications web/mobile robustes (y compris architectures offline-first) et des automatisations IA, avec 100 % de propriété du code source, dès 35 €/h ou au forfait jalonné. Auriez-vous 20 minutes pour comparer cela à vos priorités tech du trimestre ? »

### Version Internationale — SAV E-commerce & Opérations (`/` et `/en`)
> « Bonjour [Prénom], nous accompagnons les boutiques e-commerce (Shopify / WooCommerce) avec une équipe dédiée de support client multicanal (email, chat, réseaux sociaux, suivi commandes/retours sur Zendesk/Freshdesk) et de modération communautaire, alignée sur votre charte de marque et avec un SLA défini sur-mesure. Souhaitez-vous 20 minutes pour évaluer ce que cela vous libérerait comme temps opérationnel ? »

---

## 2. Catalogue & Grilles Tarifaires Officielles (Vérifiées `PropComm/` & `public/`)

> **Rappel commissionnement :** Les frais d'installation/déploiement, les déplacements terrain et le matériel (imprimante POS 80 mm à 450 000 Ar) sont **strictement exclus de l'assiette de commission**.

### Pôle Local Madagascar (`/mg`)

| Offre | Cibles idéales | Douleurs à détecter | Modules clés | Tarifs officiels (MGA) | Frais installation *(hors comm.)* / Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Study Agent Pro**<br>*(Petite < 300 élèves, 1–2 postes)* | Écoles de quartier, maternelles, primaires | Carnets manuels raturés, retards oubliés, trous de caisse | Scolarité, reçus 80mm, billetage 20k–100 Ar, Ticket Z, alertes impayés, bulletins MEN | **Starter :** 69 000 Ar/m *(1er mois, puis 89k)*<br>**Sérénité Caisse :** 119 000 Ar/m *(1er trim., puis 149k ou 119k annuel)* | Installation : 200 000 Ar<br>Licence définitive conseillée : 1,5M à 3M Ar *(pivot 2,2M Ar)* |
| **Study Agent Pro**<br>*(Moyenne 300–1 000 élèves, 2–5 postes)* | Collèges & lycées privés structurés | Plusieurs caisses, lenteur bulletins, paie vacataires/IRSA | Multi-postes SQLite+Supabase, CNaPS/IRSA, bus/cantine, Grand Livre | **Opérationnelle :** 119 000 Ar/m *(puis 149k)*<br>**Excellence VIP :** 149 000 Ar/m *(1er trim., puis 199k ou 159k annuel)* | Installation : 250 000 Ar<br>Licence définitive conseillée : 4,5M à 8,5M Ar *(pivot 6M Ar)* |
| **Study Agent Pro**<br>*(Grande > 1 000 élèves)* | Grands complexes, AEFE, bilingues | Flux intenses multi-guichets, audit multi-campus, SLA | Jusqu'à 5 postes ou illimité, instance dédiée, télémétrie, SLA 7j/7 | **Grand Étab. :** 290 000 Ar/m *(puis 390k)*<br>**Prestige VIP :** 490 000 Ar/m *(1er trim., puis 590k ou 490k annuel)* | Déploiement : 450 000 Ar<br>Licence définitive conseillée : 12M à 25M Ar *(pivot 18M Ar)* |
| **Study Home PWA** | Familles homeschooling, cours privés | Suivi dispersé, justificatifs niveau | Planning modulable, programme MEN, livret PDF, synchro cloud | **Essentiel :** 39 000 Ar/m *(390k/an)*<br>**Famille :** 59 000 Ar/m *(590k/an)* | Déploiement : 50 000 Ar |
| **ResiPro Suite** | Hôtels, lodges, bars & restaurants | Surbooking, bons resto non facturés aux chambres, coulage bar | Planning multi-séjours, POS tactile, note sur chambre, linge/pressing, économat, NIF/STAT | **Module seul :** 79 000 Ar/m *(puis 109k)*<br>**Pack Intégral :** 129 000 Ar/m *(1er trim., puis 179k ou 139k annuel)* | Installation : 250 000 Ar<br>Options : Fiches tech (+19k), Écarts (+29k), Paie (+39k), IA (+39k) — *Pack 4 options : +89k/m* |
| **ERP Société & Commerce** | PME, grossistes, boutiques, négoce | Factures Excel refusées, ruptures de stock, créances impayées | Devis proforma, factures NIF/STAT TVA 20%, stocks multi-dépôts, caisse 18h, paie CNaPS/IRSA | **Émergence :** 99 000 Ar/m *(puis 149k)*<br>**Excellence ERP & RH :** 199 000 Ar/m *(1er trim., puis 299k)* | Installation : 250 000 Ar *(Émergence)* / 350 000 Ar *(Excellence)* |
| **TourAgent Pro** | Tour-opérateurs réceptifs (DMC) | Erreurs de marge EUR/MGA, vouchers lents, suivi gasoil 4x4 | Cotations EUR/USD/MGA, vouchers PDF, flotte 4x4, caisse circuit, rétro-commissions | **Essentiel :** 119 000 Ar/m *(puis 149k)*<br>**Intégral :** 179 000 Ar/m *(puis 229k)* | Installation : 250 000 Ar *(+ option POS 80mm 450 000 Ar prix coûtant)* |
| **Sites Vitrines Connectés** | Hôtels, lodges, PME locales | Dépendance Booking, abonnements Wix en USD | Design sur-mesure, dispo ResiPro, Google Maps, WhatsApp, hosting 0 Ar/m | **Vitrine :** 590 000 Ar *(one-shot)*<br>**Rayonnement (.com+FR/EN) :** 850 000 Ar<br>**SaaS CMS :** 79 000 Ar/m + 149k | *Hébergement Firebase gratuit à vie* |
| **Sécurisation Box & TMA** | Bureaux, PME, écoles avec fibre | Fibre saturée par YouTube/Facebook, squat Wi-Fi, pannes PC | Whitelist MAC Yas/Orange/Telma, GPO Chrome/Edge, TMA mensuelle | **Starter (1–3 PC) :** 150 000 Ar<br>**Entreprise (≤10 PC) :** 250 000 Ar<br>**TMA :** Dès 120 000 Ar/m | *Intervention sur site Antananarivo* |

### Pôle International (`/` & `/en`)

| Pôle International | Cibles idéales | Douleurs à détecter | Livrables clés | Modèle tarifaire |
| :--- | :--- | :--- | :--- | :--- |
| **1. Ingénierie Logicielle, Web/Mobile & Offline-First** | PME/ETI, Startups, Agences | Backlog saturé, outils Excel fragiles, coût dev local élevé | Apps TypeScript/React/Node/Python, PWA offline-first, API, TMA | **Dès 35 € / h** *(ou $35/h)* en régie, ou forfait jalonné sur devis |
| **2. Automatisation de Processus & Intégration IA** | PME, Cabinets, SaaS | Saisies manuelles répétitives, reporting lent, silos CRM/ERP | Workflows orchestrés, back-offices internes, agents IA & extraction doc | Audit & devis sous 48h *(forfait ou régie)* |
| **3. Service Client Externalisé & Opérations E-commerce** | Boutiques Shopify / WooCommerce, Marques D2C | Tickets SAV qui s'accumulent, retours mal suivis, modération réseaux non couverte | SAV multicanal (email/chat/réseaux), suivi commandes/retours, Zendesk/Freshdesk, SLA sur-mesure | **Forfait mensuel calibré sur le volume de tickets** *(sur devis après cadrage)* |

---

## 3. Méthode de Qualification BANT (Score ≥ 3/4 requis avant démo)

1. **B — Besoin avéré :** Douleur concrète identifiée (impayés, surbooking, facturation non conforme, projet dev/IA, volume de tickets SAV Shopify/WooCommerce).
2. **A — Autorité / Décideur :** Directeur, Gérant, Fondateur, CTO ou Responsable E-commerce présent à la démo de 20 min.
3. **N — Niveau de Budget / Taille :** Effectif / taille cohérente avec la grille (ex. école ≥ 100 élèves, hôtel structuré, projet international ≥ 1 500 € ou flux SAV régulier).
4. **T — Temporalité :** Décision actionnable sous 15 à 60 jours.

---

## 4. Scripts de Prospection Prêts à Copier-Coller

### A. Message LinkedIn (International — Tech, IA ou SAV E-commerce)
> Bonjour [Prénom],
> 
> Je vois que [Entreprise] développe [produit / boutique e-commerce]. Beaucoup de [dirigeants / CTO / fondateurs e-commerce] avec qui nous échangeons cherchent à [livrer leurs outils & automatisations IA plus vite / structurer leur SAV Shopify & Zendesk] sans alourdir leurs coûts fixes.
> 
> Chez Missi Innovation (équipe francophone et anglophone en UTC+3, +1h/+2h vs Paris), nous intervenons au forfait ou en capacité dédiée sur le développement web/offline-first, l'automatisation IA et les opérations SAV multicanales sur-mesure.
> 
> Est-ce un sujet ouvert pour vos prochains mois ? Si oui, je peux vous proposer un appel découverte de 20 min sans engagement.
> 
> Cordialement, [Votre Prénom]

### B. Cold Email (Adapter selon Local `/mg` ou International `/`)
> **Objet :** [Nom Entreprise] — [Sécuriser vos caisses hors-ligne sous 48h / Renfort dev, IA ou SAV e-commerce]
> 
> Bonjour [Prénom / Mme / M. Nom],
> 
> En échangeant avec des dirigeants de [secteur], deux freins reviennent souvent : [douleur 1] et [douleur 2].
> 
> Chez **Missi Innovation**, nous apportons une réponse concrète : [progiciels 100 % hors-ligne conformes NIF/STAT dès XX 000 Ar/mois déployés en 48h / équipe dédiée en ingénierie TypeScript/IA dès 35 €/h ou support client e-commerce aligné sur votre charte].
> 
> Seriez-vous disponible pour un échange concret de 20 minutes cette semaine ? Vous pouvez aussi choisir votre créneau directement sur `https://missi-innovation.web.app/[mg ou vide]`.
> 
> Bien cordialement,  
> **[Votre Prénom & Nom]** — Missi Innovation | WhatsApp : +261 34 71 517 89

### C. Message WhatsApp Pro (Madagascar — `/mg`)
> Bonjour [Mme/M. Nom], ici [Votre Prénom] de **Missi Innovation** (Antananarivo).  
> Nous équipons les [écoles / hôtels / sociétés / tour-opérateurs] avec des logiciels **100 % hors-ligne** (jamais bloqués par les coupures JIRAMA ou Internet) pour sécuriser les encaissements, les stocks et la facturation NIF/STAT.  
> Je peux vous envoyer la présentation en images (`https://missi-innovation.web.app/mg`) ou bloquer **20 min cette semaine** pour vous montrer en direct comment ça fonctionne pour [Nom Établissement]. Quel créneau vous convient le mieux ?

### D. Trame d'appel de 5 minutes (Objectif : réserver la démo de 20 min)
1. **Accroche (30s) :** « Bonjour [Nom], [Votre Prénom] de Missi Innovation. Vous avez 2 minutes ? J'appelle car nous accompagnons les [secteur] sur [bénéfice clé]. »
2. **Diagnostic (90s) :** « Aujourd'hui, comment gérez-vous [encaissements & impayés / notes sur chambre / backlog dev / tickets SAV Shopify] ? Qu'est-ce qui vous fait perdre le plus de temps aujourd'hui ? »
3. **Qualification BANT (90s) :** Taille/volume, décideur, horizon de mise en place.
4. **Closing démo 20 min (30s) :** « Je vous propose de bloquer **20 minutes** [jour] à [heure] avec notre équipe pour vous montrer concrètement le fonctionnement et un chiffrage exact. On part sur [créneau 1] ou [créneau 2] ? »

---

## 5. Traitement des 5 Objections Classiques

1. **« C'est trop cher pour notre budget cette année. »** — *En local :* « Nos formules démarrent à 69 000–119 000 Ar/mois (moins que 2 à 4 écolages ou 1 nuitée par mois) : un seul impayé ou écart de caisse évité rembourse l'outil. *À l'international :* À 35 €/h ou en forfait SAV calibré au volume, le coût reste nettement inférieur à un recrutement local chargé tout en gardant un recouvrement horaire complet. »
2. **« Nous utilisons déjà Excel / des cahiers. »** — « Excel ne bloque ni les suppressions de lignes, ni les reçus sans numéro unique, ni le billetage de fin de journée. Notre logiciel garde la simplicité tout en scellant la caisse et les alertes d'impayés. »
3. **« Notre connexion coupe souvent / délestages JIRAMA. »** — « Nos progiciels tournent sur moteur local SQLite installé sur vos postes : vous encaissez et imprimez sans Internet, et la synchro cloud reprend seule dès le retour du réseau. »
4. **« Confiance, confidentialité des données et références ? »** — « Vos données restent chez vous en local (ou sur votre Git / vos outils avec NDA disponible sur demande à l'international). Des structures comme Oka Forest Lodge, Lycée Manjary Soa, Kanana Camp, Ny Andrin'ny Soa, Sunshine Montessori ou ANKA Madagascar nous ont déjà fait confiance. »
5. **« Nous n'avons pas le temps pour un long projet. »** — « En local, installation et formation se font sous **48 heures**. À l'international, nous cadrons le périmètre ou le SLA SAV en 48h avec des livrables hebdomadaires visibles dès la première semaine. »
