import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'expo-directory-route',
    configureServer(server) { server.middlewares.use(expoRedirect); },
    configurePreviewServer(server) { server.middlewares.use(expoRedirect); },
  }],
  build: {
    rollupOptions: {
      input: {
        connect: resolve(import.meta.dirname, 'connect/index.html'),
        expo: resolve(import.meta.dirname, 'expo/index.html'),
        home: resolve(import.meta.dirname, 'index.html'),
        work: resolve(import.meta.dirname, 'work.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        lab: resolve(import.meta.dirname, 'lab.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
      },
    },
  },
});

function expoRedirect(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/connect') { res.writeHead(308, { Location: '/connect/' + url.search }); res.end(); }
  else if (url.pathname === '/expo') { res.writeHead(308, { Location: '/expo/' + url.search }); res.end(); }
  else next();
}
