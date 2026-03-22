# IME Calibraciones — Brief de Marca y Diseño

> Documento vivo. Actualizar conforme se confirmen datos con el cliente.
> Fuente principal: `Manual-identidad.pdf` (versión 2025) + análisis de sitios de referencia.

---

## 1. Identidad de Marca

### Nombre oficial
**Ingeniería y Metrología Certificada Para Calibración de Equipos de Control y Pruebas S.A. de C.V.**
Marca comercial: **IME Calibraciones** / **IME Certificada**

### Personalidad de marca
Tecnología · Inteligencia · Exclusividad · Elegancia · Precisión · Confianza técnica

### Audiencia objetivo
- Ingenieros de calidad y metrología en industria manufacturera, farmacéutica, automotriz, alimentaria
- Responsables de compras de empresas con sistemas de gestión ISO 9001, IATF 16949, etc.
- Empresas que requieren cumplimiento normativo con evidencia trazable

---

## 2. Logotipo — Componentes y Variantes

### Componentes
| Elemento | Descripción |
|---|---|
| **Logotipo** | Siglas "IME" en tipografía Eras Bold ITC, acabado degradado dorado |
| **Isotipo** | Elipse + círculo que simulan un ojo. Interior: válvula de control. Representa adaptación, flexibilidad, innovación y perfección. Acabado dorado. |
| **Leyenda** | "INGENIERÍA Y METROLOGÍA CERTIFICADA PARA CALIBRACIÓN DE EQUIPOS DE CONTROL Y PRUEBAS S.A. DE C.V." Usar de forma estratégica, no siempre. |

### Variantes de uso
| Variante | Cuándo usar |
|---|---|
| **Uso principal** — isotipo + "IME" horizontal | Header del sitio, documentos, comunicaciones principales |
| **Uso secundario** — isotipo + "IME" vertical | Avatares, redes sociales, espacios cuadrados |
| **Solo isotipo** | Favicon, ícono de app, espacios muy pequeños |
| **Solo logotipo** — solo "IME" | Casos muy específicos donde el isotipo no cabe |
| **Versión monocromática negra** | Impresión en blanco y negro |
| **Versión sobre fondo oscuro** — blanco | Footer, fondos azul oscuro |
| **Versión azul** | Alternativa situacional según soporte |

### Reglas estrictas (NO hacer)
- ❌ Cambiar colores del logo
- ❌ Condensar o distorsionar proporciones
- ❌ Cambiar tamaño relativo de elementos entre sí
- ❌ Separar elementos del logotipo y reordenarlos
- ❌ Inclinar el logotipo
- ❌ Colocar sobre texturas desfavorables o de mucho ruido

---

## 3. Archivos de Logo en el Repositorio

**Carpeta:** `assets/images/logo/`

| Archivo | Contenido | Uso en el sitio |
|---|---|---|
| `isotipo.svg` | Solo el dibujito (válvula en círculo) | Favicon base, ícono pequeño |
| `logo-principal.svg` | Isotipo + "IME" horizontal — dorado | Header (fondo blanco) |
| `logotipo.svg` | Solo las letras "IME" | Casos específicos |
| `logo-vertical.svg` | Isotipo arriba + "IME" abajo — dorado | Redes sociales, espacios cuadrados |
| `logo-principal-white.svg` | Versión blanca del logo principal | Footer (fondo azul oscuro) |
| `favicon.svg` | Isotipo simplificado para favicon | `<link rel="icon">` |
| `favicon-32.png` | 32×32px | `<link rel="icon" sizes="32x32">` |
| `apple-touch-icon.png` | 180×180px | `<link rel="apple-touch-icon">` |
| `og-default.jpg` | 1200×630px — logo sobre fondo azul IME | Open Graph / redes sociales |

> **Nota:** Los archivos actuales son versión dorada. Versiones en otros colores se generan con IA
> según necesidad. La versión blanca para el footer es prioritaria.

---

## 4. Tipografías

| Tipografía | Uso | Disponibilidad |
|---|---|---|
| **Eras Bold ITC** | Exclusivo logotipo — NO usar en texto del sitio | Comercial (licencia de IME) |
| **Poppins** | Toda la tipografía del sitio (headings, body, UI) | Google Fonts — libre |

### Pesos de Poppins usados
- Light (300) — texto muy grande o delicado
- Regular (400) — body text
- Medium (500) — nav links, labels
- SemiBold (600) — subtítulos, énfasis
- Bold (700) — headings principales

> Poppins es la tipografía institucional secundaria "de uso general" según el manual.
> Es moderna, técnica y altamente legible — correcta para B2B industrial.

---

## 5. Colores — Paleta Oficial

### Colores del degradado dorado (exclusivos del logo)
> Estos colores son para el logotipo únicamente. NO usar como color de UI (botones, fondos de sección, etc.)

| Muestra | Hex | RGB | Posición en degradado |
|---|---|---|---|
| Marrón dorado oscuro | `#885111` | R:136 G:81 B:17 | 0% |
| Dorado medio | `#e2b53c` | R:226 G:181 B:60 | 35.16% |
| Dorado claro | `#feff94` | R:254 G:255 B:148 | 53.43% |
| Dorado | `#e7bb3f` | R:231 G:187 B:63 | 59.04% |
| Marrón dorado | `#895211` | R:137 G:82 B:17 | 98.46% |

Ángulo del degradado: **13.3523°**

### Colores complementarios institucionales (sí usar en UI)

| Muestra | Hex | RGB | Uso |
|---|---|---|---|
| **Azul primario IME** | `#08529a` | R:8 G:82 B:154 | Color principal del sitio — fondos hero, botones primarios, headers de sección |
| **Azul secundario IME** | `#1d68ac` | R:29 G:104 B:172 | Page hero gradient, elementos secundarios, links |
| Negro | `#131313` | R:19 G:19 B:19 | Texto principal |
| Blanco institucional | `#f2f2f2` | R:242 G:242 B:242 | Fondos de superficie, secciones alternas |

### Paleta extendida para el sitio web (derivada de los colores del manual)

```css
/* Primario — Azul IME */
--color-primary:      #08529a;   /* Azul institucional */
--color-primary-dark: #063d73;   /* Hover (primario -15% luminosidad) */

/* Secundario — Azul medio */
--color-secondary:    #1d68ac;   /* Para gradientes, elementos secundarios */
--color-secondary-dk: #155a96;   /* Hover secundario */

/* Acento dorado — solo decorativo, no en botones */
--color-gold:         #c9a227;   /* Versión "UI-safe" del dorado — badges, acentos */
--color-gold-light:   #f0d070;   /* Para bordes o backgrounds muy sutiles */

/* Neutros */
--color-ink:          #131313;   /* Texto principal */
--color-muted:        #5a6a7a;   /* Texto secundario */
--color-subtle:       #9baab8;   /* Placeholders, texto terciario */
--color-bg:           #ffffff;   /* Fondo principal */
--color-surface:      #f2f2f2;   /* Fondo institucional del manual */
--color-surface-2:    #e8edf2;   /* Superficie ligeramente azulada */
--color-line:         #d0dae5;   /* Bordes, divisores */
```

---

## 6. Diseño del Sitio Web

### Dirección visual: "Azul de Precisión Industrial"
Profesional, técnico y confiable. El sitio comunica que IME es una empresa seria con acreditación oficial.
El dorado del logo aparece como elemento de distinción en zonas clave — no como color de interfaz.

### Hero (Home)
- Foto de fondo: laboratorio con técnico calibrando instrumento (ángulo amplio, luz controlada)
- Overlay: azul IME `#08529a` a 70-75% de opacidad
- Logo IME en versión blanca prominente en el hero
- Tagline en blanco, Poppins Bold
- CTAs: botón primario azul sólido + botón outline blanco

### Page Hero (páginas internas)
- Gradiente: `#08529a` → `#063d73` (del manual, capa base)
- Posible textura sutil con íconos del diseño interno (engranaje + casco) en `#1d68ac`

### Elemento diferenciador
El "diseño interno 2025" del manual muestra un layout de documentos con:
- Fondo azul `#1d68ac`
- Textura de íconos industriales en `#08529a`
- Forma blanca con esquinas redondeadas encima
Este patrón puede usarse como **acento decorativo** en secciones clave (CTA, acreditaciones).

### Badge de Acreditación
- Elemento dorado `#c9a227` para el badge "Acreditado EMA"
- Comunica exclusividad y distinción — igual que el dorado del logo

---

## 7. Análisis de Sitios de Referencia

> ⚠️ Sección pendiente — se completa con los resultados del análisis de referencias.
> Referencias del PRD: metrolab.com.mx, suministrosenmetrologia.com, twilight.mx

### metrolab.com.mx
**Referencia de:** organización por magnitudes y presentación de acreditaciones

**Navegación:**
- Acerca / Equipos / **Magnitudes** / Laboratorio de Pruebas / Soporte / Recursos
- Magnitudes tiene 18 servicios de calibración — organización clara por tipo de medición
- Tiene portal de clientes propio (ARES) para gestión de equipos y certificados

**Home — secciones:**
1. Hero: *"Garantizamos la continuidad operativa de tus equipos"* — propuesta de valor operacional, no técnica
2. Logos de clientes: Caterpillar, Ternium, Nemak, industriales grandes
3. Grid de servicios especiales
4. Acreditaciones: EMA + PJLA destacadas prominentemente
5. Portal ARES como diferenciador digital

**Colores:** Verde azulado / teal (`#085b53`) como primario, contraste claro/oscuro. Estética industrial.

**Tipografías:** Montserrat + Roboto — modernas, técnicas, muy legibles.

**Lo que hace bien — tomar de referencia:**
- Organizar servicios por **magnitud**, no por industria (más útil para el usuario que busca calibrar algo específico)
- El portal de clientes como diferenciador se menciona en el home — IME tiene `calibracionesime.com.mx`, debe tener igual presencia
- Logos de clientes industriales de peso generan confianza inmediata
- "Laboratorio subterráneo" como dato técnico que comunica condiciones de control — IME debería hacer lo mismo con sus instalaciones

**Lo que hace mal / evitar:**
- No se menciona: colores genéricos de tipo "empresa tech" sin identidad específica de metrología
- La propuesta de valor del hero es abstracta — IME puede ser más específico (acreditación EMA, magnitudes, trazabilidad CENAM)

---

### suministrosenmetrologia.com
**Referencia de:** catálogo de instrumentos, estructura de filtros y cards de producto

**Navegación:**
- Productos → 10 categorías (Temperatura, Humedad, Presión, Pesas, Balanzas, Fuerza, Torque, Dimensional, Espesor, Óptica)
- Calibraciones / Catálogo / Marcas / Nosotros / Blog
- Tiene login, cotizaciones y carrito (e-commerce)

**Home — secciones:**
1. Hero: *"Expertos en Metrología Industrial"* + ISO/IEC 17025:2017 + beneficios concretos (envíos gratis, calibración 5-8 días, recolección incluida)
2. Grid de 8 productos destacados
3. Bloques de 4 servicios de calibración
4. 10 logos de marcas distribuidas
5. Proceso en 3 pasos visual
6. Testimonios + feed social

**Colores:** Azul primario (`#3498db`), gris oscuro (`#2c3e50`), fondo blanco — estética limpia y minimalista.

**Lo que hace bien — tomar de referencia:**
- **Beneficios concretos en el hero:** tiempo de entrega, proceso de recolección — IME debería hacer lo mismo
- Categorías de producto con iconografía visual — muy navegable
- Cards de producto minimalistas: imagen + marca + nombre técnico + CTA — exactamente lo que necesita el catálogo de IME
- Buscador con filtro en tiempo real por query
- "Proceso en 3 pasos" — simplifica algo técnico para el cliente, excelente para la sección de contacto
- Logos de marcas distribuidas generan confianza de catálogo

**Lo que hace mal / evitar:**
- Diseño muy genérico — podría ser cualquier tienda online, sin identidad de marca fuerte
- El rojo en animaciones de carga parece un error de diseño, no intencional
- Falta diferenciación de marca vs. competidores

---

### twilight.mx
**Referencia de:** organización de catálogo extenso (70+ categorías)

**Navegación:**
- Productos (70+ categorías de instrumentos) / Servicios / Calibración / Cursos / Promociones / Contacto
- Hamburger mobile muy necesario con ese volumen de categorías

**Home — secciones:**
1. Slider de 6 imágenes (promocional)
2. Suscripción a newsletter
3. 4 CTAs: calibrar, reparar, catálogo, descuentos
4. Carrusel de promociones con % de descuento
5. Categorías por industria
6. Mapa + contacto en footer

**Colores:** Amarillo/dorado (`#FFEB3B`, `#ffe200`) como acento principal, gris oscuro (`#393a3c`), fondo blanco.

**Lo que hace bien — tomar de referencia:**
- El volumen de 70+ categorías con hamburger mobile es navegable — referencia para cuándo el catálogo de IME escale
- Segmentación por industria (alimentaria, industrial, seguridad, construcción) en la home — IME debería tener algo similar
- Google Maps en la home — contacto visible y geolocalizado
- Chat en vivo para respuesta inmediata (PureChat) — IME tiene WhatsApp widget, similar función

**Lo que hace mal / evitar:**
- El diseño es muy de "tienda de descuentos" — badges de %, ribbons, promociones — esto daña la percepción de un laboratorio acreditado de precisión
- Pocas credenciales formales visibles — IME debe hacer lo opuesto: acreditación EMA y trazabilidad bien prominentes
- El amarillo/dorado como color UI principal se ve barato en este contexto — refuerza la decisión de usar el dorado de IME SOLO como acento del logo, nunca como color de botones
- Demasiado contenido en el home — siente caótico

---

## 8. Decisiones de Diseño — Derivadas de las Referencias

> Todo lo que SÍ vamos a hacer y por qué, basado en lo que aprendimos de las 3 referencias.

### Estructura y navegación

| Decisión | Origen | Implementación en IME |
|---|---|---|
| Organizar servicios por **magnitud**, no por industria | metrolab.com | `/servicios/` y `/catalogo/` agrupados por magnitud |
| Segmentar por **industria** también en el home | twilight.mx (lo hace bien) | Sección "Industrias que atendemos" en home — cards de manufactura, farma, automotriz, alimentaria |
| **Portal de clientes visible en el home** | metrolab.com | Banner/CTA fijo apuntando a `calibracionesime.com.mx` — no esconderlo en el footer |
| **Mapa en el home** | twilight.mx | Sección de contacto al final del home incluye Google Maps embed |

### Hero y propuesta de valor

| Decisión | Origen | Copy modelo |
|---|---|---|
| Propuesta de valor **operacional**, no técnica | metrolab: "garantizamos la continuidad operativa" | IME: hablar de lo que el cliente gana, no solo de lo que IME hace |
| **Beneficios concretos visibles desde el hero** | suministrosenmetrologia.com | Incluir: acreditación EMA, 32 magnitudes, trazabilidad CENAM/NIST, cobertura nacional |
| Evitar hero abstracto/genérico | Ambos cometen esto | Tagline específico de metrología — con números reales cuando los confirmemos |

Ejemplo de estructura de hero que NO es genérica:
```
[Headline]  Calibración Acreditada para la Industria Mexicana
[Sub]       32 magnitudes · Trazabilidad CENAM/NIST · EMA acreditado bajo ISO/IEC 17025
[CTA1]      Solicitar cotización
[CTA2]      Ver catálogo de instrumentos
```

### Credenciales y confianza

| Decisión | Origen | Implementación |
|---|---|---|
| **Acreditación EMA prominente** — no escondida | metrolab la pone arriba | Badge dorado "EMA Acreditado" en header o inmediatamente después del hero |
| **Logos de clientes** con nombres de industrias reconocibles | metrolab: Caterpillar, Ternium, Nemak | Sección de clientes/industrias con logos o nombres — confirmar con IME qué pueden mostrar |
| Datos técnicos del laboratorio como diferenciador | metrolab: "laboratorio subterráneo" | IME: mencionar condiciones ambientales controladas, equipos patrón, año de fundación |
| **Trazabilidad como copy**, no solo como tecnicismo | suministrosenmetrologia.com lo menciona en hero | "Calibraciones trazadas a CENAM y NIST" — visible desde el home |

### Catálogo de productos

| Decisión | Origen | Implementación |
|---|---|---|
| Cards minimalistas: imagen + marca + modelo + magnitud + CTA | suministrosenmetrologia.com | Ya implementado en `catalog.js` y `catalog.css` |
| Búsqueda en tiempo real | suministrosenmetrologia.com | Ya implementado en `catalog.js` |
| Filtros por magnitud, marca, categoría | suministrosenmetrologia.com | Ya implementado |
| Iconografía visual por categoría/magnitud | suministrosenmetrologia.com | Íconos SVG por magnitud en la sección de servicios y en el carrusel del home |

### Lo que nos diferencia de los 3 (ventaja competitiva visual)

Los 3 sitios de referencia tienen uno o más de estos problemas:
- Diseño genérico sin identidad de marca fuerte (suministrosenmetrologia)
- Estética de "tienda de descuentos" que daña la percepción de laboratorio técnico (twilight)
- Paleta de colores que no conecta con su identidad específica (metrolab usa verde teal genérico)

**IME tiene algo que ninguno tiene:** una identidad visual propia con el dorado del logo como elemento de distinción real. El sitio debe capitalizar eso:
- El dorado aparece en el badge EMA, en bordes decorativos clave, en el logo prominente
- El azul `#08529a` es más oscuro y técnico que el azul genérico de suministrosenmetrologia (`#3498db`)
- El sitio nunca debe sentirse como una tienda — siempre como un laboratorio certificado de alto nivel

### "Proceso en 3 pasos" — sección recomendada para home y contacto

Inspirado en suministrosenmetrologia.com. Simplifica el proceso para el cliente:

```
① Contacta o cotiza    →    ② Envía tu instrumento    →    ③ Recibe tu certificado EMA
   [formulario/WhatsApp]       [guía de embalaje]             [PDF descargable en portal]
```

Esta sección responde la pregunta implícita del usuario: *"¿Cómo funciona esto?"*

### Acceso al portal de clientes — tratamiento especial

metrolab.com tiene su portal como diferenciador en el home. IME tiene `calibracionesime.com.mx`.
- Debe aparecer en: **header** (botón destacado), **home** (sección o CTA), **footer**, **contacto**
- Copy: "¿Ya es cliente? Descargue sus certificados en el Portal de Informes"
- No llamarlo solo "portal" — explicar qué se puede hacer ahí

### Tone of voice del copy (derivado del análisis)

| ✅ Hacer | ❌ Evitar |
|---|---|
| Hablar de beneficios operacionales (continuidad, cumplimiento, confianza) | Lenguaje solo técnico que el comprador no entiende |
| Números concretos (32 magnitudes, X años, acreditación #XXXX) | Afirmaciones vacías tipo "somos los mejores" |
| Términos de industria que el ingeniero de calidad reconoce (ISO 17025, CENAM, GUM, incertidumbre) | Tecnicismos sin contexto para el usuario no especializado |
| Voz directa, profesional, sin exclamaciones de marketing | Lenguaje de venta agresiva (descuentos, ¡oferta!, ¡llama ya!) |

---

## 9. Decisiones de Diseño Pendientes (confirmar con cliente)

- [ ] ¿Foto real del laboratorio para el hero o imagen de IA mientras tanto?
- [ ] ¿Tagline oficial? (actualmente placeholder)
- [ ] ¿Usar la textura de engranajes/cascos del diseño interno en el sitio web?
- [ ] ¿Versión blanca del logo para el footer? (necesaria antes de implementar)
- [ ] Colores definitivos aprobados por IME (propuesta en sección 5)

---

## 9. Checklist de Assets Pendientes del Cliente

- [ ] `assets/images/logo/logo-principal-white.svg` — versión blanca para footer
- [ ] `assets/images/logo/favicon.svg` — isotipo simplificado para navegador
- [ ] `assets/images/logo/favicon-32.png`
- [ ] `assets/images/logo/apple-touch-icon.png`
- [ ] `assets/images/og-default.jpg` — 1200×630px (puede generarse con IA)
- [ ] Foto del laboratorio para el hero
- [ ] Fotos del equipo (o generadas con IA como placeholder)
- [ ] Los 9 PDFs del sitio actual → `assets/pdfs/`
- [ ] `assets/pdfs/acreditacion-ema.pdf`
- [ ] Correo electrónico oficial de IME
- [ ] Dirección exacta del laboratorio
- [ ] Horarios de atención
- [ ] Lista definitiva de 32 magnitudes
- [ ] Endpoint de Formspree/EmailJS para el formulario
- [ ] Script del widget de WhatsApp
