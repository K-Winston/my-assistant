---
name: Site vitrine — maçonnerie générale, tous corps d’état
description: Une feuille de plan d’architecte, des fondations à la toiture.
colors:
  anthracite: "#1e1c19"
  anthracite-2: "#2a2722"
  creme: "#f5f1ea"
  blanc-carte: "#ffffff"
  bordure-carte: "#e3dccf"
  contour-champ: "#8a806f"
  ocre: "#e0a458"
  ocre-clair: "#ebb673"
  ocre-fonce: "#8a5a1e"
  texte: "#1e1c19"
  texte-2: "#5a544b"
  sur-fonce: "#f5f1ea"
  sur-fonce-2: "#c9c1b3"
  filet-fonce: "#3d3830"
  trait-coupe: "#ddd5c7"
  hachure: "#6e665a"
  ligne-rappel: "#8f8677"
  quadrillage: "rgba(245, 241, 234, 0.045)"
  erreur: "#a3261b"
  succes: "#2f6b2a"
typography:
  display:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', 'Roboto Condensed', sans-serif-condensed, sans-serif"
    fontSize: "clamp(2.75rem, 1.2rem + 6.4vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', 'Roboto Condensed', sans-serif-condensed, sans-serif"
    fontSize: "clamp(2.125rem, 1.7rem + 1.9vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.005em"
  title:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', 'Roboto Condensed', sans-serif-condensed, sans-serif"
    fontSize: "clamp(1.5rem, 1.35rem + 0.6vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0.005em"
  title-sm:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', 'Roboto Condensed', sans-serif-condensed, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.1
  label-repere:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', 'Roboto Condensed', sans-serif-condensed, sans-serif"
    fontSize: "clamp(0.8rem, 0.55rem + 1.1vw, 1.2rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.03em"
  quote:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.3rem, 1.05rem + 1vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.35
  lead:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.6
  caption:
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "2px"
  md: "4px"
  repere: "50%"
spacing:
  sp-1: "0.25rem"
  sp-2: "0.5rem"
  sp-3: "0.75rem"
  sp-4: "1rem"
  sp-5: "1.5rem"
  sp-6: "2rem"
  sp-7: "3rem"
  sp-8: "4rem"
  sp-9: "6rem"
  section-y: "clamp(3.5rem, 2.5rem + 4vw, 6.5rem)"
  gutter: "clamp(1rem, 0.6rem + 2vw, 2.5rem)"
  tap: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ocre}"
    textColor: "{colors.anthracite}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ocre-clair}"
    textColor: "{colors.anthracite}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.texte}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.texte}"
    textColor: "{colors.creme}"
  button-secondary-on-dark-hover:
    backgroundColor: "{colors.sur-fonce}"
    textColor: "{colors.anthracite}"
  card:
    backgroundColor: "{colors.blanc-carte}"
    textColor: "{colors.texte}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  input:
    backgroundColor: "{colors.blanc-carte}"
    textColor: "{colors.texte}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
    height: "48px"
  input-on-dark:
    backgroundColor: "{colors.anthracite-2}"
    textColor: "{colors.sur-fonce}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
    height: "48px"
  cartouche:
    backgroundColor: "{colors.anthracite}"
    textColor: "{colors.sur-fonce-2}"
    rounded: "0"
    padding: "1rem 1.5rem"
  repere:
    backgroundColor: "transparent"
    textColor: "{colors.sur-fonce}"
    typography: "{typography.label-repere}"
    rounded: "{rounded.repere}"
    size: "1.55em"
  repere-actif:
    backgroundColor: "{colors.ocre}"
    textColor: "{colors.anthracite}"
  legende-ligne:
    backgroundColor: "transparent"
    textColor: "{colors.texte}"
    typography: "{typography.title}"
    padding: "1.5rem 0.75rem"
  legende-ligne-hover:
    backgroundColor: "{colors.blanc-carte}"
  nav-lien:
    textColor: "{colors.sur-fonce}"
    height: "44px"
  nav-lien-hover:
    textColor: "{colors.ocre}"
---

# Design System: Site vitrine — maçonnerie générale, tous corps d’état

## Overview

**Creative North Star: "La feuille de plan"**

Le site se lit comme un tirage d’architecte posé sur la table de chantier. Le haut de la page est un calque anthracite quadrillé où une coupe de maison en trait crème, tracée comme une coupe de principe, empile les six métiers dans l’ordre où ils se construisent : terre et fondations, murs, réseaux, doublages, charpente et couverture. Chaque niveau porte un repère cerclé A à F, et ces repères sont la navigation. L’ocre n’apparaît que là où l’œil doit se poser : le repère actif, le fil à plomb, le bouton de devis.

Le reste de la page passe sur papier crème et garde le vocabulaire du plan sans le décor : légendes à filets, cartouche à cellules, titres en capitales condensées comme un lettrage de plan, photos aux coins à peine cassés. La densité est celle d’un document technique bien tenu : des filets fins plutôt que des boîtes, des rangées plutôt que des grilles de cartes, beaucoup d’air vertical entre les sections.

Rejets confirmés par la charte et le brief : pas de dégradés décoratifs, pas d’emoji, pas d’icônes pleines ; pas de hero texte et photo suivi d’une grille de six cartes.

**Key Characteristics:**
- Deux supports seulement : calque anthracite (#1e1c19) et papier crème (#f5f1ea), avec des cartes blanches ponctuelles.
- Le dessin est le système : hachures, lignes de cote, lignes de rappel, repères cerclés A–F, cartouche.
- Ocre rare et fonctionnel ; ocre foncé pour les icônes et liens sur fond clair.
- Capitales Barlow Condensed pour les titres, Inter pour tout le texte courant.
- Plat : profondeur portée par le trait, le filet et l’opacité, jamais par l’ombre.

## Colors

Une palette de chantier en pierre et en mine de plomb, chauffée par un seul ocre.

### Primary
- **Ocre de chantier** (`ocre`) : repère actif, fil à plomb, bouton principal, logo, icônes sur fond foncé, sélection de texte, contour de focus sur fond foncé. Toujours avec du texte anthracite dessus, jamais du blanc.
- **Ocre clair** (`ocre-clair`) : uniquement l’état survol du bouton principal (valeur littérale dans le code, pas encore en variable).
- **Ocre brûlé** (`ocre-fonce`) : la voix de l’ocre sur fond clair, là où l’ocre pur manquerait de contraste : icônes en trait, flèches de légende, liens « en savoir plus », contour de focus, cases à cocher, curseur de texte.

### Neutral
- **Anthracite calque** (`anthracite`) : fond de l’en-tête, du hero, des bandeaux d’appel, du secteur et du pied de page ; aussi le texte principal sur crème (`texte`).
- **Anthracite relevé** (`anthracite-2`) : second plan sur fond foncé (encart avis, champ du cartouche).
- **Papier crème** (`creme`) : fond par défaut de la page et des sections de contenu ; texte principal sur fond foncé (`sur-fonce`).
- **Blanc carte** (`blanc-carte`) : cartes, champs de formulaire, survol d’une ligne de légende.
- **Bordure pierre** (`bordure-carte`) : contour des cartes et filets de séparation sur crème.
- **Contour de champ** (`contour-champ`) : contour des champs (≥ 3:1 sur blanc) et filets de la légende des prestations.
- **Texte secondaire** (`texte-2`) et **texte secondaire sur foncé** (`sur-fonce-2`) : chapôs, descriptions, légendes, pied de page.
- **Filet sombre** (`filet-fonce`) : filets, cadres et séparateurs sur fond foncé.

### Tertiary — encres du dessin
- **Trait de coupe** (`trait-coupe`) : le trait principal du dessin.
- **Hachure** (`hachure`) : hachures de matériaux, cotes, niveau ±0,00.
- **Ligne de rappel** (`ligne-rappel`) : les lignes qui relient un niveau à son étiquette.
- **Quadrillage** (`quadrillage`) : la trame 24 px du calque, à peine visible.

### États
- **Erreur** (`erreur`) et **succès** (`succes`) : champs invalides, astérisques obligatoires, messages d’envoi du formulaire. Rien d’autre.

### Named Rules
**The Repère Actif Rule.** L’ocre signale ce qui est actif ou ce qu’il faut faire : le niveau survolé ou sélectionné, le fil à plomb, le bouton de devis. Il ne remplit jamais une surface de section.

**The Ocre Foncé sur Crème Rule.** Sur fond clair, l’accent passe en ocre brûlé ; l’ocre pur n’y sert que de fond de bouton ou de repère rempli, avec texte anthracite.

## Typography

**Display Font:** Barlow Condensed 600/700 (avec Arial Narrow, Roboto Condensed)
**Body Font:** Inter 400/500/600 (avec system-ui)

**Character:** Un lettrage de plan, haut et serré, posé sur un texte courant net et neutre. Les deux familles sont auto-hébergées en woff2 latin, `font-display: swap`.

### Hierarchy
- **Display** (700, clamp 2.75 → 6rem, interligne 0.95) : le titre du hero, pleine largeur, en capitales.
- **Headline** (700, clamp 2.125 → 3.25rem, 1.05) : titres de section (h2), largeur limitée (14 à 16ch).
- **Title** (600, clamp 1.5 → 1.875rem, 1.05) : titres de lignes de légende, communes du secteur, h2 des pages prestations.
- **Title-sm** (600, 1.375rem) : titres de réalisations, h4.
- **Label repère** (600, clamp 0.8 → 1.2rem, +0.03em, capitales) : étiquettes de la coupe ; les lettres A–F des repères en 700.
- **Quote** (Inter 500, clamp 1.3 → 1.75rem, 1.35) : la phrase de transmission dans l’histoire, max 30ch.
- **Lead** (Inter 400, 1.1875rem, texte secondaire) : chapô sous un titre de section.
- **Body** (Inter 400, 1.0625rem, 1.6) : texte courant, paragraphes limités à 40rem.
- **Label** (Inter 600, 0.9375rem) : libellés de champs, boutons, titres de colonnes du pied de page.
- **Caption** (Inter 400, 0.8125rem) : légende de la coupe, aides de champ, étiquettes Avant/Après.

### Named Rules
**The Lettrage de Plan Rule.** Tous les titres h1–h4 sont en Barlow Condensed majuscules, `text-wrap: balance`. Le texte courant, les boutons et les libellés restent en Inter casse normale : jamais de paragraphe en condensé.

## Layout

Conteneur unique de 76rem plus deux gouttières fluides (1 → 2.5rem). Les sections respirent avec un rythme vertical fluide (`section-y`, 3.5 → 6.5rem) ; les espacements internes suivent une échelle base 4 px (`sp-1` à `sp-9`).

Le hero est une feuille encadrée d’un filet : titre pleine largeur en haut, puis à partir de 64rem une grille 7fr / 5fr avec la coupe à gauche et le cartouche aligné en bas à droite. Les sections suivantes alternent des compositions asymétriques plutôt que des grilles régulières : en-tête de section sur deux colonnes (titre / chapô alignés en bas), légende en rangées pleine largeur, histoire sur grille 12 colonnes à zones nommées, réalisations en 2fr / 1fr avec une pièce vedette, secteur et contact en 3fr / 2fr et 2fr / 3fr.

Points de rupture observés : 30rem (logo et menu compactés), 40rem (étiquettes de la coupe sous le dessin en deux colonnes, formulaires sur deux colonnes), 48rem (légende sur une ligne, en-têtes de page avec aparté), 64rem (navigation en ligne, grilles à deux colonnes). Toute zone cliquable fait au moins 44 px.

## Elevation & Depth

Le système est plat. La profondeur est celle d’un dessin : traits de graisses différentes (1 → 7 px dans la coupe), filets de 1 px pour séparer, filet de 2 px pour ouvrir une légende, et estompage à 25 % d’opacité des niveaux non actifs de la coupe. Le seul relief est le passage du calque anthracite au papier crème. La seule ombre du site est fonctionnelle : la poignée ronde du comparateur avant/après, pour qu’elle se détache d’une photo quelconque.

### Shadow Vocabulary
- **Poignée** (`box-shadow: 0 2px 10px rgba(30, 28, 25, 0.35)`) : uniquement la poignée du comparateur posée sur photo.

### Named Rules
**The Trait Pas Ombre Rule.** On sépare par un filet, on hiérarchise par la graisse du trait ou l’opacité ; on n’ajoute pas d’ombre portée à une carte, un bouton ou un panneau.

## Shapes

Coins de pierre taillée : 2px pour les boutons, champs, photos et étiquettes, 4px pour les cartes et les vignettes de liens. Les seules formes rondes sont les repères cerclés (A–F dans la coupe, dans la légende et sur mobile) et la poignée du comparateur, en clin d’œil aux repères de plan. Les cadres de plan (feuille du hero, cartouche) ont des angles vifs. Les icônes sont en trait de 1.5 px, extrémités et jonctions arrondies, sans remplissage.

## Components

### Buttons
Francs et compacts, comme un tampon sur un plan.
- **Shape :** angles à peine cassés (2px), bordure 2px, hauteur minimale 44px.
- **Primary :** fond ocre, texte anthracite, Inter 600, padding 0.75rem × 1.5rem ; survol en ocre clair.
- **Secondary :** fond transparent, bordure et texte de la couleur du texte ; au survol il se remplit (anthracite sur crème, crème sur fond foncé).
- **Press :** léger enfoncement `scale(0.97)` en 160ms `cubic-bezier(0.23, 1, 0.32, 1)`, supprimé en mouvement réduit. Couleurs en 200ms.
- **Focus :** contour 3px ocre brûlé (ocre sur fond foncé), décalé de 3px.

### Cards / Containers
- **Corner Style :** 4px.
- **Background :** blanc carte sur crème ; anthracite relevé sur fond foncé (encart avis).
- **Shadow Strategy :** aucune (voir Elevation & Depth).
- **Border :** 1px bordure pierre (filet sombre sur fond foncé) ; au survol d’une vignette-lien, la bordure passe en ocre brûlé.
- **Internal Padding :** 1.5rem (`sp-5`), 2rem pour les encarts.

### Inputs / Fields
- **Style :** fond blanc, contour 1px `contour-champ`, coins 2px, hauteur 48px, texte 16px minimum (pas de zoom iOS). Sélecteur avec chevron en trait fin.
- **Focus :** contour 3px ocre brûlé décalé de 1px, bordure qui passe en anthracite.
- **Error :** bordure rouge erreur, astérisque obligatoire en rouge erreur.
- **Sur fond foncé (cartouche) :** fond anthracite relevé, texte crème, contour `sur-fonce-2`, focus ocre.

### Navigation
- **En-tête :** collant, anthracite, filet bas sombre, hauteur 4.5rem. Logo en Barlow Condensed 700 capitales avec pictogramme ocre. Liens Inter 500 crème, ocre au survol.
- **Mobile (< 64rem) :** bouton « Menu » à filet, panneau déroulant anthracite à rangées filetées (52px), bouton devis pleine largeur ; entrée 200ms en fondu + 8px.
- **Fil d’Ariane :** texte secondaire sur foncé, séparateurs « / » en filet sombre.

### La coupe (composant signature)
Coupe de principe de la maison en SVG, traits à épaisseur constante (`vector-effect: non-scaling-stroke`). Hachures par matériau : terre à 45°, béton en granulats, maçonnerie en appareil de briques, isolant en ondulation. Six niveaux A (fondations) → F (toiture), chacun relié par une ligne de rappel terminée d’un point à une étiquette-lien HTML à droite du dessin. Au survol ou au focus d’une étiquette, son niveau passe en ocre et les autres tombent à 25 % d’opacité. Variante compacte (pages prestations) : un niveau fixé en ocre, sans étiquettes. Sous 40rem, les étiquettes passent en liste sous le dessin et des repères cerclés apparaissent dans le dessin. Entrée : la maison se construit de bas en haut (fondations 0ms → toiture tracée 600–1300ms → fil à plomb 1300ms → étiquettes 1350ms+), en fondus seuls si le mouvement est réduit.

### Cartouche
Bloc à cellules d’un cartouche de plan : cadre 1px `sur-fonce-2`, cellules séparées par des filets sombres, padding 1rem × 1.5rem. Contient l’accroche, les garanties avec coche ocre, le sélecteur de type de travaux et le bouton devis, puis l’appel.

### Légende (prestations)
La légende de la coupe sur papier : liste ouverte par un filet anthracite de 2px, une rangée par métier séparée de filets 1px, repère cerclé (2.25rem, bordure 1.5px), titre Barlow, description, flèche ocre brûlé. Toute la rangée est cliquable ; au survol, fond blanc, repère rempli d’ocre, flèche qui avance de 6px (pointeur fin uniquement).

### Comparateur avant/après
Deux photos côte à côte sans JavaScript ; avec JavaScript, superposées avec une limite ocre de 2px et une poignée ronde ocre, pilotée par un vrai `input range` accessible au clavier.

## Do's and Don'ts

### Do:
- **Do** utiliser le vocabulaire du plan pour structurer : filets, repères cerclés A–F, cartouche, lignes de rappel, hachures.
- **Do** réserver l’ocre au repère actif, au fil à plomb et à l’action principale, avec du texte anthracite dessus.
- **Do** passer en ocre brûlé pour toute icône, flèche ou lien accentué sur fond crème.
- **Do** dessiner les icônes en trait de 1.5px, sans remplissage, extrémités arrondies.
- **Do** garder les coins à 2px (contrôles, photos) ou 4px (cartes), et garder les cadres de plan à angles vifs.
- **Do** donner 44px minimum à toute zone cliquable et un focus visible de 3px.
- **Do** prévoir une version réduite de chaque animation qui garde les fondus et retire les déplacements.
- **Do** laisser visibles les mentions « [À COMPLÉTER : …] » plutôt qu’inventer un contenu.

### Don't:
- **Don't** utiliser de dégradé décoratif, d’emoji ou d’icône pleine.
- **Don't** ajouter d’ombre portée à une carte, un bouton ou un panneau (seule la poignée du comparateur en porte une).
- **Don't** composer une section en grille de cartes identiques quand une légende en rangées dit la même chose.
- **Don't** poser du texte blanc sur l’ocre, ni de l’ocre pur comme couleur de texte sur crème.
- **Don't** écrire du texte courant en Barlow Condensed ni des titres en casse normale.
- **Don't** ajouter un sur-titre au-dessus d’un titre de section.
