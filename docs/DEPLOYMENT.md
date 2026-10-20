# Deployment Guide

Each publication builds to its own document root at `dist/<slug>/` and is intended to be
served at its own domain. Because the outputs are fully static, they deploy to any static
host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, Nginx, etc.).

## 1. Build

```bash
node data/generate-briefs.js
node data/build-dashboard.js
node build.js
```

Output:

```
dist/
  index.html                 # local preview index — DO NOT deploy publicly
  digital-health-news/       # -> digitalhealthnews.<tld>
  healthtech-insider/        # -> healthtechinsider.<tld>
  pt-practice-journal/       # -> ptpracticejournal.<tld>
  applied-ai-review/         # -> appliedaireview.<tld>
  medical-practice-business/ # -> medicalpracticebusiness.<tld>
```

## 2. One domain per publication

Set each host's publish/root directory to the matching `dist/<slug>` folder and bind the
real domain. Do **not** publish `dist/index.html` to a public domain — it only exists for
local review.

After you own real domains, update `domain` for each entry in `config/publications.js` and
rebuild so canonical URLs, Open Graph URLs, sitemaps and robots.txt all point at the real host.

## 3. Analytics & Search Console

- Add each property to Google Search Console and submit `https://<domain>/sitemap.xml`.
- Add the GA4 snippet per publication. The simplest path: add a small snippet to
  `lib/components.js`'s `<head>` block keyed off the publication slug, reading the public
  measurement ID. Keep only the public measurement ID in client code; nothing secret.
- `assets/cta.js` already emits `cta_click` events via `window.track` — point `window.track`
  at your analytics to capture conversions.

IDs/tokens go in `.env` (see `.env.template`). The static build needs no secrets.

## 4. Backups & revision history

Commit the whole project to git. That gives you content revision history, draft branches,
and point-in-time recovery. Tag each production build. (The file-based model means your
backup strategy is simply your git strategy plus the host's deploy history.)

## 5. Optional upgrade to a dynamic CMS

The file-based editorial model is deliberate: no database, no auth surface, no secrets, and
git provides review + history. Upgrade only if you need:

- multiple non-technical editors with role-based access,
- in-app draft preview and scheduled *automatic* publishing,
- a hosted editing UI instead of Markdown + git.

A natural path is Next.js + a database (e.g. Supabase) reusing `config/publications.js`,
`lib/seo.js` and `lib/design.js` as-is. This is scaffolding work that requires you to
provision the database, auth provider and secrets; it is out of scope for the static build
delivered here and is listed as a follow-up in the launch checklist.

## 6. Verify after deploy

Re-run the checks in `docs/LAUNCH-CHECKLIST.md` against the live domains (routing, canonical
tags resolving to the right host, sitemap reachable, structured data valid in Google's Rich
Results Test, no cross-publication leakage).
