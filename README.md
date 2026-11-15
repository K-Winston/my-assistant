# 🧪 Potion Tycoon

Jeu mobile **idle + fusion** : faites pousser des ingrédients, fusionnez des potions identiques pour en créer de plus puissantes, servez les clients de votre boutique d'alchimiste… et continuez à gagner de l'or même quand le jeu est fermé.

## Comment jouer
- 🫕 **Chaudron** : produit automatiquement des potions (tapez dessus pour accélérer).
- 🧪 **Étagère** : glissez une potion sur une potion identique pour la **fusionner** (niveau +1). Chaque potion posée rapporte de l'or par seconde.
- 🧙 **Clients** : glissez la potion demandée sur un client, ou tapez sur un client surligné en vert, pour toucher une grosse récompense.
- ⬆️ **Améliorations** : jardin (vitesse), chaudron enchanté (potions niv. 2), enseigne (multiplicateur de revenus).
- 🌙 **Gains hors ligne** : 50 % des revenus pendant votre absence (jusqu'à 8 h).
- 📖 **Livre de recettes** : 12 potions à découvrir.

## Développement
```bash
npm install
npm run dev      # serveur local (accessible depuis le téléphone sur le même Wi-Fi)
npm run build    # vérification TypeScript + build de production dans dist/
```

Stack : Vite + TypeScript, sans moteur de jeu (DOM + CSS). PWA installable et jouable hors ligne (`public/manifest.webmanifest`, `public/sw.js`). Sauvegarde dans `localStorage`.

| Fichier | Rôle |
|---|---|
| `src/data.ts` | Potions, améliorations, formules d'équilibrage, formatage des nombres |
| `src/state.ts` | État du jeu, logique (tick, fusion, clients, achats), sauvegarde |
| `src/main.ts` | Interface, glisser-déposer, modales, boucle de jeu |
| `src/style.css` | Styles mobiles |

## Déploiement sur Vercel
1. Sur vercel.com : **Add New → Project** → importez ce dépôt GitHub.
2. Vercel détecte Vite automatiquement (`vercel.json` est déjà configuré). Cliquez **Deploy**.
3. Chaque `git push` redéploie le jeu.

## Feuille de route vers le Play Store
- [ ] Équilibrage et contenu (prestige « ouvrir une nouvelle boutique », quêtes quotidiennes)
- [ ] Sons et musique
- [ ] Emballage Android avec **Capacitor** (`@capacitor/android`)
- [ ] Pubs récompensées (AdMob) : « ×2 gains hors ligne », « client VIP »
- [ ] Achat « Supprimer les pubs » (Google Play Billing)
- [ ] Compte Google Play Console, fiche du jeu, captures, politique de confidentialité
