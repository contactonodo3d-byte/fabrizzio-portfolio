import fs from 'node:fs';
import path from 'node:path';
import { staticDocuments, sitemapXml, llmsText } from '../src/seo-pages.js';
import { writeEnglishMirrors } from './english-mirrors.js';

function writeIfChanged(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current !== content) fs.writeFileSync(file, content);
}

export function writeStaticSite(root) {
  const documents = staticDocuments();
  const slugs = new Set();
  for (const rel of Object.keys(documents)) {
    const match = rel.match(/^(?:en\/)?work\/([a-z0-9-]+)\/index\.html$/);
    if (match) slugs.add(match[1]);
  }
  for (const workDir of [path.join(root, 'work'), path.join(root, 'en/work')]) {
    if (!fs.existsSync(workDir)) continue;
    for (const entry of fs.readdirSync(workDir, { withFileTypes: true })) {
      if (entry.isDirectory() && !slugs.has(entry.name)) fs.rmSync(path.join(workDir, entry.name), { recursive: true, force: true });
    }
  }
  const caseInputs = {};
  for (const [rel, html] of Object.entries(documents)) {
    const file = path.join(root, rel);
    writeIfChanged(file, html);
    const match = rel.match(/^(en\/)?work\/([a-z0-9-]+)\/index\.html$/);
    if (match) caseInputs[`${match[1] ? 'case-en' : 'case'}-${match[2]}`] = file;
    else if (rel.startsWith('en/')) caseInputs[`page-${rel.replace(/[/.]/g, '-')}`] = file;
  }
  writeEnglishMirrors(root);
  for (const rel of ['en/expo/index.html', 'en/connect/index.html']) {
    caseInputs[`page-${rel.replace(/[/.]/g, '-')}`] = path.join(root, rel);
  }
  writeIfChanged(path.join(root, 'public/sitemap.xml'), sitemapXml());
  writeIfChanged(path.join(root, 'public/llms.txt'), llmsText());
  return caseInputs;
}
