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
| Foto equipo nosotros | `nosotros/index.astro` | `widths={[600,900,1200]}` + `sizes` ✓ |
| Banner nosotros | `nosotros/index.astro` | `widths={[400,800,1200]}` + `sizes` + `format="webp"` ✓ (532 kB → 14/41/75 kB) |
| Imagen principal producto | `catalogo/[slug].astro` | `widths={[300,600,900]}` + `sizes` + `format="webp"` ✓ |
| PageHeader local images | `PageHeader.astro` | `<Image />` para `ImageMetadata`; `loading="eager"` en `<img>` string ✓ |
| Todos los `<iframe>` | acreditaciones, contacto, index, nosotros | `loading="lazy"` ya presente ✓ |
| Fuentes Poppins | `Base.astro` | `@fontsource/poppins` (local, sin CDN) — preconnect no necesario ✓ |
| Preload hero video home | `index.astro` | `<link rel="preload" as="video">` ✓ |
| Preload hero video servicios | `servicios/index.astro` | `<link rel="preload" as="video">` ✓ |
| `preload="metadata"` videos hero | `PageHeader.astro`, `index.astro` | Videos above-fold con `preload="metadata"` ✓ |
| `preload="none"` logo animado | `index.astro` | `logo-animado-white.mp4` below-fold ✓ |
| `preload="none"` video blur bg | `PageHeader.astro` (focus mode) | Capa decorativa con `preload="none"` ✓ |
| Logo print (catálogo) | `catalogo/[slug].astro` | `loading="lazy"` en `<img>` oculto de impresión ✓ |

---

## Pendiente — único item restante

### Videos .webm — requiere ffmpeg (no instalado en este entorno)

Los atributos HTML ya están corregidos (`preload="metadata"` en heroes, `preload="none"` en logo animado).  
Falta generar las versiones `.webm` (VP9) y añadir el `<source type="video/webm">` antes del fallback MP4.

**Archivos a convertir** (`public/assets/video/`):
```
hero-lab.mp4  →  hero-lab.webm
hero-servicios.mp4  →  hero-servicios.webm
hero-acreditaciones.mp4  →  hero-acreditaciones.webm
logo-animado.mp4  →  logo-animado.webm
logo-animado-white.mp4  →  logo-animado-white.webm
```

**Comando ffmpeg para cada video:**
```bash
ffmpeg -i hero-lab.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -an hero-lab.webm
```
Repetir para cada archivo. El flag `-an` elimina audio (videos de fondo no lo necesitan).

**Patrón HTML a usar en cada `<video>` una vez generados los .webm:**
```html
<video autoplay muted loop playsinline preload="metadata">
  <source src="/assets/video/hero-lab.webm" type="video/webm">
  <source src="/assets/video/hero-lab.mp4"  type="video/mp4">
</video>
```

Archivos a editar cuando los .webm estén listos:
- `src/components/PageHeader.astro` (líneas ~79 y ~96)
- `src/pages/index.astro` (líneas ~82 y ~428)

---

### No optimizable por Astro (dejar como está)

| Qué | Por qué |
|-----|---------|
| `og:image` en `Base.astro` | Meta tag requiere URL pública absoluta |
| Favicons e `apple-touch-icon` | `<link>` tags, no `<img>` |
| Poster de `<video>` (`hero-poster.png`) | Atributo `poster` no procesa Astro |
| Thumbnails de YouTube (URL remota) | URL externa, no local |
| Imágenes referenciadas en `utils.js` | JS runtime, no build time |

---

## Checklist de verificación

- [x] Todos los `<iframe>` tienen `loading="lazy"`
- [x] Todos los `<img>` que no son above-the-fold tienen `loading="lazy"`; los above-fold tienen `loading="eager"`
- [x] Todas las imágenes grandes en columnas variables tienen `widths` + `sizes`
- [x] Videos hero con `preload="metadata"`; logo animado y blur bg con `preload="none"`
- [ ] `<source type="video/webm">` antes del fallback MP4 — **pendiente de generar .webm con ffmpeg**
- [x] Fuentes: `@fontsource/poppins` (local) — preconnect no requerido
- [x] `<link rel="preload">` para hero video en `index.astro` y `servicios/index.astro`
- [x] Ninguna imagen local usa `<img src="/assets/...">` directo (todas usan `<Image />` con import)
