# KATRIO — BRAND, COLOUR SYSTEM AND LANDING PAGE

**Document ID:** BRAND-2026-11-v1  
**Product working name:** Katrio (provisional, not trademark-cleared)  
**Parent-brand placement:** “An independent learning project by WitKin” is optional and must not be mistaken for government endorsement.  
**Audience:** Tamil Nadu Class 10 students, teachers, parents; extensible to other grades.  
**Positioning:** No login, free-to-explore, textbook-aligned interactive learning.

## 1. Website name decision

**Recommended working name — KATRIO.** Short, friendly, easy to pronounce in English and Tamil, inspired by the sound of *katru/kattral* (learning). It is invented branding rather than a claim of dictionary meaning. This is not a verified unique or legally available name; conduct MCA, Indian Trade Marks Registry, domain and app-store clearance before registering.

Backups for checking: **Katrivo**, **Arivilo** and **Viyalo**. Search-based screening is not trademark clearance. Avoid **Katriva**, which is already used by an education company, and avoid **Viyora** and **Noolora**, which have existing uses. Do not promise domain availability.

**Brand line:** *Don't just read the lesson. Step inside it.*  
**Supporting line:** *See it. Try it. Understand it.*  
**Footer disclosure:** *Independent educational resource inspired by the Tamil Nadu State Board syllabus. Not an official government website.*

## 2. Design intent

A calm, modern science-museum-meets-playground aesthetic: bright ivory backgrounds, dark ink typography, disciplined indigo navigation, vibrant subject accents. Not noisy neon, gamified casino UI, or textbook photocopies. Child-friendly without looking infantile to tenth-standard students. Give content room to breathe. No continuous moving backgrounds, rotating hero models, or pop-up interruptions.

## 3. Color tokens and usage

| Role | Token | Hex | Usage |
|---|---|---|---|
| Heading ink | `--ink` | `#13213A` | Titles, icons, primary text |
| Body | `--text` | `#35465D` | Explanations and long-form copy |
| Background | `--canvas` | `#F7F9FE` | Site page background |
| Surface | `--surface` | `#FFFFFF` | Lesson, search and assessment cards |
| Divider | `--line` | `#DDE4F0` | Borders and rule lines |
| Main interactive | `--primary` | `#4255D4` | Main buttons/links, 6.03:1 on white |
| Pressed | `--primary-dark` | `#3041AF` | Active actions and hover |
| Science | `--science` | `#0B7773` | Science tags, labels and controls |
| Mathematics | `--math` | `#7155C8` | Graph lab subject shell |
| English | `--english` | `#3478C0` | Stories and language actions |
| Tamil | `--tamil` | `#C04F75` | Tamil subject navigation |
| Social Science | `--social` | `#9B631F` | Timelines, geography and history |
| Learning Arcade | `--arcade` | `#C35243` | Puzzles and challenges |
| Success | `--success` | `#137B55` | Correct with explanatory text |
| Warning | `--warning` | `#A86113` | Informative caution with icon/text |
| Error | `--error` | `#B43C4C` | Errors with explanation |
| Focus ring | `--focus` | `#3041AF` | 3px high-visibility outline |

These subject colours are signposts, **never the only information carrier**. Light/dark and high-contrast modes require fresh contrast checks. All body text should achieve WCAG 2.2 AA contrast (4.5:1); non-text controls 3:1. Avoid teal `#0E8F8A` as small white-background text because its ratio is only ~3.95:1; use `#0B7773` instead.

### Background tints

- Science `#E8F6F4` · Mathematics `#F0ECFC` · English `#E9F3FC` · Tamil `#FDECF2` · Social `#FFF3E3` · Arcade `#FFF0EC`.
- Text contrast must still be tested against these tints.
- 3D viewer's own neutral background: `#EDF1F8`; model colouring reflects scientific reality, not subject brand colours.

### Typography

Headings: **Manrope** (fallback system sans); English body: **Inter** (fallback system sans). Tamil: **Noto Sans Tamil** with proper line height, native punctuation, and validated glyph shaping. Do not use ornamental Tamil display fonts for body lessons. Self-host or load responsibly; avoid flashing font reflows. Suggested desktop H1 52–64px, H2 30–38px, body 17–18px, mobile H1 34–40px, body 16–18px. Line-height 1.6 for body; 1.7+ where Tamil shaping needs it.

### Layout/interaction tokens

Radius 12px controls, 20px cards; 8px spacing scale; main content max 1240px; reading column max 72ch; touch-target target 44×44px or more. Use a visible focus ring and responsive keyboard/touch parity. No forced time limits or autoplay sound.

## 4. Landing page — exact sections and draft copy

| Position | Block | Suggested real copy and behavior |
|---|---|---|
| Header | Katrio logo · Explore · Subjects · Learning Arcade · For Teachers · Accessibility | Class 10 selector; language toggle when translations exist; no Sign In |
| Hero | **Don't just read the lesson. Step inside it.** | “Explore Science, Maths, English, Tamil and Social Science through interactive visuals, experiments, stories and challenges.” CTAs: **Explore Class 10** and **Browse subjects** |
| Trust strip | **Free to explore · No login · Learn at your own pace** | No unsupported exam score or ADHD-treatment claim |
| Subject worlds | Five colourful cards + Arcade | Each leads to `/class-10/{subject}`; card shows available/planned count honestly |
| Lesson showcase | “A lesson you can touch.” | Actual interactive preview only after implemented; otherwise label “Concept preview — coming soon” |
| How it works | **Choose → Explore → Understand → Practise** | One sentence and icon for each; no auto-advancing carousel |
| Popular curriculum | **Find your next lesson** | Search by subject/chapter/keyword, source-status badge, free chapter index |
| Accessibility | **Learning works differently for everyone.** | Readable text, 2D/3D choices, reduced motion, subtitles and untimed exercises |
| Learning arcade | **Practice without the pressure** | Quick concept games, quizzes, flashcards, print-friendly review |
| Teachers/parents | **Built for curiosity. Useful in classrooms.** | Syllabus search, screen sharing, printable recaps, no pupil profiles |
| Roadmap | **Growing one lesson at a time** | Clear “Available / In development / Planned” badges; publish only verified features |
| FAQ | Do I need an account? Is it free? Which syllabus? Does it work on phones? Is the site official? | Direct answers, transparent limitations |
| Footer | About · Source acknowledgements · Accessibility · Privacy · Feedback · Contact · © | State independent status, textbook rights, data policies, no government affiliation |

## 5. Landing page hero layout

Desktop: left half headline, supporting copy and two CTAs. Right half a static high-quality composite preview showing a cutaway heart, geometry grid and floating language tiles; no unauthorised textbook diagrams. Mobile: headline first, two single-column CTAs, then still preview. Only activate a “Try demo” CTA when a real demo exists. Maintain semantic heading order, minimal motion and fast LCP.

## 6. Subject-specific visual systems

- **Science:** clinical diagrams, physical controls, accurate axes/units; no misleading 3D labels.
- **Mathematics:** coordinate grid, direct manipulatives, worked solutions, visible scale.
- **English:** warm editorial scene cards, contextual annotation, voice optional.
- **Tamil:** native-script-first, Tamil grammar/poetry components, typographic clarity.
- **Social Science:** evidence-led maps, timelines, layers, honest legends, source dates.
- **Arcade:** simple puzzle cards, retry loops, no streak shame or pressuring timers.

## 7. Design system acceptance rules

No decorative arrows masquerading as scientific processes. 3D is optional where 2D is clearer. No forced distraction animations. Every image requires text alt or accessible equivalent. Every claim of “interactive” must be testable. No fabricated progress or scores. Show unfinished activities as disabled/planned, not as a live quiz. Test contrast/keyboard on every shell.

## 8. Rights and name clearance

The textbooks identify SCERT content ownership. Titles and page pointers are used here for indexing; do not publish verbatim chapters, PDF pages, textbook figures, exercises or original stories without an appropriate license/permission and rights review. Verify MCA, Indian trademark classes, domains and social handles; this brief is brand planning, not a legal clearance.
