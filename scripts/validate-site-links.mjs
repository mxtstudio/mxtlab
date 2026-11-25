import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ORIGIN = 'https://mxtlab.online';
const HTML_EXT = '.html';
const CHECKED_TAGS = new Set(['a', 'script', 'link', 'img', 'source', 'video', 'audio', 'iframe']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];
  const parent = path.resolve(directory);

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.next') continue;
    if (entry.name === '.' || entry.name === '..' || entry.name.includes('/') || entry.name.includes('\\')) continue;

    const absolute = path.resolve(parent, entry.name);
    if (path.dirname(absolute) !== parent) continue;

    if (entry.isDirectory()) found.push(...await walk(absolute));
    else if (entry.isFile()) found.push(path.relative(ROOT, absolute).split(path.sep).join('/'));
  }
  return found;
}

function repositoryFilePath(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath);
  const fromRoot = path.relative(ROOT, absolutePath);
  if (fromRoot === '..' || fromRoot.startsWith('..' + path.sep) || path.isAbsolute(fromRoot)) {
    throw new Error('Refusing to read a path outside the repository root.');
  }
  return absolutePath;
}

function findTagEnd(source, start) {
  let quote = '';
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = '';
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }
  return source.length - 1;
}

// A small tokenizer is used instead of regex-based HTML filtering. It respects
// quoted attributes (including data-URI SVGs) and skips script/style raw text.
function parseHtmlTags(source) {
  const tags = [];
  const lowerSource = source.toLowerCase();
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);
    if (start < 0) break;

    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4);
      cursor = commentEnd < 0 ? source.length : commentEnd + 3;
      continue;
    }

    let nameStart = start + 1;
    if (source[nameStart] === '/' || source[nameStart] === '!' || source[nameStart] === '?') {
      cursor = findTagEnd(source, nameStart) + 1;
      continue;
    }

    while (nameStart < source.length) {
      const code = source.charCodeAt(nameStart);
      const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
      const isDigit = code >= 48 && code <= 57;
      if (!isLetter && !isDigit && source[nameStart] !== ':' && source[nameStart] !== '-') break;
      nameStart++;
    }

    if (nameStart === start + 1) {
      cursor = start + 1;
      continue;
    }

    const name = source.slice(start + 1, nameStart).toLowerCase();
    const end = findTagEnd(source, nameStart);
    tags.push({ name, raw: source.slice(start, end + 1) });
    cursor = end + 1;

    if (name === 'script' || name === 'style') {
      const closingStart = lowerSource.indexOf('</' + name, cursor);
      if (closingStart < 0) break;
      cursor = findTagEnd(source, closingStart + name.length + 2) + 1;
    }
  }

  return tags;
}

function readAttribute(tag, wantedName) {
  let cursor = 1;
  while (cursor < tag.length) {
    const code = tag.charCodeAt(cursor);
    const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isDigit = code >= 48 && code <= 57;
    if (!isLetter && !isDigit && tag[cursor] !== ':' && tag[cursor] !== '-') break;
    cursor++;
  }

  while (cursor < tag.length) {
    while (cursor < tag.length && /\s/.test(tag[cursor])) cursor++;
    if (cursor >= tag.length || tag[cursor] === '>' || tag[cursor] === '/') break;

    const nameStart = cursor;
    while (cursor < tag.length && !/[\s=/>]/.test(tag[cursor])) cursor++;
    const name = tag.slice(nameStart, cursor).toLowerCase();
    while (cursor < tag.length && /\s/.test(tag[cursor])) cursor++;

    let value = '';
    if (tag[cursor] === '=') {
      cursor++;
      while (cursor < tag.length && /\s/.test(tag[cursor])) cursor++;
      const quote = tag[cursor] === '"' || tag[cursor] === "'" ? tag[cursor] : '';
      if (quote) {
        cursor++;
        const valueStart = cursor;
        while (cursor < tag.length && tag[cursor] !== quote) cursor++;
        value = tag.slice(valueStart, cursor);
        if (tag[cursor] === quote) cursor++;
      } else {
        const valueStart = cursor;
        while (cursor < tag.length && !/[\s>]/.test(tag[cursor])) cursor++;
        value = tag.slice(valueStart, cursor);
      }
    }

    if (name === wantedName) return value.trim();
  }
  return null;
}

function localTarget(raw, currentFile) {
  if (!raw || raw === '#') return null;

  const lower = raw.toLowerCase();
  if (lower.startsWith('mailto:') || lower.startsWith('tel:') ||
      lower.startsWith('javascript:') || lower.startsWith('data:') ||
      lower.startsWith('blob:')) return null;

  let url;
  try {
    url = new URL(raw, new URL(currentFile, SITE_ORIGIN + '/'));
  } catch {
    return { error: 'invalid URL' };
  }

  // Validate the canonical apex site only. The www app has a separate route table.
  if (url.hostname !== 'mxtlab.online' || (url.protocol !== 'https:' && url.protocol !== 'http:')) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return { error: 'invalid URL encoding' };
  }

  let relative = pathname.replace(/^\/+/, '');
  if (!relative || relative.endsWith('/')) relative = relative ? relative + 'index.html' : 'index.html';
  relative = path.posix.normalize(relative);

  const candidates = [relative];
  if (!path.posix.extname(relative)) {
    candidates.push(relative + HTML_EXT, path.posix.join(relative, 'index.html'));
  }

  let hash = '';
  try {
    hash = url.hash ? decodeURIComponent(url.hash.slice(1)) : '';
  } catch {
    return { error: 'invalid fragment encoding' };
  }
  return { candidates, hash };
}

const allFiles = await walk(ROOT);
const fileSet = new Set(allFiles);
const htmlFiles = allFiles.filter((file) => file.endsWith(HTML_EXT)).sort();
const errors = [];
let checkedReferences = 0;
let checkedFragments = 0;

for (const htmlFile of htmlFiles) {
  const source = await readFile(repositoryFilePath(htmlFile), 'utf8');
  const tags = parseHtmlTags(source);
  const ids = new Set(tags
    .filter((tag) => !tag.name.startsWith('/'))
    .map((tag) => readAttribute(tag.raw, 'id'))
    .filter(Boolean));

  for (const tag of tags) {
    if (!CHECKED_TAGS.has(tag.name)) continue;

    const attributeName = tag.name === 'a' || tag.name === 'link' ? 'href'
      : tag.name === 'video' ? 'poster'
      : 'src';
    const raw = readAttribute(tag.raw, attributeName);
    if (!raw) continue;

    const resolved = localTarget(raw, htmlFile);
    if (!resolved) continue;
    checkedReferences++;

    if (resolved.error) {
      errors.push(htmlFile + ': invalid local reference "' + raw + '" (' + resolved.error + ')');
      continue;
    }

    const target = resolved.candidates.find((candidate) => fileSet.has(candidate));
    if (!target) {
      errors.push(htmlFile + ': local ' + tag.name + ' ' + attributeName + ' target not found: "' + raw + '" (tried ' + resolved.candidates.join(', ') + ')');
      continue;
    }

    if (resolved.hash && target === htmlFile) {
      checkedFragments++;
      if (!ids.has(resolved.hash)) {
        errors.push(htmlFile + ': fragment "#' + resolved.hash + '" does not match an element id');
      }
    }
  }
}

console.log('Checked ' + checkedReferences + ' local HTML references across ' + htmlFiles.length + ' HTML files; verified ' + checkedFragments + ' same-page fragments.');
if (errors.length) {
  console.error('Found ' + errors.length + ' broken local reference(s):');
  for (const error of errors.slice(0, 100)) console.error('- ' + error);
  if (errors.length > 100) console.error('- ... and ' + (errors.length - 100) + ' more');
  process.exitCode = 1;
} else {
  console.log('All checked local HTML references resolve.');
}
