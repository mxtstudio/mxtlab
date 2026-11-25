import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ORIGIN = 'https://mxtlab.online';
const HTML_EXT = '.html';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.next') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walk(absolute));
    else if (entry.isFile()) found.push(path.relative(ROOT, absolute).split(path.sep).join('/'));
  }
  return found;
}

function attribute(tag, name) {
  const pattern = new RegExp("\\b" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", 'i');
  const match = tag.match(pattern);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '').trim() : null;
}

function localTarget(raw, currentFile) {
  let candidate = (raw || '').trim();
  while (candidate.startsWith('"') || candidate.startsWith("'")) candidate = candidate.slice(1);
  if (!candidate || candidate === '#' || candidate.includes('${')) return null;

  const lower = candidate.toLowerCase();
  if (lower.startsWith('mailto:') || lower.startsWith('tel:') ||
      lower.startsWith('javascript:') || lower.startsWith('data:') ||
      lower.startsWith('blob:') || lower.startsWith('vbscript:')) return null;

  let url;
  try {
    url = new URL(candidate, new URL(currentFile, SITE_ORIGIN + '/'));
  } catch {
    return { error: 'invalid URL' };
  }

  // Validate only the canonical public website. The separate www application
  // origin has its own route table and is audited independently.
  if (url.origin !== SITE_ORIGIN) return null;

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
  const source = await readFile(path.join(ROOT, htmlFile), 'utf8');
  const ids = new Set([...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
  const tags = source.match(/<(?:a|script|link|img|source|video|audio|iframe)\b[^>]*>/gi) || [];

  for (const tag of tags) {
    const tagName = (tag.match(/^<([a-z]+)/i) || [])[1]?.toLowerCase();
    const attributeName = tagName === 'a' || tagName === 'link' ? 'href'
      : tagName === 'video' ? 'poster'
      : 'src';
    const raw = attribute(tag, attributeName);
    if (!raw || raw === '#') continue;

    const resolved = localTarget(raw, htmlFile);
    if (!resolved) continue;
    checkedReferences++;

    if (resolved.error) {
      errors.push(htmlFile + ': invalid local reference "' + raw + '" (' + resolved.error + ')');
      continue;
    }

    const target = resolved.candidates.find((candidate) => fileSet.has(candidate));
    if (!target) {
      errors.push(htmlFile + ': local ' + tagName + ' ' + attributeName + ' target not found: "' + raw + '" (tried ' + resolved.candidates.join(', ') + ')');
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
