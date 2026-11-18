import { site, portfolioCredit, copy as englishCopy, projects as englishProjects, services as englishServices } from './content.js';
import { locales } from './translations.js';
import { selectedProjects, caseGallery } from './selected-projects.js';
import { contact as expoContact } from './expo-contact.js';
import {
  ORIGIN, pageMeta, jsonLdScript, personJsonLd, professionalServiceJsonLd, creativeWorkJsonLd, projectTitle, projectDescription,
} from './seo-meta.js';

function merge(base, override) {
  if (!override) return base;
  if (Array.isArray(base)) return base.map((item, index) => merge(item, override[index]));
  if (base && typeof base === 'object') return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, merge(value, override[key])]));
  return override ?? base;
}

const es = merge(englishCopy, locales.es.copy);
const esServices = merge(englishServices, locales.es.services);

export function catalog(language = 'es') {
  return [...selectedProjects(language), ...merge(englishProjects, locales[language]?.projects)];
}

const LEAD = ['foody', 'casa-albirroja', 'indufar-2026'];

export function orderedProjects(language = 'es') {
  const projects = catalog(language);
  const lead = LEAD.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
  return [...lead, ...projects.filter((project) => !LEAD.includes(project.slug))];
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function display(value) {
  return `${escapeHtml(value.line1)}<br/>${escapeHtml(value.line2 || '')}${value.accent ? `<em>${escapeHtml(value.accent)}</em>` : ''}`;
}

function rootSrc(src) {
  if (!src) return '';
  return src.startsWith('./') ? src.slice(1) : src;
}

function img(src, alt, width, height, loading = 'lazy') {
  if (!src) return '';
  const dims = width && height ? ` width="${width}" height="${height}"` : '';
  return `<img src="${rootSrc(src)}" alt="${escapeHtml(alt)}"${dims} loading="${loading}">`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/src/portfolio.css">
<link rel="stylesheet" href="/src/lab.css">
<link rel="stylesheet" href="/src/album.css">
<link rel="stylesheet" href="/src/cases.css">`;

function head({ title, description, path, image, imageAlt, width, height, robots, jsonLd, extra = '' }) {
  const url = ORIGIN + path;
  const imageUrl = image ? (image.startsWith('http') ? image : ORIGIN + image) : '';
  const card = width >= 600 ? 'summary_large_image' : 'summary';
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#ece6e8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${robots ? `<meta name="robots" content="${escapeHtml(robots)}">` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Fabrizzio Ruiz">
<meta property="og:locale" content="es_PY">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
${imageUrl ? `<meta property="og:image" content="${imageUrl}">
<meta property="og:image:alt" content="${escapeHtml(imageAlt || title)}">
${width ? `<meta property="og:image:width" content="${width}">` : ''}
${height ? `<meta property="og:image:height" content="${height}">` : ''}
<meta name="twitter:card" content="${card}">
<meta name="twitter:image" content="${imageUrl}">
<meta name="twitter:image:alt" content="${escapeHtml(imageAlt || title)}">` : '<meta name="twitter:card" content="summary">'}
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
${jsonLdScript(jsonLd)}
${extra}
${FONTS}
</head>`;
}

function header(current) {
  const link = (href, label) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<a class="skip-link" href="#main-content">Ir al contenido</a>
<header class="site-header"><div class="container header-inner">
  <a class="wordmark" href="/" aria-label="Fabrizzio Ruiz, inicio">FABRIZZIO<span class="wordmark-dot">.</span></a>
  <nav class="desktop-nav" aria-label="Navegación principal">
    ${link('/', 'Home')}${link('/work/', 'Proyectos')}${link('/services/', 'Servicios')}${link('/expo/', 'Stands')}${link('/lab/', 'Lab')}${link('/about/', 'Sobre mí')}<a href="/superflyer/">Superflyer</a>
  </nav>
  <a class="header-cta" href="/contact/">${escapeHtml(es.navigation.startProject)}</a>
</div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container footer-top"><div><div class="eyebrow">${escapeHtml(es.footer.kicker)}</div><h2>${display(es.footer.title)}</h2><p><a href="mailto:${site.email}">${site.email}</a></p><p><a href="https://wa.me/${expoContact.whatsapp}">WhatsApp</a></p></div></div>
<div class="container footer-bottom"><a class="wordmark" href="/">FABRIZZIO<span class="wordmark-dot">.</span></a><p>${escapeHtml(es.footer.descriptor)}<br/>${escapeHtml(site.location)} · ${escapeHtml(es.footer.worldwide)}</p><div class="footer-links"><a href="/work/">Proyectos</a><a href="/services/">Servicios</a><a href="/expo/">Stands</a><a href="/about/">Sobre mí</a><a href="/contact/">Contacto</a></div><small>© ${new Date().getFullYear()} ${escapeHtml(site.name)}</small></div></footer>`;
}

function page(options) {
  const script = options.mainScript === false ? '' : '<script type="module" src="/src/main.js"></script>';
  return `${head(options)}
<body>
<div id="app">
${options.chrome === false ? '' : header(options.path)}
${options.body}
${options.chrome === false ? '' : footer()}
</div>
${script}
</body>
</html>
`;
}

function projectFigure(project, loading) {
  const label = project.gallery?.[0]?.label;
  const alt = label ? `${project.title} · ${label}` : project.title;
  return img(project.thumbnail, alt, project.width, project.height, loading);
}

function homeBody() {
  const lead = ['foody', 'casa-albirroja', 'indufar-2026', 'gio-mobili']
    .map((slug) => catalog('es').find((project) => project.slug === slug));
  const cards = lead.map((project, index) => `<a class="project-card" href="${project.href}"><div class="project-art ${project.className}">${projectFigure(project, index === 0 ? 'eager' : 'lazy')}</div><div class="project-meta"><div><span class="eyebrow">${escapeHtml(project.label)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.note)}</p></div></div></a>`).join('');
  const services = esServices.map((service) => `<a href="/services/#${service.id}"><span>${service.number}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.homeBody)}</p></a>`).join('');
  return `<main id="main-content">
<section class="hero container">
  <div class="hero-top"><div class="hero-identity"><span class="eyebrow status"><span class="status-dot"></span> ${escapeHtml(es.home.role)}</span><span class="eyebrow hero-location">${escapeHtml(es.home.location)}</span></div></div>
  <div class="hero-copy"><h1>${display(es.home.hero)}</h1><p>${escapeHtml(es.home.intro)}</p><div class="hero-actions"><a class="button button-light" href="/work/">${escapeHtml(es.home.exploreWorkButton)}</a><a class="text-link" href="/expo/">Diseño de stands</a><a class="text-link" href="/contact/">${escapeHtml(es.navigation.startProject)}</a></div></div>
</section>
<section class="section container" id="work"><div class="section-head"><div><div class="eyebrow">${escapeHtml(es.home.work.kicker)}</div><h2>${display(es.home.work.title)}</h2></div><a class="text-link" href="/work/">${escapeHtml(es.home.work.allWorkLink)}</a></div><div class="project-grid">${cards}</div><p class="editorial-note">${escapeHtml(es.home.work.placeholderNote)}</p></section>
<section class="services-band"><div class="container"><div class="section-head"><div><div class="eyebrow">${escapeHtml(es.home.services.kicker)}</div><h2>${display(es.home.services.title)}</h2></div></div><div class="service-rows">${services}</div></div></section>
<section class="section container"><div class="eyebrow">${escapeHtml(es.home.approach.kicker)}</div><h2>${display(es.home.approach.title)}</h2><p>${escapeHtml(es.home.approach.body)}</p><a class="text-link" href="/about/">${escapeHtml(es.home.approach.moreLink)}</a></section>
</main>`;
}

function workBody() {
  const cards = orderedProjects('es').map((project, index) => `<article><a href="${project.href}"><p class="eyebrow">${escapeHtml(project.label)}</p><h2>${escapeHtml(project.title)}</h2>${projectFigure(project, index < 2 ? 'eager' : 'lazy')}<p>${escapeHtml(project.note)}</p></a></article>`).join('');
  return `<main id="main-content" class="work-directory container"><div class="directory-views"><h1>Stands 3D y escenografía</h1></div><p class="editorial-note">${escapeHtml(es.work.intro)}</p><div class="static-projects">${cards}</div><p class="portfolio-credit">${escapeHtml(portfolioCredit.es)}</p></main>`;
}

function servicesBody() {
  const blocks = esServices.map((service) => `<section id="${service.id}" class="service-detail"><span class="eyebrow">${service.number}</span><div><h2>${escapeHtml(service.title)}</h2><p>${escapeHtml(service.body)}</p><ul>${service.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div><a href="/contact/">Consultar</a></section>`).join('');
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><div class="eyebrow">${escapeHtml(es.services.kicker)}</div><h1>${display(es.services.title)}</h1><p>${escapeHtml(es.services.intro)}</p></div>${blocks}<section class="monthly"><div class="eyebrow">${escapeHtml(es.services.monthlyKicker)}</div><h2>${escapeHtml(es.services.monthlyTitle)}</h2><p>${escapeHtml(es.services.monthlyBody)}</p><a class="button button-dark" href="/contact/">${escapeHtml(es.services.monthlyButton)}</a></section><p class="editorial-note">${escapeHtml(es.services.note)}</p></main>`;
}

function aboutBody() {
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><div class="eyebrow">${escapeHtml(es.about.kicker)}</div><h1>${display(es.about.title)}</h1><p>${escapeHtml(es.about.intro)}</p></div><div class="about-layout"><figure class="about-portrait">${img('/images/fabrizzio-x.webp', 'Fabrizzio Ruiz', 400, 400, 'eager')}<figcaption><a href="https://x.com/fabrizzioruiz_">@fabrizzioruiz_</a></figcaption></figure><div class="about-copy"><div class="eyebrow">${escapeHtml(es.about.sectionKicker)}</div><h2>${display(es.about.sectionTitle)}</h2><p>${escapeHtml(es.about.paragraph1)}</p><p>${escapeHtml(es.about.paragraph2)}</p><p>${escapeHtml(es.about.paragraph3)}</p><a class="text-link" href="/contact/">${escapeHtml(es.about.contactLink)}</a></div></div></main>`;
}

function contactBody() {
  const form = es.contact.form;
  const fields = [
    [form.name, 'name', 'text'],
    [form.email, 'email', 'email'],
    [form.company, 'company', 'text'],
    [form.timeline, 'timeline', 'text'],
  ].map(([label, name, type]) => `<label>${escapeHtml(label)}<input name="${name}" type="${type}"></label>`).join('');
  const options = form.projectTypes.map((type) => `<option>${escapeHtml(type)}</option>`).join('');
  return `<main id="main-content" class="inner-page container contact-layout"><div class="page-intro"><div class="eyebrow">${escapeHtml(es.contact.kicker)}</div><h1>${display(es.contact.title)}</h1><p>${escapeHtml(es.contact.intro)}</p><p><a href="mailto:${site.email}">${site.email}</a></p><p><a href="https://wa.me/${expoContact.whatsapp}">WhatsApp</a></p></div><form class="contact-form" action="mailto:${site.email}" method="post" enctype="text/plain">${fields}<label>${escapeHtml(form.projectType)}<select name="projectType">${options}</select></label><label class="full">${escapeHtml(form.message)}<textarea name="message" rows="5"></textarea></label><button class="button button-light" type="submit">${escapeHtml(form.submit)}</button></form></main>`;
}

const labEntries = [
  ['Stickman Bowman', 'Juego de arquería en el navegador.', 'https://contactonodo3d-byte.github.io/Stickman-Bowman---Classic/', true],
  ['Hordes', 'Arena de hordas con facciones, reclutamiento y batallas.', 'https://contactonodo3d-byte.github.io/hordes-io/', true],
  ['Foody AR Farm', 'Juego de granja en realidad aumentada.', '/lab/foody-ar-game/'],
  ['Gestecner · 3D / AR', 'Visor interactivo de un stand con realidad aumentada.', '/expo/gestecner/'],
  ['Foody · Exhibidor AR', 'Exhibidor de producto para explorar en 3D y AR.', '/3d/foody-exhibidor/'],
  ['Honor X7d · Drop Challenge', 'Experiencia interactiva de marca.', 'https://contactonodo3d-byte.github.io/honor-x7d-drop-challenge/'],
  ['Open Devil', 'Simulador de una IA fuera de control, inspirado en Plague Inc.', 'https://contactonodo3d-byte.github.io/open-devil/'],
  ['NODO3D', 'Proyecto de visualización 3D y AR.', 'https://github.com/contactonodo3d-byte/NODO3D'],
  ['Vista Digital V2', 'Concepto web para explorar y revisar.', 'https://github.com/contactonodo3d-byte/vista-digital-v2-preview'],
];

function labBody() {
  const cards = labEntries.map(([title, summary, url, wip]) => `<article class="lab-entry"><h2>${escapeHtml(title)}</h2>${wip ? '<p class="lab-status">En proceso</p>' : ''}<p>${escapeHtml(summary)}</p><a class="text-link" href="${url}">Abrir proyecto</a></article>`).join('');
  return `<main id="main-content" class="lab-projects container"><header><h1>Lab</h1><h2>Juegos, AR y experimentos</h2><p>Proyectos que estoy desarrollando y explorando.</p></header><div class="lab-entry-grid">${cards}</div></main>`;
}

function projectBody(project) {
  const back = `<a class="case-back text-link" href="/work/">← Volver a proyectos</a>`;
  const intro = `<header class="case-intro"><div class="eyebrow">${escapeHtml(project.label)}</div><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.note || project.overview || '')}</p></header>`;
  if (project.gallery) {
    return `<main id="main-content" class="case-page container">${back}${intro}${caseGallery(project, 'es')}</main>`;
  }
  const figure = project.thumbnail ? `<figure class="case-image">${img(project.thumbnail, `${project.title} · ${project.label}`, project.width, project.height, 'eager')}<figcaption>${escapeHtml(project.source || '')}</figcaption></figure>` : '';
  const deliverables = (project.deliverables || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const external = project.externalUrl ? `<p><a class="text-link" href="${project.externalUrl}">Ver el proyecto</a></p>` : '';
  return `<main id="main-content" class="case-page container">${back}${intro}${figure}<div class="case-details"><section><div class="eyebrow">Overview</div><p>${escapeHtml(project.overview || '')}</p></section><section><div class="eyebrow">Deliverables</div><ul>${deliverables}</ul></section><section><div class="eyebrow">Project source</div><p>${escapeHtml(project.source || '')}</p>${external}</section></div></main>`;
}

function projectMeta(project) {
  const image = rootSrc(project.thumbnail);
  const fallback = pageMeta.es['/about/'];
  return {
    title: projectTitle(project),
    description: projectDescription(project),
    path: project.href,
    image: image || fallback.image,
    imageAlt: image ? project.title : fallback.imageAlt,
    width: project.width || fallback.width,
    height: project.height || fallback.height,
    jsonLd: [creativeWorkJsonLd({ ...project, thumbnail: image })],
    body: projectBody(project),
  };
}

const labMeta = pageMeta.es['/lab/'];

export function staticDocuments() {
  const home = pageMeta.es['/'];
  const work = pageMeta.es['/work/'];
  const about = pageMeta.es['/about/'];
  const services = pageMeta.es['/services/'];
  const contact = pageMeta.es['/contact/'];
  const documents = {
    'index.html': page({ ...home, path: '/', jsonLd: [personJsonLd(), professionalServiceJsonLd()], body: homeBody(), extra: '<meta name="google-site-verification" content="zrtx-DcAXxQzMSbEo11-o8NEvm68nno9El3y8ZNUnqU">' }),
    'work/index.html': page({ ...work, path: '/work/', jsonLd: professionalServiceJsonLd(), body: workBody() }),
    'about/index.html': page({ ...about, path: '/about/', jsonLd: personJsonLd(), body: aboutBody() }),
    'services/index.html': page({ ...services, path: '/services/', jsonLd: professionalServiceJsonLd(), body: servicesBody() }),
    'contact/index.html': page({ ...contact, path: '/contact/', jsonLd: personJsonLd(), body: contactBody() }),
    'lab/index.html': page({ ...labMeta, path: '/lab/', body: labBody() }),
    '404.html': page({
      title: 'Página no encontrada · Fabrizzio Ruiz',
      description: 'Esta dirección no corresponde a una página de fabrizzioruiz.com.',
      path: '/404.html',
      robots: 'noindex',
      image: home.image,
      imageAlt: home.imageAlt,
      width: home.width,
      height: home.height,
      mainScript: false,
      body: `<main id="main-content" class="inner-page container not-found"><div class="eyebrow">404</div><h1>Esta página no existe</h1><p>La dirección no corresponde a una página de este sitio.</p><p><a href="/">Inicio</a> · <a href="/work/">Proyectos</a> · <a href="/expo/">Stands</a> · <a href="/services/">Servicios</a> · <a href="/contact/">Contacto</a></p></main>`,
    }),
  };
  const projects = orderedProjects('es');
  const indexLinks = projects.map((project) => `<li><a href="${project.href}">${escapeHtml(project.title)}</a> — ${escapeHtml(project.note || '')}</li>`).join('');
  documents['projects/index.html'] = page({
    title: 'Proyectos · Fabrizzio Ruiz',
    description: 'Los proyectos están en direcciones propias dentro de /work/.',
    path: '/work/',
    robots: 'noindex',
    image: work.image,
    imageAlt: work.imageAlt,
    width: work.width,
    height: work.height,
    extra: `<script>var known=${JSON.stringify(orderedProjects('es').map((project) => project.slug))};var slug=new URLSearchParams(location.search).get("project");if(slug&&known.indexOf(slug)!==-1)location.replace("/work/"+slug+"/"+location.hash);else location.replace("/work/"+location.hash);</script>`,
    body: `<main id="main-content" class="inner-page container"><h1>Proyectos</h1><p>Cada proyecto tiene su propia página. Si esta no se abre sola, elegí uno:</p><ul>${indexLinks}</ul></main>`,
  });
  for (const project of projects) documents[`work/${project.slug}/index.html`] = page(projectMeta(project));
  return documents;
}

export function sitemapXml() {
  const paths = ['/', '/work/', '/services/', '/about/', '/contact/', '/lab/', '/lab/foody-ar-game/', '/expo/', '/expo/gestecner/', '/connect/', '/superflyer/', ...orderedProjects('es').map((project) => project.href)];
  const urls = [...new Set(paths)].map((path) => `  <url><loc>${ORIGIN}${path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function llmsText() {
  const projects = orderedProjects('es').map((project) => `- [${project.title}](${ORIGIN}${project.href}): ${project.note || project.overview || ''}`).join('\n');
  return `# Fabrizzio Ruiz

> Graphic designer in Paraguay. 3D trade-show booth and stand design, scenography, environmental graphics, branding, packaging, and white-label design for agencies. Former Lead Designer at Tenth Element (Las Vegas, NV). Remote freelance designer since 2018.

The HTML of the main pages is Spanish. The site also switches to English and Portuguese in the browser.

## Contact

- Site: ${ORIGIN}/
- Email: ${site.email}
- WhatsApp: https://wa.me/${expoContact.whatsapp}
- X: https://x.com/fabrizzioruiz_

## Location

The website, contact card and about page say Asunción, Paraguay. Do not replace that with another city.

## Pages

- [Home](${ORIGIN}/): 3D trade-show booths, scenography, environmental graphics, branding, packaging and white-label design.
- [Work](${ORIGIN}/work/): selected projects, each at its own URL.
- [Services](${ORIGIN}/services/): stands and scenography, white-label for agencies, brand and campaigns, web and digital.
- [About](${ORIGIN}/about/): practice, Tenth Element, freelance work since 2018.
- [Contact](${ORIGIN}/contact/): email and WhatsApp.
- [Expo booths](${ORIGIN}/expo/): stand design page with selected booths and an FAQ.
- [Gestecner viewer](${ORIGIN}/expo/gestecner/): 3D / AR viewer for the Gestecner stand concept.
- [Lab](${ORIGIN}/lab/): games, AR and experiments, including Foody AR Farm.
- [Connect](${ORIGIN}/connect/): contact card.

## Projects

${projects}
`;
}
