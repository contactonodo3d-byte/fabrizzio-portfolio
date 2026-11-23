import fs from 'node:fs';
import path from 'node:path';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { publishedProjects } from './src/seo-pages.js';
import { writeStaticSite } from './scripts/write-static-site.js';

const root = import.meta.dirname;
const caseInputs = writeStaticSite(root);
const knownSlugs = new Set(publishedProjects('es').map((project) => project.slug));

const legacyRedirects = {
  '/index.html': '/',
  '/about.html': '/about/',
  '/work.html': '/work/',
  '/services.html': '/services/',
  '/contact.html': '/contact/',
  '/lab.html': '/lab/',
};

function sendStatus(res, status, location) {
  res.writeHead(status, { Location: location });
  res.end();
}

function seoRoutes(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/case-study.html') {
    const slug = url.searchParams.get('project');
    sendStatus(res, 301, slug && knownSlugs.has(slug) ? `/work/${slug}/` : '/work/');
    return;
  }
  const legacy = legacyRedirects[url.pathname];
  if (legacy) { sendStatus(res, 301, legacy + url.search); return; }
  if (url.pathname === '/projects' || url.pathname === '/projects/' || url.pathname === '/projects/index.html') {
    const slug = url.searchParams.get('project');
    if (slug && (!/^[a-z0-9-]+$/.test(slug) || !knownSlugs.has(slug))) { req.url = '/__missing__'; next(); return; }
    sendStatus(res, 301, slug ? `/work/${slug}/` : '/work/');
    return;
  }
  const bareCase = url.pathname.match(/^\/work\/([a-z0-9-]+)$/);
  if (bareCase) { sendStatus(res, 308, `/work/${bareCase[1]}/${url.search}`); return; }
  if (url.pathname === '/connect') { sendStatus(res, 308, '/connect/' + url.search); return; }
  if (url.pathname === '/expo') { sendStatus(res, 308, '/expo/' + url.search); return; }
  if (url.pathname === '/en') { sendStatus(res, 308, '/en/' + url.search); return; }
  if (/^\/en\/(?:work|services|about|contact|lab|expo|connect)(?:\/[a-z0-9-]+)?$/.test(url.pathname)) {
    sendStatus(res, 308, url.pathname + '/' + url.search);
    return;
  }
  if (url.pathname === '/lab/foody-ar-game') { sendStatus(res, 308, '/lab/foody-ar-game/' + url.search); return; }
  if (['/3d', '/3d/foody-exhibidor'].includes(url.pathname)) { sendStatus(res, 308, url.pathname + '/' + url.search); return; }
  if (['/3d/', '/3d/foody-exhibidor/'].includes(url.pathname)) { req.url = url.pathname + 'index.html' + url.search; next(); return; }
  next();
}

function htmlNotFound(siteRoot, notFoundFile) {
  const rootPath = path.resolve(siteRoot);
  return (req, res, next) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith('/@') || pathname.startsWith('/src/') || pathname.startsWith('/node_modules/')) { next(); return; }
    const candidates = [path.join(rootPath, pathname), path.join(rootPath, pathname, 'index.html')];
    const exists = candidates.some((file) => {
      const resolved = path.resolve(file);
      return (resolved === rootPath || resolved.startsWith(rootPath + path.sep)) && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    });
    if (exists) { next(); return; }
    res.statusCode = 404;
    const page = !pathname.includes('.') || pathname.endsWith('.html') || pathname.endsWith('/');
    res.setHeader('content-type', page ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8');
    if (page && fs.existsSync(notFoundFile)) res.end(fs.readFileSync(notFoundFile));
    else res.end('Not found');
  };
}

export default defineConfig({
  base: '/',
  appType: 'mpa',
  plugins: [{
    name: 'seo-routes',
    configureServer(server) {
      server.middlewares.use(seoRoutes);
      return () => server.middlewares.use(htmlNotFound(root, resolve(root, '404.html')));
    },
    configurePreviewServer(server) {
      server.middlewares.use(seoRoutes);
      return () => server.middlewares.use(htmlNotFound(resolve(root, 'dist'), resolve(root, 'dist/404.html')));
    },
  }],
  build: {
    rollupOptions: {
      input: {
        connect: resolve(root, 'connect/index.html'),
        expo: resolve(root, 'expo/index.html'),
        home: resolve(root, 'index.html'),
        work: resolve(root, 'work/index.html'),
        legacyServices: resolve(root, 'services.html'),
        legacyLab: resolve(root, 'lab.html'),
        legacyAbout: resolve(root, 'about.html'),
        legacyContact: resolve(root, 'contact.html'),
        legacyCasestudy: resolve(root, 'case-study.html'),
        legacyWork: resolve(root, 'work.html'),
        caseStudy: resolve(root, 'projects/index.html'),
        services: resolve(root, 'services/index.html'),
        lab: resolve(root, 'lab/index.html'),
        about: resolve(root, 'about/index.html'),
        contact: resolve(root, 'contact/index.html'),
        notFound: resolve(root, '404.html'),
        ...caseInputs,
      },
    },
  },
});
