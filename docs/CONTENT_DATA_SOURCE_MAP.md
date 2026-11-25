# MXT Lab — Curriculum and Lesson Data Source Map

**Snapshot:** 26 November 2026  
**Purpose:** Identify where curriculum, lesson, and quiz information currently lives before consolidating the content system. This is a read-only mapping; no content files are deleted or modified.

## 1. Current files and observed responsibilities

| File/path | Observed responsibility | Current concern |
|---|---|---|
| `assets/js/main.js` | Shared page behaviours plus embedded strand/unit data and homepage SPA navigation | Contains curriculum structures as well as UI behaviour |
| `assets/js/strands-data.js` | Separate strand/unit data structure | `STRANDS_9` also appears in `main.js`; direct consumers of this file were not found in the targeted search |
| `assets/js/lesson-data.js` | Central `LESSONS` object used by sampled lesson pages | Large combined browser-side content bundle |
| `assets/js/lessons/*.js` | 68 individual lesson modules; each begins with a comment saying it was auto-split from `main.js` | A second lesson-content set exists alongside the central bundle; sampled lesson pages load `lesson-data.js`, not an individual lesson module |
| `assets/js/quiz-data.js` | Quiz data loaded by lesson pages | Needs mapping against lesson-level quiz fields and progress persistence |
| `assets/js/quiz-hub.js` | Quiz catalogue metadata for the Quiz Hub | Catalogue and lesson quiz content need an ID-level consistency check |
| `assets/js/glossary-data.js` | Glossary terms | Keep as a separate vocabulary dataset or merge into the future content model after checking its consumers |
| `assets/js/strands-data.js` and Supabase curriculum tables | Parallel static and database curriculum representations | Establish which is authoritative for each feature and define sync/version rules |

## 2. Measured repository footprint

Git tree metadata reports:

| Asset group | Files | Combined bytes (approx.) |
|---|---:|---:|
| Central `lesson-data.js` | 1 | 459,782 |
| Individual lesson JS modules | 68 | 467,429 |
| **Combined lesson-data footprint** | **69** | **927,211** |

The individual lesson modules total almost the same size as the central lesson bundle. Their file headers identify them as auto-split lesson content. This strongly suggests a duplicated content representation, but a complete runtime-reference scan is required before calling them unused or deleting them.

The lesson HTML sample inspected loads:
- `assets/js/lesson-data.js`
- `assets/js/main.js`
- `assets/js/quiz-data.js`

It does not load its matching `assets/js/lessons/{lesson-id}.js` module. Verify this pattern across all 68 lesson pages and any build/deployment tooling before cleanup.

## 3. Initial source-of-truth recommendation

Adopt one canonical curriculum/content source with stable IDs, then generate the required views and bundles from it.

Conceptually:

`Curriculum version → Grade → Subject → Strand → Unit → Standard → Benchmark → Topic → Lesson → Quiz / Activity`

The source model should contain:
- stable IDs and display titles;
- grade, subject, strand, unit, standard, benchmark, and topic relationships;
- lesson sections, objectives, examples, key terms, and summaries;
- quiz IDs, questions, answer keys, and feedback;
- content version, publication status, and alignment metadata.

Static HTML, topic catalogues, search indexes, quiz lists, and teacher tools should consume generated outputs from this source rather than manually maintained parallel arrays.

## 4. Safe consolidation plan

### Step A — Build a consumer map

For each of the 68 lesson IDs, record:
- matching HTML file;
- matching individual JS file;
- entry in `lesson-data.js`;
- entry in `quiz-data.js`;
- entry in `quiz-hub.js`;
- links in `strands-data.js` / `main.js`;
- Supabase topic/curriculum record;
- student progress references.

### Step B — Compare content parity

Compare each lesson's title, objectives, content, key terms, summary, further reading, and quiz fields across every representation. Record differences rather than choosing one copy silently.

### Step C — Select canonical data

Choose the source based on actual runtime consumers and authoring workflow. Preserve stable IDs and all content. Add a validation script that fails if:
- a catalogue topic has no lesson;
- a lesson has no valid topic mapping;
- a quiz references a missing lesson/topic;
- duplicate IDs exist;
- a current progress ID no longer resolves.

### Step D — Generate and switch gradually

Generate the static lesson bundle and quiz catalogue from the canonical source. Switch one grade or a small representative group first. Verify all lesson URLs, quizzes, and progress records. Expand only after parity tests pass.

### Step E — Remove duplicates only after evidence

Delete orphaned generated files only after repository-wide reference scans, browser/network tests, CI checks, and a review of any external tooling that consumes them. Retain a rollback commit and do not remove old files in the same change that introduces the new content model.

## 5. Non-negotiable preservation requirements

- Preserve all current lesson IDs and public URLs.
- Preserve quiz IDs where stored attempts/progress depend on them.
- Preserve every lesson's text and media references during migration.
- Do not rewrite curriculum wording as part of a technical consolidation.
- Do not alter production Supabase curriculum or student progress while mapping static content.
- Do not infer missing curriculum relationships from display titles alone.

## Conclusion

The current site appears to maintain multiple copies of lesson and curriculum data. This is a likely source of drift and unnecessary repository weight. The correct next step is an automated content parity/consumer map, not immediate deletion or a bulk rewrite.
