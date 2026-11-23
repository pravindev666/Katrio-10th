import registryData from '../data/curriculum_registry_class10.json';
import { getSubsectionLessonById } from '../data/history_unit4_index';
import type {
  CurriculumRegistry,
  CurriculumSection,
  CurriculumUnit,
  EngineType,
  SocialStrand,
  SourceStatus,
  SubjectMeta,
  SubjectSlug,
} from '../types/curriculum';

export const curriculumRegistry = registryData as unknown as CurriculumRegistry;

export function getSubjects(): SubjectMeta[] {
  return curriculumRegistry.subjects;
}

export function getSubjectBySlug(slug: string): SubjectMeta | undefined {
  return curriculumRegistry.subjects.find((s) => s.slug === slug);
}

export function getUnitsBySubject(
  subject: SubjectSlug,
  strand?: SocialStrand,
): CurriculumUnit[] {
  return curriculumRegistry.units.filter(
    (u) => u.subject === subject && (!strand || u.strand === strand),
  );
}

export function getUnitById(
  subject: string,
  unitId: string,
): CurriculumUnit | undefined {
  return curriculumRegistry.units.find(
    (u) => u.subject === subject && u.id === unitId,
  );
}

export function getSectionById(
  subject: string,
  unitId: string,
  sectionId: string,
): {
  unit: CurriculumUnit;
  section: CurriculumSection;
  prevSection?: CurriculumSection;
  nextSection?: CurriculumSection;
  nextVerifiedSection?: CurriculumSection;
} | undefined {
  const unit = getUnitById(subject, unitId);
  if (!unit) return undefined;
  const idx = unit.sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return undefined;

  const section = unit.sections[idx];
  const prevSection = idx > 0 ? unit.sections[idx - 1] : undefined;
  const nextSection =
    idx < unit.sections.length - 1 ? unit.sections[idx + 1] : undefined;

  let nextVerifiedSection = unit.sections
    .slice(idx + 1)
    .find((s) => s.source_status !== 'auto_extracted_review_required');

  if (!nextVerifiedSection) {
    const subjectUnits = getUnitsBySubject(unit.subject);
    const unitIdx = subjectUnits.findIndex((u) => u.id === unit.id);
    for (let uIdx = unitIdx + 1; uIdx < subjectUnits.length; uIdx++) {
      const candidate = subjectUnits[uIdx].sections.find(
        (s) => s.source_status !== 'auto_extracted_review_required',
      );
      if (candidate) {
        nextVerifiedSection = candidate;
        break;
      }
    }
  }

  return {
    unit,
    section,
    prevSection,
    nextSection,
    nextVerifiedSection,
  };
}

export interface SearchResultItem {
  id: string;
  kind: 'unit' | 'section';
  title: string;
  subtitle: string;
  subject: SubjectSlug;
  subjectTitle: string;
  strand?: SocialStrand;
  unitId: string;
  unitTitle: string;
  route: string;
  sourceStatus: SourceStatus;
  engine: EngineType;
  printedPage: number;
  hasDemo: boolean;
}

export function searchCurriculum(
  query: string,
  options?: {
    subject?: SubjectSlug | 'all';
    sourceStatus?: SourceStatus | 'all';
    engine?: EngineType | 'all';
    onlyDemos?: boolean;
    limit?: number;
  },
): SearchResultItem[] {
  const normalized = query.trim().toLowerCase();
  const subjectFilter = options?.subject && options.subject !== 'all' ? options.subject : undefined;
  const statusFilter =
    options?.sourceStatus && options.sourceStatus !== 'all'
      ? options.sourceStatus
      : undefined;
  const engineFilter =
    options?.engine && options.engine !== 'all' ? options.engine : undefined;
  const onlyDemos = options?.onlyDemos ?? false;
  const limit = options?.limit ?? 80;

  const results: SearchResultItem[] = [];

  for (const unit of curriculumRegistry.units) {
    if (subjectFilter && unit.subject !== subjectFilter) continue;
    const subMeta = getSubjectBySlug(unit.subject);
    const subjectTitle = subMeta?.title ?? unit.subject;

    const unitSearchBlob = [
      unit.id,
      unit.code_label,
      unit.title,
      unit.tamil_subtitle ?? '',
      unit.hero_interaction_title,
      unit.learning_evidence_summary,
      subjectTitle,
      unit.strand ?? '',
    ]
      .join(' ')
      .toLowerCase();

    const unitMatchesQuery = !normalized || unitSearchBlob.includes(normalized);
    const unitMatchesStatus = !statusFilter || unit.source_status === statusFilter;
    const unitMatchesEngine = !engineFilter || unit.activity_template === engineFilter;
    const unitHasDemo = unit.sections.some((s) => Boolean(s.demo_id));

    if (
      unitMatchesQuery &&
      unitMatchesStatus &&
      unitMatchesEngine &&
      (!onlyDemos || unitHasDemo)
    ) {
      results.push({
        id: unit.id,
        kind: 'unit',
        title: `${unit.code_label}: ${unit.title}`,
        subtitle: unit.tamil_subtitle
          ? `${unit.tamil_subtitle} · ${unit.hero_interaction_title}`
          : unit.hero_interaction_title,
        subject: unit.subject,
        subjectTitle,
        strand: unit.strand,
        unitId: unit.id,
        unitTitle: unit.title,
        route: unit.route,
        sourceStatus: unit.source_status,
        engine: unit.activity_template,
        printedPage: unit.printed_page,
        hasDemo: unitHasDemo,
      });
    }

    for (const sec of unit.sections) {
      if (statusFilter && sec.source_status !== statusFilter) continue;
      if (engineFilter && sec.activity_template !== engineFilter) continue;
      if (onlyDemos && !sec.demo_id) continue;

      const secBlob = [
        sec.id,
        sec.section_number,
        sec.title,
        unit.title,
        unit.code_label,
        unit.tamil_subtitle ?? '',
        subjectTitle,
        sec.activity_template,
      ]
        .join(' ')
        .toLowerCase();

      if (!normalized || secBlob.includes(normalized)) {
        results.push({
          id: sec.id,
          kind: 'section',
          title: `${sec.section_number} ${sec.title}`,
          subtitle: `${unit.code_label}: ${unit.title} · Printed p. ${sec.printed_page}`,
          subject: unit.subject,
          subjectTitle,
          strand: unit.strand,
          unitId: unit.id,
          unitTitle: unit.title,
          route: sec.route,
          sourceStatus: sec.source_status,
          engine: sec.activity_template,
          printedPage: sec.printed_page,
          hasDemo: Boolean(sec.demo_id),
        });
      }

      if (results.length >= limit) break;
    }

    if (results.length >= limit) break;
  }

  return results.slice(0, limit);
}

export function suggestRoutesForPath(brokenPath: string): {
  label: string;
  route: string;
  reason: string;
}[] {
  const cleaned = brokenPath
    .replace(/^\/+/, '')
    .replace(/[-_/]+/g, ' ')
    .trim();

  const matches = searchCurriculum(cleaned, { limit: 6 });
  if (matches.length > 0) {
    return matches.map((m) => ({
      label: `${m.subjectTitle} — ${m.title}`,
      route: m.route,
      reason: `Matched curriculum ${m.kind} on printed p. ${m.printedPage}`,
    }));
  }

  return [
    {
      label: 'Class 10 Curriculum Hub',
      route: '/class-10',
      reason: 'Browse all 5 subjects and interactive lessons',
    },
    {
      label: 'Science Unit 14: 14.15 Structure of Human Heart',
      route: '/class-10/science/science-14/science-14-auto-14-15-structure-of-human-heart',
      reason: 'Pilot 3D/2D Heart Cutaway & Circulation Lesson',
    },
    {
      label: 'Science Unit 10: 10.1 Types of Chemical Reactions',
      route: '/class-10/science/science-10/science-10-auto-10-1-types-of-chemical',
      reason: 'Pilot Safe Reaction Lab & Equation Balancer',
    },
    {
      label: 'Mathematics Chapter 6: 6.3 Heights and Distances',
      route: '/class-10/mathematics/maths-06/maths-06-03',
      reason: 'Pilot Clinometer Elevation & Depression Workbench',
    },
    {
      label: 'English Unit 1: His First Flight',
      route: '/class-10/english/english-01/english-01-prose',
      reason: 'Pilot StoryStage Narrative Sequence & Perspective Lesson',
    },
    {
      label: 'தமிழ் இயல் 4: மணற்கேணி (மொழிபெயர்ப்புக் கல்வி)',
      route: '/class-10/tamil/tamil-04/tamil-04-01',
      reason: 'Pilot Tamil Translation & இலக்கணம் – பொது Studio',
    },
    {
      label: 'Social Science History Unit 1: Outbreak of World War I',
      route: '/class-10/social_science/social-history-01/social-history-01-auto-1-3-causes-course-and',
      reason: 'Pilot Evidence-Led WWI TimeMap',
    },
  ];
}

export function formatSourceStatusLabel(status: SourceStatus): {
  label: string;
  shortLabel: string;
  requiresEditorialBanner: boolean;
  tone: 'verified' | 'review' | 'warning';
} {
  switch (status) {
    case 'toc_verified':
      return {
        label: 'TOC Verified in Supplied Textbook',
        shortLabel: 'TOC Verified',
        requiresEditorialBanner: false,
        tone: 'verified',
      };
    case 'visually_verified_toc':
      return {
        label: 'Visually Verified Against Printed TOC',
        shortLabel: 'Visually Verified TOC',
        requiresEditorialBanner: false,
        tone: 'verified',
      };
    case 'toc_verified_page_needs_review':
      return {
        label: 'TOC Verified · Printed Page Span Needs Audit',
        shortLabel: 'Page Span Review',
        requiresEditorialBanner: true,
        tone: 'warning',
      };
    case 'auto_extracted_review_required':
      return {
        label: 'Title awaiting editorial verification',
        shortLabel: 'Title awaiting editorial verification',
        requiresEditorialBanner: true,
        tone: 'review',
      };
  }
}

export interface StudentActivityStatus {
  kind: 'interactive_ready' | 'preview_available' | 'in_preparation' | 'under_review';
  badgeLabel: string;
  ctaLabel: string;
  description: string;
}

export function getStudentSectionStatus(section: CurriculumSection): StudentActivityStatus {
  if (getSubsectionLessonById(section.id)) {
    return {
      kind: 'interactive_ready',
      badgeLabel: 'Interactive lesson ready',
      ctaLabel: 'Start lesson',
      description:
        'Simple explanation, interactive concept map, 2D historical explorer, step-by-step causes, practice, and chunked textbook reading.',
    };
  }
  if (section.lesson_content_id || section.demo_id) {
    return {
      kind: 'interactive_ready',
      badgeLabel: 'Interactive lesson ready',
      ctaLabel: 'Start interactive lesson',
      description: 'Hands-on visual exploration, step-by-step explanation, flashcards, and untimed concept check ready now.',
    };
  }
  if (section.source_status === 'auto_extracted_review_required') {
    return {
      kind: 'under_review',
      badgeLabel: 'Book topic',
      ctaLabel: 'Open topic',
      description: 'Numbered textbook subtopic linked to printed pages with chapter visual lab and study notes.',
    };
  }
  return {
    kind: 'in_preparation',
    badgeLabel: 'Lesson in preparation',
    ctaLabel: 'Open topic overview',
    description: 'Verified textbook topic indexed to printed pages. Bespoke interactive lesson package is queued in the editorial roadmap.',
  };
}

export function getStudentUnitStatus(unit: CurriculumUnit): {
  kind: 'interactive_ready' | 'preview_available';
  badgeLabel: string;
  ctaLabel: string;
  readySection?: CurriculumSection;
  verifiedCount: number;
  reviewCount: number;
} {
  const readySection = unit.sections.find((s) =>
    Boolean(getSubsectionLessonById(s.id) || s.lesson_content_id || s.demo_id),
  );
  const verifiedCount = unit.sections.filter(
    (s) => s.source_status !== 'auto_extracted_review_required' || Boolean(getSubsectionLessonById(s.id)),
  ).length;
  const reviewCount = unit.sections.filter(
    (s) => s.source_status === 'auto_extracted_review_required' && !getSubsectionLessonById(s.id),
  ).length;

  if (readySection) {
    return {
      kind: 'interactive_ready',
      badgeLabel: 'Interactive lesson ready',
      ctaLabel: 'Explore chapter',
      readySection,
      verifiedCount,
      reviewCount,
    };
  }
  return {
    kind: 'preview_available',
    badgeLabel: 'Preview & topic index ready',
    ctaLabel: 'Browse chapter topics',
    readySection: unit.sections[0],
    verifiedCount,
    reviewCount,
  };
}

export function getUnitCuriosityQuestion(unit: CurriculumUnit): string {
  const customQuestions: Record<string, string> = {
    'science-01': 'How does a force change motion, and why do astronauts push off in space?',
    'science-02': 'How do lenses bend light to correct human vision and magnify distant objects?',
    'science-04': 'What makes electric charges flow through a circuit and heat a filament?',
    'science-10': 'Why do some substances combine, split apart, or swap atoms during a reaction?',
    'science-14': 'How does the human heart pump blood through two separate loops without mixing?',
    'maths-01': 'How can sets and functions map real-world relationships without ambiguity?',
    'maths-03': 'How do algebraic equations model curves, intersections, and unknown quantities?',
    'maths-06': 'How can you measure the height of a lighthouse or tower without climbing it?',
    'english-01': 'What gives us the courage to take our very first leap into the unknown?',
    'tamil-01': 'காலந்தோறும் தமிழ் மொழி தன் இளமையையும் இனிமையையும் எவ்வாறு காத்து வருகிறது?',
    'tamil-04': 'பிறமொழி அறிவியல் மற்றும் இலக்கியச் செல்வங்களைத் தமிழில் பெறுவது எப்படி?',
    'social-history-01': 'How did alliances and rivalries turn a regional crisis in 1914 into a world war?',
    'social-history-04': 'How did the Cold War, revolutions, and new alliances reshape the world after 1945?',
    'social-geography-01': 'How do the Himalayas, plains, and plateaus shape India’s rivers and climate?',
    'social-civics-01': 'How does the Indian Constitution balance fundamental rights, duties, and governance?',
    'social-economics-01': 'What does Gross Domestic Product (GDP) actually tell us about a nation’s well-being?',
  };
  if (customQuestions[unit.id]) {
    return customQuestions[unit.id];
  }
  return `Explore how ${unit.title.toLowerCase()} works through visual models and guided experiments.`;
}
