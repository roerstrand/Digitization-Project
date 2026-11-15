/* ===================================
   SLIDESHOW
=================================== */
let slideIndex = 1;
let autoplayTimer = null;
let autoplayPaused = false;

function showSlides(n) {
  const slides  = document.getElementsByClassName('gallery');
  const dots    = document.getElementsByClassName('indicator');
  const counter = document.querySelector('.slide-counter');

  if (!slides || slides.length === 0) return;

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    slides[i].classList.remove('fade1');
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }

  const current = slides[slideIndex - 1];
  current.style.display = 'block';
  void current.offsetWidth;
  current.classList.add('fade1');

  for (let i = 0; i < dots.length; i++) {
    dots[i].setAttribute('aria-current', i === slideIndex - 1 ? 'true' : 'false');
  }
  if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
  if (counter) counter.textContent = `${slideIndex} / ${slides.length}`;

  updateCaption(current.querySelector('img'));
}

function updateCaption(img) {
  const caption = document.querySelector('.gallery-caption');
  if (!caption || !img) return;
  const source = [img.dataset.docsource, img.dataset.collection, img.dataset.year]
    .filter(Boolean)
    .join(' · ');
  caption.querySelector('.gallery-caption-text').textContent = img.dataset.caption || img.alt;
  caption.querySelector('.gallery-caption-source-value').textContent = source;
}

function buildCaption() {
  const wrapper = document.querySelector('.gallery-wrapper');
  if (!wrapper || wrapper.querySelector('.gallery-caption')) return;
  const caption = document.createElement('div');
  caption.className = 'gallery-caption';
  caption.setAttribute('aria-live', 'polite');
  caption.innerHTML = '<p class="gallery-caption-text"></p>' +
    '<p class="gallery-caption-source"><b>Source</b><span class="gallery-caption-source-value"></span></p>';
  const counter = wrapper.querySelector('.slide-counter');
  if (counter) caption.appendChild(counter);
  wrapper.appendChild(caption);

  document.querySelectorAll('.gallery-indicators .indicator').forEach((dot, i) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Show image ${i + 1}`);
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentSlide(i + 1);
      }
    });
  });
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function startAutoplay() {
  if (autoplayTimer || autoplayPaused) return;
  autoplayTimer = setInterval(() => plusSlides(1), 5000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}

/* ===================================
   TOUCH / SWIPE
=================================== */
(function () {
  let startX = 0;

  document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.gallery-wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) {
        stopAutoplay();
        plusSlides(dx < 0 ? 1 : -1);
        startAutoplay();
      }
    }, { passive: true });

    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    wrapper.addEventListener('focusin', stopAutoplay);
    wrapper.addEventListener('focusout', e => {
      if (!wrapper.contains(e.relatedTarget)) startAutoplay();
    });
  });
})();

/* ===================================
   LIGHTBOX
=================================== */
(function () {
  let lbImages = [];
  let lbIndex  = 0;
  let overlay  = null;
  let lastFocus = null;

  function focusables() {
    return Array.from(overlay.querySelectorAll('button'))
      .filter(b => b.style.display !== 'none');
  }

  function buildOverlay() {
    const el = document.createElement('div');
    el.id = 'lightbox';
    el.className = 'lightbox-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Image viewer');
    el.innerHTML = `
      <div class="lightbox-inner">
        <div class="lightbox-top">
          <span class="lightbox-counter"></span>
          <button class="lightbox-close" aria-label="Close">&times;</button>
        </div>
        <div class="lightbox-img-wrap">
          <button class="lightbox-nav lb-prev" aria-label="Previous image">&#10094;</button>
          <img class="lb-img" src="" alt="">
          <button class="lightbox-nav lb-next" aria-label="Next image">&#10095;</button>
        </div>
        <div class="lightbox-info">
          <p class="lightbox-caption"></p>
          <div class="lightbox-meta-grid">
            <div class="lightbox-meta-item">
              <span class="lightbox-meta-label">Format</span>
              <span class="lightbox-meta-value lb-type"></span>
            </div>
            <div class="lightbox-meta-item">
              <span class="lightbox-meta-label">Source</span>
              <span class="lightbox-meta-value lb-source"></span>
            </div>
            <div class="lightbox-meta-item">
              <span class="lightbox-meta-label">Year</span>
              <span class="lightbox-meta-value lb-year"></span>
            </div>
            <div class="lightbox-meta-item">
              <span class="lightbox-meta-label">Collection</span>
              <span class="lightbox-meta-value lb-collection"></span>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);
    return el;
  }

  function openAt(i) {
    const wasOpen = overlay.classList.contains('open');
    if (!wasOpen) lastFocus = document.activeElement;
    lbIndex = (i + lbImages.length) % lbImages.length;
    const img = lbImages[lbIndex];

    overlay.querySelector('.lb-img').src   = img.src;
    overlay.querySelector('.lb-img').alt   = img.alt;
    overlay.querySelector('.lightbox-caption').textContent = img.dataset.caption    || img.alt;
    overlay.querySelector('.lb-type').textContent          = img.dataset.doctype    || '—';
    overlay.querySelector('.lb-source').textContent        = img.dataset.docsource  || '—';
    overlay.querySelector('.lb-year').textContent          = img.dataset.year       || '1914';
    overlay.querySelector('.lb-collection').textContent    = img.dataset.collection || 'Malmö City Library';
    overlay.querySelector('.lightbox-counter').textContent = `${lbIndex + 1} / ${lbImages.length}`;

    const showNav = lbImages.length > 1;
    overlay.querySelector('.lb-prev').style.display = showNav ? '' : 'none';
    overlay.querySelector('.lb-next').style.display = showNav ? '' : 'none';

    overlay.classList.add('open');
    overlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (!wasOpen) overlay.querySelector('.lightbox-close').focus();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const imgs = document.querySelectorAll('.gallery img');
    if (!imgs.length) return;

    lbImages = Array.from(imgs);
    overlay  = buildOverlay();

    lbImages.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Enlarge image: ${img.alt}`);
      img.addEventListener('click', () => { stopAutoplay(); openAt(i); });
      img.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          stopAutoplay();
          openAt(i);
        }
      });
    });

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lb-prev').addEventListener('click', () => openAt(lbIndex - 1));
    overlay.querySelector('.lb-next').addEventListener('click', () => openAt(lbIndex + 1));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  });

  document.addEventListener('keydown', e => {
    if (!overlay?.classList.contains('open')) return;
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last  = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  openAt(lbIndex - 1);
    if (e.key === 'ArrowRight') openAt(lbIndex + 1);
  });
})();

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
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  /* --- Site logo (fixed top-left) --- */
  const inSubdir = window.location.pathname.includes('/metadataonwebsite/') ||
                  window.location.pathname.includes('TEI-XSL-HTML');
  const logoLink = document.createElement('a');
  logoLink.id = 'siteLogo';
  logoLink.href = inSubdir ? '../index.html' : 'index.html';
  logoLink.setAttribute('aria-label', 'Baltic Exhibition 1914 — Home');
  logoLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="15" height="20" fill="currentColor" aria-hidden="true">
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
  </svg><span>Home</span>`;
  document.body.appendChild(logoLink);

  /* --- Dark mode --- */
  const toggle = document.getElementById('darkToggle');
  let storedMode = null;
  try { storedMode = localStorage.getItem('darkMode'); } catch (err) { storedMode = null; }
  if (storedMode === 'on') {
    document.body.classList.add('dark-mode');
  }
  if (toggle) {
    toggle.innerHTML =
      '<svg class="theme-icon icon-moon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>' +
      '<svg class="theme-icon icon-sun" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.setAttribute('aria-pressed', String(document.body.classList.contains('dark-mode')));
    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      toggle.setAttribute('aria-pressed', String(isDark));
      try { localStorage.setItem('darkMode', isDark ? 'on' : 'off'); } catch (err) { }
    });
  }

  /* --- Header glass: denser once it sticks over page content --- */
  const siteHeader = document.querySelector('header');
  if (siteHeader) {
    const updateStuck = () => {
      siteHeader.classList.toggle('is-stuck', siteHeader.getBoundingClientRect().top <= 0.5 && window.scrollY > 0);
    };
    window.addEventListener('scroll', updateStuck, { passive: true });
    updateStuck();
    document.documentElement.style.setProperty('--sticky-offset', siteHeader.offsetHeight + 'px');
  }

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#sitenav a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* --- Burger menu --- */
  const navToggle = document.getElementById('navToggle');
  const sitenav   = document.getElementById('sitenav');

  function closeNav() {
    sitenav.classList.remove('nav-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && sitenav) {
    navToggle.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = sitenav.classList.toggle('nav-open');
      if (isOpen) {
        const top = navToggle.closest('header').getBoundingClientRect().top;
        if (top > 0) window.scrollTo({ top: window.scrollY + top, behavior: 'instant' });
      }
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    sitenav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('header') && sitenav.classList.contains('nav-open')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sitenav.classList.contains('nav-open')) closeNav();
    });
  }

  /* --- Slideshow keyboard navigation (disabled when lightbox is open) --- */
  document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox')?.classList.contains('open')) return;
    if (!document.querySelector('.gallery')) return;
    if (e.key === 'ArrowLeft')  { stopAutoplay(); plusSlides(-1); startAutoplay(); }
    if (e.key === 'ArrowRight') { stopAutoplay(); plusSlides(1);  startAutoplay(); }
  });

  /* --- Scroll reveal --- */
  const revealTargets = document.querySelectorAll('.textbox, #about, .context-block');
  let contextBlockIndex = 0;
  revealTargets.forEach(el => {
    el.classList.add('reveal');
    if (el.classList.contains('context-block')) {
      el.style.transitionDelay = `${contextBlockIndex * 0.1}s`;
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
    }, { threshold: 0.08 });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  /* --- Page nav (section strip) --- */
  (function buildPageNav() {
    const sections = Array.from(
      document.querySelectorAll('.context-block, .method-section')
    );
    if (sections.length < 2) return;

    sections.forEach((sec, i) => { if (!sec.id) sec.id = 'section-' + i; });

    const nav = document.createElement('nav');
    nav.className = 'page-nav';
    nav.setAttribute('aria-label', 'Page sections');

    const inner = document.createElement('div');
    inner.className = 'page-nav-inner';

    const label = document.createElement('span');
    label.className = 'page-nav-label';
    label.textContent = 'On this page';
    inner.appendChild(label);

    const links = [];
    sections.forEach((sec, i) => {
      const labelEl = sec.querySelector('.context-label, .section-label');
      const headingEl = sec.querySelector('h2, h3');
      const text = (labelEl && labelEl.textContent.trim()) ||
                   (headingEl && headingEl.textContent.trim()) || '';
      if (!text) return;

      const a = document.createElement('a');
      a.href = '#' + sec.id;
      a.className = 'page-nav-link';
      a.textContent = text;
      inner.appendChild(a);
      links.push({ el: a, sec, secIdx: i });
    });

    nav.appendChild(inner);
    const header = document.querySelector('header');
    const main = document.getElementById('content');
    if (!header || !main || !links.length) return;
    main.insertAdjacentElement('beforebegin', nav);

    function updateOffsets() {
      nav.style.top = header.offsetHeight + 'px';
      document.documentElement.style.setProperty('--sticky-offset', (header.offsetHeight + nav.offsetHeight) + 'px');
    }
    updateOffsets();
    window.addEventListener('resize', updateOffsets);

    let clickLock = false;
    let lockTimer = null;
    let activeIdx = -1;

    function revealLink(el) {
      const target = el.offsetLeft - (inner.clientWidth - el.offsetWidth) / 2;
      inner.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }

    function setActive(linkIdx) {
      if (linkIdx === activeIdx) return;
      activeIdx = linkIdx;
      links.forEach(l => {
        l.el.classList.remove('page-nav-active');
        l.el.removeAttribute('aria-current');
      });
      sections.forEach(s => s.classList.remove('section-active'));
      if (linkIdx < 0 || linkIdx >= links.length) return;
      links[linkIdx].el.classList.add('page-nav-active');
      links[linkIdx].el.setAttribute('aria-current', 'location');
      links[linkIdx].sec.classList.add('section-active');
      revealLink(links[linkIdx].el);
    }

    function getActiveIndex() {
      const offset = header.offsetHeight + nav.offsetHeight + 40;
      let active = 0;
      links.forEach(({ sec }, i) => {
        if (sec.getBoundingClientRect().top <= offset) active = i;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        active = links.length - 1;
      }
      return active;
    }

    links.forEach(({ el, sec }, i) => {
      el.addEventListener('click', e => {
        e.preventDefault();
        setActive(i);
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + sec.id);
        clickLock = true;
        clearTimeout(lockTimer);
        lockTimer = setTimeout(() => { clickLock = false; }, 900);
      });
    });

    window.addEventListener('scroll', () => {
      if (clickLock) return;
      setActive(getActiveIndex());
    }, { passive: true });

    setActive(getActiveIndex());

    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  })();

  /* --- Back to top --- */
  const btt = document.createElement('button');
  btt.id = 'backToTop';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg><span>Back to top</span>';
  document.body.appendChild(btt);

  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- Footer connect links --- */
  const footerInner = document.querySelector('.footer-inner');
  if (footerInner) {
    const fConnect = document.createElement('div');
    fConnect.className = 'footer-connect';
    fConnect.innerHTML = '<a href="https://github.com/roerstrand" target="_blank" rel="noopener noreferrer">GitHub</a><span aria-hidden="true">·</span><a href="https://www.linkedin.com/in/robinerikstrandberg/" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
    footerInner.insertBefore(fConnect, footerInner.firstChild);

    const fProvenance = document.createElement('p');
    fProvenance.className = 'footer-provenance';
    fProvenance.textContent = 'All historical content on this site is drawn from the digitized material: exhibition catalogs from Malmö City Library, and maps and newspaper clippings from Malmö City Archive.';
    footerInner.appendChild(fProvenance);
  }

  /* --- Init slideshow & autoplay --- */
  buildCaption();
  showSlides(slideIndex);

  const galleryWrapper = document.querySelector('.gallery-wrapper');
  const slideCount = document.querySelectorAll('.gallery').length;
  if (galleryWrapper && slideCount > 1) {
    autoplayPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    const pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.className = 'gallery-pause';
    const syncPause = () => {
      pauseBtn.textContent = autoplayPaused ? '▶ Play slideshow' : '❚❚ Pause slideshow';
      pauseBtn.setAttribute('aria-pressed', String(autoplayPaused));
    };
    pauseBtn.addEventListener('click', () => {
      autoplayPaused = !autoplayPaused;
      if (autoplayPaused) stopAutoplay(); else startAutoplay();
      syncPause();
    });
    syncPause();
    controls.appendChild(pauseBtn);

    const indicators = document.querySelector('.gallery-indicators');
    (indicators || galleryWrapper).insertAdjacentElement('afterend', controls);

    startAutoplay();
  }
});
