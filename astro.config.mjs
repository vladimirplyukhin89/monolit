// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

/** @param {string} file */
const ttNorms = (file) => `./src/fonts/tt-norms/TT Norms Std Trial Condensed ${file}.otf`;

export default defineConfig({
  // TODO: заменить на реальный домен сайта.
  // От него зависят canonical, sitemap.xml и robots.txt.
  site: 'https://example.com',
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
