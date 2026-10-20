// Build + verification tests. Runs the generator, then asserts the output is correct and
// that publications are properly separated. Exits non-zero on any failure.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publications, network } from "../config/publications.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

let pass = 0, fail = 0;
const results = [];
function check(name, cond, detail = "") {
  if (cond) { pass++; results.push("  ok   " + name); }
  else { fail++; results.push("  FAIL " + name + (detail ? "  — " + detail : "")); }
}
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

// 1. Build
await import("../build.js");
check("build produced dist/", exists(dist));
check("network index exists", exists(path.join(dist, "index.html")));

// 2. Per-publication checks
for (const pub of publications) {
  const out = path.join(dist, pub.slug);
  check(`[${pub.slug}] site root built`, exists(path.join(out, "index.html")));
  check(`[${pub.slug}] stylesheet built`, exists(path.join(out, "assets", "style.css")));
  check(`[${pub.slug}] robots.txt built`, exists(path.join(out, "robots.txt")));
  check(`[${pub.slug}] sitemap.xml built`, exists(path.join(out, "sitemap.xml")));

  const home = read(path.join(out, "index.html"));
  check(`[${pub.slug}] home shows publication name`, home.includes(pub.name));
  check(`[${pub.slug}] home shows ownership disclosure`, home.includes("Ownership disclosure"));
  check(`[${pub.slug}] canonical uses own domain`, home.includes(`https://${pub.domain}`));

  // robots/sitemap reference own domain only
  const robots = read(path.join(out, "robots.txt"));
  check(`[${pub.slug}] robots sitemap points to own domain`, robots.includes(`https://${pub.domain}/sitemap.xml`));
  const sitemap = read(path.join(out, "sitemap.xml"));
  check(`[${pub.slug}] sitemap has urls`, sitemap.includes("<loc>"));

  // legal pages
  for (const legal of ["about", "contact", "editorial-policy", "corrections-policy", "privacy-policy", "terms"]) {
    check(`[${pub.slug}] legal page /${legal}/`, exists(path.join(out, legal, "index.html")));
  }

  // category pages
  for (const cat of pub.categories) {
    check(`[${pub.slug}] category /${cat.slug}/`, exists(path.join(out, "category", cat.slug, "index.html")));
  }

  // PUBLICATION SEPARATION: no other publication's domain or name leaks into this site
  const allFiles = walk(out);
  const others = publications.filter((p) => p.slug !== pub.slug);
  let leaked = null;
  for (const f of allFiles) {
    if (!f.endsWith(".html") && !f.endsWith(".xml") && !f.endsWith(".txt")) continue;
    const content = read(f);
    for (const o of others) {
      if (content.includes(`https://${o.domain}`)) { leaked = `${o.domain} in ${path.relative(out, f)}`; break; }
    }
    if (leaked) break;
  }
  check(`[${pub.slug}] no other publication's domain leaks in`, !leaked, leaked || "");
}

// 3. Article structured data + SEO
const dhnArticle = path.join(dist, "digital-health-news", "ai-documentation", "ai-clinical-documentation-2026", "index.html");
check("sample article rendered", exists(dhnArticle));
if (exists(dhnArticle)) {
  const html = read(dhnArticle);
  check("article has JSON-LD", html.includes('application/ld+json') && html.includes('"@type"'));
  check("article has canonical", html.includes('rel="canonical"'));
  check("article has Open Graph image", html.includes('property="og:image"'));
  check("article has breadcrumbs", html.includes("BreadcrumbList"));
  check("article discloses ownership", html.includes("Cowboy Systems"));
}

// 4. Sponsored article is labelled
const sponsored = path.join(dist, "pt-practice-journal", "documentation", "cowboy-systems-pt-documentation-walkthrough", "index.html");
if (exists(sponsored)) {
  const html = read(sponsored);
  check("sponsored article shows Sponsored label", html.includes("label sponsored"));
  check("sponsored article shows disclosure box", html.includes("disclosure-box"));
}

// 5. Editorial data integrity (briefs/keywords)
const briefs = safeJson(path.join(root, "data", "briefs.json"));
if (briefs) {
  check("100 article briefs present", Array.isArray(briefs) && briefs.length === 100, `found ${briefs?.length}`);
  const required = ["headline", "publicationSlug", "searchIntent", "primaryKeyword", "uniqueAngle"];
  const missing = (briefs || []).find((b) => required.some((k) => !b[k]));
  check("every brief has required fields", !missing, missing ? "a brief is missing fields" : "");
  const slugs = new Set(publications.map((p) => p.slug));
  const badPub = (briefs || []).find((b) => !slugs.has(b.publicationSlug));
  check("every brief maps to a real publication", !badPub, badPub ? badPub.publicationSlug : "");
}

console.log(results.join("\n"));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
function safeJson(p) { try { return JSON.parse(read(p)); } catch { return null; } }
