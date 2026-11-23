import { imageTag, imageSizes } from './responsive-image.js';
import { mediaFigure } from './selected-projects.js';
import { ORIGIN, ENTITY_STATEMENT } from './seo-meta.js';
import { site } from './content.js';
import { contact as expoContact } from './expo-contact.js';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function paragraph(text) {
  return `<p>${escapeHtml(text)}</p>`;
}

function section(title, blocks) {
  return `<section><h2>${escapeHtml(title)}</h2>${blocks.join('')}</section>`;
}

function faqList(items) {
  return `<section class="faq-list"><h2>FAQ</h2>${items.map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</section>`;
}

function gallery(title, items) {
  const figures = items.map((item, index) => mediaFigure({
    url: item.src,
    width: item.width,
    height: item.height,
    label: item.caption,
    wide: item.width >= item.height,
  }, title, index === 0 ? 'eager' : 'lazy')).join('');
  return `<section class="campaign-gallery"><h2>${escapeHtml(title)}</h2><div class="selected-gallery">${figures}</div></section>`;
}

function relatedLinks(links) {
  return `<p>${links.map(([href, label]) => `<a class="text-link" href="${href}">${escapeHtml(label)}</a>`).join(' · ')}</p>`;
}

const serviceLinks = [
  ['/en/white-label-design/', 'White-label design'],
  ['/en/trade-show-booth-design/', 'Trade show booth design'],
];

const caseLinks = [
  ['/en/work/el-delta/', 'Indufar · El Delta'],
  ['/en/work/indufar-run/', 'Indufar Run'],
  ['/en/work/gestecner/', 'Gestecner · Navegestic'],
  ['/en/work/foody/', 'Foody · ExpoVet'],
];

export function faqJsonLd(path, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${ORIGIN}${path}#faq`,
    url: `${ORIGIN}${path}`,
    mainEntity: items.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

export function marketServiceJsonLd({ name, serviceType, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    url: `${ORIGIN}${path}`,
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ],
    provider: { '@type': 'Person', '@id': `${ORIGIN}/#fabrizzio`, name: 'Fabrizzio Ruiz', url: `${ORIGIN}/` },
  };
}

export function caseCreativeWork({ name, description, path, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${ORIGIN}${path}#work`,
    name,
    headline: name,
    description,
    url: `${ORIGIN}${path}`,
    image: `${ORIGIN}${image}`,
    creator: { '@id': `${ORIGIN}/#fabrizzio` },
    inLanguage: 'en',
  };
}

const whiteLabelFaqs = [
  ['What does it mean that you are a white label graphic designer for agencies?', 'I design the work and you deliver it under your brand. I follow your process, stay off the client channel unless you ask otherwise, and I don’t market the project as mine without written permission.'],
  ['Will you sign an NDA?', 'Yes.'],
  ['Do you work with agencies in the United States and Canada?', 'Yes. I’m a remote graphic designer for US agencies and for teams in Canada, based in Asunción, Paraguay, with hours that overlap US time zones.'],
  ['What tools do you use?', 'Adobe Creative Cloud, Figma, Blender and DaVinci Resolve. For booth walkthroughs, I can provide a 3D/AR review with a NODO3D viewer, as I did for the Gestecner concept.'],
  ['Do you only do brand and web work, or also exhibits?', 'Both. White-label work can be branding, packaging, campaigns, presentations, web design, or trade show booth and scenography design.'],
  ['How do we start?', 'Email hello@fabrizzioruiz.com with the type of work, the deadline and, if you have it, the brief. I’ll come back with a recommended engagement model and a scope. WhatsApp: +595 972 780 989.'],
  ['What do you need from us to work under your brand?', 'Your guidelines or the client’s, any templates or file-naming rules, the decision-maker on your team, and a clear deadline. For booth work, I also need the footprint, height limits, the event date and the fabricator’s requirements when you have them.'],
  ['Can you handle ongoing work, not just a single project?', 'Yes. The monthly design partnership is for recurring needs. We define the capacity and scope before the first month starts.'],
];

const tradeShowFaqs = [
  ['Can I hire you if I already have a fabricator?', 'Yes. Tell me who will produce the space and what documentation they need. We define the design and the files around that process.'],
  ['What do I receive at the end?', 'The deliverables are agreed in the proposal. They can include renders, a concept presentation, dimensioned views and graphic files for production. We confirm formats and scope before we begin.'],
  ['Does the service include fabrication and installation?', 'No. This is a design and visualization service. I coordinate the design with the builder; I don’t build or install the booth myself. If you also need production or installation, say so when you ask for a quote.'],
  ['How much does it cost, and how long does it take?', 'It depends on the dimensions, complexity, deliverables and the event date. Share those details and I’ll send a proposal. My hourly rate is $35. Project work is scoped as a fixed fee.'],
  ['Do you work with exhibit builders in the United States and Canada?', 'Yes. I work freelance from Asunción, with hours that overlap US time zones, and I can work with builders in Las Vegas, Chicago, Orlando and other US or Canadian markets.'],
  ['Can you show a built booth next to the 3D render?', 'Yes, on El Delta and on Foody · ExpoVet. Indufar Run is published as design renders. Gestecner is a concept and has not been built.'],
  ['Do you provide 3D and AR previews for a sales presentation?', 'Yes, when the scope includes them. The Gestecner concept is at https://fabrizzioruiz.com/en/expo/gestecner/.'],
  ['What do you need to start?', 'The exhibition date, the booth dimensions and height limit, what needs to be shown, the brand guidelines, and the fabricator’s requirements when you have them. If you are bidding, tell me the submission date.'],
];

export const whiteLabelPage = {
  path: '/en/white-label-design/',
  title: 'White-Label Graphic & Exhibit Designer for Agencies | Fabrizzio Ruiz',
  description: 'White-label graphic and exhibit design for US and Canadian agencies. I work under your brand, remotely from Asunción, overlapping US hours.',
  faqs: whiteLabelFaqs,
};

export const tradeShowPage = {
  path: '/en/trade-show-booth-design/',
  title: 'Freelance Trade Show Booth Designer | 3D Concepts and Production Files',
  description: 'Freelance trade show booth design for exhibit builders: 3D concepts, graphics and production-ready files. Remote from Asunción, working with US teams.',
  faqs: tradeShowFaqs,
};

export function whiteLabelBody() {
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><h1>White-label design for US and Canadian agencies.</h1>
${paragraph('I’m Fabrizzio Ruiz, a freelance white label designer for agencies. I’m a senior graphic, web and 3D designer based in Asunción, Paraguay. I work under your brand, and your client does not have to know I’m there.')}
${paragraph('I was Lead Designer for graphic and web work at Tenth Element in Las Vegas, Nevada, from 2020 to 2022. I’ve been a remote freelancer since 2018, with more than eight years of experience. I use Adobe Creative Cloud, Figma, Blender and DaVinci Resolve, and I can provide a 3D/AR review with a NODO3D viewer when a project needs it.')}
</div>
${section('What I do under your brand', [
  paragraph('You stay the point of contact. I design, revise and deliver the files, and you present the work as yours. That can include trade show booth and exhibit design (concepts, 3D renders, graphics and production-ready files); branding and packaging; campaign and presentation design; web and digital design; and 3D/AR reviews so your team or your client can walk a concept before it is built.'),
  paragraph('I work from your guidelines, templates, file naming and review process. If you need me in your Slack, Figma or Adobe files, I work there. The finished files are yours to deliver.'),
  paragraph('I contributed to the projects in my portfolio in different ways. I led the full scope on some and handled specific stages on others. Many were completed through agencies. On El Delta and Gestecner, the design and 3D visualization are mine, and the work was carried out through Péscalo.'),
])}
${section('NDA and confidentiality', [
  paragraph('White-label work only holds if your client relationship stays protected. I don’t contact your client, I don’t present the work under my name, and I don’t share project files outside the people you name.'),
])}
${section('Hours and time zone overlap', [
  paragraph('I’m based in Asunción, Paraguay (UTC−3). That puts me one to two hours ahead of US Eastern Time and four to five hours ahead of US Pacific Time, so my workday already overlaps US business hours.'),
])}
${section('Turnaround', [
  paragraph('Scope, the event date and the number of revision rounds always affect the schedule. I confirm the timeline in the proposal before we start.'),
])}
${section('Engagement models', [
  paragraph('We can work in three ways. I’ll recommend one after I see the work.'),
  '<h3>Hourly — $35/hour.</h3>',
  paragraph('Best when the scope is still moving. I track hours and check in before I go past an agreed cap.'),
  '<h3>Retainer.</h3>',
  paragraph('A set monthly capacity for agencies with recurring work. The format, capacity and monthly scope are defined together before we begin.'),
  '<h3>Per project.</h3>',
  paragraph('A fixed fee for a defined deliverable, such as a booth concept set, a production file package, a campaign, or a website design. Scope, revisions, timeline and fee go into the proposal before work starts.'),
])}
${section('How I work', [
  '<ol><li><strong>Brief and fit.</strong> You send the client context, the guidelines, the deadline and, for a booth, the footprint and fabricator requirements. We agree on scope, fee or hourly cap, and the NDA.</li><li><strong>Design and review.</strong> I develop the work and review it with your team, in your tools, under your name. You run the client presentation.</li><li><strong>Delivery.</strong> I hand over the agreed files, packaged the way your team needs them. On exhibit work, I also coordinate design details with the builder you name.</li></ol>',
])}
${section('Proof', [
  paragraph('I was Lead Designer at Tenth Element, a Las Vegas agency, from 2020 to 2022, on graphic and web design. That is how I work inside a US agency team: under the studio’s standards, on US timelines, with work the agency presents.'),
  '<p>Selected work:</p><ul><li><strong>Indufar · El Delta</strong> — a built activation with a nutrition bar, photo opportunity and live activation, shown as renders next to photographs of the realized space.</li><li><strong>Indufar Run</strong> — five booth designs for six brands: TG, Banes, Mentovick, Vitamina C, Arsetonic and Indufar.</li><li><strong>Gestecner · Navegestic</strong> — two concepts for Boat Port Show 2026 (3 × 3 m, 3.20 m high), with technical views and a 3D/AR model. A concept, not a built booth.</li><li><strong>Foody · ExpoVet</strong> — a 3 × 3 m stand from concept to the show floor, with brand graphics, a product display, a prize wheel and a QR flyer.</li></ul>',
  relatedLinks([...caseLinks, ['/en/expo/', 'Expo booths'], ['/en/work/', 'Work']]),
])}
${faqList(whiteLabelFaqs)}
${section('Let’s talk', [
  `<p>If you need a freelance white label designer who can sit inside your process and deliver work your team is willing to present, email <a href="mailto:${site.email}">${site.email}</a>. Tell me the kind of work, the deadline and whether you already have an NDA you want me to sign.</p>`,
])}
</main>`;
}

export function tradeShowBody() {
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><h1>Trade show booth design for exhibit builders.</h1>
${paragraph('I’m Fabrizzio Ruiz, a freelance trade show booth designer and exhibit design freelancer based in Asunción, Paraguay. I design the concept, the 3D visualization and the graphics, then hand you production-ready files your fabricators can build from.')}
${paragraph('I don’t fabricate or install the booth. I work with the builder you already use, or the one your client has chosen, and I coordinate the design details with that team. I’ve been a remote freelancer since 2018, with more than eight years of experience, and I was Lead Designer for graphic and web work at Tenth Element in Las Vegas, Nevada, from 2020 to 2022. I work hours that overlap US time zones. I can work with exhibit builders in the United States and Canada, including teams in Las Vegas, Chicago or Orlando.')}
</div>
${section('Services', [
  '<h3>Concepts and layout.</h3>',
  paragraph('I plan product placement, circulation, visitor reception and activations inside the footprint you have. The concept has to work as a space, not only as a picture.'),
  '<h3>3D renders and models.</h3>',
  paragraph('I build renders, views and models so your team, and your client, can review the design before anyone cuts material. When a review needs to go further, I can provide a 3D/AR viewer (NODO3D). The Gestecner Navegestic concept, for example, can be rotated on the desktop and opened in augmented reality on a compatible phone.'),
  '<h3>Graphics and content.</h3>',
  paragraph('I design brand applications for walls, headers, counters and other surfaces, and screen content when the project includes it, from stills to motion.'),
  '<h3>Production-ready files.</h3>',
  paragraph('After approval, I prepare the graphic and documentation package we agreed in the proposal, and I coordinate remaining design details with the stand builder.'),
])}
${section('Deliverables', [
  paragraph('The exact package is written into the proposal before I start. Depending on the job, it can include a concept presentation; 3D renders of the approved design; alternative concepts, when the brief calls for more than one option; dimensioned views, floor plans and technical views; a 3D model and, when useful, an AR review; production graphic files for walls, headers, furniture and other branded surfaces; and screen content or motion, when the booth includes displays.'),
  paragraph('I confirm formats and scope before we begin. If your shop has a drawing standard or a preferred graphic spec, send it with the brief.'),
])}
${section('How I work', [
  '<ol><li><strong>Event and scope.</strong> We review the date, dimensions, budget and fabricator requirements. Tell me who will build the space and what documentation they need.</li><li><strong>Design and review.</strong> I develop the proposal and refine it with your team. You can use the renders and, when we include it, the 3D/AR model in your client presentation.</li><li><strong>Production handoff.</strong> I prepare the agreed deliverables and coordinate design details with the stand builder.</li></ol>',
])}
${section('Selected booths', [
  paragraph('Indufar · El Delta. Design and visualization by me, carried out through Péscalo. A realized project with a nutrition bar, a photo opportunity and an activation, shown as 3D renders next to photographs of the built space.'),
  paragraph('Indufar Run. Five booth designs for six brands — TG, Banes, Mentovick, Vitamina C, Arsetonic and Indufar — covering tasting, product display, interaction and recovery. The published set is the design concept in render form.'),
  paragraph('Gestecner · Navegestic. A booth concept for Boat Port Show 2026, designed and visualized by me through Péscalo. Two options, organized around an aerial drone, an aquatic drone and an isometric map that continues from the wall to the floor. The approved concept is 3 × 3 m and 3.20 m high, with technical views and a 3D/AR model. This proposal was not built.'),
  paragraph('Foody · ExpoVet. A 3 × 3 m stand taken from concept to the fair, with brand graphics, a product display, a prize wheel and a QR flyer, shown as concept renders beside photographs of the built stand.'),
  paragraph('Related work includes Indufar’s Casa Albirroja stand and the wider Indufar 2026 activations.'),
  relatedLinks([...caseLinks, ['/en/work/casa-albirroja/', 'Casa Albirroja'], ['/en/work/indufar-2026/', 'Indufar 2026'], ['/en/expo/', 'Expo booths'], ['/en/work/', 'Work']]),
])}
${faqList(tradeShowFaqs)}
${section('Let’s discuss your stand', [
  paragraph('Tell me the exhibition date, the space dimensions and what you want to showcase. I’ll come back with a scope, a fee or hourly cap, and a plan for the files your builder needs.'),
  `<p><a href="mailto:${site.email}">${site.email}</a> · WhatsApp: <a href="https://wa.me/${expoContact.whatsapp}">+595 972 780 989</a></p>`,
])}
</main>`;
}

const credit = '<p>I contributed to the projects in this portfolio. I led the full scope on some and contributed to specific stages or deliverables on others. Many were completed through agencies or in collaboration with other people and teams.</p>';

function caseShell({ eyebrow, title, summary, sections, galleries, links }) {
  return `<main id="main-content" class="case-page container"><a class="case-back text-link" href="/en/work/">← Back to projects</a><header class="case-intro"><div class="eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(summary)}</p></header><div class="case-story">${sections.join('')}</div>${galleries.join('')}${relatedLinks(links)}${credit}</main>`;
}

const elDelta = {
  slug: 'el-delta',
  path: '/en/work/el-delta/',
  title: 'Indufar · El Delta · Trade show booth · Fabrizzio Ruiz',
  name: 'Indufar · El Delta',
  eyebrow: 'Trade show booth / Built project',
  description: 'Design and visualization for a built brand space with a nutrition bar, a photo opportunity and an activation — shown as 3D renders next to photographs of the realized space.',
  image: '/expo/assets/delta-hero.webp',
};

const indufarRun = {
  slug: 'indufar-run',
  path: '/en/work/indufar-run/',
  title: 'Indufar Run · Trade show booths · Fabrizzio Ruiz',
  name: 'Indufar Run',
  eyebrow: 'Trade show booths / Five stands for six brands',
  description: 'Spatial design for TG, Banes, Mentovick, Vitamina C, Arsetonic and Indufar — a family of booths for tasting, product display and interaction.',
  image: '/expo/assets/run-indufar.webp',
};

const gestecnerCase = {
  slug: 'gestecner',
  path: '/en/work/gestecner/',
  title: 'Gestecner · Navegestic · Booth concept · Fabrizzio Ruiz',
  name: 'Gestecner · Navegestic',
  eyebrow: 'Booth concept · 3D / AR',
  description: 'Two booth concepts for Boat Port Show 2026, built around an aerial drone, an aquatic drone and an isometric map that continues from the wall to the floor.',
  image: '/images/selected/gestecner/render-principal.webp',
};

const foodyCase = {
  slug: 'foody',
  path: '/en/work/foody/',
  title: 'Foody · ExpoVet · Trade show booth · Fabrizzio Ruiz',
  name: 'Foody · ExpoVet',
  eyebrow: 'Trade show booth / Built project',
  description: 'From concept to a 3 × 3 m exhibition stand: brand graphics, a product display, a prize wheel and a flyer with a QR code to the product catalog.',
  image: '/images/selected/foody/foto-5.webp',
};

export const englishCases = {
  'el-delta': elDelta,
  'indufar-run': indufarRun,
  gestecner: gestecnerCase,
  foody: foodyCase,
};

function studyLinks(slug) {
  return [...caseLinks.filter(([href]) => !href.endsWith(`/${slug}/`)), ...serviceLinks, ['/en/work/', 'All work']];
}

export function englishCaseBody(slug) {
  if (slug === 'el-delta') {
    return caseShell({
      eyebrow: elDelta.eyebrow,
      title: elDelta.name,
      summary: elDelta.description,
      sections: [
        section('Brief', [paragraph('Indufar needed a brand space for El Delta that could do three things at once: serve as a nutrition bar, give visitors a photo opportunity, and hold a live activation. The job was to design that space and visualize it clearly enough to be reviewed, produced and used on the show floor.')]),
        section('My role', [paragraph('I did the design and the 3D visualization. The work was carried out through Péscalo. The project was built.')]),
        section('Process', [paragraph('I designed the TG space for El Delta, including the nutrition bar, the photo opportunity and the activation area, and I visualized the design in 3D so the team could review it before production. The published set is built so a reader can compare the render of the TG space with photographs of the same space during the event.')]),
        section('Result', [
          paragraph('El Delta was realized. The published photographs show the built space, the photo opportunity and the activation in use during the event, alongside the original design render.'),
          paragraph('This is the strongest booth project in the portfolio for a US exhibit builder, because it is the one that places a 3D render next to photographs of the finished stand.'),
        ]),
        section('Deliverables', [paragraph('The public case study currently includes the TG space render and three event photographs.')]),
      ],
      galleries: [gallery('El Delta', [
        { src: '/expo/assets/delta-hero.webp', width: 1800, height: 932, caption: 'El Delta · TG space render' },
        { src: '/expo/assets/delta-photo-general.webp', width: 1600, height: 1200, caption: 'El Delta · Photograph of the realized space' },
        { src: '/expo/assets/delta-photo-opportunity.webp', width: 1200, height: 1600, caption: 'El Delta · Photo opportunity photograph' },
        { src: '/expo/assets/delta-photo-activation.webp', width: 1200, height: 1600, caption: 'El Delta · Activation photograph during the event' },
      ])],
      links: studyLinks('el-delta'),
    });
  }
  if (slug === 'indufar-run') {
    return caseShell({
      eyebrow: indufarRun.eyebrow,
      title: indufarRun.name,
      summary: indufarRun.description,
      sections: [
        section('Brief', [paragraph('Indufar needed a set of booths, not a single stand: five spaces for six brands, each with its own identity, working together as a family. The brands were TG, Banes, Mentovick, Vitamina C, Arsetonic and Indufar. The spaces had to support tasting, product display, interaction and recovery, rather than repeating one layout with a logo swap.')]),
        section('My role', [paragraph('I designed the spaces for TG, Banes, Mentovick, Vitamina C, Arsetonic and Indufar.')]),
        section('Process', [
          paragraph('The published work presents six brand identities across five booths, including a shared booth for Vitamina C and Arsetonic. Each space has a distinct role:'),
          '<ul><li>TG — nutrition bar and photo opportunity</li><li>Banes — Charm Bar and photo opportunity</li><li>Mentovick — product display and recovery</li><li>Vitamina C + Arsetonic — shared booth</li><li>Indufar — history, products and an interactive screen</li></ul>',
          paragraph('The images are selected renders from the Indufar Run presentation. They show the design concepts.'),
        ]),
        section('Result', [
          paragraph('The work shows range across several brands in one program: five booths, six identities, and a mix of tasting, display, interaction and recovery. That is useful proof for a builder or an agency that needs more than one space on the same floor.'),
          paragraph('The public case is still render-led. Unlike El Delta, this set does not yet place built photographs next to the concepts.'),
        ]),
      ],
      galleries: [gallery('Indufar Run', [
        { src: '/expo/assets/run-tg.webp', width: 1800, height: 910, caption: 'TG · Nutrition bar and photo opportunity' },
        { src: '/expo/assets/run-banes.webp', width: 1800, height: 1148, caption: 'Banes · Charm Bar and photo opportunity' },
        { src: '/expo/assets/run-mentovick.webp', width: 1800, height: 1091, caption: 'Mentovick · Product display and recovery' },
        { src: '/expo/assets/run-vitc-arsetonic.webp', width: 1800, height: 1117, caption: 'Vitamina C + Arsetonic · Shared booth' },
        { src: '/expo/assets/run-indufar.webp', width: 1800, height: 1176, caption: 'Indufar · History, products and interactive screen' },
        { src: '/expo/assets/run-indufar-interactive.webp', width: 1800, height: 1370, caption: 'Indufar · Interactive screen detail' },
      ])],
      links: studyLinks('indufar-run'),
    });
  }
  if (slug === 'gestecner') {
    return caseShell({
      eyebrow: gestecnerCase.eyebrow,
      title: gestecnerCase.name,
      summary: gestecnerCase.description,
      sections: [
        section('Brief', [paragraph('Gestecner needed a booth concept for Boat Port Show 2026. The design had to present an aerial drone and an aquatic drone, and use an isometric map as a continuous graphic from the wall to the floor. The approved concept fits a 3 × 3 m area, 3.20 m high, and had to be reviewable in technical views and in 3D, including augmented reality on a compatible phone.')]),
        section('My role', [paragraph('I designed the stand and did the 3D visualization. The work was carried out through Péscalo. The original 3D files are NODO3D. The proposal was not built.')]),
        section('Process', [
          paragraph('I developed two proposals. Option 1 is the approved concept. It includes an overview with dimensions, a drone display with the isometric map, an interactive screen for mini-games, and a reception area with cartographic graphics. Option 2 is an alternative concept with a different organization of the space and its visual elements, documented with an overview, a floor plan and a top view of the structure.'),
          paragraph('I also built an interactive 3D model of the concept (7.3 MB, loaded on demand) so a reviewer can rotate the space, take approximate measurements, and, on a compatible phone over HTTPS, open it in augmented reality.'),
          '<p><a class="text-link" href="/en/expo/gestecner/">Explore the Gestecner booth in 3D / AR</a></p>',
        ]),
        section('Result', [
          paragraph('The client-facing output is a complete concept package: two options, dimensioned technical views, and a 3D/AR model of a 3 × 3 m, 3.20 m-high booth. For a builder or an agency, this study shows how I document a design before anyone produces it.'),
          paragraph('It is a concept, not a built booth. That should stay on the page so a buyer does not read the renders as construction photography.'),
        ]),
        section('Deliverables', ['<ul><li>Two concept proposals (Option 1 approved; Option 2 as an alternative)</li><li>Design renders and technical views with dimensions, including floor plan and structure views for Option 2</li><li>Interactive 3D / AR viewer</li><li>Original 3D files (NODO3D)</li></ul>']),
      ],
      galleries: [
        gallery('Option 1', [
          { src: '/images/selected/gestecner/render-principal.webp', width: 1792, height: 878, caption: 'Simulation of the booth · Option 1' },
          { src: '/images/selected/gestecner/exhibicion-drones.webp', width: 1406, height: 1364, caption: 'Drone display and isometric map' },
          { src: '/images/selected/gestecner/pantalla-interactiva.webp', width: 1176, height: 1466, caption: 'Interactive screen for mini-games' },
          { src: '/images/selected/gestecner/area-atencion.webp', width: 884, height: 1472, caption: 'Reception area and cartographic graphics' },
        ]),
        gallery('Technical views', [
          { src: '/images/selected/gestecner/vista-general.webp', width: 1800, height: 882, caption: 'Overview with dimensions' },
          { src: '/expo/assets/gestecner-plan.webp', width: 1800, height: 883, caption: 'Option 2 · Floor plan and layout' },
          { src: '/expo/assets/gestecner-overhead.webp', width: 1800, height: 883, caption: 'Option 2 · Top view and structure' },
        ]),
        gallery('Option 2', [
          { src: '/images/selected/gestecner/render-alternativo.webp', width: 1800, height: 1004, caption: 'Simulation of the booth · Option 2' },
          { src: '/images/selected/gestecner/vista-alternativa.webp', width: 1800, height: 882, caption: 'Overview of the second proposal' },
          { src: '/expo/assets/gestecner-general.webp', width: 1800, height: 883, caption: 'Option 2 · Overview with dimensions' },
        ]),
      ],
      links: studyLinks('gestecner'),
    });
  }
  if (slug === 'foody') {
    return caseShell({
      eyebrow: foodyCase.eyebrow,
      title: foodyCase.name,
      summary: foodyCase.description,
      sections: [
        section('Brief', [paragraph('Foody needed a 3 × 3 m stand for ExpoVet that could carry the brand, display product, and give the team a way to engage visitors. The design had to include brand graphics, a product display, a prize wheel, and a flyer with a QR code that opened the product catalog.')]),
        section('My role', [paragraph('The public case presents the project from concept through to the stand at the fair, including brand graphics, the product display, the prize wheel and the flyer.')]),
        section('Process', [
          paragraph('I first designed and visualized the 3 × 3 m stand: the overall concept, the layout, the product display, the side graphics, the flyer with the QR code, and the prize wheel as an activation. Those pieces are published as concept renders and visual proposals.'),
          paragraph('The stand was then built for the fair. The case study shows the realized stand in a general view, the product display from the front and the side, the printed flyer with the QR code, and the prize wheel in use with visitors.'),
          paragraph('A 3D / AR model of the product display is available for review, separate from the photographs of the built exhibitor.'),
          '<p><a class="text-link" href="/3d/foody-exhibidor/">Explore the product display in 3D / AR</a></p>',
        ]),
        section('Result', [
          paragraph('Foody’s 3 × 3 m stand was realized at ExpoVet. A visitor walking the case study can see the concept and the built result for the same elements: the stand, the product display, the flyer and the prize wheel.'),
          paragraph('Together with El Delta, this is the other project that gives a US buyer what they look for: a render next to a photograph of the finished booth.'),
        ]),
        section('Deliverables', ['<ul><li>Concept and layout for a 3 × 3 m stand</li><li>Brand graphics, including side graphics</li><li>Product display design, plus a 3D / AR model of the exhibitor</li><li>Prize wheel activation design</li><li>Flyer with a QR code to the product catalog</li></ul>']),
      ],
      galleries: [
        gallery('From concept to the fair', [
          { src: '/images/selected/foody/foto-5.webp', width: 1280, height: 720, caption: 'Stand at the fair · General view' },
          { src: '/images/selected/foody/foto-1.webp', width: 720, height: 1280, caption: 'Product display · Front view' },
          { src: '/images/selected/foody/foto-3.webp', width: 720, height: 1280, caption: 'Product display · Side view' },
          { src: '/images/selected/foody/foto-2.webp', width: 720, height: 1280, caption: 'Flyer with QR code to the catalog' },
          { src: '/images/selected/foody/foto-4.webp', width: 1280, height: 720, caption: 'Prize wheel and visitor reception' },
        ]),
        gallery('Concept — design and visualization', [
          { src: '/images/selected/foody/concepto-7.webp', width: 1553, height: 1013, caption: '3 × 3 m stand · Concept render' },
          { src: '/images/selected/foody/concepto-4.webp', width: 1800, height: 913, caption: 'Stand layout · Concept render' },
          { src: '/images/selected/foody/concepto-3.webp', width: 1800, height: 913, caption: 'Product display · Visual proposal' },
          { src: '/images/selected/foody/concepto-9.webp', width: 1800, height: 913, caption: 'Side graphics · Visual proposal' },
          { src: '/images/selected/foody/concepto-6.webp', width: 1374, height: 1145, caption: 'Flyer with QR · Concept visualization' },
          { src: '/images/selected/foody/concepto-1.webp', width: 786, height: 1800, caption: 'Prize wheel · Activation proposal' },
        ]),
      ],
      links: studyLinks('foody'),
    });
  }
  return '';
}

export function englishAboutBody() {
  return `<main id="main-content" class="inner-page container"><div class="page-intro"><h1>Graphic and exhibit design from Asunción, shaped in Las Vegas.</h1>
${paragraph('I’m Fabrizzio Ruiz, a senior graphic, web and 3D designer based in Asunción, Paraguay, with more than eight years of experience. I was Lead Designer for graphic and web work at Tenth Element in Las Vegas, Nevada, from 2020 to 2022, and I have worked remotely as a freelancer since 2018. I offer white-label design for agencies, branding, trade show booth design, and 3D/AR visualization, and I work hours that overlap US time zones.')}
</div>
<div class="about-layout"><figure class="about-portrait">${imageTag({ src: '/images/fabrizzio-x.webp', alt: 'Fabrizzio Ruiz, graphic and exhibit designer in Asunción, Paraguay.', width: 400, height: 400, loading: 'eager' })}<figcaption><a href="https://x.com/fabrizzioruiz_">@fabrizzioruiz_</a></figcaption></figure><div class="about-copy">
${paragraph('I’m a graphic and exhibit designer in Asunción, Paraguay. I design 3D trade show booths, scenography and environmental graphics, brand identities, packaging, websites and campaigns. I also do white-label design for agencies, so a studio can present the work under its own name.')}
${paragraph('I was Lead Designer at Tenth Element in Las Vegas, Nevada, from 2020 to 2022, on graphic and web design. That period set the standard I still work to: clear communication, careful files, and delivery a US team can present. I’ve been a remote freelancer since 2018, with more than eight years of design experience. From Asunción, my workday overlaps US time zones, and I work with brands, agencies and teams abroad.')}
${paragraph('My booth work covers the job from concept to a production handoff: layout, 3D visualization, graphics, and the files a fabricator needs. I don’t build or install the stand; I coordinate the design with the builder you name. When a review needs it, I provide a 3D/AR model with a NODO3D viewer. El Delta and Foody · ExpoVet are built projects, shown as renders next to photographs of the finished space. Gestecner · Navegestic is a documented concept, with technical views and an interactive model. Indufar Run is a set of five booths for six brands.')}
${paragraph('I work in Adobe Creative Cloud, Figma, Blender and DaVinci Resolve. Engagement can be hourly at $35, a monthly retainer, or a fixed project fee.')}
<ul><li>Tenth Element, 2020–2022, Las Vegas</li><li>Freelance since 2018</li><li>Asunción, Paraguay</li></ul>
${relatedLinks(caseLinks)}
<p><a href="mailto:${site.email}">${site.email}</a> · WhatsApp <a href="https://wa.me/${expoContact.whatsapp}">+595 972 780 989</a></p>
</div></div></main>`;
}

export function englishWorkLead() {
  return `<p class="editorial-note">${caseLinks.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join(' · ')} · ${serviceLinks.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join(' · ')}</p>`;
}

export function englishNavLinks(current = '') {
  return [['/en/white-label-design/', '/white-label-design/', 'White-label'], ['/en/trade-show-booth-design/', '/trade-show-booth-design/', 'Booth design']]
    .map(([href, bare, label]) => `<a href="${href}"${current === bare || current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
}

export { ENTITY_STATEMENT, imageSizes };
