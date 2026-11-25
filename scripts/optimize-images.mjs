// Optimise automatiquement les photos de public/photos/ avant chaque build :
// génère des versions AVIF + WebP en plusieurs largeurs dans public/photos/_generated/
// et un inventaire (src/data/images.generated.json) utilisé par le composant <Photo>.
// Il suffit donc de déposer une photo .jpg/.jpeg/.png/.webp avec le bon nom dans public/photos/.
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'public/photos';
const OUT = join(SRC, '_generated');
const MANIFEST = 'src/data/images.generated.json';
const WIDTHS = [480, 800, 1200, 1600, 1920];

mkdirSync(OUT, { recursive: true });
const manifest = {};
let generated = 0;

for (const file of readdirSync(SRC)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const input = join(SRC, file);
  const { name } = parse(file);
  const meta = await sharp(input).rotate().metadata();
  const srcWidth = meta.autoOrient?.width ?? meta.width;
  const srcHeight = meta.autoOrient?.height ?? meta.height;
  const widths = WIDTHS.filter((w) => w <= srcWidth);
  if (widths.length === 0) widths.push(srcWidth);
  const mtime = statSync(input).mtimeMs;

  for (const w of widths) {
    for (const fmt of ['avif', 'webp']) {
      const out = join(OUT, `${name}-${w}.${fmt}`);
      if (existsSync(out) && statSync(out).mtimeMs >= mtime) continue;
      const pipeline = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
      await (fmt === 'avif' ? pipeline.avif({ quality: 50 }) : pipeline.webp({ quality: 72 })).toFile(out);
      generated++;
    }
  }
  manifest[name] = { width: srcWidth, height: srcHeight, widths };
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`[images] ${Object.keys(manifest).length} photos, ${generated} fichiers générés.`);
