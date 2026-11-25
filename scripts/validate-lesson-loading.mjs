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


const quizHtml = await readFile('quiz.html', 'utf8');
const quizDataTag = '<script src="/assets/js/quiz-data.js" defer></script>';
const mainTag = '<script src="/assets/js/main.js" defer></script>';
const quizHubTag = '<script src="/assets/js/quiz-hub.js" defer></script>';
const quizDataIndex = quizHtml.indexOf(quizDataTag);
const quizMainIndex = quizHtml.indexOf(mainTag);
const quizHubIndex = quizHtml.indexOf(quizHubTag);

if (quizDataIndex < 0) errors.push('quiz.html: must load the quiz-only data bundle');
if (quizMainIndex < 0) errors.push('quiz.html: missing main.js');
if (quizHubIndex < 0) errors.push('quiz.html: missing quiz-hub.js');
if (quizDataIndex >= 0 && quizMainIndex >= 0 && quizDataIndex > quizMainIndex) {
  errors.push('quiz.html: quiz data must load before main.js');
}
if (quizMainIndex >= 0 && quizHubIndex >= 0 && quizMainIndex > quizHubIndex) {
  errors.push('quiz.html: main.js must load before quiz-hub.js');
}
if (/assets\/js\/lesson-data\.js/.test(quizHtml)) {
  errors.push('quiz.html: still downloads the full lesson-content bundle');
}

const quizDataSource = await readFile('assets/js/quiz-data.js', 'utf8');
const quizHubSource = await readFile('assets/js/quiz-hub.js', 'utf8');
const quizSlugs = [...quizHubSource.matchAll(/slug:'([^']+)'/g)].map((match) => match[1]);
const dataSlugs = [...quizDataSource.matchAll(/window\.LESSONS\[['"]([^'"]+)['"]\]\s*=\s*\{\s*quiz\s*:/g)]
  .map((match) => match[1]);

if (quizSlugs.length !== dataSlugs.length) {
  errors.push(`quiz-hub.js lists ${quizSlugs.length} quizzes but quiz-data.js defines ${dataSlugs.length}`);
}
for (const slug of quizSlugs) {
  if (!dataSlugs.includes(slug)) errors.push(`quiz-data.js is missing quiz content for ${slug}`);
}


const teacherOsHtml = await readFile('teacher-os.html', 'utf8');
if (/assets\/js\/lesson-data\.js/.test(teacherOsHtml)) {
  errors.push('teacher-os.html: must not download the full lesson-content bundle');
}
if (!teacherOsHtml.includes('<script src="/assets/js/main.js" defer></script>')) {
  errors.push('teacher-os.html: missing shared main.js navigation/search bundle');
}

assert.equal(errors.length, 0, errors.join('\n'));
assert.equal(pageFiles.length, moduleFiles.length, 'Every published lesson page must have exactly one matching module');

console.log(`Validated ${pageFiles.length} lesson pages and ${moduleFiles.length} matching modules.`);
console.log(`Total of all page-specific module files: ${totalPageModuleBytes.toLocaleString()} bytes (each page downloads only its own module).`);
console.log('Lesson pages load one page-specific module; Quiz Hub loads quiz-data.js; Teacher OS skips the full lesson bundle.');
