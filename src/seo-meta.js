export const ORIGIN = 'https://fabrizzioruiz.com';

export function absoluteUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path.replace(/^\.\//, '')}`;
  return ORIGIN + normalized;
}

export function projectTitle(project) {
  return `${project.title} · ${project.label} · Fabrizzio Ruiz`;
}

export function projectDescription(project) {
  return project.note || project.overview || '';
}

const images = {
  foody: { image: '/images/selected/foody/foto-5.webp', imageAlt: 'Stand Foody durante la feria', width: 1280, height: 720 },
  casa: { image: '/images/selected/casa-albirroja/expo-nocturna.webp', imageAlt: 'Indufar · Casa Albirroja, stand en feria', width: 1536, height: 1024 },
  portrait: { image: '/images/fabrizzio-x.webp', imageAlt: 'Fabrizzio Ruiz', width: 400, height: 400 },
  gestecner: { image: '/expo/assets/gestecner-op1-render.webp', imageAlt: 'Gestecner · Render de diseño', width: 1792, height: 878 },
  delta: { image: '/expo/assets/delta-photo-general.webp', imageAlt: 'El Delta · Fotografía del espacio realizado', width: 1600, height: 1200 },
};

export const pageMeta = {
  es: {
    '/': { title: 'Stands 3D y escenografía · Fabrizzio Ruiz', description: 'Diseño de stands 3D para ferias, escenografía y gráfica ambiental en Paraguay. También branding, packaging y diseño white-label para agencias.', ...images.foody },
    '/work/': { title: 'Proyectos de stands 3D y diseño · Fabrizzio Ruiz', description: 'Stands para ferias, escenografía, gráfica ambiental, branding, packaging y diseño white-label. Casos de Fabrizzio Ruiz.', ...images.casa },
    '/about/': { title: 'Sobre Fabrizzio Ruiz · Stands 3D y escenografía', description: 'Diseñador en Asunción, Paraguay. Antes Lead Designer en Tenth Element (Las Vegas, NV) y freelance remoto desde 2018. Stands 3D, escenografía y diseño white-label.', ...images.portrait },
    '/services/': { title: 'Servicios de stands 3D y diseño · Fabrizzio Ruiz', description: 'Stands 3D para ferias, escenografía, gráfica ambiental y diseño white-label para agencias. También branding, packaging y diseño web.', ...images.gestecner },
    '/contact/': { title: 'Contacto · Stands 3D y diseño · Fabrizzio Ruiz', description: 'Escribí a Fabrizzio Ruiz para un stand 3D, escenografía, gráfica ambiental, branding, packaging o diseño white-label para agencias.', ...images.delta },
    '/lab/': { title: 'Lab · Juegos, AR y experimentos · Fabrizzio Ruiz', description: 'Juegos, realidad aumentada y experimentos de Fabrizzio Ruiz, incluidos Foody AR Farm y el visor 3D del stand Gestecner.', ...images.gestecner },
  },
  en: {
    '/': { title: '3D trade-show booths and scenography · Fabrizzio Ruiz', description: '3D trade-show booths, scenography and environmental graphics from Paraguay, plus branding, packaging and white-label design for agencies.', ...images.foody },
    '/work/': { title: '3D booth and design projects · Fabrizzio Ruiz', description: 'Trade-show booths, scenography, environmental graphics, branding, packaging and white-label design. Selected work by Fabrizzio Ruiz.', ...images.casa },
    '/about/': { title: 'About Fabrizzio Ruiz · 3D booths and scenography', description: 'Designer in Asunción, Paraguay. Former Lead Designer at Tenth Element (Las Vegas, NV) and a remote freelance designer since 2018.', ...images.portrait },
    '/services/': { title: '3D booth and design services · Fabrizzio Ruiz', description: '3D trade-show booths, scenography, environmental graphics and white-label design for agencies, plus branding, packaging and web design.', ...images.gestecner },
    '/contact/': { title: 'Contact · 3D booths and design · Fabrizzio Ruiz', description: 'Write to Fabrizzio Ruiz about a 3D trade-show booth, scenography, environmental graphics, or white-label design for an agency.', ...images.delta },
    '/lab/': { title: 'Lab · Games, AR and experiments · Fabrizzio Ruiz', description: 'Games, augmented reality and experiments by Fabrizzio Ruiz, including Foody AR Farm and the Gestecner 3D booth viewer.', ...images.gestecner },
  },
  pt: {
    '/': { title: 'Estandes 3D e cenografia · Fabrizzio Ruiz', description: 'Design de estandes 3D para feiras, cenografia e gráfica ambiental no Paraguai. Também branding, packaging e design white-label para agências.', ...images.foody },
    '/work/': { title: 'Projetos de estandes 3D e design · Fabrizzio Ruiz', description: 'Estandes para feiras, cenografia, gráfica ambiental, branding, packaging e design white-label. Projetos de Fabrizzio Ruiz.', ...images.casa },
    '/about/': { title: 'Sobre Fabrizzio Ruiz · Estandes 3D e cenografia', description: 'Designer em Assunção, Paraguai. Antes Lead Designer na Tenth Element (Las Vegas, NV) e freelancer remoto desde 2018.', ...images.portrait },
    '/services/': { title: 'Serviços de estandes 3D e design · Fabrizzio Ruiz', description: 'Estandes 3D para feiras, cenografia, gráfica ambiental e design white-label para agências. Também branding, packaging e web design.', ...images.gestecner },
    '/contact/': { title: 'Contato · Estandes 3D e design · Fabrizzio Ruiz', description: 'Escreva a Fabrizzio Ruiz sobre um estande 3D, cenografia, gráfica ambiental ou design white-label para uma agência.', ...images.delta },
    '/lab/': { title: 'Lab · Jogos, AR e experimentos · Fabrizzio Ruiz', description: 'Jogos, realidade aumentada e experimentos de Fabrizzio Ruiz, incluindo Foody AR Farm e o visualizador 3D do estande Gestecner.', ...images.gestecner },
  },
};

export function metaFor(language, path) {
  return (pageMeta[language] || pageMeta.es)[path] || null;
}

export function jsonLdScript(data) {
  return (Array.isArray(data) ? data : [data]).filter(Boolean).map((obj) => (
    `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`
  )).join('\n');
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${ORIGIN}/#fabrizzio`,
    name: 'Fabrizzio Ruiz',
    url: `${ORIGIN}/`,
    image: `${ORIGIN}/images/fabrizzio-x.webp`,
    jobTitle: 'Diseñador de stands 3D y escenografía',
    description: 'Former Lead Designer at Tenth Element (Las Vegas, NV). Remote freelance designer since 2018. Designs 3D trade-show booths, scenography, environmental graphics, branding, packaging and white-label design for agencies. Based in Paraguay.',
    email: 'hello@fabrizzioruiz.com',
    telephone: '+595972780989',
    address: { '@type': 'PostalAddress', addressLocality: 'Asunción', addressCountry: 'PY' },
    sameAs: ['https://x.com/fabrizzioruiz_', 'https://www.linkedin.com/in/fabriz7io/'],
    knowsAbout: ['3D trade-show booth design', 'Scenography', 'Escenografía', 'Environmental graphics', 'Branding', 'Packaging', 'White-label design'],
    worksFor: { '@type': 'Organization', name: 'Fabrizzio Ruiz', description: 'Remote freelance designer since 2018', url: `${ORIGIN}/` },
    affiliation: { '@type': 'Organization', name: 'Tenth Element', description: 'Former Lead Designer, Las Vegas, NV' },
  };
}

export function professionalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${ORIGIN}/#practice`,
    name: 'Fabrizzio Ruiz',
    url: `${ORIGIN}/services/`,
    image: `${ORIGIN}/images/fabrizzio-x.webp`,
    email: 'hello@fabrizzioruiz.com',
    telephone: '+595972780989',
    areaServed: [{ '@type': 'Country', name: 'Paraguay' }, { '@type': 'Place', name: 'Worldwide' }],
    address: { '@type': 'PostalAddress', addressLocality: 'Asunción', addressCountry: 'PY' },
    provider: { '@id': `${ORIGIN}/#fabrizzio` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Design services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diseño de stands 3D para ferias', serviceType: '3D trade-show booth design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Escenografía', serviceType: 'Scenography' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gráfica ambiental', serviceType: 'Environmental graphics' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diseño white-label para agencias', serviceType: 'White-label design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Branding y packaging', serviceType: 'Branding and packaging' } },
      ],
    },
  };
}

export const expoFaq = [
  ['¿Puedo consultar si ya tengo quién fabrique el stand?', 'Sí. Contame quién producirá el espacio y qué documentación necesita. Definimos el diseño y los archivos a preparar según ese proceso.'],
  ['¿Qué recibo al finalizar?', 'Los entregables se acuerdan en la propuesta. Según el proyecto, pueden incluir renders, una presentación del concepto, vistas con medidas y archivos gráficos para producción. Confirmamos formatos y alcance antes de comenzar.'],
  ['¿El servicio incluye fabricación y montaje?', 'Esta página presenta mi trabajo de diseño y visualización. Para cotizar, indicá si además necesitás producción o montaje, así podemos definir qué parte requiere un proveedor especializado.'],
  ['¿Cuánto cuesta y cuánto tiempo lleva?', 'Depende de las dimensiones, complejidad, entregables y fecha del evento. Compartí esos datos para recibir una propuesta adaptada a tu proyecto.'],
];

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${ORIGIN}/expo/#faq`,
    url: `${ORIGIN}/expo/`,
    mainEntity: expoFaq.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

export function creativeWorkJsonLd(project) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${ORIGIN}${project.href}#work`,
    name: project.title,
    headline: project.title,
    description: projectDescription(project),
    url: `${ORIGIN}${project.href}`,
    creator: { '@id': `${ORIGIN}/#fabrizzio` },
    inLanguage: 'es',
  };
  if (project.thumbnail) data.image = absoluteUrl(project.thumbnail);
  return data;
}
