// Shared news-publication layout components. Same structure across the network;
// each publication's stylesheet (lib/design.js) gives it its own identity.
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
  ${topbar(pub)}
  ${masthead(pub)}
  ${secnav(pub, current)}
  ${disclosureBar()}
  <main id="main">${main}</main>
  ${footer(pub)}
  <script src="/assets/cta.js" defer></script>
</body>
</html>`;
}

function today() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function topbar(pub) {
  return `<div class="topbar"><div class="container">
    <span class="date">${today()}</span>
    <span><a href="/newsletter/">Newsletter</a> &nbsp;·&nbsp; <a href="/about/">About</a> &nbsp;·&nbsp; <a href="${network.ownerUrl}">Cowboy Systems</a></span>
  </div></div>`;
}

function masthead(pub) {
  return `<header class="masthead"><div class="container">
    <a class="brand" href="/">
      <span class="name">${escapeHtml(pub.name)}</span>
      <span class="tag">${escapeHtml(pub.tagline)}</span>
    </a>
    <span class="spacer"></span>
    <a class="cta-sub" href="/newsletter/">Subscribe</a>
  </div></header>`;
}

function secnav(pub, current) {
  const links = pub.categories.map((c) =>
    `<a href="/category/${c.slug}/"${current === c.slug ? ' aria-current="page"' : ""}>${escapeHtml(c.name)}</a>`).join("");
  return `<nav class="secnav" aria-label="Sections"><div class="container">${links}</div></nav>`;
}

function disclosureBar() {
  return `<div class="disclosure"><div class="container">
    <strong>Ownership disclosure:</strong> ${escapeHtml(network.disclosure)}
  </div></div>`;
}

function footer(pub) {
  const cats = pub.categories.map((c) => `<a href="/category/${c.slug}/">${escapeHtml(c.name)}</a>`).join("");
  const year = new Date().getUTCFullYear();
  return `<footer class="site"><div class="container">
    <div class="cols">
      <div>
        <div class="fname">${escapeHtml(pub.name)}</div>
        <p>${escapeHtml(pub.description)}</p>
        <p>Owned and operated by <a href="${network.ownerUrl}" style="display:inline;color:var(--primary)">${escapeHtml(network.owner)}</a>.</p>
      </div>
      <div><h4>Sections</h4>${cats}</div>
      <div><h4>About &amp; Policies</h4>
        <a href="/about/">About</a><a href="/contact/">Contact</a>
        <a href="/editorial-policy/">Editorial Policy</a><a href="/corrections-policy/">Corrections Policy</a>
        <a href="/privacy-policy/">Privacy Policy</a><a href="/terms/">Terms</a>
      </div>
    </div>
    <div class="legal">© ${year} ${escapeHtml(network.owner)}. ${escapeHtml(pub.name)} is a publication of ${escapeHtml(network.owner)}. Working domain: ${escapeHtml(pub.domain)} (provisional).</div>
  </div></footer>`;
}

export function crumbs(items) {
  return `<nav class="crumbs" aria-label="Breadcrumb">` +
    items.map((c, i) => i < items.length - 1 ? `<a href="${c.href}">${escapeHtml(c.name)}</a> / ` : `<span>${escapeHtml(c.name)}</span>`).join("") +
    `</nav>`;
}

const catName = (pub, slug) => { const c = pub.categories.find((x) => x.slug === slug); return c ? c.name : ""; };
const href = (a) => `/${a.category}/${a.slug}/`;
const labelFor = (a) => a.sponsored ? `<span class="label sponsored">Sponsored</span>` :
  a.companyContent ? `<span class="label company">Company content</span>` : "";

export function hero(pub, a) {
  return `<article class="hero">
    <a href="${href(a)}"><img class="thumb" src="${a.thumb}" alt="${escapeHtml(a.imageAlt || a.headline)}"></a>
    ${labelFor(a)}<span class="kicker">${escapeHtml(catName(pub, a.category))}</span>
    <h2><a href="${href(a)}">${escapeHtml(a.headline)}</a></h2>
    <p class="dek">${escapeHtml(a.subheadline || "")}</p>
    <p class="byline">By ${escapeHtml(a.authorName || "Staff")} · ${formatDate(a.publishedDate)}</p>
  </article>`;
}

export function latestItem(pub, a) {
  return `<div class="latest-item">
    <div class="time">${catName(pub, a.category) ? escapeHtml(catName(pub, a.category)) : "Latest"}</div>
    <h4><a href="${href(a)}">${escapeHtml(a.headline)}</a></h4>
  </div>`;
}

export function secItem(pub, a) {
  return `<div class="sec-item">
    <div><span class="kicker">${escapeHtml(catName(pub, a.category))}</span>
      <h4><a href="${href(a)}">${escapeHtml(a.headline)}</a></h4></div>
    <a href="${href(a)}"><img src="${a.thumb}" alt="${escapeHtml(a.imageAlt || a.headline)}"></a>
  </div>`;
}

export function story(pub, a) {
  return `<article class="story">
    <a href="${href(a)}"><img class="thumb" src="${a.thumb}" alt="${escapeHtml(a.imageAlt || a.headline)}"></a>
    ${labelFor(a)}<span class="kicker">${escapeHtml(catName(pub, a.category))}</span>
    <h3><a href="${href(a)}">${escapeHtml(a.headline)}</a></h3>
    <p class="dek">${escapeHtml(a.subheadline || "")}</p>
    <p class="meta">By ${escapeHtml(a.authorName || "Staff")} · ${formatDate(a.publishedDate)}</p>
  </article>`;
}

export function sectionLabel(text) {
  return `<div class="section-label">${escapeHtml(text)}</div>`;
}

// Conversion system (PART 8): contextual CTA blocks. {{CTA:kind}} tokens in bodies expand here.
export function cta(kind, pub) {
  const site = network.ownerUrl;
  const u = (c) => `${site}?utm_source=${pub.slug}&utm_medium=cta&utm_campaign=${c}`;
  const map = {
    demo: { p: "See how Cowboy Systems handles outpatient documentation.", b: "Request a demo", href: u("demo"), ghost: "Visit cowboy-systems.com" },
    software: { p: "Comparing EHR and practice-management software?", b: "Explore the software guide", href: "/category/" + (pub.categories[0] && pub.categories[0].slug) + "/", ghost: null },
    newsletter: { p: "Get our editorial briefing in your inbox.", b: "Subscribe", href: "/newsletter/", ghost: null },
    website: { p: "Learn more about Cowboy Systems.", b: "Visit the official website", href: u("website"), ghost: null },
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
