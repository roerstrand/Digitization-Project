/* ===================================
   SHARED
=================================== */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const wideToc = window.matchMedia('(min-width: 1200px)');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

const LANG = document.documentElement.lang === 'sv' ? 'sv' : 'en';
const SCRIPT_URL = document.currentScript ? document.currentScript.src : new URL('scripts/main.js', location.href).href;
const ASSET_ROOT = new URL('../', SCRIPT_URL).href;
const PAGE_ROOT = LANG === 'en' ? `${ASSET_ROOT}en/` : ASSET_ROOT;

const SV = {
  'Previous image': 'Föregående bild',
  'Next image': 'Nästa bild',
  'Enlarge image': 'Förstora bilden',
  'Enlarge': 'Förstora',
  'Source': 'Källa',
  'Choose an image': 'Välj en bild',
  'Image {n} of {count}: {alt}': 'Bild {n} av {count}: {alt}',
  'Enlarge image: {alt}': 'Förstora bilden: {alt}',
  'Close': 'Stäng',
  'Zoom': 'Zooma',
  'Zoom out': 'Zooma ut',
  'Zoom in': 'Zooma in',
  'Fit': 'Anpassa',
  'Details': 'Detaljer',
  'Image details': 'Bilddetaljer',
  'Year': 'År',
  'Collection': 'Samling',
  'Menu': 'Meny',
  'Overview & gallery': 'Översikt & galleri',
  'On this page': 'På den här sidan',
  'Skip to main content': 'Hoppa till huvudinnehållet',
  'View scan: Malmö City Archive, {ref} (opens in a new tab)': 'Visa skanning: Malmö stadsarkiv, {ref} (öppnas i en ny flik)',
  'Digitized original': 'Digitaliserat original',
  'Malmö City Archive · newspaper clippings, SEMSA00032': 'Malmö stadsarkiv · tidningsklipp, SEMSA00032',
  '{count} clippings · {span} · {volumes}': '{count} klipp · {span} · {volumes}',
  'volume': 'volym',
  'volumes': 'volymer',
  'Baltic Exhibition, Malmö 1914 — Home. © 2026 Robin Erik Strandberg': 'Baltiska utställningen i Malmö 1914 — Startsida. © 2026 Robin Erik Strandberg',
  'Baltic': 'Baltiska',
  'Exhibition,': 'utställningen i',
  'Dark mode': 'Mörkt läge',
  'Back to top': 'Till toppen',
  'All historical content on this site is drawn from the digitized material: exhibition catalogs from Malmö City Library, and newspaper clippings and the official site plan from Malmö City Archive.':
    'Allt historiskt innehåll på webbplatsen bygger på det digitaliserade materialet: utställningskataloger från Malmö stadsbibliotek samt tidningsklipp och den officiella planritningen från Malmö stadsarkiv.'
};

function t(text, vars = {}) {
  const base = LANG === 'sv' && SV[text] ? SV[text] : text;
  return base.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? vars[key] : m));
}

function storedTheme() {
  try { return localStorage.getItem('darkMode'); } catch (err) { return null; }
}

function applyTheme() {
  const stored = storedTheme();
  const dark = stored === 'on' || (stored !== 'off' && systemDark.matches);
  document.body.classList.toggle('dark-mode', dark);
  const toggle = document.getElementById('darkToggle');
  if (toggle) toggle.setAttribute('aria-checked', String(dark));
  return dark;
}

applyTheme();
systemDark.addEventListener('change', () => {
  if (storedTheme() === null) applyTheme();
});

const ICONS = {
  prev: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  expand: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  scan: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
  chevron: '<svg class="toc-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>'
};

function makeButton(className, label, icon, text) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.innerHTML = icon + (text ? `<span>${text}</span>` : '');
  if (!text) btn.setAttribute('aria-label', label);
  return btn;
}

function motifRect(img) {
  const box = img.getBoundingClientRect();
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh || !box.width || !box.height) return box;
  const scale = Math.min(box.width / nw, box.height / nh);
  const width = nw * scale;
  const height = nh * scale;
  return {
    left: box.left + (box.width - width) / 2,
    top: box.top + (box.height - height) / 2,
    width,
    height
  };
}

function imageSource(img) {
  return [img.dataset.docsource, img.dataset.collection, img.dataset.year].filter(Boolean).join(' · ');
}

/* ===================================
   GALLERY
=================================== */
const gallery = {
  box: null,
  stage: null,
  slides: [],
  imgs: [],
  thumbs: [],
  track: null,
  index: 0,
  caption: null,
  source: null,
  counters: []
};

let slideIndex = 1;

function placeStageArrows() {
  const g = gallery;
  if (!g.stage || !g.imgs.length) return;
  const img = g.imgs[g.index];
  const stageRect = g.stage.getBoundingClientRect();
  const rect = motifRect(img);
  g.stage.style.setProperty('--motif-left', `${Math.max(0, rect.left - stageRect.left)}px`);
  g.stage.style.setProperty('--motif-right', `${Math.max(0, stageRect.right - (rect.left + rect.width))}px`);
}

function scrollThumbIntoView(i) {
  const g = gallery;
  const thumb = g.thumbs[i];
  if (!thumb || !g.track) return;
  const target = thumb.offsetLeft - (g.track.clientWidth - thumb.offsetWidth) / 2;
  g.track.scrollTo({ left: Math.max(0, target), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

function showSlides(n) {
  const g = gallery;
  if (!g.slides.length) return;
  const count = g.slides.length;
  const next = (((n - 1) % count) + count) % count;
  g.index = next;
  slideIndex = next + 1;

  g.slides.forEach((slide, i) => slide.classList.toggle('is-active', i === next));

  const img = g.imgs[next];
  if (g.caption) g.caption.textContent = img.dataset.caption || img.alt;
  if (g.source) g.source.textContent = imageSource(img);
  g.counters.forEach(c => { c.textContent = `${next + 1} / ${count}`; });

  g.thumbs.forEach((thumb, i) => {
    const on = i === next;
    thumb.classList.toggle('is-active', on);
    if (on) thumb.setAttribute('aria-current', 'true');
    else thumb.removeAttribute('aria-current');
  });
  scrollThumbIntoView(next);

  if (img.complete) placeStageArrows();
}

function plusSlides(n) {
  showSlides(slideIndex + n);
}

function currentSlide(n) {
  showSlides(n);
}

function buildGallery() {
  const wrapper = document.querySelector('.gallery-wrapper');
  if (!wrapper) return;
  const g = gallery;
  const box = wrapper.closest('.gallery-box') || wrapper.parentElement;
  g.box = box;
  g.stage = wrapper;
  wrapper.classList.add('gallery-stage');
  g.slides = Array.from(wrapper.querySelectorAll('.gallery'));
  g.imgs = g.slides.map(slide => slide.querySelector('img'));
  g.slides.forEach(slide => {
    slide.style.removeProperty('display');
    slide.classList.remove('fade1');
  });

  wrapper.querySelectorAll('.slide-counter, .gallery-caption, .prev, .next').forEach(el => el.remove());
  box.querySelectorAll('.gallery-indicators, .gallery-hint, .gallery-controls').forEach(el => el.remove());

  const count = g.slides.length;
  const multi = count > 1;

  if (multi) {
    const stagePrev = makeButton('gallery-btn stage-arrow stage-prev', t('Previous image'), ICONS.prev);
    const stageNext = makeButton('gallery-btn stage-arrow stage-next', t('Next image'), ICONS.next);
    stagePrev.addEventListener('click', () => plusSlides(-1));
    stageNext.addEventListener('click', () => plusSlides(1));
    wrapper.append(stagePrev, stageNext);
  }

  const enlarge = makeButton('gallery-btn stage-enlarge', t('Enlarge image'), ICONS.expand, t('Enlarge'));
  enlarge.addEventListener('click', () => openViewer(g.index, enlarge));
  wrapper.appendChild(enlarge);

  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  if (multi) {
    const prev = makeButton('gallery-btn', t('Previous image'), ICONS.prev);
    const next = makeButton('gallery-btn', t('Next image'), ICONS.next);
    const counter = document.createElement('span');
    counter.className = 'gallery-counter';
    prev.addEventListener('click', () => plusSlides(-1));
    next.addEventListener('click', () => plusSlides(1));
    controls.append(prev, counter, next);
    g.counters.push(counter);
  }

  const info = document.createElement('div');
  info.className = 'gallery-info';
  info.innerHTML =
    '<div class="gallery-info-text">' +
      '<p class="gallery-info-caption" aria-live="polite"></p>' +
      '<p class="gallery-info-source"><span class="gallery-info-label">' + t('Source') + '</span> <span class="gallery-info-source-value"></span></p>' +
    '</div>' +
    (multi ? '<span class="gallery-counter gallery-counter--info"></span>' : '');
  g.caption = info.querySelector('.gallery-info-caption');
  g.source = info.querySelector('.gallery-info-source-value');
  const infoCounter = info.querySelector('.gallery-counter--info');
  if (infoCounter) g.counters.push(infoCounter);

  box.append(controls, info);

  if (multi) {
    const thumbs = document.createElement('div');
    thumbs.className = 'gallery-thumbs';
    thumbs.setAttribute('role', 'group');
    thumbs.setAttribute('aria-label', t('Choose an image'));
    g.imgs.forEach((img, i) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'gallery-thumb';
      thumb.setAttribute('aria-label', t('Image {n} of {count}: {alt}', { n: i + 1, count, alt: img.alt }));
      const tImg = document.createElement('img');
      tImg.src = img.getAttribute('src');
      tImg.alt = '';
      thumb.appendChild(tImg);
      thumb.addEventListener('click', () => showSlides(i + 1));
      thumbs.appendChild(thumb);
      g.thumbs.push(thumb);
    });
    g.track = thumbs;
    box.appendChild(thumbs);
  }

  g.imgs.forEach((img, i) => {
    img.removeAttribute('tabindex');
    img.removeAttribute('role');
    img.style.cursor = 'zoom-in';
    img.addEventListener('load', () => { if (i === g.index) placeStageArrows(); });
  });

  let start = null;
  wrapper.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    start = { x: e.clientX, y: e.clientY };
  });
  wrapper.addEventListener('pointerup', e => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (multi && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      plusSlides(dx < 0 ? 1 : -1);
      return;
    }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && e.target.closest('.gallery img')) {
      openViewer(g.index, enlarge);
    }
  });
  wrapper.addEventListener('pointercancel', () => { start = null; });

  box.addEventListener('keydown', e => {
    if (!multi || e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); plusSlides(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); plusSlides(1); }
  });

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => placeStageArrows()).observe(wrapper);
  } else {
    window.addEventListener('resize', placeStageArrows);
  }

  showSlides(1);
}

/* ===================================
   IMAGE VIEWER (three zones)
=================================== */
const viewer = {
  el: null,
  img: null,
  canvas: null,
  items: [],
  index: 0,
  scale: 1,
  x: 0,
  y: 0,
  opener: null,
  fromGallery: false
};
const ZOOM_MIN = 1;
const ZOOM_MAX = 6;

function buildViewer() {
  const items = Array.from(document.querySelectorAll('.gallery img'));
  if (!items.length) return;
  viewer.items = items;
  viewer.fromGallery = !!gallery.stage;

  const el = document.createElement('div');
  el.className = 'viewer';
  el.id = 'viewer';
  el.hidden = true;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'viewer-title');
  el.innerHTML = `
    <div class="viewer-bar">
      <button type="button" class="viewer-btn viewer-close">${ICONS.close}<span>${t('Close')}</span></button>
      <span class="viewer-counter" aria-live="polite"></span>
      <div class="viewer-zoom" role="group" aria-label="${t('Zoom')}">
        <button type="button" class="viewer-btn viewer-zoom-out" aria-label="${t('Zoom out')}">${ICONS.minus}</button>
        <output class="viewer-zoom-level" aria-live="polite">100%</output>
        <button type="button" class="viewer-btn viewer-zoom-in" aria-label="${t('Zoom in')}">${ICONS.plus}</button>
        <button type="button" class="viewer-btn viewer-zoom-fit"><span>${t('Fit')}</span></button>
      </div>
      <button type="button" class="viewer-btn viewer-details" aria-expanded="false" aria-controls="viewer-info">${ICONS.info}<span>${t('Details')}</span></button>
    </div>
    <div class="viewer-body">
      <div class="viewer-stage">
        <div class="viewer-canvas"><img class="viewer-img" alt="" draggable="false"></div>
        <button type="button" class="viewer-btn viewer-nav viewer-prev" aria-label="${t('Previous image')}">${ICONS.prev}</button>
        <button type="button" class="viewer-btn viewer-nav viewer-next" aria-label="${t('Next image')}">${ICONS.next}</button>
      </div>
      <aside class="viewer-info" id="viewer-info" aria-label="${t('Image details')}">
        <h2 class="viewer-title" id="viewer-title"></h2>
        <dl class="viewer-meta">
          <div><dt>Format</dt><dd class="vm-type"></dd></div>
          <div><dt>${t('Source')}</dt><dd class="vm-source"></dd></div>
          <div><dt>${t('Year')}</dt><dd class="vm-year"></dd></div>
          <div><dt>${t('Collection')}</dt><dd class="vm-collection"></dd></div>
        </dl>
      </aside>
    </div>`;
  document.body.appendChild(el);

  viewer.el = el;
  viewer.img = el.querySelector('.viewer-img');
  viewer.canvas = el.querySelector('.viewer-canvas');

  const single = items.length < 2;
  el.classList.toggle('is-single', single);

  el.querySelector('.viewer-close').addEventListener('click', closeViewer);
  el.querySelector('.viewer-prev').addEventListener('click', () => stepViewer(-1));
  el.querySelector('.viewer-next').addEventListener('click', () => stepViewer(1));
  el.querySelector('.viewer-zoom-in').addEventListener('click', () => zoomTo(viewer.scale * 1.5, 0, 0, true));
  el.querySelector('.viewer-zoom-out').addEventListener('click', () => zoomTo(viewer.scale / 1.5, 0, 0, true));
  el.querySelector('.viewer-zoom-fit').addEventListener('click', () => resetZoom(true));
  const detailsBtn = el.querySelector('.viewer-details');
  detailsBtn.addEventListener('click', () => {
    const open = !el.classList.contains('details-open');
    el.classList.toggle('details-open', open);
    detailsBtn.setAttribute('aria-expanded', String(open));
  });

  viewer.canvas.tabIndex = -1;
  bindViewerPointer();
  document.addEventListener('keydown', e => { if (!el.hidden) viewerKeys(e); });
  window.addEventListener('resize', () => { if (!el.hidden) applyTransform(false); });

  if (!viewer.fromGallery) {
    items.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', t('Enlarge image: {alt}', { alt: img.alt }));
      img.addEventListener('click', () => openViewer(i, img));
      img.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(i, img); }
      });
    });
  }
}

function fillViewer(i) {
  const v = viewer;
  const src = v.items[i];
  v.index = i;
  v.img.src = src.currentSrc || src.src;
  v.img.alt = src.alt;
  v.el.querySelector('.viewer-title').textContent = src.dataset.caption || src.alt;
  v.el.querySelector('.vm-type').textContent = src.dataset.doctype || '—';
  v.el.querySelector('.vm-source').textContent = src.dataset.docsource || '—';
  v.el.querySelector('.vm-year').textContent = src.dataset.year || '1914';
  v.el.querySelector('.vm-collection').textContent = src.dataset.collection || 'Malmö City Library';
  v.el.querySelector('.viewer-counter').textContent = `${i + 1} / ${v.items.length}`;
}

function clampPan() {
  const v = viewer;
  const cw = v.canvas.clientWidth;
  const ch = v.canvas.clientHeight;
  const iw = v.img.offsetWidth * v.scale;
  const ih = v.img.offsetHeight * v.scale;
  const mx = Math.max(0, (iw - cw) / 2);
  const my = Math.max(0, (ih - ch) / 2);
  v.x = Math.min(mx, Math.max(-mx, v.x));
  v.y = Math.min(my, Math.max(-my, v.y));
}

function applyTransform(animate) {
  const v = viewer;
  clampPan();
  v.img.style.transition = animate && !reducedMotion.matches ? 'transform 180ms ease-out, opacity 130ms ease' : 'opacity 130ms ease';
  v.img.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.scale})`;
  v.el.querySelector('.viewer-zoom-level').textContent = `${Math.round(v.scale * 100)}%`;
  v.el.querySelector('.viewer-zoom-out').disabled = v.scale <= ZOOM_MIN + 0.001;
  v.el.querySelector('.viewer-zoom-in').disabled = v.scale >= ZOOM_MAX - 0.001;
  v.el.classList.toggle('is-zoomed', v.scale > 1.001);
}

function zoomTo(scale, px, py, animate) {
  const v = viewer;
  const s = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale));
  const k = s / v.scale;
  v.x = px - (px - v.x) * k;
  v.y = py - (py - v.y) * k;
  v.scale = s;
  if (s === ZOOM_MIN) { v.x = 0; v.y = 0; }
  applyTransform(animate);
}

function resetZoom(animate) {
  viewer.scale = 1;
  viewer.x = 0;
  viewer.y = 0;
  applyTransform(animate);
}

function canvasPoint(clientX, clientY) {
  const r = viewer.canvas.getBoundingClientRect();
  return { x: clientX - (r.left + r.width / 2), y: clientY - (r.top + r.height / 2) };
}

function bindViewerPointer() {
  const v = viewer;
  const pts = new Map();
  let start = null;
  let pinch = null;

  const dist = () => {
    const [a, b] = Array.from(pts.values());
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const mid = () => {
    const [a, b] = Array.from(pts.values());
    return canvasPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
  };

  v.canvas.addEventListener('pointerdown', e => {
    v.canvas.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) start = { x: e.clientX, y: e.clientY, vx: v.x, vy: v.y };
    if (pts.size === 2) { pinch = { d: dist(), s: v.scale }; start = null; }
    v.canvas.classList.add('is-dragging');
  });

  v.canvas.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size === 2) {
      const c = mid();
      zoomTo(pinch.s * (dist() / pinch.d), c.x, c.y, false);
    } else if (start && v.scale > 1.001) {
      v.x = start.vx + (e.clientX - start.x);
      v.y = start.vy + (e.clientY - start.y);
      applyTransform(false);
    }
  });

  const end = e => {
    if (!pts.has(e.pointerId)) return;
    if (start && pts.size === 1 && v.scale <= 1.001 && e.type === 'pointerup') {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) stepViewer(dx < 0 ? 1 : -1);
    }
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (pts.size === 0) { start = null; v.canvas.classList.remove('is-dragging'); }
    else if (pts.size === 1) {
      const p = Array.from(pts.values())[0];
      start = { x: p.x, y: p.y, vx: v.x, vy: v.y };
    }
  };
  v.canvas.addEventListener('pointerup', end);
  v.canvas.addEventListener('pointercancel', end);

  v.canvas.addEventListener('dblclick', e => {
    if (v.scale > 1.001) resetZoom(true);
    else {
      const p = canvasPoint(e.clientX, e.clientY);
      zoomTo(2.5, p.x, p.y, true);
    }
  });

  v.canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const p = canvasPoint(e.clientX, e.clientY);
    zoomTo(v.scale * Math.exp(-e.deltaY * 0.0015), p.x, p.y, false);
  }, { passive: false });
}

function viewerKeys(e) {
  const v = viewer;
  if (e.key === 'Escape') { e.preventDefault(); closeViewer(); return; }
  if (e.key === 'Tab') {
    const items = Array.from(v.el.querySelectorAll('button:not([disabled])')).filter(b => b.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!v.el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    return;
  }
  const zoomed = v.scale > 1.001;
  const pan = 80;
  if (e.key === 'ArrowLeft') { e.preventDefault(); if (zoomed) { v.x += pan; applyTransform(true); } else stepViewer(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); if (zoomed) { v.x -= pan; applyTransform(true); } else stepViewer(1); }
  if (e.key === 'ArrowUp' && zoomed) { e.preventDefault(); v.y += pan; applyTransform(true); }
  if (e.key === 'ArrowDown' && zoomed) { e.preventDefault(); v.y -= pan; applyTransform(true); }
  if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomTo(v.scale * 1.5, 0, 0, true); }
  if (e.key === '-') { e.preventDefault(); zoomTo(v.scale / 1.5, 0, 0, true); }
  if (e.key === '0') { e.preventDefault(); resetZoom(true); }
}

function stepViewer(dir) {
  const v = viewer;
  if (v.items.length < 2) return;
  const next = (v.index + dir + v.items.length) % v.items.length;
  if (reducedMotion.matches) {
    fillViewer(next);
    resetZoom(false);
    return;
  }
  v.img.style.opacity = '0';
  window.setTimeout(() => {
    fillViewer(next);
    v.scale = 1; v.x = 0; v.y = 0;
    const reveal = () => { v.img.style.opacity = '1'; applyTransform(false); };
    if (v.img.complete) requestAnimationFrame(reveal);
    else v.img.addEventListener('load', reveal, { once: true });
  }, 130);
}

function openViewer(i, opener) {
  const v = viewer;
  if (!v.el) return;
  v.opener = opener || document.activeElement;
  fillViewer(i);
  v.scale = 1; v.x = 0; v.y = 0;
  v.el.classList.remove('details-open');
  v.el.querySelector('.viewer-details').setAttribute('aria-expanded', 'false');
  v.img.style.opacity = '1';
  v.el.hidden = false;
  document.documentElement.classList.add('viewer-open');
  applyTransform(false);

  const sourceImg = v.items[i];
  const animate = !reducedMotion.matches && sourceImg.offsetParent !== null && v.img.complete;
  if (animate) {
    const from = motifRect(sourceImg);
    const to = v.img.getBoundingClientRect();
    if (from.width && to.width) {
      const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
      const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
      const s = from.width / to.width;
      v.img.style.transition = 'none';
      v.img.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
      void v.img.offsetWidth;
      v.img.style.transition = 'transform 280ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 130ms ease';
      v.img.style.transform = 'translate(0px, 0px) scale(1)';
    }
  }
  requestAnimationFrame(() => v.el.classList.add('is-open'));
  v.el.querySelector('.viewer-close').focus({ preventScroll: true });
}

function closeViewer() {
  const v = viewer;
  if (!v.el || v.el.hidden) return;
  if (v.fromGallery) showSlides(v.index + 1);
  v.el.classList.remove('is-open');
  const finish = () => {
    v.el.hidden = true;
    document.documentElement.classList.remove('viewer-open');
    resetZoom(false);
    if (v.opener && document.contains(v.opener)) v.opener.focus({ preventScroll: true });
  };
  if (reducedMotion.matches) finish();
  else window.setTimeout(finish, 200);
}

/* ===================================
   HEADER MENU (collapses when links stop fitting)
=================================== */
function setupMenu() {
  const header = document.querySelector('header');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('sitenav');
  if (!header || !toggle || !nav) return;
  const container = header.querySelector('.container');

  toggle.removeAttribute('aria-label');
  toggle.setAttribute('aria-controls', 'sitenav');
  if (!toggle.querySelector('.nav-toggle-text')) {
    toggle.insertAdjacentHTML('beforeend', `<span class="nav-toggle-text">${t('Menu')}</span>`);
  }

  const closeNav = () => {
    nav.classList.remove('nav-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const measure = () => {
    const wasOpen = nav.classList.contains('nav-open');
    header.classList.remove('nav-compact');
    nav.classList.remove('nav-open');
    const cs = getComputedStyle(container);
    const available = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const compact = nav.scrollWidth > available + 1;
    header.classList.toggle('nav-compact', compact);
    if (compact && wasOpen) nav.classList.add('nav-open');
    if (!compact) closeNav();
    document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  };

  let raf = 0;
  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(container);
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  measure();

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('nav-open');
    if (isOpen) {
      const top = header.getBoundingClientRect().top;
      if (top > 0) window.scrollTo({ top: window.scrollY + top, behavior: 'instant' });
    }
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('click', e => {
    if (!e.target.closest('header') && nav.classList.contains('nav-open')) closeNav();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) { closeNav(); toggle.focus(); }
  });
}

/* ===================================
   STORY PARTS (collapsible on narrow screens)
=================================== */
const narrowStory = window.matchMedia('(max-width: 1023px)');

function setupStoryParts() {
  const parts = [...document.querySelectorAll('#story .story-part')];
  if (!parts.length) return;

  const items = parts.map((part, i) => {
    const heading = part.querySelector('h3');
    const body = document.createElement('div');
    body.className = 'story-body';
    body.id = `story-part-${i + 1}`;
    while (heading.nextSibling) body.appendChild(heading.nextSibling);
    part.appendChild(body);
    return { part, heading, body, title: heading.textContent, open: i === 0 };
  });

  const setOpen = (item, open) => {
    item.open = open;
    item.part.classList.toggle('is-open', open);
    const btn = item.heading.querySelector('button');
    if (btn) btn.setAttribute('aria-expanded', String(open));
    if (open) item.body.removeAttribute('hidden');
    else item.body.setAttribute('hidden', 'until-found');
  };

  const apply = () => {
    items.forEach(item => {
      if (narrowStory.matches) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'story-toggle';
        btn.setAttribute('aria-controls', item.body.id);
        btn.innerHTML = ICONS.chevron.replace('toc-chevron', 'story-chevron');
        const label = document.createElement('span');
        label.textContent = item.title;
        btn.prepend(label);
        btn.addEventListener('click', () => setOpen(item, !item.open));
        item.heading.replaceChildren(btn);
        item.part.classList.add('is-collapsible');
        setOpen(item, item.open);
      } else {
        item.heading.replaceChildren(item.title);
        item.part.classList.remove('is-collapsible', 'is-open');
        item.body.removeAttribute('hidden');
      }
    });
  };

  items.forEach(item => {
    item.body.addEventListener('beforematch', () => setOpen(item, true));
  });
  narrowStory.addEventListener('change', apply);
  apply();
}

/* ===================================
   ON THIS PAGE (sidebar on wide, drop-down on narrow)
=================================== */
function setupToc() {
  const main = document.getElementById('content');
  const header = document.querySelector('header');
  if (!main || !header) return;

  const sections = Array.from(document.querySelectorAll(
    '.gallery-container:has(.opening-head), #story, .info-group, .method-section, .context-block, .process-section, .press-archive'
  )).filter(sec => !sec.closest('.info-group') || sec.classList.contains('info-group'));

  const entries = [];
  sections.forEach((sec, i) => {
    let text = '';
    if (sec.matches('.gallery-container')) text = t('Overview & gallery');
    else if (sec.matches('.info-group')) text = sec.querySelector('h2')?.textContent.trim() || '';
    else text = (sec.querySelector('.context-label, .section-label')?.textContent.trim()) ||
                (sec.querySelector('h2, h3')?.textContent.trim()) || '';
    if (!text) return;
    if (!sec.id) sec.id = `section-${i}`;
    entries.push({ sec, text });
  });
  if (entries.length < 2) {
    const setOffset = () => document.documentElement.style.setProperty('--sticky-offset', `${header.offsetHeight}px`);
    setOffset();
    window.addEventListener('resize', setOffset);
    return;
  }

  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.setAttribute('aria-label', t('On this page'));
  toc.innerHTML = `
    <div class="toc-panel">
      <button type="button" class="toc-toggle" aria-expanded="false" aria-controls="toc-list">
        <span class="toc-label">${t('On this page')}</span>
        <span class="toc-current"></span>
        ${ICONS.chevron}
      </button>
      <p class="toc-heading" aria-hidden="true">${t('On this page')}</p>
      <ol class="toc-list" id="toc-list"></ol>
    </div>`;
  const list = toc.querySelector('.toc-list');
  const toggle = toc.querySelector('.toc-toggle');
  const current = toc.querySelector('.toc-current');

  const links = entries.map(({ sec, text }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${sec.id}`;
    a.textContent = text;
    li.appendChild(a);
    list.appendChild(li);
    return { a, sec, text };
  });

  main.prepend(toc);
  main.classList.add('has-toc');

  const setOpen = open => {
    toc.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!toc.classList.contains('is-open')));
  document.addEventListener('click', e => { if (!toc.contains(e.target)) setOpen(false); });
  toc.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toc.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });

  const updateOffsets = () => {
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
    const extra = wideToc.matches ? 0 : toggle.offsetHeight;
    document.documentElement.style.setProperty('--sticky-offset', `${h + extra}px`);
  };
  updateOffsets();
  window.addEventListener('resize', updateOffsets);
  wideToc.addEventListener('change', () => { setOpen(false); updateOffsets(); });

  let activeIdx = -1;
  let lock = false;
  let lockTimer = null;
  const setActive = idx => {
    if (idx === activeIdx) return;
    activeIdx = idx;
    links.forEach(({ a, sec }, i) => {
      const on = i === idx;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
      sec.classList.toggle('section-active', on);
    });
    current.textContent = idx >= 0 ? links[idx].text : '';
  };
  const getActive = () => {
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-offset')) + 40;
    let idx = 0;
    links.forEach(({ sec }, i) => { if (sec.getBoundingClientRect().top <= offset) idx = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = links.length - 1;
    return idx;
  };

  links.forEach(({ a, sec }, i) => {
    a.addEventListener('click', e => {
      e.preventDefault();
      setActive(i);
      setOpen(false);
      updateOffsets();
      sec.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      if (!sec.hasAttribute('tabindex')) sec.setAttribute('tabindex', '-1');
      sec.focus({ preventScroll: true });
      history.replaceState(null, '', `#${sec.id}`);
      lock = true;
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { lock = false; }, 900);
    });
  });

  window.addEventListener('scroll', () => { if (!lock) setActive(getActive()); }, { passive: true });
  setActive(getActive());

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

/* ===================================
   DOM READY
=================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Skip link --- */
  const mainEl = document.getElementById('content');
  if (mainEl) {
    if (!mainEl.hasAttribute('tabindex')) mainEl.setAttribute('tabindex', '-1');
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#content';
    skip.textContent = t('Skip to main content');
    document.body.prepend(skip);
  }

  /* --- Page plate: blurred hero photo behind all glass --- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    document.documentElement.style.setProperty('--page-plate', `url("${heroImg.currentSrc || heroImg.src}")`);
  }

  /* --- Links from press entries to the archive scans --- */
  const SCAN_FOLDERS = {
    'Ö II1': 'Baltiska utställningen i Malmö (1914A). Tidningsurklipp, volym Ö II1, bok nr I. SEMSA00032ÖÖ II1',
    'Ö II3': 'Baltiska utställningen i Malmö (1914B). Tidningsurklipp, volym Ö II3, bok nr VI. SEMSA00032ÖÖ II3',
    'Ö II4': 'Baltiska utställningen i Malmö (1914C). Tidningsurklipp, volym Ö II4, bok nr XII SEMSA00032ÖÖ II4',
    'Ö II5': 'Baltiska utställningen i Malmö (1914D). Tidningsurklipp, volym Ö II5, bok nr IX. SEMSA00032ÖÖ II5',
    'Ö II6': 'Baltiska utställningen i Malmö (1914E). Tidningsurklipp, volym Ö II6, bok nr XII. SEMSA00032ÖÖ II6'
  };
  const siteRoot = ASSET_ROOT;
  const scanFile = (dir, volume, page) =>
    `${siteRoot}references/paper_clippings/${dir}/${volume.replace('Ö ', 'O')}-${page.replace(/\s+/g, '-')}.jpg`;
  document.querySelectorAll('.scan-link[data-scan]').forEach(link => {
    const [volume, page] = link.dataset.scan.split('|');
    if (!SCAN_FOLDERS[volume] || !page) return;
    link.href = scanFile('display', volume, page);
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', t('View scan: Malmö City Archive, {ref} (opens in a new tab)', { ref: link.textContent.trim() }));
  });

  /* --- Press timeline: scan thumbnails and source line --- */
  document.querySelectorAll('.press-item').forEach(item => {
    const link = item.querySelector('.scan-link[href]');
    if (!link) return;
    const [volume, page] = link.dataset.scan.split('|');
    const thumb = document.createElement('a');
    thumb.className = 'press-scan';
    thumb.href = link.href;
    thumb.target = '_blank';
    thumb.rel = 'noopener';
    thumb.tabIndex = -1;
    thumb.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.src = scanFile('thumbs', volume, page);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    thumb.appendChild(img);
    item.appendChild(thumb);
  });

  document.querySelectorAll('.press-archive').forEach(section => {
    const items = section.querySelectorAll('.press-item');
    const head = section.querySelector('.press-head');
    if (!items.length || !head) return;
    const years = [...section.querySelectorAll('.press-item time')].map(t => t.dateTime.slice(0, 4)).sort();
    const volumes = new Set([...section.querySelectorAll('.scan-link[data-scan]')].map(l => l.dataset.scan.split('|')[0]));
    const span = years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`;
    const source = document.createElement('p');
    source.className = 'press-source';
    source.innerHTML =
      `<span class="press-source-badge">${ICONS.scan}${t('Digitized original')}</span>` +
      `<span>${t('Malmö City Archive · newspaper clippings, SEMSA00032')}</span>` +
      `<span>${t('{count} clippings · {span} · {volumes}', { count: items.length, span, volumes: `${volumes.size} ${t(volumes.size === 1 ? 'volume' : 'volumes')}` })}</span>`;
    head.appendChild(source);
  });

  /* --- Site logo (fixed top-left) --- */
  const logoLink = document.createElement('a');
  logoLink.id = 'siteLogo';
  logoLink.href = `${PAGE_ROOT}index.html`;
  logoLink.setAttribute('aria-label', t('Baltic Exhibition, Malmö 1914 — Home. © 2026 Robin Erik Strandberg'));
  logoLink.innerHTML = `<svg class="brand-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="22" height="29" fill="currentColor" aria-hidden="true">
    <circle cx="18" cy="2" r="1.6"/>
    <polygon points="18,3.6 15,10 21,10"/>
    <rect x="14.5" y="10" width="7" height="16"/>
    <rect x="7" y="25.5" width="22" height="2.5"/>
    <rect x="7" y="24" width="6" height="1.5" rx="0.4"/>
    <rect x="23" y="24" width="6" height="1.5" rx="0.4"/>
    <rect x="7" y="28" width="5.5" height="14"/>
    <rect x="23.5" y="28" width="5.5" height="14"/>
    <rect x="5" y="42" width="26" height="2"/>
    <rect x="2" y="44" width="32" height="2"/>
    <rect x="0" y="46" width="36" height="2"/>
    <path d="M7 31 Q18 19.5 29 31" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  </svg><span class="brand-text"><span class="brand-title">${t('Baltic')}<span class="brand-x"> ${t('Exhibition,')}</span><span class="brand-dot"> ·</span> Malmö 1914</span><span class="brand-copy">&copy; <span class="brand-year">2026 </span>Robin Erik Strandberg</span></span>`;
  document.body.appendChild(logoLink);

  /* --- Language switch (same page in the other language) --- */
  const here = location.href.split('#')[0].split('?')[0];
  let langLink = null;
  if (here.startsWith(ASSET_ROOT)) {
    let rel = here.slice(ASSET_ROOT.length);
    rel = LANG === 'en' ? rel.replace(/^en\//, '') : `en/${rel}`;
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    let flagId = 0;
    const flag = code => {
      if (code === 'sv') {
        return '<svg class="lang-flag" viewBox="0 0 16 10" width="20" height="13" aria-hidden="true"><rect width="16" height="10" fill="#006aa7"/><rect x="5" width="2" height="10" fill="#fecc00"/><rect y="4" width="16" height="2" fill="#fecc00"/></svg>';
      }
      const id = `uk-clip-${++flagId}`;
      return `<svg class="lang-flag" viewBox="0 0 60 30" width="20" height="10" aria-hidden="true"><clipPath id="${id}"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0L60,30M60,0L0,30" clip-path="url(#${id})" stroke="#c8102e" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#c8102e" stroke-width="6"/></svg>`;
    };
    const option = code => `<span class="lang-opt${LANG === code ? ' is-current' : ''}">${flag(code)}<span class="lang-code">${code.toUpperCase()}</span></span>`;
    const buildLang = className => {
      const a = document.createElement('a');
      a.className = className;
      a.href = ASSET_ROOT + rel;
      a.hreflang = LANG === 'sv' ? 'en' : 'sv';
      a.setAttribute('aria-label', LANG === 'sv' ? 'SV · EN — Byt till engelska' : 'SV · EN — Switch to Swedish');
      a.innerHTML = option('sv') + '<span class="lang-sep" aria-hidden="true">·</span>' + option('en');
      return a;
    };
    langLink = buildLang('lang-switch');
    langLink.id = 'langToggle';
    document.body.appendChild(langLink);
    const siteNav = document.getElementById('sitenav');
    if (siteNav) siteNav.prepend(buildLang('nav-lang'));
  }

  const themeButton = document.getElementById('darkToggle');
  const syncControlWidths = () => {
    const root = document.documentElement.style;
    root.setProperty('--brand-w', `${logoLink.offsetWidth}px`);
    if (!themeButton) return;
    root.setProperty('--switch-w', `${themeButton.offsetWidth}px`);
    const lefts = [themeButton.getBoundingClientRect().left];
    if (langLink && langLink.offsetWidth) lefts.push(langLink.getBoundingClientRect().left);
    const right = parseFloat(getComputedStyle(themeButton).right) || 0;
    root.setProperty('--theme-w', `${Math.round(window.innerWidth - Math.min(...lefts) - right)}px`);
  };
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(syncControlWidths);
    ro.observe(logoLink);
    if (themeButton) ro.observe(themeButton);
    if (langLink) ro.observe(langLink);
  }
  window.addEventListener('resize', syncControlWidths);
  syncControlWidths();

  /* --- Dark mode --- */
  const toggle = document.getElementById('darkToggle');
  if (toggle) {
    toggle.innerHTML =
      '<svg class="theme-icon icon-sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>' +
      '<span class="theme-track" aria-hidden="true"><span class="theme-knob"></span></span>' +
      '<svg class="theme-icon icon-moon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
    toggle.setAttribute('role', 'switch');
    toggle.title = t('Dark mode');
    toggle.setAttribute('aria-label', t('Dark mode'));
    toggle.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark-mode');
      try { localStorage.setItem('darkMode', isDark ? 'on' : 'off'); } catch (err) { }
      applyTheme();
    });
    applyTheme();
  }

  /* --- Header glass: denser once it sticks over page content --- */
  const siteHeader = document.querySelector('header');
  if (siteHeader) {
    const updateStuck = () => {
      const top = siteHeader.getBoundingClientRect().top;
      siteHeader.classList.toggle('is-stuck', top <= 0.5 && window.scrollY > 0);
      const logo = document.getElementById('siteLogo');
      siteHeader.classList.toggle('is-free', !!logo && top >= logo.getBoundingClientRect().bottom + 4);
    };
    window.addEventListener('resize', updateStuck);
    window.addEventListener('scroll', updateStuck, { passive: true });
    updateStuck();
  }

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#sitenav a:not(.nav-lang)').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  setupMenu();

  /* --- Scroll reveal --- */
  const revealTargets = document.querySelectorAll('.textbox, #about, .context-block, .press-archive');
  let contextBlockIndex = 0;
  revealTargets.forEach(el => {
    el.classList.add('reveal');
    if (el.classList.contains('context-block')) {
      el.style.transitionDelay = `${(contextBlockIndex % 4) * 0.08}s`;
      contextBlockIndex++;
    }
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  setupStoryParts();
  setupToc();

  /* --- Back to top --- */
  const btt = document.createElement('button');
  btt.id = 'backToTop';
  btt.type = 'button';
  btt.setAttribute('aria-label', t('Back to top'));
  btt.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg><span>' + t('Back to top') + '</span>';
  document.body.appendChild(btt);
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });

  /* --- Footer connect links and provenance --- */
  const footerInner = document.querySelector('.footer-inner');
  if (footerInner) {
    const fConnect = document.createElement('div');
    fConnect.className = 'footer-connect';
    fConnect.innerHTML = '<a href="https://github.com/roerstrand" target="_blank" rel="noopener noreferrer">GitHub</a><span aria-hidden="true">·</span><a href="https://www.linkedin.com/in/robinerikstrandberg/" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
    footerInner.insertBefore(fConnect, footerInner.firstChild);

    const fProvenance = document.createElement('p');
    fProvenance.className = 'footer-provenance';
    fProvenance.textContent = t('All historical content on this site is drawn from the digitized material: exhibition catalogs from Malmö City Library, and newspaper clippings and the official site plan from Malmö City Archive.');
    footerInner.appendChild(fProvenance);
  }

  /* --- Gallery and image viewer --- */
  buildGallery();
  buildViewer();
});
