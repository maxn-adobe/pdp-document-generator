import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Self-contained Vite app for the "doc-generator" tool. Builds into doc-generator/dist/
// and is served by AEM Edge Delivery at that subfolder path (mirrors the proven
// adobecom/da-express-milo `tools/<tool>/dist/` pattern).
//
// Built entry:  doc-generator/dist/index.html  ->  served at  /doc-generator/dist/index.html
// da.live app:  https://da.live/app/maxn-adobe/pdp-document-generator/doc-generator/dist/index
//
// `base` must equal the served subfolder so the built HTML references its assets at
// /doc-generator/dist/assets/* (absolute paths). In dev (`serve`) the base is just '/'.
export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/doc-generator/dist/'

  return {
    plugins: [react(), tailwindcss()],
    base,
    build: {
      rollupOptions: {
        output: {
          // Stable, unhashed names so the committed dist/ diff stays clean.
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    server: {
      port: 3000,
    },
  }
})
