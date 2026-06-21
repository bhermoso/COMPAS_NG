# COMPÁS NG — Contrato visual permanente

> Referencia de identidad visual. Aplicable a interfaz, cuadernos, informes y documentación.

---

## 1. Principio rector

COMPÁS NG es una herramienta institucional de salud pública. Su apariencia visual debe
transmitir **rigor, confianza y claridad documental**.

La estética es institucional y sobria. No es una aplicación de consumo, no es una startup
y no es un prototipo experimental. Cualquier elemento visual que evoque esas categorías
debe eliminarse.

---

## 2. Paleta de color

### Gradiente institucional COMPÁS

```
linear-gradient(90deg,
  #0074c8  0%,
  #00acd9 20%,
  #94d40b 40%,
  #ffb61b 60%,
  #ff6600 80%,
  #dc143c 100%)
```

**Uso autorizado:** franja de identidad en cabeceras principales, portadas de cuadernos,
bordes decorativos de fichas técnicas e informes institucionales.

**Uso prohibido:** fondos de pantalla completa, fondos de cards, elementos interactivos,
textos, iconos.

### Colores primarios

| Token | Valor | Uso |
|---|---|---|
| Azul institucional | `#0074c8` | Acento primario, enlaces activos |
| Azul claro | `#00acd9` | Acento secundario, destacados |
| Verde salud | `#94d40b` | Indicadores positivos, confirmaciones |
| Ámbar | `#ffb61b` | Alertas, cautelas metodológicas |
| Naranja | `#ff6600` | Prioridades, énfasis de acción |
| Rojo | `#dc143c` | Errores, indicadores críticos |

### Neutros

| Uso | Valor |
|---|---|
| Fondo principal | `#f8fafc` |
| Fondo secundario | `#f1f5f9` |
| Bordes | `#e2e8f0` |
| Texto principal | `#1e293b` |
| Texto secundario | `#64748b` |
| Blanco | `#ffffff` |

---

## 3. Tipografía

- **Jerarquía clara**: h1 → h2 → h3 → cuerpo con diferenciación visible entre niveles.
- **Sin fuentes decorativas**: solo tipografía del sistema o fuentes sans-serif neutras.
- **Cuerpo legible**: tamaño mínimo 14 px en pantalla, interlineado generoso (1.5–1.6).
- **Peso semibold** para títulos de panel y etiquetas institucionales.
- **Mayúsculas pequeñas** (`eyebrow`) solo para epígrafes de sección, nunca en cuerpo.
- **Monospace** exclusivamente para código, identificadores técnicos y valores de datos.

---

## 4. Composición y densidad visual

- Predominio de **blanco y grises claros** como fondo dominante.
- **Baja densidad visual**: espacio en blanco generoso, márgenes amplios.
- Los paneles de contenido tienen fondo blanco sobre fondo de página gris muy claro.
- Los cards no usan sombras pronunciadas: máximo `box-shadow` sutil (1–2 px, opacidad baja).
- El color se usa **de forma contenida**: un acento por componente, no múltiples colores
  compitiendo.
- Las listas de documentos y evidencias usan separadores finos, no franjas de color.

---

## 5. Elementos prohibidos

Los siguientes elementos están explícitamente excluidos del sistema visual de COMPÁS NG:

- Gradientes como fondos de pantalla o de cards.
- Animaciones de entrada/salida llamativas (fade-in largo, slide-up, bounce).
- Iconos decorativos sin función semántica.
- Colores de acento múltiples en un mismo componente.
- Tipografía de display o editorial.
- Estilos que recuerden a dashboards de BI, herramientas SaaS o apps móviles de consumo.
- Badges, pills o etiquetas en colores saturados como decoración.
- Efectos de glassmorphism, neumorphism o similares.

---

## 6. Animaciones y transiciones

Las animaciones solo están justificadas cuando **aportan significado funcional**:

- Indicar que un proceso está en curso (spinner de carga, indicador de progreso).
- Confirmar que una acción se ha completado (transición de estado suave).
- Orientar la atención del usuario hacia un cambio de estado relevante.

Especificaciones:

- **Duración**: 150–250 ms para transiciones de estado; máximo 400 ms para cambios de vista.
- **Easing**: `ease-in-out` o `ease-out`. Nunca `bounce`, `elastic` ni similares.
- **Propiedades animables**: `opacity`, `transform` (solo translate/scale suave). Evitar
  animar `height`, `width` o `color` directamente por coste de repaint.
- Las animaciones **nunca deben comprometer la legibilidad** del contenido durante la transición.
- En contextos de accesibilidad (`prefers-reduced-motion`), todas las animaciones deben
  eliminarse o reducirse a cambios instantáneos.

---

## 7. Aplicación por contexto

### Interfaz de la aplicación

- Fondo de app: `#f8fafc`.
- Panels: fondo `#ffffff`, borde `1px solid #e2e8f0`.
- Barra de navegación: fondo blanco con franja inferior del gradiente COMPÁS (4 px).
- Contexto municipal: franja discreta bajo la navegación, sin color de fondo propio.
- Botones primarios: fondo `#0074c8`, texto blanco, borde-radio contenido (4–6 px).
- Botones secundarios: fondo transparente, borde `#e2e8f0`, texto `#1e293b`.
- Pills de estado: color institucional correspondiente al estado, opacidad reducida en fondo.

### Cuadernos de reconstrucción

- Portada: franja del gradiente COMPÁS en borde superior (8–12 px).
- Cuerpo: fondo blanco, texto `#1e293b`, márgenes amplios.
- Secciones: separadas por línea fina `#e2e8f0`, no por bloques de color.
- Tablas: cabecera con fondo `#f1f5f9`, sin colores de fila alternos saturados.

### Informes y fichas técnicas

- Cabecera: logo o wordmark COMPÁS + franja del gradiente institucional.
- Cuerpo: tipografía sobria, jerarquía clara, sin elementos decorativos.
- Datos y cifras: tamaño mayor, peso semibold, color de acento único (`#0074c8`).
- Notas metodológicas: tamaño menor, color `#64748b`, separadas visualmente del cuerpo.

### Documentación técnica (Markdown)

- Sin elementos visuales complejos: solo encabezados, párrafos, listas y tablas.
- Tablas para datos estructurados; listas para enumeraciones; bloques de código para
  fragmentos técnicos.
- El gradiente no se representa en Markdown; se menciona como referencia de color.

---

*Última revisión: 2026-06-21 — Contrato formalizado tras estabilización de Zagra*
