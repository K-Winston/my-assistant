# Site vitrine [NOM DE L’ENTREPRISE]

Site de Stéphane, maçonnerie générale, tous corps d’état, à Graveson, Maillane, Saint-Rémy-de-Provence et Bellegarde.

C’est un site **statique** : de simples pages HTML, sans base de données ni serveur à maintenir. L’hébergement gratuit de Netlify ou de Vercel suffit.

---

## 1. Modifier le contenu (sans coder)

**Tous les textes, coordonnées, prestations, communes et photos sont dans un seul fichier : `src/data/site.ts`.**

Ouvrez-le avec n’importe quel éditeur de texte (sur GitHub, le bouton crayon suffit) et ne changez que ce qui se trouve **entre les apostrophes** `'…'`.

| Je veux changer… | Où, dans `src/data/site.ts` |
|---|---|
| Le nom de l’entreprise | `company.name` (ligne 19) et `site.logoText` (ligne 57) |
| Le nom de Stéphane | `company.owner` (ligne 21) et `legal.publicationDirector` (ligne 67) |
| Le **numéro de téléphone** | `contact.phoneDisplay` (ligne 38, tel qu’affiché : `06 12 34 56 78`) **et** `contact.phoneLink` (ligne 40, format international sans espaces : `+33612345678`, pour le bouton « Appeler ») |
| L’e-mail, l’adresse, les horaires | `contact` (lignes 41 à 50) |
| Le lien vers les avis Google | `contact.googleReviewsUrl` (ligne 52) |
| SIRET, TVA, assurance décennale | `company` (lignes 24 à 33) |
| Les textes d’une prestation | `services` (à partir de la ligne 122), un bloc par métier |
| Le texte « Notre histoire » | `story` (ligne 257) |
| Les 3 réalisations avant/après | `realisations` (ligne 269) |
| Les communes desservies | `area.towns` (ligne 297) |
| Les textes du formulaire | `contactSection` (ligne 306) |

Attention : si votre texte contient une apostrophe, utilisez l’apostrophe typographique `’` (comme dans `l’entreprise`), ou écrivez `\'`.

Tant qu’un texte contient `[À COMPLÉTER …]`, il apparaît **surligné en jaune** sur le site, pour ne pas l’oublier.

### Les photos

1. Préparez la photo en `.jpg` (ou `.png` / `.webp`), au moins 1 600 px de large si possible.
2. Renommez-la **exactement** avec le nom de l’emplacement, puis déposez-la dans `public/photos/` en remplaçant l’ancienne :

| Emplacement | Nom du fichier |
|---|---|
| Grande photo de chantier (section « Notre histoire ») | `chantier.jpg` |
| Notre histoire | `histoire.jpg` |
| Réalisation 1, 2, 3 | `realisation-1-avant.jpg`, `realisation-1-apres.jpg`, … jusqu’à `realisation-3-apres.jpg` |
| Photos des pages prestations (2 par page) | `prestation-fondations-gros-oeuvre-1.jpg`, `-2.jpg`, et de même pour `maconnerie-extensions`, `toiture`, `electricite`, `plomberie`, `placo-amenagement` |
| Image affichée lors d’un partage (Facebook, WhatsApp) | `public/og-image.jpg` (1 200 × 630 px) |

3. Dans `src/data/site.ts`, remplacez le texte `alt` de la photo par une courte description de ce qu’elle montre (ex. `'Mur de clôture en pierre à Maillane'`). Ce texte est lu aux personnes malvoyantes et aide Google.

Les photos sont **optimisées automatiquement** à chaque build (formats AVIF et WebP, 5 tailles). Seules ces versions légères sont publiées ; l’original n’est pas mis en ligne.

Les photos actuelles sont des **images de remplacement** (motif de pierre neutre). Pour recréer une image de remplacement manquante : `node scripts/create-placeholders.mjs` (n’écrase jamais une vraie photo).

---

## 2. Lancer le site sur son ordinateur

Prérequis : [Node.js](https://nodejs.org) version 22 ou plus.

```bash
npm install        # une seule fois
npm run dev        # site visible sur http://localhost:4321, mis à jour à chaque modification
```

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm run build` | Fabrique le site final dans `dist/` (vérifie aussi qu’il n’y a pas d’erreur) |
| `npm run check` | **À lancer après chaque modification.** Build, puis tous les contrôles : HTML valide, liens cassés, accessibilité (axe), Lighthouse sur chaque page, affichage de 360 à 1 440 px, formulaire avec et sans JavaScript. Environ 5 minutes. Affiche « ✓ Audit : tous les objectifs sont atteints » si tout va bien. |
| `npm run check:rapide` | Les mêmes contrôles sans Lighthouse ni liens externes (environ 1 minute) |
| `npm run a-completer` | Liste tous les `[À COMPLÉTER]` restants, avec le fichier et la ligne |
| `npm run serve` | Sert `dist/` sur http://localhost:4400 avec les mêmes en-têtes de sécurité qu’en production |

---

## 3. Le formulaire de contact

Le formulaire utilise **Web3Forms** (offre gratuite, avec un nombre de messages mensuels limité ; aucun serveur à gérer) : les demandes arrivent directement par e-mail.

1. Allez sur <https://web3forms.com>, saisissez l’adresse e-mail qui doit recevoir les demandes et récupérez la **clé d’accès** (« Access Key »).
2. En local : copiez `.env.example` en `.env` et collez la clé après `PUBLIC_WEB3FORMS_KEY=`.
3. Sur Netlify ou Vercel : ajoutez la variable `PUBLIC_WEB3FORMS_KEY` dans les réglages du site (voir plus bas), puis relancez un déploiement.

Cette clé n’est pas un secret : elle figure par conception dans le code de la page et ne permet que d’envoyer un message vers votre adresse.

Fonctionnement :

- **Anti-spam** : un champ piège invisible (« honeypot »). Si du spam passe quand même, Web3Forms propose un captcha gratuit (hCaptcha). Il faudra alors autoriser `hcaptcha.com` dans la politique de sécurité (CSP) de `netlify.toml` / `vercel.json`.
- **Sans JavaScript**, le formulaire fonctionne quand même : après l’envoi, le visiteur arrive sur la page `/merci/`.
- **Avec JavaScript**, le message de confirmation s’affiche sans quitter la page.

---

## 4. Mettre le site en ligne

### Option A : Netlify (recommandé)

1. Créez un compte gratuit sur <https://www.netlify.com>.
2. « Add new site » → « Import an existing project » → choisissez ce dépôt GitHub.
3. Les réglages sont lus automatiquement dans `netlify.toml` (commande `npm run build`, dossier `dist`).
4. Dans « Site configuration » → « Environment variables », ajoutez :
   - `PUBLIC_WEB3FORMS_KEY` = votre clé Web3Forms ;
   - `SITE_URL` = l’adresse définitive, par exemple `https://www.mon-entreprise.fr`.
5. Lancez le déploiement (« Deploy »). À chaque modification poussée sur GitHub, le site se met à jour tout seul.

### Option B : Vercel

1. Créez un compte gratuit sur <https://vercel.com>, puis « Add New Project » → importez ce dépôt.
2. Les réglages sont lus dans `vercel.json`.
3. Ajoutez les deux mêmes variables (`PUBLIC_WEB3FORMS_KEY`, `SITE_URL`) dans « Settings » → « Environment Variables », puis redéployez.

### Brancher un nom de domaine

1. Achetez le domaine chez un registraire (OVH, Gandi, etc.), par exemple `mon-entreprise.fr`.
2. Dans Netlify : « Domain management » → « Add a domain ». Dans Vercel : « Settings » → « Domains ».
3. L’hébergeur indique les enregistrements DNS à créer chez le registraire (souvent un enregistrement `A` et un `CNAME` pour `www`). La propagation prend de quelques minutes à 24 h.
4. Le certificat HTTPS est fourni automatiquement et gratuitement.
5. Mettez à jour `SITE_URL` avec l’adresse définitive (elle sert au sitemap, aux liens de partage et à Google), puis redéployez.
6. Renseignez l’hébergeur dans `legal.host` (`src/data/site.ts`) pour les mentions légales.

### Après la mise en ligne

- Déclarez le site dans [Google Search Console](https://search.google.com/search-console) et envoyez le plan du site : `https://votre-domaine/sitemap-index.xml`.
- Ajoutez l’adresse du site sur la fiche Google de l’entreprise.

---

## 5. Cookies et statistiques

Le site **ne dépose aucun cookie** et n’utilise aucun outil de mesure d’audience. Aucune bannière de consentement n’est donc nécessaire.

Si vous ajoutez plus tard un outil de statistiques :

- choisissez une solution **sans cookies** et respectueuse du RGPD (par exemple Plausible, Umami ou les statistiques intégrées de Netlify ou Vercel), ou bien un outil configuré en mode exempté de consentement selon les règles de la CNIL ;
- sinon (Google Analytics, pixel Facebook…), une **bannière de consentement** devient obligatoire, et il faudra mettre à jour la page `/confidentialite/` ;
- dans tous les cas, ajoutez le domaine de l’outil à la CSP (`script-src` / `connect-src`) dans `netlify.toml` et `vercel.json`.

---

## 6. Organisation du code (pour un développeur)

```
src/data/site.ts           ← TOUT le contenu
src/components/            ← blocs de page (Hero, Services, Story, ContactForm…)
src/layouts/Base.astro     ← squelette commun (SEO, polices, en-tête, pied de page)
src/pages/                 ← une page = un fichier : index, prestations/index + [slug] (6 pages), notre-histoire, realisations, contact, pages légales
src/styles/tokens.css      ← couleurs, typographies, espacements (design tokens)
src/styles/global.css      ← styles de base, boutons, cartes, champs, impression
public/photos/             ← photos originales (optimisées au build)
public/fonts/              ← polices auto-hébergées (Barlow Condensed, Inter ; licence OFL)
scripts/                   ← optimisation des images et contrôles qualité
netlify.toml / vercel.json ← déploiement et en-têtes de sécurité
AUDIT.md                   ← résultats de l’audit qualité
```

Stack : Astro 7 (sortie 100 % statique), CSS natif, environ 2,5 Ko de JavaScript côté navigateur (menu mobile, formulaire, comparateur avant/après, démarrage des scènes), aucune dépendance chargée depuis un site tiers.

---

## 7. La coupe de la maison et les animations

La page d'accueil est construite comme une feuille de plan : la **coupe de la maison** (`src/components/Coupe.astro`) montre les six métiers à leur place, des fondations (repère A) à la toiture (repère F). Chaque repère est un lien vers la prestation. Les noms courts et les repères se changent dans `src/data/site.ts` (`short` et `mark` de chaque prestation). Sur chaque page prestation, une petite coupe met le niveau concerné en ocre.

**Le site compte 15 pages** : accueil, `/prestations/` (la coupe et la légende) et ses 6 pages métier, `/notre-histoire/`, `/realisations/`, `/contact/` (coordonnées, formulaire, secteur), plus les mentions légales, la confidentialité, la confirmation `/merci/` et la page 404. L'accueil présente chaque rubrique en court et renvoie vers sa page.

**Animations** :
- **Accueil** (et page Prestations) : la maison se construit de bas en haut au chargement, puis le fil à plomb descend.
- **Pages intérieures** : la même coupe, avec un ouvrier en trait fin qui travaille à l'endroit du métier : il creuse (fondations), monte le mur rang par rang (maçonnerie), serre un raccord puis l'eau coule (plomberie), branche le luminaire qui s'allume (électricité), visse une plaque (placo), pose les tuiles (toiture). Sur « Notre histoire », le père montre et le fils travaille ; sur « Contact », l'ouvrier remplit et coche un devis.
- Chaque scène dure quelques secondes, démarre quand elle apparaît à l'écran, puis s'arrête sur le travail terminé.
- Les scènes sont dans `src/components/Coupe.astro` (variant `scene`) ; réglages des courbes et durées dans `src/styles/tokens.css`.

- Le **comparateur avant/après** des réalisations se manipule à la souris, au doigt ou au clavier (curseur). Sans JavaScript, les deux photos s'affichent côte à côte.
- Le **cartouche** de l'accueil (encadré en bas à droite) permet de choisir le type de travaux : le formulaire de devis s'ouvre déjà rempli.
- Les visiteurs qui ont activé « réduire les animations » sur leur appareil ne voient que des fondus, sans mouvement.

## 8. Skills Claude Code installés

Le dossier `.claude/skills/` contient 37 skills de design et d'animation (Anthropic, Vercel, GreenSock/GSAP, LottieFiles, Emil Kowalski…), chargés automatiquement par Claude Code dans ce projet. Leur origine et leur licence sont listées dans `.claude/skills/SOURCES.md`.

Le skill **Impeccable** (`/impeccable`) a servi à la refonte : critique, contrat de direction (`.impeccable/briefs/accueil.md`) et système de design (`DESIGN.md`). Ses scripts sont installés : `.claude/skills/impeccable/scripts/impeccable detect --json src` lance son détecteur de défauts de design.

Exemples d'utilisation : demandez « revois les animations » (`review-animations`), « fais une critique du design » (`design-critique`), « audit d'accessibilité » (`accessibility-review`).

## 9. Liste complète des éléments `[À COMPLÉTER]`

Générée avec `npm run a-completer` (relancez la commande pour une liste à jour après vos modifications).

### Identité et obligations légales — `src/data/site.ts`

| Ligne | Élément |
|---|---|
| 19 | Nom de l’entreprise (`company.name`) |
| 21 | Nom de famille de Stéphane (`company.owner`) |
| 24 | Forme juridique (entreprise individuelle, SARL…) |
| 25 | SIRET |
| 26 | N° de TVA intracommunautaire (ou « non applicable ») |
| 27 | Immatriculation RCS ou Répertoire des métiers |
| 30 | Assurance décennale : nom de l’assureur |
| 31 | Assurance décennale : n° de contrat |
| 32 | Assurance décennale : zone géographique couverte |
| 57 | Texte du logo (`site.logoText`, en général identique au nom) |
| 67 | Directeur de la publication : nom de famille |
| 69 | Hébergeur : nom |
| 70 | Hébergeur : adresse |
| 71 | Hébergeur : site ou téléphone |
| 75 | Date de mise en ligne (mentions légales et confidentialité) |

### Coordonnées — `src/data/site.ts`

| Ligne | Élément |
|---|---|
| 38 | Téléphone affiché |
| 40 | Téléphone au format international (`+33…`) : non surligné, à modifier en même temps que la ligne 38 |
| 41 | Adresse e-mail |
| 43 | Adresse : rue |
| 44 | Adresse : code postal |
| 45 | Adresse : commune |
| 48 | Horaires affichés |
| 50 | Horaires pour Google (format `'Mo-Fr 07:30-18:00'`), facultatif |
| 52 | Lien de la fiche Google (avis clients) |

### Photos et réalisations — `src/data/site.ts`

| Ligne | Élément |
|---|---|
| 145, 146 | Descriptions (`alt`) des 2 photos « Fondations & gros œuvre » |
| 171, 172 | Descriptions des 2 photos « Maçonnerie & extensions » |
| 191, 192 | Descriptions des 2 photos « Toiture » |
| 211, 212 | Descriptions des 2 photos « Électricité » |
| 231, 232 | Descriptions des 2 photos « Plomberie » |
| 251, 252 | Descriptions des 2 photos « Placo & aménagement » |
| 264 | Description de la photo portrait « Notre histoire » |
| 266 | Description de la grande photo de chantier (« Notre histoire ») |
| 274 à 277 | Réalisation 1 : titre, commune, descriptions avant/après |
| 280 à 283 | Réalisation 2 : titre, commune, descriptions avant/après |
| 286 à 289 | Réalisation 3 : titre, commune, descriptions avant/après |
| — | Les 20 fichiers photo de `public/photos/` et `public/og-image.jpg` (actuellement des images de remplacement) |

### Configuration

| Fichier : ligne | Élément |
|---|---|
| `.env.example:4` → `.env`, ou variable chez l’hébergeur | `PUBLIC_WEB3FORMS_KEY` : **sans elle, le formulaire n’envoie rien** (un avertissement jaune s’affiche au-dessus du formulaire) |
| `.env.example:6` → `.env`, ou variable chez l’hébergeur | `SITE_URL` : adresse définitive du site |
| `src/pages/confidentialite.astro:35` | Vérifier les garanties de transfert de données du prestataire de formulaire (Web3Forms) |

Les messages `[À COMPLÉTER]` de `src/components/Area.astro:24` (lien Google) et `src/components/ContactForm.astro:32` (clé Web3Forms) disparaissent d’eux-mêmes dès que `googleReviewsUrl` et la clé sont renseignés.
