// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Adresse définitive du site : à modifier dans .env (SITE_URL) ou ici.
const SITE_URL = process.env.SITE_URL || 'https://www.exemple-a-completer.fr';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Feuilles de style en fichiers externes : compatible avec une CSP stricte.
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  integrations: [
    // Les photos originales de public/photos/ ne sont pas publiées : seules leurs
    // versions optimisées (photos/_generated/, AVIF + WebP) sont mises en ligne.
    {
      name: 'retirer-photos-originales',
      hooks: {
        'astro:build:done': ({ dir }) => {
          const photos = join(fileURLToPath(dir), 'photos');
          for (const f of readdirSync(photos)) {
            if (/\.(jpe?g|png|webp)$/i.test(f)) rmSync(join(photos, f));
          }
        },
      },
    },
    sitemap({
      filter: (page) => !page.includes('/merci/'),
    }),
  ],
});
