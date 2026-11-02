import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const files = (await readdir('docs')).sort();
assert.deepEqual(files, ['.nojekyll', 'index.html'], 'Publish only the encrypted HTML and .nojekyll.');
const html = await readFile('docs/index.html', 'utf8');
assert.ok(/"staticryptEncryptedMsgUniqueVariableName":\s*"[a-f0-9]+"/.test(html), 'The page must contain encrypted content.');
assert.ok(html.includes('id="staticrypt-form"'), 'The page must include the password gate.');
assert.ok(!html.includes('BASK_PRIVATE_CONTENT'), 'Unencrypted placeholder content must never be published.');
console.log('Encrypted publishing files verified.');
