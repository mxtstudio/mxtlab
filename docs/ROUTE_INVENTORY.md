# MXT Lab — Route and Page Inventory

**Snapshot:** 26 November 2026  
**Source revision:** `e2f93581b747900d0705b3436f071dec895c3a3b` (`main`)  
**Purpose:** A practical page-by-page reference for navigation consolidation. This inventory does not authorise deletion or renaming.

## 1. Root-level HTML pages

There are 20 root-level HTML files. Two are verification files and should be retained unless the corresponding search-console verification has been deliberately replaced and checked.

| Page | Current role | Proposed treatment |
|---|---|---|
| `index.html` | Public homepage / SPA-style Agriculture landing page | Keep as public home; simplify navigation gradually |
| `topics.html` | Public Grade 9–12 Agriculture catalogue | Keep as primary Learn/Curriculum destination |
| `resources.html` | Public study resources | Keep under Resources |
| `glossary.html` | Public Agriculture glossary | Keep under Resources |
| `quiz.html` | Public quiz catalogue | Keep under Practice |
| `downloads.html` | Public revision packs/downloads | Keep under Resources or Practice |
| `about.html` | Public organisation/about page | Keep under About |
| `careers.html` | Agriculture career pathways | Keep; classify as an educational resource |
| `contact.html` | Public contact page | Keep under About/footer |
| `privacy.html` | Public privacy policy | Keep in footer |
| `terms.html` | Public terms of use | Keep in footer |
| `dashboard.html` | Generic/legacy authenticated dashboard destination | Review; select one canonical student destination and preserve compatibility |
| `student-dashboard.html` | Student learning dashboard | Candidate canonical Student Workspace entry; validate API origin and progress semantics first |
| `teacher-centre.html` | Public teacher information/access entry | Keep as the single public teacher front door |
| `apply-teacher.html` | Teacher access application | Keep as a workflow destination from Teacher Centre |
| `teacher-dashboard.html` | Legacy teacher dashboard with demonstration data | Do not present as a production workspace; preserve URL until redirects are tested |
| `teacher-os.html` | Existing department-based Teacher OS | Retain for approved staff until a verified replacement is ready |
| `admin-dashboard.html` | Teacher application review/admin UI | Keep protected; link only from authenticated admin navigation |
| `google4e93699060907ca6.html` | Search-engine ownership verification | Preserve |
| `9fc6rz2u518fl3yon6ztabun19l2h4.html` | Search-engine ownership verification | Preserve |

## 2. Lesson routes by grade

There are 68 individual lesson pages. The grade distribution is:

| Grade | Lesson pages |
|---|---:|
| Grade 9 | 22 |
| Grade 10 | 24 |
| Grade 11 | 14 |
| Grade 12 | 8 |
| **Total** | **68** |

### Grade 9 — 22 pages

- `lessons/g9-agri-imports-exports.html`
- `lessons/g9-agribusiness-economics.html`
- `lessons/g9-agribusiness-planning.html`
- `lessons/g9-animal-anatomy.html`
- `lessons/g9-animal-farming.html`
- `lessons/g9-aqua-farming-systems.html`
- `lessons/g9-aqua-technology.html`
- `lessons/g9-crop-farming.html`
- `lessons/g9-crop-technology.html`
- `lessons/g9-forest-harvesting.html`
- `lessons/g9-forest-management.html`
- `lessons/g9-forestry-technology.html`
- `lessons/g9-forests.html`
- `lessons/g9-horticulture-technology.html`
- `lessons/g9-horticulture.html`
- `lessons/g9-intro-aquaculture.html`
- `lessons/g9-monogastric-polygastric.html`
- `lessons/g9-pomology-olericulture.html`
- `lessons/g9-poultry-farming.html`
- `lessons/g9-poultry-types.html`
- `lessons/g9-soil-formation.html`
- `lessons/g9-types-crops.html`

### Grade 10 — 24 pages

- `lessons/g10-agribusiness-marketing.html`
- `lessons/g10-agribusiness-risk.html`
- `lessons/g10-agribusiness-startup.html`
- `lessons/g10-animal-breeds.html`
- `lessons/g10-animal-husbandry.html`
- `lessons/g10-animal-nutrition.html`
- `lessons/g10-animal-physiology.html`
- `lessons/g10-animal-postharvest.html`
- `lessons/g10-aqua-environments.html`
- `lessons/g10-aqua-management.html`
- `lessons/g10-aqua-tech.html`
- `lessons/g10-capture-fishery.html`
- `lessons/g10-crop-classification.html`
- `lessons/g10-crop-management.html`
- `lessons/g10-forest-conservation.html`
- `lessons/g10-forest-management.html`
- `lessons/g10-forestry-tech.html`
- `lessons/g10-forests-types.html`
- `lessons/g10-horticulture-tech.html`
- `lessons/g10-ornamental-cultivation.html`
- `lessons/g10-plant-propagation.html`
- `lessons/g10-poultry-management.html`
- `lessons/g10-soil-improvement.html`
- `lessons/g10-types-plants.html`

### Grade 11 — 14 pages

- `lessons/g11-apiculture.html`
- `lessons/g11-aqua-marketing.html`
- `lessons/g11-aromatic-plants.html`
- `lessons/g11-biennial-crops.html`
- `lessons/g11-capture-fishery.html`
- `lessons/g11-credit-financing.html`
- `lessons/g11-financial-management.html`
- `lessons/g11-financial-statements.html`
- `lessons/g11-fish-species.html`
- `lessons/g11-forest-products.html`
- `lessons/g11-horticulture-tech.html`
- `lessons/g11-livestock-management.html`
- `lessons/g11-poultry-processing.html`
- `lessons/g11-soil-nutrients.html`

### Grade 12 — 8 pages

- `lessons/g12-advanced-finance.html`
- `lessons/g12-aqua-advanced.html`
- `lessons/g12-crop-physiology.html`
- `lessons/g12-forestry-processing.html`
- `lessons/g12-horticulture-commercialisation.html`
- `lessons/g12-poultry-project.html`
- `lessons/g12-quality-animal-products.html`
- `lessons/g12-soil-topography.html`

## 3. Matching lesson JavaScript files

The repository also contains 68 files in `assets/js/lessons/`, with matching grade-prefixed lesson IDs. Their actual import/runtime usage has not yet been established. Do not delete or merge these files based only on their names. The next content audit should map:
- each HTML page to its loaded scripts;
- each lesson ID in the catalogue to its HTML route;
- each quiz ID to its quiz data;
- each saved progress ID to its curriculum/topic record.

## 4. Sitemap snapshot

The current `sitemap.xml` contains 79 URLs:
- the homepage;
- ten public top-level content/information pages;
- all 68 lesson pages.

The inspected sitemap excludes account dashboards and staff-only pages. Preserve this public/private separation.

## 5. Consolidation rules

1. Keep all 68 current lesson URLs working.
2. Keep the two verification files.
3. Keep the Teacher Centre as the public teacher entry point.
4. Make only one canonical Student Workspace destination.
5. Make only one canonical Teacher Workspace destination.
6. Keep Admin Workspace links out of public navigation.
7. Redirect legacy URLs only after checking references and verifying the destination.
8. Never change topic IDs used by quizzes or progress without a complete mapping and preservation test.
