// Static site generator for the healthcare media network.
// Reads config/publications.js + content/<slug>/ and emits one independent site per
// publication into dist/<slug>/ (each dist/<slug> is the document root for that domain).
//
// Publication separation: every publication only ever reads its own content directory and
// writes to its own output directory, so content/config cannot leak between sites.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publications, network } from "./config/publications.js";
import { stylesheet } from "./lib/design.js";
import { renderMarkdown, parseFrontMatter, escapeHtml } from "./lib/markdown.js";
import {
  headMeta, articleJsonLd, breadcrumbsJsonLd, organizationJsonLd,
  robotsTxt, sitemapXml, absoluteUrl,
} from "./lib/seo.js";
import { page, crumbs, cta, formatDate, hero, latestItem, secItem, story, sectionLabel } from "./lib/components.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const dist = path.join(root, "dist");

// --- helpers -------------------------------------------------------------
const readJson = (p, fallback) => fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
const ensure = (p) => fs.mkdirSync(p, { recursive: true });
const write = (p, s) => { ensure(path.dirname(p)); fs.writeFileSync(p, s); };

// Only these statuses render to the public site. Editorial workflow lives in the CMS data.
const PUBLISHABLE = new Set(["published", "updated"]);

function loadArticles(pub) {
  const dir = path.join(root, "content", pub.slug, "articles");
  if (!fs.existsSync(dir)) return [];
  const authors = readJson(path.join(root, "content", pub.slug, "authors.json"), []);
  const authorBySlug = Object.fromEntries(authors.map((a) => [a.slug, a]));
  const articles = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, body } = parseFrontMatter(raw);
    const author = authorBySlug[data.author] || null;
    articles.push({
      ...data,
      slug: data.slug || file.replace(/\.md$/, ""),
      secondaryKeywords: data.secondaryKeywords || [],
      body,
      author,
      authorName: author ? author.name : (data.authorName || "Staff"),
      sponsored: data.sponsored === "true" || data.sponsored === true,
      companyContent: data.companyContent === "true" || data.companyContent === true,
      newsworthy: data.newsworthy === "true" || data.newsworthy === true,
    });
  }
  // Each article gets a generated thumbnail unless it supplies a real image.
  for (const a of articles) a.thumb = a.image || `/assets/thumbs/${a.slug}.svg`;
  // newest first
  articles.sort((a, b) => (b.publishedDate || "").localeCompare(a.publishedDate || ""));
  return { articles, authors };
}

function renderBody(pub, article) {
  // replace {{CTA:kind}} tokens, then markdown
  const withCtas = article.body.replace(/\{\{CTA:([a-z]+)\}\}/g, (_, kind) => cta(kind, pub));
  return renderMarkdown(withCtas);
}

function disclosureBox(article) {
  if (article.sponsored) {
    return `<div class="disclosure-box"><strong>Sponsored / company-controlled content.</strong>
      This article was produced in partnership with, or supplied by, Cowboy Systems, which owns this
      publication. It is clearly labelled as sponsored and is not independent journalism.</div>`;
  }
  if (article.companyContent) {
    return `<div class="disclosure-box"><strong>Company content disclosure.</strong>
      This publication is owned by Cowboy Systems and this article features Cowboy Systems. Company-supplied
      information is attributed as such. Any product comparison states its methodology and commercial relationship.</div>`;
  }
  return "";
}

// --- page renderers ------------------------------------------------------
function buildHome(pub, articles) {
  const url = absoluteUrl(pub, "/");
  const head =
    headMeta({ pub, title: "", description: pub.description, url, type: "website" }) +
    "\n  " + organizationJsonLd(pub);

  if (!articles.length) {
    return page({ pub, headExtra: head, main: `<div class="container"><p>No articles published yet.</p></div>` });
  }

  const feature = articles[0];
  const rail = articles.slice(0, 6);             // Latest rail
  const secondary = articles.slice(1, 5);        // right column
  // Section rows: one per category that has articles, newest first.
  const rows = pub.categories.map((cat) => {
    const inCat = articles.filter((a) => a.category === cat.slug).slice(0, 4);
    if (!inCat.length) return "";
    return `<section class="secrow">
      ${sectionLabel(cat.name)}
      <div class="storygrid">${inCat.map((a) => story(pub, a)).join("")}</div>
    </section>`;
  }).join("");

  const front = `<div class="container"><div class="frontgrid">
      <div class="rail">${sectionLabel("Latest")}${rail.map((a) => latestItem(pub, a)).join("")}</div>
      <div class="hero-col">${hero(pub, feature)}</div>
      <div class="secondary">${sectionLabel("More top stories")}${secondary.map((a) => secItem(pub, a)).join("")}</div>
    </div></div>`;

  const main = `${front}<div class="container">${rows}</div>`;
  return page({ pub, headExtra: head, main });
}

function buildCategory(pub, cat, articles) {
  const inCat = articles.filter((a) => a.category === cat.slug);
  const url = absoluteUrl(pub, `/category/${cat.slug}/`);
  const head = headMeta({ pub, title: cat.name, description: `${cat.name} coverage from ${pub.name}.`, url }) +
    "\n  " + breadcrumbsJsonLd([{ name: pub.name, url: absoluteUrl(pub, "/") }, { name: cat.name, url }]);
  const main = `<div class="container">
    ${crumbs([{ name: "Home", href: "/" }, { name: cat.name, href: `/category/${cat.slug}/` }])}
    <div class="pagehead"><h1>${escapeHtml(cat.name)}</h1><p>${escapeHtml(cat.name)} coverage from ${escapeHtml(pub.name)}.</p></div>
    <div class="storygrid">
      ${inCat.length ? inCat.map((a) => story(pub, a)).join("") : "<p>No articles in this section yet.</p>"}
    </div>
  </div>`;
  return page({ pub, headExtra: head, current: cat.slug, main });
}

function buildArticle(pub, article, all) {
  const cat = pub.categories.find((c) => c.slug === article.category);
  const url = absoluteUrl(pub, `/${article.category}/${article.slug}/`);
  const imageUrl = article.image ? absoluteUrl(pub, article.image) : null;
  const related = all.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);
  const head =
    headMeta({
      pub, title: article.metaTitle || article.headline,
      description: article.metaDescription || article.subheadline, url, type: "article",
      image: imageUrl, publishedTime: article.publishedDate, modifiedTime: article.updatedDate,
      author: article.authorName,
    }) +
    "\n  " + articleJsonLd({ pub, article, url, author: article.author, imageUrl }) +
    "\n  " + breadcrumbsJsonLd([
      { name: pub.name, url: absoluteUrl(pub, "/") },
      { name: cat ? cat.name : "", url: absoluteUrl(pub, `/category/${article.category}/`) },
      { name: article.headline, url },
    ]);
  const labelHtml = article.sponsored ? `<span class="label sponsored">Sponsored</span>` :
    article.companyContent ? `<span class="label company">Company content</span>` : "";
  const authorLink = article.author
    ? `<a href="/authors/${article.author.slug}/">${escapeHtml(article.author.name)}</a>`
    : escapeHtml(article.authorName);
  const main = `<div class="container">
    <article class="post">
      ${crumbs([{ name: "Home", href: "/" }, { name: cat ? cat.name : "", href: `/category/${article.category}/` }, { name: article.headline }])}
      ${labelHtml}
      <span class="kicker">${escapeHtml(cat ? cat.name : "")}</span>
      <h1>${escapeHtml(article.headline)}</h1>
      ${article.subheadline ? `<p class="dek">${escapeHtml(article.subheadline)}</p>` : ""}
      <div class="byline">By ${authorLink} · Published ${formatDate(article.publishedDate)}${article.updatedDate ? ` · Updated ${formatDate(article.updatedDate)}` : ""}</div>
      <figure><img class="lede-img" src="${article.thumb}" alt="${escapeHtml(article.imageAlt || article.headline)}">${article.imageCredit ? `<figcaption>${escapeHtml(article.imageCredit)}</figcaption>` : ""}</figure>
      ${disclosureBox(article)}
      ${renderBody(pub, article)}
      ${article.sources && article.sources.length ? `<h2>Sources</h2><ol>${article.sources.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>` : ""}
      ${cta(article.ctaKind || "demo", pub)}
      ${related.length ? `<h2 style="margin-top:36px">Related</h2><div class="storygrid">${related.map((a) => story(pub, a)).join("")}</div>` : ""}
    </article>
  </div>`;
  return page({ pub, headExtra: head, current: article.category, main });
}

function buildAuthor(pub, author, articles) {
  const theirs = articles.filter((a) => a.author && a.author.slug === author.slug);
  const url = absoluteUrl(pub, `/authors/${author.slug}/`);
  const head = headMeta({ pub, title: author.name, description: author.bio, url });
  const main = `<div class="container">
    ${crumbs([{ name: "Home", href: "/" }, { name: "Authors", href: "/" }, { name: author.name }])}
    <div class="author-hero">
      <div class="avatar">${escapeHtml(author.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</div>
      <div><h1>${escapeHtml(author.name)}</h1><p style="color:var(--muted);margin:4px 0 0">${escapeHtml(author.title || "")}</p></div>
    </div>
    <p style="max-width:680px">${escapeHtml(author.bio || "")}</p>
    <h2 style="margin-top:30px">Articles</h2>
    <div class="storygrid">
      ${theirs.length ? theirs.map((a) => story(pub, a)).join("") : "<p>No published articles yet.</p>"}
    </div>
  </div>`;
  return page({ pub, headExtra: head, main });
}

function buildLegal(pub, slug, title, bodyMd) {
  const url = absoluteUrl(pub, `/${slug}/`);
  const head = headMeta({ pub, title, description: `${title} for ${pub.name}.`, url });
  const main = `<div class="container"><article class="post">${crumbs([{ name: "Home", href: "/" }, { name: title }])}<h1>${escapeHtml(title)}</h1>${renderMarkdown(bodyMd)}</article></div>`;
  return page({ pub, headExtra: head, main });
}

// --- legal/about content (shared templates, filled per publication) -------
function legalPages(pub) {
  const net = network;
  return {
    about: ["about", "About",
`${pub.name} is a digital publication covering ${pub.positioning.toLowerCase()}. ${pub.description}

**Ownership.** ${pub.name} is owned and operated by [${net.owner}](${net.ownerUrl}), a company that develops healthcare EHR and practice-management software. We disclose this relationship on every page. Articles that feature ${net.owner} products are clearly labelled and are not presented as independent reviews.

**Our standards.** We publish original content, verify factual claims about real people and companies before publication, attribute company-supplied information, and correct errors promptly. See our [Editorial Policy](/editorial-policy/) and [Corrections Policy](/corrections-policy/).`],
    contact: ["contact", "Contact",
`Reach the ${pub.name} editorial team:

- **Editorial / corrections:** editor@${pub.domain}
- **Advertising / sponsored content:** ads@${pub.domain}
- **General:** hello@${pub.domain}

> These addresses are placeholders until the domain and mailboxes are provisioned. See the launch checklist.`],
    "editorial-policy": ["editorial-policy", "Editorial Policy",
`**Independence and ownership.** ${pub.name} is owned by ${net.owner}. We do not claim to be editorially independent of our owner. Where ownership, sponsorship, or another material commercial relationship is relevant to a story, we disclose it clearly.

**Sourcing and accuracy.** We publish original reporting and analysis. Factual claims — especially about real people, companies, funding, adoption, pricing, clinical outcomes or performance — are verified against primary sources or authorized representatives before publication. We do not fabricate quotes, sources, endorsements, awards or results.

**AI use.** AI tools may assist with research organization, outlines, grammar and drafting. AI does not invent facts or sources, and a qualified human reviews factual content before publication.

**Sponsored and company content.** Sponsored or company-controlled articles are labelled. Product comparisons state their methodology and any commercial relationship. We do not present company-written comparisons as independent reviews, and we do not publish fabricated negative stories about competitors.

**Medical and financial claims.** We do not provide personalized medical or investment advice, and we do not guarantee reimbursement, revenue, savings or claim acceptance.`],
    "corrections-policy": ["corrections-policy", "Corrections Policy",
`We correct errors promptly. If you believe something is inaccurate, email editor@${pub.domain}.

- **Minor corrections** (typos, formatting) are made without a note.
- **Substantive corrections** (facts, figures, names, claims) are made with a dated correction note appended to the article, and the "Updated" date is changed.
- **Significant retractions** are flagged at the top of the affected article.

Every change to published factual content is recorded in the article's revision history in our editorial system.`],
    "privacy-policy": ["privacy-policy", "Privacy Policy",
`This is a template privacy policy and must be reviewed by qualified counsel before launch (see the compliance checklist).

**What we collect.** Standard server logs, and — only with consent — analytics data. We ask for analytics/marketing cookies via a consent banner and default to the privacy-preserving option.

**Newsletter.** If you subscribe, we store your email to send the newsletter. Every email includes an unsubscribe link.

**Your rights.** Depending on your location (including under South African POPIA, US state privacy laws and the EU GDPR where applicable), you may request access to or deletion of your data. Contact privacy@${pub.domain}.

**Data controller.** ${net.owner}, operator of ${pub.name}.`],
    terms: ["terms", "Terms of Use",
`This is a template terms-of-use document and must be reviewed by qualified counsel before launch.

By using ${pub.name} you agree that content is provided for general information only and does not constitute medical, legal, financial or professional advice. ${net.owner} operates this site and may feature its own products, as disclosed. Trademarks and content are owned by their respective owners.`],
  };
}

// --- per-publication build ----------------------------------------------
function buildPublication(pub) {
  const out = path.join(dist, pub.slug);
  const loaded = loadArticles(pub);
  const articles = loaded.articles || [];
  const authors = loaded.authors || [];
  const published = articles.filter((a) => PUBLISHABLE.has((a.status || "published")));

  // assets
  write(path.join(out, "assets", "style.css"), stylesheet(pub));
  write(path.join(out, "assets", "favicon.svg"), faviconSvg(pub));
  write(path.join(out, "assets", "og-default.svg"), ogImageSvg(pub));
  write(path.join(out, "assets", "cta.js"), ctaTrackingJs());
  // Per-article generated thumbnails (unless the article supplies a real image).
  for (const a of published) {
    if (!a.image) write(path.join(out, "assets", "thumbs", `${a.slug}.svg`), thumbSvg(pub, a));
  }

  // home
  write(path.join(out, "index.html"), buildHome(pub, published));

  // categories
  for (const cat of pub.categories) {
    write(path.join(out, "category", cat.slug, "index.html"), buildCategory(pub, cat, published));
  }

  // articles
  const sitemapEntries = [{ path: "/", changefreq: "daily" }];
  for (const a of published) {
    write(path.join(out, a.category, a.slug, "index.html"), buildArticle(pub, a, published));
    sitemapEntries.push({ path: `/${a.category}/${a.slug}/`, lastmod: a.updatedDate || a.publishedDate, changefreq: "monthly" });
  }
  for (const cat of pub.categories) sitemapEntries.push({ path: `/category/${cat.slug}/`, changefreq: "weekly" });

  // authors
  for (const au of authors) {
    write(path.join(out, "authors", au.slug, "index.html"), buildAuthor(pub, au, published));
    sitemapEntries.push({ path: `/authors/${au.slug}/`, changefreq: "monthly" });
  }

  // legal / about
  for (const [slug, title, body] of Object.values(legalPages(pub))) {
    write(path.join(out, slug, "index.html"), buildLegal(pub, slug, title, body));
    sitemapEntries.push({ path: `/${slug}/`, changefreq: "yearly" });
  }

  // SEO files
  write(path.join(out, "robots.txt"), robotsTxt(pub));
  write(path.join(out, "sitemap.xml"), sitemapXml(pub, sitemapEntries));

  // Vercel config — makes dist/<slug> a drop-in deploy target with pretty URLs + safe headers.
  write(path.join(out, "vercel.json"), vercelJson());

  return { slug: pub.slug, articles: published.length, categories: pub.categories.length, authors: authors.length, pages: sitemapEntries.length };
}

// --- brand SVG assets ----------------------------------------------------
function faviconSvg(pub) {
  const p = pub.brand.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="${p.primary}"/><text x="32" y="42" font-family="Georgia,serif" font-size="24" font-weight="800" fill="${p.primaryInk}" text-anchor="middle">${escapeHtml((pub.logo.mark || pub.name).slice(0, 3))}</text></svg>`;
}
function ogImageSvg(pub) {
  const p = pub.brand.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${p.bg}"/><rect width="1200" height="14" fill="${p.primary}"/><text x="64" y="300" font-family="Georgia,serif" font-size="72" font-weight="900" fill="${p.ink}">${escapeHtml(pub.name)}</text><text x="64" y="366" font-family="sans-serif" font-size="30" fill="${p.muted}">${escapeHtml(pub.tagline)}</text><text x="64" y="582" font-family="sans-serif" font-size="22" fill="${p.muted}">A publication of ${escapeHtml(network.owner)}</text></svg>`;
}
// Deterministic editorial placeholder art per article (no stock imagery available).
// A soft two-tone field with simple geometry, seeded by the slug so each differs but stays on-brand.
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function thumbSvg(pub, a) {
  const p = pub.brand.palette;
  const h = hash(a.slug);
  const variant = h % 4;
  const cx = 150 + (h % 400), cy = 80 + ((h >> 3) % 160);
  const r = 90 + (h % 70);
  const tag = (pub.categories.find((c) => c.slug === a.category) || {}).name || "";
  const shapes = [
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.primary}" opacity="0.14"/><circle cx="${900 - cx}" cy="${300 - cy}" r="${r * 0.6}" fill="${p.accent}" opacity="0.18"/>`,
    `<rect x="${cx - 120}" y="${cy - 40}" width="420" height="420" fill="${p.primary}" opacity="0.12" transform="rotate(18 ${cx} ${cy})"/><circle cx="820" cy="90" r="120" fill="${p.accent}" opacity="0.16"/>`,
    `<path d="M0,${340 - (h % 120)} Q450,${120 + (h % 100)} 960,${300 - (h % 120)} L960,540 L0,540 Z" fill="${p.primary}" opacity="0.13"/><circle cx="${cx}" cy="110" r="70" fill="${p.accent}" opacity="0.18"/>`,
    `<rect x="0" y="0" width="480" height="540" fill="${p.primary}" opacity="0.10"/><circle cx="700" cy="${cy}" r="${r}" fill="${p.accent}" opacity="0.16"/>`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice">
  <rect width="960" height="540" fill="${p.surface}"/>
  ${shapes[variant]}
  <rect x="48" y="452" width="${28 + tag.length * 13}" height="40" rx="3" fill="${p.primary}"/>
  <text x="62" y="479" font-family="sans-serif" font-size="18" font-weight="800" letter-spacing="0.5" fill="${p.primaryInk}">${escapeHtml(tag.toUpperCase())}</text>
</svg>`;
}
function vercelJson() {
  // Static deploy: our pages are /path/index.html, so trailingSlash keeps canonical URLs
  // consistent with what lib/seo.js emits. Long-cache immutable assets; add baseline headers.
  return JSON.stringify({
    $schema: "https://openapi.vercel.sh/vercel.json",
    trailingSlash: true,
    cleanUrls: true,
    headers: [
      {
        source: "/assets/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ],
  }, null, 2);
}
function ctaTrackingJs() {
  return `// Minimal, privacy-respecting CTA click tracking. Wire window.track to your analytics.
document.addEventListener('click',function(e){var el=e.target.closest('[data-cta]');if(!el)return;
  var payload={cta:el.getAttribute('data-cta'),href:el.getAttribute('href'),path:location.pathname};
  if(typeof window.track==='function'){try{window.track('cta_click',payload)}catch(_){}}});`;
}

// --- run -----------------------------------------------------------------
function main() {
  fs.rmSync(dist, { recursive: true, force: true });
  ensure(dist);
  const results = publications.map(buildPublication);
  // network index (for local preview / internal use — NOT deployed to any public domain)
  write(path.join(dist, "index.html"), networkIndex(results));
  const total = results.reduce((n, r) => n + r.pages, 0);
  console.log("Built " + results.length + " publications, " + total + " pages:");
  for (const r of results) console.log(`  ${r.slug}: ${r.articles} articles, ${r.categories} categories, ${r.authors} authors, ${r.pages} pages`);
  return results;
}

function networkIndex(results) {
  const items = publications.map((pub) => {
    const r = results.find((x) => x.slug === pub.slug);
    return `<li style="margin:14px 0;padding:16px;border:1px solid #ddd;border-radius:8px">
      <a href="./${pub.slug}/index.html" style="font-size:20px;font-weight:700;text-decoration:none;color:#111">${escapeHtml(pub.name)}</a>
      <div style="color:#666">${escapeHtml(pub.tagline)} — ${escapeHtml(pub.domain)} · ${r.articles} articles</div>
    </li>`;
  }).join("");
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Media Network — local preview</title><body style="font-family:system-ui;max-width:760px;margin:40px auto;padding:0 20px"><h1>Healthcare Media Network</h1><p style="color:#666">Local preview index. Each publication below builds as an independent site rooted at <code>dist/&lt;slug&gt;/</code> and is deployed to its own domain. This index page is <strong>not</strong> deployed publicly.</p><ul style="list-style:none;padding:0">${items}</ul></body>`;
}

main();
export { main };
