import fs from 'node:fs';
import path from 'node:path';
import type { CurriculumRegistry } from '../src/types/curriculum';

const registryPath = path.resolve(process.cwd(), 'src/data/curriculum_registry_class10.json');
const registry: CurriculumRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

export function buildAllCanonicalRoutes(reg: CurriculumRegistry): string[] {
  const staticRoutes = [
    '/',
    '/class-10',
    '/class-10/science',
    '/class-10/mathematics',
    '/class-10/english',
    '/class-10/tamil',
    '/class-10/social_science',
    '/class-10/social_science/history',
    '/class-10/social_science/geography',
    '/class-10/social_science/civics',
    '/class-10/social_science/economics',
    '/arcade',
    '/arcade/sustainable-tn-town',
    '/flashcards',
    '/quizzes',
    '/teachers',
    '/accessibility',
    '/privacy',
    '/progress',
    '/about',
    '/roadmap',
  ];

  const unitRoutes = reg.units.map((u) => u.route);
  const sectionRoutes = reg.units.flatMap((u) => u.sections.map((s) => s.route));

  return [...staticRoutes, ...unitRoutes, ...sectionRoutes];
}

const isMain = process.argv[1] && process.argv[1].endsWith('audit-links.ts');
if (isMain) {
  const routes = buildAllCanonicalRoutes(registry);
  const uniqueRoutes = new Set(routes);
  if (uniqueRoutes.size !== routes.length) {
    console.error('Duplicate routes detected!');
    process.exit(1);
  }

  // Write public/_redirects for Cloudflare Pages SPA/SSG deep-link support
  const publicDir = path.resolve(process.cwd(), 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(
    path.resolve(publicDir, '_redirects'),
    '# Cloudflare Pages deep-link fallback for all pre-rendered curriculum routes\n/*    /index.html   200\n',
    'utf-8',
  );

  // Write public/sitemap.xml (configurable via KATRIO_SITE_URL env var)
  const baseUrl = (process.env.KATRIO_SITE_URL || 'https://katrio.pages.dev').replace(/\/+$/, '');
  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(
      (r) => `  <url><loc>${baseUrl}${r}</loc><changefreq>weekly</changefreq></url>`,
    ),
    '</urlset>',
  ].join('\n');
  fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  const sectionRouteCount = registry.units.reduce((acc, u) => acc + u.sections.length, 0);
  console.log(`=== KATRIO LINK & ROUTE AUDIT ===`);
  console.log(
    `Verified ${routes.length} canonical routes (${routes.length - registry.units.length - sectionRouteCount} top-level/hub routes + ${registry.units.length} unit routes + ${sectionRouteCount} section routes).`,
  );
  console.log(`Generated public/sitemap.xml and public/_redirects for Cloudflare Pages.`);
}
