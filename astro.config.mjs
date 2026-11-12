// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

/** @param {string} file */
const ttNorms = (file) => `./src/fonts/tt-norms/TT Norms Std Trial Condensed ${file}.otf`;

/**
 * Canonical / sitemap / robots:
 * 1. PUBLIC_SITE_URL — явный URL (прод на Beget или зафиксированный стейджинг)
 * 2. DEPLOY_PRIME_URL / URL — Netlify inject при сборке (preview и site URL)
 * 3. иначе плейсхолдер до появления реального домена
 * @returns {string}
 */
function resolveSite() {
  const explicit = process.env.PUBLIC_SITE_URL?.trim();
  const netlify = process.env.DEPLOY_PRIME_URL?.trim() || process.env.URL?.trim();
  const raw = explicit || netlify || 'https://example.com';
  return raw.replace(/\/$/, '');
}

export default defineConfig({
  site: resolveSite(),
  integrations: [sitemap(), react()],
  // TODO: пробные файлы TT Norms Std Condensed — до запуска заменить на купленные TT Norms Pro (woff2).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'TT Norms Pro',
      cssVariable: '--font-tt-norms',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { weight: 400, style: 'normal', src: [ttNorms('Regular')] },
          { weight: 500, style: 'normal', src: [ttNorms('Medium')] },
          { weight: 700, style: 'normal', src: [ttNorms('Bold')] },
        ],
      },
    },
  ],
});
