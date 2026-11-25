import type { APIRoute } from 'astro';

// robots.txt généré au build, avec l'adresse du site définie dans astro.config.mjs / .env
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /merci/\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
