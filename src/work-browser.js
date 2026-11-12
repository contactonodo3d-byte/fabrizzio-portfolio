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
  marca: ['gio-mobili', 'black-sail', 'vegas-valley', 'client-logos', 'protein-bar'],
  redes: ['acuo-redes', 'mosconi', 'recellebrate', 'pam-paiva', 'protein-bar', 'social-media-assets', 'acuo'],
  web: ['bad-liar', 'skylinq', 'law-group', 'vista-digital', 'acuo'],
  stands: ['casa-albirroja', 'indufar-2026'],
  espacios: ['gio-mobili', 'casa-albirroja', 'indufar-2026', 'bar-de-cejas', 'architectural-visualization'],
  presentaciones: ['adm-human-rights-report', 'idem', 'abrazo-de-oso', 'pitch-decks'],
};

const featured = ['casa-albirroja', 'gio-mobili', 'adm-human-rights-report', 'acuo-redes'];
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
  const title = ['Projects', 'Proyectos', 'Projetos'][index];
  const motion = location.hash === '#motion';
  const key = currentDiscipline();
  const ordered = [...featured.map(slug => projects.find(p => p.slug === slug)), ...projects.filter(p => !featured.includes(p.slug))];
  const visible = ordered.filter(p => key === 'todo' || assignments[key].includes(p.slug));
  const filters = Object.entries(disciplines).map(([id, names]) =>
    `<a href="${workUrl(id)}" ${id === key ? 'aria-current="page"' : ''}>${names[index]}</a>`).join('');
  const cards = visible.map((p, i) => {
    const names = Object.keys(assignments).filter(id => assignments[id].includes(p.slug)).map(id => disciplines[id][index]);
    const href = p.href + (key === 'todo' ? '' : '&amp;disciplina=' + key);
    const cover = p.slug === 'gio-mobili' ? '/images/selected/gio-mobili/2.webp' : p.thumbnail;
    const visual = cover
      ? `<img src="${cover}" alt="" loading="${i < 2 ? 'eager' : 'lazy'}">`
      : `<span class="directory-wordmark">${p.title}</span>`;
    return `<a class="directory-card" id="proyecto-${p.slug}" href="${href}">
      <div class="directory-meta"><span>${names.join(' · ')}</span><h2>${p.title}</h2></div>
      <div class="directory-cover ${fullFrame.has(p.slug) ? 'full-frame' : ''}">${visual}</div></a>`;
  }).join('');
  return `<main class="work-directory container"><nav class="directory-views" aria-label="Portfolio">
    ${motion ? `<a href="${workUrl(key)}">${title}</a><h1>Motion graphics</h1>` : `<h1>${title}</h1><a href="/work/#motion">Motion</a>`}</nav>
    ${motion ? motionSection(language) : `<nav class="directory-filters" aria-label="${['Disciplines','Disciplinas','Disciplinas'][index]}">${filters}</nav><div class="directory-grid">${cards}</div>`}</main>`;
}
