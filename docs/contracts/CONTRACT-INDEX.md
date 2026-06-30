# CONTRACT-INDEX — Índice maestro de contratos arquitectónicos

> COMPÁS NG — Referencia de arquitectura contractual
> Última actualización: Sprint 2 recertificación — 2026-06-29

Este documento es la puerta de entrada a la arquitectura contractual de COMPÁS NG.
No duplica contenido de los contratos. Cada entrada contiene: propósito, alcance, estado y relaciones.

---

## Cómo usar este índice

Los contratos se ordenan por **nivel arquitectónico**, de infraestructura base a motores superiores.

**Estados posibles:**
- `VIGENTE` — Implementado y en producción. Modificar solo con revisión explícita.
- `CONCEPTUAL` — Diseñado pero sin implementación activa. Define el qué, no el cómo.
- `FUTURO` — Investiga o reserva una línea para sprints posteriores.

---

## Nivel 1 — Repositorio y persistencia

### CONTRACT-REPOSITORY
**Estado:** VIGENTE

Contrato del Repositorio Documental Municipal (`MunicipalDocumentRepository`). Define los 11 tipos de documento (`DocumentKind`), el ciclo de vida de un documento y la regla de trazabilidad: todo átomo de evidencia debe poder rastrear su documento de origen.

**Productores:** UI (carga de documentos por el equipo técnico).
**Consumidores:** EvidenceStore, MIT.
**Relacionado con:** CONTRACT-EVIDENCE, CONTRACT-PERSISTENCE.

---

### CONTRACT-PERSISTENCE
**Estado:** VIGENTE

Contrato de persistencia y rehidratación del workspace municipal en localStorage. Define el esquema de serialización (versión 1.0.0), las reglas de migración inline y las garantías de consistencia al recargar.

**Productores:** `LocalStorageWorkspacePersistence`.
**Consumidores:** UI (rehidratación al arrancar).
**Relacionado con:** CONTRACT-REPOSITORY.

---

## Nivel 1 tardío — Evidencia estructurada

### CONTRACT-EVIDENCE
**Estado:** VIGENTE

Contrato de `EvidenceAtom`, `EvidenceStore` y `EvidenceStoreIntegrityGuard`. Define los tipos de átomo (`EvidenceAtomKind`), los niveles de confianza, la clave estable de deduplicación, y las 5 reglas de integridad (A–E) que el Guard aplica antes de exponer el store al MIT.

**Productores:** Parsers de estudios complementarios, motor de extracción del Informe de Salud.
**Consumidores:** MIT, PSL.
**Relacionado con:** CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-EVIDENCE-QUALITY, CONTRACT-MIT-PSL.

---

### CONTRACT-COMPLEMENTARY-STUDIES
**Estado:** VIGENTE

Contrato de los estudios complementarios como pipeline. Define el flujo canónico (CSV → Parser → Study → EvidenceAtoms → EvidenceStore), los 6 instrumentos admitidos, los invariantes de aislamiento municipal y la regla de no almacenamiento de registros individuales.

**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
**Consumidores:** EvidenceStore, CONTRACT-SCALE-PANELS (gramática visual).
**Relacionado con:** CONTRACT-SCALE-PANELS, CONTRACT-EVIDENCE.

---

### CONTRACT-SCALE-PANELS
**Estado:** VIGENTE

Gramática editorial de los paneles de estudios complementarios. Distingue tres categorías: bloques obligatorios en UI (metadatos, barras, referencias, recordatorio), bloques condicionales (interpretación asistida, cautelas) y bloques de referencia de sistema (identidad, integraciones). Define también para qué instrumentos aplica la interpretación asistida (solo IBSE entre los actuales).

**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
**Consumidores:** Equipo técnico (UI).
**Relacionado con:** CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-EVIDENCE-QUALITY.

---

### CONTRACT-EVIDENCE-QUALITY
**Estado:** VIGENTE

Define las cuatro dimensiones de calidad de la evidencia: documental, muestral, metodológica e inferencial. Establece cómo se mapean a `confidence: "high" | "medium" | "low"` en EvidenceAtom y justifica mantener `kind: "sample-quality"` sin evolucionar a `EvidenceQualityAssessment` en Sprint 1.

**Productores:** Parsers de estudios (calculan confianza), CONTRACT-DYNAMIC-TRIPYRAMID (calidad muestral futura).
**Consumidores:** MIT (priorización por confianza), PSL (validación de capítulos).
**Relacionado con:** CONTRACT-EVIDENCE, CONTRACT-DYNAMIC-TRIPYRAMID.

---

## Nivel 2 — Interpretación territorial

### CONTRACT-INTERPRETATION
**Estado:** VIGENTE

Contrato de qué significa "interpretar" dentro de COMPÁS NG. Define los límites epistemológicos del sistema: qué constituye una interpretación válida, qué nunca lo constituye, y la distinción entre interpretación asistida y decisión territorial.

**Productores:** No tiene productor de código directo (es un contrato normativo).
**Consumidores:** MIT, PSL, equipo técnico como referencia.
**Relacionado con:** CONTRACT-MIT-PSL.

---

### CONTRACT-MIT-PSL
**Estado:** VIGENTE

Contrato del Motor de Interpretación Territorial (MIT) y del Perfil de Salud Local (PSL). Define LT1, OIT, Reconciliación Interpretativa, los 7 capítulos del PSL, los 6 estados del PSL y la regla PSL-C1 (el Nivel 3 solo consume PSL, nunca EvidenceStore directamente).

**Productores:** `TerritorialInterpretationEngine`, `buildLocalHealthProfile`.
**Consumidores:** Priorización temática, Motor de Traducción Estratégica, Plan de Acción.
**Relacionado con:** CONTRACT-EVIDENCE, CONTRACT-ACTION-PLAN, CONTRACT-STRATEGIC-TRANSLATION.

---

## Producto 3 — Perfil de Salud Local COMPÁS (PSL-C)

### CONTRACT-PSL-COMPAS
**Estado:** VIGENTE

Contrato canónico del Producto 3. Define el PSL-C como producto analítico territorial en el catálogo de COMPÁS NG: naturaleza, fuentes consumibles (incluyendo Productos 1 y 2), separación arquitectónica estricta, estructura canónica de 7 capítulos, relación con SAM y Estudios Complementarios, y deuda registrada (D3-01 a D3-04).

**Productores:** `buildLocalHealthProfile` + `LocalHealthProfileCompiler`.
**Consumidores:** Equipo técnico (diagnóstico), Nivel 3 (vía PSL-C1), compiladores superiores.
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER, CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-DYNAMIC-TRIPYRAMID.

---

## Producto 4 — Perfil de Salud Local tipo NHS (PSL-NHS)

### CONTRACT-NHS-HEALTH-PROFILE
**Estado:** CONCEPTUAL

Contrato canónico del Producto 4. Define el PSL-NHS como producto institucional distinto del PSL-C: naturaleza comparativa/sintética, relación con Producto 3 (comparten fuente pero no se sustituyen), fuentes (estudios complementarios + datos de referencia Granada/Andalucía), salida esperada, gates mínimos del compilador y exclusiones explícitas (no recomendaciones, no MTE, no Plan de Acción, no IA generativa, no sustitución del PSL-C). Prerrequisito de implementación: datos de referencia para ≥3 instrumentos.

**Productores futuros:** `NHSHealthProfileCompiler` (pendiente de implementar; contrato del compilador pendiente: `CONTRACT-NHS-HEALTH-PROFILE-COMPILER`).
**Consumidores futuros:** Equipo técnico, corporación municipal, ciudadanía.
**Relacionado con:** CONTRACT-PSL-COMPAS, CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER, CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-DYNAMIC-TRIPYRAMID.

---

## Nivel 2 tardío — Compiladores de diagnóstico

### CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER
**Estado:** VIGENTE

Contrato del compilador del Perfil de Salud Local COMPÁS (PSL-C). Define la distinción entre `LocalHealthProfile` (objeto vivo) y `LocalHealthProfileArtifact` (documento institucional exportable e inmutable). Establece los 7 gates de compilación (G-LHC-1 a G-LHC-7), la estructura de secciones del PSL-C, los invariantes de trazabilidad (`sourcePSLId`, `sourceHash`, `evidenceAtomIds`), las reglas de congelación y el modelo de persistencia acumulativa en `workspace.compiledProfiles`.

**Productores:** `LocalHealthProfileCompiler` (`src/application/health-profile-compiler/`).
**Consumidores:** Equipo técnico (exportación del diagnóstico), `LocalHealthPlanCompiler` (futuro: el PSL-C es el capítulo diagnóstico del PLS).
**Tipos:** `src/domain/health-profile-artifact/LocalHealthProfileArtifact.ts`.
**Tests:** `tests/local-health-profile-compiler.test.ts` (43 tests).
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT (pendiente).

---

## Nivel de compilación — Documentos institucionales exportables

### CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT
**Estado:** VIGENTE

Contrato del Plan Local de Salud (PLS) como documento institucional definitivo. Define naturaleza, estructura, entradas, gates, contenido humano obligatorio, congelación y versionado. Complementado por CONTRACT-LOCAL-HEALTH-PLAN-COMPILER, que define cómo se produce el PLS. Define la naturaleza del PLS (compromiso explícito y verificable), la distinción entre PLS, PSL-C, ActionPlanDraft, AgendaDraft y MonitoringDraft, la estructura canónica de 15 secciones (RE + I a XII + AN), los 10 gates de compilación (G-PLS-1 a G-PLS-10), el contenido humano obligatorio (validación política, responsables, plazos, recursos, necesidades no priorizadas), las reglas de congelación y versionado, y los 9 invariantes (I-PLS-1 a I-PLS-9).

**Productores:** `LocalHealthPlanCompiler` (tipos de dominio en Sprint 2.3; implementación pendiente).
**Consumidores:** Equipo técnico, corporación municipal, Distrito Sanitario, Junta de Andalucía.
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER, CONTRACT-ACTION-PLAN, CONTRACT-COMPILER (reserva histórica), CONTRACT-LOCAL-HEALTH-PLAN-COMPILER.

---

### CONTRACT-LOCAL-HEALTH-PLAN-COMPILER
**Estado:** VIGENTE

Contrato del `LocalHealthPlanCompiler`. Define cómo se produce el `LocalHealthPlanDocument`: 10 gates de compilación (G-PLS-1 a G-PLS-10), la integración del PSL-C por referencia (Opción A), la distinción entre ActionPlanDraft y el capítulo VII del PLS compilado, el `CompilationManifest` embarcado, las reglas de articulación institucional provisional vs canónica, el versionado y la persistencia. También define la arquitectura de exportación Compilador → Renderer → Exporter (separación de responsabilidades).

**Productores:** `LocalHealthPlanCompiler` (pendiente de implementar; tipos de dominio en Sprint 2.3).
**Consumidores:** Equipo técnico, UI (exportación futura DOCX/PDF/HTML).
**Tipos:** `src/domain/health-plan/LocalHealthPlanDocument.ts`, `src/domain/compilation/CompilationManifest.ts`.
**Relacionado con:** CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT, CONTRACT-MIT-PSL, CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER, CONTRACT-ACTION-PLAN, CONTRACT-COMPILER (reserva histórica), CONTRACT-INSTITUTIONAL-LIFECYCLE.
**Prerequisitos satisfechos (Sprint 2):** actor model `approved` implementado (CONTRACT-INSTITUTIONAL-LIFECYCLE); validación formal del Nivel 3 implementada (`FormalValidationRecord`, `createFormalValidation.ts`).
**Prerequisitos pendientes:** `UnaddressedNeed[]` en `ActionPlanDraft` (G-PLS-7); `PLSEvaluationFramework` (G-PLS-10). Ver §16 de este contrato.

---

## Modelo de ciclo de vida institucional

### CONTRACT-INSTITUTIONAL-LIFECYCLE
**Estado:** VIGENTE

Contrato del modelo canónico de ciclos de vida institucional de los objetos de COMPÁS NG. Define los tres tipos de objeto por ciclo de vida (efímero, vivo con estados, artefacto institucional), el ciclo completo del PSL (6 estados, transiciones, irreversibilidad), la validación formal de objetos efímeros del Nivel 3 (`FormalValidationRecord`), la aprobación institucional del PSL (`PSLApprovalRecord`) y el actor model completo (5 roles con tabla de permisos por transición).

**Productores:** `src/application/institutional-lifecycle/approvePSL.ts`, `createFormalValidation.ts`.
**Consumidores:** `handleApprovePSL` y `handleFormalValidation` en `src/App.tsx`; paneles `PSLApproveAction` y `FormalValidationForm`; `LocalHealthPlanCompiler` (futuro: gates G-PLS-1, G-PLS-5, G-PLS-6).
**Relacionado con:** CONTRACT-MIT-PSL (PSL y sus 6 estados), CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER (gate G-LHC-1), CONTRACT-LOCAL-HEALTH-PLAN-COMPILER (gates G-PLS-1, G-PLS-5, G-PLS-6), CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT (aprobación institucional del PLS).

---

## Nivel 3 — Planificación y acción

### CONTRACT-ACTION-PLAN
**Estado:** VIGENTE

Contrato del bloque de Nivel 3: Priorización temática, Motor de Traducción Estratégica (versión inicial), Plan de Acción, Agenda y Seguimiento. Define que ningún motor del Nivel 3 puede producir documentos definitivos sin validación humana explícita.

**Productores:** `ThematicPrioritisation`, Plan de Acción.
**Consumidores:** Compiler (futuro).
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-COMPILER, CONTRACT-STRATEGIC-TRANSLATION.

---

### CONTRACT-COMPILER
**Estado:** VIGENTE (declarado, sin implementación activa)

Contrato del Compilador del Plan Local de Salud. Define los gates obligatorios (`G-C1`: PSL en estado `"approved"`) y la posición como último stage del pipeline. El compiler no implementado bloquea el estado `"approved"` del PSL.

**Productores:** Sin implementación activa.
**Consumidores:** Equipo técnico (exportación documental futura).
**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-ACTION-PLAN.

---

## Infraestructura metodológica

### CONTRACT-DYNAMIC-TRIPYRAMID
**Estado:** VIGENTE

Define el Sistema de Ajuste Muestral (SAM) como capacidad metodológica transversal: `PopulationReference`, `SampleQualityAssessment`, Cochran+FPC como algoritmo por defecto, clasificación high/medium/low. Motor puro implementado y certificado (Producto 2, 2026-06-29). Integración con los 6 instrumentos complementarios implementada. Tripirámide visual, EvidenceAtoms desde SAM y estratificación pendientes.

**Productores:** `computeSampleQualityAssessment()` (motor puro); `assess*Study()` (capa de integración por instrumento).
**Consumidores:** equipo técnico (dictamen metodológico). EvidenceStore (futuro: átomos `kind: "sample-quality"`), paneles de estudios (futuro: Tripirámide visual).
**Relacionado con:** CONTRACT-EVIDENCE-QUALITY, CONTRACT-EVIDENCE, CONTRACT-COMPLEMENTARY-STUDIES.

---

### CONTRACT-STRATEGIC-REPOSITORY
**Estado:** CONCEPTUAL

Define el Repositorio Estratégico Territorial: recursos normativos supramunicipales con denominaciones canónicas fijadas (ESCA = Estrategia de Salud Comunitaria de Andalucía 2026–2030; RELAS = Red Local de Acción en Salud; RELAS-G, EBE, PSMA, PEM, EPVSA). Establece la diferencia respecto al MunicipalDocumentRepository. Sin implementación en Sprint 1.

**Productores futuros:** Carga manual por el equipo técnico.
**Consumidores futuros:** Motor de Traducción Estratégica.
**Relacionado con:** CONTRACT-STRATEGIC-TRANSLATION, CONTRACT-REPOSITORY.

---

### CONTRACT-STRATEGIC-TRANSLATION
**Estado:** CONCEPTUAL

Define el Motor de Traducción Estratégica (MTE): flujo PSL validado → Priorizaciones → Repositorio Estratégico → Borrador Plan de Acción. Establece 6 restricciones explícitas de no-sustitución y el invariante de trazabilidad completa. `StrategicDerivationTrace` pendiente de especificación en el sprint de implementación.

**Productores futuros:** MTE engine.
**Consumidores futuros:** Plan de Acción, Compiler.
**Relacionado con:** CONTRACT-STRATEGIC-REPOSITORY, CONTRACT-MIT-PSL, CONTRACT-ACTION-PLAN.

---

### CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE
**Estado:** FUTURO

Investiga la posibilidad de construir hipótesis estructurales sobre determinantes territoriales de salud. No autoriza implementación hasta Gate 1. Preserva la línea de investigación para fundamentar futuras capacidades interpretativas.

**Productores futuros:** Investigación metodológica pendiente.
**Consumidores futuros:** MIT (extensión futura).
**Relacionado con:** CONTRACT-INTERPRETATION, CONTRACT-MIT-PSL.

---

## Identidad semántica e interfaz

### CONTRACT-NAVIGATION
**Estado:** VIGENTE

Contrato de navegación e identidad semántica de la interfaz de COMPÁS NG. Cubre el hueco entre el VISUAL-CONTRACT (identidad visual) y INSTITUTIONAL-PRODUCTS-ARCHITECTURE (catálogo de productos): define qué vocabulario es visible para el usuario y cuál permanece interno, qué representa cada espacio de trabajo, qué es la Home, y los principios para representar el ciclo institucional. Governa toda la interfaz durante la evolución futura del sistema.

**Productores:** Equipo responsable de la interfaz (governa la UI, no un componente de código).
**Consumidores:** Todo el código React (`src/App.tsx`, `src/ui/components/`), cualquier nueva vista o componente.
**Relacionado con:** `VISUAL-CONTRACT`, `INSTITUTIONAL-PRODUCTS-ARCHITECTURE`, `FOUNDATIONS §2`, `OPERATING-CONSTITUTION` Bloque F, `CONTRACT-PSL-COMPAS`, `CONTRACT-NHS-HEALTH-PROFILE`, `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT`.

---

## Gobernanza de sesiones de trabajo

### CONTRACT-PMO
**Estado:** VIGENTE

Contrato del Prompt Maestro Operativo (PMO). Define la naturaleza, finalidad, contenido
mínimo obligatorio, política de modelos (5 niveles de capacidad: BAJO, MEDIO, ALTO, MAX,
PENSAMIENTO), protocolo de invocación mediante la palabra `PMO`, invariantes, riesgos que
evita y antipatrones. Convierte la inicialización de cualquier sesión de trabajo con un
asistente de IA en un acto trazable, reproducible y coherente con el sistema de gobierno
del proyecto. Instrumento agnóstico de proveedor y de modelo.

**Productores:** El responsable del proyecto (redacta los PMOs concretos que siguen este contrato).
**Consumidores:** Cualquier asistente de IA que trabaje sobre COMPÁS NG; el responsable del proyecto.
**Relacionado con:** `OPERATING-CONSTITUTION.md §7`, `CONTRACT-INTERPRETATION.md §5`, `ARCHITECTURAL-GAP-REGISTER.md`.

---

## Mapa de dependencias

```
CONTRACT-REPOSITORY
    ↓
CONTRACT-PERSISTENCE
CONTRACT-EVIDENCE
    ↓
CONTRACT-COMPLEMENTARY-STUDIES → CONTRACT-SCALE-PANELS
                                 CONTRACT-EVIDENCE-QUALITY
    ↓
CONTRACT-INTERPRETATION
CONTRACT-MIT-PSL
    ↓
CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER → LocalHealthProfileArtifact (PSL-C)
    ↓
CONTRACT-ACTION-PLAN → CONTRACT-COMPILER (reserva histórica)
    ↓
CONTRACT-STRATEGIC-TRANSLATION → CONTRACT-STRATEGIC-REPOSITORY
                                 CONTRACT-DYNAMIC-TRIPYRAMID
    ↓
CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT
    ↓
CONTRACT-LOCAL-HEALTH-PLAN-COMPILER
    ↓
LocalHealthPlanDocument (PLS)
```

---

## Reglas de mantenimiento

1. Cualquier nuevo contrato debe registrarse aquí antes de que otro contrato lo referencie.
2. Un contrato no puede pasar de `CONCEPTUAL` a `VIGENTE` sin una revisión arquitectónica explícita.
3. Los contratos `VIGENTE` no se modifican sin revisión deliberada y registro de la versión.
4. Las referencias cruzadas entre contratos deben ser simétricas: si A referencia B, B debe mencionar A en "Relacionado con".
5. Los productores y consumidores deben actualizarse cuando cambie la implementación.

---

---

## Expedientes de certificación

| Expediente | Fecha | Estado |
|---|---|---|
| `docs/certification/CERTIFICATION-SPRINT-0-1.md` | 2026-06-28 | Sprints 0–1: pipeline E2E, 309 tests |
| `docs/certification/PRODUCT-1-CERTIFICATION.md` | 2026-06-29 | Producto 1 — Sistema de Estudios Complementarios: 6 instrumentos, 481 tests |
| `docs/certification/PRODUCT-2-SAM-CERTIFICATION.md` | 2026-06-30 | Producto 2 — SAM NG: motor + integración + samAssessmentToEvidenceAtom, 573 tests |
| `docs/certification/PRODUCT-3-PSL-CERTIFICATION.md` | 2026-06-30 | Producto 3 — PSL-C: 7 capítulos, compiler 7 gates, integración SAM+P1, 573 tests |

El plano arquitectónico completo que responde a la pregunta
"¿qué debe existir para producir un Perfil de Salud Local, un Plan Local de Salud y una
Encuesta Municipal?" está en `docs/architecture/BLUEPRINT-PRODUCTION.md`.
Los contratos pendientes de crear quedan listados en §VIII.3 de ese documento.

---

*Este índice es el punto de entrada obligatorio antes de crear o modificar cualquier contrato en COMPÁS NG.*
