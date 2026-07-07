import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const standaloneLandings = {
  '/landing': path.join(__dirname, 'public/landing/index.html'),
  '/landing-en': path.join(__dirname, 'public/landing-en/index.html'),
};

function standaloneLandingPlugin() {
  return {
    name: 'standalone-landing',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        const file = standaloneLandings[url] || standaloneLandings[url?.replace(/\/$/, '')];
        if (file) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          fs.createReadStream(file).pipe(res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), standaloneLandingPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
