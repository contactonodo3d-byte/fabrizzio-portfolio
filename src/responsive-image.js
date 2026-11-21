import { imageVariants } from './image-variants.js';

export const imageSizes = {
  hero: '(max-width: 700px) calc(100vw - 36px), (max-width: 1504px) calc(100vw - 64px), 1376px',
  card: '(max-width: 700px) calc(100vw - 36px), (max-width: 1504px) calc((100vw - 82px) / 2), 679px',
  album: '(max-width: 700px) 78vw, 330px',
  showcase: '(max-width: 700px) 60vw, 40vw',
  directory: '(max-width: 600px) calc(100vw - 36px), (max-width: 1100px) calc((100vw - 84px) / 2), 445px',
  gallery: '(max-width: 600px) calc(100vw - 64px), (max-width: 1100px) calc((100vw - 104px) / 2), 430px',
  galleryWide: '(max-width: 1504px) calc(100vw - 64px), 1376px',
  case: '(max-width: 1504px) calc(100vw - 64px), 1376px',
  booth: '(max-width: 1100px) calc(100vw - 36px), 720px',
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function normalizeSrc(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('./')) return src.slice(1);
  return src.startsWith('/') ? src : `/${src}`;
}

export function imageTag({ src, alt = '', width, height, loading = 'lazy', sizes, fetchPriority, className }) {
  const url = normalizeSrc(src);
  if (!url) return '';
  const extras = imageVariants[url] || [];
  const intrinsic = Number(width);
  const srcset = extras.length && intrinsic
    ? [...extras, { src: url, width: intrinsic }].map((item) => `${item.src} ${item.width}w`).join(', ')
    : '';
  const attrs = [
    className ? `class="${escapeHtml(className)}"` : '',
    `src="${escapeHtml(url)}"`,
    srcset ? `srcset="${srcset}"` : '',
    srcset && sizes ? `sizes="${sizes}"` : '',
    `alt="${escapeHtml(alt)}"`,
    width ? `width="${width}"` : '',
    height ? `height="${height}"` : '',
    loading ? `loading="${loading}"` : '',
    fetchPriority ? `fetchpriority="${fetchPriority}"` : '',
    loading === 'lazy' ? 'decoding="async"' : '',
  ].filter(Boolean);
  return `<img ${attrs.join(' ')}>`;
}
