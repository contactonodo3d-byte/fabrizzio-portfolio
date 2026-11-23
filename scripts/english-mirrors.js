import fs from 'node:fs';
import path from 'node:path';
import { dictionary } from '../src/expo-i18n.js';
import { expoFaq, expoFaqEn, expoServiceJsonLd, faqJsonLd, hreflangLinks, jsonLdScript, ORIGIN } from '../src/seo-meta.js';
import { localizedHref } from '../src/locale-path.js';

const extraEnglish = {
  'Diseño de stands 3D y escenografía': '3D booth and scenography design',
  'Concepto, distribución, visualización 3D, escenografía y gráfica para ferias y eventos.': 'Concept, layout, 3D visualization, scenography and graphics for exhibitions and events.',
  'Stands 3D y escenografía en Paraguay · Fabrizzio Ruiz': '3D booths and scenography in Paraguay · Fabrizzio Ruiz',
  'Diseño de stands 3D, escenografía y visualización para ferias. Explora la propuesta Gestecner y el diseño Indufar.': '3D booth design, scenography and visualization for exhibitions. Explore the Gestecner concept and the Indufar design.',
  'Stand Foody durante la feria': 'Foody booth at the exhibition',
  'Foody · Stand en feria': 'Foody · Exhibition booth',
  'Menú': 'Menu',
  'Para preparar la consulta, activa JavaScript o usa los enlaces de contacto directo.': 'To prepare the inquiry, enable JavaScript or use the direct contact links.',
  'Gestecner — Diseño de Fabrizzio Ruiz · 3D / AR': 'Gestecner — Design by Fabrizzio Ruiz · 3D / AR',
  'Propuesta de stand Gestecner Navegestic, diseñada por Fabrizzio Ruiz. Explora el concepto en 3D y realidad aumentada.': 'Gestecner Navegestic booth concept, designed by Fabrizzio Ruiz. Explore the concept in 3D and augmented reality.',
  'Guarda el contacto de Fabrizzio Ruiz y explora su portfolio de Exhibition & Digital Design.': "Save Fabrizzio Ruiz's contact and explore his Exhibition & Digital Design portfolio.",
  'Guarda el contacto de Fabrizzio Ruiz y explora su portfolio de Exhibition &amp; Digital Design.': "Save Fabrizzio Ruiz's contact and explore his Exhibition & Digital Design portfolio.",
  ...Object.fromEntries(expoFaq.flatMap(([question, answer], index) => [
    [question, expoFaqEn[index][0]],
    [answer, expoFaqEn[index][1]],
  ])),
};

function englishFor(text) {
  const key = String(text).trim();
  return extraEnglish[key] || dictionary[key]?.en || null;
}

function escapeText(value) {
  return value.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/</g, '&lt;');
}

function translateText(text) {
  const leading = text.match(/^\s*/)?.[0] || '';
  const trailing = text.match(/\s*$/)?.[0] || '';
  const core = text.trim();
  if (!core) return text;
  if (core.startsWith('Ampliar: ')) {
    const rest = core.slice('Ampliar: '.length);
    const translatedRest = englishFor(rest) || rest;
    return `${leading}Enlarge: ${escapeText(translatedRest)}${trailing}`;
  }
  const translated = englishFor(core);
  if (!translated) return text;
  return `${leading}${escapeText(translated)}${trailing}`;
}

function translateHtml(html) {
  const blocks = [];
  const shielded = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, (block) => {
    blocks.push(block);
    return `\u0000${blocks.length - 1}\u0000`;
  });
  let out = shielded.replace(/>([^<]+)</g, (match, text) => `>${translateText(text)}<`);
  out = out.replace(/\s(alt|aria-label|data-caption|content)="([^"]*)"/g, (match, attr, value) => {
    const next = translateText(value);
    return next === value ? match : ` ${attr}="${next.replace(/"/g, '&quot;')}"`;
  });
  return out.replace(/\u0000(\d+)\u0000/g, (_, index) => blocks[index]);
}

function prefixLinks(html) {
  return html.replace(/<a\b[^>]*>/g, (tag) => {
    if (/hreflang="es"/.test(tag)) return tag;
    return tag.replace(/href="(?:https:\/\/fabrizzioruiz\.com)?(\/[^"]*)"/, (match, href) => {
      if (href.startsWith('/projects/')) {
        const slug = new URL(href, 'https://fabrizzioruiz.com').searchParams.get('project');
        const next = slug && /^[a-z0-9-]+$/.test(slug) ? `/en/work/${slug}/` : '/en/work/';
        return `href="${next}"`;
      }
      const next = localizedHref('en', href);
      return next === href ? match : `href="${next}"`;
    });
  });
}

function retarget(html, from, to) {
  return html
    .replace(`<link rel="canonical" href="${ORIGIN}${from}">`, `<link rel="canonical" href="${ORIGIN}${to}">`)
    .replaceAll(`property="og:url" content="${ORIGIN}${from}"`, `property="og:url" content="${ORIGIN}${to}"`)
    .replace('lang="es"', 'lang="en"')
    .replace('hreflang="es" aria-current="page"', 'hreflang="es"')
    .replace('hreflang="en">', 'hreflang="en" aria-current="page">');
}

const pages = [
  { source: 'expo/index.html', target: 'en/expo/index.html', from: '/expo/', to: '/en/expo/', assets: [['../src/', '/src/']], service: true },
  { source: 'connect/index.html', target: 'en/connect/index.html', from: '/connect/', to: '/en/connect/', assets: [['../src/', '/src/']] },
  {
    source: 'public/expo/gestecner/index.html',
    target: 'public/en/expo/gestecner/index.html',
    from: '/expo/gestecner/',
    to: '/en/expo/gestecner/',
    assets: [['./vendor/', '/expo/gestecner/vendor/'], ['../assets/', '/expo/assets/'], ['../i18n.js', '/expo/i18n.js']],
  },
];

function serviceScripts(language) {
  const service = jsonLdScript(expoServiceJsonLd(language));
  const faq = language === 'en' ? jsonLdScript(faqJsonLd('en')) : '';
  return { service, faq };
}

export function writeEnglishMirrors(root) {
  for (const page of pages) {
    let html = fs.readFileSync(path.join(root, page.source), 'utf8');
    if (!html.includes('hreflang="en"')) {
      html = html.replace(
        `<link rel="canonical" href="${ORIGIN}${page.from}">`,
        `<link rel="canonical" href="${ORIGIN}${page.from}">\n${hreflangLinks(page.from)}`,
      );
      fs.writeFileSync(path.join(root, page.source), html);
    }
    let english = translateHtml(html);
    for (const [from, to] of page.assets) english = english.replaceAll(from, to);
    english = prefixLinks(english);
    english = retarget(english, page.from, page.to);
    if (page.service) {
      const { service, faq } = serviceScripts('en');
      english = english.replace(/<script type="application\/ld\+json">\{"@context": "https:\/\/schema\.org", "@type": "Service"[\s\S]*?<\/script>/, service);
      english = english.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/, faq);
    }
    const file = path.join(root, page.target);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, english);
  }
}
