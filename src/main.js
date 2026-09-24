import { site, projects, labEntries } from './content.js';

const app = document.querySelector('#app');
const route = '/' + (location.pathname.split('/').pop() || '');
const isPlaceholderEmail = site.email === 'hello@example.com';

const icon = (name) => ({ arrow: '↗', right: '→', plus: '+' })[name];
const link = (href, label, className = '') => `<a class="${className}" href="${href}">${label}</a>`;

function header() {
  return `<header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="./" aria-label="Fabrizzio Ruiz home">FABRIZZIO<span class="wordmark-dot">.</span></a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="./work.html" ${route === '/work.html' ? 'aria-current="page"' : ''}>Work</a>
      <a href="./services.html" ${route === '/services.html' ? 'aria-current="page"' : ''}>Services</a>
      <a href="./lab.html" ${route === '/lab.html' ? 'aria-current="page"' : ''}>Lab</a>
      <a href="./about.html" ${route === '/about.html' ? 'aria-current="page"' : ''}>About</a>
    </nav>
    <a class="header-cta" href="./contact.html">Start a project <span>${icon('arrow')}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu"><span></span><span></span></button>
  </div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden>
    <a href="./work.html">Work</a><a href="./services.html">Services</a><a href="./lab.html">Lab</a><a href="./about.html">About</a><a href="./contact.html">Start a project</a>
  </nav></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container footer-top"><div><div class="eyebrow">HAVE A PROJECT IN MIND?</div><h2>Let's make it<br/><em>matter.</em></h2></div><a class="round-arrow" href="./contact.html" aria-label="Go to contact page">${icon('arrow')}</a></div>
  <div class="container footer-bottom"><a class="wordmark" href="./">FABRIZZIO<span class="wordmark-dot">.</span></a><p>Independent visual designer<br/>${site.location} · Working worldwide</p><div class="footer-links"><a href="./work.html">Work</a><a href="./services.html">Services</a><a href="./lab.html">Lab</a><a href="./about.html">About</a><a href="./contact.html">Contact</a></div><small>© ${new Date().getFullYear()} Fabrizzio Ruiz</small></div></footer>`;
}

function projectCard(project, large = false) {
  return `<article class="project-card ${large ? 'project-card-large' : ''}"><div class="project-art ${project.className}" role="img" aria-label="Illustrative composition for a future ${project.label.toLowerCase()} case study"><div class="art-frame"><span class="art-overline">${project.id} / ${project.label.toUpperCase()}</span><strong>${project.title}</strong><span class="art-mark">FR<span>®</span></span></div></div><div class="project-meta"><div><span class="eyebrow">${project.label}</span><h3>${project.title}</h3><p>${project.note}</p></div><span class="project-icon" aria-hidden="true">${icon('arrow')}</span></div></article>`;
}

function sectionIntro(kicker, title, action = '') { return `<div class="section-head"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2></div>${action}</div>`; }

function home() {
  return `<main>
    <section class="hero container"><div class="hero-top"><span class="eyebrow status"><span class="status-dot"></span> INDEPENDENT VISUAL DESIGNER</span><span class="eyebrow">BASED IN PARAGUAY · WORKING WORLDWIDE</span></div>
      <h1>I design things<br/>people <em>notice.</em></h1>
      <div class="hero-bottom"><p>Brands, websites, and physical experiences with a clear point of view and a reason to exist.</p><div class="hero-actions"><a class="button button-light" href="./work.html">Explore my work <span>${icon('arrow')}</span></a><a class="text-link" href="./contact.html">Start a project <span>${icon('arrow')}</span></a></div></div>
      <div class="hero-showcase" aria-label="Abstract visual design collage"><div class="showcase-grid"><div class="showcase-tile showcase-one"><span>FORM<br/>MEETS<br/>PURPOSE<span class="tiny-star">✳</span></span></div><div class="showcase-tile showcase-two"><span class="outline-circle"></span><span class="showcase-label">DIGITAL / PHYSICAL / HUMAN</span></div><div class="showcase-tile showcase-three"><span>F/<br/>R.</span><span class="showcase-label">VISUAL EXPERIENCES</span></div></div><span class="showcase-caption">A space for selected work, ideas, and what comes next. <span>↘</span></span></div>
    </section>
    <section class="section container" id="work">${sectionIntro('01 / SELECTED WORK', 'Work that speaks<br/><em>for itself.</em>', '<a class="text-link" href="./work.html">All work <span>↗</span></a>')}<div class="project-grid">${projects.map((p, i) => projectCard(p, i === 0)).join('')}</div><p class="editorial-note">Project imagery and case-study details are illustrative until approved portfolio material is added.</p></section>
    <section class="services-band"><div class="container">${sectionIntro('02 / WHAT I DO', 'A broad toolkit.<br/><em>One clear vision.</em>')}<div class="service-rows"><a href="./services.html#brand"><span>01</span><h3>Brand & campaigns</h3><p>Identity systems, launches, and creative that keeps a brand recognizable.</p><b>↗</b></a><a href="./services.html#digital"><span>02</span><h3>Web & digital</h3><p>Websites and digital experiences built around clarity and impact.</p><b>↗</b></a><a href="./services.html#spatial"><span>03</span><h3>Expo & spaces</h3><p>Visual experiences that carry a brand into the physical world.</p><b>↗</b></a></div></div></section>
    <section class="section container perspective"><div><div class="eyebrow">03 / MY APPROACH</div><h2>Good design looks good.<br/><em>Great design works harder.</em></h2></div><div><p>I bring visual craft and practical thinking together—from the first question to the finished experience.</p><a class="text-link" href="./about.html">More about me <span>↗</span></a></div></section>
    <section class="lab-teaser container"><div class="lab-number">FR—LAB / 001</div><div><div class="eyebrow">IDEAS IN PROGRESS</div><h2>Curiosity is<br/>part of the work.</h2><p>Articles, use cases, and experiments in design, new technology, and AI.</p><a class="lab-teaser-link" href="./lab.html">Explore the Lab <span>↗</span></a></div><div class="lab-shape" aria-hidden="true">✳</div></section>
  </main>`;
}

function work() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">PORTFOLIO / SELECTED WORK</div><h1>Made to<br/><em>make an impact.</em></h1><p>Brand, digital, and spatial work. The projects below are layout previews until final case studies and imagery are approved.</p></div><div class="project-grid work-grid">${projects.map((p, i) => projectCard(p, i === 0)).join('')}</div><div class="work-guidance"><div class="eyebrow">A GOOD CASE STUDY SHOWS</div><p>The brief. The challenge. The choices. The outcome. Each finished project page will tell that story with your real assets and role clearly credited.</p></div></main>`; }

const serviceData = [
  ['brand', '01', 'Brand & campaigns', 'Identity systems, campaign concepts, and visual assets that help a business show up consistently.', ['Brand direction & identity', 'Campaign creative', 'Digital and print assets']],
  ['digital', '02', 'Web & digital', 'Websites and landing pages that make a strong first impression and guide people toward action.', ['Website visual direction', 'Landing page design', 'Digital design systems']],
  ['spatial', '03', 'Expo & spaces', 'Brand experiences made for real-world encounters, from early concepts to production-ready visual direction.', ['Exhibition concepts', 'Environmental graphics', 'Experience design direction']],
];
function services() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">SERVICES / WAYS TO WORK TOGETHER</div><h1>The right design<br/>for the <em>right job.</em></h1><p>Focused projects shaped around your goals. Tell me what you're building and we'll define a useful scope together.</p></div><div class="services-list">${serviceData.map(([id, n, title, body, items]) => `<section id="${id}" class="service-detail"><span class="eyebrow">${n} / SERVICE</span><div><h2>${title}</h2><p>${body}</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul></div><a class="round-arrow small" href="./contact.html" aria-label="Inquire about ${title}">↗</a></section>`).join('')}</div><section class="monthly"><div class="eyebrow">ONGOING SUPPORT</div><div><h2>Monthly design partnership.</h2><p>For teams with recurring design needs. The format, capacity, and monthly scope are defined together before we begin.</p></div><a class="button button-dark" href="./contact.html">Ask about availability <span>↗</span></a></section><p class="editorial-note">Engagement details and pricing are discussed after the scope is clear.</p></main>`; }

function about() { return `<main class="inner-page container"><div class="page-intro"><div class="eyebrow">ABOUT / FABRIZZIO RUIZ</div><h1>Designing across<br/><em>disciplines.</em></h1><p>I'm a visual designer based in Asunción, Paraguay, working with brands and teams across borders.</p></div><div class="about-layout"><div class="portrait-placeholder" role="img" aria-label="Portrait placeholder"><span>FR.</span><small>PORTRAIT COMING SOON</small></div><div class="about-copy"><div class="eyebrow">A BIT ABOUT ME</div><h2>One perspective.<br/>Many ways to make it real.</h2><p>My practice moves between brand identity, websites, campaigns, and physical spaces. Across each format, I look for the idea that makes the work clear, distinctive, and useful.</p><p>I work from Paraguay with an international outlook, bringing visual craft and curiosity to every brief.</p><a class="text-link" href="./contact.html">Let's work together <span>↗</span></a></div></div></main>`; }

function lab() {
  const entries = labEntries.length
    ? `<div class="lab-entry-grid">${labEntries.map(({ category, title, summary, date, url }) => `<a class="lab-entry" href="${url}"><span class="eyebrow">${category} · ${date}</span><h3>${title}</h3><p>${summary}</p><span class="lab-entry-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`
    : `<div class="lab-empty"><span class="lab-empty-mark" aria-hidden="true">✳</span><div><div class="eyebrow">FIRST NOTES IN PROGRESS</div><h3>Ideas are better when they're tested and shared.</h3><p>The first articles and experiments will appear here. For now, this is the space where the work will live.</p></div></div>`;

  return `<main class="lab-page">
    <section class="container lab-hero"><div class="eyebrow">FABRIZZIO / LAB</div><h1>A place to<br/><em>try things.</em></h1><div class="lab-hero-bottom"><p>Notes from the intersection of design, technology, and AI. What I make, what I learn, and what proves useful.</p><span class="lab-asterisk" aria-hidden="true">✳</span></div></section>
    <section class="lab-categories"><div class="container"><div class="eyebrow">WHAT YOU'LL FIND HERE</div><div class="lab-category-grid"><article><span>01 / WRITING</span><h2>Articles</h2><p>Thoughts on visual design, creative work, and the tools changing both.</p></article><article><span>02 / IN PRACTICE</span><h2>Use cases</h2><p>Real workflows and specific problems, with the decisions behind the result.</p></article><article><span>03 / IN PROGRESS</span><h2>Experiments</h2><p>Prototypes, trials, and the useful lessons from what does and doesn't work.</p></article></div></div></section>
    <section class="container lab-listing">${sectionIntro('LATEST FROM THE LAB', 'Work in progress.<br/><em>Ideas out loud.</em>')}${entries}</section>
    <section class="container lab-now"><div class="eyebrow">CURRENTLY EXPLORING</div><div class="lab-now-items"><span>AI-assisted exhibition workflows</span><span>Brand-aware design tools</span><span>Creative web experiences</span></div><p>These are topics in exploration, not published case studies.</p></section>
  </main>`;
}

function contact() { return `<main class="inner-page container contact-layout"><div class="page-intro"><div class="eyebrow">CONTACT / NEW PROJECTS</div><h1>Tell me what<br/>you're <em>making.</em></h1><p>Share a few details and I'll get back to you about the best next step.</p><div class="contact-direct"><span class="eyebrow">PREFER EMAIL?</span><span>${isPlaceholderEmail ? 'Email address to be added before launch' : `<a href="mailto:${site.email}">${site.email}</a>`}</span></div></div><form class="contact-form" id="contact-form"><label>Your name<input name="name" type="text" autocomplete="name" required placeholder="Your name" /></label><label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@company.com" /></label><label>Company / organization<input name="company" type="text" autocomplete="organization" placeholder="Optional" /></label><label>What do you need?<select name="projectType" required><option value="" disabled selected>Select a project type</option><option>Brand & campaigns</option><option>Web & digital</option><option>Expo & spaces</option><option>Ongoing design partnership</option><option>Something else</option></select></label><label>Approximate budget<select name="budget"><option value="" disabled selected>Select a range (optional)</option><option>Under $2,500</option><option>$2,500–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option><option>Not sure yet</option></select></label><label>Ideal timeline<input name="timeline" type="text" placeholder="When would you like to begin?" /></label><label class="full">Tell me about your project<textarea name="message" rows="5" required placeholder="What are you building, and what would success look like?"></textarea></label><button class="button button-light" type="submit">Prepare email <span>↗</span></button><p class="form-message" id="form-message" role="status"></p></form></main>`; }

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
