# Deploying to Vercel

You have **five independent sites** (one per domain), so the clean model is **one Vercel
project per publication**, each serving its own `dist/<slug>` folder. This keeps the sites
fully separated — exactly what the publication-separation design calls for.

`node build.js` writes a ready-to-deploy `vercel.json` into each `dist/<slug>` (pretty URLs,
long-cache assets, baseline security headers). Nothing secret is needed — the build is static.

Pick **one** of the two paths below.

---

## Path A — CLI, deploying the prebuilt folders (fastest, no Git required)

```bash
npm i -g vercel
vercel login
```

Then from `media-network/`:

```bash
node build.js
vercel deploy dist/digital-health-news --prod
vercel deploy dist/healthtech-insider --prod
vercel deploy dist/pt-practice-journal --prod
vercel deploy dist/applied-ai-review --prod
vercel deploy dist/medical-practice-business --prod
```

Or do all five at once with the helper script:

```bash
pwsh scripts/deploy-vercel.ps1 -Prod
```

The first time you deploy each folder, Vercel asks to **link or create a project** — create a
new one and give it a distinct name (e.g. `ptpracticejournal`). Because you're deploying an
already-built static directory, there is no remote build step and `dist/index.html`
(the local preview index) is never published.

---

## Path B — Git-based, auto-deploy on push (recommended for ongoing work)

1. Put the repo on GitHub (from `media-network/` or its parent).
2. In Vercel, **create 5 projects from the same repo**. For each project set:
   - **Root Directory:** leave blank (this folder is the repo root). Only set `media-network` if you committed the parent folder as the repo instead.
   - **Framework Preset:** Other
   - **Build Command:** `node build.js`
   - **Output Directory:** `dist/<slug>` — e.g. `dist/pt-practice-journal`
   - **Install Command:** leave default (there are no dependencies)
3. Each push rebuilds all five and each project serves its own slice. No cross-publication
   leakage, verified by `node tests/run.js`.

---

## Custom domains

For each project: **Settings → Domains → Add**, enter the real domain, and follow Vercel's
DNS instructions (A record to Vercel, or a CNAME, or move nameservers). Vercel issues TLS
automatically.

After the real domains are live, update the `domain` field for each entry in
`config/publications.js` and rebuild, so canonical tags, Open Graph URLs, `sitemap.xml` and
`robots.txt` all point at the real host. Then submit each `https://<domain>/sitemap.xml` in
Google Search Console.

---

## Notes

- **Analytics:** add your GA4 snippet to the shared `<head>` (see `docs/DEPLOYMENT.md`), or
  enable Vercel Web Analytics per project. Keep only public IDs in client code.
- **The editorial dashboard** (`dashboard/index.html`) is an internal tool — don't deploy it
  to a public domain. If you want it hosted, put it behind Vercel authentication in a separate,
  access-protected project.
- **Honesty check:** deploying makes the sites reachable at Vercel URLs. It does **not** mean a
  domain is purchased, content is indexed, or any ranking exists — those remain to be done and
  verified (see `docs/LAUNCH-CHECKLIST.md`).
