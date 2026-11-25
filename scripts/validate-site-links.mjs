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
  const patterns = {
    href: /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
    src: /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
    poster: /\bposter\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
  };
  const match = patterns[name]?.exec(tag);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '').trim() : null;
}

function localTarget(raw, currentFile) {
  if (!raw || /^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(raw)) return null;

  let url;
  try {
    url = new URL(raw, new URL(currentFile, SITE_ORIGIN + '/'));
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
  // Avoid treating markup-like content inside inline scripts or data-URI SVGs as HTML.
  const markup = source
    .replace(/data:image\/svg\+xml,[^"]*/gi, 'data:image/svg+xml,INLINE_SVG')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1')
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, '$1');
  const ids = new Set([...markup.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
  const tags = markup.match(/<(?:a|script|link|img|source|video|audio|iframe)\b[^>]*>/gi) || [];

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
