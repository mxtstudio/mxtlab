# MXT Lab — Third-Party Script and Performance Review

**Snapshot:** 26 November 2026  
**Scope:** Repository-level review of external script/style references and deployment header configuration. No vendor script was executed or dynamically inspected.

## Executive summary

MXT Lab relies on several external origins for analytics, fonts, authentication libraries, advertising, and contact/social links. Some of those are necessary product dependencies; others are optional. The main structural concern is that advertising scripts are embedded directly in many public HTML pages, so third-party JavaScript is part of the page execution environment rather than an isolated service.

This is not evidence that the advertising provider is malicious. It is a reason to maintain a strict vendor inventory, limit script execution to pages that need it, measure its effect on mobile performance, and verify the actual production Content Security Policy (CSP).

## 1. External dependency inventory

| Provider/origin | Observed purpose | Recommendation |
|---|---|---|
| `www.googletagmanager.com` | Google Analytics tag bootstrap | Keep only if analytics is actively used; document event collection and privacy notice |
| `fonts.googleapis.com` and `fonts.gstatic.com` | Web fonts | Consider self-hosting or a system-font fallback to reduce third-party requests and improve resilience |
| `esm.sh` | Browser-side Supabase JS package import in `assets/js/auth.js` | Pin and review the exact package version; consider a locally bundled dependency if build architecture allows |
| Supabase project host | Authentication and database API | Required platform dependency; keep publishable key public and rely on correctly tested RLS/server authorization |
| `www.highperformanceformat.com` | Advertising scripts embedded in homepage and many content pages | Review provider, placement, data handling, redirect/pop-up behaviour, and page-weight impact; load only where monetisation is intended |
| `effectivecpmnetwork.com` subdomains | Permitted by the repository CSP in `_headers` | Verify whether the ad provider still requires these origins; remove unused CSP allowances only after traffic review |
| `formspree.io` | Contact form endpoint referenced by homepage | Confirm form destination, spam controls, and privacy disclosure |
| Social/video domains | External links and embeds | Use privacy-conscious embeds and avoid loading third-party iframe code before user interaction where possible |

## 2. Advertising script footprint

The code search found `highperformanceformat.com` references in the homepage, several public information pages, and many lesson pages. The homepage includes two ad script IDs; sampled lesson pages include multiple ad script IDs.

This increases:
- JavaScript downloaded and executed before or during reading;
- the number of third-party services that can affect page availability;
- privacy and consent obligations;
- the risk of intrusive redirects, pop-ups, or unexpected navigation if the vendor or an ad creative behaves badly;
- the difficulty of enforcing a restrictive CSP.

Do not remove ad scripts blindly if they are part of the site's intended revenue model. Instead:
1. Confirm the provider account and every script ID are owned/approved by the site operator.
2. Confirm which pages actually need ads.
3. Keep ads out of sign-in, student progress, teacher application, teacher, and admin workflows.
4. Prefer a clearly bounded ad slot or sandboxed iframe where the vendor supports it.
5. Defer ad loading until the main educational content is available.
6. Monitor mobile page weight, Core Web Vitals, and user reports for redirects/pop-ups.
7. Review the privacy policy and any required consent controls before enabling broader ad targeting.

## 3. Security-header configuration gap

The repository contains two relevant configurations:

- Root `vercel.json` sets HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
- Root `_headers` contains a CSP that permits Google, Supabase, the advertising provider, and several ad-network subdomains.

The `_headers` filename/format is commonly used by Netlify-style static hosting. The current Vercel configuration does not import or reference this file. Therefore, **do not assume the CSP in `_headers` is active on Vercel**. The repository-level evidence shows that the Vercel headers configuration does not currently declare a CSP.

Production response headers were not verified during this review because the available deployment fetch was blocked by Vercel deployment authentication. Verify the real response headers on both the apex static site and the separate Next.js application before making CSP claims.

### CSP implementation guidance

Do not copy the existing CSP directly into Vercel as-is. It includes `'unsafe-inline'` and broad HTTPS image permissions, and may need to permit additional hosts used by analytics, fonts, ads, Supabase, and forms.

A safe rollout should:
1. Inventory all runtime network origins from browser developer tools on representative pages.
2. Start with Content-Security-Policy-Report-Only.
3. Test homepage, lesson, quiz, sign-in, application, student, teacher, and admin flows.
4. Resolve violations by removing unnecessary dependencies or adding narrowly scoped hosts.
5. Move toward a stricter enforced policy only after preview verification.

## 4. Mobile and low-bandwidth performance

PNG-first usage means the site should remain useful on slower mobile networks and lower-memory phones.

Priorities:
- Make the primary lesson text render without waiting for ads, analytics, or remote fonts.
- Use system-font fallbacks and avoid loading three font families if a smaller typographic system can achieve the same design.
- Lazy-load below-the-fold images and embeds.
- Compress and resize image assets to their actual display dimensions.
- Avoid duplicate analytics/ad requests across nested navigation.
- Defer optional scripts and isolate third-party failures from lesson navigation.
- Keep interactive controls usable with touch, keyboard, and reduced-motion settings.
- Avoid large animation effects that do not improve learning.

## 5. Service worker and offline status

The current `sw.js` is explicitly a cleanup worker: it clears old caches, unregisters itself, and reloads open tabs. It is not a functioning offline cache or PWA implementation.

Do not advertise offline support until a new service worker has:
- a documented cache allowlist;
- safe cache versioning and upgrade behaviour;
- explicit exclusion of private/authenticated responses and tokens;
- tested offline fallback pages;
- a tested rollback/unregister path;
- no third-party script imports.

## 6. Verification checklist

- [ ] Capture actual response headers from `mxtlab.online` and `www.mxtlab.online`.
- [ ] Confirm whether the root `_headers` CSP is ignored by the current Vercel deployment.
- [ ] Record every script, font, iframe, image, and connect origin on representative pages.
- [ ] Verify ownership and current necessity of each advertising script ID.
- [ ] Confirm ads are absent from all authenticated/student/teacher/admin workflows.
- [ ] Test the homepage, topics, lesson, quiz, and sign-in experiences with ad scripts blocked.
- [ ] Measure mobile load performance with and without optional third-party scripts.
- [ ] Review privacy policy and consent requirements for analytics/advertising.
- [ ] Introduce any CSP change through Report-Only preview testing before enforcement.

## Conclusion

Third-party services should be treated as explicit platform dependencies. The goal is not to remove useful analytics or monetisation, but to ensure that education content, authentication, and user data remain reliable even when an external provider is slow, unavailable, or misbehaves.
