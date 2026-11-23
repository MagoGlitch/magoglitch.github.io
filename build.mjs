// Build do portfólio: compila src/app.jsx -> app.js e o Tailwind -> styles.css,
// e atualiza o número de versão no index.html para o navegador não usar cache antigo.
// Uso: npm install (uma vez) e depois npm run build
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

await build({
  entryPoints: ['src/app.jsx'],
  outfile: 'app.js',
  bundle: false,
  minify: true,
  target: ['es2019'],
  loader: { '.jsx': 'jsx' },
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  legalComments: 'none',
});

execSync('npx tailwindcss -c tailwind.config.js -i src/tailwind.css -o styles.css --minify', { stdio: 'inherit' });

const hash = createHash('sha1')
  .update(readFileSync('app.js'))
  .update(readFileSync('styles.css'))
  .update(readFileSync('projects-data.js'))
  .digest('hex')
  .slice(0, 8);
const html = readFileSync('index.html', 'utf8')
  .replace(/projects-data\.js(\?v=[\w_]+)?/, `projects-data.js?v=${hash}`)
  .replace(/app\.js\?v=[\w_]+/, `app.js?v=${hash}`)
  .replace(/styles\.css\?v=[\w_]+/, `styles.css?v=${hash}`);
writeFileSync('index.html', html);
console.log(`Build ok (versão ${hash})`);
