import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const pageDir = 'lessons';
const moduleDir = 'assets/js/lessons';
const pageFiles = (await readdir(pageDir)).filter((name) => name.endsWith('.html')).sort();
const moduleFiles = (await readdir(moduleDir)).filter((name) => name.endsWith('.js')).sort();
const moduleSet = new Set(moduleFiles);
const pageSlugs = new Set();
const errors = [];
let totalPageModuleBytes = 0;

for (const pageFile of pageFiles) {
  const slug = basename(pageFile, '.html');
  pageSlugs.add(slug);
  const moduleFile = `${slug}.js`;
  if (!moduleSet.has(moduleFile)) {
    errors.push(`${pageFile}: missing ${moduleDir}/${moduleFile}`);
    continue;
  }

  const html = await readFile(join(pageDir, pageFile), 'utf8');
  const expectedScript = `../assets/js/lessons/${moduleFile}`;
  const moduleTag = `<script src="${expectedScript}" defer></script>`;
  const moduleIndex = html.indexOf(moduleTag);
  const mainIndex = html.indexOf('../assets/js/main.js');

  if (moduleIndex < 0) errors.push(`${pageFile}: does not load its matching lesson module`);
  if (mainIndex < 0) errors.push(`${pageFile}: missing main.js`);
  if (moduleIndex >= 0 && mainIndex >= 0 && moduleIndex > mainIndex) {
    errors.push(`${pageFile}: lesson module must load before main.js`);
  }
  if (/assets\/js\/(?:lesson-data|quiz-data)\.js/.test(html)) {
    errors.push(`${pageFile}: still downloads a site-wide lesson or quiz data bundle`);
  }

  const moduleSource = await readFile(join(moduleDir, moduleFile), 'utf8');
  const keyPattern = new RegExp(`window\\.LESSONS\\[['"]${slug}['"]\\]\\s*=`);
  if (!keyPattern.test(moduleSource)) errors.push(`${moduleFile}: lesson key does not match its filename`);
  for (const field of ['title:', 'content:', 'quiz:']) {
    if (!moduleSource.includes(field)) errors.push(`${moduleFile}: missing required ${field.slice(0, -1)} field`);
  }
  totalPageModuleBytes += Buffer.byteLength(moduleSource);
}

for (const moduleFile of moduleFiles) {
  const slug = basename(moduleFile, '.js');
  if (!pageSlugs.has(slug)) errors.push(`${moduleFile}: no matching published lesson page`);
}

assert.equal(errors.length, 0, errors.join('\n'));
assert.equal(pageFiles.length, moduleFiles.length, 'Every published lesson page must have exactly one matching module');

console.log(`Validated ${pageFiles.length} lesson pages and ${moduleFiles.length} matching modules.`);
console.log(`Total of all page-specific module files: ${totalPageModuleBytes.toLocaleString()} bytes (each page downloads only its own module).`);
console.log('No lesson page loads the site-wide lesson-data.js or quiz-data.js bundles.');
