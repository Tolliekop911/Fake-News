# Content & Authoring Guide

## Adding an article

Create `content/<publication-slug>/articles/<url-slug>.md` with front matter:

```markdown
---
headline: The headline readers see
subheadline: One-line dek.
slug: url-slug                 # becomes /<category>/<slug>/
category: ehr-selection        # must be a category slug for this publication
author: j-marsh                # must match a slug in that publication's authors.json
status: draft                  # only "published" or "updated" render publicly
publishedDate: 2026-03-01
updatedDate:                   # set when you revise a published article
metaTitle: SEO title (optional; falls back to headline)
metaDescription: 150–160 char meta description.
primaryKeyword: one primary keyword
secondaryKeywords: [a, b, c]
searchIntent: informational    # informational | commercial investigation | navigational | transactional
image: /assets/og-default.svg  # optional
imageAlt: descriptive alt text
imageCredit: Photo: ...        # optional
sponsored: false               # true -> Sponsored label + disclosure box
companyContent: false          # true -> Company content label + disclosure box
newsworthy: false              # true on an eligible publication -> NewsArticle schema
ctaKind: demo                  # demo | software | newsletter | website
sources: ["Source 1", "Source 2"]
---

Body in Markdown. Use {{CTA:software}} inline to drop a contextual call to action.
```

Then `node build.js`.

## Rules that keep the network legitimate

1. **Never invent** facts, statistics, quotes, sources, endorsements, awards or results.
2. **Verify** every claim about real people/companies — especially Cowboy Systems — against
   primary sources before setting `status: published`.
3. **Label** sponsored/company content (set `sponsored` / `companyContent`).
4. **One primary keyword per article.** Check the keyword tracker to avoid cannibalization.
5. **Human review** is required before publishing factual content.
6. Every article must serve a real reader need — don't publish near-duplicates to fill domains.

## Workflow statuses

`idea → researching → outline → draft → fact-check → editorial-review → approved → scheduled
→ published → updated`. Track them in `dashboard/index.html`. Move a brief's `status` in
`data/briefs.json`; set an article's `status` in its front matter.

## Corrections

Fix the article, add a dated correction note at the foot of the body for substantive changes,
set `updatedDate`, and rely on git history for the full revision record.
