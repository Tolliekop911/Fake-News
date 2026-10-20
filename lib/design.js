// Turns a publication's brand palette + fonts into a self-contained stylesheet.
// Shared news-publication layout; each publication varies by palette + type pairing.

export function googleFontsHref(fonts) {
  const families = [...new Set([fonts.heading, fonts.body])]
    .map((f) => f.replace(/ /g, "+") + ":ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400")
    .join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

export function stylesheet(pub) {
  const p = pub.brand.palette;
  const f = pub.brand.fonts;
  const r = pub.brand.radius || "3px";
  return `
:root{
  --bg:${p.bg};--surface:${p.surface};--ink:${p.ink};--muted:${p.muted};
  --primary:${p.primary};--primary-ink:${p.primaryInk};--accent:${p.accent};
  --border:${p.border};--radius:${r};
  --font-head:"${f.heading}",Georgia,serif;--font-body:"${f.body}",system-ui,sans-serif;
  --maxw:1180px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);
  font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
a:hover{color:var(--primary)}
h1,h2,h3,h4,.brand,.kicker,.section-label,nav.main a{font-family:var(--font-head)}
img{max-width:100%;height:auto;display:block}
.container{max-width:var(--maxw);margin:0 auto;padding:0 24px}
.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;background:var(--primary);color:#fff;padding:8px;z-index:50}
hr.rule{border:0;border-top:1px solid var(--border);margin:0}

/* ---- Top utility bar ---- */
.topbar{background:var(--ink);color:#fff;font-family:var(--font-body)}
.topbar .container{display:flex;justify-content:space-between;align-items:center;height:34px;font-size:12px;letter-spacing:.02em}
.topbar a{color:#fff;opacity:.85}.topbar a:hover{opacity:1}
.topbar .date{opacity:.7}

/* ---- Masthead ---- */
.masthead{border-bottom:1px solid var(--border);background:var(--bg)}
.masthead .container{display:flex;align-items:center;gap:20px;padding:18px 24px}
.brand{display:flex;align-items:baseline;gap:12px;font-weight:800}
.brand .name{font-size:34px;font-weight:900;letter-spacing:-.02em;color:var(--ink);line-height:1}
.brand .tag{font-size:12px;color:var(--muted);font-family:var(--font-body);max-width:220px;line-height:1.3}
.masthead .spacer{flex:1}
.masthead .cta-sub{font-family:var(--font-body);font-weight:700;font-size:13px;color:var(--primary);border:1px solid var(--primary);padding:8px 14px;border-radius:var(--radius)}
.masthead .cta-sub:hover{background:var(--primary);color:var(--primary-ink)}

/* ---- Section nav ---- */
.secnav{border-bottom:2px solid var(--ink);background:var(--bg);position:sticky;top:0;z-index:30}
.secnav .container{display:flex;flex-wrap:wrap;gap:0}
.secnav a{font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink);
  padding:12px 15px;border-bottom:3px solid transparent;margin-bottom:-2px}
.secnav a:hover,.secnav a[aria-current]{color:var(--primary);border-bottom-color:var(--primary)}

/* ---- Ownership disclosure strip ---- */
.disclosure{background:var(--surface);border-bottom:1px solid var(--border);color:var(--muted);font-size:12.5px}
.disclosure .container{padding:9px 24px}
.disclosure strong{color:var(--ink)}

main{padding:26px 0 60px}

/* ---- Front-page grid: latest rail | hero | secondary ---- */
.frontgrid{display:grid;grid-template-columns:260px 1fr 300px;gap:0;border-top:1px solid var(--border)}
.frontgrid>*{padding:22px 24px}
.frontgrid .rail{border-right:1px solid var(--border)}
.frontgrid .secondary{border-left:1px solid var(--border)}
@media(max-width:1000px){.frontgrid{grid-template-columns:1fr}.frontgrid>*{border:0!important;padding:18px 0}
  .frontgrid .rail,.frontgrid .secondary{border-top:1px solid var(--border)!important}}

.section-label{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;text-transform:uppercase;
  letter-spacing:.1em;color:var(--primary);margin:0 0 14px}
.section-label::after{content:"";flex:1;height:1px;background:var(--border)}

/* Latest rail items */
.latest-item{padding:12px 0;border-bottom:1px solid var(--border)}
.latest-item:first-of-type{padding-top:0}
.latest-item .time{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent)}
.latest-item h4{margin:4px 0 0;font-size:16px;line-height:1.25;font-weight:700}
.latest-item h4 a:hover{color:var(--primary)}

/* Hero */
.hero .thumb{aspect-ratio:16/9;width:100%;object-fit:cover;border-radius:var(--radius);margin-bottom:14px}
.hero .kicker{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--primary)}
.hero h2{font-size:38px;line-height:1.08;margin:8px 0 10px;font-weight:900;letter-spacing:-.02em}
.hero .dek{font-size:19px;color:var(--muted);margin:0 0 10px;line-height:1.4}
.hero .byline{font-size:13px;color:var(--muted);font-family:var(--font-body)}
@media(max-width:620px){.hero h2{font-size:29px}}

/* Secondary stories (right column) */
.sec-item{padding:14px 0;border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 84px;gap:12px}
.sec-item:first-of-type{padding-top:0}
.sec-item .kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--primary)}
.sec-item h4{margin:3px 0 0;font-size:15.5px;line-height:1.25;font-weight:700}
.sec-item img{width:84px;height:64px;object-fit:cover;border-radius:var(--radius)}

/* ---- Section rows (below the fold / category pages) ---- */
.secrow{margin-top:34px}
.storygrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:24px}
.story{display:flex;flex-direction:column}
.story .thumb{aspect-ratio:16/10;object-fit:cover;width:100%;border-radius:var(--radius);margin-bottom:10px}
.story .kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--primary)}
.story h3{margin:5px 0 6px;font-size:20px;line-height:1.2;font-weight:800;letter-spacing:-.01em}
.story h3 a:hover{color:var(--primary)}
.story .dek{color:var(--muted);font-size:15px;margin:0 0 8px;line-height:1.45}
.story .meta{color:var(--muted);font-size:12.5px;font-family:var(--font-body);margin-top:auto}

/* labels */
.label{display:inline-block;font-family:var(--font-body);font-weight:700;font-size:10.5px;
  text-transform:uppercase;letter-spacing:.07em;padding:3px 8px;border-radius:999px;margin-bottom:8px;vertical-align:middle}
.label.sponsored{background:var(--accent);color:#fff}
.label.company{background:var(--surface);border:1px solid var(--border);color:var(--muted)}

/* ---- Article page ---- */
article.post{max-width:720px;margin:0 auto}
article.post .kicker{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--primary)}
article.post h1{font-size:42px;line-height:1.1;margin:8px 0 12px;font-weight:900;letter-spacing:-.02em}
article.post .dek{font-size:21px;color:var(--muted);margin:0 0 18px;line-height:1.4}
article.post .byline{font-family:var(--font-body);font-size:13.5px;color:var(--muted);
  border-top:1px solid var(--ink);border-bottom:1px solid var(--border);padding:12px 0;margin:18px 0 24px}
article.post .byline a{color:var(--primary);font-weight:600}
article.post .lede-img{aspect-ratio:16/9;object-fit:cover;width:100%;border-radius:var(--radius)}
article.post p,article.post li{font-size:18.5px;line-height:1.7}
article.post h2{font-size:26px;margin:1.5em 0 .4em;font-weight:800;letter-spacing:-.01em}
article.post h3{font-size:21px;margin:1.3em 0 .3em;font-weight:700}
blockquote{border-left:3px solid var(--accent);margin:1.3em 0;padding:.3em 1.1em;color:var(--ink);font-style:italic;font-size:20px;font-family:var(--font-head)}
figure{margin:1.4em 0}figcaption{color:var(--muted);font-size:13px;margin-top:6px;font-family:var(--font-body)}
@media(max-width:620px){article.post h1{font-size:31px}}

.crumbs{font-family:var(--font-body);font-size:12.5px;color:var(--muted);margin:0 0 16px;text-transform:uppercase;letter-spacing:.04em}
.crumbs a:hover{color:var(--primary)}

.disclosure-box{background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--accent);
  border-radius:var(--radius);padding:14px 16px;margin:22px 0;font-size:14.5px;color:var(--muted);font-family:var(--font-body)}
.disclosure-box strong{color:var(--ink)}

/* CTA */
.cta{background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--primary);
  border-radius:var(--radius);padding:22px;margin:30px 0;display:flex;flex-wrap:wrap;align-items:center;gap:14px;justify-content:space-between}
.cta p{margin:0;font-family:var(--font-head);font-size:18px;font-weight:700}
.btn{display:inline-block;background:var(--primary);color:var(--primary-ink);font-family:var(--font-body);
  font-weight:700;padding:11px 18px;border-radius:var(--radius);font-size:14px}
.btn:hover{color:var(--primary-ink);filter:brightness(1.08)}
.btn.ghost{background:transparent;color:var(--primary);border:1px solid var(--primary)}

/* page headers (category/author) */
.pagehead{border-bottom:2px solid var(--ink);padding-bottom:12px;margin:6px 0 24px}
.pagehead h1{font-size:34px;font-weight:900;margin:0;letter-spacing:-.02em}
.pagehead p{margin:6px 0 0;color:var(--muted)}

/* Author */
.author-hero{display:flex;gap:18px;align-items:center;margin:0 0 22px}
.avatar{width:84px;height:84px;border-radius:999px;background:var(--surface);border:1px solid var(--border);
  display:grid;place-items:center;font-family:var(--font-head);font-weight:900;font-size:28px;color:var(--primary)}

/* Footer */
footer.site{border-top:3px solid var(--ink);background:var(--surface);margin-top:50px;color:var(--muted);font-size:14px}
footer.site .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:28px;padding:38px 0}
@media(max-width:820px){footer.site .cols{grid-template-columns:1fr}}
footer.site a{display:block;padding:3px 0}
footer.site a:hover{color:var(--primary)}
footer.site h4{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink);font-family:var(--font-head)}
footer.site .fname{font-family:var(--font-head);font-weight:900;font-size:22px;color:var(--ink)}
.legal{border-top:1px solid var(--border);padding:16px 0;font-size:12.5px}
`.trim();
}
