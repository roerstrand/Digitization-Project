import { posix } from 'node:path';

const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]+>|[^<]+/gi;
const ATTR = /(\s)(alt|title|aria-label|data-caption|data-doctype|data-docsource|placeholder|content)="([^"]*)"/g;
const URL_ATTR = /(\s(?:href|src|poster|action|data-full)=")([^"]*)(")/g;
const SRCSET_ATTR = /(\ssrcset=")([^"]*)(")/g;
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const normalize = text => text.replace(/\s+/g, ' ').trim();
const hasLetters = text => /\p{L}/u.test(text.replace(/&[#\w]+;/g, ''));
const tagName = tag => (/^<\/?\s*([a-z][\w-]*)/i.exec(tag) || [])[1]?.toLowerCase();

function translatableAttr(tag, name) {
  if (name !== 'content') return true;
  return /^<meta\b/i.test(tag) && /\s(?:name="description"|property="og:(?:title|description)")/i.test(tag);
}

function walk(html, onText, onTag) {
  let skipName = null;
  let skipDepth = 0;
  return html.replace(TOKEN, token => {
    if (token.startsWith('<!--') || /^<(script|style)\b/i.test(token)) return token;
    if (token.startsWith('<')) {
      const name = tagName(token);
      const closing = token.startsWith('</');
      if (skipName) {
        if (name === skipName && !VOID.has(name)) skipDepth += closing ? -1 : (token.endsWith('/>') ? 0 : 1);
        if (skipDepth === 0) skipName = null;
        return token;
      }
      if (!closing && name && /\slang="sv"/i.test(token) && !VOID.has(name) && !token.endsWith('/>')) {
        skipName = name;
        skipDepth = 1;
        return token;
      }
      return closing ? token : onTag(token);
    }
    return skipName ? token : onText(token);
  });
}

export function extractSegments(html) {
  const seen = new Set();
  const add = value => {
    const key = normalize(value);
    if (key && hasLetters(key)) seen.add(key);
  };
  walk(html, text => { add(text); return text; }, tag => {
    for (const [, , name, value] of tag.matchAll(ATTR)) if (translatableAttr(tag, name)) add(value);
    return tag;
  });
  return [...seen];
}

export function translateHtml(html, dict) {
  const missing = new Set();
  const lookup = value => {
    const key = normalize(value);
    if (!key || !hasLetters(key)) return null;
    if (dict[key]) return dict[key];
    missing.add(key);
    return null;
  };
  const out = walk(html, text => {
    const sv = lookup(text);
    if (sv === null) return text;
    const [, lead, , trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
    return lead + sv + trail;
  }, tag => tag.replace(ATTR, (match, space, name, value) => {
    if (!translatableAttr(tag, name)) return match;
    const sv = lookup(value);
    return sv === null ? match : `${space}${name}="${sv.replace(/"/g, '&quot;')}"`;
  }));
  return { html: out, missing: [...missing] };
}

export function relocateLinks(html, fromPage, toPage, pages) {
  const fromDir = posix.dirname(fromPage);
  const toDir = posix.dirname(toPage);
  const move = url => {
    if (!url || /^(?:[a-z][\w+.-]*:|\/|#)/i.test(url)) return url;
    const [, path, rest] = /^([^?#]*)(.*)$/.exec(url);
    if (!path) return url;
    const encoded = /%[0-9a-f]{2}/i.test(path);
    let target = posix.normalize(posix.join(fromDir, encoded ? decodeURI(path) : path));
    if (pages.has(target)) target = pages.get(target);
    let relative = posix.relative(toDir, target);
    if (!relative.startsWith('../')) relative = `./${relative}`;
    return `${encoded ? encodeURI(relative) : relative}${rest}`;
  };
  return html
    .replace(URL_ATTR, (match, start, url, end) => `${start}${move(url)}${end}`)
    .replace(SRCSET_ATTR, (match, start, list, end) => {
      const candidates = list.split(',').map(candidate => {
        const [, lead, url, descriptor] = /^(\s*)(\S*)(.*)$/.exec(candidate);
        return `${lead}${move(url)}${descriptor}`;
      });
      return `${start}${candidates.join(',')}${end}`;
    });
}

export function localizePage(html, lang, alternates) {
  const links = Object.entries(alternates)
    .map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${href}">`)
    .join('\n   ');
  return html
    .replace(/<html\b[^>]*>/i, tag => tag
      .replace(/\slang="[^"]*"/i, ` lang="${lang}"`)
      .replace(/\sxml:lang="[^"]*"/i, ` xml:lang="${lang}"`))
    .replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '')
    .replace(/(\s*)<\/head>/i, `\n   ${links}$1</head>`);
}
