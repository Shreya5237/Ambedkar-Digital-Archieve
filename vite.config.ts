import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

function staticAssetMiddleware(): Plugin {
  return {
    name: 'serve-archive-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.method || req.method !== 'GET') {
          return next();
        }

        const rawUrl = req.url.split('?')[0];
        const decodedUrl = decodeURIComponent(rawUrl);

        // Handle /image/ or /data/ requests
        if (decodedUrl.startsWith('/image/') || decodedUrl.startsWith('/data/image/')) {
          const rootDir = process.cwd();
          const cleanRel = decodedUrl.startsWith('/data/image/')
            ? decodedUrl.slice('/data/'.length)
            : decodedUrl.slice(1); // e.g. 'image/...'

          // Possible candidate file paths
          const candidates = [
            path.join(rootDir, 'public', cleanRel),
            path.join(rootDir, 'data', cleanRel),
            path.join(rootDir, 'public', cleanRel.replace(/ - /g, ' — ')),
            path.join(rootDir, 'data', cleanRel.replace(/ - /g, ' — ')),
          ];

          let targetFile = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());

          // If still not found, search by filename in public/image or data/image
          if (!targetFile) {
            const requestedFilename = path.basename(decodedUrl).toLowerCase();
            const searchDirs = [
              path.join(rootDir, 'public', 'image'),
              path.join(rootDir, 'data', 'image'),
            ];

            for (const sDir of searchDirs) {
              if (fs.existsSync(sDir)) {
                const subdirs = fs.readdirSync(sDir);
                for (const sub of subdirs) {
                  const subPath = path.join(sDir, sub);
                  if (fs.statSync(subPath).isDirectory()) {
                    const files = fs.readdirSync(subPath);
                    const match = files.find((f) => f.toLowerCase() === requestedFilename);
                    if (match) {
                      targetFile = path.join(subPath, match);
                      break;
                    }
                  }
                }
              }
              if (targetFile) break;
            }
          }

          if (targetFile && fs.existsSync(targetFile)) {
            const ext = path.extname(targetFile).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.pdf': 'application/pdf',
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            fs.createReadStream(targetFile).pipe(res);
            return;
          }
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    staticAssetMiddleware(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
