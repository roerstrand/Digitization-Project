import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSegments, translateHtml, relocateLinks, localizePage } from './i18n.mjs';

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
const toSwedish = new Map(PAGES.map(page => [`en/${page}`, page]));
const extract = process.argv.includes('--extract');

const dictPath = page => join(ROOT, 'i18n', 'sv', page.replace(/\.html$/, '.json'));
const write = (file, text) => { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); };
const rel = (fromPage, toPage) => {
  const path = posix.relative(posix.dirname(fromPage), toPage);
  return path.startsWith('../') ? path : `./${path}`;
};

let gaps = 0;
for (const page of PAGES) {
  const enPage = `en/${page}`;
  const source = readFileSync(join(ROOT, enPage), 'utf8');
  const file = dictPath(page);
  const dict = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};

  if (extract) {
    const merged = {};
    for (const key of extractSegments(source)) merged[key] = dict[key] ?? '';
    write(file, JSON.stringify(merged, null, 2) + '\n');
    console.log(`${page}: ${Object.keys(merged).length} segments`);
    continue;
  }

  const alternates = from => ({ sv: rel(from, page), en: rel(from, enPage), 'x-default': rel(from, page) });

  const english = localizePage(source, 'en', alternates(enPage));
  if (english !== source) writeFileSync(join(ROOT, enPage), english);

  const { html, missing } = translateHtml(source, dict);
  const swedish = localizePage(relocateLinks(html, enPage, page, toSwedish), 'sv', alternates(page));
  write(join(ROOT, page), swedish);

  gaps += missing.length;
  console.log(`${page}: ${missing.length ? `${missing.length} untranslated` : 'complete'}`);
  for (const key of missing) console.log(`  - ${key.slice(0, 90)}`);
}

if (!extract && gaps) process.exitCode = 1;
