/* ===================================
   SLIDESHOW
=================================== */
let slideIndex = 1;
let autoplayTimer = null;

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

  if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add('active');
  if (counter) counter.textContent = `${slideIndex} / ${slides.length}`;
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function startAutoplay() {
  if (autoplayTimer) return;
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
  });
})();

/* ===================================
   LIGHTBOX
=================================== */
(function () {
  let lbImages = [];
  let lbIndex  = 0;
  let overlay  = null;

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
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const imgs = document.querySelectorAll('.gallery img');
    if (!imgs.length) return;

    lbImages = Array.from(imgs);
    overlay  = buildOverlay();

    lbImages.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => { stopAutoplay(); openAt(i); });
    });

    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lb-prev').addEventListener('click', () => openAt(lbIndex - 1));
    overlay.querySelector('.lb-next').addEventListener('click', () => openAt(lbIndex + 1));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  });

  document.addEventListener('keydown', e => {
    if (!overlay?.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  openAt(lbIndex - 1);
    if (e.key === 'ArrowRight') openAt(lbIndex + 1);
  });
})();

/* ===================================
   DOM READY
=================================== */
document.addEventListener('DOMContentLoaded', () => {

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
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark ? 'on' : 'off');
    });
  }

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#sitenav a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) link.classList.add('active');
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
  const revealTargets = document.querySelectorAll('.gallery-container, .textbox, #about, .context-block');
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
    if (!header || !links.length) return;
    header.insertAdjacentElement('afterend', nav);
    nav.style.top = header.offsetHeight + 'px';

    let clickLock = false;
    let lockTimer = null;

    function setActive(linkIdx, fromClick) {
      links.forEach(l => l.el.classList.remove('page-nav-active'));
      sections.forEach(s => s.classList.remove('section-active'));
      if (linkIdx < 0 || linkIdx >= links.length) return;
      links[linkIdx].el.classList.add('page-nav-active');
      links[linkIdx].sec.classList.add('section-active');
      if (fromClick) {
        links[linkIdx].el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      }
    }

    function getActiveIndex() {
      const offset = header.offsetHeight + nav.offsetHeight + 24;
      let active = 0;
      links.forEach(({ sec }, i) => {
        if (sec.getBoundingClientRect().top <= offset) active = i;
      });
      return active;
    }

    links.forEach(({ el, sec }, i) => {
      el.addEventListener('click', e => {
        e.preventDefault();
        setActive(i, true);
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clickLock = true;
        clearTimeout(lockTimer);
        lockTimer = setTimeout(() => { clickLock = false; }, 900);
      });
    });

    window.addEventListener('scroll', () => {
      if (clickLock) return;
      setActive(getActiveIndex(), false);
    }, { passive: true });

    setActive(getActiveIndex(), false);
  })();

  /* --- Back to top --- */
  const btt = document.createElement('button');
  btt.id = 'backToTop';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '<span aria-hidden="true">↑</span><span>Back to top</span>';
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
  }

  /* --- Init slideshow & autoplay --- */
  showSlides(slideIndex);
  startAutoplay();
});
