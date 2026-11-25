// Petit serveur statique pour tester le build (dist/) avec les MÊMES en-têtes
// de sécurité que la production (lus dans netlify.toml). Usage : node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const PORT = Number(process.argv[2] || process.env.PORT || 4400);
const ROOT = 'dist';
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

// En-têtes globaux de netlify.toml (bloc for = "/*")
const toml = readFileSync('netlify.toml', 'utf8');
const globalBlock = toml.split('[[headers]]').find((b) => b.includes('for = "/*"')) ?? '';
const headers = Object.fromEntries(
  [...globalBlock.matchAll(/^\s*([A-Za-z-]+)\s*=\s*"(.*)"\s*$/gm)].filter(([, k]) => k !== 'for').map(([, k, v]) => [k, v]),
);
delete headers['Strict-Transport-Security']; // inutile en local (http)
if (headers['Content-Security-Policy']) {
  headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace('; upgrade-insecure-requests', '');
}

function handle(req, res) {
  let path;
  try {
    path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Requête invalide');
  }
  let file = join(ROOT, path);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' }); return res.end(); }
    file = join(file, 'index.html');
  }
  let status = 200;
  if (!existsSync(file)) { file = join(ROOT, '404.html'); status = 404; }
  if (!existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream', ...headers });
  res.end(readFileSync(file));
}

export function start(port = PORT) {
  const server = createServer((req, res) => {
    try { handle(req, res); } catch (e) {
      if (!res.headersSent) res.writeHead(500);
      res.end(String(e));
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject); // ex. port déjà utilisé
    server.listen(port, () => resolve(server));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await start();
  console.log(`Site servi sur http://localhost:${PORT}`);
}
