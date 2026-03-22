/* ============================================================
   IME Calibraciones — Utils
   Header y footer son componentes Astro — no requieren fetch.
   ============================================================ */

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
        el.textContent = current + (elapsed >= duration ? suffix : '');
        if (elapsed < duration) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.counter[data-target]').forEach(el => observer.observe(el));
}

/**
 * Carrusel del hero: avanza automáticamente cada N segundos.
 * Soporta slides mixtos: fotos (background-image) y video (<video> dentro del slide).
 * El video se pausa al salir del slide y se reanuda al entrar.
 */
function initHeroCarousel() {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero__slide');
  if (slides.length < 2) return;

  const INTERVAL = 6000;
  let current = 0;
  let timer;

  // Dots de navegación
  const dotsEl = document.createElement('div');
  dotsEl.className = 'hero__carousel-dots';
  dotsEl.setAttribute('aria-hidden', 'true');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero__carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsEl.appendChild(dot);
  });
  document.getElementById('hero')?.appendChild(dotsEl);
  const dots = dotsEl.querySelectorAll('.hero__carousel-dot');

  function setVideoState(slide, playing) {
    const video = slide.querySelector('video');
    if (!video) return;
    playing ? video.play().catch(() => {}) : video.pause();
  }

  function goTo(index) {
    setVideoState(slides[current], false);
    slides[current].classList.remove('hero__slide--active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('hero__slide--active');
    dots[current]?.classList.add('active');
    setVideoState(slides[current], true);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  resetTimer();
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

/** Inicializar todo al cargar el DOM */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollAnimations();
  initCounters();
  initHeroCarousel();
  initBrandBand();
  let logosCarousel = null;
  const indNav = initIndNav((name) => logosCarousel?.goToIndustry(name));
  logosCarousel = initLogosCarousel(indNav?.goToName);
});
