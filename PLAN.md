# Plan — site vitrine [NOM DE L'ENTREPRISE]

1. **Stack** : Astro (sortie 100 % statique), CSS natif avec design tokens, JS client limité au menu mobile et à l'envoi du formulaire (le site fonctionne sans JS).
2. **Contenu** : un seul fichier `src/data/site.ts` (coordonnées, prestations, communes, réalisations, photos, textes légaux variables). Aucun texte métier dans les composants.
3. **Arborescence** : `/`, `/prestations/<slug>/` (×6), `/mentions-legales/`, `/confidentialite/`, `/merci/` (confirmation formulaire sans JS), `/404`.
4. **Composants** (`src/components/`) : Header (nav + burger), Hero, ServiceCard, ServicesSection, Story, Realisations, Secteur, ContactSection (+ ContactForm), Footer, Photo (images optimisées), Icon (SVG trait fin), Seo (meta, OG, JSON-LD).
5. **Layout** : `src/layouts/Base.astro` (head SEO, polices, skip link, header/footer).
6. **Styles** : `src/styles/tokens.css` (couleurs, typo, espacements, rayons), `global.css` (base + composants : boutons, cartes, champs).
7. **Polices** : Barlow Condensed 600/700 + Inter 400/500/600 auto-hébergées via `@fontsource` (woff2 servis depuis le site, aucun appel Google).
8. **Images** : originaux dans `public/photos/` (noms fixes), script `scripts/optimize-images.mjs` (sharp) qui génère AVIF/WebP en plusieurs largeurs avant chaque build.
9. **Formulaire** : Web3Forms (POST HTML classique → page `/merci/`, amélioré en JS), clé dans `PUBLIC_WEB3FORMS_KEY` (`.env.example`), honeypot `botcheck`, case RGPD obligatoire.
10. **SEO / déploiement** : `@astrojs/sitemap`, `robots.txt`, canonical, Open Graph, JSON-LD `GeneralContractor` ; config Netlify (`netlify.toml`) et Vercel (`vercel.json`) avec en-têtes de sécurité (CSP stricte, sans `unsafe-inline` pour les scripts).
