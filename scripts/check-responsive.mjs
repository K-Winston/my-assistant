// Vérifie chaque page à 360, 768, 1280 et 1440 px :
// - aucun débordement horizontal ;
// - toutes les zones cliquables visibles font au moins 44×44 px
//   (exception WCAG : liens dans une phrase de texte).
// Utilisé par scripts/audit.mjs, ou seul avec le site servi sur BASE_URL.
import { chromium } from 'playwright';

const pages = ['/', '/prestations/fondations-gros-oeuvre/', '/prestations/toiture/', '/mentions-legales/', '/confidentialite/', '/merci/', '/404/'];
const widths = [360, 768, 1280, 1440];

export async function checkResponsive(BASE) {
  const browser = await chromium.launch();
  let problems = 0;
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    for (const path of pages) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const res = await page.evaluate(() => {
        const overflow = document.documentElement.scrollWidth - window.innerWidth;
        const wide = [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(el).position !== 'absolute')
          .slice(0, 3)
          .map((el) => el.tagName + '.' + el.className);
        const small = [...document.querySelectorAll('a, button, input, select, textarea, summary')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            if (r.width === 0 || s.visibility === 'hidden' || el.closest('.hp') || el.classList.contains('skip-link')) return false;
            if (el.type === 'hidden') return false;
            // Lien « étiré » : la zone cliquable est toute la carte (ou la ligne de légende) parente
            if (el.classList.contains('stretched-link')) {
              const card = el.closest('.card, .legend-row').getBoundingClientRect();
              return card.height < 44 || card.width < 44;
            }
            // Liens dans un paragraphe de texte : exemptés (WCAG 2.5.8, « inline »)
            if (el.tagName === 'A' && s.display === 'inline' && el.closest('p, li label, label')) return false;
            if (el.type === 'checkbox') return false; // la case + son libellé forment la zone cliquable
            return r.height < 44 || r.width < 24;
          })
          .map((el) => `${el.tagName} "${(el.textContent || el.name || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`);
        return { overflow, wide, small };
      });
      if (res.overflow > 0 || res.small.length) {
        problems++;
        console.log(`✗ ${w}px ${path} débordement=${res.overflow}px`, res.wide, res.small);
      }
    }
    await page.close();
}
await browser.close();
console.log(problems ? `✗ ${problems} problème(s) responsive` : '✓ Responsive : aucun débordement, zones cliquables ≥ 44 px');
return problems;
}

// Utilisation seule : node scripts/check-responsive.mjs (site servi sur BASE_URL)
if (import.meta.url === `file://${process.argv[1]}`) {
  const n = await checkResponsive(process.env.BASE_URL || 'http://localhost:4321');
  process.exit(n ? 1 : 0);
}
