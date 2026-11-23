import fs from 'node:fs';
import path from 'node:path';
import type { CurriculumRegistry } from '../src/types/curriculum';
import { getLessonContentBySectionId } from '../src/data/lesson_content';

const ROOT = process.cwd();
const DIST_DIR = path.resolve(ROOT, 'dist');
const REGISTRY_PATH = path.resolve(ROOT, 'src/data/curriculum_registry_class10.json');
const SITE_URL = (process.env.KATRIO_SITE_URL || 'https://katrio.pages.dev').replace(/\/+$/, '');

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface StaticRouteMeta {
  route: string;
  title: string;
  description: string;
  heading: string;
  bodyHtml: string;
  lang?: 'en' | 'ta';
}

function writePrerenderedHtml(template: string, meta: StaticRouteMeta) {
  const canonical = `${SITE_URL}${meta.route === '/' ? '' : meta.route}`;
  let html = template;

  if (meta.lang === 'ta') {
    html = html.replace('<html lang="en">', '<html lang="ta">');
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />\n    <link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
  );

  // Inject meaningful semantic fallback HTML inside <div id="root"> so crawlers and JS-off users see real structured content
  const fallbackMarkup = `<div id="root"><noscript><main style="max-width:780px;margin:2rem auto;padding:1rem;font-family:system-ui,sans-serif;line-height:1.6;"><h1>${escapeHtml(
    meta.heading,
  )}</h1>${meta.bodyHtml}<p><small>Independent educational resource aligned to the Tamil Nadu State Board Class 10 syllabus. Not an official government website.</small></p></main></noscript></div>`;
  html = html.replace('<div id="root"></div>', fallbackMarkup);

  const relDir = meta.route === '/' ? '' : meta.route.replace(/^\/+/, '');
  const targetDir = relDir ? path.resolve(DIST_DIR, relDir) : DIST_DIR;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.resolve(targetDir, 'index.html'), html, 'utf-8');
}

function runPrerender() {
  const indexHtmlPath = path.resolve(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const template = fs.readFileSync(indexHtmlPath, 'utf-8');
  const registry: CurriculumRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

  const routes: StaticRouteMeta[] = [
    {
      route: '/',
      title: 'Katrio · Free Interactive Visual Learning · TN Class 10',
      description:
        "Don't just read the lesson. Step inside it. Free, no-login Tamil Nadu Class 10 interactive visual learning across Science, Mathematics, English, Tamil and Social Science.",
      heading: "Katrio — Don't just read the lesson. Step inside it.",
      bodyHtml:
        '<p>Free, no-login Tamil Nadu State Board Class 10 interactive learning across 5 subjects, 72 chapters, and 691 indexed textbook topics.</p>',
    },
    {
      route: '/class-10',
      title: 'Class 10 Subjects & Chapters · Katrio',
      description:
        'Browse all 5 Tamil Nadu State Board Class 10 subjects, 72 chapters, and live pilot interactive lessons.',
      heading: 'Tamil Nadu Class 10 Subjects & Chapters',
      bodyHtml: `<ul>${registry.subjects
        .map((s) => `<li><a href="/class-10/${s.slug}">${escapeHtml(s.title)} (${s.unit_count} chapters)</a></li>`)
        .join('')}</ul>`,
    },
  ];

  // Platform pages
  const platformPages: [string, string, string][] = [
    ['/arcade', 'Learning Arcade · Katrio', 'Practice concepts without countdown timers or leaderboards across Science, Maths, English, Tamil, and Social Science.'],
    ['/arcade/sustainable-tn-town', 'Design a Sustainable Tamil Nadu Town · Capstone Mission · Katrio', 'Untimed cross-subject Class 10 capstone mission combining Mensuration water tanks, Electricity & LEDs, Tamil Nadu monsoon geography, municipal budgets, and bilingual civic proposals.'],
    ['/flashcards', 'Class 10 Flashcards · Katrio', 'Self-paced Class 10 flashcards stored locally on your device.'],
    ['/quizzes', 'Untimed Concept Quizzes · Katrio', 'Low-pressure Class 10 concept checks with hints and explanations.'],
    ['/teachers', 'For Teachers & Classrooms · Katrio', 'All 72 Class 10 Tamil Nadu textbook units mapped to interactive visual models and page references.'],
    ['/accessibility', 'Accessibility & Learning Settings · Katrio', 'WCAG 2.2 AA oriented controls: light/dark/high-contrast, font scaling, reduced motion, Focus Mode, and 2D/text pathways.'],
    ['/privacy', 'Privacy & Local Device Progress · Katrio', 'No login, no student accounts, no tracking. Export, import, or reset device-local progress anytime.'],
    ['/progress', 'Your Local Progress & Discovery Stamps · Katrio', 'Track visited, explored, practised, and understood lessons plus Discovery Stamps and Teach-It-Back notes privately on this device.'],
    ['/about', 'About, Curriculum & Sources · Katrio', 'Independent educational resource aligned with TN Class 10 textbooks; full source audit summary.'],
    ['/roadmap', 'Editorial Status & Roadmap · Katrio', 'Transparent availability of live pilot lessons versus planned chapters across TN Class 10.'],
  ];
  for (const [route, title, description] of platformPages) {
    routes.push({
      route,
      title,
      description,
      heading: title.replace(' · Katrio', ''),
      bodyHtml: `<p>${escapeHtml(description)}</p>`,
    });
  }

  // 5 Subjects + 4 Social Strands
  for (const sub of registry.subjects) {
    routes.push({
      route: `/class-10/${sub.slug}`,
      title: `${sub.title} (${sub.unit_count} Chapters) · Class 10 · Katrio`,
      description: sub.tagline,
      heading: `Class 10 ${sub.title}`,
      bodyHtml: `<p>${escapeHtml(sub.tagline)}</p><p>Source: ${escapeHtml(sub.book_title)} (${escapeHtml(sub.edition)}).</p>`,
      lang: sub.slug === 'tamil' ? 'ta' : 'en',
    });
    if (sub.strands) {
      for (const st of sub.strands) {
        routes.push({
          route: `/class-10/social_science/${st.slug}`,
          title: `Social Science — ${st.title} (${st.unit_count} Units) · Class 10 · Katrio`,
          description: st.description,
          heading: `Class 10 Social Science — ${st.title}`,
          bodyHtml: `<p>${escapeHtml(st.description)}</p>`,
        });
      }
    }
  }

  // All 72 Units + All 691 Canonical Section Routes (full SSG coverage!)
  for (const unit of registry.units) {
    const unitLang = unit.subject === 'tamil' ? 'ta' : 'en';
    routes.push({
      route: unit.route,
      title: `${unit.code_label}: ${unit.title} · Class 10 · Katrio`,
      description: `${unit.hero_interaction_title} (${unit.book}, pp. ${unit.printed_page}–${unit.printed_page_end}).`,
      heading: `${unit.code_label}: ${unit.title}`,
      bodyHtml: `<p>${escapeHtml(unit.hero_interaction_title)} — ${escapeHtml(unit.learning_evidence_summary)}.</p><ul>${unit.sections
        .map((s) => `<li><a href="${s.route}">${escapeHtml(s.section_number)} ${escapeHtml(s.title)} (p. ${s.printed_page})</a></li>`)
        .join('')}</ul>`,
      lang: unitLang,
    });

    for (const sec of unit.sections) {
      const lesson = getLessonContentBySectionId(sec.id);
      routes.push({
        route: sec.route,
        title: `${sec.section_number} ${sec.title} · ${unit.title} · Katrio`,
        description: lesson
          ? `${lesson.subtitle} (${unit.book}, pp. ${lesson.source_printed_pages.join(', ')}).`
          : `${sec.title} (${unit.book}, p. ${sec.printed_page}). ${sec.accessibility_fallback}`,
        heading: `${sec.section_number} ${sec.title}`,
        bodyHtml: lesson
          ? `<p>${escapeHtml(lesson.curiosity_hook)}</p><p>${escapeHtml(lesson.accessible_equivalent.summary)}</p><ul>${lesson.learning_objectives
              .map((o) => `<li>${escapeHtml(o)}</li>`)
              .join('')}</ul>`
          : `<p>Textbook reference: ${escapeHtml(unit.book)} (${escapeHtml(unit.edition)}), printed page ${sec.printed_page} (PDF page ${sec.pdf_page}).</p><p>${escapeHtml(sec.accessibility_fallback)}</p>`,
        lang: unitLang,
      });
    }
  }

  for (const r of routes) {
    writePrerenderedHtml(template, r);
  }

  console.log(`=== KATRIO STATIC PRE-RENDER (SSG) COMPLETE ===`);
  console.log(`Generated ${routes.length} pre-rendered static HTML entry points under dist/ (with canonical links, OG tags, and no-JS fallback HTML).`);
}

runPrerender();
