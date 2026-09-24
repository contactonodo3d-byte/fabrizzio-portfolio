import { site, copy, projects, services as serviceOptions, labEntries } from './content.js';

const app = document.querySelector('#app');
const route = '/' + (location.pathname.split('/').pop() || '');
const isPlaceholderEmail = site.email === 'hello@example.com';

const icon = (name) => ({ arrow: '↗', right: '→', plus: '+' })[name];
const display = ({ line1, line2 = '', accent = '' }) => `${line1}<br/>${line2}${accent ? `<em>${accent}</em>` : ''}`;

function header() {
  return `<header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="./" aria-label="Fabrizzio Ruiz home">FABRIZZIO<span class="wordmark-dot">.</span></a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="./work.html" ${route === '/work.html' ? 'aria-current="page"' : ''}>${copy.navigation.work}</a>
      <a href="./services.html" ${route === '/services.html' ? 'aria-current="page"' : ''}>${copy.navigation.services}</a>
      <a href="./lab.html" ${route === '/lab.html' ? 'aria-current="page"' : ''}>${copy.navigation.lab}</a>
      <a href="./about.html" ${route === '/about.html' ? 'aria-current="page"' : ''}>${copy.navigation.about}</a>
    </nav>
    <a class="header-cta" href="./contact.html">${copy.navigation.startProject} <span>${icon('arrow')}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu"><span></span><span></span></button>
  </div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden>
    <a href="./work.html">${copy.navigation.work}</a><a href="./services.html">${copy.navigation.services}</a><a href="./lab.html">${copy.navigation.lab}</a><a href="./about.html">${copy.navigation.about}</a><a href="./contact.html">${copy.navigation.startProject}</a>
  </nav></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container footer-top"><div><div class="eyebrow">${copy.footer.kicker}</div><h2>${display(copy.footer.title)}</h2></div><a class="round-arrow" href="./contact.html" aria-label="Go to contact page">${icon('arrow')}</a></div>
  <div class="container footer-bottom"><a class="wordmark" href="./">FABRIZZIO<span class="wordmark-dot">.</span></a><p>${copy.footer.descriptor}<br/>${site.location} · ${copy.footer.worldwide}</p><div class="footer-links"><a href="./work.html">${copy.navigation.work}</a><a href="./services.html">${copy.navigation.services}</a><a href="./lab.html">${copy.navigation.lab}</a><a href="./about.html">${copy.navigation.about}</a><a href="./contact.html">${copy.navigation.contact}</a></div><small>© ${new Date().getFullYear()} ${site.name}</small></div></footer>`;
}

function projectCard(project, large = false) {
  return `<article class="project-card ${large ? 'project-card-large' : ''}"><div class="project-art ${project.className}" role="img" aria-label="Illustrative composition for a future ${project.label.toLowerCase()} case study"><div class="art-frame"><span class="art-overline">${project.id} / ${project.label.toUpperCase()}</span><strong>${project.title}</strong><span class="art-mark">FR<span>®</span></span></div></div><div class="project-meta"><div><span class="eyebrow">${project.label}</span><h3>${project.title}</h3><p>${project.note}</p></div><span class="project-icon" aria-hidden="true">${icon('arrow')}</span></div></article>`;
}

function sectionIntro(kicker, title, action = '') { return `<div class="section-head"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2></div>${action}</div>`; }

function home() {
  return `<main>
    <section class="hero container"><div class="hero-top"><span class="eyebrow status"><span class="status-dot"></span> ${copy.home.role}</span><span class="eyebrow">${copy.home.location}</span></div>
      <h1>${display(copy.home.hero)}</h1>
      <div class="hero-bottom"><p>${copy.home.intro}</p><div class="hero-actions"><a class="button button-light" href="./work.html">${copy.home.exploreWorkButton} <span>${icon('arrow')}</span></a><a class="text-link" href="./contact.html">${copy.navigation.startProject} <span>${icon('arrow')}</span></a></div></div>
      <div class="hero-showcase" aria-label="Abstract visual design collage"><div class="showcase-grid"><div class="showcase-tile showcase-one"><span>${copy.home.showcase.bigWords.join('<br/>')}<span class="tiny-star">✳</span></span></div><div class="showcase-tile showcase-two"><span class="outline-circle"></span><span class="showcase-label">${copy.home.showcase.middleLabel}</span></div><div class="showcase-tile showcase-three"><span>F/<br/>R.</span><span class="showcase-label">${copy.home.showcase.rightLabel}</span></div></div><span class="showcase-caption">${copy.home.showcase.caption} <span>↘</span></span></div>
    </section>
    <section class="section container" id="work">${sectionIntro(copy.home.work.kicker, display(copy.home.work.title), '<a class="text-link" href="./work.html">${copy.home.work.allWorkLink} <span>↗</span></a>')}<div class="project-grid">${projects.map((p, i) => projectCard(p, i === 0)).join('')}</div><p class="editorial-note">${copy.home.work.placeholderNote}</p></section>
    <section class="services-band"><div class="container">${sectionIntro(copy.home.services.kicker, display(copy.home.services.title))}<div class="service-rows">${serviceOptions.map(({ id, number, title, homeBody }) => `<a href="./services.html#${id}"><span>${number}</span><h3>${title}</h3><p>${homeBody}</p><b>↗</b></a>`).join('')}</div></div></section>
    <section class="section container perspective"><div><div class="eyebrow">${copy.home.approach.kicker}</div><h2>${display(copy.home.approach.title)}</h2></div><div><p>${copy.home.approach.body}</p><a class="text-link" href="./about.html">${copy.home.approach.moreLink} <span>↗</span></a></div></section>
    <section class="lab-teaser container"><div class="lab-number">FR—LAB / 001</div><div><div class="eyebrow">${copy.home.lab.kicker}</div><h2>${display(copy.home.lab.title)}</h2><p>${copy.home.lab.body}</p><a class="lab-teaser-link" href="./lab.html">${copy.home.lab.link} <span>↗</span></a></div><div class="lab-shape" aria-hidden="true">✳</div></section>
  </main>`;
}

function work() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">${copy.work.kicker}</div><h1>${display(copy.work.title)}</h1><p>${copy.work.intro}</p></div><div class="project-grid work-grid">${projects.map((p, i) => projectCard(p, i === 0)).join('')}</div><div class="work-guidance"><div class="eyebrow">${copy.work.guidanceTitle}</div><p>${copy.work.guidanceBody}</p></div></main>`; }

function services() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">${copy.services.kicker}</div><h1>${display(copy.services.title)}</h1><p>${copy.services.intro}</p></div><div class="services-list">${serviceOptions.map(({ id, number, title, body, items }) => `<section id="${id}" class="service-detail"><span class="eyebrow">${number} / SERVICE</span><div><h2>${title}</h2><p>${body}</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div><a class="round-arrow small" href="./contact.html" aria-label="Inquire about ${title}">↗</a></section>`).join('')}</div><section class="monthly"><div class="eyebrow">${copy.services.monthlyKicker}</div><div><h2>${copy.services.monthlyTitle}</h2><p>${copy.services.monthlyBody}</p></div><a class="button button-dark" href="./contact.html">${copy.services.monthlyButton} <span>↗</span></a></section><p class="editorial-note">${copy.services.note}</p></main>`; }

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
const render = pages[route] || (() => `<main class="inner-page container not-found"><div class="eyebrow">404 / PAGE NOT FOUND</div><h1>Nothing here<br/><em>yet.</em></h1><a class="button button-light" href="./">Back home ↗</a></main>`);
app.innerHTML = header() + render() + footer();

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !open;
});

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.querySelector('#form-message');
  if (isPlaceholderEmail) {
    status.textContent = 'The contact address has not been configured yet. Please add it in src/content.js before launch.';
    return;
  }
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Project inquiry from ${data.get('name')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')}\nProject: ${data.get('projectType')}\nBudget: ${data.get('budget')}\nTimeline: ${data.get('timeline')}\n\n${data.get('message')}`);
  location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  status.textContent = 'Your email app should open with a prepared message. Please send it there to complete your inquiry.';
});
