# GRANADA-ZAIDÍN — PAQUETE DE RECONSTRUCCIÓN DE WORKSPACE

**Versión:** 1.0 — 2026-07-07  
**Producto:** Perfil Local de Salud  
**Ámbito:** Granada-Zaidín (distrito inframunicipal)  
**Estado:** Reconstrucción manual necesaria — sin workspace rehidratable

---

## A. Estado de recuperación

### Diagnóstico de localStorage

Los puertos revisados (5173, 5174, 5175) no ofrecen datos recuperables:

| Puerto | Clave | Estado |
|--------|-------|--------|
| 5173 | `compas-ng:workspace:atarfe` | Válido, vacío |
| 5174 | `compas-ng:workspace:atarfe` | Válido, vacío |
| 5175 | `compas-ng:workspace:atarfe` | Válido, vacío |
| 5175 | `compas-ng:workspace:granada-zaidin` | Dañado — string no parseable, sin recuperación posible |

**Conclusión:** `localStorage` no es fuente fiable para este ámbito. No se realizará ninguna lectura ni escritura sobre él.

### Origen del workspace dañado

La entrada `granada-zaidin` en el puerto 5175 fue creada antes de que el ámbito existiera formalmente en `DEMO_MUNICIPALITIES`. El string no parseado sugiere que se almacenó un valor incompleto durante una sesión de prueba. No contiene datos recuperables.

### Repositorio

No existe ninguno de los siguientes artefactos:
- Export JSON de workspace de Granada-Zaidín
- Fixture rehidratable (`fixtures/health-reports/` solo tiene Atarfe)
- Expediente normalizado `municipalities/granada-zaidin/`
- Manifest `municipalities/granada-zaidin/manifest.json`

**La reconstrucción debe realizarse desde fuentes documentales, cargando manualmente desde la UI.**

---

## B. Identidad territorial

| Campo | Valor |
|-------|-------|
| `id` | `granada-zaidin` |
| `name` | `Granada-Zaidín` |
| `province` | `Granada` |
| `territorialType` | `distrito` |
| `ineCode` | — (sin código INE municipal propio) |
| Tipo de ámbito | Distrito / ámbito inframunicipal |
| Municipio padre metodológico | Granada capital |
| INE municipio padre | 18087 |

### Restricción metodológica BADEA/IECA

Granada-Zaidín **no es un municipio BADEA**. BADEA/IECA no tiene ámbito de distrito. Todo dato BADEA asociado a este ámbito es **contexto municipal de referencia (Granada capital, INE 18087), nunca dato específico del distrito**, y debe etiquetarse explícitamente como tal.

Fuente de esta restricción: `docs/methodology/pilots/BADEA-IECA-TERRITORIAL-SCOPE-MAPPING.md`

---

## C. Fuente primaria — Informe de Salud

### Candidato canónico

```
docs/source-material/territorial-cases/granada-zaidin/
  Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx   (5.2 MB)
```

### Justificación de la elección

Las tres copias DOCX detectadas tienen tamaños equivalentes (~5.2 MB):

| Archivo | Tamaño | Nota |
|---------|--------|------|
| `Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx` | 5.2 MB | **Candidato canónico** — reformateado según esquema Atarfe |
| `informe salud granada Abril2023.docx` | 5.2 MB | Copia original |
| `informe-salud-granada-Abril2023.docx` | 5.2 MB | Segunda copia, nombre normalizado |
| `informe salud granada Abril2023.odt` | 4.9 MB | ODT — ignorado por `.gitignore`, no cargable directamente |

Se elige `Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx` porque fue reformateado con el esquema estructural del caso Atarfe, que es el formato de referencia del parser de COMPÁS NG (`HealthReportSectionParser`).

### Comportamiento tras D-HR-01

Tras la decisión D-HR-01 (registro `6a80c19 docs: ignorar ODT/ODS y registrar D-HR-01`):

- Se carga como `kind: "health-report"` en el repositorio documental.
- Se conserva como fuente primaria de referencia humana.
- **No genera `EvidenceAtom`.**
- **No se convierte en evidencia estructurada.**
- No alimenta el EvidenceStore ni el MIT.

El Informe de Salud proporciona contexto diagnóstico para la deliberación técnica, no trazabilidad de evidencia automática.

---

## D. Fuentes complementarias

### D.1 Informes Vigía

```
docs/source-material/territorial-cases/granada-zaidin/
  Informe Zaidin Centro Este.docx   (29 KB)
  Informe Zaidin Sur.docx           (29 KB)
  InformeVigia Zaidin Centro Este.ods  (50 KB — ODT/ODS ignorado)
```

**Clasificación:** Documentación territorial de contexto. Informes de vigilancia epidemiológica a nivel de zona básica de salud, no equivalentes al Informe de Salud municipal.

**Uso en la UI:** Si el repositorio admite cargarlos como texto pegado o conversión previa a DOCX, pueden registrarse como tipo `"otro"` o `"community-context"` según el selector documental activo. No requieren procesamiento como evidencia estructurada.

**Nota:** Los Informes Vigía tienen 29 KB cada uno (muy pequeños). Verificar antes de cargar que contienen contenido tabular o narrativo parseable y no son plantillas vacías.

### D.2 Mapa de activos comunitarios

```
docs/source-material/territorial-cases/granada-zaidin/
  MapaDeActivo_PLS_Zaidin.csv   (19 KB)
```

**Estructura detectada (cabecera CSV):**
```
Orden, nombre, municipio, localidad, tipo_de_v_a, direcci_n,
c_digo_postal, titular, tel_fono, requisito_uso, descripci_n,
actividades_del_activo, razon_seleccion, razon_modificacion,
email, web_recurso
```

Este formato corresponde a un **export de Localiza Salud** (herramienta de mapeo de activos comunitarios de la Junta de Andalucía). Los recursos listados pertenecen al área del CMSS Zaidín de Granada.

**Restricción operativa:** No reabrir `community-asset` como categoría visible en el selector documental. El selector actual fue deliberadamente depurado.

**Decisión pendiente:** El CSV requiere una de estas opciones antes de poder cargarse:
1. Normalización manual a un formato de texto estructurado compatible con el repositorio actual (vía `"otro"` u otra vía disponible).
2. Esperar a que se habilite una vía `localiza-salud` específica en el repositorio, si se decide en un sprint posterior.

**No procesar ni modificar el CSV en esta fase.**

### D.3 Borrador de análisis epidemiológico

```
docs/source-material/territorial-cases/granada-zaidin/
  Borrador análisis epidemiológico 2023 Zaidín vs.odt   (303 KB)
```

**Formato:** ODT — ignorado por `.gitignore`, no cargable directamente en COMPÁS NG.

**Clasificación:** Material de contraste y deliberación técnica. Útil para informar la síntesis del Perfil Local de Salud, pero requiere conversión manual previa (a DOCX o texto) si se decide incorporar.

**Uso recomendado:** Consulta fuera de la plataforma como material de apoyo a la deliberación. No cargarlo como fuente de evidencia estructurada.

### D.4 Proceso RELAS Granada

```
docs/source-material/relas-process/granada-re-las/
  acta 1 2023 GranadaRELAS.odt
  acta 2 2023 GranadaRELAS.odt
  acta 3 2023 GranadaRELAS.odt
  formulario necesidades sentidas GranadaRELAS.odt
```

**Formato:** ODT — ignorados por `.gitignore`.

**Clasificación:** Material cualitativo/participativo del proceso RELAS Granada 2023. Corresponde al proceso RELAS de Granada en general, **no necesariamente específico de Zaidín**.

**Uso recomendado:** Revisar el contenido antes de usar. Solo incorporar si las actas documentan explícitamente participación o necesidades del ámbito Zaidín. En ese caso, convertir a DOCX y registrar como `"citizen-participation"` o tipo equivalente.

### D.5 Marcos estratégicos

```
docs/source-material/strategic-frameworks/
  Plan provinicial de salud de Granada 2013-2020.pdf
  Planes Locales de Salud 2023 v10.pdf
  Plan de mayores 2020-23.pdf
  GUIA RÁPIDA_2feb.pdf
```

**Clasificación:** `strategic-framework` — aplicable a cualquier ámbito Granada.

**Uso:** Cargables como marco estratégico de referencia. Son documentos institucionales de ámbito provincial/autonómico válidos para Granada-Zaidín.

### D.6 Estudios EAS / fixtures provinciales Granada

```
fixtures/
  duke-eas-granada.csv
  predimed-eas-granada.csv
  sf12-eas-granada.csv
  sueno-eas-granada.csv
  cage-eas-granada.csv
  ibse-granada-provincia.csv
  auditc-municipal.csv
  ipaq-eas-granada.csv
  ghq12-municipal.csv
  phq9-municipal.csv
  psqi-municipal.csv
  fagerstrom-municipal.csv
  sbq-municipal.csv
```

**Clasificación:** Datos EAS de Granada provincia — **no datos específicos de Granada-Zaidín**.

**Restricción metodológica:** Los estudios EAS de la VI ola (2023) son de ámbito provincial Granada. No representan la realidad específica del distrito Zaidín. Pueden usarse como **contexto provincial de referencia** (p. ej., comparativa de indicadores) pero no como fuente primaria del perfil de Zaidín.

**Uso recomendado:** Cargar solo si se documenta explícitamente que se trata de datos de Granada provincia, no de Zaidín. No agregar al EvidenceStore de Granada-Zaidín sin esa cautela.

### D.7 BADEA/IECA

**No implementar integración BADEA en este ámbito.**

Si en un sprint posterior se decide añadir contexto estadístico:
- Fuente admisible: datos BADEA de Granada capital (18087), etiquetados como `badeaMode: "parent-municipality"`.
- Nunca como dato específico del distrito.
- Referencia técnica: `docs/methodology/pilots/BADEA-IECA-TERRITORIAL-SCOPE-MAPPING.md`

---

## E. Orden de reconstrucción manual en la UI

> Seguir este orden reduce el riesgo de invalidar el PSL y asegura trazabilidad completa.

**Paso 1 — Selección de ámbito**
- Abrir COMPÁS NG.
- En el selector de ámbito, elegir `Granada-Zaidín` (aparece como `Granada · Distrito municipal`).
- Confirmar que se crea un workspace limpio.

**Paso 2 — Informe de Salud (fuente primaria)**
- Cargar `Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx` como `health-report`.
- Verificar que el documento se registra correctamente en el repositorio documental.
- Confirmar que no se generan EvidenceAtoms (comportamiento esperado tras D-HR-01).

**Paso 3 — Mapa de activos (decisión previa requerida)**
- Revisar `MapaDeActivo_PLS_Zaidin.csv` fuera de la plataforma.
- Decidir si se normaliza a texto estructurado para carga manual, o si se espera a una vía `localiza-salud`.
- **No cargar el CSV directamente sin haber tomado esa decisión.**

**Paso 4 — Informes Vigía (opcional)**
- Verificar que `Informe Zaidin Centro Este.docx` y `Informe Zaidin Sur.docx` tienen contenido parseable.
- Si procede, convertir o cargar como documentación territorial de contexto.

**Paso 5 — Material RELAS (condicional)**
- Revisar las 3 actas de GranadaRELAS.
- Cargar solo si el contenido documenta explícitamente participación de Zaidín.

**Paso 6 — Marcos estratégicos (opcional)**
- Cargar los PDFs de `strategic-frameworks/` como `strategic-framework` si el repositorio lo admite.

**Paso 7 — Deliberación y síntesis**
- Con el Informe de Salud como referencia, completar la síntesis del Perfil Local de Salud manualmente.
- Consultar el borrador epidemiológico (ODT) fuera de la plataforma como material de apoyo.

---

## F. Vacíos documentales

Los siguientes elementos **no están disponibles** y son limitaciones conocidas para la reconstrucción:

| Elemento | Estado | Impacto |
|----------|--------|---------|
| IBSE específico de Zaidín | **No existe** | Sin tasa IBSE distrital. Los datos IBSE provinciales no son equivalentes. |
| Localiza Salud para Zaidín | **No identificado** | El CSV de activos está en formato Localiza pero requiere decisión de vía de carga. |
| Workspace exportable (JSON) | **No existe** | Reconstrucción desde cero obligatoria. |
| Manifest normalizado `municipalities/granada-zaidin/` | **No existe** | No hay expediente estructurado equivalente a los otros municipios. |
| Microdatos EAS filtrados por Zaidín | **Pendiente verificación** | `EAS_COMPLETO.csv` (85 MB) puede contener variable territorial. Requiere auditoría del diseño muestral antes de uso. |
| EAS provincial como dato distrital | **No válido metodológicamente** | Los fixtures provinciales Granada no representan específicamente el distrito Zaidín. |
| BADEA datos de Zaidín | **No existe** | BADEA no tiene ámbito de distrito. Granada capital (18087) solo como contexto. |

---

## G. Recomendación y próximos pasos

### Opción A — Reconstrucción manual controlada en UI (inmediata)

Factible con las fuentes disponibles. Resultado: workspace parcial con:
- Informe de Salud cargado.
- Síntesis manual del Perfil Local de Salud.
- Sin evidencia estructurada IBSE ni estudios complementarios específicos.

**Adecuado para:** inicio de trabajo deliberativo, redacción de conclusiones, revisión del diagnóstico narrativo.

### Opción B — Expediente normalizado `municipalities/granada-zaidin/` (sprint posterior)

Crear la estructura:
```
municipalities/granada-zaidin/
  manifest.json
  sources/
    Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx
    MapaDeActivo_PLS_Zaidin.csv
    Informe Zaidin Centro Este.docx
    Informe Zaidin Sur.docx
  processed/
  profiles/
  plans/
  evidence/
  audit/
  exports/
  prioritisation/
```

**Adecuado para:** estabilizar el caso como ámbito canónico de COMPÁS NG al mismo nivel que Atarfe/Alfacar/Churriana.

### Decisión pendiente inmediata

Antes de iniciar la reconstrucción, confirmar:
1. Si `Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx` es aceptado como fuente canónica o si se prefiere una de las otras copias.
2. Qué hacer con `MapaDeActivo_PLS_Zaidin.csv` (Localiza Salud).
3. Si se crea el expediente normalizado ahora o se difiere.

---

## H. Fuentes indexadas — referencia rápida

```
INFORME DE SALUD (candidato canónico):
  docs/source-material/territorial-cases/granada-zaidin/
    Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx

OTRAS COPIAS IS GRANADA (equivalentes en contenido):
    informe salud granada Abril2023.docx
    informe-salud-granada-Abril2023.docx

DOCUMENTACIÓN TERRITORIAL:
    Informe Zaidin Centro Este.docx
    Informe Zaidin Sur.docx
    InformeVigia Zaidin Centro Este.ods       [ODT/ODS — no cargable directamente]
    Borrador análisis epidemiológico 2023 Zaidín vs.odt  [ODT — deliberación]

ACTIVOS COMUNITARIOS (Localiza Salud):
    MapaDeActivo_PLS_Zaidin.csv               [decisión de vía pendiente]

RELAS GRANADA (no específico Zaidín):
  docs/source-material/relas-process/granada-re-las/
    acta 1, 2, 3 2023 GranadaRELAS.odt
    formulario necesidades sentidas GranadaRELAS.odt

MARCOS ESTRATÉGICOS:
  docs/source-material/strategic-frameworks/
    Plan provinicial de salud de Granada 2013-2020.pdf
    Planes Locales de Salud 2023 v10.pdf
    Plan de mayores 2020-23.pdf

RESTRICCIÓN BADEA:
  docs/methodology/pilots/BADEA-IECA-TERRITORIAL-SCOPE-MAPPING.md
    → Granada capital (18087) como contexto, nunca dato de Zaidín

MICRODATOS EAS (pendiente verificación territorial):
  EAS_COMPLETO.csv                            [85 MB — raíz, no commiteado]
  EAS_microdatos_adulto_READY.csv             [70 MB — raíz, no commiteado]
```
