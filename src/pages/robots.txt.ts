import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  // Прод (Beget): PUBLIC_INDEXING_ENABLED=true. Netlify staging — false (см. netlify.toml).
  const indexingEnabled = import.meta.env.PUBLIC_INDEXING_ENABLED === 'true';

  if (!indexingEnabled) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const sitemapURL = new URL('sitemap-index.xml', site);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
