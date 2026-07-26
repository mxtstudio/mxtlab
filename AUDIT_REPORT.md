# MXT Lab — Site Audit Report (Phase 1)
**Date:** July 2026
**Auditor:** Jules (Software Engineer AI Agent)
**Status:** Phase 1 Complete (Read-Only Pass)

---

## Executive Summary
A comprehensive read-only audit across all **83 HTML files** (including 13 root pages and 68+ lesson pages under `/lessons/`) has been completed. The audit was conducted using both manual inspections and a custom automated link-checking script to ensure 100% accuracy.

The overall code quality is high: there are **zero (0)** mismatched structural HTML tags, **zero (0)** broken asset/media paths (images, stylesheets, and scripts), and all lessons follow a highly consistent format.

However, we have identified **one critical sitewide navigation bug** (237 occurrences of a broken link), **one moderate inconsistent integration issue** on the teacher portal, and **two minor sitemap/legacy-code discrepancies**.

---

## Detailed Findings

### 1. [CRITICAL] Sitewide Broken Link: `/teachers.html` vs `/teacher-os.html`
* **File(s) and Line(s) Involved:**
  - **11 Root Pages (excluding dashboard.html which has no nav links):**
    - `index.html` (Lines 1005, 1043, 1763)
    - `about.html` (Lines 91, 141, 260)
    - `careers.html` (Lines 162, 464)
    - `contact.html` (Lines 91, 141, 269)
    - `downloads.html` (Lines 140, 190, 318)
    - `glossary.html` (Lines 91, 142, 235)
    - `privacy.html` (Lines 91, 141, 235)
    - `quiz.html` (Lines 163, 213, 341)
    - `resources.html` (Lines 112, 162, 281)
    - `terms.html` (Lines 91, 141, 235)
    - `topics.html` (Lines 91, 141, 243)
  - **Sitemap:** `sitemap.xml` (Line 32)
  - **68 Lesson Pages:** Every single lesson file in `/lessons/` contains exactly 3 broken links (in the desktop navbar, mobile drawer, and footer, e.g. `lessons/g9-soil-formation.html` lines 95, 135, and 488).
  - **Total Occurrences:** Exactly 237 occurrences across the codebase (33 on root pages + 204 across the 68 lesson files).
* **What's Wrong:** All navbars, drawers, and footers across the site link to `teachers.html` or `../teachers.html`. This file does not exist on production, causing a **404 File Not Found** error when users click "For Teachers". The actual working filename is `teacher-os.html`.
* **Proposed Fix (Phase 2):**
  - Update all 237 references from `teachers.html` to `teacher-os.html` (and from `../teachers.html` to `../teacher-os.html` inside the `/lessons/` directory).
  - Update `sitemap.xml` to list `/teacher-os.html` instead of `/teachers.html`.
* **Confidence Level:** Certain.

---

### 2. [MODERATE] Inconsistent Third-Party Integrations on `teacher-os.html`
* **File(s) and Line(s) Involved:**
  - `teacher-os.html`
* **What's Wrong:** Unlike all other root and lesson pages across mxtlab.online, `teacher-os.html` does not include:
  1. The Google Analytics tracking tag (`G-57V6ZXCDK8`) in its `<head>`.
  2. The Adsterra Social Bar advertisement script at the bottom of the `<body>`.
  This prevents tracking traffic and user engagement on the Teacher OS page, and misses potential ad revenue from this section.
* **Proposed Fix (Phase 2):**
  - Add the standard Google Analytics tracking code block inside the `<head>` of `teacher-os.html`.
  - Add the Adsterra Social Bar snippet right before `</body>` in `teacher-os.html` to keep its integration identical to other root pages like `dashboard.html` and `careers.html`.
* **Confidence Level:** Certain.

---

### 3. [MINOR] Leftover SPA-Era Routing Code in `index.html`
* **File(s) and Line(s) Involved:**
  - `index.html` (SPA Router Logic, lines 1012–1051 and various matching `page-*` divisions)
* **What's Wrong:** There is leftover routing logic from the site's previous SPA (Single Page App) architecture. Since the site was converted to a multi-page app (MPA) using standalone files (`about.html`, `contact.html`, `privacy.html`, `terms.html`, `topics.html`), the inline sections inside `index.html` (such as `#page-about`, `#page-contact`, etc.) and the SPA `nav()` script are dead code.
* **Proposed Fix (Phase 2):**
  - Do NOT modify or remove anything during Phase 2 to prevent regressions or breaking current working logic, but flag this as deprecated/dead code to be refactored or safely cleaned up in a future, separate cleanup pass once the MPA conversion is verified 100% stable.
* **Confidence Level:** Certain.

---

### 4. [MINOR] Sitemap Discrepancy & Omissions
* **File(s) and Line(s) Involved:**
  - `sitemap.xml` (Lines 14–49)
* **What's Wrong:**
  1. The sitemap explicitly contains the broken `teachers.html` (which returns a 404).
  2. The sitemap is missing `dashboard.html` and `teacher-os.html`.
* **Proposed Fix (Phase 2):**
  - Replace `<loc>https://mxtlab.online/teachers.html</loc>` with `<loc>https://mxtlab.online/teacher-os.html</loc>` inside `sitemap.xml`.
  - Add `/dashboard.html` to the sitemap to improve SEO indexability.
* **Confidence Level:** Certain.

---

## Conclusion
The repository is exceptionally clean, but the sitewide broken link to `/teachers.html` needs to be addressed to ensure a seamless experience for teachers and students in Papua New Guinea. All proposed fixes are highly isolated, fully understood, and safe to execute immediately upon your approval.
