# CONTRACT-SCALE-PANELS

> Contrato editorial de paneles de escalas para estudios complementarios.
> Versión 1.1 — COMPÁS NG Sprint 1 — 2026-06-27

---

## Propósito

Establecer la gramática editorial que debe compartir todo panel de estudio complementario.

Este contrato distingue tres categorías de bloques: obligatorios en la interfaz de usuario, condicionales según la disponibilidad de datos, y de referencia de sistema (no visibles en la UI). Un panel puede cumplir el contrato mostrando solo los bloques obligatorios e incluyendo los condicionales cuando tienen contenido.

---

## Ámbito de aplicación

| Instrumento | Panel |
|---|---|
| IBSE | IBSEPanel |
| DUKE-EAS | DUKEPanel |
| PREDIMED-EAS | PREDIMEDPanel |
| SF-12 EAS | SF12Panel |
| Sueño EAS | SuenoPanel |
| CAGE-EAS | CAGEPanel |

---

## Gramática editorial

### Categoría A — Bloques obligatorios en la UI

Deben estar presentes en todo panel que muestre resultados, sin excepción.

#### A.1 · Metadatos de muestra

- Fuente (nombre de fichero).
- n válido y n bruto explícitos.
- Tasa de incompletos cuando sea calculable.

**Variable:** estructura de n por instrumento (algunos tienen múltiples n válidos por subescala).

---

#### A.2 · Resultado principal con representación proporcional

- Tabla con barra horizontal relativa al máximo teórico del instrumento.
- Valor absoluto sobre la escala.
- Si hay subescalas o factores: una fila por cada una.
- La escala del instrumento debe ser visible (denominador o eje).

**Variable:** escala, dirección, estructura de subescalas.

---

#### A.3 · Referencias comparativas

- Referencia Granada (si disponible).
- Referencia Andalucía (si disponible).
- Referencia normativa o estudio de referencia (si disponible).

Si no existen datos de referencia, el campo se señala explícitamente con "Sin referencia disponible."

**Variable:** valores de referencia por instrumento.

---

#### A.4 · Recordatorio institucional

Presente en todos los paneles, sin variación posible:

> La decisión territorial corresponde siempre al equipo técnico.

---

### Categoría B — Bloques condicionales en la UI

Se muestran cuando el parser genera el contenido correspondiente. Nunca se muestran vacíos.

#### B.1 · Interpretación asistida

Síntesis automática cuando el instrumento tiene múltiples dimensiones comparables:

- Dispersión o variabilidad interfactorial.
- Identificación de la dimensión más baja y más alta.
- Clasificación del nivel según umbrales del sistema.

**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).

**Invariante cuando se muestra:**
> Esta síntesis es una derivación automática del sistema. No constituye una interpretación experta ni una conclusión metodológica del instrumento. Requiere validación técnica antes de emplearse en planificación territorial.

**Variable:** lógica de dispersión, umbrales de clasificación.

---

#### B.2 · Cautelas metodológicas

Lista de advertencias del instrumento y de la muestra concreta.

- Advertencias del instrumento (p. ej., recodificación EAS reconstructiva).
- Advertencias de la muestra (tamaño pequeño, tasa de incompletos elevada).
- Advertencias de interpretación (p. ej., resultado de muestra ≠ estimación poblacional).

**Regla de producción:** Todo parser de estudio complementario DEBE generar al menos una cautela metodológica para cualquier estudio cargado. Esto garantiza que el bloque B.2 sea siempre visible cuando hay datos. El bloque no se muestra si el parser no generó cautelas; los parsers garantizan que esto nunca ocurra.

**Variable:** cautelas específicas por instrumento y por muestra concreta.

---

### Categoría C — Bloques de referencia de sistema

No aparecen en la interfaz de usuario. Son metainformación sobre el instrumento para el equipo técnico y para el diseño de futuros motores.

#### C.1 · Identidad del instrumento

- Nombre completo y acrónimo.
- Referencia bibliográfica principal.
- Número de ítems y estructura factorial.
- Fuente de datos utilizada.

#### C.2 · Qué mide

- Constructo medido.
- Escala numérica (mínimo–máximo).
- Dirección de la escala.
- Tipo de puntuación.

#### C.3 · Integración con EvidenceStore

- Tipos de átomos producidos (`kind`).
- Etiquetas de trazabilidad (`tags`).
- Clave estable de deduplicación.
- Nivel de confianza por defecto.

#### C.4 · Integración con MIT

- Qué átomos se usan como evidencia primaria.
- Qué átomos se usan como observación contextual de apoyo.
- Restricciones de uso.

#### C.5 · Integración con PSL

- Capítulo del PSL al que alimenta prioritariamente.
- Tipo de contribución.

---

## Invariantes arquitectónicos

Los siguientes invariantes son absolutos y no admiten excepción:

1. El recordatorio institucional (A.4) siempre aparece cuando hay resultados.
2. Los n bruto y n válido (A.1) siempre son visibles cuando hay datos.
3. Ningún panel puede presentar un resultado sin su escala explícita (A.2).
4. La interpretación asistida (B.1), cuando se muestra, siempre incluye el aviso de derivación automática.
5. Todo parser DEBE generar al menos una cautela metodológica para cualquier estudio cargado.

---

## Principios de presentación visual

- Líneas antes que cajas.
- Tablas cuando aporten claridad comparativa.
- Barras proporcionales para valores numéricos en escala definida.
- Sin gradientes decorativos ni animaciones.
- Sin iconografía ornamental.
- Pocas decisiones cromáticas: una línea de color para distinguir el resultado total de las dimensiones.
- Jerarquía tipográfica: metadatos → tabla → leyenda → referencias → cautelas → recordatorio.

---

## Aplicación a instrumentos específicos

### IBSE

- **Escala:** 0–100. Mayor = mayor bienestar socioemocional.
- **Dimensiones:** Índice total + 4 factores (Vínculo, Situación, Control, Persona).
- **Umbrales de nivel:** alto ≥75, medio 60–74, medio-bajo 50–59, bajo <50.
- **Dispersión interfactorial alta [Regla del sistema]:** rango entre factores > 20 puntos.
- **Interpretación asistida (B.1):** aplica. Rango entre factores como indicador de dispersión.
- **Cautela de recodificación:** no aplica (exportación REDCap directa).

### DUKE-EAS

- **Escala:** 0–55. Mayor = mayor apoyo social percibido.
- **Dimensiones:** Apoyo global, Confidencial, Afectivo.
- **Regla EAS:** recodificación reconstructiva empírica; umbral bajo = 0 (normal) / 1 (bajo).
- **Interpretación asistida (B.1):** no aplica (dimensiones superpuestas, no independientes).
- **Cautela específica:** la regla EAS no es criterio clínico universal.

### PREDIMED-EAS

- **Escala:** 0–14 (ítems binarios). Mayor = mayor adherencia mediterránea.
- **Umbrales:** alta ≥9, media 7–8, baja ≤6.
- **Interpretación asistida (B.1):** no aplica (una dimensión principal con distribución).
- **Cautela:** la adherencia es autorreferida; no equivale a consumo real medido.

### SF-12 EAS

- **Escala:** 0–100 (componentes normalizados). Mayor = mejor salud percibida.
- **Dimensiones:** Componente Físico (PCS12_SP) y Componente Mental (MCS12_SP).
- **Interpretación asistida (B.1):** no aplica (los componentes son independientes y no comparables entre sí).
- **Cautela:** puntuaciones son comparativas respecto a la norma española (Vilagut et al. 2008).

### Sueño EAS

- **Variables:** duración insuficiente (P33_R, proporción) y calidad subjetiva (P33A, proporción).
- **Referencia epidemiológica:** ~29 % de discordancia entre duración y calidad esperados.
- **Interpretación asistida (B.1):** no aplica (las variables miden dimensiones distintas del sueño).
- **Cautela:** ambas variables son autorreferidas; no equivalen a registro polisomnográfico.

### CAGE-EAS

- **Variable:** CAGE_R (riesgo alcoholismo, proporción positiva) y CAGE ordinal (1–4).
- **Umbrales:** 1 = bebedor social, 4 = dependencia grave.
- **Interpretación asistida (B.1):** no aplica (una variable dicotómica principal).
- **Cautela:** el CAGE es un cribado, no un diagnóstico. Resultados requieren confirmación clínica.

---

*Este contrato es el documento de referencia para la implementación y revisión de todos los paneles de escala de COMPÁS NG.*
