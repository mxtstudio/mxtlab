# MXT Lab — Target Site Architecture

**Status:** Proposed architecture blueprint  
**Based on:** `docs/SITE_AUDIT_BASELINE_2026-11-26.md`  
**Guiding principle:** Evolve the existing platform safely; preserve learning content, public links, accounts, and student records.

Related references: [site audit baseline](./SITE_AUDIT_BASELINE_2026-11-26.md) · [route and lesson inventory](./ROUTE_INVENTORY.md) · [third-party/performance review](./THIRD_PARTY_AND_PERFORMANCE_AUDIT.md).

## 1. Product definition

MXT Lab should be one platform with two connected experiences:

### MXT Lab Learn — public education experience

A fast, mobile-first destination where students can discover curriculum content, learn, practise, revise, and track their learning after signing in.

### MXT Lab Teacher — professional workspace

A secure workspace for teachers to navigate curriculum, prepare teaching materials, generate assessments, manage classes, and review learning evidence.

Administration is a protected operational role, not a public product category. Future subjects and tools should fit into this architecture without forcing another site redesign.

## 2. Information architecture

### Public navigation

Keep the primary navigation short and task-based:

1. **Learn** — curriculum catalogue and lessons.
2. **Practice** — quizzes, revision tests, exam preparation.
3. **Resources** — downloads, glossary, study guides.
4. **For Teachers** — public Teacher Centre and application/access information.
5. **About** — mission, contact, policies.

The homepage should introduce the value of MXT Lab and provide clear routes into these five areas. Avoid placing admin links, staff-only tools, or multiple dashboard links in public navigation.

### Proposed route map

The exact URL implementation can be phased. Existing `.html` URLs remain supported while the architecture is consolidated.

| Area | Canonical destination (proposed) | Main contents |
|---|---|---|
| Home | `/` | Value proposition, grade entry, featured learning, clear calls to action |
| Learn | `/topics.html` initially | Grade → subject → strand → unit → topic → lesson |
| Lesson | Existing `/lessons/{lesson-id}.html` initially | Outcomes, content, PNG examples, activities, key terms, quiz, next lesson |
| Practice | `/quiz.html` initially | Quiz catalogue, filters, revision and exam practice |
| Resources | `/resources.html` | Study guides and supporting reading |
| Downloads | `/downloads.html` | Revision packs and printable resources |
| Glossary | `/glossary.html` | Searchable curriculum vocabulary |
| Teacher Centre | `/teacher-centre.html` | Apply, sign in, access status, help |
| Teacher application | `/apply-teacher.html` | Secure application and status |
| Student Workspace | `/app/student` (proposed) | Progress, learning plan, classes, saved work, recommendations |
| Teacher Workspace | `/app/teacher` (proposed) | Classes, curriculum, planning, assessments, analytics, documents |
| Admin Workspace | `/app/admin` (proposed) | Teacher approval, accounts, subscriptions, audit and platform operations |
| About and policies | Existing public URLs | About, contact, privacy, terms |

Do not create all proposed routes immediately. First identify the authoritative current page for each journey and decide whether to keep, redirect, or retire legacy pages.

## 3. Curriculum information model

The authoritative learning hierarchy should be:

`Grade → Subject → Strand → Unit → Content Standard → Benchmark → Topic → Lesson → Learning Activity / Quiz`

Every entity should have a stable identifier. Student progress, quiz attempts, saved resources, teacher lesson plans, and curriculum analytics should reference those identifiers rather than titles or display text.

### Content model principles

- One authoritative curriculum catalogue; no separately hand-maintained copies for topics, quizzes, dashboards, and lesson navigation.
- Separate curriculum metadata from lesson body content.
- Version content and retain a record of which curriculum version a lesson aligns to.
- Keep grade, subject, strand, unit, standard, benchmark, topic, and lesson relationships explicit.
- Support future subjects without hard-coding Agriculture assumptions into shared platform services.
- Preserve current lesson IDs and progress references through any migration.
- Use a validation step to ensure every published topic has a valid lesson/quiz destination and every progress record still resolves.

### Lesson experience

Every lesson should follow a predictable structure:
1. Grade, subject, strand, unit, topic, and benchmark context.
2. Learning outcomes.
3. Explanation and key concepts.
4. Papua New Guinea examples and applications.
5. Diagrams/media where they add value.
6. Teacher/student activities or reflection prompts.
7. Key terms.
8. Knowledge check or linked quiz.
9. Summary and next/related lessons.

## 4. Role-based application architecture

Use one authentication system and one profile/permission source, with distinct role experiences.

### Student

- Free access to public learning content.
- Personal progress and quiz history.
- Class joining through an approved class code/flow.
- Recommendations based on real curriculum progress.
- No access to another student's records unless a separately authorised teacher workflow allows an explicitly scoped view.

### Teacher

- Public Teacher Centre before authentication.
- Verified teacher approval and subscription/access checks.
- Own classes and authorised student roster only.
- Curriculum-aligned lesson/program/assessment generation.
- Class performance and learning-gap reporting only for authorised classes.
- Document generation and MCP connection management.
- Department tools only when the teacher has the required assignment.

### Administrator

- Teacher application review and role assignment through protected server/database functions.
- Subscription and account support.
- Security/audit logs and platform health.
- No reliance on hidden navigation links as a security boundary.

The UI may hide unavailable actions, but every protected API, database operation, and document download must enforce permissions independently.

## 5. Deployment and API boundary

The current static apex site and separate Next.js project are on different origins. Choose one explicit API contract before building more dashboard features.

Preferred options, in order of simplicity and safety:

1. **Same-origin API proxy:** keep the public static site on the apex domain and route a defined `/api/*` path to the Next.js service through a reviewed Vercel rewrite/proxy. The browser continues to call same-origin endpoints.
2. **Dedicated application/API origin:** assign a clearly named app/API subdomain and have the frontend use a central, environment-specific API base URL. Configure strict CORS for the exact approved frontend origins and test bearer-token handling.

Do not assume `www` is an API alias or that the browser's current origin automatically reaches the Next.js project. Do not alter domain assignments or DNS until the chosen design has been tested in a preview environment.

Keep server-only service-role credentials in the Next.js runtime. Never ship them to browser code. Use request-scoped verified identity and explicit ownership/tenant predicates for every privileged operation.

## 6. Shared design and frontend system

Create one shared visual language across public pages and authenticated workspaces:

- Shared design tokens for colour, typography, spacing, borders, focus, and responsive breakpoints.
- Shared navigation and footer patterns.
- Reusable cards, buttons, forms, alerts, breadcrumbs, tables, and empty/loading/error states.
- Consistent role-aware account menu.
- Mobile-first layouts and touch-friendly controls.
- Accessible labels, keyboard focus, semantic headings, and reduced-motion support.
- Low-bandwidth defaults: minimise external scripts, lazy-load non-critical images, avoid unnecessary animation, and provide useful content if third-party services fail.

Do not make a visual redesign that increases the page weight or makes reading difficult on low-cost mobile devices.

## 7. Search and discovery

Provide one search experience that can find:
- Grades and subjects.
- Strands, units, topics, and lessons.
- Glossary terms.
- Public resources and revision packs.

Search results should display grade and curriculum context, not just a title. Search must work without authentication for public learning resources. Personal recommendations and private saved content can be added after sign-in.

## 8. URL and migration strategy

- Preserve all current public lesson URLs during the first structural phase.
- Keep stable lesson/topic identifiers even if display titles change.
- Introduce redirects only after each old URL has a tested destination.
- Do not delete a legacy page until incoming internal links, sitemap entries, analytics usage, and external references have been reviewed.
- Keep private workspace URLs out of the public sitemap.
- Update canonical URLs, sitemap, structured data, and internal links together.

## 9. Phased implementation plan

### Phase 0 — Baseline and decisions
- Complete route/page inventory.
- Confirm actual user journeys and current production behaviour.
- Resolve the API-origin decision.
- Confirm which dashboards are real, demo-only, or retired.
- Publish and review this architecture blueprint.

### Phase 1 — Navigation and entry points
- Complete and verify the teacher entry/navigation work.
- Replace homepage placeholder links.
- Standardise public navigation and breadcrumbs.
- Ensure one sign-in return path per role and safe fallbacks.
- Preserve old links with compatibility redirects.

### Phase 2 — Application boundaries
- Connect the static frontend to the Next.js API through the chosen API contract.
- Test student sign-in, progress reads/writes, teacher access, and admin review.
- Keep the Next.js browser dashboard closed until server-side sessions are ready.
- Remove demo data from any production-facing analytics.

### Phase 3 — Curriculum source of truth
- Map every existing lesson, topic, quiz, and progress identifier.
- Resolve duplicate/orphaned data sources.
- Create a versioned curriculum/content schema.
- Generate catalogue/navigation/quiz indexes from the same source.
- Validate full parity before switching consumers.

### Phase 4 — Shared interface and workspaces
- Build common page shell and components.
- Consolidate student, teacher, and admin navigation.
- Make loading, empty, error, and access-denied states consistent.
- Add genuine teacher class and assessment workflows only when backend contracts are ready.

### Phase 5 — Performance, accessibility, and quality
- Test low-bandwidth mobile performance.
- Review external scripts, privacy, and third-party failure modes.
- Add automated route/link/content validation.
- Run keyboard, screen-reader, contrast, and reduced-motion checks.
- Verify sitemap, canonical URLs, and redirects.

### Phase 6 — Expansion
- Add more subjects and educational services using the same curriculum and account architecture.
- Consider broader MXT Lab creative-studio services only when the core education product is stable.

## 10. Release gates

A phase is not complete merely because the code compiles. Each release must satisfy:

- No existing user accounts or student records are lost or altered unexpectedly.
- No cross-student or cross-teacher data access.
- Every visible navigation control has a working destination/action.
- All public lesson URLs and stable content IDs continue to resolve.
- Student progress is recorded and displayed accurately.
- Teacher-only and admin-only functions are enforced server-side.
- The API origin, CORS/proxy, and OAuth return paths are tested on the actual intended domains.
- No secrets are exposed in client bundles or logs.
- Mobile usability and performance remain acceptable on constrained connections.
- Preview verification succeeds before production deployment.

## 11. Explicit non-goals for the first refactor

- Do not rewrite all 68 lessons.
- Do not change the curriculum content just to fit a new page template.
- Do not migrate the live database wholesale.
- Do not reset Supabase or recreate user accounts.
- Do not remove the two Vercel projects until their deployment and domain responsibilities are proven.
- Do not launch additional subjects or unrelated studio products before the core journeys are reliable.

## Decision record

The following decisions require confirmation through implementation evidence, not guesswork:

1. Whether the static apex project will proxy `/api/*` to Next.js or use a dedicated app/API origin.
2. Which existing dashboard page is the authoritative student workspace.
3. Whether `teacher-os.html` remains the current teacher UI while the Next.js dashboard is developed, or whether the teacher experience will move into the Next.js app.
4. Which curriculum data file/schema becomes authoritative after all consumers are mapped.
5. Which legacy routes must remain permanent compatibility routes.

Until those decisions are verified, keep the existing content and routes intact.
