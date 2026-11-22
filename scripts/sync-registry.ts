import fs from 'node:fs';
import path from 'node:path';
import type {
  CurriculumRegistry,
  CurriculumSection,
  CurriculumUnit,
  EngineType,
  EvidenceMarker,
  Pass0AuditAction,
  RepresentationStatus,
  SocialStrand,
  SourcePageAnchor,
  SourceReference,
  SourceStatus,
  SubjectMeta,
  SubjectSlug,
} from '../src/types/curriculum';

const ROOT = process.cwd();
const HANDOVER_DIR = path.resolve(ROOT, 'Katrio_Complete_Google_AI_Studio_AGY_Handover');
const DATA_DIR = path.resolve(ROOT, 'src/data');

interface HandoverRegistry {
  schema_version: string;
  product_working_name: string;
  curriculum: string;
  purpose: string;
  quality_notice: string;
  source_books: Record<
    SubjectSlug,
    {
      filename: string;
      edition: string;
      pdf_page_offset_vs_printed: number;
      toc_pages_pdf: number[];
    }
  >;
  coverage_summary: {
    subjects: number;
    units: number;
    verified_toc_subsections: number;
    auto_detected_subheadings: number;
    page_anchors: number;
  };
  subjects: Record<
    SubjectSlug,
    {
      title: string;
      source_pdf: string;
      units: {
        id: string;
        title: string;
        label?: string;
        theme?: string;
        strand?: SocialStrand;
        page_printed: number;
        end_page_printed: number;
        pdf_page: number;
        end_pdf_page: number;
        kind: 'unit' | 'chapter' | 'iyal' | 'thematic_unit';
        source_status: SourceStatus;
        route: string;
        interaction_brief?: {
          hero_visual: string;
          suggested_engine: string;
          learning_evidence: string;
        };
        sections: {
          id: string;
          title: string;
          label?: string;
          page_printed: number;
          end_page_printed?: number;
          pdf_page: number;
          end_pdf_page?: number;
          kind: CurriculumSection['kind'];
          source_status: SourceStatus;
          activity_template?: string;
          route: string;
        }[];
        page_anchors: {
          printed_page: number;
          pdf_page: number;
          status: string;
          needs_manual_headings_audit: boolean;
        }[];
        evidence_markers?: EvidenceMarker[];
      }[];
    }
  >;
}

interface Pass0AuditFile {
  sections: Record<
    string,
    {
      section_id: string;
      original_title: string;
      verified_title: string;
      audit_action: Pass0AuditAction;
      notes: string;
    }
  >;
  summary?: {
    corrected: number;
    rejected: number;
  };
}

// Dynamically load all validated LessonContentPackage JSONs from src/data/lesson_content/
// and map both primary section_id and related_section_ids cleanly.
function loadLessonBindings(): Record<string, { lessonId: string; engine: EngineType }> {
  const dir = path.resolve(DATA_DIR, 'lesson_content');
  const bindings: Record<string, { lessonId: string; engine: EngineType }> = {};
  if (!fs.existsSync(dir)) return bindings;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  for (const file of files) {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(dir, file), 'utf-8')) as {
      section_id: string;
      related_section_ids?: string[];
      interaction?: { engine?: EngineType };
    };
    const engine = pkg.interaction?.engine ?? 'ConceptGame';
    bindings[pkg.section_id] = { lessonId: pkg.section_id, engine };
    for (const relId of pkg.related_section_ids ?? []) {
      if (!bindings[relId]) {
        bindings[relId] = { lessonId: pkg.section_id, engine };
      }
    }
  }
  return bindings;
}

const SUBJECT_VISUAL_META: Record<
  SubjectSlug,
  {
    native_title?: string;
    world_name: string;
    tagline: string;
    book_title: string;
    color_token: string;
    tint_token: string;
    preview_asset: string;
    strands?: SubjectMeta['strands'];
  }
> = {
  science: {
    world_name: 'Science Discovery Lab',
    tagline:
      'Manipulate physics vectors, safe chemical reactions, and 3D/2D living systems with clear scientific labels and units.',
    book_title: 'Tamil Nadu Government Standard Ten Science',
    color_token: 'var(--science)',
    tint_token: 'var(--science-tint)',
    preview_asset: '/preview-art/science-preview.svg',
  },
  mathematics: {
    world_name: 'Mathematics Visual Playground',
    tagline:
      'Explore coordinate grids, algebraic equations, dynamic triangles, trigonometry clinometers, and 3D solids.',
    book_title: 'Tamil Nadu Government Standard Ten Mathematics',
    color_token: 'var(--math)',
    tint_token: 'var(--math-tint)',
    preview_asset: '/preview-art/mathematics-preview.svg',
  },
  english: {
    world_name: 'English Story & Verse Studio',
    tagline:
      'Explore character perspectives, narrative sequences, poetic imagery, and contextual language across all seven units.',
    book_title: 'Tamil Nadu Government Standard Ten English',
    color_token: 'var(--english)',
    tint_token: 'var(--english-tint)',
    preview_asset: '/preview-art/english-preview.svg',
  },
  tamil: {
    native_title: 'தமிழ்',
    world_name: 'தமிழ் இலக்கியம் மற்றும் இலக்கணக் கூடம்',
    tagline:
      'தெளிவான தமிழ் எழுத்துருவில் செய்யுள், உரைநடை, விரிவானம் மற்றும் கற்கண்டு இலக்கணத்தைக் கற்றுக்கொள்ளுங்கள்.',
    book_title: 'தமிழ்நாடு அரசு பத்தாம் வகுப்பு தமிழ்',
    color_token: 'var(--tamil)',
    tint_token: 'var(--tamil-tint)',
    preview_asset: '/preview-art/tamil-preview.svg',
  },
  social_science: {
    world_name: 'Social Science Time & Place Atlas',
    tagline:
      'Trace cause-and-consequence timelines, toggle Indian & Tamil Nadu map layers, and study constitutional and economic systems.',
    book_title: 'Tamil Nadu Government Standard Ten Social Science',
    color_token: 'var(--social)',
    tint_token: 'var(--social-tint)',
    preview_asset: '/preview-art/social_science-preview.svg',
    strands: [
      {
        slug: 'history',
        title: 'History',
        unit_count: 10,
        description:
          'World wars, 19th-century reform movements, nationalism, and social transformation in Tamil Nadu.',
      },
      {
        slug: 'geography',
        title: 'Geography',
        unit_count: 7,
        description:
          'India relief, climate, agriculture, resources, and the physical & human geography of Tamil Nadu.',
      },
      {
        slug: 'civics',
        title: 'Civics',
        unit_count: 5,
        description:
          'Indian Constitution, Union & State governments, foreign policy, and international relations.',
      },
      {
        slug: 'economics',
        title: 'Economics',
        unit_count: 5,
        description:
          'GDP and growth, globalization, food security, taxation, and Tamil Nadu industrial clusters.',
      },
    ],
  },
};

function mapSuggestedEngine(
  suggested: string | undefined,
  subject: SubjectSlug,
  unitId: string,
  strand?: SocialStrand,
): EngineType {
  const s = (suggested || '').toLowerCase();
  if (s.includes('modelexplorer3d') || s.includes('moleculebuilder3d') || s.includes('anatomy')) {
    return 'ModelExplorer3D';
  }
  if (s.includes('journeythrough') || s.includes('lifecycle') || s.includes('ecosystemflow') || s.includes('neural') || s.includes('feedback')) {
    return 'JourneyThrough';
  }
  if (s.includes('reactionlab') || s.includes('solutionlab') || s.includes('periodictable') || s.includes('safevirtuallab') || s.includes('punnett') || s.includes('scientificconcept') || s.includes('traitselection') || s.includes('healthlearning')) {
    return 'SafeVirtualLab';
  }
  if (s.includes('physics') || s.includes('optics') || s.includes('heat') || s.includes('circuit') || s.includes('wave')) {
    return 'PhysicsWorkbench';
  }
  if (s.includes('trigonometry') || s.includes('geometry')) {
    return 'GeometryWorkbench';
  }
  if (s.includes('graph') || s.includes('equation') || s.includes('coordinate') || s.includes('pattern') || s.includes('datastudio') || s.includes('mathconcept')) {
    return 'GraphSandbox';
  }
  if (s.includes('timemap') || s.includes('timeline') || s.includes('historymap') || s.includes('evidencegallery')) {
    return 'TimelineMap';
  }
  if (s.includes('geomap') || s.includes('agriculturemap') || s.includes('flowmap') || s.includes('geodatamap') || s.includes('resourceflow')) {
    return 'GeoMap';
  }
  if (s.includes('tamil')) {
    return 'TamilLanguageStudio';
  }
  if (s.includes('storystage') || s.includes('verselab') || s.includes('communicationstudio')) {
    return 'StoryStage';
  }
  if (s.includes('civic') || s.includes('government') || s.includes('policy') || s.includes('budget') || s.includes('datastory') || s.includes('foodsystem') || s.includes('networkmap') || s.includes('evolutiontree')) {
    return 'ConceptGame';
  }

  // Subject fallbacks
  if (subject === 'tamil') return 'TamilLanguageStudio';
  if (subject === 'english') return 'StoryStage';
  if (subject === 'mathematics') {
    if (unitId === 'maths-04' || unitId === 'maths-06') return 'GeometryWorkbench';
    if (unitId === 'maths-07') return 'ModelExplorer3D';
    return 'GraphSandbox';
  }
  if (subject === 'social_science') {
    if (strand === 'history') return 'TimelineMap';
    if (strand === 'geography') return 'GeoMap';
    return 'ConceptGame';
  }
  return 'SafeVirtualLab';
}

function inferRepresentationStatus(engine: EngineType, subject: SubjectSlug): RepresentationStatus {
  if (engine === 'PhysicsWorkbench' || engine === 'GraphSandbox' || engine === 'GeometryWorkbench') {
    return 'Equation-based simulation';
  }
  if (engine === 'TimelineMap' || engine === 'GeoMap') {
    return 'Measured/Observed';
  }
  if (subject === 'english' || subject === 'tamil') {
    return 'Illustrative reconstruction';
  }
  return 'Conceptual schematic';
}

function buildAccessibilityFallback(engine: EngineType, title: string, subject: SubjectSlug): string {
  if (subject === 'tamil') {
    return `தெளிவான தமிழ் உரை, சொற்பொருள் மற்றும் விசைப்பலகை வழியாகக் கற்கும் எளிய பயிற்சி (${title}).`;
  }
  switch (engine) {
    case 'ModelExplorer3D':
      return `Interactive 2D SVG cutaway diagram and ordered step-by-step text walkthrough for ${title} (works without WebGL).`;
    case 'JourneyThrough':
      return `Ordered station-by-station table and keyboard-navigable sequence summary for ${title}.`;
    case 'SafeVirtualLab':
      return `Balanced chemical equation table, atom-count conservation breakdown, and text observation log for ${title}.`;
    case 'PhysicsWorkbench':
      return `Structured formula readout, variable table, and text-only cause-and-effect guide for ${title}.`;
    case 'GraphSandbox':
      return `Coordinate value table, equation derivation, and key-feature summary for ${title}.`;
    case 'GeometryWorkbench':
      return `Step-by-step trigonometric ratio derivation, units table, and labelled 2D right-triangle guide for ${title}.`;
    case 'TimelineMap':
      return `Chronological evidence table with dated cause-and-consequence cards and text map descriptions for ${title}.`;
    case 'GeoMap':
      return `Structured regional comparison table, dated legend summary, and text geographic overview for ${title}.`;
    case 'StoryStage':
      return `Structured scene-order list, character motivation comparison table, and vocabulary guide for ${title}.`;
    default:
      return `Structured 2D diagram and keyboard-accessible text pathway for ${title}.`;
  }
}

function buildCodeLabel(subject: SubjectSlug, unit: HandoverRegistry['subjects'][SubjectSlug]['units'][number], idx: number): string {
  if (unit.label) return unit.label;
  if (subject === 'mathematics') return `Chapter ${idx + 1}`;
  if (subject === 'tamil') return `இயல் ${idx + 1}`;
  return `Unit ${idx + 1}`;
}

export function syncCanonicalRegistry(): CurriculumRegistry {
  const hoPath = path.resolve(HANDOVER_DIR, 'curriculum_registry_class10.json');
  const ho: HandoverRegistry = JSON.parse(fs.readFileSync(hoPath, 'utf-8'));

  // Optional Pass 0 audit file (generated by scripts/pass0-audit-pdfs.py)
  const pass0Path = path.resolve(DATA_DIR, 'pass0_heading_audit.json');
  const pass0: Pass0AuditFile | null = fs.existsSync(pass0Path)
    ? JSON.parse(fs.readFileSync(pass0Path, 'utf-8'))
    : null;
  const lessonBindings = loadLessonBindings();

  const subjectOrder: SubjectSlug[] = [
    'science',
    'mathematics',
    'english',
    'tamil',
    'social_science',
  ];

  const allUnits: CurriculumUnit[] = [];
  const subjectsMeta: SubjectMeta[] = [];

  let totalTocVerified = 0;
  let totalAutoExtracted = 0;
  let totalAnchors = 0;
  let totalEvidenceMarkers = 0;
  let pass0CorrectedCount = 0;
  let pass0RejectedCount = 0;
  let pilotCount = 0;

  for (const slug of subjectOrder) {
    const hoSub = ho.subjects[slug];
    const sb = ho.source_books[slug];
    const vmeta = SUBJECT_VISUAL_META[slug];

    let subTocCount = 0;
    let subAutoCount = 0;
    let subAnchorCount = 0;
    let subEvidenceCount = 0;

    hoSub.units.forEach((hu, uIdx) => {
      const unitNumberMatch = hu.id.match(/(\d+)$/);
      const unitNumber = unitNumberMatch ? Number(unitNumberMatch[1]) : uIdx + 1;
      const codeLabel = buildCodeLabel(slug, hu, uIdx);
      const unitEngine = mapSuggestedEngine(
        hu.interaction_brief?.suggested_engine,
        slug,
        hu.id,
        hu.strand,
      );

      const unitSourceRef: SourceReference = {
        book_id: `${slug}-10`,
        book_title: vmeta.book_title,
        edition: `${sb.edition} Edition`,
        pdf_filename: sb.filename,
        printed_page_start: hu.page_printed,
        printed_page_end: hu.end_page_printed,
        pdf_page_start: hu.pdf_page,
        pdf_page_end: hu.end_pdf_page,
      };

      const sections: CurriculumSection[] = hu.sections.map((hs, sIdx) => {
        const isAuto = hs.source_status === 'auto_extracted_review_required';
        if (isAuto) subAutoCount++;
        else subTocCount++;

        const auditEntry = pass0?.sections[hs.id];
        const sanitizeTitle = (t: string) =>
          t
            .replace(/[\x00-\x1f\x7f\uf000-\uf8ff]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        let displayTitle = sanitizeTitle(hs.title);
        let originalExtractedTitle: string | undefined;
        let pass0Action: Pass0AuditAction | undefined;
        let pass0Note: string | undefined;

        if (auditEntry) {
          pass0Action = auditEntry.audit_action;
          pass0Note = auditEntry.notes;
          if (auditEntry.audit_action === 'corrected' && auditEntry.verified_title) {
            originalExtractedTitle = sanitizeTitle(hs.title);
            displayTitle = sanitizeTitle(auditEntry.verified_title);
            pass0CorrectedCount++;
          } else if (auditEntry.audit_action === 'rejected') {
            pass0RejectedCount++;
          }
        }

        const pilotBinding = lessonBindings[hs.id];
        if (pilotBinding) pilotCount++;

        const secEngine = pilotBinding
          ? pilotBinding.engine
          : mapSuggestedEngine(hs.activity_template || hu.interaction_brief?.suggested_engine, slug, hu.id, hu.strand);

        const sectionNumber =
          hs.label ||
          (hs.kind === 'prose'
            ? `U${unitNumber}-Prose`
            : hs.kind === 'poem'
            ? `U${unitNumber}-Poem`
            : hs.kind === 'supplementary'
            ? `U${unitNumber}-Supp`
            : slug === 'tamil'
            ? `இயல் ${unitNumber}.${sIdx + 1}`
            : `${unitNumber}.${sIdx + 1}`);

        const secSourceRef: SourceReference = {
          book_id: `${slug}-10`,
          book_title: vmeta.book_title,
          edition: `${sb.edition} Edition`,
          pdf_filename: sb.filename,
          printed_page_start: hs.page_printed,
          printed_page_end: hs.end_page_printed ?? hs.page_printed,
          pdf_page_start: hs.pdf_page,
          pdf_page_end: hs.end_pdf_page ?? hs.pdf_page,
        };

        return {
          id: hs.id,
          unit_id: hu.id,
          subject: slug,
          strand: hu.strand,
          section_number: sectionNumber,
          title: displayTitle,
          original_extracted_title: originalExtractedTitle,
          kind: hs.kind,
          book: vmeta.book_title,
          printed_page: hs.page_printed,
          printed_page_end: hs.end_page_printed,
          pdf_page: hs.pdf_page,
          pdf_page_end: hs.end_pdf_page,
          // NEVER silently strip auto_extracted_review_required until human educator approval
          source_status: hs.source_status,
          content_status: pilotBinding ? 'in_review' : 'planned',
          review_status: pilotBinding
            ? 'subject_review_pending'
            : isAuto
            ? auditEntry
              ? 'pass0_pdf_verified_pending_human'
              : 'awaiting_human_audit'
            : 'toc_verified_scaffold',
          interaction_status: pilotBinding ? 'pilot_implemented' : 'placeholder_scaffold',
          pass0_audit_action: pass0Action,
          pass0_audit_note: pass0Note,
          route: hs.route,
          activity_template: secEngine,
          suggested_activity_plan: hs.activity_template,
          representation_status: inferRepresentationStatus(secEngine, slug),
          accessibility_fallback: buildAccessibilityFallback(secEngine, displayTitle, slug),
          learning_goal_placeholder: `Awaiting educator-verified learning objective for "${displayTitle}" (${codeLabel}, printed p. ${hs.page_printed}).`,
          assets: [vmeta.preview_asset],
          sources: [secSourceRef],
          lesson_content_id: pilotBinding?.lessonId,
          demo_id: pilotBinding?.lessonId,
        };
      });

      // Map all canonical page_anchors and link them accurately to the sections covering each printed page
      const pageAnchors: SourcePageAnchor[] = (hu.page_anchors || []).map((pa) => {
        subAnchorCount++;
        const exactStartMatches = sections
          .filter((s) => s.printed_page === pa.printed_page)
          .map((s) => s.id);

        let linkedIds = exactStartMatches;
        let auditNote = '';
        if (exactStartMatches.length > 0) {
          auditNote = `Starts ${exactStartMatches.length} indexed section${exactStartMatches.length === 1 ? '' : 's'} on printed p. ${pa.printed_page}.`;
        } else {
          // Find the latest section starting before this page in this unit (or fallback to first section if intro page)
          const prior = [...sections]
            .filter((s) => s.printed_page <= pa.printed_page)
            .sort((a, b) => b.printed_page - a.printed_page)[0];
          const fallbackSec = prior ?? sections[0];
          linkedIds = fallbackSec ? [fallbackSec.id] : [];
          auditNote = prior
            ? `Continuation page within "${prior.title}" (needs body-heading & exercise review).`
            : `Unit opening / preface page before first indexed subsection (p. ${pa.printed_page}).`;
        }

        return {
          anchor_id: `${hu.id}-p${pa.printed_page}`,
          unit_id: hu.id,
          subject: slug,
          book_id: `${slug}-10`,
          printed_page: pa.printed_page,
          pdf_page: pa.pdf_page,
          linked_section_ids: linkedIds,
          audit_note: auditNote,
        };
      });

      const evidenceMarkers = hu.evidence_markers || [];
      subEvidenceCount += evidenceMarkers.length;

      const unitHasPilot = sections.some((s) => Boolean(s.lesson_content_id));

      allUnits.push({
        id: hu.id,
        subject: slug,
        strand: hu.strand,
        unit_number: unitNumber,
        code_label: codeLabel,
        title: hu.title,
        tamil_subtitle: hu.theme,
        theme: hu.theme,
        kind: hu.kind,
        book: vmeta.book_title,
        edition: `${sb.edition} Edition`,
        printed_page: hu.page_printed,
        printed_page_end: hu.end_page_printed,
        pdf_page: hu.pdf_page,
        pdf_page_end: hu.end_pdf_page,
        source_status: hu.source_status,
        content_status: unitHasPilot ? 'in_review' : 'planned',
        review_status: unitHasPilot ? 'subject_review_pending' : 'toc_verified_scaffold',
        interaction_status: unitHasPilot ? 'pilot_implemented' : 'placeholder_scaffold',
        route: hu.route,
        hero_interaction_title:
          hu.interaction_brief?.hero_visual || `Interactive visual model for ${hu.title}`,
        learning_evidence_summary:
          hu.interaction_brief?.learning_evidence ||
          `Explore and explain core concepts in ${hu.title}`,
        suggested_engine_label: hu.interaction_brief?.suggested_engine,
        activity_template: unitEngine,
        accessibility_fallback: buildAccessibilityFallback(unitEngine, hu.title, slug),
        sections,
        source_page_anchors: pageAnchors,
        evidence_markers: evidenceMarkers,
        assets: [vmeta.preview_asset],
        sources: [unitSourceRef],
      });
    });

    totalTocVerified += subTocCount;
    totalAutoExtracted += subAutoCount;
    totalAnchors += subAnchorCount;
    totalEvidenceMarkers += subEvidenceCount;

    subjectsMeta.push({
      slug,
      title: hoSub.title,
      native_title: vmeta.native_title,
      world_name: vmeta.world_name,
      tagline: vmeta.tagline,
      book_title: vmeta.book_title,
      edition: `${sb.edition} Edition`,
      pdf_filename: sb.filename,
      pdf_page_offset: sb.pdf_page_offset_vs_printed,
      toc_pdf_pages: sb.toc_pages_pdf.join('–'),
      color_token: vmeta.color_token,
      tint_token: vmeta.tint_token,
      unit_count: hoSub.units.length,
      toc_verified_section_count: subTocCount,
      auto_extracted_section_count: subAutoCount,
      source_page_anchor_count: subAnchorCount,
      evidence_marker_count: subEvidenceCount,
      strands: vmeta.strands,
    });
  }

  return {
    document_id: 'AGY-2026-11-v1',
    schema_version: ho.schema_version,
    version: '1.1.0',
    board: ho.curriculum,
    standard: 10,
    working_title: 'Katrio · Free Interactive Visual Learning · TN Class 10',
    generated_at: new Date().toISOString(),
    authority_notice: ho.quality_notice,
    audit_totals: {
      subjects: subjectsMeta.length,
      units: allUnits.length,
      toc_verified_sections: totalTocVerified,
      auto_extracted_candidates: totalAutoExtracted,
      total_sections: totalTocVerified + totalAutoExtracted,
      source_page_anchors: totalAnchors,
      evidence_markers: totalEvidenceMarkers,
      pass0_corrected_headings: pass0CorrectedCount,
      pass0_rejected_candidates: pass0RejectedCount,
      pilot_lessons_count: pilotCount,
    },
    subjects: subjectsMeta,
    units: allUnits,
  };
}

const isMain = process.argv[1] && process.argv[1].endsWith('sync-registry.ts');
if (isMain) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(path.resolve(DATA_DIR, 'lesson_content'), { recursive: true });

  const registry = syncCanonicalRegistry();
  fs.writeFileSync(
    path.resolve(DATA_DIR, 'curriculum_registry_class10.json'),
    JSON.stringify(registry, null, 2),
    'utf-8',
  );

  // Sync canonical handover CSVs into src/data/ verbatim
  const canonicalCsvs = [
    'chapter_interaction_blueprints.csv',
    'curriculum_index_flat.csv',
    'section_activity_plans.csv',
    'page_by_page_curriculum_audit.csv',
    'exercise_activity_candidates.csv',
  ];
  for (const csvName of canonicalCsvs) {
    const srcCsv = path.resolve(HANDOVER_DIR, csvName);
    if (fs.existsSync(srcCsv)) {
      fs.copyFileSync(srcCsv, path.resolve(DATA_DIR, csvName));
    }
  }

  console.log('=== SYNCED CANONICAL HANDOVER REGISTRY ===');
  console.log(JSON.stringify(registry.audit_totals, null, 2));
}
