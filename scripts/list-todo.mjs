// Liste tous les textes encore à compléter ([À COMPLÉTER …] / [NOM DE L’ENTREPRISE]),
// avec le fichier et le numéro de ligne. Usage : npm run a-completer
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : [p];
});
const re = /\[(?:À COMPLÉTER[^\]]*|NOM DE L[’']ENTREPRISE)\]/g;
let n = 0;
for (const file of [...files('src'), '.env.example'].filter((f) => /\.(ts|astro|example)$/.test(f))) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (/isTodo|includes\('\[|^\s*\/\/|^\s*\*|^\s*-/.test(line)) return; // code et commentaires
    for (const m of line.matchAll(re)) { console.log(`${file}:${i + 1}  ${m[0]}`); n++; }
  });
}
console.log(`\n${n} élément(s) à compléter.`);
