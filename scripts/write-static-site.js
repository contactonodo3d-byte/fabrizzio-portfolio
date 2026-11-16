import fs from 'node:fs';
import path from 'node:path';
import { staticDocuments, sitemapXml, llmsText } from '../src/seo-pages.js';

function writeIfChanged(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current !== content) fs.writeFileSync(file, content);
}

export function writeStaticSite(root) {
  const documents = staticDocuments();
  const slugs = new Set();
  for (const rel of Object.keys(documents)) {
    const match = rel.match(/^work\/([a-z0-9-]+)\/index\.html$/);
    if (match) slugs.add(match[1]);
  }
  const workDir = path.join(root, 'work');
  if (fs.existsSync(workDir)) {
    for (const entry of fs.readdirSync(workDir, { withFileTypes: true })) {
      if (entry.isDirectory() && !slugs.has(entry.name)) fs.rmSync(path.join(workDir, entry.name), { recursive: true, force: true });
    }
  }
  const caseInputs = {};
  for (const [rel, html] of Object.entries(documents)) {
    const file = path.join(root, rel);
    writeIfChanged(file, html);
    const match = rel.match(/^work\/([a-z0-9-]+)\/index\.html$/);
    if (match) caseInputs[`case-${match[1]}`] = file;
  }
  writeIfChanged(path.join(root, 'public/sitemap.xml'), sitemapXml());
  writeIfChanged(path.join(root, 'public/llms.txt'), llmsText());
  return caseInputs;
}
