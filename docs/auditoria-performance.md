# Auditoría de Performance — IME Calibraciones Web

## Contexto del proyecto

- **Stack:** Astro 4 + vanilla JS + CSS custom (sin framework UI)
- **Ruta raíz:** `src/` para componentes/páginas, `public/` para assets estáticos
- **Imágenes optimizables:** usar `<Image />` de `astro:assets` con imports locales desde `src/assets/images/`
- **Imágenes ya migradas:** hero slides, logos de clientes, logos de acreditaciones, logo Header/Footer, fotos de nosotros, imágenes de productos del catálogo

---

## Lo que YA está optimizado (no tocar)

| Qué | Dónde | Estado |
|-----|-------|--------|
| Hero slides (slide-1/2/3.png) | `index.astro`, `servicios/index.astro` | `<Image />` con `widths`, `sizes`, `format="webp"` |
| Logos de clientes | `index.astro` | `<Image />` desde `src/assets/images/clientes/` |
| Logos EMA / PJLA | `acreditaciones/index.astro` | `<Image />` desde `src/assets/images/acreditaciones/` |
| Logo Header | `Header.astro` | `<Image />` desde `src/assets/images/logo/` |
| Logo Footer | `Footer.astro` | `<Image />` desde `src/assets/images/logo/` |
| Fotos nosotros (equipo + banner) | `nosotros/index.astro` | `<Image />` desde `src/assets/images/nosotros/` |
| Imágenes de productos | `catalogo/[slug].astro` | `import.meta.glob` + `<Image />` |
| PageHeader local images | `PageHeader.astro` | Ya usa `<Image />` para `ImageMetadata` |

---

## Pendientes — qué debe hacer el agente

### 1. Iframes sin `loading="lazy"`

Añadir `loading="lazy"` a todos los `<iframe>` que no lo tengan:

| Archivo | Descripción |
|---------|-------------|
| `src/pages/acreditaciones/index.astro` líneas ~96 y ~139 | iframes de documentos de acreditación |
| `src/pages/contacto/index.astro` línea ~294 | iframe de Google Maps |
| `src/pages/index.astro` línea ~531 | iframe embebido (verificar cuál es) |
| `src/pages/nosotros/index.astro` líneas ~250, ~267, ~284 | iframes TikTok, Instagram, YouTube |

---

### 2. Imágenes `<img>` sin `loading="lazy"` ni `<Image />`

| Archivo | Línea aprox. | Qué es | Acción |
|---------|-------------|--------|--------|
| `src/components/PageHeader.astro` | ~82 y ~100 | `<img>` con `src` tipo string (no `ImageMetadata`) | Añadir `loading="lazy"` donde corresponda; la primera imagen above-the-fold debe ser `loading="eager"` |
| `src/pages/catalogo/[slug].astro` | ~161 | Logo SVG en sección de impresión | SVG inline o `loading="lazy"` |
| `src/pages/index.astro` | ~340 | Thumbnail de YouTube (URL remota) | Ya tiene `loading="lazy"` — verificar |

---

### 3. Videos — convertir a formato web moderno

Los 5 videos en `public/assets/video/` se sirven como MP4 sin compresión optimizada:

```
hero-acreditaciones.mp4
hero-lab.mp4
hero-servicios.mp4
logo-animado.mp4
logo-animado-white.mp4
```

**Acciones:**
- Generar versión `.webm` (VP9) de cada uno para navegadores modernos
- Usar `<source>` múltiple: primero `.webm`, fallback `.mp4`
- Verificar que todos los `<video>` de fondo tengan: `muted playsinline preload="none"` (o `preload="metadata"` como mínimo)
- Los videos hero (above-the-fold) pueden usar `preload="metadata"` pero NO `preload="auto"`
- Logo animado (`logo-animado.mp4` / `logo-animado-white.mp4`) — verificar que usen `preload="none"` si están debajo del fold

**Patrón correcto:**
```html
<video autoplay muted loop playsinline preload="none" aria-hidden="true">
  <source src="/assets/video/hero-lab.webm" type="video/webm">
  <source src="/assets/video/hero-lab.mp4"  type="video/mp4">
</video>
```

---

### 4. Imágenes `<Image />` sin `widths` + `sizes` (responsive srcset)

Las imágenes migradas usan `<Image />` pero solo con `width` y `height` fijos (un solo tamaño). Las que ocupan ancho variable en el layout deberían tener `srcset` responsive.

**Candidatas prioritarias (imágenes grandes en layout):**
- `nosotros/index.astro` — `equipo-ime.png` (columna 50% del container)
- `nosotros/index.astro` — `banner-nosotros.jpeg` (columna 55% del container)
- `catalogo/[slug].astro` — imagen principal del producto (columna izquierda ~50%)

**Patrón:**
```astro
<Image
  src={equipoIme}
  alt="..."
  widths={[400, 800, 1200]}
  sizes="(max-width: 860px) 100vw, 50vw"
/>
```

---

### 5. Fuentes — verificar `font-display`

En `src/styles/main.css` se importa Poppins desde Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
```
El `display=swap` ya está presente — correcto. Verificar que en `src/layouts/Base.astro` haya un `<link rel="preconnect" href="https://fonts.googleapis.com">` antes del CSS.

---

### 6. Preload del hero

Verificar que en `index.astro` exista un `<link rel="preload">` para el video hero o la imagen above-the-fold más importante (LCP). Actualmente hay un preload del video:
```html
<link rel="preload" as="video" href="..." type="video/mp4" slot="head">
```
Confirmar que también exista para las páginas con hero de imagen estática (acreditaciones, nosotros, servicios).

---

### 7. No optimizable por Astro (dejar como está)

| Qué | Por qué |
|-----|---------|
| `og:image` en `Base.astro` | Meta tag requiere URL pública absoluta |
| Favicons e `apple-touch-icon` | `<link>` tags, no `<img>` |
| Poster de `<video>` (`hero-poster.png`) | Atributo `poster` no procesa Astro |
| Thumbnails de YouTube (URL remota) | URL externa, no local |
| Imágenes referenciadas en `utils.js` | JS runtime, no build time |

---

## Checklist de verificación

Al terminar, confirmar:

- [ ] Todos los `<iframe>` tienen `loading="lazy"`
- [ ] Todos los `<img>` que no son above-the-fold tienen `loading="lazy"`
- [ ] Todas las imágenes grandes en columnas variables tienen `widths` + `sizes`
- [ ] Todos los `<video>` de fondo tienen `muted playsinline preload="none"`
- [ ] Existe `<source type="video/webm">` antes del fallback MP4 (si se generaron .webm)
- [ ] `<link rel="preconnect">` para Google Fonts presente en `Base.astro`
- [ ] `<link rel="preload">` presente para el asset LCP en cada página principal
- [ ] Ninguna imagen local usa `<img src="/assets/...">` directo (todas usan `<Image />` con import)
