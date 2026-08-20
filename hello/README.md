# Hello

A minimal, self-contained Vite + React app — the proof-of-concept that this repo can host multiple DA tools side-by-side, each served from its own subfolder. See the repo-level [../README.md](../README.md) and [../SERVING.md](../SERVING.md).

Opens in DA at: **https://da.live/app/maxn-adobe/pdp-document-generator/hello/dist/index**

```bash
npm install
npm run dev     # local dev server (port 3001)
npm run build   # compiles to ./dist (commit the result)
```

Built output lives in `dist/` (committed) and is served at `/hello/dist/`. `vite.config.ts` sets the production `base` to `/hello/dist/` so the built HTML references its assets correctly.
