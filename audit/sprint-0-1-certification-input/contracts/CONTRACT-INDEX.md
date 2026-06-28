# CONTRACT-INDEX — Índice maestro de contratos arquitectónicos

> COMPÁS NG — Referencia de arquitectura contractual
> Última actualización: Sprint 1 — 2026-06-27

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

## Infraestructura metodológica futura (Sprint 2+)

### CONTRACT-DYNAMIC-TRIPYRAMID
**Estado:** CONCEPTUAL

Define el modelo conceptual de la Tripirámide Dinámica de calidad muestral: Población → Muestra teórica → Muestra observada → Calidad → Interpretación. Establece SAM (Sistema de Auditoría Muestral) como metodología separada. Sin implementación en Sprint 1.

**Productores futuros:** SAM engine.
**Consumidores futuros:** EvidenceStore (átomos `kind: "sample-quality"`), paneles de estudios.
**Relacionado con:** CONTRACT-EVIDENCE-QUALITY, CONTRACT-EVIDENCE.

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
CONTRACT-ACTION-PLAN → CONTRACT-COMPILER
    ↓
CONTRACT-STRATEGIC-TRANSLATION → CONTRACT-STRATEGIC-REPOSITORY
                                 CONTRACT-DYNAMIC-TRIPYRAMID
```

---

## Reglas de mantenimiento

1. Cualquier nuevo contrato debe registrarse aquí antes de que otro contrato lo referencie.
2. Un contrato no puede pasar de `CONCEPTUAL` a `VIGENTE` sin una revisión arquitectónica explícita.
3. Los contratos `VIGENTE` no se modifican sin revisión deliberada y registro de la versión.
4. Las referencias cruzadas entre contratos deben ser simétricas: si A referencia B, B debe mencionar A en "Relacionado con".
5. Los productores y consumidores deben actualizarse cuando cambie la implementación.

---

*Este índice es el punto de entrada obligatorio antes de crear o modificar cualquier contrato en COMPÁS NG.*
