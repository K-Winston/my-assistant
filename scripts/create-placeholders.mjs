// Génère des photos de remplacement neutres (motif d'appareillage de pierre)
// pour les emplacements absents de public/photos/. N'écrase JAMAIS une vraie photo.
// Usage : node scripts/create-placeholders.mjs
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'public/photos';
const slugs = ['fondations-gros-oeuvre', 'maconnerie-extensions', 'toiture', 'electricite', 'plomberie', 'placo-amenagement'];
const items = [
  ['hero.jpg', 1920, 1280, '#3A352E', '#47413A'],
  ['histoire.jpg', 1200, 1500, '#CFC5B4', '#BFB3A0'],
  ...[1, 2, 3].flatMap((n) => [
    [`realisation-${n}-avant.jpg`, 1200, 900, '#C4B9A6', '#B3A792'],
    [`realisation-${n}-apres.jpg`, 1200, 900, '#DCD3C4', '#CBC0AD'],
  ]),
  ...slugs.flatMap((s) => [
    [`prestation-${s}-1.jpg`, 1200, 900, '#D3C9B8', '#C2B6A2'],
    [`prestation-${s}-2.jpg`, 1200, 900, '#D3C9B8', '#C2B6A2'],
  ]),
];

function stoneSvg(w, h, bg, joint) {
  const rowH = Math.round(h / 9);
  const blockW = Math.round(w / 5);
  let rects = '';
  for (let r = 0, y = 0; y < h; r++, y += rowH) {
    const offset = r % 2 ? -blockW / 2 : 0;
    for (let x = offset; x < w; x += blockW) {
      rects += `<rect x="${x + 3}" y="${y + 3}" width="${blockW - 6}" height="${rowH - 6}" fill="${bg}" />`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${joint}"/>${rects}</svg>`;
}

for (const [name, w, h, bg, joint] of items) {
  const out = join(dir, name);
  if (existsSync(out)) continue;
  await sharp(Buffer.from(stoneSvg(w, h, bg, joint))).jpeg({ quality: 70 }).toFile(out);
  console.log('placeholder créé :', out);
}
// Image de partage (Open Graph) 1200×630
if (!existsSync('public/og-image.jpg')) {
  await sharp(Buffer.from(stoneSvg(1200, 630, '#2A2722', '#1E1C19'))).jpeg({ quality: 75 }).toFile('public/og-image.jpg');
}
