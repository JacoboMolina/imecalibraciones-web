/* ============================================================
   IME Calibraciones — Catálogo de Servicios de Calibración
   Lógica de filtros, búsqueda y renderizado.
   Fuente de verdad: /data/productos.json
   ============================================================ */

let allProducts = [];

const state = {
  busqueda: '',
  filtros: {
    magnitud:     new Set(),
    acreditacion: new Set(),
    categoria:    new Set(),
  }
};

/* Normaliza texto: quita acentos y pasa a minúsculas para búsqueda tolerante */
function normalize(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/* ── Cargar datos ── */
async function loadProducts() {
  showSkeletons();
  try {
    const res = await fetch('/data/productos.json');
    if (!res.ok) throw new Error('Error al cargar el catálogo');
    const data = await res.json();
    allProducts = data.productos.filter(p => p.activo !== false);
    buildFilters();
    applyStateFromURL();
    render();
  } catch (err) {
    showError();
    console.error('Catalog load error:', err);
  }
}

/* ── Filtrado ── */
function filterProducts() {
  const q = normalize(state.busqueda);

  return allProducts.filter(p => {
    const matchBusqueda = !q ||
      normalize([p.nombre, p.alcance, p.descripcion_corta, ...(p.tags || [])].join(' ')).includes(q);

    const matchMagnitud     = state.filtros.magnitud.size === 0     || state.filtros.magnitud.has(p.magnitud);
    const matchAcreditacion = state.filtros.acreditacion.size === 0 || state.filtros.acreditacion.has(p.acreditacion);
    const matchCategoria    = state.filtros.categoria.size === 0    || state.filtros.categoria.has(p.categoria);

    return matchBusqueda && matchMagnitud && matchAcreditacion && matchCategoria;
  });
}

/* Orden: magnitud A-Z, luego nombre A-Z */
function sortProducts(products) {
  return [...products].sort((a, b) => {
    const magCmp = (a.magnitud || '').localeCompare(b.magnitud || '', 'es');
    if (magCmp !== 0) return magCmp;
    return (a.nombre || '').localeCompare(b.nombre || '', 'es');
  });
}

/* ── Render ── */
function render() {
  const filtered = sortProducts(filterProducts());
  renderResultsHeader(filtered.length);
  renderActiveChips();
  renderGrid(filtered);
  updateURL();
}

function renderGrid(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  if (products.length === 0) {
    grid.innerHTML = emptyStateHTML();
    return;
  }
  grid.innerHTML = products.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p) {
  const img = p.imagenes?.[0]
    ? `/assets/images/productos/${p.imagenes[0]}`
    : '/assets/images/productos/placeholder.webp';

  const badges = [];
  if (p.acreditacion_pjla) badges.push(`<span class="badge badge-pjla">PJLA ${p.acreditacion_pjla}</span>`);
  if (p.acreditacion_ema)  badges.push(`<span class="badge badge-ema">EMA ${p.acreditacion_ema}</span>`);

  return `
    <a class="product-card" href="/catalogo/${p.slug}/">
      <div class="product-card-image">
        <img src="${img}" alt="${p.nombre}" width="400" height="400" loading="lazy">
      </div>
      <div class="product-card-body">
        <div class="product-magnitud">${p.magnitud || ''}</div>
        <div class="product-card-name">${p.nombre}</div>
        <div class="product-card-alcance">${p.alcance || ''}</div>
        ${badges.length ? `<div class="product-card-badges">${badges.join('')}</div>` : ''}
      </div>
      <div class="product-card-footer">
        <span class="btn btn-primary">Ver detalles</span>
      </div>
    </a>`;
}

function emptyStateHTML() {
  return `
    <div class="catalog-empty">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"/>
      </svg>
      <h3>No encontramos servicios con esos filtros</h3>
      <p>Intenta con otros criterios o contáctanos — podemos ayudarte.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="clearAllFilters()">Limpiar filtros</button>
        <a class="btn btn-primary" href="/contacto/">Contáctanos</a>
      </div>
    </div>`;
}

function renderResultsHeader(count) {
  const el = document.getElementById('results-count');
  if (!el) return;
  el.innerHTML = `Mostrando <strong>${count}</strong> de <strong>${allProducts.length}</strong> servicios`;
}

function renderActiveChips() {
  const container = document.getElementById('active-filters');
  if (!container) return;

  const chips = [];
  for (const [key, set] of Object.entries(state.filtros)) {
    set.forEach(val => {
      chips.push(`
        <span class="filter-chip">
          ${val}
          <button class="filter-chip-remove" onclick="removeFilter('${key}','${val}')" aria-label="Quitar filtro ${val}">×</button>
        </span>`);
    });
  }
  container.innerHTML = chips.join('');

  const clearBtn = document.getElementById('filters-clear');
  if (clearBtn) clearBtn.hidden = chips.length === 0;
}

/* ── Construir sidebar de filtros ── */
function buildFilters() {
  buildFilterGroup('magnitud',     'Magnitud');
  buildFilterGroup('acreditacion', 'Acreditación');
  buildFilterGroup('categoria',    'Categoría');
}

function buildFilterGroup(field) {
  /* El HTML tiene <div data-filter="magnitud"> etc. dentro del aside */
  const container = document.querySelector(`[data-filter="${field}"]`);
  if (!container) return;

  const counts = {};
  allProducts.forEach(p => {
    const val = p[field];
    if (val) counts[val] = (counts[val] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'es'));

  if (sorted.length === 0) {
    container.closest('.filter-group')?.style.setProperty('display', 'none');
    return;
  }

  container.innerHTML = sorted.map(([val, count]) => `
    <label class="filter-option">
      <input type="checkbox" value="${val}" data-field="${field}"
             onchange="toggleFilter('${field}', '${val}', this.checked)">
      <span>${val}</span>
      <span class="filter-count">${count}</span>
    </label>`).join('');
}

/* ── Eventos de filtro ── */
function toggleFilter(field, value, checked) {
  if (checked) {
    state.filtros[field].add(value);
  } else {
    state.filtros[field].delete(value);
  }
  render();
}

function removeFilter(field, value) {
  state.filtros[field].delete(value);
  const cb = document.querySelector(`input[data-field="${field}"][value="${value}"]`);
  if (cb) cb.checked = false;
  render();
}

function clearAllFilters() {
  for (const key of Object.keys(state.filtros)) state.filtros[key].clear();
  state.busqueda = '';
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
  render();
}

/* ── Búsqueda ── */
function initSearch() {
  const input = document.getElementById('catalog-search');
  if (!input) return;
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.busqueda = input.value.trim();
      render();
    }, 200);
  });
}

/* ── URL state (query params) ── */
function updateURL() {
  const params = new URLSearchParams();
  if (state.busqueda) params.set('q', state.busqueda);
  for (const [key, set] of Object.entries(state.filtros)) {
    set.forEach(val => params.append(key, val));
  }
  const newURL = params.toString()
    ? `${window.location.pathname}?${params}`
    : window.location.pathname;
  history.replaceState(null, '', newURL);
}

function applyStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  state.busqueda = params.get('q') || '';
  const searchInput = document.getElementById('catalog-search');
  if (searchInput && state.busqueda) searchInput.value = state.busqueda;

  for (const key of Object.keys(state.filtros)) {
    params.getAll(key).forEach(val => {
      state.filtros[key].add(val);
      const cb = document.querySelector(`input[data-field="${key}"][value="${val}"]`);
      if (cb) cb.checked = true;
    });
  }
}

/* ── Skeletons y error ── */
function showSkeletons() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = Array(6).fill(`
    <div class="product-skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>`).join('');
}

function showError() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="catalog-error">
      <strong>El catálogo está en mantenimiento.</strong>
      Intenta más tarde o <a href="/contacto/">contáctanos directamente</a>.
    </div>`;
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  loadProducts();
  const clearBtn = document.getElementById('filters-clear');
  if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);
  setTimeout(() => {
    if (typeof initScrollAnimations === 'function') initScrollAnimations();
  }, 300);
});
