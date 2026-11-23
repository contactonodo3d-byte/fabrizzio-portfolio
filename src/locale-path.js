const UNPREFIXED = [
  /^\/3d(\/|$)/,
  /^\/superflyer(\/|$)/,
  /^\/lab\/foody-ar-game(\/|$)/,
  /^\/images\//,
  /^\/src\//,
  /^\/expo\/assets\//,
  /^\/expo\/gestecner\/vendor\//,
  /^\/connect\/assets\//,
  /^\/favicon/,
];

export function languageFromPath(pathname = '/') {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

export function spanishPath(path = '/') {
  if (path === '/en' || path === '/en/') return '/';
  if (path.startsWith('/en/')) {
    const rest = path.slice(3);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return path || '/';
}

export function pairPaths(path = '/') {
  const es = spanishPath(path);
  const en = es === '/' ? '/en/' : `/en${es}`;
  return { es, en };
}

export function stripLocale(pathname = '/') {
  const path = pathname.replace(/\/index\.html$/, '/') || '/';
  return spanishPath(path);
}

export function localizedHref(language, href) {
  if (language !== 'en' || !href || !href.startsWith('/')) return href;
  if (href.startsWith('/en/') || href === '/en' || href === '/en/') return href;
  const hashAt = href.indexOf('#');
  const hash = hashAt >= 0 ? href.slice(hashAt) : '';
  const beforeHash = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = beforeHash.indexOf('?');
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : '';
  const path = (queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash) || '/';
  if (UNPREFIXED.some((pattern) => pattern.test(path))) return href;
  const localized = path === '/' ? '/en/' : `/en${path.startsWith('/') ? path : `/${path}`}`;
  return localized + query + hash;
}
