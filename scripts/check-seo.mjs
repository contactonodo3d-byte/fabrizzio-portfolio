// Checks the built site the way GitHub Pages will serve it.
// /name.html wins over /name/ for the extensionless URL, so legacy shells
// cannot be real 301s. Directory URLs with no sibling .html file do 301.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '../dist');
const origin = 'https://fabrizzioruiz.com';

function pagesLookup(pathname) {
  const rel = decodeURIComponent(pathname).replace(/^\//, '');
  const exact = path.join(dist, rel);
  const asHtml = path.join(dist, `${rel}.html`);
  const asIndex = path.join(dist, rel, 'index.html');
  const inside = (file) => {
    const resolved = path.resolve(file);
    return (resolved === dist || resolved.startsWith(dist + path.sep)) && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  };
  if (rel && inside(exact)) return { status: 200, file: exact };
  if (rel && inside(asHtml)) return { status: 200, file: asHtml, note: 'html-sibling' };
  if (inside(asIndex)) {
    if (pathname !== '/' && !pathname.endsWith('/')) return { status: 301, location: `${pathname}/` };
    return { status: 200, file: asIndex };
  }
  if (pathname === '/' && inside(path.join(dist, 'index.html'))) return { status: 200, file: path.join(dist, 'index.html') };
  return { status: 404, file: path.join(dist, '404.html') };
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL', message);
    process.exitCode = 1;
  } else {
    console.log('ok', message);
  }
}

const legacy = [
  ['/work.html', '/work/', 'work.html'],
  ['/about.html', '/about/', 'about.html'],
  ['/services.html', '/services/', 'services.html'],
  ['/contact.html', '/contact/', 'contact.html'],
  ['/lab.html', '/lab/', 'lab.html'],
];

for (const [urlPath, target] of legacy) {
  const hit = pagesLookup(urlPath);
  const bare = pagesLookup(urlPath.replace(/\.html$/, ''));
  assert(hit.status === 200 && bare.status === 200 && hit.file === bare.file, `${urlPath} and ${urlPath.replace(/\.html$/, '')} both serve the shell (${hit.status}/${bare.status})`);
  const html = read(hit.file);
  assert(!/noindex/i.test(html), `${urlPath} has no noindex`);
  assert(html.includes(`rel="canonical" href="${origin}${target}"`), `${urlPath} canonical ${target}`);
  assert(html.includes(`http-equiv="refresh" content="0;url=${target}"`), `${urlPath} meta refresh 0`);
  assert(html.includes(`location.replace("${target}"`), `${urlPath} script redirect`);
}

const slash = pagesLookup('/work/');
assert(slash.status === 200 && slash.file.endsWith(`${path.sep}work${path.sep}index.html`), '/work/ serves work/index.html');
const expo = pagesLookup('/expo');
assert(expo.status === 301 && expo.location === '/expo/', `/expo 301 -> ${expo.location}`);
const foodyBare = pagesLookup('/work/foody');
assert(foodyBare.status === 301 && foodyBare.location === '/work/foody/', `/work/foody 301 -> ${foodyBare.location}`);

const caseFile = read(path.join(dist, 'case-study.html'));
assert(!/noindex/i.test(caseFile), 'case-study.html has no noindex');
assert(caseFile.includes('known.indexOf(slug)') && caseFile.includes('"/work/"+slug+"/"'), 'case-study.html maps ?project= to /work/slug/');
assert(caseFile.includes('http-equiv="refresh"'), 'case-study.html writes a meta refresh');

const home = read(path.join(dist, 'index.html'));
assert(home.includes('srcset=') && home.includes('sizes=') && home.includes('foto-5-640w.webp'), 'home hero srcset');
assert(/foto-5\.webp"[^>]*fetchpriority="high"|fetchpriority="high"[^>]*foto-5\.webp/.test(home) || home.includes('fetchpriority="high"'), 'home eager image is prioritized');
assert(home.includes('loading="lazy"'), 'home lazy-loads later images');
assert(home.includes('https://www.linkedin.com/in/fabriz7io/'), 'LinkedIn sameAs kept');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, files);
    else if (/\.(html|xml|txt|js|json)$/.test(entry.name)) files.push(file);
  }
  return files;
}
const built = walk(dist);
const behanceHits = built.filter((file) => /behance/i.test(read(file)));
assert(behanceHits.length === 0, `no Behance mentions in the built site (${behanceHits.join(', ')})`);

const hiddenCases = ['/work/law-group/', '/work/vista-digital/'];
const law = read(path.join(dist, 'work/law-group/index.html'));
const vista = read(path.join(dist, 'work/vista-digital/index.html'));
const robots = '<meta name="robots" content="noindex, nofollow">';
assert(law.includes(robots), 'law-group is noindex, nofollow');
assert(vista.includes(robots), 'vista-digital is noindex, nofollow');
assert(law.includes('presencia digital para el sector legal'), 'law-group uses existing story');
assert(law.includes('law.vistadigital.com'), 'law-group keeps its real URL');
assert(!/<img /.test(law), 'law-group still has no invented image');
assert(vista.includes('vistadigital.com') && vista.includes('portafolio anterior'), 'vista-digital keeps known facts');
assert(!/<img /.test(vista), 'vista-digital still has no invented image');
const linkSurfaces = built.filter((file) => /\.(html|xml|txt)$/.test(file));
const leaks = [];
for (const file of linkSurfaces) {
  const rel = path.relative(dist, file);
  if (rel === 'work/law-group/index.html' || rel === 'work/vista-digital/index.html') continue;
  const text = read(file);
  for (const hiddenPath of hiddenCases) {
    if (text.includes(hiddenPath)) leaks.push(`${rel} -> ${hiddenPath}`);
  }
}
assert(leaks.length === 0, `hidden case studies are not linked elsewhere (${leaks.join('; ') || 'none'})`);

const sitemap = read(path.join(dist, 'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(locs.length === 36, `sitemap has 36 URLs (${locs.length})`);
assert(locs.includes(`${origin}/work/gestecner/`), 'sitemap includes /work/gestecner/');
assert(!locs.some((loc) => hiddenCases.some((hiddenPath) => loc.endsWith(hiddenPath))), 'sitemap omits hidden case studies');
assert(!locs.some((loc) => loc.endsWith('.html') || !loc.startsWith(`${origin}/`) || loc.includes('?')), 'sitemap URLs are canonical https paths');
assert((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length === locs.length, 'every sitemap URL has lastmod');
assert(sitemap.includes('<loc>https://fabrizzioruiz.com/work/gestecner/</loc><lastmod>2026-11-20</lastmod>'), 'gestecner lastmod is its content date');
assert(sitemap.includes('<loc>https://fabrizzioruiz.com/work/</loc><lastmod>2026-11-21</lastmod>'), 'work index lastmod matches the hidden-case update');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const hit = pagesLookup(url.pathname);
  if (hit.status === 301) {
    res.writeHead(301, { location: hit.location });
    res.end();
    return;
  }
  const body = fs.readFileSync(hit.file);
  res.writeHead(hit.status, { 'content-type': 'text/html; charset=utf-8' });
  res.end(body);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
console.log(`pages-mimic http://127.0.0.1:${port}`);
for (const route of ['/work', '/work.html', '/work/', '/about', '/services', '/contact', '/lab', '/expo', '/work/foody', '/case-study.html']) {
  const response = await fetch(`http://127.0.0.1:${port}${route}`, { redirect: 'manual' });
  console.log(`${response.status} ${route} ${response.headers.get('location') || ''}`.trim());
}
server.close();
if (process.exitCode) process.exit(process.exitCode);
