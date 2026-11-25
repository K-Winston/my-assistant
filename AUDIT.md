# Audit du site — [NOM DE L’ENTREPRISE]

Audit réalisé sur le **build de production** (`dist/`), servi localement avec les mêmes en-têtes HTTP que la production (`scripts/serve.mjs` lit `netlify.toml`).

## Outils utilisés

| Contrôle | Outil | Statut |
|---|---|---|
| Performance, accessibilité, bonnes pratiques, SEO | Lighthouse 13.6 (profil mobile, réseau simulé 4G lente) | ✅ exécuté |
| Accessibilité WCAG 2.2 A/AA + bonnes pratiques | axe-core (`@axe-core/playwright`), après défilement complet de la page | ✅ exécuté |
| Validation HTML | html-validate 11.22 (règles « recommended ») | ✅ exécuté |
| Liens cassés | linkinator 8.1 (passe « avant »), puis vérificateur interne `scripts/check-links.mjs` (liens, images, `srcset`, ancres `#`) | ✅ exécuté |
| Responsive (360 / 768 / 1280 / 1440 px), zones cliquables ≥ 44 px | `scripts/check-responsive.mjs` (Playwright) | ✅ exécuté |
| Erreurs console et violations CSP | Playwright (CSP de production appliquée) | ✅ exécuté |
| Dépendances vulnérables | `npm audit` | ✅ exécuté |
| Revue de code | `/review` (skill code-review, niveau medium) | ✅ exécuté |
| Revue de sécurité | `/security-review` | ✅ exécuté |
| Types / templates | `astro check` (inclus dans `npm run build`) | ✅ exécuté |

Aucun outil n’a été impossible à installer.

## Tableau des scores

Lighthouse : Perf / Accessibilité / Bonnes pratiques / SEO. LCP et CLS mesurés par Lighthouse (mobile simulé).

### Avant corrections

| Page | Lighthouse (P / A / BP / SEO) | LCP | CLS | Erreurs axe | Erreurs HTML | Erreurs console |
|---|---|---|---|---|---|---|
| `/` | 99 / 100 / 100 / 100 | 1,95 s | 0 | 0 | 17 | 0 |
| `/prestations/fondations-gros-oeuvre/` | 100 / 100 / 100 / 100 | 1,05 s | 0 | 0 | 15 | 0 |
| `/prestations/maconnerie-extensions/` | 100 / 100 / 100 / 100 | 1,05 s | 0 | 0 | 15 | 0 |
| `/prestations/toiture/` | 100 / 100 / 100 / 100 | 1,05 s | 0 | 0 | 15 | 0 |
| `/prestations/electricite/` | 100 / 100 / 100 / 100 | 1,05 s | 0 | 0 | 15 | 0 |
| `/prestations/plomberie/` | 100 / 100 / 100 / 100 | 1,05 s | 0 | 0 | 15 | 0 |
| `/prestations/placo-amenagement/` | 100 / 100 / 100 / 100 | 1,05 s | 0 | 0 | 15 | 0 |
| `/mentions-legales/` | 100 / 100 / 100 / 100 | 0,90 s | 0 | 0 | 7 | 0 |
| `/confidentialite/` | 100 / 100 / 100 / 100 | 0,90 s | 0 | 0 | 7 | 0 |
| `/merci/` | 100 / 100 / 100 / **66** | 0,90 s | 0 | 0 | 7 | 0 |
| `/404` | 100 / 100 / 100 / **66** | 0,90 s | 0 | 0 | 7 | 0 |

- **Liens** : linkinator 146 liens, 0 cassé ; vérificateur interne 147 liens et ancres, 0 cassé.
- **Erreurs HTML** (135 au total) : `tel-non-breaking` ×126, `long-title` ×7, `input-attributes` ×1, `valid-autocomplete` ×1.
- **npm audit** : 0 vulnérabilité dans les dépendances de production ; 3 **modérées** dans des outils de développement (`glob` / `minimatch`, via linkinator). Aucune haute ni critique.
- **Revue de sécurité** : aucune vulnérabilité à haute confiance (détail plus bas).

<!-- APRES -->

## Faiblesses relevées

Légende : 🔴 bloquant · 🟠 important · 🟡 mineur. La colonne « État » indique le résultat de la phase de correction.

### 🔴 Bloquant

Aucun défaut de code bloquant. En revanche, **la mise en ligne reste bloquée par des informations à fournir par le client** (voir la section « Hors code »).

### 🟠 Important

| # | Fichier | Problème | Impact | Correctif | État |
|---|---|---|---|---|---|
| O1 | `src/components/Footer.astro`, `ContactSection.astro`, `CtaBand.astro` | Espaces ordinaires dans le texte des liens `tel:` (126 erreurs `tel-non-breaking`) | Le numéro peut être coupé sur deux lignes, ce qui le rend illisible ou mal reconnu sur mobile | Option `nowrap` dans `Txt.astro` (espaces insécables) ; `.todo` passe à la ligne n’importe où pour éviter un débordement à 360 px | ✅ corrigé |
| O2 | `src/components/Seo.astro`, `src/data/site.ts` | Titres de page de plus de 70 caractères une fois le nom de l’entreprise ajouté | Titres tronqués dans Google | Le nom n’est ajouté que si le total reste ≤ 70 caractères ; les titres des prestations gardent « Saint-Rémy-de-Provence » en entier (mot-clé local prioritaire sur la marque) ; règle documentée à côté de `company.name` | ✅ corrigé |
| O3 | `src/components/ContactForm.astro` | `autocomplete="off"` sur la case piège (honeypot) : attribut invalide sur une case à cocher | HTML invalide (2 erreurs) | Attribut retiré | ✅ corrigé |
| O4 | `src/pages/404.astro` | `noindex` sur la page 404 → SEO Lighthouse à 66 | Score sous l’objectif. Inutile, car l’hébergeur renvoie déjà un statut HTTP 404 que Google n’indexe pas | `noindex` retiré | ✅ corrigé |
| O5 | `scripts/audit.mjs` (revue de code) | Rapports Lighthouse et html-validate d’une exécution précédente relus si l’outil échoue ; un échec Lighthouse ne faisait pas échouer l’audit | Un audit pouvait afficher « OK » sans avoir rien mesuré | Dossier `audit-reports/` vidé à chaque exécution, code de retour vérifié, « échec » = audit en échec | ✅ corrigé |
| O6 | `scripts/serve.mjs` (revue de code) | URL mal encodée → exception non gérée ; port occupé → promesse jamais résolue | L’audit plante ou reste bloqué | `try/catch` (réponse 400 ou 500), rejet si le port est pris | ✅ corrigé |
| O7 | `scripts/audit.mjs` (revue de code) | Poids des pages sous-estimé (lecture asynchrone des réponses non attendue) | Chiffres de poids faux | Toutes les lectures sont attendues avant le calcul | ✅ corrigé |
| O9 | `src/styles/global.css` (contrôle manuel des contrastes) | Contour des champs `#B9AE9B` sur blanc = 2,2:1, sous le minimum de 3:1 pour les composants d’interface (WCAG 1.4.11, non détecté par axe) | Champs difficiles à repérer pour les malvoyants | Nouveau token `--c-field-border: #8A806F` (3,9:1) | ✅ corrigé |
| O8 | `package.json` | linkinator (outil de dev) entraîne 3 vulnérabilités modérées et n’est plus utilisé par les scripts | Dépendance inutile | linkinator retiré, au profit du vérificateur interne | ✅ corrigé |

### 🟡 Mineur

| # | Fichier | Problème | Impact | Correctif | État |
|---|---|---|---|---|---|
| M1 | `src/components/CtaBand.astro`, `Hero.astro` | Le bouton « Appeler » n’annonce pas le numéro aux lecteurs d’écran | Un utilisateur de lecteur d’écran ne sait pas quel numéro sera composé | Numéro ajouté en texte masqué visuellement (« Appeler le 06… ») | ✅ corrigé |
| M2 | `scripts/check-links.mjs` (revue de code) | Tout statut externe ≠ 200 était compté comme lien cassé (Google répond souvent 403 ou 429 aux robots) | Faux positifs une fois le lien Google renseigné | 2xx et 3xx acceptés ; 401, 403 et 429 externes signalés en avertissement | ✅ corrigé |
| M3 | `dist/photos/*.jpg` | Les photos originales (non optimisées) étaient publiées alors qu’aucune page ne les utilise | Une photo de téléphone de 5 Mo serait accessible publiquement et consommerait la bande passante si on y accédait | Les originaux sont retirés de `dist/` après le build (hook dans `astro.config.mjs`) ; seules les versions AVIF et WebP sont publiées | ✅ corrigé |
| M4 | `src/pages/merci.astro` | SEO Lighthouse 66 (`noindex`) | Aucun : la page de confirmation **ne doit pas** être indexée | Exception assumée et documentée (voir plus bas) | ⏸ voulu |
| M5 | Formulaire | Seule protection anti-spam : le champ piège (honeypot) | Du spam peut passer si un robot cible ce site précisément | Si du spam arrive : activer le hCaptcha gratuit de Web3Forms (demande d’ajouter `hcaptcha.com` à la CSP) | ⏸ à surveiller |
| M6 | `public/photos/` | Photos de remplacement (motif de pierre neutre) | Le site ne montre pas encore de vrais chantiers | Déposer les vraies photos (voir README) | ⏸ client |

### Points contrôlés sans défaut

- **Contrastes (WCAG AA)** : 0 erreur axe `color-contrast`. Valeurs calculées : texte `#1E1C19` sur `#F5F1EA` = 15,1:1 ; texte secondaire `#5A544B` sur `#F5F1EA` = 6,7:1 (7,5:1 sur blanc) ; `#8A5A1E` (sur-titres, liens) sur `#F5F1EA` = 5,2:1 et sur blanc 5,9:1 ; ocre `#E0A458` sur `#1E1C19` = 7,8:1 ; texte des boutons `#1E1C19` sur ocre = 7,8:1 ; texte secondaire sur fond foncé `#C9C1B3` = 9,5:1 ; repères `[À COMPLÉTER]` ≥ 8,7:1.
- **Clavier et focus** : lien d’évitement « Aller au contenu », contour de focus de 3 px sur tous les éléments interactifs (`#8A5A1E` sur fond clair, `#E0A458` sur fond foncé), menu mobile avec `aria-expanded` et fermeture par Échap, ordre de tabulation logique, aucune case `tabindex` positive.
- **Textes alternatifs** : toutes les images ont un `alt` (axe `image-alt` : 0). Les icônes décoratives sont `aria-hidden`. Les `alt` des photos restent à rédiger au moment de déposer les vraies photos (marqués `[À COMPLÉTER]` dans `site.ts`).
- **Formulaire** : chaque champ a un `<label for>` (axe `label` : 0), champs obligatoires signalés (`required` + astérisque expliqué), aide liée par `aria-describedby`, message d’état dans une zone `role="status"`, `autocomplete` correct (`name`, `tel`, `address-level2`).
- **Poids des pages** : de 40 à 230 Ko environ selon la page (polices 117 Ko au total, préchargées : 2 fichiers). Images en AVIF et WebP, 5 largeurs, `loading="lazy"` sauf l’image du hero (`fetchpriority="high"`, préchargée).
- **Core Web Vitals** (Lighthouse, mobile simulé) : LCP de 0,9 à 2,0 s (objectif < 2,5 s), CLS = 0 sur toutes les pages (objectif < 0,1).
- **En-têtes de sécurité** (`netlify.toml` et `vercel.json`) : CSP stricte (`default-src 'self'`, scripts et styles sans `unsafe-inline`, `connect-src` et `form-action` limités à `api.web3forms.com`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive, `X-Frame-Options: DENY`, HSTS, `Cross-Origin-Opener-Policy`. Aucune violation CSP en console sur les 11 pages.
- **Secrets** : aucune clé dans le code. `.env` est ignoré par Git ; seul `.env.example` (vide) est versionné. La clé Web3Forms est publique par conception (elle figure dans le HTML du formulaire) et ne donne accès qu’à l’envoi de messages vers l’adresse configurée.
- **Revue de sécurité** (`/security-review`) : aucune vulnérabilité à haute confiance. Points examinés et écartés : JSON-LD injecté via `set:html` (données statiques, `<` échappé), icônes via `set:html` (dictionnaire figé), scripts client (uniquement `textContent`, la réponse du serveur n’est jamais affichée), CSP, traversée de répertoire dans `scripts/serve.mjs` (impossible, outil local), injection de commande dans les scripts (tableaux d’arguments, pas de shell), lien externe avec `rel="noopener"`.

### Exception assumée

- **`/merci/` : SEO 66.** Cette page de confirmation porte `noindex` et est exclue du sitemap et de `robots.txt`. C’est voulu : elle ne doit pas apparaître dans Google. Lighthouse retire donc des points à l’audit « Page bloquée pour l’indexation ».

## Hors code : informations à fournir avant la mise en ligne

Ces points bloquent la mise en ligne mais ne relèvent pas du code. La liste complète, avec fichier et ligne, se trouve dans `README.md`.

- Clé Web3Forms (`.env` → `PUBLIC_WEB3FORMS_KEY`) : **sans elle, le formulaire n’envoie rien**.
- Nom de l’entreprise, nom de famille de Stéphane, SIRET, immatriculation, TVA, forme juridique.
- Téléphone, e-mail, adresse, horaires.
- Assurance décennale : assureur, numéro de contrat, zone couverte. C’est une mention obligatoire sur les devis et les factures, et recommandée sur le site.
- Hébergeur (mentions légales), date de mise en ligne.
- Lien de la fiche Google (avis clients).
- Photos réelles et leurs descriptions (`alt`), titres et communes des 3 réalisations.
- Nom de domaine définitif (`SITE_URL`).
