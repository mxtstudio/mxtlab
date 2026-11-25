import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const apiRewrites = (config.rewrites || []).filter((rewrite) => rewrite.source === '/api/:path*');

assert.equal(apiRewrites.length, 1, 'Expected exactly one same-path API proxy rule');
assert.equal(
  apiRewrites[0].destination,
  'https://www.mxtlab.online/api/:path*',
  'API proxy must target the verified Next.js custom domain and preserve the API path',
);
assert.equal(
  (config.rewrites || []).length,
  1,
  'Do not add broad or unrelated rewrites to the static-site project',
);

console.log('API proxy configuration is valid.');
