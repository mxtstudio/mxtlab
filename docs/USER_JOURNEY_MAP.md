# MXT Lab — User Journey Map

**Snapshot:** 26 November 2026  
**Purpose:** Map the main visitor and account journeys to current pages and identify where the experience needs consolidation. This is a source-based review, not a claim that every flow has been browser-tested.

## 1. Student journey

### Intended journey

`Discover MXT Lab → Choose grade → Browse Agriculture curriculum → Open lesson → Practise → Sign in → Track progress → Continue learning`

| Stage | Current page/component | Current observation |
|---|---|---|
| Discover | `index.html` | Public homepage with grade and topic navigation |
| Browse | `topics.html` | Public Grade 9–12 Agriculture catalogue |
| Learn | `lessons/{lesson-id}.html` | 68 public lesson pages |
| Practise | `quiz.html` and lesson quiz UI | Quiz catalogue and lesson-level quiz data |
| Sign in | `assets/js/auth.js` | Google OAuth |
| Dashboard | `dashboard.html`, `student-dashboard.html` | Two overlapping student destinations |
| Progress | `dept-os-mcp/app/api/student/progress/route.ts` | Authenticated API in the separate Next.js project |

### Gaps to resolve

- Choose one canonical Student Workspace URL.
- Align OAuth return destinations and account-menu destinations with the role.
- Resolve the API-origin boundary: the static site calls relative `/api/*`, while the API is deployed in the separate Next.js project.
- Replace quiz-history placeholders with actual quiz attempts and scores.
- Define a correct completion denominator (e.g. assigned/published topics) rather than dividing completed progress rows by the number of progress rows.
- Confirm the relationship between profile IDs, roster IDs, class membership, and student progress before changing any data model.

## 2. Teacher journey

### Intended journey

`Public Teacher Centre → Sign in / Apply → Submit details → Admin review → Approval → Department assignment → Subscription/access check → Teacher Workspace`

| Stage | Current page/component | Current observation |
|---|---|---|
| Discover teacher tools | `teacher-centre.html` | Public information and entry page |
| Apply | `apply-teacher.html` | Teacher application workflow |
| Review | `admin-dashboard.html` + `review_teacher_application` RPC | Protected administrator workflow |
| Open workspace | `teacher-os.html` | Existing department-based Teacher OS |
| Legacy dashboard | `teacher-dashboard.html` | Demonstration chart, placeholder priorities, roster not connected, lesson planner preview only |
| MCP | `dept-os-mcp/app/api/mcp/route.ts` | Bearer-token authenticated MCP endpoint |

### Gaps to resolve

- Use Teacher Centre as the only public entry point.
- Do not send guests or students directly to `teacher-os.html`.
- Show the workspace link only when the signed-in account has the required staff role and department assignment.
- Keep role and department authorization enforced server-side/database-side; UI visibility is not security.
- Clearly distinguish working Teacher OS capabilities from planned tools.
- Do not present the current MCP bearer-token mechanism as a complete OAuth experience.
- Do not reopen the Next.js browser dashboard until secure server-side session authentication is implemented.

PR #38 contains a proposed teacher navigation and OAuth-return-path correction. Its latest static/MCP tests and security scans passed after a syntax correction, but it remains unmerged and still needs browser verification.

## 3. Administrator journey

### Intended journey

`Admin sign-in → Admin Workspace → Review teacher applications → Approve/decline → Review audit trail → Manage platform operations`

Current entry: `admin-dashboard.html`, protected by the admin role check and the database review function.

### Gaps to resolve

- Keep admin links out of public navigation.
- Consolidate admin-only operations into one protected workspace over time.
- Keep approvals and role changes in database/server-side functions.
- Preserve the existing admin account and audit records.
- Add clear loading, error, empty, and success states for application review.

## 4. Public content journey

### Intended journey

`Home → Learn / Practice / Resources / For Teachers / About`

The primary navigation should reflect what visitors want to do, not expose every underlying page. For example:
- Learn contains grade and curriculum navigation.
- Practice contains quizzes and exam preparation.
- Resources contains downloads, glossary, and study support.
- For Teachers leads to Teacher Centre.
- About contains organisation information, contact, and policies.

Careers can remain a public learning resource but should not compete with the five primary navigation choices.

## 5. Journey ownership and completion criteria

| Journey | Owner area | Completion criteria |
|---|---|---|
| Student learning | Public site + Student Workspace | Lesson, quiz, and progress IDs remain consistent; progress saves and displays correctly |
| Teacher access | Teacher Centre + Auth + Admin review | Application status is clear; approval and department checks are enforced |
| Teacher productivity | Teacher OS + MCP | Only real features are shown; class and department data are correctly scoped |
| Administration | Admin Workspace + database RPCs | All actions are authorised and audited |
| Public discovery | Public site | Every navigation item resolves; pages remain searchable and mobile-friendly |

## 6. Test matrix before release

Use separate test accounts for guest, student, pending teacher, approved teacher without department, approved teacher with department, and administrator states.

| Test identity/state | Expected result |
|---|---|
| Guest | Can browse public lessons and Teacher Centre; cannot open private workspaces |
| Student | Can learn and practise; sees only own progress and student tools |
| Pending teacher applicant | Can see application status; no teacher permissions before approval |
| Approved teacher without department | Can see approved status; cannot open department workspace |
| Approved teacher with department | Can open only authorised teacher/department functions |
| Administrator | Can access admin operations and authorised staff functions |
| Revoked/expired session | Protected APIs reject the request; no cached private data remains accessible |

All tests must preserve the five existing test/real accounts and existing student learning records. Do not use name-based matching to join accounts or infer identity.

## Conclusion

The platform should guide each person through one obvious journey. A visitor should not need to understand the underlying HTML files, Vercel projects, database roles, or old dashboards to use MXT Lab. The implementation should hide that complexity while preserving clear access boundaries.
