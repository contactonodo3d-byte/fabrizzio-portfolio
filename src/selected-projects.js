import media from './selected-media.json';

const categories = {
  presentations: ['Pitch decks / Presentations', 'Pitch decks / Presentaciones', 'Pitch decks / Apresentações'],
  brand: ['Brand & graphic design', 'Identidad y gráfica', 'Identidade e design gráfico'],
  spatial: ['Spatial design', 'Diseño de espacios', 'Design de espaços'],
  digital: ['Digital design', 'Diseño digital', 'Design digital'],
};

const selected = [
  ['adm-human-rights-report', 'ADM · Human Rights Policy Implementation', 'presentations',
    'A 30-slide presentation of ADM’s 2022 human rights report, with supply-chain maps, performance indicators and community programs.',
    'Presentación de 30 diapositivas del informe de derechos humanos de ADM de 2022, con mapas, indicadores y programas comunitarios.',
    'Apresentação de 30 slides do relatório de direitos humanos da ADM de 2022, com mapas, indicadores e programas comunitários.'],
  ['indufar-2026', 'Indufar 2026', 'spatial',
    'Race graphics, stage screens and exhibition stands for Indufar Run and the brand’s 2026 activations.',
    'Gráfica de carrera, pantallas de escenario y stands de Indufar Run y las activaciones de la marca en 2026.',
    'Peças de corrida, telas de palco e estandes da Indufar Run e das ativações da marca em 2026.'],
  ['acuo-redes', 'ACUO · Social media', 'digital',
    'Campaign artwork, infographics, interviews and reels from the ACUO social archive.',
    'Gráficas de campaña, infografías, entrevistas y reels del archivo de redes de ACUO.',
    'Artes de campanha, infográficos, entrevistas e reels do arquivo de redes sociais da ACUO.'],
  ['gio-mobili', 'Gio Mobili', 'brand',
    'The Gio Mobili identity across its showroom, entrance, brochure and product tags.',
    'La identidad de Gio Mobili en el showroom, la fachada, el folleto y las etiquetas de producto.',
    'A identidade da Gio Mobili no showroom, na fachada, no folheto e nas etiquetas.'],
  ['casa-albirroja', 'Indufar · Casa Albirroja', 'spatial',
    'From the Somos el Aguante campaign artwork to a stand with its own football table.',
    'De la gráfica de Somos el Aguante al stand con su propia mesa de futbolito.',
    'Da campanha Somos el Aguante ao estande com sua própria mesa de pebolim.'],
  ['recellebrate', 'ReCELLebrate', 'brand',
    'Social campaign series, email graphics and mobile layouts for ReCELLebrate.',
    'Series para redes sociales, gráfica de email y aplicaciones móviles de ReCELLebrate.',
    'Séries para redes sociais, peças de e-mail e aplicações móveis da ReCELLebrate.'],
  ['bar-de-cejas', 'Bar de Cejas', 'spatial',
    'A 3D walkthrough of the brow bar shows how the counters and workstations fit into its footprint.',
    'Un recorrido 3D por el bar de cejas muestra la distribución de los mostradores y los puestos de atención.',
    'Um passeio em 3D pelo bar de sobrancelhas mostra a disposição dos balcões e postos de atendimento.'],
  ['black-sail', 'Black Sail', 'brand',
    'The sailboat mark on a reception wall and in a new corporate stationery mockup.',
    'El velero de Black Sail en recepción y en un nuevo mockup de papelería corporativa.',
    'O veleiro da Black Sail na recepção e em um novo mockup de papelaria corporativa.'],
  ['vegas-valley', 'Vegas Valley SAR', 'brand',
    'Two badge designs and a concept mockup of the mountain emblem embroidered on a field bag.',
    'Dos propuestas de insignia y un mockup del emblema de montaña bordado sobre un bolso de campo.',
    'Duas propostas de insígnia e um mockup do emblema de montanha bordado em uma bolsa de campo.'],
  ['pam-paiva', 'Pam Paiva', 'brand',
    'A five-part social series for a self-makeup course.',
    'Serie de cinco piezas para comunicar un curso de automaquillaje.',
    'Série de cinco peças para divulgar um curso de automaquiagem.'],
  ['abrazo-de-oso', 'PWR × Patagonia · Abrazo de Oso', 'presentations',
    'Selected slides from the PWR campaign presentation for Patagonia, including the activation and retail display.',
    'Selección de la presentación de PWR para Patagonia, con la activación de campaña y su exhibición en punto de venta.',
    'Seleção da apresentação da PWR para a Patagonia, com a ativação da campanha e a exposição no ponto de venda.'],
  ['idem', 'IDEM Agromarketing', 'presentations',
    'Presentation design for an agricultural marketing agency, from the opening slide to its service infographic.',
    'Presentación para una agencia de agromarketing, desde la portada hasta la infografía de servicios.',
    'Apresentação para uma agência de agromarketing, da capa ao infográfico de serviços.'],
  ['bad-liar', 'Bad Liar', 'digital',
    'The full Bad Liar website design, from the opening artwork to the cocktail recipes, contact form and footer.',
    'Diseño web de Bad Liar, desde la portada hasta las recetas de cócteles, el formulario de contacto y el pie de página.',
    'Design do site da Bad Liar, da abertura às receitas de coquetéis, ao formulário de contato e ao rodapé.'],
  ['protein-bar', 'Protein Bar', 'brand',
    'Social posts for Protein Bar’s smoothies, cold-pressed juices and café, alongside its printed delivery piece.',
    'Piezas para redes sobre los smoothies, los jugos prensados en frío y el café de Protein Bar, junto a su gráfica de delivery.',
    'Peças para redes sociais sobre smoothies, sucos prensados a frio e o café da Protein Bar, além do material impresso de delivery.'],
  ['acuo', 'ACUO · Cosmic', 'digital',
    'A vertical video presenting the Cosmic website on a mobile screen.',
    'Video vertical de presentación del sitio Cosmic en una pantalla móvil.',
    'Vídeo vertical de apresentação do site Cosmic em uma tela de celular.'],
];

export function selectedProjects(language) {
  const index = { en: 0, es: 1, pt: 2 }[language];
  return selected.map(([slug, title, category, ...notes]) => ({
    slug, title, label: categories[category][index], note: notes[index],
    className: 'project-' + category, thumbnail: media[slug][0].url,
    href: './case-study.html?project=' + slug, gallery: media[slug],
  }));
}

export function mediaFigure(item, title) {
  const dimensions = 'width="' + item.width + '" height="' + item.height + '"';
  const visual = item.video
    ? `<video controls playsinline preload="none" poster="${item.url}" ${dimensions} aria-label="${title} · ${item.label}" src="${item.video}"></video>`
    : `<img src="${item.url}" ${dimensions} alt="${title} · ${item.label}" loading="lazy">`;
  return `<figure${item.longPage ? ' class="long-web-design"' : ''}>${item.expandable ? `<a href="${item.url}">${visual}</a>` : visual}<figcaption>${item.label}</figcaption></figure>`;
}

export function caseGallery(project) {
  const groups = new Map();
  for (const item of project.gallery) {
    const key = item.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return Array.from(groups, ([name, items]) => {
    const figures = items.map(item => mediaFigure(item, project.title)).join('');
    if (!name) return `<div class="selected-gallery case-gallery">${figures}</div>`;
    return `<section class="campaign-gallery"><h2>${name}</h2><div class="selected-gallery">${figures}</div></section>`;
  }).join('');
}

export function motionSection() {
  const clips = ['acuo-outro', 'alien', 'bar-de-cejas', 'acuo'];
  return `<section id="motion" class="motion-section" aria-labelledby="motion-heading"><h2 id="motion-heading">Motion graphics</h2><div class="selected-gallery">${clips.map(slug => mediaFigure(media[slug][0], slug === 'bar-de-cejas' ? 'Bar de Cejas' : media[slug][0].label)).join('')}</div></section>`;
}
