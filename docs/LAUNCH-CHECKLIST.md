# Launch Checklist

Nothing below is done automatically. Items you (the owner) must supply or verify are marked
**[YOU]**. Items the platform already handles are marked **[DONE]**.

## Names, domains & trademarks
- [ ] **[YOU]** Check domain availability for each publication and register the real domains.
- [ ] **[YOU]** Run trademark availability/clearance for each publication name (USPTO + common-law search; consider counsel).
- [ ] **[YOU]** Confirm names don't imply affiliation with existing publishers.
- [ ] **[YOU]** Update `domain` in `config/publications.js` and rebuild.

## Hosting & DNS
- [ ] **[YOU]** Create a static-hosting project per publication; set root to `dist/<slug>`.
- [ ] **[YOU]** Point each domain's DNS (A/CNAME) at the host; issue TLS certificates.
- [ ] **[YOU]** Ensure `dist/index.html` (preview index) is NOT publicly deployed.

## Analytics & Search Console
- [ ] **[YOU]** Create a GA4 property per publication; add measurement IDs to `.env`.
- [ ] **[YOU]** Add GA snippet to the shared `<head>` (see DEPLOYMENT.md).
- [ ] **[YOU]** Verify each domain in Google Search Console; submit each sitemap.
- [ ] **[YOU]** Wire `window.track` so `cta_click` events reach analytics.
- [x] **[DONE]** `robots.txt` + `sitemap.xml` generated per publication.

## SEO
- [x] **[DONE]** Canonical URLs, Open Graph, Twitter cards, breadcrumbs, Article/NewsArticle JSON-LD.
- [x] **[DONE]** Editable SEO titles/descriptions and stable URLs via front matter.
- [x] **[DONE]** Keyword tracker with intra-publication cannibalization detection.
- [ ] **[YOU]** Populate real search volume & keyword difficulty in `data/keywords.json` from actual research (never invented).
- [ ] **[YOU]** Validate structured data in Google's Rich Results Test after deploy.

## Editorial & content
- [x] **[DONE]** 100 article briefs (`data/briefs.json`), 10-stage workflow, editorial dashboard.
- [x] **[DONE]** A small set of sample articles per publication.
- [ ] **[YOU]** Replace placeholder author profiles with real, consenting authors.
- [ ] **[YOU]** Fact-check and human-review each article before setting status to `published`.
- [ ] **[YOU]** Verify every Cowboy Systems claim against official docs / an authorized rep.

## Cowboy Systems profile
- [ ] **[YOU]** Fill every `verify` field in `data/cowboy-profile.json` from official sources.
- [ ] **[YOU]** Obtain approved logos/screenshots and permission for any case study.

## Legal & privacy (see COMPLIANCE-CHECKLIST.md)
- [ ] **[YOU]** Have counsel review Privacy Policy, Terms, and sponsored-content disclosures.
- [ ] **[YOU]** Set up real editorial/ads/privacy mailboxes on each domain.
- [ ] **[YOU]** Implement a consent banner defaulting to privacy-preserving choices before enabling analytics cookies.

## Mail / newsletter
- [ ] **[YOU]** Choose a provider; store keys server-side only; honor unsubscribe + applicable email-marketing law.

## Pre-launch QA (re-run against live domains)
- [x] **[DONE]** Local build + automated tests pass (`node tests/run.js`).
- [ ] **[YOU]** Verify domain routing and that each canonical resolves to the correct host.
- [ ] **[YOU]** Confirm no cross-publication content leakage in production.
- [ ] **[YOU]** Mobile responsiveness + accessibility pass (Lighthouse / axe).
- [ ] **[YOU]** Broken-link scan.
- [ ] **[YOU]** Confirm backups (git tags + host deploy history) and a tested recovery procedure.
