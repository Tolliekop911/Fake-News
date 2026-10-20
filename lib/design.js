// Turns a publication's brand palette + fonts into a self-contained stylesheet.
// Modern magazine layout; each publication varies by palette + type pairing.

export function googleFontsHref(fonts) {
  const families = [...new Set([fonts.heading, fonts.body])]
    .map((f) => f.replace(/ /g, "+") + ":ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400")
    .join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

export function stylesheet(pub) {
  const p = pub.brand.palette;
  const f = pub.brand.fonts;
  const r = pub.brand.radius || "12px";
  return `
:root{
  --bg:${p.bg};--surface:${p.surface};--ink:${p.ink};--muted:${p.muted};
  --primary:${p.primary};--primary-ink:${p.primaryInk};--accent:${p.accent};
  --border:${p.border};--radius:14px;--radius-sm:10px;
  --tint:color-mix(in srgb, var(--primary) 9%, var(--bg));
  --tint-2:color-mix(in srgb, var(--primary) 14%, transparent);
  --shadow:0 1px 2px rgba(10,15,25,.04), 0 8px 24px rgba(10,15,25,.06);
  --shadow-lg:0 10px 30px rgba(10,15,25,.12);
  --font-head:"${f.heading}",Georgia,serif;--font-body:"${f.body}",system-ui,sans-serif;
  --maxw:1240px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);
  font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none;transition:color .15s}
a:hover{color:var(--primary)}
h1,h2,h3,h4,.brand,.kicker,.section-label,nav.main a{font-family:var(--font-head)}
img{max-width:100%;height:auto;display:block}
.container{max-width:var(--maxw);margin:0 auto;padding:0 24px}
.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;background:var(--primary);color:#fff;padding:8px;z-index:50}

/* ---- Top utility bar ---- */
.topbar{background:var(--ink);color:#fff;font-family:var(--font-body)}
.topbar .container{display:flex;justify-content:space-between;align-items:center;height:36px;font-size:12px;letter-spacing:.02em}
.topbar a{color:#fff;opacity:.82}.topbar a:hover{opacity:1}
.topbar .date{opacity:.65}

/* ---- Masthead ---- */
.masthead{background:var(--bg)}
.masthead .container{display:flex;align-items:center;gap:20px;padding:22px 24px 18px}
.brand{display:flex;align-items:baseline;gap:14px}
.brand .name{font-size:32px;font-weight:900;letter-spacing:-.03em;color:var(--ink);line-height:1}
.brand .tag{font-size:12.5px;color:var(--muted);font-family:var(--font-body);max-width:240px;line-height:1.35}
.masthead .spacer{flex:1}
.masthead .cta-sub{font-family:var(--font-body);font-weight:700;font-size:13px;color:var(--primary-ink);
  background:var(--primary);padding:10px 18px;border-radius:999px}
.masthead .cta-sub:hover{color:var(--primary-ink);filter:brightness(1.08)}

/* ---- Section nav (sticky, glassy) ---- */
.secnav{background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:saturate(1.4) blur(10px);
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:30}
.secnav .container{display:flex;flex-wrap:wrap;gap:2px}
.secnav a{font-weight:600;font-size:13.5px;color:var(--ink);padding:13px 14px;position:relative}
.secnav a::after{content:"";position:absolute;left:14px;right:14px;bottom:8px;height:2px;background:var(--primary);
  transform:scaleX(0);transform-origin:left;transition:transform .18s;border-radius:2px}
.secnav a:hover,.secnav a[aria-current]{color:var(--primary)}
.secnav a:hover::after,.secnav a[aria-current]::after{transform:scaleX(1)}

/* ---- Ownership disclosure strip ---- */
.disclosure{background:var(--tint);color:var(--muted);font-size:12.5px}
.disclosure .container{padding:10px 24px}
.disclosure strong{color:var(--ink)}

main{padding:30px 0 70px}

/* ---- Front page ---- */
.frontgrid{display:grid;grid-template-columns:1.5fr 320px;gap:36px}
@media(max-width:1000px){.frontgrid{grid-template-columns:1fr;gap:28px}}

.section-label{display:flex;align-items:center;gap:12px;font-size:12px;font-weight:800;text-transform:uppercase;
  letter-spacing:.12em;color:var(--primary);margin:0 0 18px}
.section-label::before{content:"";width:22px;height:3px;background:var(--primary);border-radius:3px}

/* Hero — image with gradient overlay + text on top */
.hero{position:relative;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);min-height:440px;display:flex}
.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,14,20,.05) 0%,rgba(10,14,20,.78) 100%)}
.hero .inner{position:relative;margin-top:auto;padding:30px 32px;color:#fff;z-index:2}
.hero .pill{background:var(--primary);color:var(--primary-ink)}
.hero h2{font-size:38px;line-height:1.06;margin:12px 0 10px;font-weight:900;letter-spacing:-.02em;color:#fff;max-width:640px}
.hero h2 a{color:#fff}.hero h2 a:hover{color:#fff;opacity:.92}
.hero .dek{font-size:18px;color:rgba(255,255,255,.88);margin:0 0 10px;max-width:600px;line-height:1.45}
.hero .byline{font-size:13px;color:rgba(255,255,255,.72);font-family:var(--font-body)}
@media(max-width:620px){.hero h2{font-size:28px}.hero{min-height:360px}}

/* Secondary column */
.sec-item{display:grid;grid-template-columns:1fr 96px;gap:14px;padding:16px 0;border-bottom:1px solid var(--border)}
.sec-item:first-of-type{padding-top:0}
.sec-item .kicker{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--primary)}
.sec-item h4{margin:4px 0 0;font-size:16px;line-height:1.25;font-weight:700}
.sec-item img{width:96px;height:72px;object-fit:cover;border-radius:var(--radius-sm)}

/* Below hero: lead secondary cards under main column */
.leadrow{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
@media(max-width:620px){.leadrow{grid-template-columns:1fr}}

/* ---- Pills / labels ---- */
.pill,.kicker-pill{display:inline-block;font-family:var(--font-body);font-weight:700;font-size:11px;
  text-transform:uppercase;letter-spacing:.06em;padding:5px 11px;border-radius:999px}
.kicker-pill{background:var(--tint-2);color:var(--primary)}
.label{display:inline-block;font-family:var(--font-body);font-weight:700;font-size:10.5px;
  text-transform:uppercase;letter-spacing:.06em;padding:4px 10px;border-radius:999px;margin-bottom:8px}
.label.sponsored{background:var(--accent);color:#fff}
.label.company{background:var(--tint-2);color:var(--primary)}

/* ---- Story cards ---- */
.secrow{margin-top:46px}
.storygrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:26px}
.story{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:transform .18s,box-shadow .18s}
.story:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.story .thumb{aspect-ratio:16/10;object-fit:cover;width:100%}
.story .body{padding:16px 18px 18px;display:flex;flex-direction:column;flex:1}
.story .kicker-pill{align-self:flex-start;margin-bottom:10px}
.story h3{margin:0 0 8px;font-size:20px;line-height:1.2;font-weight:800;letter-spacing:-.01em}
.story .dek{color:var(--muted);font-size:14.5px;margin:0 0 12px;line-height:1.5}
.story .meta{color:var(--muted);font-size:12.5px;font-family:var(--font-body);margin-top:auto}

/* Featured (first) card spans and goes horizontal */
.story.feat{grid-column:1 / -1;flex-direction:row}
.story.feat .thumb{width:54%;aspect-ratio:auto;min-height:300px}
.story.feat .body{justify-content:center;padding:28px 32px}
.story.feat h3{font-size:30px;letter-spacing:-.02em}
.story.feat .dek{font-size:17px}
@media(max-width:720px){.story.feat{flex-direction:column}.story.feat .thumb{width:100%;aspect-ratio:16/10;min-height:0}}

/* ---- Article page ---- */
article.post{max-width:740px;margin:0 auto}
article.post .kicker-pill{margin-bottom:12px}
article.post h1{font-size:44px;line-height:1.08;margin:6px 0 14px;font-weight:900;letter-spacing:-.025em}
article.post .dek{font-size:21px;color:var(--muted);margin:0 0 20px;line-height:1.4}
article.post .byline{font-family:var(--font-body);font-size:13.5px;color:var(--muted);
  display:flex;align-items:center;gap:10px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:14px 0;margin:18px 0 26px}
article.post .byline a{color:var(--primary);font-weight:600}
article.post .lede-img{aspect-ratio:16/9;object-fit:cover;width:100%;border-radius:var(--radius);box-shadow:var(--shadow)}
article.post p,article.post li{font-size:18.5px;line-height:1.75}
article.post h2{font-size:27px;margin:1.5em 0 .4em;font-weight:800;letter-spacing:-.01em}
article.post h3{font-size:21px;margin:1.3em 0 .3em;font-weight:700}
blockquote{border-left:3px solid var(--accent);margin:1.4em 0;padding:.4em 1.2em;color:var(--ink);font-style:italic;font-size:21px;font-family:var(--font-head)}
figure{margin:1.5em 0}figcaption{color:var(--muted);font-size:13px;margin-top:8px;font-family:var(--font-body)}
@media(max-width:620px){article.post h1{font-size:32px}}

.crumbs{font-family:var(--font-body);font-size:12.5px;color:var(--muted);margin:0 0 18px;text-transform:uppercase;letter-spacing:.05em}
.crumbs a:hover{color:var(--primary)}

.disclosure-box{background:var(--tint);border:1px solid var(--border);border-left:4px solid var(--accent);
  border-radius:var(--radius-sm);padding:16px 18px;margin:24px 0;font-size:14.5px;color:var(--muted);font-family:var(--font-body)}
.disclosure-box strong{color:var(--ink)}

/* CTA */
.cta{background:var(--tint);border:1px solid var(--border);border-radius:var(--radius);
  padding:26px;margin:34px 0;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between}
.cta p{margin:0;font-family:var(--font-head);font-size:19px;font-weight:700;max-width:420px}
.btn{display:inline-block;background:var(--primary);color:var(--primary-ink);font-family:var(--font-body);
  font-weight:700;padding:12px 20px;border-radius:999px;font-size:14px;transition:filter .15s,transform .15s}
.btn:hover{color:var(--primary-ink);filter:brightness(1.08);transform:translateY(-1px)}
.btn.ghost{background:transparent;color:var(--primary);border:1px solid var(--primary)}

/* page headers */
.pagehead{margin:6px 0 30px}
.pagehead .eyebrow{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--primary)}
.pagehead h1{font-size:40px;font-weight:900;margin:8px 0 6px;letter-spacing:-.025em}
.pagehead p{margin:0;color:var(--muted);font-size:17px}

/* Author */
.author-hero{display:flex;gap:20px;align-items:center;margin:0 0 26px;background:var(--surface);
  border:1px solid var(--border);border-radius:var(--radius);padding:22px;box-shadow:var(--shadow)}
.avatar{width:84px;height:84px;border-radius:999px;background:var(--tint-2);
  display:grid;place-items:center;font-family:var(--font-head);font-weight:900;font-size:30px;color:var(--primary);flex:none}

/* Footer */
footer.site{border-top:1px solid var(--border);background:var(--surface);margin-top:60px;color:var(--muted);font-size:14px}
footer.site .cols{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px;padding:46px 0}
@media(max-width:820px){footer.site .cols{grid-template-columns:1fr}}
footer.site a{display:block;padding:3px 0}
footer.site a:hover{color:var(--primary)}
footer.site h4{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--ink);font-family:var(--font-head)}
footer.site .fname{font-family:var(--font-head);font-weight:900;font-size:22px;color:var(--ink);letter-spacing:-.02em}
.legal{border-top:1px solid var(--border);padding:18px 0;font-size:12.5px}
`.trim();
}
