import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/dist/'

  return {
    plugins: [react(), tailwindcss()],
    base,
    build: {
      rollupOptions: {
        // The HTML entry template is index.dev.html, NOT index.html. The built app is
        // served at the repo ROOT as index.html (see scripts/postbuild.mjs), because
        // da.live embeds tools via its Nx Shell, which iframes
        // {ref}--{repo}--{org}.preview.da.live/<path>.html — and that preview tier serves
        // the root /index.html but not a subfolder /dist/index.html. Assets stay under
        // /dist/assets/ (referenced via base '/dist/'), which the preview tier does serve.
        input: fileURLToPath(new URL('./index.dev.html', import.meta.url)),
        output: {
          // Pinned to index.js (not [name]) so the bundle name is stable regardless of
          // the entry template's filename (index.dev.html). Single-entry SPA, no hashing.
          entryFileNames: 'assets/index.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    server: {
      port: 3000,
      // Dev entry is index.dev.html (the root index.html is the built output).
      open: '/index.dev.html',
    },
  }
})
