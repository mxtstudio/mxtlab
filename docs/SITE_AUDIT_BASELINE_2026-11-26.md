# MXT Lab — Site Structure Audit Baseline

**Audit snapshot:** 26 November 2026  
**Repository:** `mxtstudio/mxtlab`  
**Audited revision:** `main` at `e2f93581b747900d0705b3436f071dec895c3a3b`  
**Method:** Read-only repository inventory, selected source-file inspection, GitHub PR/status inspection, and read-only Vercel project/domain inspection.  
**Change status:** Documentation-only branch. No production deployment, DNS, environment variable, Supabase schema, account, or student-progress changes were made.

## Executive assessment

MXT Lab has a useful and distinctive PNG-first learning proposition and a substantial existing Agriculture content library. The current technical structure, however, has grown into several overlapping experiences rather than one clearly defined platform.

The repository currently combines:

1. A public static multi-page website served from the apex domain.
2. Sixty-eight individual static lesson pages.
3. A browser-side lesson, quiz, glossary, and strand data layer.
4. Student, teacher, and administrator pages with differing levels of implementation.
5. A separate Next.js application containing API routes and the MCP endpoint.
6. Supabase authentication, curriculum, progress, teacher-application, and staff data.

The recommended direction is **not a ground-up rewrite**. Retain the working content and stable public URLs while progressively establishing one navigation model, one curriculum source of truth, one clearly defined application boundary, and role-specific workspaces.

## 1. Repository inventory

The recursive Git tree for the audited revision contains 259 entries.

| Area | Observed inventory |
|---|---:|
| HTML files | 88 |
| Root-level HTML files | 20 |
| Individual lesson HTML files | 68 |
| JavaScript files | 81 |
| Lesson-specific JavaScript files | 68 |
| CSS files | 2 |
| SQL files | 15 |
| Vercel application roots | 2 |

The 20 root-level HTML files include two search-engine verification files. The remaining pages cover the homepage, curriculum catalogue, resources, glossary, quizzes, downloads, informational/legal pages, and role-specific experiences.

### Public and utility pages currently present

- `index.html`
- `topics.html`
- `resources.html`
- `glossary.html`
- `quiz.html`
- `downloads.html`
- `about.html`
- `careers.html`
- `contact.html`
- `privacy.html`
- `terms.html)

### Account and staff pages currently present

- `dashboard.html`
- `student-dashboard.html`
- `teacher-centre.html`
- `apply-teacher.html`
- `teacher-dashboard.html`
- `teacher-os.html`
- `admin-dashboard.html`

The 68 lesson HTML files are grouped under `lessons/` and span Grades 9–12. There are also 68 corresponding files under `assets/js/lessons/`. Their exact runtime role and whether they are all referenced must be verified before any cleanup.

## 2. Deployment and application boundary

Read-only Vercel inspection found two distinct projects and domain assignments:

| Project | Repository root/configuration | Attached custom domain |
|---|---|---|
| `mxtlab` | Static site root; root `vercel.json` sets headers and no framework | `mxtlab.online` |
| `mxtlab-8e22` | Next.js; `dept-os-mcp/vercel.json` selects Next.js | `www.mxtlab.online` |

This split can be a valid deployment design, but the browser-facing contract between the static site and Next.js API must be explicit.

### High-priority integration finding: student dashboard API origin

Evidence:

- `assets/js/student-dashboard.js` calls relative paths `/api/student/progress` and `/api/curriculum/subjects`.
- Those API routes are implemented inside the separate Next.js app under `dept-os-mcp/app/api/`.
- The static site's root `vercel.json` contains security headers but no API rewrite or proxy route.
- Vercel currently assigns the apex domain to the static project and `www` to the separate Next.js project.

Therefore, when the student dashboard is served from `https://mxtlab.online`, its relative API calls resolve against the apex origin, not automatically against the separate Next.js project. This is a likely integration defect and must be confirmed with browser/network testing. It should be resolved deliberately by either:
- configuring a secure same-origin API proxy/rewrite from the static project to the Next.js service; or
- using a documented API origin and implementing the required CORS, credential, and error-handling rules.

Do not add an arbitrary cross-origin URL in client code or change DNS as a quick fix. First choose and document the canonical API boundary, then test it with student accounts and isolated test data.

### Current application status

- The Next.js app contains authenticated API routes for curriculum and student progress, plus an MCP endpoint.
- The Next.js `/dashboard` page explicitly remains closed pending secure browser-session authentication.
- The MCP README states that the current bearer-token approach is not a complete OAuth sign-in/reconnect experience.
- The root static site has a separate `teacher-os.html` page. It must not be assumed to be the same thing as the Next.js MCP dashboard.

## 3. Structural and user-journey findings

### Finding IA-01 — Too many overlapping dashboard destinations

There are separate student, generic, teacher, and admin destinations. In particular:
- `dashboard.html` and `student-dashboard.html` overlap as student-facing entry points.
- `teacher-dashboard.html` and `teacher-os.html` both appear to be teacher destinations.
- `teacher-centre.html` and `apply-teacher.html` are public entry/application pages.
- `admin-dashboard.html` is a separate staff destination.

This creates uncertainty about which page is authoritative and makes navigation, authentication redirects, access checks, and support harder to maintain.

**Recommendation:** one public Teacher Centre, one protected Student Workspace, one protected Teacher Workspace, and one protected Admin Workspace. Retain old URLs as compatibility redirects until their use and dependencies have been checked.

### Finding IA-02 — Teacher journey needs one clear front door

The homepage currently contains direct links to teacher OS, teacher application, teacher dashboard, and admin dashboard. The main navigation and some secondary pages also still refer directly to `teacher-os.html`.

The intended teacher journey should be:

`For Teachers → Teacher Centre → Sign in / Apply → Application status → Approval → Subscription/access check → Teacher Workspace`

Admin-only entry points should not be promoted as ordinary public navigation. The role check must remain server/database enforced; hiding links is not authorization.

PR #38 proposes navigation and teacher-entry improvements, but it was still open and unmerged at this audit snapshot. Treat it as a pending change, not deployed behaviour.

### Finding IA-03 — Homepage contains placeholder anchors

The current homepage source contains several links with `href="#"`, including grade and strand navigation items. Some may be enhanced by client-side handlers, so they are not all proven broken from static inspection alone.

**Recommendation:** verify each one in a browser and replace placeholder destinations with real catalogue filters or routes. A visible navigation control must always have a useful action and keyboard-accessible behaviour.

### Finding IA-04 — Student dashboard mixes real data with demo assumptions

The current student dashboard script:
- calls the separate Next.js API through relative same-origin paths;
- treats progress rows as a proxy for quiz attempts;
- displays a topic ID fragment as a placeholder quiz label;
- computes a completion percentage from the number of progress records rather than a clearly defined assigned curriculum denominator;
- contains a code comment questioning the relationship between profile IDs and roster student IDs.

These are signs of a prototype that needs product definition before it is presented as a reliable learning analytics dashboard. Do not rewrite or migrate student progress until the data model and ownership relationships are verified.

### Finding IA-05 — Teacher dashboard contains demonstration features

The current `teacher-dashboard.js` explicitly reports that class roster integration is not connected, uses demonstration chart data, uses placeholder priorities, and saves lesson planner drafts only as a local preview rather than persisting them.

**Recommendation:** label unfinished features honestly or keep the legacy page out of the primary teacher journey. The Teacher Workspace should expose only features that work and have tested authorization.

## 4. Content and data architecture findings

### Finding DATA-01 — Curriculum/strand data may have multiple sources

Both `assets/js/main.js` and `assets/js/strands-data.js` contain a `STRANDS_9` data structure. The current pages inspected load `main.js`; references to `strands-data.js` were not found in the targeted repository search.

This suggests possible duplicated or orphaned curriculum data. Confirm all consumers before changing or deleting either file.

### Finding DATA-02 — Large browser-side lesson data bundle

`assets/js/lesson-data.js` is approximately 456 KB and contains the central lesson object/data. The repository also contains 68 lesson-specific JavaScript files. The duplication/usage relationship is not yet established.

**Recommendation:** establish a single versioned content model with stable IDs and explicit grade, subject, strand, unit, standard, benchmark, topic, lesson, and quiz relationships. Generate static pages and quiz catalogues from that model over time. Do not make a bulk content migration until equivalence checks prove every current lesson, quiz, and progress ID is preserved.

### Finding DATA-03 — Preserve existing lesson URLs and identifiers

The current sitemap lists 79 URLs: 11 public top-level URLs (including the homepage) and 68 lesson URLs. This is a useful existing SEO and sharing footprint.

Keep current lesson URLs working during structural changes. If routes are later modernised, preserve old URLs with permanent redirects only after checking internal references, external backlinks, canonical tags, and saved student links.

## 5. Performance, privacy, and maintainability observations

- Public pages load third-party Google Analytics, Google Fonts, Supabase's browser client from `esm.sh`, and ad-network scripts on several pages. Maintain a reviewed inventory of external origins, purpose, data handling, and fallback behaviour.
- Third-party scripts should be limited to pages that need them. Measure their effect on mobile loading and interaction, especially on slower PNG connections.
- The root stylesheet and lesson stylesheet are separate; establish shared design tokens and reusable components before broad visual redesign.
- `sw.js` is currently a cleanup worker that clears old caches and unregisters itself. Do not describe the site as having a functioning offline/PWA experience until a deliberately designed and tested service worker is implemented.
- The site should remain lightweight, mobile-first, accessible, and usable on low bandwidth. Prefer compressed images, minimal external dependencies, deferred non-critical scripts, and readable text over heavy effects.

## 6. SEO baseline

The current `sitemap.xml` contains 79 URLs: the homepage, ten public information/learning hub pages, and the 68 lesson pages. It does not include the account dashboards or staff-only pages in the inspected version.

This is a sensible public/private distinction. Keep authenticated, admin, and staff-only pages out of the public sitemap. Validate the sitemap against actual deployed status codes, canonical URLs, and robots directives after route changes.

## 7. Database and account safety constraints

The current Supabase live project has a recorded migration-history reconciliation issue documented in `supabase/MIGRATION_DRIFT.md`: the live ledger contains 100 applied migrations, while the repository has 12 active migration files and 88 historical SQL files still missing. This is a reproducibility/source-control issue, not evidence that live tables are missing.

Hard constraints for this architecture project:

- Do not reset or recreate the production database.
- Do not delete, merge, rename, or recreate existing user accounts.
- Do not alter student progress, class membership, teacher applications, or teacher/admin roles as part of a site-structure refactor.
- Do not reapply demo schema files to production.
- Use additive, reviewed migrations only when a database change is genuinely necessary and separately approved.
- Preserve the current student/teacher/admin role boundaries and enforce authorization server-side.

PR #46 proposes restricting self-created profile inserts to the student role. It remains open and unapplied at this snapshot; it is not part of this documentation change.

## 8. Existing pending work and deployment constraints

At the audit snapshot:
- PR #38 (teacher entry/navigation and OAuth return paths) is open and unmerged.
- PR #46 (self-profile insert role restriction) is open and unmerged.
- The Vercel status checks on the audited main commit report a deployment rate limit for both projects. This is a platform build-capacity limitation, not a code test result.
- No production change was made by this audit.

Keep the architecture work in its own branch so it can be reviewed independently from those changes.

## 9. Priority register

| Priority | Work item | Why it comes first |
|---|---|---|
| P0 | Confirm and fix the student dashboard API-origin boundary | The frontend and API currently live on separate Vercel origins |
| P0 | Complete the public teacher entry/navigation journey | Users should not be sent to staff-only or prototype destinations |
| P1 | Define one canonical route map and dashboard per role | Removes ambiguity and reduces duplicate maintenance |
| P1 | Map all curriculum/lesson/quiz IDs and data consumers | Prevents broken links and lost progress during consolidation |
| P1 | Separate real features from demo/prototype features | Prevents misleading dashboard information |
| P2 | Standardise shared navigation, page shell, typography, and components | Makes the experience coherent and easier to maintain |
| P2 | Audit third-party scripts and mobile performance | Reduces load, privacy, and reliability risk |
| P2 | Reconcile the public sitemap and legacy redirects after routing decisions | Preserves SEO and shared links |
| P3 | Expand subjects and broader MXT Lab services | Do this after the core platform is stable |

## 10. Verification still required

Repository inspection does not replace browser testing. Before implementation, verify:
1. The homepage and every public navigation item on a real mobile viewport.
2. All 68 lesson pages, their quiz links, previous/next links, and progress recording.
3. Student sign-in, return path, dashboard API requests, and progress persistence.
4. Teacher application, pending/approved states, subscription gating, and department assignment.
5. Teacher and admin workspace authorization with separate test accounts.
6. Apex/www/API origin behaviour and CORS or proxy configuration.
7. Keyboard navigation, screen-reader labels, reduced motion, contrast, and low-bandwidth performance.

## Conclusion

The content and educational mission are worth preserving. The core problem is not the number of pages by itself; it is the absence of one authoritative structure tying those pages, data sources, deployments, and user journeys together.

Use this baseline as the reference for the next phase. Update it when findings are confirmed by browser tests or when implementation decisions change.
