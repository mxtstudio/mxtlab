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


const apiCacheHeaders = (config.headers || []).find((rule) => rule.source === '/api/:path*')?.headers || [];
assert.ok(
  apiCacheHeaders.some((header) => header.key.toLowerCase() === 'x-vercel-enable-rewrite-caching' && header.value === '0'),
  'Authenticated API proxy responses must not be cached by Vercel',
);

console.log('API proxy configuration is valid.');
