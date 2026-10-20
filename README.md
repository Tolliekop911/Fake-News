# Healthcare Media Network

A reusable, dependency-free static publishing platform that powers **five independent
healthcare-technology publications** from one shared codebase. Built for Cowboy Systems,
whose ownership of the network is disclosed on every page.

> **Status honesty.** Nothing here has been deployed, no domain has been purchased, no
> content has been indexed and no ranking has been achieved. The build runs and is tested
> locally. External services, domains and approvals you must supply are listed in
> [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md).

## The five publications

| Slug | Name | Working domain (provisional) | Focus |
|---|---|---|---|
| `digital-health-news` | Digital Health News | digitalhealthnews.example | EHR, interoperability, clinical AI |
| `healthtech-insider` | HealthTech Insider | healthtechinsider.example | Health-tech startups & founders |
| `pt-practice-journal` | The PT Practice Journal | ptpracticejournal.example | Outpatient PT operations (primary Cowboy title) |
| `applied-ai-review` | Applied AI Review | appliedaireview.example | AI tool evaluation |
| `medical-practice-business` | Medical Practice Business | medicalpracticebusiness.example | Clinic operations & finance |

Domain/trademark availability is **not** confirmed — see
[`docs/COMPLIANCE-CHECKLIST.md`](docs/COMPLIANCE-CHECKLIST.md).

## Quick start

```bash
cd media-network
node data/generate-briefs.js     # (re)generate the 100 article briefs
node data/build-dashboard.js     # (re)build keyword tracker + editorial dashboard
node build.js                    # build all five sites into dist/
node tests/run.js                # build + verify (exits non-zero on failure)
node serve.js 8080               # preview at http://localhost:8080/
```

No `npm install` is required — the generator uses only the Node standard library (Node ≥ 18).

## How it works

- **`config/publications.js`** — one object per publication (domain, brand palette, fonts,
  categories). This is the single source of truth that keeps the five sites distinct.
- **`content/<slug>/`** — each publication's `authors.json` and `articles/*.md` (Markdown
  with YAML-style front matter carrying all editorial fields).
- **`lib/`** — the engine: `markdown.js` (renderer + front-matter), `design.js` (palette →
  CSS), `components.js` (shared layout + CTA system), `seo.js` (meta, canonical, OG, JSON-LD,
  sitemaps, robots).
- **`build.js`** — reads each publication's own content and writes **only** to its own
  `dist/<slug>/` root, so content and configuration cannot leak between sites
  (verified by `tests/run.js`).
- **`data/`** — the editorial data layer: `briefs.json` (100 briefs), `keywords.json`
  (keyword tracker), `workflow.json` (10-stage status model), `cowboy-profile.json`
  (structured, verification-gated company profile).
- **`dashboard/index.html`** — a self-contained editorial dashboard (workflow board, briefs,
  keyword tracker with cannibalization detection). Internal tool; not deployed publicly.

## Editorial model & publishing controls

Articles carry a `status`. Only `published` and `updated` render to the public site
(`PUBLISHABLE` in `build.js`); everything from `idea` through `approved`/`scheduled` stays
internal. The 10-stage workflow and the rule that factual content requires human review
before publishing live in `data/workflow.json`.

This is a **file-based CMS**: safe, reviewable, versionable in git (which gives you revision
history, draft branches and backups for free). If you later need multi-user auth, RBAC,
scheduled auto-publishing and live preview, see the upgrade note in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Integrity guarantees baked into the platform

- Ownership disclosure renders on every page; sponsored/company content is labelled and gets
  a disclosure box; JSON-LD names Cowboy Systems as parent organization.
- The platform never fabricates search volumes or keyword difficulty — those fields ship
  empty for real research.
- The Cowboy profile ships with `verify` placeholders instead of invented product claims.

See also: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md),
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md),
[`docs/COMPLIANCE-CHECKLIST.md`](docs/COMPLIANCE-CHECKLIST.md),
[`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md).
