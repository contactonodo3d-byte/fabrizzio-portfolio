import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const VIRTUAL_ID = 'virtual:expo-models';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

const MODELS = [
  { key: 'glb', file: 'public/expo/assets/model.glb', pathname: '/expo/assets/model.glb' },
  { key: 'usdz', file: 'public/expo/assets/model.usdz', pathname: '/expo/assets/model.usdz' },
];

export function hashFile(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex').slice(0, 12);
}

export function modelVersions(root) {
  const versions = {};
  for (const model of MODELS) {
    const hash = hashFile(resolve(root, model.file));
    versions[model.key] = `${model.pathname}?v=${hash}`;
    versions[`${model.key}Hash`] = hash;
  }
  return versions;
}

export function renderServiceWorker(versions) {
  const current = {
    '/expo/assets/model.glb': versions.glbHash,
    '/expo/assets/model.usdz': versions.usdzHash,
  };
  const cacheName = `expo-3d-${createHash('sha256').update(JSON.stringify(current)).digest('hex').slice(0, 12)}`;
  return `/* Expo 3D cache ${cacheName}. GitHub Pages cannot set Cache-Control, so models are cached here by content-hashed URL. */
const CACHE = ${JSON.stringify(cacheName)};
const CURRENT = ${JSON.stringify(current)};

async function deleteStaleCaches() {
  const names = await caches.keys();
  await Promise.all(names.filter((name) => name.startsWith('expo-3d-') && name !== CACHE).map((name) => caches.delete(name)));
  const cache = await caches.open(CACHE);
  const keys = await cache.keys();
  await Promise.all(keys.map((request) => {
    const url = new URL(request.url);
    return CURRENT[url.pathname] === url.searchParams.get('v') ? undefined : cache.delete(request);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await deleteStaleCaches();
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data !== 'version') return;
  event.waitUntil((async () => {
    await deleteStaleCaches();
    const names = await caches.keys();
    event.ports[0]?.postMessage({ cache: CACHE, current: CURRENT, names });
  })());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }
  if (event.request.method !== 'GET' || CURRENT[url.pathname] !== url.searchParams.get('v')) return;
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  await deleteStaleCaches();
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return labeled(cached, 'hit');
  const response = await fetch(request);
  if (response && response.status === 200) {
    const copy = response.clone();
    const headers = new Headers(copy.headers);
    headers.delete('content-encoding');
    headers.delete('content-length');
    await cache.put(request, new Response(await copy.blob(), { status: copy.status, statusText: copy.statusText, headers }));
  }
  return response;
}

async function labeled(response, value) {
  const headers = new Headers(response.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.set('X-Expo-Cache', value);
  return new Response(await response.blob(), { status: response.status, statusText: response.statusText, headers });
}
`;
}

function rewriteGestecner(html, versions) {
  const sw = `/expo/sw.js?v=${versions.glbHash}${versions.usdzHash}`;
  return html
    .replace('src="../assets/model.glb"', `src="${versions.glb}"`)
    .replace('ios-src="../assets/model.usdz"', `ios-src="${versions.usdz}"`)
    .replace('"/expo/sw.js"', JSON.stringify(sw));
}

export function expoModelCache() {
  let root = process.cwd();
  return {
    name: 'expo-model-cache',
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      const versions = modelVersions(root);
      const sw = `/expo/sw.js?v=${versions.glbHash}${versions.usdzHash}`;
      return `export const expoModels = ${JSON.stringify({ glb: versions.glb, usdz: versions.usdz })};\nexport const expoSwUrl = ${JSON.stringify(sw)};\nexport function expoModelUrl(kind) {\n  return new URL(expoModels[kind], location.origin).href;\n}\n`;
    },
    configureServer(server) {
      const files = MODELS.map((model) => resolve(root, model.file));
      server.watcher.add(files);
      server.watcher.on('change', (changed) => {
        if (!files.includes(resolve(changed))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
      });
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname === '/expo/sw.js') {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(renderServiceWorker(modelVersions(root)));
          return;
        }
        if (url.pathname === '/expo/gestecner' || url.pathname === '/expo/gestecner/' || url.pathname === '/expo/gestecner/index.html') {
          const html = rewriteGestecner(readFileSync(resolve(root, 'public/expo/gestecner/index.html'), 'utf8'), modelVersions(root));
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
          return;
        }
        next();
      });
    },
    closeBundle() {
      const versions = modelVersions(root);
      const dist = resolve(root, 'dist');
      const htmlPath = resolve(dist, 'expo/gestecner/index.html');
      if (!existsSync(htmlPath)) return;
      writeFileSync(resolve(dist, 'expo/sw.js'), renderServiceWorker(versions));
      writeFileSync(htmlPath, rewriteGestecner(readFileSync(htmlPath, 'utf8'), versions));
    },
  };
}
