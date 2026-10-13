import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'fix-malformed-percent-uri',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.includes('100%/')) {
            req.url = req.url.replaceAll('100%/', '100%25/');
          }
          next();
        });
      }
    }
  ]
});
