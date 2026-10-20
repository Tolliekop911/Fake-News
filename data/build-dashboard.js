// Builds data/keywords.json (the keyword-tracking table) from the briefs, flags potential
// keyword cannibalization within each publication, and emits a self-contained editorial
// dashboard at dashboard/index.html (data inlined; opens in a browser with no server).
// Run: node data/build-dashboard.js   (run generate-briefs.js first)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const briefs = JSON.parse(fs.readFileSync(path.join(__dirname, "briefs.json"), "utf8"));
const workflow = JSON.parse(fs.readFileSync(path.join(__dirname, "workflow.json"), "utf8"));
const pubCfg = fs.readFileSync(path.join(root, "config", "publications.js"), "utf8");
const pubNames = Object.fromEntries([...pubCfg.matchAll(/slug:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));

// Keyword tracking table (PART 4 fields)
const keywords = briefs.map((b) => ({
  keyword: b.primaryKeyword,
  intendedPublication: b.publicationSlug,
  intendedLandingPage: b.landingPageUrl,
  searchIntent: b.searchIntent,
  targetAudience: b.intendedAudience,
  contentStatus: b.status,
  publicationUrl: null,
  existingRelatedArticles: [],
  lastReviewDate: b.lastReviewed,
  briefId: b.id,
  searchVolume: null,     // Fill from real keyword research. Do NOT invent values.
  keywordDifficulty: null // Fill from real keyword research. Do NOT invent values.
}));
fs.writeFileSync(path.join(__dirname, "keywords.json"), JSON.stringify(keywords, null, 2));

// Cannibalization check: same primary keyword used by >1 brief within the same publication.
const seen = {};
const cannibal = [];
for (const k of keywords) {
  const key = k.intendedPublication + "::" + k.keyword.toLowerCase();
  if (seen[key]) cannibal.push({ publication: k.intendedPublication, keyword: k.keyword, briefs: [seen[key], k.briefId] });
  else seen[key] = k.briefId;
}

const data = { briefs, keywords, workflow, cannibal, pubNames, generatedAt: new Date().toISOString() };

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Editorial Dashboard — Healthcare Media Network</title>
<style>
:root{--ink:#111827;--muted:#6b7280;--border:#e5e7eb;--surface:#f9fafb;--primary:#1f4e5f}
*{box-sizing:border-box}body{font-family:system-ui,sans-serif;margin:0;color:var(--ink);background:#fff}
header{padding:20px 24px;border-bottom:1px solid var(--border);background:var(--surface)}
header h1{margin:0 0 4px;font-size:22px}header p{margin:0;color:var(--muted);font-size:14px}
.tabs{display:flex;gap:4px;padding:0 24px;border-bottom:1px solid var(--border);flex-wrap:wrap}
.tabs button{border:0;background:none;padding:12px 14px;font-size:14px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent}
.tabs button[aria-selected=true]{color:var(--primary);border-bottom-color:var(--primary)}
main{padding:20px 24px}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
select,input{padding:7px 9px;border:1px solid var(--border);border-radius:6px;font-size:14px}
table{border-collapse:collapse;width:100%;font-size:13px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);vertical-align:top}
th{position:sticky;top:0;background:var(--surface);font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:var(--surface);border:1px solid var(--border)}
.board{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.col{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;min-height:80px}
.col h3{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
.cardi{background:#fff;border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:8px;font-size:12px}
.cardi .kw{color:var(--muted)}
.warn{background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px;margin-bottom:14px;font-size:13px}
.ok{background:#ecfdf5;border:1px solid #10b981;border-radius:8px;padding:12px;margin-bottom:14px;font-size:13px}
code{background:var(--surface);padding:1px 5px;border-radius:4px}
.muted{color:var(--muted)}
</style></head><body>
<header>
  <h1>Editorial Dashboard</h1>
  <p>Healthcare Media Network — 5 publications · ${briefs.length} briefs · internal tool, not deployed publicly.</p>
</header>
<div class="tabs" role="tablist">
  <button role="tab" aria-selected="true" data-tab="board">Workflow board</button>
  <button role="tab" aria-selected="false" data-tab="briefs">Briefs</button>
  <button role="tab" aria-selected="false" data-tab="keywords">Keyword tracker</button>
</div>
<main>
  <div class="filters">
    <select id="pub"><option value="">All publications</option>${Object.entries(pubNames).map(([s, n]) => `<option value="${s}">${n}</option>`).join("")}</select>
    <input id="q" placeholder="Search headline / keyword…" size="30">
  </div>
  <div id="panel"></div>
</main>
<script>
const DATA = ${JSON.stringify(data)};
let tab = "board";
const panel = document.getElementById("panel");
const pubSel = document.getElementById("pub");
const q = document.getElementById("q");
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  tab=b.dataset.tab;
  document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-selected", x===b));
  render();
});
pubSel.onchange=render; q.oninput=render;
function filtered(){
  const p=pubSel.value, s=q.value.toLowerCase();
  return DATA.briefs.filter(b=>(!p||b.publicationSlug===p)&&(!s||b.headline.toLowerCase().includes(s)||b.primaryKeyword.includes(s)));
}
function render(){
  if(tab==="board") return renderBoard();
  if(tab==="keywords") return renderKeywords();
  return renderBriefs();
}
function renderBoard(){
  const items=filtered();
  const cols=DATA.workflow.statuses.map(st=>{
    const inSt=items.filter(b=>b.status===st.key);
    return '<div class="col"><h3>'+st.label+' ('+inSt.length+')'+(st.public?' ✓':'')+'</h3>'+
      inSt.map(b=>'<div class="cardi"><strong>'+esc(b.headline)+'</strong><div class="kw">'+esc(DATA.pubNames[b.publicationSlug])+' · '+esc(b.primaryKeyword)+'</div></div>').join("")+'</div>';
  }).join("");
  panel.innerHTML='<div class="board">'+cols+'</div>';
}
function renderBriefs(){
  const rows=filtered().map(b=>'<tr><td><strong>'+esc(b.headline)+'</strong><br><span class="muted">'+esc(b.uniqueAngle)+'</span></td>'+
    '<td>'+esc(DATA.pubNames[b.publicationSlug])+'</td><td><span class="pill">'+esc(b.searchIntent)+'</span></td>'+
    '<td><code>'+esc(b.primaryKeyword)+'</code></td>'+
    '<td>'+(b.cowboyConnection?('✓ '+esc(b.cowboyConnection)):'<span class="muted">none</span>')+'</td>'+
    '<td>'+esc(b.status)+'</td></tr>').join("");
  panel.innerHTML='<table><thead><tr><th>Headline / angle</th><th>Publication</th><th>Intent</th><th>Primary keyword</th><th>Cowboy connection</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function renderKeywords(){
  const warn = DATA.cannibal.length
    ? '<div class="warn"><strong>Potential keyword cannibalization:</strong> '+DATA.cannibal.length+' case(s) where one publication targets the same primary keyword twice. Resolve before publishing.</div>'
    : '<div class="ok"><strong>No intra-publication keyword cannibalization detected.</strong> Each publication targets each primary keyword at most once.</div>';
  const p=pubSel.value, s=q.value.toLowerCase();
  const kws=DATA.keywords.filter(k=>(!p||k.intendedPublication===p)&&(!s||k.keyword.includes(s)));
  const rows=kws.map(k=>'<tr><td><code>'+esc(k.keyword)+'</code></td><td>'+esc(DATA.pubNames[k.intendedPublication])+'</td>'+
    '<td><span class="pill">'+esc(k.searchIntent)+'</span></td>'+
    '<td>'+(k.searchVolume??'<span class="muted">research</span>')+'</td>'+
    '<td>'+(k.keywordDifficulty??'<span class="muted">research</span>')+'</td>'+
    '<td>'+esc(k.contentStatus)+'</td><td>'+(k.lastReviewDate||'<span class="muted">—</span>')+'</td></tr>').join("");
  panel.innerHTML=warn+'<p class="muted" style="font-size:13px">Search volume and difficulty are intentionally empty — populate from real keyword research. The platform never fabricates these values.</p>'+
    '<table><thead><tr><th>Keyword</th><th>Publication</th><th>Intent</th><th>Volume</th><th>Difficulty</th><th>Status</th><th>Last review</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function esc(s){return String(s??"").replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
render();
</script></body></html>`;

fs.mkdirSync(path.join(root, "dashboard"), { recursive: true });
fs.writeFileSync(path.join(root, "dashboard", "index.html"), html);
console.log(`Wrote data/keywords.json (${keywords.length} rows) and dashboard/index.html`);
if (cannibal.length) console.log(`  WARNING: ${cannibal.length} potential cannibalization case(s)`);
else console.log("  No intra-publication keyword cannibalization detected.");
