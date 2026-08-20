// Post-build: place the built HTML entry at the repo ROOT as index.html.
//
// Why: da.live embeds this tool via its "Nx Shell", which iframes
//   https://{ref}--{repo}--{org}.preview.da.live/<path>.html
// The DA preview tier serves the ROOT /index.html but NOT a subfolder /dist/index.html
// (assets under /dist/assets/ are served fine). So the app entry must live at the repo
// root. Vite builds the entry (index.dev.html) to dist/index.dev.html; we copy that to
// ./index.html and drop the intermediate file. Assets remain under /dist/assets/.
//
// Served result: da.live/app/{org}/{repo}/index  ->  root /index.html  ->  /dist/assets/*
import { copyFileSync, rmSync } from 'node:fs'

const built = 'dist/index.dev.html'
copyFileSync(built, 'index.html')
rmSync(built)
console.log('postbuild: wrote ./index.html (served entry) and cleaned up ' + built)
