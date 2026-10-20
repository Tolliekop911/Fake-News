// Turns a publication's brand palette + fonts into a self-contained stylesheet.
// Direction: BOLD MODERN NEWS (Axios/Verge energy) — white canvas, vivid accent,
// solid color-blocked labels, chunky heavy sans headlines, dense grid. One system,
// each publication differentiated by its accent color + display font.

export function googleFontsHref(fonts) {
  const families = [...new Set([fonts.heading, fonts.body])]
    .map((f) => f.replace(/ /g, "+") + ":ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400")
    .join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

export function stylesheet(pub) {
  const p = pub.brand.palette;
  const f = pub.brand.fonts;
  return `
:root{
  --bg:${p.bg};--surface:${p.surface};--ink:${p.ink};--muted:${p.muted};
  --primary:${p.primary};--primary-ink:${p.primaryInk};--accent:${p.accent};
  --border:${p.border};
  --tint:color-mix(in srgb, var(--primary) 7%, var(--bg));
  --font-head:"${f.heading}",system-ui,sans-serif;--font-body:"${f.body}",system-ui,sans-serif;
  --maxw:1280px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);
  font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none;transition:color .12s}
a:hover{color:var(--primary)}
h1,h2,h3,h4,.brand .name,.kicker,.section-label,.secnav a,.rank h4{font-family:var(--font-head)}
h1,h2,h3,h4{letter-spacing:-.02em}
img{max-width:100%;height:auto;display:block}
.container{max-width:var(--maxw);margin:0 auto;padding:0 28px}
.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;background:var(--primary);color:#fff;padding:8px;z-index:50}

/* thick accent bar at very top */
body::before{content:"";display:block;height:5px;background:var(--primary)}

/* ---- Top utility bar ---- */
.topbar{background:var(--ink);color:#fff}
.topbar .container{display:flex;justify-content:space-between;align-items:center;height:34px;font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.topbar a{color:#fff;opacity:.8}.topbar a:hover{opacity:1}
.topbar .date{opacity:.55;font-weight:500}

/* ---- Masthead ---- */
.masthead .container{display:flex;align-items:center;gap:22px;padding:20px 28px 16px}
.brand{display:flex;align-items:baseline;gap:14px}
.brand .name{font-size:36px;font-weight:900;letter-spacing:-.04em;color:var(--ink);line-height:.95;text-transform:uppercase}
.brand .tag{font-size:12px;color:var(--muted);max-width:230px;line-height:1.3;font-weight:500}
.masthead .spacer{flex:1}
.masthead .cta-sub{font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:.06em;
  color:var(--primary-ink);background:var(--primary);padding:11px 20px}
.masthead .cta-sub:hover{color:var(--primary-ink);filter:brightness(1.07)}

/* ---- Section nav ---- */
.secnav{background:var(--ink);position:sticky;top:0;z-index:30}
.secnav .container{display:flex;flex-wrap:wrap;gap:0}
.secnav a{color:#fff;font-weight:700;font-size:12.5px;text-transform:uppercase;letter-spacing:.05em;
  padding:13px 16px;border-right:1px solid rgba(255,255,255,.12)}
.secnav a:hover,.secnav a[aria-current]{background:var(--primary);color:var(--primary-ink)}

/* ---- Ownership disclosure ---- */
.disclosure{background:var(--tint);border-bottom:1px solid var(--border);color:var(--muted);font-size:12px}
.disclosure .container{padding:9px 28px}
.disclosure strong{color:var(--ink)}

main{padding:30px 0 72px}

/* ---- Solid color-block section label ---- */
.section-label{display:inline-block;background:var(--primary);color:var(--primary-ink);
  font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:.08em;padding:7px 14px;margin:0 0 20px}

/* ---- Front page ---- */
.frontgrid{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}
@media(max-width:1000px){.frontgrid{grid-template-columns:1fr;gap:30px}}

/* Kicker (accent, uppercase) */
.kicker,.kicker-pill{display:inline-block;color:var(--primary);font-weight:800;font-size:12px;
  text-transform:uppercase;letter-spacing:.07em;margin-bottom:7px;font-family:var(--font-head)}

/* Hero — big image, chunky headline below */
.hero{border-bottom:3px solid var(--ink);padding-bottom:22px}
.hero .hero-media{display:block;overflow:hidden}
.hero .thumb{width:100%;aspect-ratio:16/9;object-fit:cover;transition:transform .4s ease}
.hero:hover .thumb{transform:scale(1.02)}
.hero .hero-body{padding-top:16px}
.hero h2{font-size:44px;line-height:1.02;margin:4px 0 12px;font-weight:900}
.hero .dek{font-size:19px;color:var(--muted);margin:0 0 12px;max-width:680px;line-height:1.45}
.hero .byline{font-size:12.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;font-weight:600}
@media(max-width:620px){.hero h2{font-size:30px}}

/* Lead row under hero */
.leadrow{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:26px}
@media(max-width:620px){.leadrow{grid-template-columns:1fr}}

/* Secondary column — ranked, dense, no images */
.secondary{border-top:3px solid var(--ink);padding-top:16px}
.rank{display:block;padding:15px 0;border-bottom:1px solid var(--border)}
.rank:first-of-type{padding-top:4px}
.rank .kicker{margin-bottom:4px}
.rank h4{margin:0;font-size:18px;line-height:1.2;font-weight:800}
.rank:hover h4{color:var(--primary)}

/* ---- Labels ---- */
.label{display:inline-block;font-weight:800;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;
  padding:4px 9px;margin-bottom:8px;font-family:var(--font-head)}
.label.sponsored{background:var(--accent);color:#fff}
.label.company{background:var(--ink);color:#fff}

/* ---- Story cards ---- */
.secrow{margin-top:52px}
.storygrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:30px 28px}
.story{display:flex;flex-direction:column}
.story .thumb{aspect-ratio:16/10;object-fit:cover;width:100%;transition:transform .35s ease}
.story a:hover .thumb{transform:scale(1.03)}
.story .thumb-wrap{overflow:hidden;margin-bottom:12px}
.story .body{display:flex;flex-direction:column;flex:1}
.story h3{margin:0 0 8px;font-size:21px;line-height:1.14;font-weight:800}
.story:hover h3 a{color:var(--primary)}
.story .dek{color:var(--muted);font-size:14.5px;margin:0 0 10px;line-height:1.45}
.story .meta{color:var(--muted);font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;font-weight:600;margin-top:auto}

/* Featured (first) card: big, horizontal */
.story.feat{grid-column:1 / -1;flex-direction:row;gap:28px;border-bottom:3px solid var(--ink);padding-bottom:30px;margin-bottom:4px}
.story.feat .thumb-wrap{flex:0 0 56%;margin-bottom:0}
.story.feat .thumb{aspect-ratio:16/9;height:100%}
.story.feat .body{justify-content:center}
.story.feat h3{font-size:34px;line-height:1.04}
.story.feat .dek{font-size:17px}
@media(max-width:720px){.story.feat{flex-direction:column;gap:12px}.story.feat .thumb-wrap{flex:none;width:100%}.story.feat h3{font-size:26px}}

/* ---- Article page ---- */
article.post{max-width:740px;margin:0 auto}
article.post h1{font-size:50px;line-height:1.02;margin:6px 0 16px;font-weight:900;letter-spacing:-.03em}
article.post .dek{font-size:22px;color:var(--muted);margin:0 0 22px;line-height:1.38;font-weight:500}
article.post .byline{font-size:12.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;font-weight:600;
  border-top:3px solid var(--ink);border-bottom:1px solid var(--border);padding:14px 0;margin:18px 0 26px}
article.post .byline a{color:var(--primary);font-weight:700}
article.post .lede-img{aspect-ratio:16/9;object-fit:cover;width:100%}
article.post p,article.post li{font-size:19px;line-height:1.72}
article.post h2{font-size:28px;margin:1.5em 0 .4em;font-weight:900}
article.post h3{font-size:22px;margin:1.3em 0 .3em;font-weight:800}
blockquote{border-left:5px solid var(--primary);margin:1.4em 0;padding:.3em 1.2em;color:var(--ink);font-weight:600;font-size:22px;font-family:var(--font-head);line-height:1.3}
figure{margin:1.4em 0}figcaption{color:var(--muted);font-size:12.5px;margin-top:8px;text-transform:uppercase;letter-spacing:.03em}
@media(max-width:620px){article.post h1{font-size:34px}}

.crumbs{font-size:11.5px;color:var(--muted);margin:0 0 18px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.crumbs a:hover{color:var(--primary)}

.disclosure-box{background:var(--tint);border-left:5px solid var(--accent);padding:16px 18px;margin:24px 0;font-size:14.5px;color:var(--muted)}
.disclosure-box strong{color:var(--ink)}

/* CTA */
.cta{background:var(--ink);color:#fff;padding:28px;margin:36px 0;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between}
.cta p{margin:0;font-family:var(--font-head);font-size:21px;font-weight:800;max-width:440px;line-height:1.2;color:#fff}
.btn{display:inline-block;background:var(--primary);color:var(--primary-ink);font-weight:800;text-transform:uppercase;
  letter-spacing:.05em;padding:13px 22px;font-size:13px;transition:filter .12s,transform .12s}
.btn:hover{color:var(--primary-ink);filter:brightness(1.1);transform:translateY(-1px)}
.btn.ghost{background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5)}
.btn.ghost:hover{color:#fff;border-color:#fff}

/* page headers */
.pagehead{border-bottom:3px solid var(--ink);padding-bottom:16px;margin:4px 0 30px}
.pagehead .eyebrow{display:inline-block;background:var(--primary);color:var(--primary-ink);font-weight:900;
  font-size:11px;text-transform:uppercase;letter-spacing:.08em;padding:5px 11px;margin-bottom:12px}
.pagehead h1{font-size:46px;font-weight:900;margin:0;letter-spacing:-.03em}
.pagehead p{margin:8px 0 0;color:var(--muted);font-size:17px}

/* Author */
.author-hero{display:flex;gap:20px;align-items:center;margin:0 0 26px;border-bottom:3px solid var(--ink);padding-bottom:22px}
.avatar{width:84px;height:84px;background:var(--primary);display:grid;place-items:center;
  font-family:var(--font-head);font-weight:900;font-size:30px;color:var(--primary-ink);flex:none}

/* Footer */
footer.site{border-top:5px solid var(--primary);background:var(--ink);color:rgba(255,255,255,.72);margin-top:64px;font-size:14px}
footer.site .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:34px;padding:48px 0}
@media(max-width:820px){footer.site .cols{grid-template-columns:1fr}}
footer.site a{display:block;padding:3px 0;color:rgba(255,255,255,.72)}
footer.site a:hover{color:#fff}
footer.site h4{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#fff;font-family:var(--font-head);font-weight:800}
footer.site .fname{font-family:var(--font-head);font-weight:900;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:-.02em}
footer.site p{color:rgba(255,255,255,.6)}
.legal{border-top:1px solid rgba(255,255,255,.14);padding:18px 0;font-size:12px;color:rgba(255,255,255,.5)}
`.trim();
}
