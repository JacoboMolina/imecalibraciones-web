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

/** Inicializar todo al cargar el DOM */
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('#site-header', '/components/header.html'),
    loadComponent('#site-footer', '/components/footer.html'),
  ]);
  initStickyHeader();
  initMobileNav();
  initScrollAnimations();
});
