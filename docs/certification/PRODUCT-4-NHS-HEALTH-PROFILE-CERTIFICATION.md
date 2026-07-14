# COMPÁS NG — Expediente de Certificación Institucional
## Producto 4 — Perfil de Salud Local tipo NHS (PSL-NHS)

> Documento oficial de arquitectura.
> No es un manual de usuario ni una guía de implementación.
> Deja constancia formal de que el Producto 4 existe en su capa de dominio y compilación,
> cuál es su alcance certificado, qué garantiza, qué queda pendiente y por qué puede
> considerarse el compilador certificado aunque no exista todavía interfaz de usuario.
> No puede modificarse salvo por decisión deliberada del responsable del proyecto.
> Fecha de emisión: 2026-06-30

---

## Nota de estado superado (2026-07-14)

Este expediente es un acto fechado de certificación emitido el 2026-06-30. Su cuerpo se conserva intacto como registro histórico: no se reescribe retrospectivamente. El estado actual del repositorio supera parte de sus afirmaciones de implementación: la UI, la integración en Home y la navegación del PSL-NHS existen tras `06f9b57 feat(p4-ui): completar unificacion del Producto 4 — Perfil de Salud tipo NHS`. La exportación PDF/HTML/DOCX del PSL-NHS sigue pendiente (D4-04). El catálogo canónico de Estudios Complementarios son 13; las menciones de esta certificación a 6 estudios reflejan la cobertura certificada en aquel momento y hoy constituyen arrastre histórico/deuda abierta, no doctrina vigente del catálogo.

---

## 1. Identificación

| Campo | Valor |
|---|---|
| **Nombre oficial** | Perfil de Salud Local tipo NHS (PSL-NHS) |
| **Código** | PRODUCT-4 |
| **Objetivo institucional** | Producir un documento institucional de diagnóstico comparativo, legible por Alcaldía y corporación municipal en menos de diez minutos, que presenta los indicadores de salud del municipio junto a sus valores de referencia provinciales o nacionales |
| **Fecha de emisión** | 2026-06-30 |
| **Estado** | **COMPILADOR CERTIFICADO — UI PENDIENTE** |
| **Versión** | 1.0 |
| **Repositorio** | `C:\Users\blash\Desktop\COMPAS_NG` |
| **Último commit certificado** | `dd04a98` — fix(p4): resolve P4-DEF-01 |
| **Prerrequisitos certificados** | Producto 1 — Estudios Complementarios (2026-06-29) · Producto 2 — SAM NG (2026-06-30) · Producto 3 — PSL-C (2026-06-30) |

---

## 2. Alcance certificado

Esta certificación cubre exclusivamente:

| Elemento | Estado |
|---|---|
| `NHSHealthProfileArtifact` — tipo de dominio | ✅ Certificado |
| `NHSHealthProfileCompiler` — compilador | ✅ Certificado |
| Organización por dominios causales (Bienestar / Conductas / Salud percibida) | ✅ Certificado |
| Indicadores headline contractuales (§6 del contrato) | ✅ Certificado |
| Gates de compilación G-NHS-1 y G-NHS-2 | ✅ Certificado |
| Aviso G-NHS-3 (pocos comparadores: `fewComparatorsWarning`) | ✅ Certificado |
| Valores de referencia institucionales: DUKE, PREDIMED, SF-12 | ✅ Certificados y limpios |
| Calidad institucional de `NHSReference.population` y `.source` | ✅ Certificada (P4-DEF-01 resuelto) |
| Comportamiento con datos parciales (0–6 estudios) | ✅ Certificado |
| Parte IV — Alcance del diagnóstico (obligatoria, P4-I9) | ✅ Certificada |
| Invariante de congelación `isCongealed: true` (P4-I4) | ✅ Certificada |
| Inmutabilidad del PSL de origen tras compilación | ✅ Certificada |
| Versionado `PSL-NHS/vN` | ✅ Certificado |
| Trazabilidad: `sourcePSLId`, `sourcePSLVersion`, `compiledAt`, `compiledBy` | ✅ Certificada |
| Aviso de muestra pequeña `smallSampleWarning` (umbral: n<30) | ✅ Certificado |
| Participación ciudadana — Parte III (solo presencia/count, sin listar temas) | ✅ Certificada |
| Serialización completa del artefacto (JSON) | ✅ Certificada |
| Tests de regresión contra P4-DEF-01 | ✅ Incorporados |

**Lo que NO queda certificado en esta emisión:**

| Elemento | Estado |
|---|---|
| Interfaz de usuario del Producto 4 | ❌ No existe |
| Vista React del `NHSHealthProfileArtifact` | ❌ No implementada |
| Exportación DOCX/PDF del PSL-NHS | ❌ No implementada (D4-04) |
| Integración en la Home semántica de COMPÁS NG | ❌ No implementada |
| Valores de referencia para IBSE, Sueño-EAS y CAGE-EAS | ❌ Sin referencia disponible (D4-02) |
| Ruta de publicación del artefacto a receptores externos | ❌ No definida |
| Acceso al PSL-NHS desde el ciclo de vida del PLS (Producto 7) | ❌ Pendiente de Producto 7 |

---

## 3. Auditoría final — 12 puntos de verificación

### 3.1 El Producto 4 nace del `LocalHealthProfile` validado, no del PSL-C compilado

**VERIFICADO.** El compilador recibe `psl: LocalHealthProfile` como entrada directa. El gate G-NHS-1 exige `psl.status === "validated" || psl.status === "approved"`. El compilador no importa ni accede al `LocalHealthProfileArtifact` (PSL-C). Ambos productos compilan el mismo objeto fuente de forma independiente.

```
LocalHealthProfile (validated)
    ├──► LocalHealthProfileCompiler → LocalHealthProfileArtifact (P3)
    └──► NHSHealthProfileCompiler  → NHSHealthProfileArtifact   (P4)
```

### 3.2 No alimenta MTE, Plan de Acción ni Plan Local de Salud

**VERIFICADO.** El compilador solo importa:
- Tipos de dominio (`LocalHealthProfile`, `MunicipalityWorkspace`, `NHSHealthProfileArtifact`)
- Los tres módulos metodológicos con referenceValues (`DUKE_EAS_MODULE`, `PREDIMED_EAS_MODULE`, `SF12_EAS_MODULE`)

No importa, no accede y no produce outputs para `MTE`, `ActionPlanEngine`, `AgendaEngine`, `MonitoringEngine`, `LT1Engine`, `OITEngine`, `ReconciliacionEngine` ni `LocalHealthPlanCompiler`.

### 3.3 No recomienda

**VERIFICADO.** El tipo `NHSHealthProfileArtifact` no tiene ningún campo de recomendaciones. El compilador no genera texto analítico. Restricción explícita en el encabezado del compilador: *"No genera texto interpretativo ni conclusiones."*

### 3.4 No prioriza

**VERIFICADO.** La Parte III solo registra si la participación ciudadana se realizó (`realizada: boolean`) y cuántas temáticas fueron identificadas (`tematicasCount: number`). No lista las temáticas identificadas. No establece jerarquía entre ellas. No asigna recursos ni urgencia a ninguna.

### 3.5 No interpreta técnicamente

**VERIFICADO.** El compilador no accede a los capítulos V, VI ni VII del `LocalHealthProfile` (`conclusiones`, `cierreInterpretativo`, `priorizacion`). El cálculo de posición relativa (above / below / similar) es puramente aritmético: diferencia relativa entre valor municipal y valor de referencia, con umbral ≤10 %. No hay inferencia estadística, no hay juicio de significancia, no hay texto generado.

### 3.6 Organiza por dominios causales, no por instrumentos

**VERIFICADO.** Los tres dominios (`bienestar`, `conductas`, `salud-percibida`) son entidades explícitas del tipo `NHSDomain`. El compilador asigna instrumentos a dominios:

| Dominio | Instrumentos |
|---|---|
| Bienestar y salud comunitaria | IBSE, DUKE-EAS |
| Conductas y estilos de vida | PREDIMED-EAS, Sueño-EAS, CAGE-EAS |
| Salud percibida | SF-12 PCS, SF-12 MCS |

El orden canónico bienestar → conductas → salud-percibida es invariante (P4-I7). Test explícito: *"dominios en orden canónico: bienestar → conductas → salud-percibida"*.

### 3.7 Usa exclusivamente los indicadores headline contractuales

**VERIFICADO.** El compilador extrae exactamente los campos definidos en §6 del contrato:

| Instrumento | Campo extraído | Campo excluido explícitamente |
|---|---|---|
| IBSE | `agg.meanTotal` | `meanFactorVinculo`, `meanFactorSituacion`, `meanFactorControl`, `meanFactorPersona` |
| DUKE-EAS | `agg.meanGlobal` | `meanConfidential`, `meanAffective`, `lowGlobalPercentage` |
| PREDIMED-EAS | `agg.meanScore` | distribución por categorías |
| Sueño-EAS | `agg.pctInsufficientSleep` | `pctNoRest` |
| CAGE-EAS | `agg.pctRisk` | distribución CAGE1–4 |
| SF-12 | `agg.meanPCS` + `agg.meanMCS` | (ambas siempre juntas, per contrato) |

### 3.8 Usa `referenceValues` institucionalmente limpios

**VERIFICADO.** Tras la resolución de P4-DEF-01, los tres módulos con referenceValues producen etiquetas institucionales correctas:

| Módulo | `population` | `source` |
|---|---|---|
| DUKE-EAS | `Adultos ≥16 años, Andalucía (EAS Granada)` | `Encuesta Andaluza de Salud (EAS), microdatos adulto Granada` |
| PREDIMED-EAS | `Adultos ≥16 años, Granada (EAS)` | `Encuesta Andaluza de Salud (EAS), microdatos adulto Granada` |
| SF-12 EAS | `Población general española (Vilagut et al. 2008)` | `Vilagut G et al. Med Clin (Barc). 2008;130(19):726-735.` |

La trazabilidad técnica (rutas de fixtures, scripts de regeneración) se preserva en `contextualNotes` de cada módulo, campo que no fluye al artefacto institucional.

### 3.9 Soporta datos parciales

**VERIFICADO.** Comportamiento certificado:

| Situación | Resultado |
|---|---|
| 0 estudios | Gate G-NHS-2 bloquea; resultado `{ ok: false, violations }` |
| 1 estudio (e.g. IBSE) | Artefacto mínimo: 1 dominio, 5 estudios ausentes en Alcance |
| 6 estudios | Artefacto completo: 3 dominios, 7 indicadores |
| Indicador sin referencia | `reference: null`, `position: null`; aparece en `indicatorsWithoutReference` de Alcance |
| n < 30 registros válidos | `smallSampleWarning: true` en la fila del indicador |
| < 3 indicadores con referencia | `fewComparatorsWarning: true` en portada y alcance |

### 3.10 Produce un artefacto inmutable, serializable y autocontenido

**VERIFICADO.** `isCongealed: true` es un tipo literal invariante. El artefacto es un grafo de objetos con solo tipos primitivos (string, number, boolean) y estructuras anidadas; es completamente serializable como JSON. Contiene todos los datos necesarios para su lectura sin acceso a la aplicación: indicadores, referencias, posiciones, alcance, participación, portada y trazabilidad.

Test explícito: *"PSL de origen no se modifica tras la compilación (P4-I4)"* y *"dos compilaciones del mismo PSL producen artefactos con IDs distintos"*.

### 3.11 Ningún campo institucional expone rutas, fixtures, scripts ni detalles internos

**VERIFICADO.** Artefacto de Atarfe (6 estudios) tras P4-DEF-01:

```
Adherencia a dieta mediterránea  7.6 pts (0–14)  Ref: 7.6 [Adultos ≥16 años, Granada (EAS)]
Apoyo social funcional          49.2 pts (0–55)  Ref: 49.2 [Adultos ≥16 años, Andalucía (EAS Granada)]
Salud física percibida          49.6 pts (0–100) Ref: 50.0 [Población general española (Vilagut et al. 2008)]
```

Ningún campo de los mostrados contiene `fixtures/`, `scripts/`, `.csv`, `.mjs` ni ningún detalle interno de implementación.

### 3.12 Los tests cubren el defecto P4-DEF-01 para impedir regresión

**VERIFICADO.** `tests/nhs-institutional-quality.test.ts` contiene 10 tests permanentes que fallarían si cualquier módulo con referenceValues volviera a introducir contenido técnico en los campos institucionales. Los tests operan en dos niveles: módulo metodológico y artefacto compilado.

---

## 4. Arquitectura del Producto 4

```
LocalHealthProfile (validated | approved)
    │
    ▼
NHSHealthProfileCompiler
    │  · Lee: ibseStudy, dukeStudy, predimedStudy, sf12Study, suenoStudy, cageStudy
    │  · Lee: workspace.thematicPrioritisation (solo count, no temas)
    │  · Lee: psl.complementaryStudyCount, validatedAt, validatedBy
    │  · Lee: DUKE_EAS_MODULE.referenceValues (mean 49,2)
    │  · Lee: PREDIMED_EAS_MODULE.referenceValues (mean 7,6)
    │  · Lee: SF12_EAS_MODULE.referenceValues (mean 50,0)
    │  · NO lee: conclusiones, cierreInterpretativo, priorizacion (caps. V-VII)
    │  · NO accede a: MIT, LT1, OIT, Reconciliación, MTE, ActionPlan, PLS
    │
    ▼
NHSHealthProfileArtifact (PSL-NHS)
    ├── portada: NHSPortada (municipio, año, estudios, validación, fewComparatorsWarning)
    ├── dominios: NHSDomain[] (bienestar | conductas | salud-percibida)
    │       └── indicators: NHSIndicatorRow[]
    │               └── (label, value, unit, reference, position, smallSampleWarning, validN)
    ├── participacionCiudadana: NHSParticipacion | null (realizada, tematicasCount)
    ├── alcance: NHSAlcance (disponibles, ausentes, sin referencia, cautela fija)
    └── trazabilidad: id, sourcePSLId, sourcePSLVersion, artifactVersion, compiledAt
    isCongealed: true
```

---

## 5. Deudas resueltas y residuales

### Deudas resueltas en esta certificación

| ID | Deuda original | Resolución |
|---|---|---|
| **D4-01** | Conectar `MethodologicalModule.ReferenceValues` de DUKE, PREDIMED y SF-12 al compilador | **CERRADA.** Compilador lee `DUKE_EAS_MODULE.interpretation.referenceValues`, `PREDIMED_EAS_MODULE.interpretation.referenceValues` y `SF12_EAS_MODULE.interpretation.referenceValues`. |
| **D4-03** | Crear `CONTRACT-NHS-HEALTH-PROFILE-COMPILER` | **SUPERADA.** La especificación del compilador quedó incorporada en `CONTRACT-NHS-HEALTH-PROFILE §10` (§10.1 entradas, §10.2 gates, §10.3 restricciones, §10.4 salida), que es suficientemente completo como contrato implícito. El compilador implementado respeta íntegramente esa especificación. |
| **P4-DEF-01** | Campo `population` de PREDIMED contenía notas técnicas de desarrollo | **RESUELTA.** Ver sección §3.8. Commit `dd04a98`. |

### Deudas residuales abiertas

| ID | Deuda | Tipo | Bloquea |
|---|---|---|---|
| **D4-02** | Valores de referencia metodológicamente validados para IBSE, Sueño-EAS y CAGE-EAS | Disponibilidad de datos metodológicos externos | No bloquea compilador; IBSE/Sueño/CAGE muestran "Sin referencia disponible" |
| **D4-04** | Formato de exportación PDF o HTML estático del artefacto | Implementación de rendering | No bloquea compilador ni dominio |
| **UI-P4** | Vista React del `NHSHealthProfileArtifact` | UI/Frontend | Bloquea visibilidad para usuario final |
| **HOME-P4** | Integración del Producto 4 en la Home semántica de COMPÁS NG | UI/Navegación | Bloquea acceso desde la interfaz |
| **NAV-P4** | Ruta canónica `contract-navigation §4` para el PSL-NHS | Navegación | Bloquea acceso desde la interfaz |

**No existen deudas arquitectónicas abiertas en el Producto 4.** El compilador implementa íntegramente lo especificado en el contrato. Las deudas residuales son de rendering, datos externos y UI.

---

## 6. Estado de implementación por componente

| Componente | Estado | Ubicación |
|---|---|---|
| `NHSHealthProfileArtifact` (tipo de dominio, 4 partes) | ✅ Implementado | `src/domain/nhs-health-profile/NHSHealthProfileArtifact.ts` |
| `NHSHealthProfileCompiler` + `compileNHSHealthProfile()` | ✅ Implementado | `src/application/nhs-health-profile-compiler/NHSHealthProfileCompiler.ts` |
| `validateNHSCompilationPreconditions()` (G-NHS-1, G-NHS-2) | ✅ Implementado | ídem |
| `NHSDomain` · `NHSIndicatorRow` · `NHSReference` | ✅ Implementados | `src/domain/nhs-health-profile/NHSHealthProfileArtifact.ts` |
| `NHSPortada` · `NHSParticipacion` · `NHSAlcance` | ✅ Implementados | ídem |
| Valores de referencia DUKE (49,2), PREDIMED (7,6), SF-12 (50,0) | ✅ Conectados y limpios | `src/domain/methodology/definitions/` |
| Calidad institucional `referenceValues.population` y `.source` | ✅ Verificada y testada | `tests/nhs-institutional-quality.test.ts` |
| Vista React del PSL-NHS | ❌ No implementada | — |
| Exportación PDF/HTML del PSL-NHS | ❌ No implementada | — |
| Integración en Home semántica | ❌ No implementada | — |

---

## 7. Evidencias objetivas de certificación

### TypeScript

```
npx tsc --project tsconfig.app.json --noEmit → 0 errores, 0 advertencias
```

### Tests

```
621/621 tests pasan — 18 ficheros de test
```

Tests directamente relacionados con el Producto 4:

| Fichero de test | Tests | Qué verifica |
|---|---|---|
| `tests/nhs-health-profile-compiler.test.ts` | 36 | Gates, compilación, dominios, comparadores, alcance, participación, invariantes |
| `tests/nhs-institutional-quality.test.ts` | 10 | Calidad institucional de NHSReference (módulo + artefacto), anti-regresión P4-DEF-01 |

Desglose de los 36 tests del compilador:

| Bloque | Tests | Qué cubre |
|---|---|---|
| `validateNHSCompilationPreconditions` | 5 | Gates G-NHS-1 (estado PSL) y G-NHS-2 (estudios mínimos) |
| Compilación correcta | 6 | ok:true/false, isCongealed, versioning v1/v2, trazabilidad |
| Dominios | 4 | Asignación instrumento→dominio, 6 estudios→3 dominios |
| Comparadores | 8 | Referencia null/not-null, posición similar/above/below, fewComparatorsWarning |
| Muestra pequeña | 2 | smallSampleWarning umbral n<30 |
| Alcance | 5 | Presencia obligatoria, texto cautela, estudios disponibles/ausentes, indicatorsWithoutReference |
| Participación ciudadana | 2 | null sin priorización, realizada con temas |
| Invariantes | 4 | Inmutabilidad PSL origen, IDs únicos por compilación, orden canónico dominios, union discriminada |

Desglose de los 10 tests de calidad institucional:

| Bloque | Tests | Qué cubre |
|---|---|---|
| Módulo: `referenceValues.population` | 6 | DUKE, PREDIMED, SF-12 × campo population + campo source |
| Artefacto: `NHSReference` compilado | 4 | DUKE, PREDIMED, SF-12, combinado — ninguno con contenido técnico |

### Ausencia de regresiones

Los 575 tests anteriores al Producto 4 continúan pasando sin modificación.
Los Productos 1, 2 y 3 no registran ninguna regresión.

### Artefacto generado (Atarfe, 6 estudios)

Verificado mediante `tests/generate-nhs-artifacts.mjs` ejecutado con datos reales de fixtures:

```
Municipio: Atarfe (Granada) · Año: 2026 · 6/6 estudios · isCongealed: true

BIENESTAR Y SALUD COMUNITARIA
  Bienestar socioemocional escolar  63,2 pts (0–100)  Sin referencia disponible
  Apoyo social funcional            49,2 pts (0–55)   Ref: 49,2 [Adultos ≥16 años, Andalucía (EAS Granada)] → Similar

CONDUCTAS Y ESTILOS DE VIDA
  Adherencia a dieta mediterránea    7,6 pts (0–14)   Ref: 7,6 [Adultos ≥16 años, Granada (EAS)] → Similar
  Sueño de duración insuficiente    32,8 %             Sin referencia disponible
  Consumo de riesgo de alcohol       0,6 %             Sin referencia disponible

SALUD PERCIBIDA
  Salud física percibida            49,6 pts (0–100)  Ref: 50,0 [Población general española (Vilagut et al. 2008)] → Similar
  Salud mental percibida            51,1 pts (0–100)  Ref: 50,0 [Población general española (Vilagut et al. 2008)] → Similar

ALCANCE: 6/6 estudios disponibles · 3 indicadores sin referencia comparativa
CAUTELA: "Este perfil presenta datos disponibles en el momento del diagnóstico..."
VERSIÓN: PSL-NHS/v1 · TRAZABILIDAD COMPLETA
```

Ningún campo `reference.population` ni `reference.source` contiene rutas, fixtures, scripts ni texto técnico de implementación.

---

## 8. Exclusiones expresas del Producto 4

Los siguientes elementos quedan fuera del alcance de esta certificación:

| Elemento | Motivo |
|---|---|
| Vista React / UI del PSL-NHS | No implementada — Sprint posterior |
| Exportación PDF/HTML del artefacto | D4-04: capa de rendering pendiente |
| Integración en Home semántica de COMPÁS NG | Pendiente de arquitectura UI |
| Valores de referencia IBSE, Sueño-EAS, CAGE-EAS | D4-02: datos metodológicos externos pendientes |
| Distribución del PSL-NHS a receptores institucionales externos | Canal de publicación no definido |
| Motor de Traducción Estratégica (Producto 5) | Producto independiente |
| Plan de Acción (Producto 6) | Producto independiente |
| Plan Local de Salud — compilador (Producto 7) | Producto independiente; PSL-NHS puede incorporarse opcionalmente como anexo |
| IA generativa sobre el PSL-NHS | Fuera del principio de no-sustitución del artefacto institucional |
| Análisis longitudinal | El sistema no tiene series temporales históricas |
| Desagregación por subgrupos (sexo, edad, nivel socioeconómico) | Los agregados actuales son municipales totales |

---

## 9. Dictamen de certificación

La auditoría directa del repositorio —incluyendo el dominio `NHSHealthProfileArtifact`, el compilador `NHSHealthProfileCompiler`, la calidad institucional de los campos `referenceValues` en los tres módulos metodológicos con referencia disponible, los tests específicos del Producto 4, la verificación del defecto P4-DEF-01 resuelto y el artefacto generado con datos reales de Atarfe— permite establecer el siguiente dictamen:

El `NHSHealthProfileArtifact` es un objeto de dominio completo que representa fielmente las cuatro partes del PSL-NHS: portada, indicadores por dominio causal, participación ciudadana y alcance del diagnóstico. El `NHSHealthProfileCompiler` produce este artefacto mediante dos gates bloqueantes y un aviso no bloqueante; es determinista, no modificante y formalmente correcto en TypeScript estricto. La organización por dominios causales es invariante. Los indicadores headline son exactamente los definidos en el contrato. Los valores de referencia están conectados a los módulos metodológicos y sus campos institucionales son etiquetas limpias sin contenido técnico de implementación. El comportamiento con datos parciales es correcto en todas las combinaciones (0 a 6 estudios). El artefacto es inmutable, serializable y autocontenido. Los tests cubren 46 casos específicos del Producto 4 más la protección permanente contra la regresión del defecto P4-DEF-01.

El compilador del Producto 4 no tiene deudas arquitectónicas abiertas. No tiene UI todavía: eso no afecta a esta certificación, que cubre dominio y compilador. Cuando la UI se implemente, deberá renderizar el `NHSHealthProfileArtifact` certificado hoy.

> **El compilador y el dominio del Producto 4 — Perfil de Salud Local tipo NHS quedan oficialmente certificados.**
> **La interfaz de usuario, la exportación y la integración en Home quedan pendientes de implementación posterior.**

---

## 10. Acta final

| Campo | Valor |
|---|---|
| Expediente | PRODUCT-4-NHS-HEALTH-PROFILE-CERTIFICATION |
| Fecha de emisión | 2026-06-30 |
| Repositorio | `C:\Users\blash\Desktop\COMPAS_NG` |
| Último commit certificado | `dd04a98` |
| Tests totales | 621/621 passing — 18 ficheros |
| Tests específicos Producto 4 | 46 (36 compilador + 10 calidad institucional) |
| Build | Limpio — sin errores TypeScript strict |
| Defectos resueltos | P4-DEF-01 (referenceValues.population con contenido técnico) |
| Deudas D4-01, D4-03 | Cerradas |
| Deudas D4-02, D4-04 | Abiertas — no arquitectónicas |
| Instrumentos con referencia | 3/6 (DUKE, PREDIMED, SF-12) |
| Instrumentos sin referencia | 3/6 (IBSE, Sueño, CAGE) — D4-02 |
| Interfaz de usuario | ❌ No implementada — certificación cubre dominio y compilador |
| Exportación DOCX/PDF | ❌ No implementada — D4-04 |
| Integración Home semántica | ❌ No implementada |
| **Compilador y dominio Producto 4** | **CERTIFICADOS** |
| Prerrequisitos de Producto 5 autorizados | Sí, cuando el equipo lo decida |

---

*El PSL-NHS es el primer documento que ve la corporación municipal. La arquitectura garantiza que lo que se compile esté libre de contenido técnico interno, sea trazable hasta el PSL de origen y refleje fielmente los datos del municipio sin interpretación automática.*
