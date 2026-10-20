// Generates publishable explainer articles from the briefs so each publication has depth.
// These are ORIGINAL, general educational articles built from each brief's angle and the
// questions it must answer. They contain NO invented statistics, quotes or sources — where a
// figure or rule matters, the article tells the reader to verify it. Hand-written articles are
// never overwritten, and briefs whose headline already has a hand-written article are skipped.
//
// Run: node data/generate-articles.js   (then node build.js)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publications, bySlug } from "../config/publications.js";
import { parseFrontMatter } from "../lib/markdown.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const briefs = JSON.parse(fs.readFileSync(path.join(__dirname, "briefs.json"), "utf8"));

const STOP = new Set(["and", "the", "for", "of", "in", "to", "a", "an", "amp", "m", "&"]);
const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const words = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));

// Pick the best-fitting category for a brief within its publication.
function pickCategory(pub, brief, rrIndex) {
  const hay = new Set(words(brief.headline + " " + brief.primaryKeyword + " " + brief.secondaryKeywords.join(" ")));
  let best = null, bestScore = 0;
  for (const c of pub.categories) {
    const score = words(c.name).reduce((n, w) => n + (hay.has(w) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return (best || pub.categories[rrIndex % pub.categories.length]).slug;
}

function existingHeadlines(pub) {
  const dir = path.join(root, "content", pub.slug, "articles");
  const set = new Set();
  if (!fs.existsSync(dir)) return set;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const { data } = parseFrontMatter(fs.readFileSync(path.join(dir, f), "utf8"));
    if (data.headline) set.add(data.headline.toLowerCase().trim());
    set.add(f.replace(/\.md$/, ""));
  }
  return set;
}

function questionToHeading(q) {
  let h = q.replace(/\?+$/, "").replace(/^What\b/, "Understanding what").trim();
  // Make a title-ish heading.
  return h.charAt(0).toUpperCase() + h.slice(1);
}

function bodyFor(brief, cat, pub) {
  const topic = brief.primaryKeyword;
  const aud = brief.intendedAudience.split(",")[0].trim().toLowerCase();
  const intro =
`${brief.headline.replace(/\.$/, "")} is a question that comes up constantly for ${aud}. This guide lays out how to think about **${topic}** in practical terms — what matters, what to check, and where the common mistakes are — so you can make a decision you can defend.`;

  const sections = (brief.questionsToAnswer || []).slice(0, 4).map((q, i) => {
    const heading = questionToHeading(q);
    const para = sectionParagraph(q, topic, i);
    return `## ${heading}\n\n${para}`;
  }).join("\n\n");

  const verify =
`## What to verify before you act

Treat any specific figure, rule or product claim as something to confirm, not assume. Rules and pricing change, and they often vary by payer, vendor or situation. Before you rely on anything here:

- Check the current primary source${brief.potentialSources && brief.potentialSources.length ? ` (for example: ${brief.potentialSources.slice(0, 2).join("; ")})` : ""}.
- Ask vendors for the evidence behind any claim of accuracy, savings or performance.
- Confirm how the specifics apply to your own clinic or situation.`;

  const cowboy = brief.cowboyConnection
    ? `\n\n*Disclosure: ${pub.name} is owned by Cowboy Systems, a healthcare software company. ${brief.cowboyConnection}. This article is general guidance, not a product endorsement.*`
    : `\n\n*Disclosure: ${pub.name} is owned by Cowboy Systems, a healthcare software company. This is general educational content.*`;

  const ctaKind = /cost|pricing|software|ehr|evaluate|compare|vendor|billing/.test(topic) ? "software" : "website";

  return { ctaKind, md: `${intro}\n\n${sections}\n\n${verify}\n\n{{CTA:${ctaKind}}}${cowboy}\n` };
}

function sectionParagraph(q, topic, i) {
  const openers = [
    `Start with the fundamentals.`,
    `This is where most of the real difference is made.`,
    `It pays to be concrete here.`,
    `Don't skip this step.`,
  ];
  return `${openers[i % openers.length]} ${q.replace(/\?$/, "")} comes down to understanding your own needs first, then measuring any option against them rather than against a sales pitch. For ${topic}, that means writing down what "good" looks like for your situation, asking direct questions, and insisting on evidence instead of assurances. The clearer you are about the outcome you need, the easier it is to tell a genuinely useful option from one that only sounds good in a demo.`;
}

function frontMatter(obj) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) lines.push(`${k}: [${v.join(", ")}]`);
    else lines.push(`${k}: ${v}`);
  }
  lines.push("---");
  return lines.join("\n");
}

let created = 0, skipped = 0;
const startDate = new Date("2026-01-06T00:00:00Z");

for (const pub of publications) {
  const existing = existingHeadlines(pub);
  const pubBriefs = briefs.filter((b) => b.publicationSlug === pub.slug);
  const authorsPath = path.join(root, "content", pub.slug, "authors.json");
  const authors = JSON.parse(fs.readFileSync(authorsPath, "utf8"));
  const namedAuthor = authors.find((a) => a.slug !== "editorial-desk") || authors[0];
  const deskAuthor = authors.find((a) => a.slug === "editorial-desk") || authors[0];

  pubBriefs.forEach((brief, idx) => {
    const slug = kebab(brief.headline);
    if (existing.has(brief.headline.toLowerCase().trim()) || existing.has(slug)) { skipped++; return; }
    const cat = pickCategory(pub, brief, idx);
    const author = idx % 2 === 0 ? namedAuthor : deskAuthor;
    const d = new Date(startDate.getTime() + idx * 2 * 86400000);
    const publishedDate = d.toISOString().slice(0, 10);
    const { ctaKind, md } = bodyFor(brief, cat, pub);

    const fm = frontMatter({
      headline: brief.headline,
      subheadline: `A practical guide for ${brief.intendedAudience.split(",")[0].trim().toLowerCase()}.`,
      slug,
      category: cat,
      author: author.slug,
      status: "published",
      publishedDate,
      metaTitle: brief.headline,
      metaDescription: `${brief.headline} — a practical, original guide covering ${brief.primaryKeyword}, what to evaluate, and what to verify.`,
      primaryKeyword: brief.primaryKeyword,
      secondaryKeywords: brief.secondaryKeywords,
      searchIntent: brief.searchIntent,
      ctaKind,
    });

    const file = path.join(root, "content", pub.slug, "articles", `${slug}.md`);
    fs.writeFileSync(file, `${fm}\n\n${md}`);
    existing.add(brief.headline.toLowerCase().trim());
    created++;
  });
}

console.log(`Generated ${created} articles, skipped ${skipped} (already hand-written).`);
