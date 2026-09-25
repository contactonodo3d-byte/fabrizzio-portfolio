import { site, copy as englishCopy, projects as englishProjects, heroCovers as englishCovers, services as englishServices, labEntries } from './content.js';
import { locales } from './translations.js';

const chosenLanguage = localStorage.getItem('fabrizzio-language');
const language = ['en', 'es', 'pt'].includes(chosenLanguage) ? chosenLanguage : 'en';
document.documentElement.lang = language;
const translated = locales[language] || {};
function merge(base, override) {
  if (!override) return base;
  if (Array.isArray(base)) return base.map((item, index) => merge(item, override[index]));
  if (base && typeof base === 'object') return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, merge(value, override[key])]));
  return override ?? base;
}
const copy = merge(englishCopy, translated.copy);
const projects = merge(englishProjects, translated.projects);
const heroCovers = merge(englishCovers, translated.heroCovers);
const serviceOptions = merge(englishServices, translated.services);
const englishUi = { select: 'Select', coverInstructions: 'Project covers. Use the arrow keys, mouse wheel, or drag to browse.', portfolioSlot: 'PORTFOLIO SLOT', illustrative: 'Illustrative composition for a future', service: 'SERVICE', inquire: 'Inquire about', notFound: 'PAGE NOT FOUND', notFoundTitle: 'Nothing here<br/><em>yet.</em>', backHome: 'Back home ↗', emailSetup: 'The contact address has not been configured yet. Please add it in src/content.js before launch.', emailPrepared: 'Your email app should open with a prepared message. Please send it there to complete your inquiry.', contactPage: 'Go to contact page', previousCover: 'Previous cover', nextCover: 'Next cover', openMenu: 'Open menu', closeMenu: 'Close menu' };
const ui = { ...englishUi, ...translated.ui };

const app = document.querySelector('#app');
const route = '/' + (location.pathname.split('/').pop() || '');
const isPlaceholderEmail = site.email === 'hello@example.com';

function playlistDetails() {
  try {
    const url = new URL(site.playlistUrl);
    const match = url.protocol === 'https:' && url.hostname === 'open.spotify.com'
      ? url.pathname.match(/^\/(?:embed\/)?playlist\/([\w]+)\/?$/)
      : null;
    if (!match) return null;
    const external = new URL(`https://open.spotify.com/playlist/${match[1]}`);
    return { url: external.href, embed: url.href };
  } catch { return null; }
}

const icon = (name) => ({ arrow: '↗', right: '→', plus: '+' })[name];
const display = ({ line1, line2 = '', accent = '' }) => `${line1}<br/>${line2}${accent ? `<em>${accent}</em>` : ''}`;
const languageSwitch = () => `<div class="language-switch" role="group" aria-label="Language / Idioma / Idioma">${['en', 'es', 'pt'].map((code) => `<button type="button" data-language="${code}" aria-pressed="${language === code}" lang="${code}">${code.toUpperCase()}</button>`).join('')}</div>`;

function header() {
  return `<header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="./" aria-label="Fabrizzio Ruiz home">FABRIZZIO<span class="wordmark-dot">.</span></a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="./work.html" ${route === '/work.html' ? 'aria-current="page"' : ''}>${copy.navigation.work}</a>
      <a href="./services.html" ${route === '/services.html' ? 'aria-current="page"' : ''}>${copy.navigation.services}</a>
      <a href="./lab.html" ${route === '/lab.html' ? 'aria-current="page"' : ''}>${copy.navigation.lab}</a>
      <a href="./about.html" ${route === '/about.html' ? 'aria-current="page"' : ''}>${copy.navigation.about}</a>
    </nav>
    ${languageSwitch()}
    <a class="header-cta" href="./contact.html">${copy.navigation.startProject} <span>${icon('arrow')}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="${ui.openMenu}"><span></span><span></span></button>
  </div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden>
    <a href="./work.html">${copy.navigation.work}</a><a href="./services.html">${copy.navigation.services}</a><a href="./lab.html">${copy.navigation.lab}</a><a href="./contact.html">${copy.navigation.startProject}</a>${languageSwitch()}
  </nav></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container footer-top"><div><div class="eyebrow">${copy.footer.kicker}</div><h2>${display(copy.footer.title)}</h2></div><a class="round-arrow" href="./contact.html" aria-label="${ui.contactPage}">${icon('arrow')}</a></div>
  <div class="container footer-bottom"><a class="wordmark" href="./">FABRIZZIO<span class="wordmark-dot">.</span></a><p>${copy.footer.descriptor}<br/>${site.location} · ${copy.footer.worldwide}</p><div class="footer-links"><a href="./work.html">${copy.navigation.work}</a><a href="./services.html">${copy.navigation.services}</a><a href="./lab.html">${copy.navigation.lab}</a><a href="./about.html">${copy.navigation.about}</a><a href="./contact.html">${copy.navigation.contact}</a></div><small>© ${new Date().getFullYear()} ${site.name}</small></div></footer>`;
}

function projectCard(project, large = false) {
  return `<article class="project-card ${large ? 'project-card-large' : ''}"><div class="project-art ${project.className}" role="img" aria-label="${ui.illustrative} ${project.label.toLowerCase()}"><div class="art-frame"><span class="art-overline">${project.id} / ${project.label.toUpperCase()}</span><strong>${project.title}</strong><span class="art-mark">FR<span>®</span></span></div></div><div class="project-meta"><div><span class="eyebrow">${project.label}</span><h3>${project.title}</h3><p>${project.note}</p></div><span class="project-icon" aria-hidden="true">${icon('arrow')}</span></div></article>`;
}

function sectionIntro(kicker, title, action = '') { return `<div class="section-head"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2></div>${action}</div>`; }

function heroAlbum() {
  if (!heroCovers.length) return '';
  return `<section class="hero-album" aria-label="Interactive project album">
    <div class="album-top"><span class="eyebrow">${copy.home.album.kicker}</span><span class="album-top-mark" aria-hidden="true">✳</span></div>
    <div class="album-stage" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${ui.coverInstructions}">
      ${heroCovers.map((cover, index) => `<button class="album-card" type="button" data-cover-index="${index}" aria-label="${ui.select} ${cover.title}" aria-pressed="false"><span class="album-cover ${cover.theme}">${cover.thumbnail ? `<img src="${cover.thumbnail}" alt="" loading="lazy" />` : `<span class="album-cover-design" aria-hidden="true"><span class="album-cover-number">FR / ${cover.id}</span><span class="album-cover-title">${cover.title}</span><span class="album-cover-orbit"></span><span class="album-cover-foot">${ui.portfolioSlot} · ${cover.id}</span></span>`}</span></button>`).join('')}
    </div>
    <div class="album-bottom"><div class="album-readout" aria-live="polite"><span class="album-count" data-album-count>01 / 06</span><span class="album-current" data-album-title>${heroCovers[0].title}</span><span class="album-category" data-album-category>${heroCovers[0].category}</span></div><div class="album-controls"><button type="button" data-album-prev aria-label="${ui.previousCover}">↑</button><button type="button" data-album-next aria-label="${ui.nextCover}">↓</button></div></div>
    <div class="album-foot"><a href="${heroCovers[0].href}" data-album-link>${copy.home.album.projectLink} <span>↗</span></a><button type="button" data-album-pause aria-pressed="false">${copy.home.album.pause}</button></div>
  </section>`;
}

function playlistWidget() {
  const playlist = playlistDetails();
  if (!playlist) return '';
  return `<section class="playlist-widget" id="playlist" aria-labelledby="playlist-title">
    <h2 class="visually-hidden" id="playlist-title">${copy.home.playlist.title}</h2>
    <iframe title="${site.name} playlist on Spotify" src="${playlist.embed}" width="100%" height="152" style="border-radius:12px" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  </section>`;
}

function home() {
  return `<main>
    <section class="hero container"><div class="hero-top"><div class="hero-identity"><span class="eyebrow status"><span class="status-dot"></span> ${copy.home.role}</span><span class="eyebrow hero-location">${copy.home.location}</span></div></div>
      <div class="hero-main"><div class="hero-copy"><h1>${display(copy.home.hero)}</h1>
      <div class="hero-bottom"><p>${copy.home.intro}</p><div class="hero-actions"><a class="button button-light" href="./work.html">${copy.home.exploreWorkButton} <span>${icon('arrow')}</span></a><a class="text-link" href="./contact.html">${copy.navigation.startProject} <span>${icon('arrow')}</span></a></div></div>
      </div><div class="hero-visual">${playlistWidget()}${heroAlbum()}</div></div>
      <div class="hero-showcase" aria-label="Abstract visual design collage"><div class="showcase-grid"><div class="showcase-tile showcase-one"><span>${copy.home.showcase.bigWords.join('<br/>')}<span class="tiny-star">✳</span></span></div><div class="showcase-tile showcase-two"><span class="outline-circle"></span><span class="showcase-label">${copy.home.showcase.middleLabel}</span></div><div class="showcase-tile showcase-three"><span>F/<br/>R.</span><span class="showcase-label">${copy.home.showcase.rightLabel}</span></div></div><span class="showcase-caption">${copy.home.showcase.caption} <span>↘</span></span></div>
    </section>
    <section class="section container" id="work">${sectionIntro(copy.home.work.kicker, display(copy.home.work.title), '<a class="text-link" href="./work.html">${copy.home.work.allWorkLink} <span>↗</span></a>')}<div class="project-grid">${projects.map((p, i) => projectCard(p, i === 0)).join('')}</div><p class="editorial-note">${copy.home.work.placeholderNote}</p></section>
    <section class="services-band"><div class="container">${sectionIntro(copy.home.services.kicker, display(copy.home.services.title))}<div class="service-rows">${serviceOptions.map(({ id, number, title, homeBody }) => `<a href="./services.html#${id}"><span>${number}</span><h3>${title}</h3><p>${homeBody}</p><b>↗</b></a>`).join('')}</div></div></section>
    <section class="section container perspective"><div><div class="eyebrow">${copy.home.approach.kicker}</div><h2>${display(copy.home.approach.title)}</h2></div><div><p>${copy.home.approach.body}</p><a class="text-link" href="./about.html">${copy.home.approach.moreLink} <span>↗</span></a></div></section>
    <section class="lab-teaser container"><div class="lab-number">FR—LAB / 001</div><div><div class="eyebrow">${copy.home.lab.kicker}</div><h2>${display(copy.home.lab.title)}</h2><p>${copy.home.lab.body}</p><a class="lab-teaser-link" href="./lab.html">${copy.home.lab.link} <span>↗</span></a></div><div class="lab-shape" aria-hidden="true">✳</div></section>
  </main>`;
}

function work() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">${copy.work.kicker}</div><h1>${display(copy.work.title)}</h1><p>${copy.work.intro}</p></div><div class="project-grid work-grid">${projects.map((p, i) => projectCard(p, i === 0)).join('')}</div><div class="work-guidance"><div class="eyebrow">${copy.work.guidanceTitle}</div><p>${copy.work.guidanceBody}</p></div></main>`; }

function services() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">${copy.services.kicker}</div><h1>${display(copy.services.title)}</h1><p>${copy.services.intro}</p></div><div class="services-list">${serviceOptions.map(({ id, number, title, body, items }) => `<section id="${id}" class="service-detail"><span class="eyebrow">${number} / ${ui.service}</span><div><h2>${title}</h2><p>${body}</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div><a class="round-arrow small" href="./contact.html" aria-label="${ui.inquire} ${title}">↗</a></section>`).join('')}</div><section class="monthly"><div class="eyebrow">${copy.services.monthlyKicker}</div><div><h2>${copy.services.monthlyTitle}</h2><p>${copy.services.monthlyBody}</p></div><a class="button button-dark" href="./contact.html">${copy.services.monthlyButton} <span>↗</span></a></section><p class="editorial-note">${copy.services.note}</p></main>`; }

function about() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">${copy.about.kicker}</div><h1>${display(copy.about.title)}</h1><p>${copy.about.intro}</p></div><div class="about-layout"><div class="portrait-placeholder" role="img" aria-label="Portrait placeholder"><span>FR.</span><small>${copy.about.portraitPlaceholder}</small></div><div class="about-copy"><div class="eyebrow">${copy.about.sectionKicker}</div><h2>${display(copy.about.sectionTitle)}</h2><p>${copy.about.paragraph1}</p><p>${copy.about.paragraph2}</p><a class="text-link" href="./contact.html">${copy.about.contactLink} <span>↗</span></a></div></div></main>`; }

function lab() {
  const entries = labEntries.length
    ? `<div class="lab-entry-grid">${labEntries.map(({ category, title, summary, date, url }) => `<a class="lab-entry" href="${url}"><span class="eyebrow">${category} · ${date}</span><h3>${title}</h3><p>${summary}</p><span class="lab-entry-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`
    : `<div class="lab-empty"><span class="lab-empty-mark" aria-hidden="true">✳</span><div><div class="eyebrow">${copy.lab.emptyKicker}</div><h3>${copy.lab.emptyTitle}</h3><p>${copy.lab.emptyBody}</p></div></div>`;

  return `<main class="lab-page">
    <section class="container lab-hero"><div class="eyebrow">${copy.lab.kicker}</div><h1>${display(copy.lab.title)}</h1><div class="lab-hero-bottom"><p>${copy.lab.intro}</p><span class="lab-asterisk" aria-hidden="true">✳</span></div></section>
    <section class="lab-categories"><div class="container"><div class="eyebrow">${copy.lab.categoriesKicker}</div><div class="lab-category-grid">${copy.lab.categories.map(({ number, title, body }) => `<article><span>${number}</span><h2>${title}</h2><p>${body}</p></article>`).join('')}</div></div></section>
    <section class="container lab-listing">${sectionIntro(copy.lab.latestKicker, display(copy.lab.latestTitle))}${entries}</section>
    <section class="container lab-now"><div class="eyebrow">${copy.lab.exploringKicker}</div><div class="lab-now-items">${copy.lab.exploring.map((topic) => `<span>${topic}</span>`).join('')}</div><p>${copy.lab.exploringNote}</p></section>
  </main>`;
}

function contact() {
  const form = copy.contact.form;
  return `<main class="inner-page container contact-layout">
    <div class="page-intro">
      <div class="eyebrow">${copy.contact.kicker}</div>
      <h1>${display(copy.contact.title)}</h1>
      <p>${copy.contact.intro}</p>
      <div class="contact-direct"><span class="eyebrow">${copy.contact.emailLabel}</span><span>${isPlaceholderEmail ? copy.contact.emailMissing : `<a href="mailto:${site.email}">${site.email}</a>`}</span></div>
    </div>
    <form class="contact-form" id="contact-form">
      <label>${form.name}<input name="name" type="text" autocomplete="name" required placeholder="${form.namePlaceholder}" /></label>
      <label>${form.email}<input name="email" type="email" autocomplete="email" required placeholder="${form.emailPlaceholder}" /></label>
      <label>${form.company}<input name="company" type="text" autocomplete="organization" placeholder="${form.optional}" /></label>
      <label>${form.projectType}<select name="projectType" required><option value="" disabled selected>${form.projectTypePlaceholder}</option>${form.projectTypes.map((type) => `<option>${type}</option>`).join('')}</select></label>
      <label>${form.budget}<select name="budget"><option value="" disabled selected>${form.budgetPlaceholder}</option>${form.budgetRanges.map((range) => `<option>${range}</option>`).join('')}</select></label>
      <label>${form.timeline}<input name="timeline" type="text" placeholder="${form.timelinePlaceholder}" /></label>
      <label class="full">${form.message}<textarea name="message" rows="5" required placeholder="${form.messagePlaceholder}"></textarea></label>
      <button class="button button-light" type="submit">${form.submit} <span>↗</span></button>
      <p class="form-message" id="form-message" role="status"></p>
    </form>
  </main>`;
}

const pages = { '/': home, '/index.html': home, '/work.html': work, '/services.html': services, '/lab.html': lab, '/about.html': about, '/contact.html': contact };
const render = pages[route] || (() => `<main class="inner-page container not-found"><div class="eyebrow">404 / ${ui.notFound}</div><h1>${ui.notFoundTitle}</h1><a class="button button-light" href="./">${ui.backHome}</a></main>`);
app.innerHTML = header() + render() + footer();

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? ui.closeMenu : ui.openMenu);
  mobileNav.hidden = !open;
});

document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => {
  localStorage.setItem('fabrizzio-language', button.dataset.language);
  location.reload();
}));

function setupHeroAlbum() {
  const album = document.querySelector('.hero-album');
  if (!album) return;

  const stage = album.querySelector('.album-stage');
  const cards = [...album.querySelectorAll('.album-card')];
  const count = cards.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const positions = {
    0: { y: 0, scale: 1, z: 10, opacity: 1 },
    1: { y: -55, scale: .94, z: 9, opacity: 1 },
    2: { y: -106, scale: .88, z: 8, opacity: 1 },
    3: { y: -150, scale: .82, z: 7, opacity: 1 },
    '-1': { y: 310, scale: 1.04, z: 11, opacity: 1 },
    '-2': { y: 490, scale: 1.08, z: 6, opacity: 0 },
  };

  let active = 0;
  let hovering = false;
  let focused = false;
  let visible = true;
  let manualPause = reducedMotion;
  let pauseUntil = 0;
  let wheelDelta = 0;
  let lastWheel = 0;
  let pointerStart = null;
  let suppressClick = false;
  let releaseTimer = null;

  function setDragOffset(pixels) {
    const limited = Math.max(-220, Math.min(220, pixels));
    cards.forEach((card) => card.style.setProperty('--album-drag', `${limited}px`));
  }

  function settleDrag(change) {
    stage.classList.remove('is-dragging');
    album.classList.remove('is-dragging');
    album.classList.add('is-releasing');
    pauseUntil = Date.now() + 4000;

    // Establish the last dragged position with transitions enabled before
    // moving to the next cover. Otherwise the browser coalesces both states
    // and the release appears to snap.
    void stage.offsetWidth;
    requestAnimationFrame(() => {
      if (change) step(change);
      setDragOffset(0);
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => album.classList.remove('is-releasing'), reducedMotion ? 0 : 760);
    });
  }

  function render() {
    cards.forEach((card, index) => {
      let distance = (index - active + count) % count;
      if (distance > Math.floor(count / 2)) distance -= count;
      const position = positions[distance] || { y: 490, scale: .8, z: 1, opacity: 0 };
      const previous = Number(card.dataset.distance);
      const wrapping = card.dataset.distance !== undefined && Math.abs(previous - distance) > 3;
      if (wrapping) card.classList.add('is-wrapping');
      card.style.setProperty('--album-y', `${position.y}px`);
      card.style.setProperty('--album-scale', position.scale);
      card.style.setProperty('--album-opacity', wrapping ? 0 : position.opacity);
      card.style.zIndex = position.z;
      card.dataset.distance = distance;
      card.classList.toggle('is-active', distance === 0);
      card.setAttribute('aria-pressed', String(distance === 0));
      if (wrapping) requestAnimationFrame(() => requestAnimationFrame(() => {
        card.classList.remove('is-wrapping');
        card.style.setProperty('--album-opacity', position.opacity);
      }));
    });

    const cover = heroCovers[active];
    album.querySelector('[data-album-count]').textContent = `${String(active + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    album.querySelector('[data-album-title]').textContent = cover.title;
    album.querySelector('[data-album-category]').textContent = cover.category;
    album.querySelector('[data-album-link]').href = cover.href;
  }

  function select(index) {
    active = (index + count) % count;
    pauseUntil = Date.now() + 4000;
    render();
  }

  function step(direction) { select(active + direction); }
  function tick() {
    if (manualPause || hovering || focused || pointerStart || !visible || document.hidden || Date.now() < pauseUntil) return;
    active = (active + 1) % count;
    render();
  }

  album.addEventListener('mouseenter', () => { hovering = true; album.classList.add('is-hovered'); });
  album.addEventListener('mouseleave', () => { hovering = false; album.classList.remove('is-hovered'); });
  album.addEventListener('focusin', () => { focused = true; album.classList.add('is-hovered'); });
  album.addEventListener('focusout', (event) => {
    if (album.contains(event.relatedTarget)) return;
    focused = false;
    album.classList.remove('is-hovered');
  });

  cards.forEach((card, index) => card.addEventListener('click', (event) => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); return; }
    select(index);
  }));
  album.querySelector('[data-album-prev]').addEventListener('click', () => step(-1));
  album.querySelector('[data-album-next]').addEventListener('click', () => step(1));
  album.querySelector('[data-album-pause]').addEventListener('click', (event) => {
    manualPause = !manualPause;
    event.currentTarget.setAttribute('aria-pressed', String(manualPause));
    event.currentTarget.textContent = manualPause ? copy.home.album.play : copy.home.album.pause;
  });

  album.addEventListener('wheel', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - lastWheel > 220) wheelDelta = 0;
    lastWheel = now;
    const rawDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    const delta = rawDelta * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? 300 : 1);
    wheelDelta += delta;
    const threshold = 70;
    if (Math.abs(wheelDelta) < threshold) return;
    const direction = Math.sign(wheelDelta);
    const steps = Math.min(3, Math.floor(Math.abs(wheelDelta) / threshold));
    wheelDelta -= direction * steps * threshold;
    step(direction * steps);
  }, { passive: false, capture: true });

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    window.clearTimeout(releaseTimer);
    album.classList.remove('is-releasing');
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null, dragging: false };
  });
  stage.addEventListener('dragstart', (event) => event.preventDefault());
  window.addEventListener('pointermove', (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    if (!pointerStart.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 7) {
      pointerStart.axis = Math.abs(dy) >= Math.abs(dx) ? 'y' : 'x';
      pointerStart.dragging = true;
      stage.classList.add('is-dragging');
      album.classList.add('is-dragging');
    }
    if (!pointerStart.dragging) return;
    event.preventDefault();
    setDragOffset((pointerStart.axis === 'y' ? dy : dx) * .8);
  });
  window.addEventListener('pointerup', (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    const axis = pointerStart.axis || (Math.abs(dy) >= Math.abs(dx) ? 'y' : 'x');
    const movement = axis === 'x' ? dx : dy;
    const wasDragging = pointerStart.dragging || Math.abs(movement) > 25;
    pointerStart = null;
    if (!wasDragging) return;
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 550);
    let change = 0;
    if (Math.abs(movement) > 25) {
      const steps = Math.min(3, Math.max(1, Math.round(Math.abs(movement) / 110)));
      change = (movement < 0 ? 1 : -1) * steps;
    }
    settleDrag(change);
  });
  window.addEventListener('pointercancel', () => {
    if (!pointerStart) return;
    pointerStart = null;
    settleDrag(0);
  });
  window.addEventListener('blur', () => {
    if (!pointerStart) return;
    pointerStart = null;
    settleDrag(0);
  });
  stage.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .1 }).observe(album);
  }
  const pauseButton = album.querySelector('[data-album-pause]');
  pauseButton.setAttribute('aria-pressed', String(manualPause));
  if (manualPause) pauseButton.textContent = copy.home.album.play;
  render();
  window.setInterval(tick, 2600);
}

setupHeroAlbum();

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.querySelector('#form-message');
  if (isPlaceholderEmail) {
    status.textContent = ui.emailSetup;
    return;
  }
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`${copy.contact.kicker}: ${data.get('name')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')}\nProject: ${data.get('projectType')}\nBudget: ${data.get('budget')}\nTimeline: ${data.get('timeline')}\n\n${data.get('message')}`);
  location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  status.textContent = ui.emailPrepared;
});
