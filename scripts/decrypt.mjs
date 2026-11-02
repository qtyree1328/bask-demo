import { access, mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

try {
  await access('site/index.html');
  console.error('site/index.html already exists. Move it aside before decrypting to avoid overwriting your work.');
  process.exit(1);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

await mkdir('site', { recursive: true });
// The CLI must hash the password with the encrypted page's original salt.
const encrypted = await readFile('docs/index.html', 'utf8');
const salt = encrypted.match(/"staticryptSaltUniqueVariableName":\s*"([a-f0-9]{32})"/)?.[1];
if (!salt) {
  console.error('Could not find the encryption salt in docs/index.html.');
  process.exit(1);
}
const result = spawnSync(process.execPath, [
  'node_modules/staticrypt/cli/index.js', 'docs/index.html',
  '--decrypt', '--directory', 'site', '--config', 'false', '--short', '--salt', salt
], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
try {
  await access('site/index.html');
} catch {
  console.error('Decryption failed. Check the password and try again.');
  process.exit(1);
}
