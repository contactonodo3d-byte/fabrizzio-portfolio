import media from './selected-media.json';

const categories = {
  brand: ['Brand & graphic design', 'Identidad y gráfica', 'Identidade e design gráfico'],
  spatial: ['Spatial design', 'Diseño de espacios', 'Design de espaços'],
  digital: ['Digital design', 'Diseño digital', 'Design digital'],
};

const selected = [
  ['gio-mobili', 'Gio Mobili', 'brand',
    'The Gio Mobili identity across its showroom, entrance, brochure and product tags.',
    'La identidad de Gio Mobili en el showroom, la fachada, el folleto y las etiquetas de producto.',
    'A identidade da Gio Mobili no showroom, na fachada, no folheto e nas etiquetas.'],
  ['casa-albirroja', 'Indufar · Casa Albirroja', 'spatial',
    'From the Somos el Aguante campaign artwork to a stand with its own football table.',
    'De la gráfica de Somos el Aguante al stand con su propia mesa de futbolito.',
    'Da campanha Somos el Aguante ao estande com sua própria mesa de pebolim.'],
  ['recellebrate', 'ReCELLebrate', 'brand',
    'Three pieces from the October social campaign for ReCELLebrate.',
    'Tres piezas de la campaña de octubre de ReCELLebrate para redes.',
    'Três peças da campanha de outubro da ReCELLebrate para redes sociais.'],
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
  ['mosconi', 'Mosconi', 'brand',
    'Social artwork for the Tragos tradicionales series.',
    'Piezas para redes de la serie Tragos tradicionales.',
    'Peças para redes sociais da série Tragos tradicionales.'],
  ['pam-paiva', 'Pam Paiva', 'brand',
    'A five-part social series for a self-makeup course.',
    'Serie de cinco piezas para comunicar un curso de automaquillaje.',
    'Série de cinco peças para divulgar um curso de automaquiagem.'],
  ['abrazo-de-oso', 'PWR × Patagonia · Abrazo de Oso', 'brand',
    'Selected slides from the PWR campaign presentation for Patagonia, including the activation and retail display.',
    'Selección de la presentación de PWR para Patagonia, con la activación de campaña y su exhibición en punto de venta.',
    'Seleção da apresentação da PWR para a Patagonia, com a ativação da campanha e a exposição no ponto de venda.'],
  ['idem', 'IDEM Agromarketing', 'brand',
    'Presentation design for an agricultural marketing agency, from the opening slide to its service infographic.',
    'Presentación para una agencia de agromarketing, desde la portada hasta la infografía de servicios.',
    'Apresentação para uma agência de agromarketing, da capa ao infográfico de serviços.'],
  ['bad-liar', 'Bad Liar', 'digital',
    'Website concept for Bad Liar, pairing its opening artwork with the original page wireframe.',
    'Concepto web de Bad Liar, con la imagen de apertura y el esquema original de la página.',
    'Conceito web para Bad Liar, com a imagem de abertura e o wireframe original da página.'],
  ['protein-bar', 'Protein Bar · Delivery', 'brand',
    'Printed delivery piece with a QR code as the central graphic.',
    'Pieza impresa de delivery directo con el código QR como elemento central.',
    'Peça impressa de delivery direto com o QR code como elemento central.'],
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
  return `<figure>${visual}<figcaption>${item.label}</figcaption></figure>`;
}

export function motionSection() {
  const clips = ['acuo-outro', 'alien', 'bar-de-cejas', 'acuo'];
  return `<section id="motion" class="motion-section" aria-labelledby="motion-heading"><h2 id="motion-heading">Motion graphics</h2><div class="selected-gallery">${clips.map(slug => mediaFigure(media[slug][0], slug === 'bar-de-cejas' ? 'Bar de Cejas' : media[slug][0].label)).join('')}</div></section>`;
}
