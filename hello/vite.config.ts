import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Each tool in this repo is a self-contained Vite app that builds into its own
// <tool>/dist/ folder and is served by AEM Edge Delivery at that subfolder path.
// This mirrors the proven adobecom/da-express-milo `tools/<tool>/dist/` pattern.
//
// Built entry:  hello/dist/index.html  ->  served at  /hello/dist/index.html
// da.live app:  https://da.live/app/maxn-adobe/pdp-document-generator/hello/dist/index
//
// `base` must equal the served subfolder so the built HTML references its assets at
// /hello/dist/assets/* (absolute paths). In dev (`serve`) the base is just '/'.
export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/hello/dist/'

  return {
    plugins: [react()],
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
      // Different port from the doc generator (3000) so both can run at once locally.
      port: 3001,
    },
  }
})
