import type { Plugin } from 'vite';

const SITE_URL_VARIABLE = 'VITE_SITE_URL';

const withTrailingSlash = (url: string): string => (url.endsWith('/') ? url : `${url}/`);

const buildRobots = (siteUrl: string): string => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`;

const buildSitemap = (siteUrl: string, lastModified: string): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${siteUrl}</loc><lastmod>${lastModified}</lastmod></url>`,
    '</urlset>',
    '',
  ].join('\n');

export function siteIndexFiles(): Plugin {
  let siteUrl = '';

  return {
    name: 'site-index-files',
    apply: 'build',
    configResolved(config) {
      const configuredUrl: unknown = config.env[SITE_URL_VARIABLE];
      if (typeof configuredUrl !== 'string' || configuredUrl === '') {
        throw new Error(`${SITE_URL_VARIABLE} must hold the public address of the site, for example https://example.com/.`);
      }
      siteUrl = withTrailingSlash(configuredUrl);
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteUrl) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(siteUrl, today) });
    },
  };
}
