# TASKS — IME Calibraciones
> Orden de implementación para el agente. Leer el PRD completo (`prd-ime.html`) antes de empezar.
> Cada tarea debe completarse y verificarse antes de pasar a la siguiente.

---

## FASE 0 — Setup (hacer primero, siempre)

- [ ] Crear estructura de archivos según PRD sección 3
- [ ] Inicializar repo y configurar GitHub Pages con dominio personalizado `imecalibraciones.com` (agregar archivo `CNAME` con el dominio, sin www)
- [ ] Crear `assets/css/main.css` con variables CSS del design system
  - Colores: usar provisionales del PRD marcados con `/* TBD-MANUAL */`
  - Tipografía: Poppins vía Google Fonts (`preconnect` + `font-display: swap`), ERAS BOLD ITC vía `@font-face` (requiere archivos `.woff/.woff2` de IME — usar `'Arial Black'` como fallback mientras no llegan)
  - Variables de transición: `--transition-fast`, `--transition-normal`, `--transition-slow`
- [ ] Crear `assets/css/components.css` vacío
- [ ] Crear `assets/css/catalog.css` vacío
- [ ] Agregar `@media (prefers-reduced-motion: reduce)` en `main.css` — deshabilitar todas las animaciones para usuarios que lo requieren
- [ ] Crear `404.html` — con diseño branded de IME, logo, mensaje claro y botón "Ir al inicio"
- [ ] Crear `robots.txt` — permitir todo excepto `/data/` y `/scripts/`
- [ ] Generar favicons desde el logo de IME:
  - `assets/images/logo/favicon.svg`
  - `assets/images/logo/favicon-32.png` (32×32px)
  - `assets/images/logo/apple-touch-icon.png` (180×180px)
- [ ] Crear imagen placeholder genérica para productos sin foto: `assets/images/productos/placeholder.webp` — logo IME centrado sobre fondo neutro

---

## FASE 1 — Sitio web

### Tarea 1 — Componentes globales
> Estos van en todas las páginas. Hacerlos bien antes de tocar cualquier página.

- [ ] **Header / Nav** — logo IME, navegación (Inicio, Servicios, Acreditaciones, Catálogo, Nosotros, Contacto), link al portal calibracionesime.com.mx, hamburger en mobile. Sticky con sombra sutil al hacer scroll.
- [ ] **Footer** — logo, links de nav, datos de contacto (Tel: +52 246 126 1782), redes sociales con URLs confirmadas:
  - Facebook: `facebook.com/CalibracionIME`
  - Instagram: `instagram.com/calibracionesime`
  - YouTube: `youtube.com/@CalibracionesIME`
  - LinkedIn: `mx.linkedin.com/company/calibracionesime`
  - Link al portal calibracionesime.com.mx
  - Copyright + links legales
- [ ] **Breadcrumb** — componente reutilizable + JSON-LD `BreadcrumbList`. No mostrar en Home.
- [ ] **WhatsApp widget** — botón flotante, cargar con `defer`, no bloquear render. El script/código lo provee el cliente.
- [ ] **Animaciones globales** — implementar IntersectionObserver para fade-in + slide-up en secciones al entrar al viewport. Clase `.animate-on-scroll` en elementos que deben animarse.
- [ ] Verificar header, footer y animaciones en Chrome, Firefox, Safari y Edge antes de continuar

### Tarea 2 — Home (`/index.html`)
> Página más importante. Más tiempo aquí que en cualquier otra.

- [ ] Schema `Organization` + `LocalBusiness` + `WebSite` en JSON-LD
- [ ] Meta title + description + OG tags
- [ ] **Sección 1 — Hero**
  - Imagen de fondo: generar con IA (`hero-laboratorio-ime.webp`) — laboratorio moderno, técnico calibrando instrumento, iluminación profesional. Dejar comentario en código: `<!-- FOTO REAL: laboratorio con técnico, ángulo amplio, luz controlada -->`
  - Tagline + subtítulo (usar texto del sitio actual como base, refinar)
  - CTA primario: "Solicitar cotización" (→ WhatsApp widget)
  - CTA secundario: "Ver catálogo" (→ `/catalogo/`)
- [ ] **Sección 2 — Carrusel de 32 magnitudes**
  - Usar lista provisional de magnitudes (ver PRD sección 12) hasta confirmación de IME
  - Cada chip: ícono SVG genérico + nombre. Los íconos se pueden mejorar después.
  - Auto-play suave, pausar en hover, 4 col desktop / 2 col mobile
- [ ] **Sección 3 — Por qué IME** (3–4 cards con diferenciadores)
  - Usar: Acreditación EMA, Trazabilidad CENAM/NIST, cobertura nacional, tiempo de respuesta
  - Dejar comentario: `<!-- CONFIRMAR diferenciadores reales con marketing de IME -->`
- [ ] **Sección 4 — Industrias** (migrar del sitio actual)
- [ ] **Sección 5 — Logos de clientes**
  - Si no hay logos reales: placeholder con nombres de industrias genéricas
  - Dejar comentario: `<!-- PENDIENTE: logos reales de clientes de IME -->`
- [ ] **Sección 6 — Trust signals** (años exp., número de clientes, magnitudes)
  - Dejar comentario con números placeholder: `<!-- CONFIRMAR números reales con IME -->`
- [ ] **Sección 7 — CTA catálogo** (banner intermedio)
- [ ] **Sección 8 — Sobre IME snippet** (migrar texto del sitio actual, refinar)
- [ ] **Sección 9 — Formulario + mapa**
  - Integrar Formspree o EmailJS
  - Google Maps embed con ubicación del laboratorio

### Tarea 3 — Servicios (`/servicios/`)
- [ ] Schema `Service` por magnitud principal
- [ ] Meta title + description + OG
- [ ] Hero de página + breadcrumb
- [ ] Grid de magnitudes/servicios (migrar y mejorar del sitio actual)
- [ ] Cada card de magnitud enlaza a `/catalogo/?magnitud=[nombre]`
- [ ] Sección de normas y trazabilidad

### Tarea 4 — Acreditaciones (`/acreditaciones/`)
- [ ] Schema `Organization` con `hasCredential`
- [ ] Meta title + description
- [ ] Contenido de acreditación EMA (fuente: `EMA16dic24.pdf` en `/docs/`)
- [ ] Visor de PDF nativo con `<iframe>` para el certificado EMA + botón de descarga como fallback
- [ ] Los 9 PDFs del sitio actual migrados a `/assets/pdfs/` — cada uno con botón de descarga + visor iframe donde aplique
- [ ] Sección "¿Qué significa para usted?" en lenguaje no técnico
- [ ] Normas aplicables, referencias CENAM/NIST (confirmar cuáles aplican a IME)

### Tarea 5 — Nosotros (`/nosotros/`)
- [ ] Schema `Organization` + `Person` por miembro del equipo
- [ ] Migrar textos del sitio actual (historia, misión, visión)
- [ ] Fotos del equipo: generar con IA (`equipo-ime-director.webp`, etc.) — personas en laboratorio, atuendo profesional, fondo limpio. Dejar comentario en código con brief fotográfico exacto.
- [ ] Galería del laboratorio: generar con IA (`laboratorio-ime-area-temperatura.webp`, etc.)

### Tarea 6 — Contacto (`/contacto/`)
- [ ] Formulario funcional (Formspree/EmailJS)
- [ ] Datos: Tel +52 246 126 1782, confirmar correo y horarios con cliente
- [ ] Google Maps embed
- [ ] Banner/link visible al portal calibracionesime.com.mx

### Tarea 7 — FAQs (`/faqs/`)
- [ ] Meta title + description + Schema `FAQPage`
- [ ] Contenido: preguntas y respuestas técnicas provistas por el equipo de IME
- [ ] Estructura semántica: cada FAQ como `<details><summary>` o acordeón accesible
- [ ] Organizar por categoría si aplica (general, calibración, acreditación, tiempos, cobertura)
- [ ] Esta página es estratégica para SEO — las respuestas deben ser directas y técnicas, sin lenguaje de marketing

### Tarea 8 — Páginas legales
- [ ] `/aviso-de-privacidad/` — migrar del sitio actual
- [ ] `/terminos-y-condiciones/` — migrar del sitio actual

### Tarea 9 — Catálogo placeholder (`/catalogo/`)
> En Fase 1 esta página existe pero sin el catálogo completo.
- [ ] Página con diseño completo, mensaje "Catálogo en construcción" o versión reducida
- [ ] CTA para contactar mientras tanto
- [ ] La URL y estructura ya está lista para cuando llegue Fase 2

### Tarea 10 — SEO base transversal
> Hacer al final, cuando todas las páginas estén construidas.
- [ ] Verificar title + description únicos en todas las páginas
- [ ] Verificar un solo H1 por página, jerarquía H2/H3 consistente
- [ ] Verificar schema sin errores en Rich Results Test de Google
- [ ] Generar `sitemap.xml` con todas las URLs (incluir fecha de última modificación)
- [ ] Verificar `robots.txt` correcto
- [ ] Configurar Google Analytics · ID: `G-ZZKMX0MKYW`
- [ ] Configurar Google Search Console — verificar propiedad y enviar sitemap
- [ ] Crear OG image default: logo IME sobre fondo color primario, 1200×630px
- [ ] Verificar HTTPS activo, sin mixed content warnings
- [ ] Verificar favicons en Chrome, Safari y móvil
- [ ] Correr Lighthouse en todas las páginas principales — target ≥ 90 mobile, ≥ 95 desktop
- [ ] Verificar en Chrome, Firefox, Safari y Edge — desktop y mobile
- [ ] Protección básica del formulario: honeypot field oculto para evitar bots

### Tarea 11 — Estados de error
- [ ] Si `productos.json` falla al cargar: mostrar mensaje "El catálogo está en mantenimiento, intenta más tarde" con CTA de contacto
- [ ] Si el formulario de contacto falla al enviar: mostrar mensaje de error con opción de contactar por WhatsApp
- [ ] El 404 branded ya está cubierto en Fase 0

---

## FASE 2 — Catálogo de productos
> No empezar hasta que Fase 1 esté completa y publicada.

### Tarea 12 — Data
- [ ] Confirmar lista definitiva de 32 magnitudes con IME
- [ ] Recibir template de productos llenado por IME
- [ ] Convertir a `productos.json` siguiendo schema del PRD (sección 12)
- [ ] Procesar imágenes: optimizar a WebP, max 800×800px, max 150KB. Mejorar con IA donde sea necesario.
- [ ] Validar JSON (no errores de sintaxis, todos los campos requeridos presentes)

### Tarea 13 — Catálogo índice (`/catalogo/index.html`)
- [ ] Schema `ItemList`
- [ ] Meta title + description
- [ ] Barra de filtros (lateral desktop / drawer mobile)
- [ ] Implementar `catalog.js` con lógica de filtrado del PRD (sección 14)
- [ ] Orden por defecto: agrupado por magnitud (alfabético), luego por nombre dentro de cada magnitud
- [ ] Búsqueda en tiempo real (nombre + marca + modelo + tags)
- [ ] Grid de tarjetas de productos — con imagen placeholder si el producto no tiene foto
- [ ] Contador de resultados: "Mostrando X de 150 productos"
- [ ] Chips de filtros activos con botón × para remover
- [ ] URL refleja estado de filtros como query params
- [ ] Skeleton loaders mientras carga `productos.json`
- [ ] Estado vacío: "No encontramos productos con esos filtros" + CTA de contacto + botón "Limpiar filtros"

### Tarea 14 — Template de producto
- [ ] Crear `templates/producto.html` — página de detalle completa
- [ ] Galería multi-imagen con thumbnails
- [ ] Tabla de especificaciones técnicas (desde array `especificaciones`)
- [ ] CTA WhatsApp
- [ ] Schema `Product` + `BreadcrumbList` dinámicos
- [ ] CSS `@media print` para ficha técnica imprimible
- [ ] Botón PDF descarga (si `pdf_ficha != null`)
- [ ] Sección "Productos relacionados" (misma magnitud)

### Tarea 15 — Generador de páginas
- [ ] Crear `scripts/generate-catalog.js`
- [ ] Probar con 5 productos, verificar HTML generado y schema
- [ ] Correr para los 150 productos
- [ ] Verificar que todas las imágenes cargan (no broken)
- [ ] Actualizar `sitemap.xml` para incluir las 150 URLs
- [ ] Correr Lighthouse en 3–5 páginas de producto de muestra

---

---

## Workflow de actualización post-entrega (para cuando el sitio ya está live)

**Actualizar contenido general (texto, imágenes, PDFs):**
1. Editar el archivo HTML correspondiente
2. `git add` + `git commit` + `git push` → GitHub Pages se actualiza automáticamente en ~1 min

**Agregar o editar un producto del catálogo:**
1. Editar `data/productos.json` (agregar o modificar el objeto del producto)
2. Agregar imágenes a `assets/images/productos/`
3. Correr `node scripts/generate-catalog.js`
4. Actualizar `sitemap.xml` si se agregaron productos nuevos
5. `git add` + `git commit` + `git push`

**Actualizar un PDF (acreditación, catálogo general):**
1. Reemplazar el archivo en `assets/pdfs/`
2. Si el nombre del archivo cambia, actualizar la referencia en el HTML correspondiente
3. `git push`

---

## Notas para el agente

- **Fuente de verdad del diseño:** `docs/MANUAL DE IDENTIDAD 2025.pdf` — leer antes de fijar colores y tipografía.
- **Fuente de verdad del catálogo:** `data/productos.json` — nunca editar HTMLs de productos directamente.
- **Sitio actual de referencia:** https://imecalibraciones.com — migrar contenido, no copiar diseño.
- **Competencia de referencia:** suministrosenmetrologia.com (catálogo), twilight.mx (credenciales), metrolab.com.mx (organización por magnitudes).
- **Fotos placeholder:** generar con IA, nombrar descriptivamente, dejar comentario en código con brief exacto de la foto real que debe tomarse. Ejemplo: `<!-- FOTO REAL: técnico calibrando balanza analítica, laboratorio limpio, luz natural lateral -->`.
- **Colores provisionales** en `main.css` se marcan con `/* TBD-MANUAL */` para encontrarlos fácilmente cuando llegue el manual.
- **Nunca hardcodear** opciones de filtro en HTML. Siempre generar dinámicamente desde el JSON.
- **Cualquier funcionalidad fuera de este TASKS.md** es out of scope — documentar y escalar antes de implementar.
