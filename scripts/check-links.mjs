// Vérificateur de liens : explore le site à partir de la page d'accueil,
// vérifie chaque lien interne (pages, images, ancres #) et, en option, les liens externes.
const attrRe = /\s(href|src|srcset|imagesrcset|content)="([^"]+)"/g;

import { readFileSync } from 'node:fs';

// Adresse de production (lue dans dist/robots.txt) : les liens absolus vers le site
// lui-même (canonical, Open Graph, sitemap) sont vérifiés sur la copie locale.
const prodSite = (() => {
  try { return new URL(readFileSync('dist/robots.txt', 'utf8').match(/Sitemap: (\S+)/)[1]).origin; } catch { return null; }
})();

export async function checkLinks(base, { external = true } = {}) {
  const seen = new Map(); // url -> status
  const broken = [];
  const warnings = [];
  const queue = [{ url: base + '/', from: '(départ)' }];
  const ids = new Map(); // page -> Set(ids)
  const anchors = [];
  let checked = 0;

  while (queue.length) {
    const { url, from } = queue.shift();
    const clean = url.split('#')[0];
    if (seen.has(clean)) continue;
    const isInternal = clean.startsWith(base);
    if (!isInternal && !external) { seen.set(clean, 'ignoré'); continue; }
    let status;
    let body = '';
    try {
      const res = await fetch(clean, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (link-check)' }, signal: AbortSignal.timeout(15000) });
      status = res.status;
      if (isInternal && (res.headers.get('content-type') || '').includes('text/html')) body = await res.text();
    } catch (e) { status = 'erreur réseau'; }
    seen.set(clean, status);
    checked++;
    const ok = typeof status === 'number' && status >= 200 && status < 400;
    // Certains sites (Google…) refusent les robots : 401/403/429 externes = avertissement, pas lien cassé.
    if (!ok && !isInternal && [401, 403, 429].includes(status)) warnings.push({ url: clean, status, from });
    else if (!ok) broken.push({ url: clean, status, from });
    if (!body) continue;
    ids.set(clean, new Set([...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
    for (const [, attr, raw] of body.matchAll(attrRe)) {
      if (attr === 'content' && !raw.startsWith('http')) continue; // <meta content> : seulement les URL
      for (const part of raw.split(',')) {
        const ref = part.trim().split(/\s+/)[0];
        if (!ref || /^(mailto:|tel:|data:|javascript:)/.test(ref)) continue;
        if (!/^(https?:|\/|#|\.)/.test(ref)) continue; // valeurs de <meta content> qui ne sont pas des URL
        if (ref.includes('api.web3forms.com')) continue; // point d'envoi du formulaire (POST uniquement)
        let abs = new URL(ref.replace(/&amp;/g, '&'), clean).href;
        if (prodSite && abs.startsWith(prodSite)) abs = base + abs.slice(prodSite.length);
        if (abs.includes('#')) anchors.push({ page: abs.split('#')[0], id: decodeURIComponent(abs.split('#')[1]), from: clean });
        queue.push({ url: abs, from: clean });
      }
    }
  }
  for (const a of anchors) {
    if (!a.id || !ids.has(a.page)) continue;
    if (!ids.get(a.page).has(a.id)) broken.push({ url: `${a.page}#${a.id}`, status: 'ancre absente', from: a.from });
  }
  return { checked, broken, warnings };
}
