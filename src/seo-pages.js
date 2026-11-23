import { site, portfolioCredit, isHiddenProject, copy as englishCopy, projects as englishProjects, services as englishServices } from './content.js';
import { locales } from './translations.js';
import { selectedProjects, caseGallery } from './selected-projects.js';
import { contact as expoContact } from './expo-contact.js';
import { localizedHref, languageSwitchTargets } from './locale-path.js';
import {
  ORIGIN, pageMeta, jsonLdScript, personJsonLd, professionalServiceJsonLd, creativeWorkJsonLd, projectTitle, projectDescription,
  hreflangLinks, ENTITY_STATEMENT,
} from './seo-meta.js';
import {
  whiteLabelPage, tradeShowPage, whiteLabelBody, tradeShowBody, englishCaseBody, englishAboutBody, englishWorkLead,
  englishCases, faqJsonLd, marketServiceJsonLd, caseCreativeWork,
} from './approved-english.js';
import { imageTag, imageSizes } from './responsive-image.js';
import { sitemapLastmod } from './sitemap-lastmod.js';

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

const LEAD = ['foody', 'casa-albirroja', 'indufar-2026', 'gestecner'];

export function orderedProjects(language = 'es') {
  const projects = catalog(language);
  const lead = LEAD.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
  return [...lead, ...projects.filter((project) => !LEAD.includes(project.slug))];
}

export function publishedProjects(language = 'es') {
  return orderedProjects(language).filter((project) => !isHiddenProject(project));
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

function img(src, alt, width, height, loading = 'lazy', sizes = imageSizes.card, extra = {}) {
  return imageTag({ src, alt, width, height, loading, sizes, ...extra });
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/src/portfolio.css">
<link rel="stylesheet" href="/src/lab.css">
<link rel="stylesheet" href="/src/album.css">
<link rel="stylesheet" href="/src/cases.css">`;

function head({ title, description, path, image, imageAlt, width, height, robots, jsonLd, extra = '', language = 'es', canonical = true, alternates = true, englishOnly = false }) {
  const url = ORIGIN + path;
  const imageUrl = image ? (image.startsWith('http') ? image : ORIGIN + image) : '';
  const card = width >= 600 ? 'summary_large_image' : 'summary';
  const locale = language === 'en' ? 'en_US' : 'es_PY';
  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#ece6e8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${robots ? `<meta name="robots" content="${escapeHtml(robots)}">` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
${canonical ? `<link rel="canonical" href="${url}">` : ''}
${canonical && alternates ? hreflangLinks(path, { englishOnly }) : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Fabrizzio Ruiz">
<meta property="og:locale" content="${locale}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
${canonical ? `<meta property="og:url" content="${url}">` : ''}
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

function languageSwitch(language, path) {
  const { es: esPath, en: enPath, paired } = languageSwitchTargets(path);
  const item = (code, href) => {
    const current = language === code;
    const langRef = paired ? ` hreflang="${code}"` : '';
    return `<a href="${href}" lang="${code}"${langRef}${current ? ' aria-current="page"' : ''}>${code.toUpperCase()}</a>`;
  };
  return `<nav class="language-switch" aria-label="Language / Idioma">${item('es', esPath)}${item('en', enPath)}</nav>`;
}

function header(current, language, copy) {
  const L = (href) => localizedHref(language, href);
  const link = (href, label) => {
    const dest = L(href);
    return `<a href="${dest}"${current === dest ? ' aria-current="page"' : ''}>${label}</a>`;
  };
  const stands = language === 'en' ? 'Expo booths' : 'Stands';
  const homeLabel = language === 'en' ? 'Fabrizzio Ruiz, home' : 'Fabrizzio Ruiz, inicio';
  const navLabel = language === 'en' ? 'Main navigation' : 'Navegación principal';
  const skip = language === 'en' ? 'Skip to content' : 'Ir al contenido';
  return `<a class="skip-link" href="#main-content">${skip}</a>
<header class="site-header"><div class="container header-inner">
  <a class="wordmark" href="${L('/')}" aria-label="${homeLabel}">FABRIZZIO<span class="wordmark-dot">.</span></a>
  <nav class="desktop-nav" aria-label="${navLabel}">
    ${link('/', 'Home')}${link('/work/', copy.navigation.work)}${link('/services/', copy.navigation.services)}${language === 'en' ? `${link('/white-label-design/', 'White-label')}${link('/trade-show-booth-design/', 'Booth design')}` : ''}${link('/expo/', stands)}${link('/lab/', copy.navigation.lab)}${link('/about/', copy.navigation.about)}<a href="/superflyer/">Superflyer</a>
  </nav>
  <div class="header-tools">${languageSwitch(language, current)}</div>
  <a class="header-cta" href="${L('/contact/')}">${escapeHtml(copy.navigation.startProject)}</a>
</div></header>`;
}

function footer(language, copy) {
  const L = (href) => localizedHref(language, href);
  const stands = language === 'en' ? 'Expo booths' : 'Stands';
  return `<footer class="footer"><div class="container footer-top"><div><div class="eyebrow">${escapeHtml(copy.footer.kicker)}</div><h2>${display(copy.footer.title)}</h2><p><a href="mailto:${site.email}">${site.email}</a></p><p><a href="https://wa.me/${expoContact.whatsapp}">WhatsApp</a></p></div></div>
<div class="container footer-bottom"><a class="wordmark" href="${L('/')}">FABRIZZIO<span class="wordmark-dot">.</span></a><p>${escapeHtml(copy.footer.descriptor)}<br/>${escapeHtml(site.location)} · ${escapeHtml(copy.footer.worldwide)}</p><div class="footer-links"><a href="${L('/work/')}">${escapeHtml(copy.navigation.work)}</a><a href="${L('/services/')}">${escapeHtml(copy.navigation.services)}</a>${language === 'en' ? '<a href="/en/white-label-design/">White-label</a><a href="/en/trade-show-booth-design/">Booth design</a>' : ''}<a href="${L('/expo/')}">${stands}</a><a href="${L('/about/')}">${escapeHtml(copy.navigation.about)}</a><a href="${L('/contact/')}">${escapeHtml(copy.navigation.contact)}</a></div><small>© ${new Date().getFullYear()} ${escapeHtml(site.name)}</small></div></footer>`;
}

function page(options) {
  const script = options.mainScript === false ? '' : '<script type="module" src="/src/main.js"></script>';
  const language = options.language || 'es';
  const copy = options.copy;
  return `${head(options)}
<body>
<div id="app">
${options.chrome === false ? '' : header(options.path, language, copy)}
${options.body}
${options.chrome === false ? '' : footer(language, copy)}
</div>
${script}
</body>
</html>
`;
}

function projectFigure(project, loading, sizes = imageSizes.card, fetchPriority) {
  const label = project.gallery?.[0]?.label;
  const alt = label ? `${project.title} · ${label}` : project.title;
  return img(project.thumbnail, alt, project.width, project.height, loading, sizes, { fetchPriority });
}

function homeBody(language, copy, services) {
  const L = (href) => localizedHref(language, href);
  const lead = ['foody', 'casa-albirroja', 'indufar-2026', 'gio-mobili']
    .map((slug) => catalog(language).find((project) => project.slug === slug));
  const cards = lead.map((project, index) => `<a class="project-card" href="${L(project.href)}"><div class="project-art ${project.className}">${projectFigure(project, index === 0 ? 'eager' : 'lazy', imageSizes.card, index === 0 ? 'high' : undefined)}</div><div class="project-meta"><div><span class="eyebrow">${escapeHtml(project.label)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.note)}</p></div></div></a>`).join('');
  const serviceRows = services.map((service) => `<a href="${L('/services/')}#${service.id}"><span>${service.number}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.homeBody)}</p></a>`).join('');
  const expoLink = language === 'en' ? 'Exhibition booth design' : 'Diseño de stands';
  return `<main id="main-content">
<section class="hero container">
  <div class="hero-top"><div class="hero-identity"><span class="eyebrow status"><span class="status-dot"></span> ${escapeHtml(copy.home.role)}</span><span class="eyebrow hero-location">${escapeHtml(copy.home.location)}</span></div></div>
  <div class="hero-copy"><h1>${display(copy.home.hero)}</h1><p>${escapeHtml(copy.home.intro)}</p><div class="hero-actions"><a class="button button-light" href="${L('/work/')}">${escapeHtml(copy.home.exploreWorkButton)}</a><a class="text-link" href="${L('/expo/')}">${expoLink}</a>${language === 'en' ? '<a class="text-link" href="/en/white-label-design/">White-label design</a><a class="text-link" href="/en/trade-show-booth-design/">Trade show booth design</a>' : ''}<a class="text-link" href="${L('/contact/')}">${escapeHtml(copy.navigation.startProject)}</a></div></div>
</section>
<section class="section container" id="work"><div class="section-head"><div><div class="eyebrow">${escapeHtml(copy.home.work.kicker)}</div><h2>${display(copy.home.work.title)}</h2></div><a class="text-link" href="${L('/work/')}">${escapeHtml(copy.home.work.allWorkLink)}</a></div><div class="project-grid">${cards}</div><p class="editorial-note">${escapeHtml(copy.home.work.placeholderNote)}</p></section>
<section class="services-band"><div class="container"><div class="section-head"><div><div class="eyebrow">${escapeHtml(copy.home.services.kicker)}</div><h2>${display(copy.home.services.title)}</h2></div></div><div class="service-rows">${serviceRows}</div></div></section>
<section class="section container"><div class="eyebrow">${escapeHtml(copy.home.approach.kicker)}</div><h2>${display(copy.home.approach.title)}</h2><p>${escapeHtml(copy.home.approach.body)}</p><a class="text-link" href="${L('/about/')}">${escapeHtml(copy.home.approach.moreLink)}</a></section>
</main>`;
}

function workBody(language, copy) {
  const L = (href) => localizedHref(language, href);
  const cards = publishedProjects(language).map((project, index) => `<article><a href="${L(project.href)}"><p class="eyebrow">${escapeHtml(project.label)}</p><h2>${escapeHtml(project.title)}</h2>${projectFigure(project, index < 2 ? 'eager' : 'lazy', imageSizes.directory, index === 0 ? 'high' : undefined)}<p>${escapeHtml(project.note)}</p></a></article>`).join('');
  const heading = language === 'en' ? '3D booths and scenography' : 'Stands 3D y escenografía';
  return `<main id="main-content" class="work-directory container"><div class="directory-views"><h1>${heading}</h1></div><p class="editorial-note">${escapeHtml(copy.work.intro)}</p>${language === 'en' ? englishWorkLead() : ''}<div class="static-projects">${cards}</div><p class="portfolio-credit">${escapeHtml(portfolioCredit[language])}</p></main>`;
}

function servicesBody(language, copy, services) {
  const L = (href) => localizedHref(language, href);
  const ask = language === 'en' ? 'Inquire' : 'Consultar';
  const blocks = services.map((service) => {
    const more = language === 'en' && service.id === 'white-label' ? '<p><a href="/en/white-label-design/">White-label design for US and Canadian agencies</a></p>' : language === 'en' && service.id === 'spatial' ? '<p><a href="/en/trade-show-booth-design/">Trade show booth design for exhibit builders</a></p>' : '';
    return `<section id="${service.id}" class="service-detail"><span class="eyebrow">${service.number}</span><div><h2>${escapeHtml(service.title)}</h2><p>${escapeHtml(service.body)}</p><ul>${service.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>${more}</div><a href="${L('/contact/')}">${ask}</a></section>`;
  }).join('');
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><div class="eyebrow">${escapeHtml(copy.services.kicker)}</div><h1>${display(copy.services.title)}</h1><p>${escapeHtml(copy.services.intro)}</p></div>${blocks}<section class="monthly"><div class="eyebrow">${escapeHtml(copy.services.monthlyKicker)}</div><h2>${escapeHtml(copy.services.monthlyTitle)}</h2><p>${escapeHtml(copy.services.monthlyBody)}</p><a class="button button-dark" href="${L('/contact/')}">${escapeHtml(copy.services.monthlyButton)}</a></section><p class="editorial-note">${escapeHtml(copy.services.note)}</p></main>`;
}

function aboutBody(language, copy) {
  if (language === 'en') return englishAboutBody();
  const L = (href) => localizedHref(language, href);
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><div class="eyebrow">${escapeHtml(copy.about.kicker)}</div><h1>${display(copy.about.title)}</h1><p>${escapeHtml(copy.about.intro)}</p></div><div class="about-layout"><figure class="about-portrait">${img('/images/fabrizzio-x.webp', 'Fabrizzio Ruiz', 400, 400, 'eager')}<figcaption><a href="https://x.com/fabrizzioruiz_">@fabrizzioruiz_</a></figcaption></figure><div class="about-copy"><div class="eyebrow">${escapeHtml(copy.about.sectionKicker)}</div><h2>${display(copy.about.sectionTitle)}</h2><p>${escapeHtml(copy.about.paragraph1)}</p><p>${escapeHtml(copy.about.paragraph2)}</p><p>${escapeHtml(copy.about.paragraph3)}</p><a class="text-link" href="${L('/contact/')}">${escapeHtml(copy.about.contactLink)}</a></div></div></main>`;
}

function contactBody(language, copy) {
  const form = copy.contact.form;
  const fields = [
    [form.name, 'name', 'text'],
    [form.email, 'email', 'email'],
    [form.company, 'company', 'text'],
    [form.timeline, 'timeline', 'text'],
  ].map(([label, name, type]) => `<label>${escapeHtml(label)}<input name="${name}" type="${type}"></label>`).join('');
  const options = form.projectTypes.map((type) => `<option>${escapeHtml(type)}</option>`).join('');
  return `<main id="main-content" class="inner-page container contact-layout"><div class="page-intro"><div class="eyebrow">${escapeHtml(copy.contact.kicker)}</div><h1>${display(copy.contact.title)}</h1><p>${escapeHtml(copy.contact.intro)}</p><p><a href="mailto:${site.email}">${site.email}</a></p><p><a href="https://wa.me/${expoContact.whatsapp}">WhatsApp</a></p></div><form class="contact-form" action="mailto:${site.email}" method="post" enctype="text/plain">${fields}<label>${escapeHtml(form.projectType)}<select name="projectType">${options}</select></label><label class="full">${escapeHtml(form.message)}<textarea name="message" rows="5"></textarea></label><button class="button button-light" type="submit">${escapeHtml(form.submit)}</button></form></main>`;
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

const labEnglishSummaries = ['Browser archery game.', 'Horde arena with factions, recruitment and battles.', 'An augmented-reality farming game.', 'Interactive exhibition stand viewer with augmented reality.', 'A product display to explore in 3D and AR.', 'An interactive brand experience.', 'A rogue-AI simulator inspired by Plague Inc.', 'A 3D and AR visualization project.', 'A website concept for exploration and feedback.'];

function labBody(language) {
  const L = (href) => localizedHref(language, href);
  const text = language === 'en'
    ? { title: 'Games, AR and experiments', intro: 'Projects I am developing and exploring.', wip: 'In progress', open: 'Open project' }
    : { title: 'Juegos, AR y experimentos', intro: 'Proyectos que estoy desarrollando y explorando.', wip: 'En proceso', open: 'Abrir proyecto' };
  const cards = labEntries.map(([title, summary, url, wip], index) => {
    const body = language === 'en' ? labEnglishSummaries[index] : summary;
    const href = url.startsWith('/') ? L(url) : url;
    return `<article class="lab-entry"><h2>${escapeHtml(title)}</h2>${wip ? `<p class="lab-status">${text.wip}</p>` : ''}<p>${escapeHtml(body)}</p><a class="text-link" href="${href}">${text.open}</a></article>`;
  }).join('');
  return `<main id="main-content" class="lab-projects container"><header><h1>Lab</h1><h2>${text.title}</h2><p>${text.intro}</p></header><div class="lab-entry-grid">${cards}</div></main>`;
}

function projectBody(project, language) {
  const L = (href) => localizedHref(language, href);
  const backLabel = language === 'en' ? '← Back to projects' : '← Volver a proyectos';
  const back = `<a class="case-back text-link" href="${L('/work/')}">${backLabel}</a>`;
  const intro = `<header class="case-intro"><div class="eyebrow">${escapeHtml(project.label)}</div><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.note || project.overview || '')}</p></header>`;
  if (project.gallery) {
    return `<main id="main-content" class="case-page container">${back}${intro}${caseGallery(project, language)}</main>`;
  }
  const figure = project.thumbnail ? `<figure class="case-image">${img(project.thumbnail, `${project.title} · ${project.label}`, project.width, project.height, 'eager', imageSizes.case, { fetchPriority: 'high' })}<figcaption>${escapeHtml(project.source || '')}</figcaption></figure>` : '';
  const deliverables = (project.deliverables || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const external = project.externalUrl ? `<p><a class="text-link" href="${project.externalUrl}">${language === 'en' ? 'View the project' : 'Ver el proyecto'}</a></p>` : '';
  const source = project.slug === 'client-logos' ? '' : `<section><div class="eyebrow">Project source</div><p>${escapeHtml(project.source || '')}</p>${external}</section>`;
  const externalOnly = project.slug === 'client-logos' && external ? external : '';
  return `<main id="main-content" class="case-page container">${back}${intro}${figure}<div class="case-details"><section><div class="eyebrow">Overview</div><p>${escapeHtml(project.overview || '')}</p></section><section><div class="eyebrow">Deliverables</div><ul>${deliverables}</ul></section>${source}</div>${externalOnly}</main>`;
}

function projectMeta(project, language, copy) {
  const expanded = language === 'en' ? englishCases[project.slug] : null;
  if (expanded) {
    return {
      title: expanded.title,
      description: expanded.description,
      path: expanded.path,
      language,
      copy,
      englishOnly: false,
      image: expanded.image,
      imageAlt: expanded.name,
      width: 1280,
      height: 720,
      jsonLd: [caseCreativeWork(expanded)],
      body: englishCaseBody(project.slug),
    };
  }
  const image = rootSrc(project.thumbnail);
  const fallback = pageMeta[language]['/about/'];
  const path = localizedHref(language, project.href);
  return {
    title: projectTitle(project),
    description: projectDescription(project),
    path,
    language,
    copy,
    image: image || fallback.image,
    imageAlt: image ? project.title : fallback.imageAlt,
    width: project.width || fallback.width,
    height: project.height || fallback.height,
    robots: isHiddenProject(project) ? 'noindex, nofollow' : undefined,
    jsonLd: [creativeWorkJsonLd({ ...project, thumbnail: image, href: project.href }, language)],
    body: projectBody(project, language),
  };
}

function bundle(language) {
  const copy = language === 'en' ? englishCopy : es;
  const services = language === 'en' ? englishServices : esServices;
  return { language, copy, services };
}

function fileFor(language, rel) {
  if (language === 'es') return rel;
  return rel === 'index.html' ? 'en/index.html' : `en/${rel}`;
}

function documentsFor(language) {
  const { copy, services } = bundle(language);
  const home = pageMeta[language]['/'];
  const work = pageMeta[language]['/work/'];
  const about = pageMeta[language]['/about/'];
  const servicesMeta = pageMeta[language]['/services/'];
  const contact = pageMeta[language]['/contact/'];
  const labMeta = pageMeta[language]['/lab/'];
  const path = (spanishPath) => localizedHref(language, spanishPath);
  const documents = {
    [fileFor(language, 'index.html')]: page({
      ...home,
      path: path('/'),
      language,
      copy,
      jsonLd: [personJsonLd(language), professionalServiceJsonLd(language)],
      body: homeBody(language, copy, services),
      extra: language === 'es' ? '<meta name="google-site-verification" content="zrtx-DcAXxQzMSbEo11-o8NEvm68nno9El3y8ZNUnqU">' : '',
    }),
    [fileFor(language, 'work/index.html')]: page({ ...work, path: path('/work/'), language, copy, jsonLd: professionalServiceJsonLd(language), body: workBody(language, copy) }),
    [fileFor(language, 'about/index.html')]: page({ ...about, path: path('/about/'), language, copy, jsonLd: personJsonLd(language), body: aboutBody(language, copy) }),
    [fileFor(language, 'services/index.html')]: page({ ...servicesMeta, path: path('/services/'), language, copy, jsonLd: professionalServiceJsonLd(language), body: servicesBody(language, copy, services) }),
    [fileFor(language, 'contact/index.html')]: page({ ...contact, path: path('/contact/'), language, copy, jsonLd: personJsonLd(language), body: contactBody(language, copy) }),
    [fileFor(language, 'lab/index.html')]: page({ ...labMeta, path: path('/lab/'), language, copy, body: labBody(language) }),
  };
  if (language === 'en') {
    const offerImage = { image: '/images/selected/foody/foto-5.webp', imageAlt: 'Foody booth at the exhibition', width: 1280, height: 720 };
    documents['en/white-label-design/index.html'] = page({
      ...offerImage,
      title: whiteLabelPage.title,
      description: whiteLabelPage.description,
      path: whiteLabelPage.path,
      language: 'en',
      copy,
      englishOnly: true,
      jsonLd: [
        marketServiceJsonLd({ name: 'White-label design for US and Canadian agencies', serviceType: 'White-label graphic and exhibit design', path: whiteLabelPage.path }),
        faqJsonLd(whiteLabelPage.path, whiteLabelPage.faqs),
      ],
      body: whiteLabelBody(),
    });
    documents['en/trade-show-booth-design/index.html'] = page({
      ...offerImage,
      title: tradeShowPage.title,
      description: tradeShowPage.description,
      path: tradeShowPage.path,
      language: 'en',
      copy,
      englishOnly: true,
      jsonLd: [
        marketServiceJsonLd({ name: 'Trade show booth design', serviceType: 'Freelance trade show booth design', path: tradeShowPage.path }),
        faqJsonLd(tradeShowPage.path, tradeShowPage.faqs),
      ],
      body: tradeShowBody(),
    });
    for (const slug of ['el-delta', 'indufar-run']) {
      const study = englishCases[slug];
      documents[`en/work/${slug}/index.html`] = page({
        title: study.title,
        description: study.description,
        path: study.path,
        language: 'en',
        copy,
        englishOnly: true,
        image: study.image,
        imageAlt: study.name,
        width: 1280,
        height: 720,
        jsonLd: [caseCreativeWork(study)],
        body: englishCaseBody(slug),
      });
    }
  }
  for (const project of orderedProjects(language)) {
    documents[fileFor(language, `work/${project.slug}/index.html`)] = page(projectMeta(project, language, copy));
  }
  return documents;
}

export function staticDocuments() {
  const documents = { ...documentsFor('es'), ...documentsFor('en') };
  const home = pageMeta.es['/'];
  const work = pageMeta.es['/work/'];
  const copy = es;
  documents['404.html'] = page({
    title: 'Página no encontrada · Fabrizzio Ruiz',
    description: 'Esta dirección no corresponde a una página de fabrizzioruiz.com.',
    path: '/',
    language: 'es',
    copy,
    canonical: false,
    alternates: false,
    robots: 'noindex',
    image: home.image,
    imageAlt: home.imageAlt,
    width: home.width,
    height: home.height,
    mainScript: false,
    body: `<main id="main-content" class="inner-page container not-found"><div class="eyebrow">404</div><h1>Esta página no existe</h1><p>La dirección no corresponde a una página de este sitio.</p><p><a href="/">Inicio</a> · <a href="/work/">Proyectos</a> · <a href="/expo/">Stands</a> · <a href="/services/">Servicios</a> · <a href="/contact/">Contacto</a></p></main>`,
  });
  const published = publishedProjects('es');
  const indexLinks = published.map((project) => `<li><a href="${project.href}">${escapeHtml(project.title)}</a> — ${escapeHtml(project.note || '')}</li>`).join('');
  documents['projects/index.html'] = page({
    title: 'Proyectos · Fabrizzio Ruiz',
    description: 'Los proyectos están en direcciones propias dentro de /work/.',
    path: '/work/',
    language: 'es',
    copy,
    alternates: false,
    robots: 'noindex, follow',
    image: work.image,
    imageAlt: work.imageAlt,
    width: work.width,
    height: work.height,
    extra: `<script>var known=${JSON.stringify(published.map((project) => project.slug))};var slug=new URLSearchParams(location.search).get("project");if(slug&&known.indexOf(slug)!==-1)location.replace("/work/"+slug+"/"+location.hash);else location.replace("/work/"+location.hash);</script>`,
    body: `<main id="main-content" class="inner-page container"><h1>Proyectos</h1><p>Cada proyecto tiene su propia página. Si esta no se abre sola, elegí uno:</p><ul>${indexLinks}</ul></main>`,
  });
  Object.assign(documents, legacyRedirects(published));
  return documents;
}

function legacyRedirects(projects) {
  const shell = (title, target) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${ORIGIN}${target}">
<meta http-equiv="refresh" content="0;url=${target}">
<script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script>
</head>
<body><p><a href="${target}">Continuar</a></p></body>
</html>
`;
  const slugs = JSON.stringify(projects.map((project) => project.slug));
  const caseStudy = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Proyectos · Fabrizzio Ruiz</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${ORIGIN}/work/">
<meta http-equiv="refresh" content="0;url=/work/">
<script>(function(){var known=${slugs};var slug=new URLSearchParams(location.search).get("project");var target=(slug&&known.indexOf(slug)!==-1)?"/work/"+slug+"/":"/work/";location.replace(target+location.hash);})();</script>
</head>
<body><p><a href="/work/">Continuar</a></p></body>
</html>
`;
  return {
    'work.html': shell('Proyectos · Fabrizzio Ruiz', '/work/'),
    'about.html': shell('Sobre mí · Fabrizzio Ruiz', '/about/'),
    'services.html': shell('Servicios · Fabrizzio Ruiz', '/services/'),
    'contact.html': shell('Contacto · Fabrizzio Ruiz', '/contact/'),
    'lab.html': shell('Lab · Fabrizzio Ruiz', '/lab/'),
    'case-study.html': caseStudy,
  };
}

const SITEMAP_PATHS = ['/', '/work/', '/services/', '/about/', '/contact/', '/lab/', '/lab/foody-ar-game/', '/expo/', '/expo/gestecner/', '/connect/', '/superflyer/'];
const ENGLISH_ONLY_URLS = ['/en/white-label-design/', '/en/trade-show-booth-design/', '/en/work/el-delta/', '/en/work/indufar-run/'];

function lastmodFor(path) {
  if (sitemapLastmod[path]) return sitemapLastmod[path];
  const spanish = spanishPathFromSitemap(path);
  if (spanish && sitemapLastmod[spanish]) return '2026-11-23';
  throw new Error(`Missing sitemap lastmod for ${path}`);
}

function spanishPathFromSitemap(path) {
  if (path === '/en/') return '/';
  if (path.startsWith('/en/')) return path.slice(3);
  return '';
}

export function sitemapXml() {
  const spanish = [...SITEMAP_PATHS, ...publishedProjects('es').map((project) => project.href)];
  const english = spanish
    .filter((path) => path !== '/lab/foody-ar-game/' && path !== '/superflyer/')
    .map((path) => (path === '/' ? '/en/' : `/en${path}`));
  const unique = [...new Set([...spanish, ...english, ...ENGLISH_ONLY_URLS])];
  const urls = unique.map((path) => {
    const loc = `${ORIGIN}${path}`;
    const englishOnly = ENGLISH_ONLY_URLS.includes(path);
    const alternate = englishOnly
      ? null
      : path.startsWith('/en/') || path === '/en/'
        ? { es: spanishPathFromSitemap(path), en: path }
        : (path === '/lab/foody-ar-game/' || path === '/superflyer/' ? null : { es: path, en: path === '/' ? '/en/' : `/en${path}` });
    const links = englishOnly
      ? `\n    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`
      : alternate
        ? `\n    <xhtml:link rel="alternate" hreflang="es" href="${ORIGIN}${alternate.es}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${alternate.en}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${alternate.es}"/>`
        : '';
    return `  <url><loc>${loc}</loc><lastmod>${lastmodFor(path)}</lastmod>${links}</url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

export function llmsText() {
  const projects = publishedProjects('en').map((project) => {
    const expanded = englishCases[project.slug];
    const description = expanded ? expanded.description : (project.note || project.overview || '');
    return `- [${expanded ? expanded.name : project.title}](${ORIGIN}${localizedHref('en', project.href)}): ${description}`;
  }).join('\n');
  const leadStudies = ['el-delta', 'indufar-run'].map((slug) => `- [${englishCases[slug].name}](${ORIGIN}${englishCases[slug].path}): ${englishCases[slug].description}`).join('\n');
  return `# Fabrizzio Ruiz

> ${ENTITY_STATEMENT}

Spanish pages are published at the unprefixed URLs. The same pages are also published in English under /en/. There is no separate Portuguese URL.

## Contact

- Site: ${ORIGIN}/
- English home: ${ORIGIN}/en/
- Email: ${site.email}
- WhatsApp: https://wa.me/${expoContact.whatsapp}
- X: https://x.com/fabrizzioruiz_

## Location

The website, contact card and about page say Asunción, Paraguay. Do not replace that with another city.

## Pages

- [Home](${ORIGIN}/) and [English home](${ORIGIN}/en/): 3D trade-show booths, scenography, environmental graphics, branding, packaging and white-label design.
- [Work](${ORIGIN}/work/) and [English work](${ORIGIN}/en/work/): selected projects, each at its own URL.
- [Services](${ORIGIN}/services/) and [English services](${ORIGIN}/en/services/): stands and scenography, white-label for agencies, brand and campaigns, web and digital.
- [White-label design](${ORIGIN}/en/white-label-design/): white-label graphic and exhibit design for US and Canadian agencies.
- [Trade show booth design](${ORIGIN}/en/trade-show-booth-design/): freelance booth design for exhibit builders, with 3D concepts and production-ready files.
- [About](${ORIGIN}/about/) and [English about](${ORIGIN}/en/about/): ${ENTITY_STATEMENT}
- [Contact](${ORIGIN}/contact/) and [English contact](${ORIGIN}/en/contact/): email and WhatsApp.
- [Expo booths](${ORIGIN}/expo/) and [English expo booths](${ORIGIN}/en/expo/): stand design page with selected booths and an FAQ.
- [Gestecner viewer](${ORIGIN}/expo/gestecner/) and [English Gestecner viewer](${ORIGIN}/en/expo/gestecner/): 3D / AR viewer for the Gestecner stand concept.
- [Lab](${ORIGIN}/lab/) and [English lab](${ORIGIN}/en/lab/): games, AR and experiments, including Foody AR Farm.
- [Connect](${ORIGIN}/connect/) and [English connect](${ORIGIN}/en/connect/): contact card.

## Projects

${leadStudies}
${projects}
`;
}
