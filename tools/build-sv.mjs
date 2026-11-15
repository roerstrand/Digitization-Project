import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSegments, translateHtml, rewritePaths, localizePage } from './i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = [
  'index.html',
  'about.html',
  'baltictower.html',
  'danishbuilding.html',
  'germanbuilding.html',
  'russianbuilding.html',
  'methodology.html',
  'lessons.html',
  'metadataonwebsite/metadatabaltictower.html',
  'metadataonwebsite/metadatadanishbuilding.html',
  'metadataonwebsite/metadatagermanbuilding.html',
  'metadataonwebsite/metadatarussianbuilding.html',
  'TEI-XSL-HTML conversion files/constructionCommissariat.html',
  'TEI-XSL-HTML conversion files/danishCommissariat.html',
  'TEI-XSL-HTML conversion files/germanCommissariat.html',
  'TEI-XSL-HTML conversion files/russianCommissariat.html'
];
const translated = new Set(PAGES);
const extract = process.argv.includes('--extract');

const dictPath = page => join(ROOT, 'i18n', 'sv', page.replace(/\.html$/, '.json'));
const write = (file, text) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); };

let gaps = 0;
for (const page of PAGES) {
  const source = readFileSync(join(ROOT, page), 'utf8');
  const file = dictPath(page);
  const dict = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};

  if (extract) {
    const merged = {};
    for (const key of extractSegments(source)) merged[key] = dict[key] ?? '';
    write(file, JSON.stringify(merged, null, 2) + '\n');
    console.log(`${page}: ${Object.keys(merged).length} segments`);
    continue;
  }

  const dir = posix.dirname(page) === '.' ? '' : `${posix.dirname(page)}/`;
  const name = posix.basename(page);
  const up = dir ? '../'.repeat(dir.split('/').length - 1) : '';

  const english = localizePage(source, 'en', { en: `./${name}`, sv: `${up || './'}sv/${dir}${name}` });
  if (english !== source) writeFileSync(join(ROOT, page), english);

  const { html, missing } = translateHtml(source, dict);
  const swedish = localizePage(rewritePaths(html, translated, dir), 'sv', { en: `../${up}${dir}${name}`, sv: `./${name}` });
  write(join(ROOT, 'sv', page), swedish);

  gaps += missing.length;
  console.log(`${page}: ${missing.length ? `${missing.length} untranslated` : 'complete'}`);
  for (const key of missing) console.log(`  - ${key.slice(0, 90)}`);
}

if (!extract && gaps) process.exitCode = 1;
