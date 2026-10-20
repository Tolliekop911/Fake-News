// Minimal static file server for previewing the built network locally.
// Usage:
//   node serve.js [port]          -> serves dist/ (network index at /, pubs at /<slug>/)
//   node serve.js [port] <slug>   -> serves ONE publication at root, so absolute /assets/
//                                    paths resolve exactly as they will on its real domain.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const slug = process.argv[3];
const dist = slug ? path.join(__dirname, "dist", slug) : path.join(__dirname, "dist");
const port = Number(process.argv[2]) || 8080;

const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json",
};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(dist, url);
  try {
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) { res.writeHead(404); res.end("Not found: " + url); return; }
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(port, () => console.log(
  slug
    ? `Serving publication "${slug}" at http://localhost:${port}/ (faithful, assets resolve)`
    : `Serving dist/ at http://localhost:${port}/ (network index). For a faithful single-site preview with styles: node serve.js ${port} <slug>`
));
