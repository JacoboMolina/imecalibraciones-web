/**
 * IME Calibraciones — Generador de páginas de producto
 *
 * Lee /data/productos.json y genera una página HTML por cada producto
 * en /catalogo/[slug]/index.html usando el template en /templates/producto.html
 *
 * Uso: node scripts/generate-catalog.js
 *
 * Correr después de cada actualización del catálogo.
 */

const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'productos.json');
const TEMPLATE  = path.join(ROOT, 'templates', 'producto.html');
const OUT_DIR   = path.join(ROOT, 'catalogo');

function main() {
  // Leer datos y template
  const data     = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const template = fs.readFileSync(TEMPLATE, 'utf8');

  const productos = data.productos.filter(p => p.activo !== false);
  console.log(`\nGenerando ${productos.length} páginas de producto...\n`);

  let ok = 0;
  let errors = 0;

  productos.forEach(producto => {
    try {
      const html = renderTemplate(template, producto);
      const dir  = path.join(OUT_DIR, producto.slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
      console.log(`  ✓  ${producto.slug}`);
      ok++;
    } catch (err) {
      console.error(`  ✗  ${producto.slug || producto.id}: ${err.message}`);
      errors++;
    }
  });

  console.log(`\nListo: ${ok} generados, ${errors} errores.\n`);
  if (errors > 0) process.exit(1);
}

/** Reemplaza tokens {{campo}} en el template con los valores del producto */
function renderTemplate(template, p) {
  const imgPrimaria = p.imagenes?.[0]
    ? `/assets/images/productos/${p.imagenes[0]}`
    : '/assets/images/productos/placeholder.webp';

  const thumbsHTML = (p.imagenes || []).map((img, i) => `
    <div class="product-thumb${i === 0 ? ' active' : ''}" onclick="setMainImage(this, '/assets/images/productos/${img}')">
      <img src="/assets/images/productos/${img}" alt="${p.nombre} - vista ${i + 1}" loading="lazy">
    </div>`).join('');

  const specsHTML = (p.especificaciones || []).map(s => `
    <tr>
      <td>${s.campo}</td>
      <td>${s.valor}</td>
    </tr>`).join('');

  const schemaProduct = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': p.nombre,
    'brand': { '@type': 'Brand', 'name': p.marca },
    'model': p.modelo || '',
    'description': p.descripcion_larga || p.descripcion_corta,
    'image': (p.imagenes || []).map(img => `https://imecalibraciones.com/assets/images/productos/${img}`),
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'seller': { '@type': 'Organization', 'name': 'IME Calibraciones' },
      'url': `https://imecalibraciones.com/catalogo/${p.slug}/`
    }
  }, null, 2);

  const schemaBreadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Inicio',   'item': 'https://imecalibraciones.com/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Catálogo', 'item': 'https://imecalibraciones.com/catalogo/' },
      { '@type': 'ListItem', 'position': 3, 'name': p.nombre,   'item': `https://imecalibraciones.com/catalogo/${p.slug}/` }
    ]
  }, null, 2);

  const pdfButton = p.pdf_ficha
    ? `<a class="btn btn-secondary" href="/assets/pdfs/${p.pdf_ficha}" download>Descargar ficha técnica (PDF)</a>`
    : '';

  return template
    .replace(/{{nombre}}/g,             p.nombre || '')
    .replace(/{{marca}}/g,              p.marca || '')
    .replace(/{{modelo}}/g,             p.modelo || '')
    .replace(/{{magnitud}}/g,           p.magnitud || '')
    .replace(/{{slug}}/g,               p.slug || '')
    .replace(/{{descripcion_corta}}/g,  p.descripcion_corta || '')
    .replace(/{{descripcion_larga}}/g,  p.descripcion_larga || p.descripcion_corta || '')
    .replace(/{{img_primaria}}/g,       imgPrimaria)
    .replace(/{{thumbs}}/g,             thumbsHTML)
    .replace(/{{specs}}/g,              specsHTML)
    .replace(/{{pdf_button}}/g,         pdfButton)
    .replace(/{{schema_product}}/g,     schemaProduct)
    .replace(/{{schema_breadcrumb}}/g,  schemaBreadcrumb);
}

main();
