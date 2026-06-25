# Contrato visual extraído — Encuesta REDCap "Desconecta para conectar"

**URL origen:** `https://redcap-fibao.granadasalud.es/DSGM/surveys/?s=3EERXJDCRPKDFFXR`  
**Instrumento:** Reconecta — Cuestionario sobre el uso de pantallas en la adolescencia  
**Contexto:** Distrito Granada-Metropolitano · Plan Local de Salud de Huétor Tájar  
**Plataforma:** REDCap v17.1.4  
**Fecha de extracción:** 2026-06-25  
**Método:** curl + análisis estático de HTML (93 KB, 1236 líneas)  

---

## 1. Paleta de colores

### 1.1 Colores de identidad del proyecto

Extraídos de los estilos inline del campo descriptivo `presentacion`. Son los únicos colores definidos por el diseñador del proyecto, independientemente de la plataforma REDCap.

| Variable CSS propuesta | Hex | Uso aparente |
|---|---|---|
| `--brand-blue-primary` | `#1E7FC2` | Azul principal: borde izquierdo de sección "Contenido", título principal "Reconecta", primer segmento del logo, primer segmento del banner arcoíris |
| `--brand-blue-secondary` | `#29ABE2` | Azul claro: borde de sección "Al finalizar", segundo cuadrado del logo, segundo segmento del banner |
| `--brand-green` | `#A8CC3A` | Verde lima: borde de sección "Finalidad", tercer cuadrado del logo, cuarto segmento del banner |
| `--brand-amber` | `#F5A623` | Ámbar: borde de sección "Qué no es", cuarto cuadrado del logo, cuarto segmento del banner |
| `--brand-red` | `#D32E3D` | Rojo: solo en el quinto segmento del banner arcoíris. No aparece en ningún otro elemento del campo descriptivo. |
| `--brand-blue-dark` | `#0f7a9c` | Derivado oscuro de `#29ABE2`. Usado en el label de texto uppercase de la sección "Al finalizar". |
| `--brand-amber-dark` | `#b9740a` | Derivado oscuro de `#F5A623`. Usado en el label uppercase de "Qué no es este cuestionario". |
| `--brand-green-dark` | `#5d7a1a` | Derivado oscuro de `#A8CC3A`. Usado en el label uppercase de "Finalidad". |

**Observación clave:** El logo de identidad es un **grid 2×2 de 14×14px** con cuatro de los cinco colores de marca (sin el rojo). El rojo `#D32E3D` es estrictamente decorativo (quinto segmento del banner) y no aparece como color funcional.

### 1.2 Colores estructurales del tema REDCap (configurados para esta encuesta)

Estos colores están en el bloque `<style>` inline del `<head>` de la encuesta. Son la personalización del tema REDCap para el proyecto, diferentes de los colores del diseñador.

| Variable CSS propuesta | Hex | Uso aparente |
|---|---|---|
| `--redcap-theme-primary` | `#0b5394` | Color principal del tema: texto de preguntas y respuestas, enhanced choices, controles de fuente, sección header |
| `--redcap-theme-button` | `#0C74A9` | Texto de botones en general (excepto submit principal) |
| `--redcap-page-bg` | `#cfe2f3` | Fondo de la página (zona exterior al contenedor blanco) |
| `--redcap-submit-maroon` | `#800000` | Texto del botón principal "ADELANTE" / "Finalizar la encuesta" |
| `--redcap-link-return` | `#277ABE` | Enlace "Volver" en la esquina superior derecha |

**Nota metodológica:** `#0b5394` y `#1E7FC2` coexisten en la misma encuesta. El primero es el color del tema REDCap; el segundo es el color de identidad del proyecto. Son azules distintos y no equivalentes.

### 1.3 Colores estructurales REDCap estándar (survey.css v17.1.4)

Estos son los colores propios del motor REDCap, sin personalización del proyecto.

| Hex | Uso |
|---|---|
| `#333` | Fondo del body exterior (oscuro, nunca visible si el contenedor cubre todo) |
| `#ffffff` | Fondo del contenedor central (blanco, overrideado por el tema) |
| `#F3F3F3` | Fondo de celdas de preguntas (overrideado a blanco por el tema) |
| `#DDDDDD` | Borde inferior entre preguntas |
| `#ccc` | Borde del contenedor central |
| `#888` | Texto del footer |
| `#000066` | Links por defecto (dark navy, estilo antiguo de REDCap) |
| `#337ab7` | Enhanced choices: borde y texto por defecto (Bootstrap legacy) |

### 1.4 Colores de texto del campo descriptivo

| Hex | Uso |
|---|---|
| `#1a1a1a` | Texto fuerte del wrapper principal del campo descriptivo |
| `#262626` | Texto de cuerpo del campo descriptivo (párrafos informativos) |
| `#4A4A4A` | Texto secundario (supertítulo, subtítulo del instrumento) |
| `#555` | Texto de la nota metodológica |
| `#999` | Borde de la nota metodológica (dashed) |
| `#f8f9fa` | Fondo de la nota metodológica (gris muy claro) |

---

## 2. Tipografías

### 2.1 Open Sans (REDCap global)

```css
font-family: 'Open Sans', Helvetica, Arial, sans-serif;
```

Aplicada a **todo el body** mediante `body * { font-family: ... !important }`. Es la fuente base de REDCap. Tamaño base: **12px** (survey.css). Título de encuesta: **20px**, peso normal.

Esta regla sobreescribe prácticamente todo lo demás, incluyendo las declaraciones del campo descriptivo.

### 2.2 Segoe UI (identidad del proyecto)

```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

Declarada en los estilos inline de los elementos de identidad del campo descriptivo:
- Supertítulo institucional (`0.72em`, uppercase, `letter-spacing: 1.5px`)
- Subtítulo del instrumento (`0.85em`)
- Texto de cuerpo del campo descriptivo (`0.92em`, `line-height: 1.65`)
- Labels uppercase de secciones (`0.78em`, `letter-spacing: 0.5px`)
- Nota metodológica (`0.75em`)

En la práctica, la regla `!important` de Open Sans puede sobreescribir Segoe UI en navegadores. Sin embargo, si Open Sans no está disponible (o se elimina la regla), Segoe UI sería la fuente de identidad real.

### 2.3 Georgia (wrapper externo del campo descriptivo)

```css
font-family: Georgia, 'Times New Roman', serif;
```

Declarada en el div raíz del campo `presentacion`. Es efectivamente invisible porque Open Sans la sobreescribe. Se interpreta como una intención serif de diseño que no llega a materializarse en REDCap.

---

## 3. Estructura de bloques HTML identificados

### 3.1 Estructura general de página

```
body (background: #cfe2f3)
└── div#pagecontainer.container-fluid (max-width: 800px)
    └── div#container (background: #fff, border: 1px solid #ccc)
        └── div#pagecontent
            ├── div#surveytitlelogo.survey-titlebar [role=banner]
            │   ├── div.survey-titlebar__left
            │   │   ├── img#survey_logo (600×92px)
            │   │   └── h1#surveytitle "Desconecta para conectar"
            │   └── div.survey-titlebar__right
            │       ├── div#return_corner (enlace "Volver")
            │       └── span.font-resize-header (controles A A A)
            └── form#form
                └── table#questiontable.form_border.container-fluid
                    └── tbody.formtbody
                        ├── tr#encuesta_activa-tr (campo calc oculto)
                        ├── tr#presentacion-tr (campo descriptivo VISIBLE)
                        ├── tr#ficha_metodologica-tr (campo descriptivo OCULTO por branching)
                        └── tr.surveysubmit (botones ADELANTE / guardar)
```

### 3.2 Campo descriptivo "presentacion" (bloque de identidad visible)

Este es el único campo visible en la primera página de la encuesta. Contiene toda la identidad visual del proyecto mediante estilos inline.

```
tr#presentacion-tr
└── td.labelrc.col-11 (sin número de pregunta visible)
    └── div [wrapper Georgia, max-width:620px]
        ├── [banner arcoíris superior] 4px, 5 colores, opacity 0.7
        ├── [bloque logo+textos, flex, gap:12px]
        │   ├── [logo grid 2×2 14px]  —  #1E7FC2 #29ABE2 / #A8CC3A #F5A623
        │   └── [textos de identidad]
        │       ├── supertítulo  "Distrito Granada-Metropolitano · …"
        │       ├── título       "Reconecta"
        │       └── subtítulo    "Cuestionario sobre el uso de pantallas…"
        ├── [texto cuerpo — párrafo de presentación]
        ├── [bloque azul]   border-left: 3px solid #1E7FC2   "Contenido"
        ├── [bloque teal]   border-left: 3px solid #29ABE2   "Al finalizar"
        ├── [bloque ámbar]  border-left: 3px solid #F5A623   "Qué no es"
        ├── [bloque verde]  border-left: 3px solid #A8CC3A   "Finalidad"
        ├── [pie de nota]   "No existen respuestas correctas…"
        └── [banner arcoíris inferior] 2px, 5 colores, opacity 0.4
```

### 3.3 Campo descriptivo "ficha_metodologica" (oculto por branching)

Visible solo bajo ciertas condiciones. Contiene una **nota metodológica** en caja gris con borde discontinuo:

```
div [background:#f8f9fa, border:1px dashed #999, border-radius:10px]
    "Nota metodológica: Bloque 2 basado en 'Tardes con Plan'…"
```

### 3.4 Fila de submit (botones)

```
tr.surveysubmit
└── td (text-align:center)
    ├── button[name="submit-btn-saverecord"]  "ADELANTE"  (color:#800000)
    └── button[name="submit-btn-savereturnlater"]  "guardar y volver más tarde"
```

---

## 4. Patrones de diseño reutilizables

### 4.1 Sistema de bloques con borde lateral

El patrón más reutilizable de este diseño es el **bloque con borde izquierdo de 3px**:

```html
<div style="border-left:3px solid {COLOR};padding-left:14px;margin:18px 0;">
  <div style="font-size:.78em;letter-spacing:.5px;text-transform:uppercase;color:{COLOR_DARK};margin-bottom:4px;">
    LABEL DE SECCIÓN
  </div>
  <p>Contenido del bloque.</p>
</div>
```

Los cuatro colores disponibles y sus variantes oscuras para labels:

| Color borde | Label color |
|---|---|
| `#1E7FC2` | `#1E7FC2` (mismo) |
| `#29ABE2` | `#0f7a9c` (más oscuro) |
| `#F5A623` | `#b9740a` (más oscuro) |
| `#A8CC3A` | `#5d7a1a` (más oscuro) |

### 4.2 Banner arcoíris (decorador de sección)

Barra horizontal con 5 segmentos flexibles de colores de identidad:

```html
<div style="height:4px;display:flex;opacity:.7;">
  <div style="flex:1;background:#1E7FC2;"></div>
  <div style="flex:1;background:#29ABE2;"></div>
  <div style="flex:1;background:#A8CC3A;"></div>
  <div style="flex:1;background:#F5A623;"></div>
  <div style="flex:1;background:#D32E3D;"></div>
</div>
```

### 4.3 Logo grid 2×2

```html
<div style="display:grid;grid-template-columns:14px 14px;grid-template-rows:14px 14px;gap:2px;">
  <div style="background:#1E7FC2;"></div>
  <div style="background:#29ABE2;"></div>
  <div style="background:#A8CC3A;"></div>
  <div style="background:#F5A623;"></div>
</div>
```

---

## 5. Comparación con COMPÁS NG

| Elemento | Encuesta REDCap | COMPÁS NG |
|---|---|---|
| Azul primario | `#1E7FC2` | `#0074c8` |
| Verde | `#A8CC3A` | `#94d40b` |
| Naranja/Ámbar | `#F5A623` | `#ffb61b` |
| Rojo | `#D32E3D` | `#dc143c` |
| Fuente identidad | Segoe UI | Open Sans |
| Fuente sistema | Open Sans | Open Sans |
| Fondo página | `#cfe2f3` (azul muy claro) | blanco / `#f8fafc` |
| Patrón borde lateral | Sí (4 variantes) | No (patrones propios) |
| Logo grid | 2×2 cuadrados (14px) | No (wordmark COMPÁS) |
| Banner multicolor | Sí (5 segmentos) | `gradient-bar` (6 colores) |

**Observación:** Los colores de ambos proyectos son temáticamente similares (azul + verde + naranja + rojo) pero con valores hex distintos. El banner arcoíris de REDCap y el `gradient-bar` de COMPÁS NG son el mismo patrón conceptual aplicado con paletas propias.

---

## 6. Archivos generados

| Archivo | Contenido |
|---|---|
| `rendered.html` | HTML completo descargado de la encuesta (93 KB) |
| `extracted-style.css` | CSS limpio organizado por bloques con comentarios |
| `EXTRACTED-VISUAL-NOTES.md` | Este documento |

Los archivos `survey.css`, `style.css` y `survey_text_large.css` de REDCap v17.1.4 se descargaron en `/tmp/` durante la extracción pero **no se incluyen** en esta carpeta porque son CSS de la plataforma REDCap, no del proyecto. Solo son relevantes para entender el contexto estructural.
