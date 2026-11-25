// Audit complet du build de production (dist/) :
//   1. validation HTML (html-validate)       5. erreurs console / violations CSP
//   2. liens cassés (internes + externes)    6. poids des pages
//   3. accessibilité (axe-core, WCAG 2.2 AA) 7. responsive 360→1440 px, zones cliquables
//   4. Lighthouse (4 catégories, mobile)     8. formulaire avec et sans JavaScript
// Résultats : audit-reports/summary.json + tableau affiché dans le terminal.
// Usage : node scripts/audit.mjs [--no-lighthouse] [--no-external]
import { spawnSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { start } from './serve.mjs';
import { checkLinks } from './check-links.mjs';
import { checkResponsive } from './check-responsive.mjs';
import { checkForm } from './check-form.mjs';

const args = new Set(process.argv.slice(2));
const PORT = 4400;
const BASE = `http://localhost:${PORT}`;
const OUT = 'audit-reports';
rmSync(OUT, { recursive: true, force: true }); // jamais de résultats d'une exécution précédente
mkdirSync(OUT, { recursive: true });

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === '_astro' || f === 'photos' ? [] : htmlFiles(p);
    return f.endsWith('.html') ? [p] : [];
  });
const files = htmlFiles('dist').sort();
// La page 404 est auditée via /404.html (servie avec un statut 200 pour que Lighthouse l'analyse).
const toUrl = (f) => f.replace(/^.*?dist\//, '/').replace(/index\.html$/, '');
const pages = files.map(toUrl);
// Pages volontairement exclues de Google (noindex) : leur score SEO n'est pas compté.
const NOINDEX = new Set(['/merci/']);
const results = Object.fromEntries(pages.map((p) => [p, {}]));
let failed = false;

// 1. Validation HTML
const hvFile = join(OUT, 'html-validate.json');
const hvRun = spawnSync('npx', ['html-validate', '--formatter', `json=${hvFile}`, ...files], { encoding: 'utf8' });
if (hvRun.error || !existsSync(hvFile) || hvRun.status > 1) {
  console.error('✗ Le validateur HTML n’a pas pu s’exécuter :', hvRun.error?.message || hvRun.stderr);
  process.exit(2);
}
const hvJson = JSON.parse(readFileSync(hvFile, 'utf8') || '[]');
for (const f of files) results[toUrl(f)].htmlErrors = 0;
for (const r of hvJson) {
  results[toUrl(r.filePath)].htmlErrors = r.errorCount;
  for (const m of r.messages) if (m.severity === 2) console.log(`  HTML ${r.filePath}:${m.line} ${m.ruleId} — ${m.message}`);
}

const server = await start(PORT);
try {
  // 2. Liens
  const links = await checkLinks(BASE, { external: !args.has('--no-external') });
  for (const b of links.broken) console.log(`  LIEN CASSÉ ${b.url} (${b.status}) depuis ${b.from}`);

  // Responsive et formulaire
  if (await checkResponsive(BASE)) failed = true;
  if (await checkForm(BASE)) failed = true;

  // 3 + 5 + 6. axe, console, poids
  const browser = await chromium.launch();
  for (const p of pages) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', (e) => consoleErrors.push(e.message));
    const bodies = [];
    page.on('response', (r) => bodies.push(r.body().then((b) => b.length, () => 0)));
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { // force le chargement des images différées
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    });
    await page.waitForLoadState('networkidle');
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    results[p].axe = axe.violations.reduce((n, v) => n + v.nodes.length, 0);
    for (const v of axe.violations) console.log(`  AXE ${p} ${v.id} (${v.impact}) ×${v.nodes.length} — ${v.help}`);
    results[p].console = consoleErrors.length;
    for (const c of consoleErrors) console.log(`  CONSOLE ${p} ${c}`);
    const sizes = await Promise.all(bodies);
    results[p].kb = Math.round(sizes.reduce((a, b) => a + b, 0) / 1024);
    await context.close();
  }
  await browser.close();

  // 4. Lighthouse
  if (!args.has('--no-lighthouse')) {
    const chromePath = chromium.executablePath();
    for (const p of pages) {
      const file = join(OUT, `lh${p.replace(/\//g, '_') || '_'}.json`);
      // Appel asynchrone : le serveur local tourne dans ce même processus et doit rester disponible.
      const ok = await execFileAsync('npx', ['lighthouse', BASE + p, '--quiet', '--output=json', `--output-path=${file}`,
        '--chrome-flags=--headless=new --no-sandbox', '--only-categories=performance,accessibility,best-practices,seo'],
        { env: { ...process.env, CHROME_PATH: chromePath }, timeout: 180000 }).then(() => true, (e) => { console.log(`  LH ${p} échec : ${e.message.split('\n')[0]}`); return false; });
      const lh = ok && existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
      if (!lh || lh.runtimeError) { results[p].lighthouse = 'échec'; continue; }
      const c = lh.categories;
      results[p].lighthouse = {
        perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
        bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
        lcp: +((lh.audits['largest-contentful-paint'].numericValue ?? NaN) / 1000).toFixed(2),
        cls: +(lh.audits['cumulative-layout-shift'].numericValue ?? NaN).toFixed(3),
      };
      for (const [k, cat] of Object.entries(c)) for (const ref of cat.auditRefs) {
        const a = lh.audits[ref.id];
        if (ref.weight > 0 && a.score !== null && a.score < 0.9) console.log(`  LH ${p} [${k}] ${a.id} : ${a.score}`);
      }
    }
  }

  // Résumé
  console.log('\n| Page | Perf | A11y | BP | SEO | LCP (s) | CLS | axe | HTML | Console | Poids (Ko) |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const p of pages) {
    const r = results[p]; const l = r.lighthouse || {};
    console.log(`| ${p} | ${l.perf ?? '–'} | ${l.a11y ?? '–'} | ${l.bp ?? '–'} | ${l.seo ?? '–'} | ${l.lcp ?? '–'} | ${l.cls ?? '–'} | ${r.axe} | ${r.htmlErrors} | ${r.console} | ${r.kb} |`);
    if (r.axe || r.htmlErrors || r.console || r.lighthouse === 'échec') failed = true;
    if (l.perf !== undefined && Math.min(l.perf, l.a11y, l.bp, NOINDEX.has(p) ? 100 : l.seo) < 95) failed = true;
  }
  for (const w of links.warnings) console.log(`  ⚠ lien externe non vérifiable ${w.url} (${w.status}) depuis ${w.from}`);
  console.log(`\nLiens vérifiés : ${links.checked}, cassés : ${links.broken.length}, avertissements : ${links.warnings.length}`);
  if (links.broken.length) failed = true;
  writeFileSync(join(OUT, 'summary.json'), JSON.stringify({ date: new Date().toISOString(), results, links }, null, 2));
} finally {
  server.close();
}
console.log(failed ? '\n✗ Audit : des problèmes restent à corriger.' : '\n✓ Audit : tous les objectifs sont atteints.');
process.exit(failed ? 1 : 0);
