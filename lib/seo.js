// Technical SEO helpers: <head> metadata, canonical URLs, Open Graph, breadcrumbs,
// and Article / NewsArticle structured data (schema.org JSON-LD).
import { escapeHtml } from "./markdown.js";

export function absoluteUrl(pub, path) {
  const base = `https://${pub.domain}`;
  return base + (path.startsWith("/") ? path : "/" + path);
}

export function headMeta({ pub, title, description, url, image, type = "website", publishedTime, modifiedTime, author, robots }) {
  const fullTitle = title ? `${title} — ${pub.name}` : pub.name;
  const desc = (description || pub.description).slice(0, 320);
  const img = image || absoluteUrl(pub, `/assets/og-default.svg`);
  const tags = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    robots ? `<meta name="robots" content="${robots}">` : `<meta name="robots" content="index,follow,max-image-preview:large">`,
    `<meta property="og:site_name" content="${escapeHtml(pub.name)}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${escapeHtml(title || pub.name)}">`,
    `<meta property="og:description" content="${escapeHtml(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title || pub.name)}">`,
    `<meta name="twitter:description" content="${escapeHtml(desc)}">`,
    `<meta name="twitter:image" content="${img}">`,
  ];
  if (publishedTime) tags.push(`<meta property="article:published_time" content="${publishedTime}">`);
  if (modifiedTime) tags.push(`<meta property="article:modified_time" content="${modifiedTime}">`);
  if (author) tags.push(`<meta name="author" content="${escapeHtml(author)}">`);
  return tags.join("\n  ");
}

export function articleJsonLd({ pub, article, url, author, imageUrl }) {
  const schemaType = pub.newsArticleEligible && article.newsworthy ? "NewsArticle" : "Article";
  const data = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: article.headline,
    description: article.subheadline || article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate || article.publishedDate,
    author: author
      ? { "@type": "Person", name: author.name, url: absoluteUrl(pub, `/authors/${author.slug}/`) }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: pub.name,
      // Transparent ownership (PART 7): publisher is owned by Cowboy Systems.
      parentOrganization: { "@type": "Organization", name: "Cowboy Systems", url: "https://www.cowboy-systems.com/" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: imageUrl ? [imageUrl] : undefined,
    isAccessibleForFree: true,
  };
  if (article.sponsored) {
    data["@type"] = "Article";
    data.sponsor = { "@type": "Organization", name: "Cowboy Systems" };
  }
  return jsonLdScript(data);
}

export function breadcrumbsJsonLd(crumbs) {
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, idx) => ({
      "@type": "ListItem", position: idx + 1, name: c.name, item: c.url,
    })),
  });
}

export function organizationJsonLd(pub) {
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: pub.name,
    url: `https://${pub.domain}`,
    parentOrganization: { "@type": "Organization", name: "Cowboy Systems", url: "https://www.cowboy-systems.com/" },
    ethicsPolicy: `https://${pub.domain}/editorial-policy/`,
    diversityPolicy: `https://${pub.domain}/editorial-policy/`,
    correctionsPolicy: `https://${pub.domain}/corrections-policy/`,
  });
}

function jsonLdScript(obj) {
  const clean = JSON.parse(JSON.stringify(obj)); // drop undefined
  return `<script type="application/ld+json">${JSON.stringify(clean)}</script>`;
}

export function robotsTxt(pub) {
  return `User-agent: *\nAllow: /\n\nSitemap: https://${pub.domain}/sitemap.xml\n`;
}

export function sitemapXml(pub, entries) {
  const urls = entries.map((e) =>
    `  <url><loc>${absoluteUrl(pub, e.path)}</loc>` +
    (e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "") +
    `<changefreq>${e.changefreq || "weekly"}</changefreq></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
