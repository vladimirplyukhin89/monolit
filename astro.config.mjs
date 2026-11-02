// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  // TODO: заменить на реальный домен сайта.
  // От него зависят canonical, sitemap.xml и robots.txt.
  site: 'https://example.com',
  integrations: [sitemap(), react()],
});