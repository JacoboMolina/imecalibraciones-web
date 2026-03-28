/* ============================================================
   IME Calibraciones — Utils
   Helpers compartidos y sistema de include de componentes.
   ============================================================ */

/**
 * Carga un componente HTML (header, footer) en un selector del DOM.
 * Permite reutilizar header y footer sin frameworks.
 */
async function loadComponent(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    el.innerHTML = await res.text();
    // Marcar el nav link activo según la URL actual
    if (selector === '#site-header') markActiveNavLink();
  } catch (err) {
    console.warn('Component load error:', err);
  }
}

/** Marca el link de navegación correspondiente a la página actual */
function markActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '/' && path === '/') {
      link.setAttribute('aria-current', 'page');
    } else if (href !== '/' && path.startsWith(href)) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * IntersectionObserver para animaciones scroll-triggered.
 * Agrega clase .visible a los elementos .animate-on-scroll
 * cuando entran al viewport.
 */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo de inmediato en browsers sin soporte
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/** Header sticky: agrega clase .scrolled al hacer scroll */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/** Nav mobile: toggle del menú hamburger */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Contadores animados: cualquier elemento con clase .counter y atributo
 * data-target="<número>" cuenta desde 0 hasta ese número cuando entra al viewport.
 * Opcional: data-suffix="+" agrega el sufijo al final.
 * Opcional: data-duration="1800" sobreescribe la duración en ms (default: 1600).
 */
function initCounters() {
  if (!('IntersectionObserver' in window)) return;

  const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = parseInt(el.dataset.duration, 10) || 1600;
      const start    = performance.now();

      observer.unobserve(el);

      function step(now) {
        const elapsed  = Math.min(now - start, duration);
        const progress = ease(elapsed / duration);
        const current  = Math.floor(progress * target);
        el.textContent = current.toLocaleString('es-MX') + (elapsed >= duration ? suffix : '');
        if (elapsed < duration) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.counter[data-target]').forEach(el => observer.observe(el));
}

/**
 * Carrusel del hero: avanza automáticamente cada N segundos.
 * - Progress bars estilo Instagram (reemplazan los dots)
 * - Texto diferente por slide (título + subtítulo)
 * - Swipe en móvil (50px de umbral)
 * - Soporta slides mixtos: video + fotos (Astro <Image>)
 */
function initHeroCarousel() {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;

  const INTERVAL = 6000;
  let current = 0;
  let timer;

  // Progress bars
  const bars = Array.from(document.querySelectorAll('.hero__progress-bar'));

  // Texto por slide (orden coincide con el HTML: 0=video, 1-3=fotos)
  const SLIDES_DATA = [
    { html: 'Ingeniería y Metrología <span class="hero__title-highlight">Certificada</span><br>Para <span class="hero__title-highlight">Calibración</span>',
      longTitle: true,
      subtitle: 'de Equipos de Control y Pruebas S.A. de C.V.' },
    { title: 'Calibración y',                     highlight: 'Venta de Suministros',
      subtitle: '24,000 instrumentos dentro de nuestro alcance a calibrar — todo con un solo proveedor.' },
    { title: 'Trabajamos los',                    highlight: '365 días del año',
      subtitle: 'Programa de recalibración: evitas olvidos y mantienes el control de tus equipos. ¡Nosotros te avisamos!' },
    { title: 'Presencia en toda la',              highlight: 'República Mexicana y Guatemala',
      subtitle: '3 décadas brindando soluciones metrológicas a las industrias.' },
  ];

  const titleEl    = document.getElementById('heroTitle');
  const subtitleEl = document.getElementById('heroSubtitle');

  function updateBars(index) {
    bars.forEach((bar, i) => {
      const fill = bar.querySelector('.hero__progress-fill');
      bar.classList.remove('hero__progress-bar--active', 'hero__progress-bar--done');
      if (fill) fill.style.animation = 'none';
      if (i < index) {
        bar.classList.add('hero__progress-bar--done');
        if (fill) { fill.style.animation = 'none'; fill.style.transform = 'scaleX(1)'; }
      } else if (i === index) {
        bar.classList.add('hero__progress-bar--active');
        if (fill) {
          fill.style.animation = 'none';
          fill.style.transform = ''; // limpiar inline — deja que el CSS defina scaleX(0) como inicio
          void fill.offsetWidth;
          fill.style.animation = `hero-progress ${INTERVAL}ms linear forwards`;
        }
      } else {
        if (fill) { fill.style.animation = 'none'; fill.style.transform = 'scaleX(0)'; }
      }
    });
  }

  function updateText(index) {
    const data = SLIDES_DATA[index];
    if (!data || !titleEl) return;
    titleEl.style.opacity = '0';
    if (subtitleEl) subtitleEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.innerHTML = data.html
        ? data.html
        : data.title + '<br><span class="hero__title-highlight">' + data.highlight + '</span>';
      titleEl.classList.toggle('hero__title--long', !!data.longTitle);
      titleEl.style.opacity = '1';
    }, 180);
    if (subtitleEl) setTimeout(() => {
      subtitleEl.textContent = data.subtitle;
      subtitleEl.style.opacity = '1';
    }, 240);
  }

  function setVideoState(slide, playing) {
    const video = slide.querySelector('video');
    if (!video) return;
    playing ? video.play().catch(() => {}) : video.pause();
  }

  function goTo(index) {
    setVideoState(slides[current], false);
    slides[current].classList.remove('hero__slide--active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('hero__slide--active');
    setVideoState(slides[current], true);
    updateBars(current);
    updateText(current);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  // Swipe en móvil
  let touchStartX = 0;
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); resetTimer(); }
    }, { passive: true });
  }

  updateBars(0);
  resetTimer();
}

/**
 * Video facade: carga el iframe de YouTube solo cuando el usuario hace clic.
 * Evita los ~500KB de JS de YouTube hasta que sea necesario.
 */
function initVideoFacade() {
  const facade = document.getElementById('videoFacade');
  if (!facade) return;
  const videoId = facade.dataset.videoId;

  function activate() {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = 'Video institucional IME Calibraciones';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.innerHTML = '';
    facade.appendChild(iframe);
    facade.style.cursor = 'default';
  }

  facade.addEventListener('click', activate, { once: true });
  facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } }, { once: true });
}

/**
 * Brand band: marca .has-video cuando el video del logo carga.
 * Sin video, el texto de fallback se muestra via CSS (.brand-band:not(.has-video)).
 */
function initBrandBand() {
  const video = document.querySelector('.brand-band__video');
  if (!video) return;
  const band = video.closest('.brand-band');
  const onReady = () => band?.classList.add('has-video');
  if (video.readyState >= 3) { onReady(); return; }
  video.addEventListener('canplay', onReady, { once: true });
  video.addEventListener('error', () => video.remove(), { once: true });
}

/**
 * Nav de industrias: carrusel infinito (siempre avanza a la derecha).
 * Muestra 3 visibles (prev · active · next) con gradiente de opacidad.
 * Los logos del carrusel inferior lo sincronizan vía goToName().
 * Retorna { goToName } para que initLogosCarousel pueda sincronizarlo.
 */
function initIndNav(onNavClick) {
  const el = document.getElementById('indNav');
  if (!el) return null;

  const track     = el.querySelector('.ind-nav__track');
  const origItems = Array.from(track.querySelectorAll('.ind-nav__item'));
  const N         = origItems.length;
  const GAP       = 32; // debe coincidir con el CSS gap del track

  if (N < 2) return null;

  // Clonar los primeros items y añadirlos al final para el loop infinito
  const CLONES = 3;
  for (let i = 0; i < CLONES; i++) {
    const clone = origItems[i].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.style.pointerEvents = 'none';
    track.appendChild(clone);
  }

  const allItems = Array.from(track.children); // N + CLONES items
  let step     = 0;    // índice DOM actual (0 … N+CLONES−1)
  let snapping = false; // true durante el snap silencioso de vuelta al inicio

  function updateClasses() {
    const len  = allItems.length;
    const prev = (step - 1 + len) % len;
    const next = (step + 1) % len;
    allItems.forEach((item, i) => {
      item.classList.remove('ind-nav__item--active', 'ind-nav__item--adjacent');
      if (i === step)             item.classList.add('ind-nav__item--active');
      else if (i === prev || i === next) item.classList.add('ind-nav__item--adjacent');
    });
  }

  function centerActive(animate) {
    let leftEdge = 0;
    for (let i = 0; i < step; i++) leftEdge += allItems[i].offsetWidth + GAP;
    const tx = el.offsetWidth / 2 - (leftEdge + allItems[step].offsetWidth / 2);
    track.style.transition = animate ? 'transform .45s cubic-bezier(.25,.46,.45,.94)' : 'none';
    track.style.transform  = `translateX(${tx}px)`;
  }

  function setStep(s, animate) {
    step = s;
    updateClasses();
    centerActive(animate);
    if (animate && step >= N) {
      // Bloquear nuevas llamadas hasta que termine el snap
      snapping = true;
      setTimeout(() => {
        step    -= N;
        updateClasses();
        centerActive(false);
        snapping = false;
      }, 470); // ligeramente mayor que la duración de la transición (450ms)
    }
  }

  /**
   * Salta a la industria con ese nombre, siempre avanzando a la derecha.
   * Llamado por initLogosCarousel cuando cambia la industria visible.
   */
  function goToName(name) {
    if (snapping) return;
    const idx = origItems.findIndex(item => item.textContent.trim() === name.trim());
    if (idx === -1 || idx === step) return;
    // Para ir siempre a la derecha: si el destino está antes del paso actual,
    // apuntamos al clon equivalente (idx + N).
    const targetStep = idx > step ? idx : idx + N;
    setStep(targetStep, true);
  }

  origItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (snapping) return;
      const targetStep = i > step ? i : i + N;
      setStep(targetStep, true);
      onNavClick?.(item.textContent.trim());
    });
  });

  el.addEventListener('mouseenter', () => {});  // placeholder para posible pausa futura
  setStep(0, false);

  return { goToName };
}


/**
 * Carrusel continuo de logos: pista única, loop infinito hacia la derecha.
 * Acepta un callback onIndustryChange(name) que se llama cada vez que el logo
 * visible cambia de industria — usado para sincronizar el ind-nav superior.
 */
function initLogosCarousel(onIndustryChange) {
  const carousel = document.getElementById('logosCarousel');
  const track    = document.getElementById('logosTrack');
  if (!carousel || !track) return;

  const origItems = Array.from(track.children);
  const N = origItems.length;
  if (N < 3) return;

  const gap  = parseFloat(getComputedStyle(track).columnGap) || 48;
  const SLOT = origItems[0].offsetWidth + gap;

  const DURATION = 420;
  const PAUSE    = 1800;

  // Clonar los primeros 3 items al final para el loop infinito
  for (let i = 0; i < 3; i++) {
    const clone = origItems[i].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  let step            = 0;
  let isAnimating     = false;
  let timer;
  let currentIndustry = origItems[0]?.dataset.industry ?? '';

  function setOffset(s, animate) {
    track.style.transition = animate
      ? `transform ${DURATION}ms cubic-bezier(.25,.46,.45,.94)`
      : 'none';
    track.style.transform = `translateX(-${s * SLOT}px)`;
  }

  function notifyIfChanged() {
    // Usar el logo que está entrando al centro del viewport (uno adelante del borde izquierdo)
    const industry = origItems[(step + 2) % N]?.dataset.industry;
    if (industry && industry !== currentIndustry) {
      currentIndustry = industry;
      onIndustryChange?.(industry);
    }
  }

  function advance() {
    if (isAnimating) return;
    isAnimating = true;
    step++;
    setOffset(step, true);
    notifyIfChanged(); // actualizar nav en cuanto empieza el movimiento
    setTimeout(() => {
      if (step >= N) { step = 0; setOffset(0, false); }
      isAnimating = false;
    }, DURATION + 20);
  }

  setOffset(0, false);

  function startTimer() { clearInterval(timer); timer = setInterval(advance, PAUSE); }
  function stopTimer()  { clearInterval(timer); }

  function goToIndustry(name) {
    const idx = origItems.findIndex(item => item.dataset.industry === name);
    if (idx === -1 || isAnimating) return;
    step = idx;
    currentIndustry = name;
    setOffset(step, false);
    startTimer();
  }

  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);
  startTimer();

  return { goToIndustry };
}

/**
 * Marquee de logos: animación RAF, loop infinito, sincronización con nav.
 * onIndustryChange(name) se llama cuando el logo centrado cambia de industria.
 * Retorna { goToIndustry }.
 */
function initLogosMarquee(onIndustryChange) {
  const marquee = document.getElementById('logosMarquee');
  const track   = marquee?.querySelector('.logos-marquee__track');
  const origSet = track?.querySelector('.logos-marquee__set');
  if (!marquee || !track || !origSet) return null;

  track.style.animation = 'none'; // JS toma el control

  let pos             = 0;
  let paused          = false;
  let currentIndustry = null;
  const SPEED         = 1.3; // px/frame ≈ 78px/s a 60fps

  let itemData     = [];
  let setWidth     = 0;
  let marqueeHalfW = 0;

  // Recalcula posiciones solo de los items visibles (se llama al init y al filtrar)
  function rebuildItemData() {
    itemData     = [];
    setWidth     = origSet.offsetWidth;
    marqueeHalfW = marquee.offsetWidth / 2;
    Array.from(origSet.querySelectorAll('.logos-marquee__item')).forEach(item => {
      if (item.style.display === 'none') return;
      itemData.push({
        left:     item.offsetLeft,
        right:    item.offsetLeft + item.offsetWidth,
        industry: item.dataset.industry,
      });
    });
  }

  requestAnimationFrame(rebuildItemData);

  let _rafFrame = 0;

  function getIndustryAtCenter() {
    if (!setWidth) return null;
    // LEAD: detectar un poco antes de que el logo llegue al centro exacto
    const LEAD   = 200;
    const center = (pos + marqueeHalfW + LEAD) % setWidth;
    for (const d of itemData) {
      if (center >= d.left && center < d.right) return d.industry;
    }
    return null;
  }

  function tick() {
    if (!paused) {
      pos += SPEED;
      if (pos >= setWidth && setWidth) pos -= setWidth;
      track.style.transform = `translateX(-${pos}px)`;

      // Detectar industria cada 8 frames (~7.5 veces/s) en lugar de 60fps
      if ((++_rafFrame & 7) === 0) {
        const ind = getIndustryAtCenter();
        if (ind && ind !== currentIndustry) {
          currentIndustry = ind;
          onIndustryChange?.(ind);
        }
      }
    }
    requestAnimationFrame(tick);
  }

  marquee.addEventListener('mouseenter', () => { paused = true;  });
  marquee.addEventListener('mouseleave', () => { paused = false; });
  requestAnimationFrame(tick);

  function goToIndustry(name) {
    const d = itemData.find(x => x.industry === name);
    if (d) pos = d.left;
  }

  // Filtra el marquee a una sola industria:
  // 1) desvanece los otros con CSS transition (.is-dim)
  // 2) tras 420ms los oculta con display:none y recalcula
  function swapFilter(fn) {
    // Fade out → ejecutar cambio invisible → fade in
    marquee.style.transition = 'opacity .22s ease';
    marquee.style.opacity    = '0';
    setTimeout(() => {
      fn();
      pos = 0;
      rebuildItemData();
      marquee.style.opacity = '1';
    }, 230);
  }

  function filterToIndustry(name) {
    swapFilter(() => {
      track.querySelectorAll('.logos-marquee__item').forEach(item => {
        item.style.display = item.dataset.industry === name ? '' : 'none';
      });
    });
  }

  function clearFilter() {
    swapFilter(() => {
      track.querySelectorAll('.logos-marquee__item').forEach(item => {
        item.style.display = '';
      });
    });
  }

  return { goToIndustry, filterToIndustry, clearFilter };
}

/**
 * Nav del marquee — actualiza el item activo al scrollear,
 * y al hacer click filtra logos + salta el marquee al primero.
 * Retorna onAutoUpdate para que el marquee lo llame al cambiar de industria.
 */
function initMarqueeFilter(marqueeCtrl) {
  const nav     = document.getElementById('indNavMarquee');
  const marquee = document.getElementById('logosMarquee');
  if (!nav || !marquee) return null;

  const navItems  = Array.from(nav.querySelectorAll('.ind-nav__item'));
  const logoItems = Array.from(marquee.querySelectorAll('.logos-marquee__item'));
  let filterActive = false; // true cuando el usuario eligió una industria manualmente

  function setActiveNav(industry) {
    navItems.forEach(i => i.classList.remove('ind-nav__item--active'));
    navItems.find(i => i.textContent.trim() === industry)
            ?.classList.add('ind-nav__item--active');
  }

  // Llamada automática por el marquee al cruzar una industria
  function onAutoUpdate(industry) {
    if (filterActive) return; // el usuario tiene un filtro activo: no pisar
    setActiveNav(industry);
  }

  navItems.forEach(navItem => {
    navItem.addEventListener('click', () => {
      const industry = navItem.textContent.trim();

      if (filterActive && navItem.classList.contains('ind-nav__item--active')) {
        // Segundo click en el activo: quitar filtro
        filterActive = false;
        navItems.forEach(i => i.classList.remove('ind-nav__item--active'));
        marqueeCtrl?.clearFilter();
      } else {
        filterActive = true;
        setActiveNav(industry);
        marqueeCtrl?.goToIndustry(industry);
        marqueeCtrl?.filterToIndustry(industry);
      }
    });
  });

  return onAutoUpdate;
}

/** Inicializar todo al cargar el DOM */
function initLogoVideo() {
  const video = document.querySelector('.sobre-ime__video');
  if (!video) return;
  const FADE = 1.6; // segundos antes del final para empezar el fade
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - FADE) {
      video.style.opacity = '0';
    }
  });
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
    setTimeout(() => { video.style.opacity = '1'; }, 50);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollAnimations();
  initCounters();
  initHeroCarousel();
  initVideoFacade();
  initLogoVideo();
  initBrandBand();
  let logosCarousel = null;
  const indNav = initIndNav((name) => logosCarousel?.goToIndustry(name));
  logosCarousel = initLogosCarousel(indNav?.goToName);
  // Patrón de referencia mutable para romper la dependencia circular:
  // marquee necesita el callback del nav, nav necesita el ctrl del marquee
  let autoNavFn = null;
  const marqueeCtrl = initLogosMarquee((ind) => autoNavFn?.(ind));
  autoNavFn = initMarqueeFilter(marqueeCtrl);
});
