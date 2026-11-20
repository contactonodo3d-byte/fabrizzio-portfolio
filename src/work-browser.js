import { portfolioCredit } from './content.js';
import { motionSection } from './selected-projects.js';

const disciplines = {
  todo: ['All', 'Todo', 'Tudo'],
  marca: ['Brand', 'Marca', 'Marca'],
  redes: ['Social media', 'Redes sociales', 'Redes sociais'],
  web: ['Web', 'Web', 'Web'],
  stands: ['Expo booths', 'Stands', 'Estandes'],
  espacios: ['Spaces', 'Espacios', 'Espaços'],
  presentaciones: ['Presentations', 'Presentaciones', 'Apresentações'],
};

const assignments = {
  marca: ['kamelio', 'gio-mobili', 'black-sail', 'vegas-valley', 'client-logos', 'protein-bar'],
  redes: ['acuo-redes', 'mosconi', 'recellebrate', 'pam-paiva', 'protein-bar', 'social-media-assets', 'acuo'],
  web: ['ruisenor', 'bad-liar', 'skylinq', 'law-group', 'vista-digital', 'acuo'],
  stands: ['foody', 'casa-albirroja', 'indufar-2026', 'gestecner'],
  espacios: ['foody', 'gio-mobili', 'casa-albirroja', 'indufar-2026', 'gestecner', 'bar-de-cejas', 'architectural-visualization'],
  presentaciones: ['adm-human-rights-report', 'idem', 'abrazo-de-oso', 'pitch-decks'],
};

const featured = ['foody', 'casa-albirroja', 'indufar-2026', 'gestecner', 'gio-mobili'];
const fullFrame = new Set(['adm-human-rights-report', 'mosconi', 'idem', 'abrazo-de-oso', 'vegas-valley', 'protein-bar', 'pitch-decks']);

function currentDiscipline() {
  const value = new URLSearchParams(location.search).get('disciplina');
  return Object.hasOwn(disciplines, value) ? value : 'todo';
}

function workUrl(key) {
  return key === 'todo' ? '/work/' : '/work/?disciplina=' + key;
}

export function returnToProject(slug) {
  return workUrl(currentDiscipline()) + '#proyecto-' + slug;
}

export function workBrowser(projects, language) {
  const index = {en: 0, es: 1, pt: 2}[language];
  const title = ['3D booths and scenography', 'Stands 3D y escenografía', 'Estandes 3D e cenografia'][index];
  const intro = [
    'Trade-show booths, scenography and environmental graphics, plus branding, packaging and white-label design for agencies.',
    'Stands para ferias, escenografía y gráfica ambiental, junto con branding, packaging y diseño white-label para agencias.',
    'Estandes para feiras, cenografia e gráfica ambiental, além de branding, packaging e design white-label para agências.',
  ][index];
  const motion = location.hash === '#motion';
  const key = currentDiscipline();
  const ordered = [...featured.map(slug => projects.find(p => p.slug === slug)), ...projects.filter(p => !featured.includes(p.slug))];
  const visible = ordered.filter(p => key === 'todo' || assignments[key].includes(p.slug));
  const filters = Object.entries(disciplines).map(([id, names]) =>
    `<a href="${workUrl(id)}" ${!motion && id === key ? 'aria-current="page"' : ''}>${names[index]}</a>`).join('');
  const cards = visible.map((p, i) => {
    const names = Object.keys(assignments).filter(id => assignments[id].includes(p.slug)).map(id => disciplines[id][index]);
    const href = key === 'todo' ? p.href : p.href + '?disciplina=' + key;
    const cover = p.slug === 'gio-mobili' ? '/images/selected/gio-mobili/2.webp' : p.thumbnail;
    const coverItem = p.gallery?.find((item) => item.url === cover) || p.gallery?.[0];
    const dims = coverItem?.width ? ` width="${coverItem.width}" height="${coverItem.height}"` : (p.width ? ` width="${p.width}" height="${p.height}"` : '');
    const alt = coverItem?.label ? `${p.title} · ${coverItem.label}` : p.title;
    const visual = cover
      ? `<img src="${cover}" alt="${alt}"${dims} loading="${i < 2 ? 'eager' : 'lazy'}">`
      : `<span class="directory-wordmark">${p.title}</span>`;
    return `<a class="directory-card" id="proyecto-${p.slug}" href="${href}">
      <div class="directory-meta"><span>${names.join(' · ')}</span><h2>${p.title}</h2></div>
      <div class="directory-cover ${fullFrame.has(p.slug) ? 'full-frame' : ''}">${visual}</div></a>`;
  }).join('');
  return `<main class="work-directory container"><div class="directory-views"><h1>${title}</h1></div><p class="editorial-note">${intro}</p>
    <nav class="directory-filters" aria-label="${['Disciplines','Disciplinas','Disciplinas'][index]}">${filters}<a href="/work/#motion" ${motion ? 'aria-current="page"' : ''}>Motion</a></nav>
    ${motion ? motionSection(language) : `<div class="directory-grid">${cards}</div>`}
    <p class="portfolio-credit">${portfolioCredit[language]}</p></main>`;
}
