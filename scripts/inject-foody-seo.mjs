// Inserts a server-rendered title, description and heading into the Foody AR
// Farm shell. React replaces #root on startup, so the game UI is unchanged
// after it mounts. The heading stays in the HTML crawlers receive.
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/inject-foody-seo.mjs <dist/lab/foody-ar-game/index.html>');
  process.exit(1);
}

const title = 'Foody AR Farm · Demo AR · Fabrizzio Ruiz';
const description = 'Foody AR Farm es un demo de un juego de granja en realidad aumentada de Fabrizzio Ruiz, un minuto de granja para Expo Vet 2026.';
const summary = 'Demo de un juego de granja en realidad aumentada de Fabrizzio Ruiz.';

let html = fs.readFileSync(file, 'utf8');
if (!html.includes('id="root"')) {
  console.error('Foody index has no #root; refusing to edit', file);
  process.exit(1);
}

html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
const metaContent = (attr, name, value) => new RegExp(`<meta ${attr}="${name}" content="[^"]*"\\s*/?>`);
if (html.includes('property="og:title"')) html = html.replace(metaContent('property', 'og:title'), `<meta property="og:title" content="${title}">`);
if (html.includes('name="description"')) html = html.replace(metaContent('name', 'description'), `<meta name="description" content="${description}">`);
else html = html.replace('</head>', `<meta name="description" content="${description}"></head>`);
if (html.includes('property="og:description"')) html = html.replace(metaContent('property', 'og:description'), `<meta property="og:description" content="${description}">`);

if (!html.includes('data-foody-static')) {
  const fallback = `<div id="root"><header data-foody-static><h1>Foody AR Farm</h1><p>${summary}</p></header></div>`;
  const replaced = html.replace(/<div id="root">\s*<\/div>/, fallback);
  if (replaced === html) {
    console.error('Could not find an empty #root in', file);
    process.exit(1);
  }
  html = replaced;
}

fs.writeFileSync(file, html);
if (!html.includes('<h1>Foody AR Farm</h1>') || !html.includes(`content="${description}"`) || !html.includes('/assets/')) {
  console.error('Foody SEO injection did not land in', file);
  process.exit(1);
}
console.log('Foody SEO shell updated', file);
