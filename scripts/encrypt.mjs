import { access, mkdir, readdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

try {
  await access('site/index.html');
} catch {
  console.error('Missing site/index.html. Run npm run decrypt to recover the current page, or add your HTML there.');
  process.exit(1);
}

// Keep the publishing directory restricted to the encrypted page and .nojekyll.
await mkdir('docs', { recursive: true });
const unexpected = (await readdir('docs')).filter(name => !['index.html', '.nojekyll'].includes(name));
if (unexpected.length) {
  console.error('Remove extra files from docs before encrypting. Embed assets in site/index.html.');
  process.exit(1);
}

const result = spawnSync(process.execPath, [
  'node_modules/staticrypt/cli/index.js', 'site/index.html',
  '--directory', 'docs',
  '--config', 'false',
  '--remember', 'false',
  '--short',
  '--template-title', 'Bask Demo',
  '--template-instructions', 'Enter the password to view the Bask demo.',
  '--template-button', 'Enter demo',
  '--template-error', 'That password is incorrect. Please try again.',
  '--template-color-primary', '#254f45',
  '--template-color-secondary', '#f4f1e8'
], { stdio: 'inherit' });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
await writeFile('docs/.nojekyll', '');
const check = spawnSync(process.execPath, ['scripts/check.mjs'], { stdio: 'inherit' });
if (check.error) throw check.error;
process.exit(check.status ?? 1);
