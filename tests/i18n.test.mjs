import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractSegments, translateHtml, rewritePaths, localizePage } from '../tools/i18n.mjs';

test('extractSegments collects text nodes with whitespace collapsed', () => {
  const html = '<h1>Baltic   Tower</h1>\n<p>Built in\n   timber.</p>';
  assert.deepEqual(extractSegments(html), ['Baltic Tower', 'Built in timber.']);
});

test('extractSegments skips script, style and JSON-LD content', () => {
  const html = '<style>p{color:red}</style><script>const a = "x";</script><script type="application/ld+json">{"name":"Tower"}</script><p>Visible</p>';
  assert.deepEqual(extractSegments(html), ['Visible']);
});

test('extractSegments ignores segments without letters', () => {
  const html = '<p>87 m</p><span>·</span><span>&mdash;</span><dd>1914</dd>';
  assert.deepEqual(extractSegments(html), ['87 m']);
});

test('extractSegments collects translatable attributes once', () => {
  const html = '<img src="a.jpg" alt="The tower" data-caption="Tower at night"><a aria-label="Home" title="Home" href="x.html">Home</a><meta name="description" content="A site">';
  assert.deepEqual(extractSegments(html), ['The tower', 'Tower at night', 'Home', 'A site']);
});

test('extractSegments skips elements marked lang="sv"', () => {
  const html = '<h3 lang="sv">Arbetet skrider raskt framåt</h3><p>Progress report</p>';
  assert.deepEqual(extractSegments(html), ['Progress report']);
});

test('translateHtml replaces text nodes and keeps surrounding whitespace', () => {
  const html = '<p>\n   Built in\n   timber.\n</p>';
  const { html: out, missing } = translateHtml(html, { 'Built in timber.': 'Byggt i trä.' });
  assert.equal(out, '<p>\n   Byggt i trä.\n</p>');
  assert.deepEqual(missing, []);
});

test('translateHtml translates attributes and reports missing segments', () => {
  const html = '<img alt="The tower"><p>Untranslated</p>';
  const { html: out, missing } = translateHtml(html, { 'The tower': 'Tornet' });
  assert.equal(out, '<img alt="Tornet"><p>Untranslated</p>');
  assert.deepEqual(missing, ['Untranslated']);
});

test('translateHtml escapes quotes in translated attributes', () => {
  const { html: out } = translateHtml('<img alt="Tower">', { Tower: 'Tornet "Stora"' });
  assert.equal(out, '<img alt="Tornet &quot;Stora&quot;">');
});

test('rewritePaths moves asset paths up one level and keeps translated pages local', () => {
  const html = '<link href="./css/main.css"><a href="./baltictower.html#story">T</a><img src="./img/a.jpg"><a href="https://example.com/">x</a><a href="#top">t</a>';
  const out = rewritePaths(html, new Set(['baltictower.html']), '');
  assert.equal(out, '<link href="../css/main.css"><a href="./baltictower.html#story">T</a><img src="../img/a.jpg"><a href="https://example.com/">x</a><a href="#top">t</a>');
});

test('rewritePaths resolves links from pages in subfolders', () => {
  const html = '<a href="../index.html">Home</a><script src="../scripts/main.js"></script><a href="./metadatadanishbuilding.html">m</a>';
  const translated = new Set(['index.html', 'metadataonwebsite/metadatadanishbuilding.html']);
  const out = rewritePaths(html, translated, 'metadataonwebsite/');
  assert.equal(out, '<a href="../index.html">Home</a><script src="../../scripts/main.js"></script><a href="./metadatadanishbuilding.html">m</a>');
});

test('localizePage sets lang and adds hreflang alternates', () => {
  const html = '<html lang="en" xml:lang="en">\n<head>\n<title>T</title>\n</head>';
  const out = localizePage(html, 'sv', { en: '../baltictower.html', sv: './baltictower.html' });
  assert.match(out, /<html lang="sv" xml:lang="sv">/);
  assert.match(out, /<link rel="alternate" hreflang="en" href="\.\.\/baltictower\.html">/);
  assert.match(out, /<link rel="alternate" hreflang="sv" href="\.\/baltictower\.html">/);
});
