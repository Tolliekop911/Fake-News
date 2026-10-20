// Shared, reusable layout components. Same structure across the network; the per-publication
// stylesheet (lib/design.js) gives each its own identity.
import { escapeHtml } from "./markdown.js";
import { googleFontsHref } from "./design.js";
import { network } from "../config/publications.js";

export function page({ pub, headExtra, bodyClass = "", current, main }) {
  return `<!doctype html>
<html lang="${network.defaultLocale.split("-")[0]}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${googleFontsHref(pub.brand.fonts)}">
  <link rel="stylesheet" href="/assets/style.css">
  <link rel="icon" href="/assets/favicon.svg">
  ${headExtra}
</head>
<body class="${bodyClass}">
  <a class="skip" href="#main">Skip to content</a>
  ${masthead(pub, current)}
  ${disclosureBar()}
  <main id="main"><div class="container">${main}</div></main>
  ${footer(pub)}
</body>
</html>`;
}

function masthead(pub, current) {
  const nav = pub.categories.map((c) =>
    `<a href="/category/${c.slug}/"${current === c.slug ? ' aria-current="page"' : ""}>${escapeHtml(c.name)}</a>`).join("");
  return `<header class="masthead">
  <div class="row">
    <a class="brand" href="/"><span class="mark">${escapeHtml(pub.logo.mark)}</span>${escapeHtml(pub.name)}</a>
    <nav class="main" aria-label="Sections">${nav}</nav>
  </div>
  <div class="tagline">${escapeHtml(pub.tagline)}</div>
</header>`;
}

function disclosureBar() {
  return `<div class="disclosure"><div class="container">
    <strong>Ownership disclosure:</strong> ${escapeHtml(network.disclosure)}
  </div></div>`;
}

function footer(pub) {
  const cats = pub.categories.map((c) => `<a href="/category/${c.slug}/">${escapeHtml(c.name)}</a>`).join("");
  const year = new Date().getUTCFullYear();
  return `<footer class="site">
  <div class="container">
    <div class="cols">
      <div>
        <h4>${escapeHtml(pub.name)}</h4>
        <p>${escapeHtml(pub.description)}</p>
        <p>Owned and operated by <a href="${network.ownerUrl}">${escapeHtml(network.owner)}</a>.</p>
      </div>
      <div>
        <h4>Sections</h4>
        ${cats}
      </div>
      <div>
        <h4>About &amp; Policies</h4>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/editorial-policy/">Editorial Policy</a>
        <a href="/corrections-policy/">Corrections Policy</a>
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/terms/">Terms</a>
      </div>
    </div>
    <div class="legal container">© ${year} ${escapeHtml(network.owner)}. ${escapeHtml(pub.name)} is a publication of ${escapeHtml(network.owner)}. Working domain: ${escapeHtml(pub.domain)} (provisional).</div>
  </div>
</footer>`;
}

export function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb">` +
    items.map((c, i) => i < items.length - 1 ? `<a href="${c.href}">${escapeHtml(c.name)}</a> › ` : `<span>${escapeHtml(c.name)}</span>`).join("") +
    `</nav>`;
}

export function card(pub, a, { feature = false } = {}) {
  const cat = pub.categories.find((c) => c.slug === a.category);
  const href = `/${a.category}/${a.slug}/`;
  const label = a.sponsored ? `<span class="label sponsored">Sponsored</span>` :
    a.companyContent ? `<span class="label company">Company content</span>` : "";
  if (feature) {
    return `<div class="feature">
      ${label}<span class="kicker">${escapeHtml(cat ? cat.name : "")}</span>
      <h2><a href="${href}">${escapeHtml(a.headline)}</a></h2>
      <p class="dek">${escapeHtml(a.subheadline || "")}</p>
      <p class="meta">${escapeHtml(a.authorName || "Staff")} · ${formatDate(a.publishedDate)}</p>
    </div>`;
  }
  return `<article class="card"><div class="body">
    ${label}<span class="kicker">${escapeHtml(cat ? cat.name : "")}</span>
    <h3><a href="${href}">${escapeHtml(a.headline)}</a></h3>
    <p class="meta">${escapeHtml(a.authorName || "Staff")} · ${formatDate(a.publishedDate)}</p>
  </div></article>`;
}

// Conversion system (PART 8): contextual CTA blocks. Tokens in article bodies like
// {{CTA:demo}} are replaced with these. Clicks are tracked via data-cta for analytics.
export function cta(kind, pub) {
  const site = network.ownerUrl;
  const map = {
    demo: { p: "See how Cowboy Systems handles outpatient documentation.", b: "Request a demo", href: site + "?utm_source=" + pub.slug + "&utm_medium=cta&utm_campaign=demo", ghost: "Visit cowboy-systems.com" },
    software: { p: "Comparing EHR and practice-management software?", b: "Read our software guide", href: "/category/ehr-selection/", ghost: null },
    newsletter: { p: "Get our editorial briefing in your inbox.", b: "Subscribe", href: "/newsletter/", ghost: null },
    website: { p: "Learn more about Cowboy Systems.", b: "Visit the official website", href: site + "?utm_source=" + pub.slug + "&utm_medium=cta&utm_campaign=website", ghost: null },
  };
  const c = map[kind] || map.website;
  const ghost = c.ghost ? `<a class="btn ghost" data-cta="${kind}-secondary" href="${site}">${escapeHtml(c.ghost)}</a>` : "";
  return `<aside class="cta" role="complementary">
    <p>${escapeHtml(c.p)}</p>
    <div><a class="btn" data-cta="${kind}" href="${c.href}">${escapeHtml(c.b)}</a> ${ghost}</div>
  </aside>`;
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
