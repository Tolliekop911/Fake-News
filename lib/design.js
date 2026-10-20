// Turns a publication's brand palette + fonts into a self-contained stylesheet.
// One shared component layout, but every publication gets its own colors, type and feel,
// so the sites read as distinct publications rather than a recolored template.

export function googleFontsHref(fonts) {
  const families = [...new Set([fonts.heading, fonts.body])]
    .map((f) => f.replace(/ /g, "+") + ":wght@400;500;600;700;800")
    .join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

export function stylesheet(pub) {
  const p = pub.brand.palette;
  const f = pub.brand.fonts;
  const r = pub.brand.radius || "6px";
  return `
:root{
  --bg:${p.bg};--surface:${p.surface};--ink:${p.ink};--muted:${p.muted};
  --primary:${p.primary};--primary-ink:${p.primaryInk};--accent:${p.accent};
  --border:${p.border};--radius:${r};
  --font-head:"${f.heading}",system-ui,sans-serif;--font-body:"${f.body}",Georgia,serif;
  --maxw:1120px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);
  font-size:18px;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--primary)}
h1,h2,h3,h4,.brand{font-family:var(--font-head);line-height:1.15;letter-spacing:-.01em}
img{max-width:100%;height:auto;display:block}
.container{max-width:var(--maxw);margin:0 auto;padding:0 20px}
.skip{position:absolute;left:-999px}
.skip:focus{left:8px;top:8px;background:var(--primary);color:var(--primary-ink);padding:8px;z-index:50}

/* Masthead */
.masthead{border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:30}
.masthead .row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 20px;max-width:var(--maxw);margin:0 auto}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:var(--ink);text-decoration:none}
.brand .mark{display:inline-grid;place-items:center;min-width:40px;height:40px;padding:0 8px;
  background:var(--primary);color:var(--primary-ink);border-radius:var(--radius);font-size:16px;font-weight:800}
nav.main{display:flex;flex-wrap:wrap;gap:4px}
nav.main a{color:var(--ink);text-decoration:none;font-family:var(--font-head);font-weight:600;
  font-size:14px;padding:8px 12px;border-radius:var(--radius)}
nav.main a:hover,nav.main a[aria-current]{background:var(--surface);color:var(--primary)}
.tagline{color:var(--muted);font-size:13px;text-align:center;padding:6px 20px;border-bottom:1px solid var(--border);font-family:var(--font-head)}

/* Disclosure banner */
.disclosure{background:var(--surface);border-bottom:1px solid var(--border);color:var(--muted);font-size:13px}
.disclosure .container{padding:10px 20px}
.disclosure strong{color:var(--ink)}

/* Layout */
main{padding:28px 0 56px}
.grid{display:grid;gap:28px}
.lead{grid-template-columns:2fr 1fr}
@media(max-width:820px){.lead{grid-template-columns:1fr}nav.main{display:none}}

/* Cards */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.card .body{padding:16px}
.kicker{font-family:var(--font-head);font-weight:700;text-transform:uppercase;letter-spacing:.08em;
  font-size:11px;color:var(--primary)}
.card h3{margin:.3em 0 .4em;font-size:20px}
.card h3 a{color:var(--ink);text-decoration:none}
.card h3 a:hover{color:var(--primary)}
.meta{color:var(--muted);font-size:13px;font-family:var(--font-head)}
.feature h2{font-size:34px;margin:.2em 0}
.feature h2 a{color:var(--ink);text-decoration:none}
.feature .dek{color:var(--muted);font-size:20px}

/* Article */
article.post{max-width:720px;margin:0 auto}
article.post h1{font-size:40px;margin:.1em 0 .2em}
article.post .dek{font-size:22px;color:var(--muted);margin:0 0 18px}
article.post .byline{font-family:var(--font-head);font-size:14px;color:var(--muted);
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:12px 0;margin:18px 0 24px}
article.post .byline a{color:var(--primary)}
article.post p,article.post li{font-size:19px}
article.post h2{font-size:27px;margin:1.4em 0 .4em}
article.post h3{font-size:21px;margin:1.2em 0 .3em}
blockquote{border-left:3px solid var(--accent);margin:1.2em 0;padding:.2em 1em;color:var(--muted);font-style:italic}
figure{margin:1.4em 0}figcaption{color:var(--muted);font-size:13px;margin-top:6px;font-family:var(--font-head)}

/* Disclosure / sponsored label on an article */
.label{display:inline-block;font-family:var(--font-head);font-weight:700;font-size:11px;
  text-transform:uppercase;letter-spacing:.08em;padding:4px 10px;border-radius:999px;margin-bottom:10px}
.label.sponsored{background:var(--accent);color:#1a1200}
.label.company{background:var(--surface);border:1px solid var(--border);color:var(--muted)}
.disclosure-box{background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--accent);
  border-radius:var(--radius);padding:14px 16px;margin:22px 0;font-size:15px;color:var(--muted)}
.disclosure-box strong{color:var(--ink)}

/* Breadcrumbs */
.crumbs{font-family:var(--font-head);font-size:13px;color:var(--muted);margin:0 0 14px}
.crumbs a{color:var(--muted)}.crumbs a:hover{color:var(--primary)}

/* CTA */
.cta{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
  padding:20px;margin:28px 0;display:flex;flex-wrap:wrap;align-items:center;gap:14px;justify-content:space-between}
.cta p{margin:0;font-family:var(--font-head)}
.btn{display:inline-block;background:var(--primary);color:var(--primary-ink);text-decoration:none;
  font-family:var(--font-head);font-weight:700;padding:11px 18px;border-radius:var(--radius)}
.btn.ghost{background:transparent;color:var(--primary);border:1px solid var(--primary)}

/* Author */
.author-hero{display:flex;gap:18px;align-items:center;margin:0 0 22px}
.avatar{width:84px;height:84px;border-radius:999px;background:var(--surface);border:1px solid var(--border);
  display:grid;place-items:center;font-family:var(--font-head);font-weight:800;font-size:28px;color:var(--primary)}

/* Footer */
footer.site{border-top:1px solid var(--border);background:var(--surface);margin-top:40px;color:var(--muted);font-size:14px}
footer.site .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:24px;padding:34px 0}
@media(max-width:820px){footer.site .cols{grid-template-columns:1fr}}
footer.site a{color:var(--muted);text-decoration:none;display:block;padding:3px 0}
footer.site a:hover{color:var(--primary)}
footer.site h4{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink)}
.legal{border-top:1px solid var(--border);padding:16px 0;font-size:13px}
`.trim();
}
