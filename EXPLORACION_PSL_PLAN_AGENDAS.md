# COMPÁS NG — Exploración Exhaustiva del Pipeline PSL → Plan de Acción → Agendas

**Fecha de exploración:** 2026-07-10  
**Objetivo:** Mapeo completo de la estructura de generación del PSL, su transformación estratégica y la generación de planes de acción y agendas.

---

## ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Pipeline Completo](#arquitectura-del-pipeline-completo)
3. [Componentes Principales](#componentes-principales)
4. [Qué Existe: Líneas Estratégicas, Objetivos, Indicadores](#qué-existe)
5. [Gaps Arquitectónicos Identificados](#gaps-arquitectónicos)
6. [Recomendaciones](#recomendaciones)

---

## RESUMEN EJECUTIVO

### Estado Actual

COMPÁS NG implementa un pipeline robusto de **Nivel 2** (generación del PSL) y un pipeline **Nivel 3** (transformación estratégica) parcialmente implementado:

```
EvidenceStore (atomizado) 
  ↓
MIT (Motor Interpretación Territorial) → LT1 (Estado Territorial Evolutivo)
  ↓
ReconciliacionInterpretativa → OIT (Oportunidades de Intervención)
  ↓
LocalHealthProfile (PSL) — objeto vivo del sistema ✅
  ↓
PrioritizationEngine → CandidatePriorities ✅
  ↓
EPVSATranslator → StrategicLineSuggestions (LE1, LE2, LE3, LE4) ✅
  ↓
ActionPlanEngine → ActionPlanDraft ✅
  ↓
AgendaEngine → AgendaDraft ✅
  ↓
LocalHealthPlanCompiler (⏳ Pendiente)
```

**Nivel de Madurez:**
- **Nivel 2 (PSL):** ✅ Certificado (Sprint 1, con condiciones)
- **Nivel 3 (Estrategia, Plan, Agenda):** ⚠️ Funcional pero incompleto
  - Priorización: implementada ✅
  - Traducción EPVSA: provisional (EPVSATranslator, no MTE canónico) ⚠️
  - Plan de Acción: borrador funcional ✅
  - Agenda: borrador funcional ✅
  - Compilación PLS: **PENDIENTE** 🔴

### Invariante Crítico: PSL-C1

**Ningún componente del Nivel 3 accede directamente a LT1, OIT o ReconciliacionInterpretativa.**

El PSL es el único puente autorizado entre Nivel 2 y Nivel 3. Esta restricción garantiza:
- Trazabilidad: toda acción puede rastrearse hasta EvidenceAtom
- Validación: el PSL actúa como gate de calidad
- Reproducibilidad: el comportamiento es determinista

---

## ARQUITECTURA DEL PIPELINE COMPLETO

### 1. **Nivel 0: Ingesta de Evidencia**

```typescript
// Entradas múltiples, cada una atomizada
HealthReport (DOCX/PDF) 
  → HealthReportDocument
  → NO genera EvidenceAtom (resuelto H-15 2026-07-07)

ComplementaryStudies (CSV)
  → EvidenceAtom[] {
      kind: "indicator" | "determinant" | "asset" | 
            "qualitative-observation" | "methodological-caution" | etc
      provenance: { origin: "ibse" | "duke" | "predimed" | "sf12" | ... }
    }

ThematicPrioritization (REDCap) 
  → EvidenceAtom[] { kind: "participation", provenance: { origin: "prioritization" } }

TerritorialDocumentation 
  → EvidenceAtom[] { kind: "determinant" | "asset" }

CommunityAssets (Localiza Salud, manual)
  → EvidenceAtom[] { kind: "asset", provenance: { origin: "localiza-salud" } }
```

**Validación:** `EvidenceStoreIntegrityGuard` — detecta conflictos, inconsistencias, sesgos metodológicos sin resolver.

### 2. **Nivel 1: Interpretación Territorial (MIT)**

Entrada: `EvidenceStore` (saneado)  
Salida: `DimensionDiagnostica (LT1Result)`

**LT1 agrupa la evidencia en 6 categorías:**

```typescript
LT1Result {
  determinants[]        // factores que condicionan la salud
  assets[]              // recursos comunitarios y capacidades salutogénicas
  indicators[]          // datos poblacionales
  qualitativeFindings[] // experiencia ciudadana y conocimiento situado
  methodologicalCautions[] // límites, sesgos, necesidades de validación
  preliminaryOpportunities[] // síntesis de cruces entre determinantes y activos
}
```

**Salida narrativa:** `territoritalSummary` — lectura interpretativa inicial (sin recomendaciones).

**Motor OIT (Oportunidades de Intervención Territorial)**

Consume LT1 y genera candidaturas:

```typescript
OITResult {
  opportunities[] {
    id, title, rationale, relatedEvidenceIds, cautions, isAnalyticalGap
  }
  sourceSummary // recap de LT1
}
```

Tipos de oportunidades detectadas por OIT:
1. **Conectar determinantes + activos** → intervenciones salutogénicas
2. **Contrastar participación + indicadores** → triangulación
3. **Revisar cautelas metodológicas** → gaps analíticos
4. **Expandir base de evidencia** → cuando la evidencia es insuficiente

### 3. **Nivel 2: Perfil de Salud Local (PSL)**

**Responsable:** `buildLocalHealthProfile()` en `src/application/health-profile/`

**Entrada:** `BuildLocalHealthProfileInput` {
- `sanitizedStore` (EvidenceStore validado)
- `integrityResult` (ConflictReport)
- `mit` (DimensionDiagnostica)
- `reconciliacion` (ResolucionConflictos)
- `oitParaDecision` (OITResult)
- `workspace` (MunicipalityWorkspace)
}

**Salida:** `LocalHealthProfile` (objeto vivo del sistema) {

**Estructura interna (6 bloques):**

```typescript
LocalHealthProfile {
  // ① IDENTIDAD
  id, municipalityId, status, version, evidenceStoreVersion
  
  // ② MARCO ESTRATÉGICO
  strategicFrameworkSectionIds[] // IDs de RELAS, ESCA, EPVSA aplicables
  
  // ③ INFORME DE SALUD
  healthReportDocumentId (referencia, NO contenido)
  healthReportSectionCount, healthReportAtomCount
  
  // ④ DIAGNÓSTICO INTEGRADO
  totalEvidenceAtoms, integrityErrors, integrityWarnings
  atomsByOrigin {}, atomsByKind {}
  evidenceAtomIds[] // trazabilidad completa
  originsSummary[] // ["ibse", "duke", "predimed", ...]
  [ibsePresent, dukePresent, ...] // flags por instrumento
  thematicPrioritisationPresent
  
  // ⑤ INTERPRETACIÓN TERRITORIAL (Núcleo del diagnóstico)
  territorialSummary // narración LT1
  determinantCount, assetCount, indicatorCount
  qualitativeFindingCount, methodologicalCautionCount
  preliminaryOpportunities[]
  longitudinalActive, longitudinalEvidenceCount
  marcosAplicados[] // qué marcos de referencia se usaron
  tensionesEstructurales[] // contradicciones en la lectura
  
  // CONFLICTOS Y TENSIONES
  conflictos[] { id, tipo, descripcion, fuentesImplicadas, resolucion }
    // tipos: "tendencia", "fuente", "escala", "temporal", "interpretativo"
  tensionesEscaladas[]
  tensionesNoEscaladas[]
  ruidoEstructural[]
  
  // ÁREAS DE INTERVENCIÓN (candidaturas para priorización)
  areasDeIntervencion[] {
    id, title, rationale, relatedEvidenceIds, cautions, isAnalyticalGap
  }
  
  // ⑥ DOCUMENTO DEL PERFIL: seis capítulos narrativos (scaffold)
  conclusiones: PSLScaffoldChapter {
    content // texto generado + interpretación técnica
    status: "scaffold" | "review" | "authored"
  }
  
  // ⑦ CIERRE INTERPRETATIVO
  cierreInterpretativo: PSLScaffoldChapter {
    content // síntesis metodológica, no prescriptiva
    status
  }
  
  // ⑧ PRIORIZACIÓN (preparación deliberativa)
  priorizacion {
    candidaturasTecnicas[] // generadas por el sistema
    tematicasSeleccionadasIds[] // del proceso participativo (REDCap)
    deliberacionNota: string
    consensoDocumentado: boolean
  }
  priorizacionStatus: "scaffold" | "partial" | "complete"
  
  // ⑨ CICLO DE VIDA
  status: "generated" | "review" | "validated" | "approved" | "superseded" | "archived"
  generatedAt, reviewStartedAt, validatedAt, validatedBy
  approvedAt, approvedBy, supersededById, archivedAt
  
  requiresHumanValidation: true
}
```

**Espacio de trabajo del Técnico: PerfilLocalDeSalud (PerfilInterpretativo)**

Paralelo al PSL, existe un objeto mutable para la enriquecimiento técnico:

```typescript
PerfilLocalDeSalud {
  id, municipalityId
  interpretaciones[] {  // autoría técnica sobre significado/causas
    id, enunciado, certeza, status, evidenciaIds, autorNombre
  }
  hipotesis[] {  // afirmaciones por validar
    id, enunciado, plausibilidad, status, espacio, formuladaEn, autorNombre
  }
  preguntasAbiertas[] {  // incertidumbres pendientes
    id, formulacion, urgencia, status, autorNombre
  }
  sintesisTexto? // síntesis narrativa (máx 3000 caracteres)
  createdAt, updatedAt
}
```

Este perfil es opcional (workspaces previos no lo tienen). Cuando existe, sus contenidos se incorporan al PSL mediante `populatePSLFromPerfil()`.

**Persistencia:** El PSL es un `LocalHealthProfileArtifact` compilado posteriormente (ver sección 2.4 abajo).

### 2.4 **Compilación: LocalHealthProfile → LocalHealthProfileArtifact (PSL-C)**

**Responsable:** `compileLocalHealthProfile()` en `src/application/health-profile-compiler/`

**Precondiciones (gates de validación):**
- `psl.status === "validated"` ✅
- `psl.conclusiones.status === "authored"` ✅
- `psl.cierreInterpretativo.status === "authored"` ✅
- `psl.priorizacionStatus === "complete"` ✅
- `psl.priorizacion.consensoDocumentado === true` ✅
- Ningún campo narrativo vacío ✅

**Salida:** `LocalHealthProfileArtifact` (PSL-C) — documento inmutable, congelado en el tiempo {

```typescript
LocalHealthProfileArtifact {
  // Portada
  portada {
    municipalityName, municipalityProvince, compiledAt, artifactVersion
  }
  
  // Identificación
  identificacionMunicipal {
    municipalityId, name, province, pslGeneratedAt, pslValidatedAt, pslValidatedBy
  }
  
  // Marco Estratégico
  marcoEstrategico {
    sectionIds[] // referencias al StrategicFramework, no contenido
  }
  
  // Informe de Salud (referencia ligera)
  informeSalud {
    documentId, title, sectionCount, atomCount
  }
  
  // Base Documental (metadatos)
  baseDocumental {
    totalAtoms, errorCount, warningCount, atomsByOrigin, atomsByKind
  }
  
  // Área de Intervención (candidaturas compiladas)
  areasDeIntervencion[] {
    id, title, rationale, evidenceIds, cautions
  }
  
  // Lectura Territorial (narrativa del diagnóstico)
  lecturaTerritorial {
    summary, determinantCount, assetCount, indicatorCount, ...
  }
  
  // Conclusiones (seis capítulos)
  conclusiones {
    content (authored), status: "authored"
  }
  
  // Cierre Interpretativo
  cierreInterpretativo {
    content (authored), status: "authored"
  }
  
  // Candidaturas para Priorización
  candidatura {
    candidaturasTecnicas[] { id, title, rationale, evidenceIds }
    tematicasSeleccionadas[] { id, label }
    deliberacionDocumentada: boolean
  }
  
  // EKC Snapshot (si hay PerfilLocalDeSalud adjunto)
  ekcSnapshot? {
    interpretacionesActivas, hipotesisActivas, preguntasAbiertas,
    tieneSintesis, ultimaActualizacion
  }
  
  // Metadatos de compilación
  sourceHash, compiledAt, compiledBy, isCongealed: true
}
```

**Invariantes:**
- `isCongealed: true` (nunca se modifica tras compilación)
- Hash determinista de contenido (auditoría)
- Toda información procede del PSL (sin síntesis nueva)
- Trazabilidad completa a EvidenceAtom

---

## COMPONENTES PRINCIPALES

### Nivel 3: Transformación Estratégica

#### **A. Motor de Priorización (PrioritizationEngine)**

**Entrada:** `LocalHealthProfile` (PSL validado)  
**Salida:** `PrioritizationResult`

```typescript
CandidatePriority {
  id: "priority-{order}-{areaId}"
  title, rationale, sourceAreaId (vincula a PSLAreaIntervencion)
  relatedEvidenceIds[], cautions[]
}

PrioritizationResult {
  candidatePriorities[] // una por área del PSL
  criteria[] // 4 criterios orientativos (no ponderados automáticamente)
    1. Magnitud territorial sugerida
    2. Posibilidad de intervención local
    3. Activos comunitarios relacionados
    4. Necesidad de validación técnica/política/comunitaria
  cautions[] // recordatorios de que es propuesta, no decisión
  requiresHumanValidation: true
}
```

**Lo que NO hace:**
- ❌ No ordena prioridades por importancia
- ❌ No descarta automáticamente
- ❌ No traduce a líneas EPVSA (eso lo hace EPVSATranslator)
- ❌ No establece causalidad definitiva
- ❌ No constituye priorización formal municipal

---

#### **B. Motor de Traducción Estratégica (EPVSATranslator)**

**Responsable del gap H-02: "Motor de Traducción Estratégica canónico (MTE) todavía no existe"**

**Estado Actual:**
- ✅ Implementado: `EPVSATranslator` (provisional)
- 🔴 Pendiente: `StrategicTranslationEngine` canónico (MTE)

**Entrada:** `PrioritizationResult`  
**Salida:** `EPVSATranslationResult` {

```typescript
StrategicLineSuggestion {
  id: "epvsa-{order}-{priorityId}"
  candidatePriorityId, candidateTitle
  suggestedLine: "LE1" | "LE2" | "LE3" | "LE4" | "pending-review"
  suggestedLineLabel: "LE1 · Acción local en salud y comunidad" // etc
  rationale, cautions, relatedEvidenceIds
  requiresHumanValidation: true
}

EPVSATranslationResult {
  suggestions[] // una por candidatura prioritaria
  generalCautions[] // "No sustituye deliberación", "Requiere validación técnica"
  requiresHumanValidation: true
}
```

**Algoritmo de sugerencia (basado en keywords):**

```typescript
// Heurística simple detectando patrones textuales
inferStrategicLine(normalized_text) {
  if (text.includes("activo", "comunitario", "participación", ...)) → LE1
  if (text.includes("alimentación", "actividad física", "bienestar", ...)) → LE2
  if (text.includes("determinante", "desigualdad", "vulnerabilidad", ...)) → LE3
  if (text.includes("indicador", "evaluación", "seguimiento", ...)) → LE4
  else → "pending-review"
}
```

**Limitaciones Críticas (necesita MTE):**

| Limitación | Impacto | Solución (MTE) |
|---|---|---|
| Solo EPVSA como marco | Pierde ESCA, MAYORES, RELAS, PSMA | Integrar `StrategicFrameworkRegistry` |
| Heurística textual simple | Alto riesgo de sugerencias incorrectas | Alineación semántica con documentos fuentes |
| No considera competencias locales | Puede sugerir líneas no ejecutables municipalmente | Consulta de `MunicipalityContext` |
| No integra marcos múltiples | Fuerza decisión unicolor | Mapeo de correspondencias transversales |
| No vincula a indicadores | No hay trazabilidad a mediciones | Catálogo de indicadores por línea/objetivo |

---

#### **C. Motor de Plan de Acción (ActionPlanEngine)**

**Entrada:** {
- `EPVSATranslationResult` (sugerencias de líneas)
- `StrategicFrameworks[]` (marcos disponibles)
- `LocalHealthProfile` (PSL)
- `pslIsStale: boolean` (si ha cambiado evidencia desde validación)
}

**Salida:** `ActionPlanDraft` {

```typescript
PSLReference {
  pslId, status, generatedAt, validatedAt, validatedBy, isStale
  // snapshop del PSL en el momento de generación
}

ActionPlanObjective {
  id, title, linkedStrategicLine (LE1, LE2, LE3, LE4)
  rationale, frameworkAlignments[]
}

ActionPlanAction {
  id, title, description
  linkedObjectiveId (vincula a objetivo)
  relatedEvidenceIds, cautions
  frameworkAlignments[]
}

ActionPlanIndicator {
  id, title, type: "process" | "output" | "outcome"
  linkedActionId, measurementNote
}

ActionPlanDraft {
  title, pslReference, objectives[], actions[], indicators[]
  cautions[] // "Requiere validación técnica", etc
  requiresHumanValidation: true
}
```

**Trazabilidad:**

```
ActionPlanIndicator
  → ActionPlanAction
    → ActionPlanObjective
      → EPVSALineSuggestion
        → CandidatePriority
          → PSLAreaIntervencion
            → relatedEvidenceIds[]
              → EvidenceAtom.provenance.documentId
                → MunicipalDocument
```

**Lo que hace:**
- ✅ Propone objetivos generales y específicos
- ✅ Genera acciones candidatas
- ✅ Sugiere indicadores por acción
- ✅ Mantiene trazabilidad completa

**Lo que NO hace:**
- ❌ No selecciona prioridades (decisión humana)
- ❌ No asigna presupuestos
- ❌ No nombra responsables finales
- ❌ No establece plazos reales (solo scaffold)
- ❌ No genera PLS (eso lo hace `LocalHealthPlanCompiler`)

---

#### **D. Motor de Agenda (AgendaEngine)**

**Entrada:** `ActionPlanDraft`  
**Salida:** `AgendaDraft` {

```typescript
AgendaItemDraft {
  id: "agenda-item-{order}-{actionId}"
  title: "Programar {action.title}"
  linkedActionId (vincula a acción del plan)
  suggestedQuarter: "Q1" | "Q2" | "Q3" | "Q4" (triestral orientativa)
  responsibleProfile: "Responsable municipal de salud / equipo técnico"
  description: "Convertir la actuación validada en tarea anual con..."
  cautions: [...action.cautions]
  requiresHumanValidation: true
}

AgendaDraft {
  title: "Borrador inicial de agenda anual"
  annualItems[]
  cautions[]
  requiresHumanValidation: true
}
```

**Lo que hace:**
- ✅ Distribuye acciones en trimestres (orientativo)
- ✅ Genera fichas de implementación

**Lo que NO hace:**
- ❌ No asigna responsables reales
- ❌ No establece calendario municipal real
- ❌ No define recursos ejecutivos
- ❌ No activa seguimiento hasta validación

---

## QUÉ EXISTE

### 1. Líneas Estratégicas (EPVSA)

**Estado:** ✅ Definidas en `EPVSATranslator`

```typescript
EPVSAStrategicLine = "LE1" | "LE2" | "LE3" | "LE4" | "pending-review"

LE1 = "Acción local en salud y comunidad"
  → palabras clave: activo, comunitario, participación, ciudadanía, red, intersectorial
  
LE2 = "Entornos y estilos de vida saludables"
  → palabras clave: alimentación, actividad física, bienestar, emocional, consumo, hábito
  
LE3 = "Equidad, determinantes sociales y vulnerabilidades"
  → palabras clave: determinante, desigualdad, vulnerabilidad, renta, empleo, vivienda
  
LE4 = "Gobernanza, evaluación y conocimiento para la salud"
  → palabras clave: indicador, evaluación, seguimiento, cautela, metodológica
```

**Limitación Crítica (H-02):** EPVSATranslator es provisional. No existe un Motor de Traducción Estratégica canónico que integre:
- ❌ Múltiples marcos (ESCA, MAYORES, BUENA_EDAD, RELAS, PSMA)
- ❌ Competencias municipales reales
- ❌ Alineación semántica robusta
- ❌ Vinculación a indicadores específicos

---

### 2. Objetivos Estratégicos

**Estado:** ⚠️ Generados dinámicamente, no reificados

Los objetivos se construyen en tiempo de ejecución dentro de `ActionPlanEngine`:

```typescript
ActionPlanObjective {
  linkedStrategicLine: "LE1" // vincula a la línea EPVSA
  title, rationale
}
```

**Gap crítico:** 
- No existe un `ObjectiveType` canónico ni un registro formal de objetivos reutilizables
- Cada Plan de Acción genera objetivos nuevos desde cero
- No hay biblioteca de objetivos validados por dominio/población

**Necesario para completar:**
- Crear `StrategicObjectiveRegistry` con objetivos genéricos por línea EPVSA
- Mapear objetivos a indicadores existentes
- Permitir instanciación local de objetivos genéricos

---

### 3. Indicadores

**Estado:** ⚠️ Referencias, no generación

Los indicadores existen en dos contextos:

#### **3.1 Indicadores de Estudios Complementarios**

Ubicación: `src/application/health-profile/complementaryIndicatorReferences.ts`

```typescript
// 23 indicadores de estudios complementarios EAS
IndicatorSpec[] {
  id, match, narrativeLabel, instrument, blockId, unit
  value: (workspace) => number | string
  provincial: "eas" | "monitor" | "ninguna"
  sourceFile, calculationMethod, tracerPriority
}

// Agregados por instrumento:
IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE, 
AUDITC, IPAQ, GHQ12, PHQ9, PSQI, Fagerstrom, SBQ

// Referencias comparativas:
territorialValue (valor real de la muestra)
provinceReference (cálculo EAS Granada)
andalusiaReference (referencia autonómica)
scaleCaution (advertencia sobre escala)
demoProxy (si es proxy en demostración)
```

**Limitación:** Los indicadores son de la evidencia cuantitativa. No existen indicadores de desempeño del Plan de Acción (OKRs, KPIs).

#### **3.2 Indicadores del Plan de Acción (Inexistentes formalmente)**

En `ActionPlanEngine`, se generan indicadores candidatos:

```typescript
ActionPlanIndicator {
  id, title
  type: "process" | "output" | "outcome"
  linkedActionId
  measurementNote
}
```

**Gaps críticos:**
- ❌ No hay valores basales
- ❌ No hay metas cuantificadas
- ❌ No hay responsables de medición
- ❌ No hay periodicidad definida
- ❌ No hay umbral de alerta

Estos detalles deben completarse manualmente después de la compilación del borrador.

---

### 4. Programas de Salud

**Estado:** 🔴 No existen formalmente

En la arquitectura actual, los "programas" se representan como `LinkedStrategicLine` + `ObjectiveGroup`. No hay un tipo `HealthProgram` explícito.

**Estructura potencial (no implementada):**

```typescript
HealthProgram {
  id, name, strategicLine: "LE1" | "LE2" | "LE3" | "LE4"
  objectives[] { ObjectiveId }
  actions[] { ActionId }
  indicators[]
  targetPopulation[]
  resources: { budget?, personnel?, infrastructure? }
  responsibleUnit, timeline
}
```

---

### 5. Acciones-Tipo

**Estado:** 🔴 No existen formalmente

Las "acciones-tipo" (acciones genéricas reutilizables, adaptables localmente) no están reificadas en el sistema.

**Estructura potencial (no implementada):**

```typescript
ActionTemplate {
  id: "action-template-{code}"
  code: "ACCI-001" // código estándar
  genericTitle: "Consulta de atención primaria coordinada para control de..."
  description, rationale
  applicableToLines: ["LE1", "LE3"]
  targetPopulation: "población ≥60 años con hipertensión"
  typicalResponsible: "Equipo de atención primaria"
  typicalResources: {...}
  indicators: [{ id, type, formula }]
  localAdaptations[] { // cómo un municipio puede adaptarla
    adaptationId, title, context, modifications
  }
  relatedFrameworks: ["EPVSA", "ESCA", "RELAS"]
  validatedAt, validationStatus
}

LocalActionInstance {
  id: "action-local-{municipalityId}-{templateId}"
  basedOnTemplate: "action-template-{code}"
  municipalityId, objectiveId
  localTitle // puede diferir del genérico
  adaptations: LocalAdaptation[]
  assignedTo: "nombre responsable", "perfil"
  assignedResources, timeline
  metrics: { baseline, target, frequency, alert }
  status: "draft" | "validated" | "active" | "completed"
}
```

**Por qué es importante:**
- Reduce reinvención: no genera nuevas acciones desde cero cada ciclo
- Acelera priorización: permite seleccionar de catálogo validado
- Mejora comparabilidad: mismas acciones en municipios similares
- Facilita benchmarking: aprendizaje entre municipios
- Sistematiza innovación: buenas prácticas documentadas

**Próximo paso:** Crear `ActionTemplateLibrary` como resultado del análisis de ciclos anteriores.

---

## GAPS ARQUITECTÓNICOS

### **Brecha 1: Motor de Traducción Estratégica Canónico (H-02 — CRÍTICA)**

**Ubicación:** `docs/architecture/ARCHITECTURAL-GAP-REGISTER.md § H-02`

**Problema:**
- `EPVSATranslator` es heurística textual simple (busca keywords)
- No integra múltiples marcos estratégicos
- No consulta competencias municipales reales
- No articula con `StrategicFrameworkRegistry`

**Impacto:**
- 🔴 Bloquea validación robusta del Plan Local de Salud
- 🔴 Sugerencias de líneas pueden ser incorrectas o municipalmente inviables
- 🔴 No hay trazabilidad a documentos normativos

**Requisito especificado en CONTRACT-ACTION-PLAN.md (§ MTE-1, MTE-2, MTE-3):**

```
Regla MTE-1: La EPVSA no es el único marco estratégico.
  Incluir: ESCA, MAYORES (2020-2023), RELAS, PSMA (Plan Estratégico 
  Integral para Personas Mayores), cuando PSL contiene hallazgos relacionados.

Regla MTE-2: Marcos estratégicos como registro versionado (StrategicFrameworkRegistry),
  no lógica rígida. Cada marco declara:
  - líneas, objetivos, indicadores
  - palabras clave, poblaciones diana
  - determinantes relacionados
  - vigencia, fuente documental, cautelas

Regla MTE-3: Motor propone sin decidir. Toda alineación requiere 
  deliberación humana.
```

**Solución Requiere:**
1. Crear `StrategicFrameworkRegistry` (tipo + persistencia)
2. Implementar `StrategicTranslationEngine` (MTE canónico)
3. Integrar semántica documental + keywords
4. Articular con competencias municipales
5. Generar `FrameworkAlignment[]` para cada acción

**Tiempo estimado:** 2-3 sprints

---

### **Brecha 2: Compilador del Plan Local de Salud (H-06 — CRÍTICA)**

**Ubicación:** `src/application/health-profile-compiler/` ← **PENDIENTE**

**Problema:**
- No existe `LocalHealthPlanCompiler`
- No hay integración final de PSL-C + Plan de Acción + Agenda + Monitoring

**Requisitos especificados en CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md:**

```typescript
LocalHealthPlanCompiler INPUT {
  psl: LocalHealthProfile with status = "approved"
  pslc: LocalHealthProfileArtifact (coherente con psl)
  actionPlan: ActionPlanDraft (formalmente validado)
  agenda: AgendaDraft (formalmente validada)
  monitoring: MonitoringDraft (con marco de evaluación)
  periodoDeplanificacion: { start, end }
  unaddressedNeeds: Need[] (necesidades no priorizadas con justificación)
  approvalMetadata: { approvedAt, approvedBy, approvingBody }
}

LocalHealthPlanDocument OUTPUT {
  // Estructura de 12 secciones (§ I-IV, RE, I-XII, AN)
  portada, marcoInstitucional, contextoTerritorial,
  diagnosticoTerritorial (referencia a PSL-C),
  priorizacion, articulacionInstitucional,
  planAccion, agenda, marcoSeguimiento,
  marcoGobernanza, memoria (opcional), anexosMetodologicos,
  notaAprobacionInstitucional
}
```

**Secciones obligatorias (12 en total):**

| § | Sección | Estado |
|---|---|---|
| RE | Resumen Ejecutivo | ⏳ Pendiente compilación |
| I | Portada institucional | ⏳ Template exis, compilación pendiente |
| II | Marco de referencia | ⏳ Requiere MTE completo |
| III | Contexto territorial | ✅ Datos en workspace |
| IV | Diagnóstico → PSL-C | ⏳ Necesita vinculación |
| V | Priorización | ⏳ Compilar desde PSL.priorizacion |
| VI | Articulación institucional | ⏳ Necesita MTE |
| VII | Plan de Acción | ⏳ Compilar desde ActionPlanDraft |
| VIII | Agenda | ⏳ Compilar desde AgendaDraft |
| IX | Marco de seguimiento | ⏳ Compilar desde MonitoringDraft |
| X | Marco de gobernanza | ⏳ Metadatos del workspace |
| XI | Memoria del proceso | 🔴 Responsabilidad humana |
| XII | Anexos metodológicos | ⏳ Fichas de indicadores, estudios |
| AN | Nota de aprobación | 🔴 Acto externo, COMPÁS registra |

**Gaps específicos:**

| Gap | Descripción | Solución |
|---|---|---|
| **G-PLS-1** | ResumenEjecutivo no compilado | Generar síntesis de conclusiones + prioridades + objetivos |
| **G-PLS-2** | Marco institucional incompleto | Integrar MTE canónico para mapear frameworks |
| **G-PLS-3** | Diagnosis como duplicación vs referencia | Decidir: A) referencia a PSL-C con vinculación ó B) PSL-C incluido físicamente |
| **G-PLS-4** | Priorización no integrada | Compilar `psl.priorizacion` + deliberación documentada |
| **G-PLS-5** | ActionPlanDraft sin validación formal | Crear `FormalValidationRecord` para Plan de Acción ← PARCIAL (UI existe, consumo pendiente) |
| **G-PLS-6** | AgendaDraft sin validación formal | Crear `FormalValidationRecord` para Agenda ← PARCIAL |
| **G-PLS-7** | Necesidades no priorizadas no documentadas | Añadir `unaddressedNeeds: Need[]` con `justification` a `ActionPlanDraft` |

**Tiempo estimado:** 2-3 sprints (dependiente de H-02)

---

### **Brecha 3: Validación Formal de Borradores (H-05 — MEDIA)**

**Ubicación:** 
- `src/application/institutional-lifecycle/` (parcial)
- `src/ui/components/` (FormalValidationForm)

**Estado Actual:**
- ✅ UI implementada (Sprint 2) para formales de Plan de Acción y Agenda
- ❌ Consumo por `LocalHealthPlanCompiler` pendiente
- ❌ `FormalValidationRecord` tipado pero no completamente integrado

**Qué falta:**
- Gates de validación formal activos (G-PLS-5, G-PLS-6)
- Integración en el flujo de compilación PLS
- Documentación de validación en el plan final

---

### **Brecha 4: Strategic Repository y Registry (H-03 — ALTA)**

**No existe:** `StrategicFrameworkRegistry`

**Necesaria para:**
- Declarar marcos (EPVSA, ESCA, MAYORES, RELAS, PSMA)
- Almacenar líneas, objetivos, indicadores por marco
- Consultar durante traducción estratégica
- Generar alineaciones múltiples

**Estructura conceptual:**

```typescript
StrategicFrameworkRegistry {
  frameworks: StrategicFramework[] {
    id: "epvsa-2024-2030"
    name, version, validFrom, validTo
    documentSource: { url, DOI, reference }
    lines: StrategicLine[] {
      id, label, description, keywords, relatedDeterminants
    }
    objectives: StrategicObjective[] {
      id, lineId, label, description, targetPopulation
    }
    indicators: StrategicIndicator[] {
      id, objectiveId, label, type, formula, unit, dataSource
    }
    cautions: string[]
  }
}
```

---

### **Brecha 5: Biblioteca de Acciones-Tipo (MEDIA)**

**No existe:** `ActionTemplateLibrary`

**Necesaria para:**
- Reutilización de acciones validadas
- Reducción de esfuerzo de diseño en ciclos posteriores
- Comparabilidad entre municipios
- Innovación sistemática

**Estructura conceptual:**

```typescript
ActionTemplateLibrary {
  templates: ActionTemplate[] {
    id, code, title, description
    applicableToLines, targetPopulation
    typicalResources, indicators[]
    localAdaptations: LocalAdaptationGuide[]
    validationStatus, validatedBy, validatedAt
  }
}
```

---

### **Brecha 6: Indicadores de Desempeño del Plan (MEDIA)**

**No existe:** Definición formal de indicadores de seguimiento del Plan de Acción

**Necesaria para:**
- OKRs (Objetivos y Resultados Clave) del plan
- Seguimiento de implementación
- Evaluación de resultados

**Estructura conceptual:**

```typescript
PlanIndicator {
  id, actionId or objectiveId
  title, type: "input" | "process" | "output" | "outcome" | "impact"
  baseline: { value, date, source }
  target: { value, date, rationale }
  frequency: "monthly" | "quarterly" | "annual"
  responsibleOfMeasurement
  dataSource, calculationMethod
  alertThreshold
  status: "pending-baseline" | "active" | "met" | "missed"
}
```

---

### **Brecha 7: Memoria del Proceso (H-13 — RESERVA ARQUITECTÓNICA)**

**Estado:** Reservada para fases futuras

**Concepto:** Registro endocualitativo del proceso participativo:
- ¿Quién participó?
- ¿Qué se discutió?
- ¿Cómo se alcanzaron acuerdos?
- ¿Qué conflictos existieron?

Responsabilidad humana exclusiva (COMPÁS puede albergar documentos, no genera la memoria).

---

### **Brecha 8: Integración Constructor Metodológico ↔ REDCap ↔ EvidenceStore (H-10 — MEDIA)**

**Estado:** Parcialmente implementado

**Existe:**
- ✅ `QuestionnaireBuilder` (constructor local)
- ✅ `RedcapDictionaryBuilder` (generador de diccionario)
- ✅ `RedcapDictionaryCsvExporter` (exportador)

**Falta:**
- ❌ Ciclo end-to-end cerrado
- ❌ Importación de respuestas REDCap → workspace
- ❌ Generación de EvidenceAtom desde respuestas

---

### **Brecha 9: Ingesta BADEA/IECA (H-16 — MEDIA)**

**Estado:** Piloto controlado pendiente

**Necesidad:** Indicadores municipales desde BADEA/IECA (instituto de estadística)

**Decisión pendiente:** 
- ¿Cómo normalizar granularidad variable?
- ¿Qué EvidenceOrigin asignar?
- ¿Cómo integrar con análisis existente?

---

## RECOMENDACIONES

### Inmediatas (Sprint Actual)

1. **Documentar Decision D-PLS-1:** ¿Cómo referencia el PLS el diagnóstico?
   - Opción A: Referencia ligera a PSL-C compilado
   - Opción B: PSL-C incluido físicamente

2. **Priorizar H-02 (MTE Canónico):**
   - Precondición para PLS robusto
   - Estimado 2-3 sprints
   - Requiere coordinación con RELAS/Consejería

3. **Iniciar Prueba Conceptual:**
   - `StrategicFrameworkRegistry` con EPVSA
   - Mapeo manual de correspondencias
   - Validación técnica del concepto

---

### Corto Plazo (2-3 Sprints)

4. **Implementar LocalHealthPlanCompiler:**
   - Compilación de las 12 secciones
   - Gates de validación (G-PLS-1 a G-PLS-7)
   - Exportación DOCX + PDF

5. **Crear ActionTemplateLibrary:**
   - Análisis retrospectivo de ciclos previos
   - Catalogación de acciones validadas
   - Guías de adaptación local

6. **Formalizar Indicadores de Plan:**
   - Definir estructura PlanIndicator
   - Integrar baselines y metas
   - Implementar seguimiento

---

### Mediano Plazo (4-6 Sprints)

7. **StrategicFrameworkRegistry completo:**
   - Integración EPVSA, ESCA, MAYORES, RELAS, PSMA
   - Gestión de frameworks versionados
   - Consulta multimarco en MTE

8. **Ciclo REDCap cerrado (H-10):**
   - Constructor → Diccionario → Respuestas → EvidenceStore
   - Automatización de ingesta participativa

9. **Memoria del Proceso (H-13):**
   - Diseño colaborativo
   - Implementación como repositorio documental

---

### Arquitectura Propuesta del Compilador PLS

```typescript
// src/application/local-health-plan-compiler/

interface LocalHealthPlanCompilerInput {
  psl: LocalHealthProfile;
  pslc: LocalHealthProfileArtifact;
  actionPlan: ActionPlanDraft;
  agenda: AgendaDraft;
  monitoring: MonitoringDraft;
  
  // Metadatos institucionales
  planningPeriod: { start: string; end: string };
  approvalMetadata: {
    approvedAt: string;
    approvedBy: string;
    approvingBody: string; // "Pleno", "Junta de Gobierno", etc
  };
  
  // Necesidades no priorizadas (gap G-PLS-7)
  unaddressedNeeds?: Need[]; // { title, rationale, evidence }
  
  // Marcos estratégicos aplicables
  strategicFrameworkAlignments?: FrameworkAlignment[];
}

interface LocalHealthPlanDocument {
  // Portada + 12 secciones
  portada: Section;
  marcoInstitucional: Section;
  contextoTerritorial: Section;
  diagnosticoTerritorial: Section; // Ref a PSL-C
  priorizacion: Section;
  articulacionInstitucional: Section; // ← Requiere MTE
  planAccion: Section;
  agenda: Section;
  marcoSeguimiento: Section;
  marcoGobernanza: Section;
  memoria?: Section; // Opcional
  anexosMetodologicos: Section;
  notaAprobacionInstitucional: Section;
  
  // Metadatos
  compiledAt: string;
  compiledBy: string;
  isCongealed: true; // Inmutable tras compilación
  
  requiresHumanValidation: false; // Si pasó todos los gates
}

// Gates de validación (precondiciones)
function validateCompilerPreconditions(input): CompilationViolation[] {
  // G-PLS-1: PSL en "approved"
  // G-PLS-2: PSL-C coherente con PSL
  // G-PLS-3: ActionPlanDraft formalmente validado
  // G-PLS-4: AgendaDraft formalmente validada
  // G-PLS-5: MonitoringDraft con marco de evaluación
  // G-PLS-6: Necesidades no priorizadas documentadas
  // G-PLS-7: Aprobación institucional registrada
}

function compileLocalHealthPlan(
  input: LocalHealthPlanCompilerInput
): CompilationResult {
  const violations = validateCompilerPreconditions(input);
  if (violations.length > 0) return { ok: false, violations };
  
  // Compilación de 12 secciones
  const sections = {
    portada: compilarPortada(input),
    marcoInstitucional: compilarMarco(input), // ← Requiere MTE
    contextoTerritorial: compilarContexto(input),
    diagnosticoTerritorial: compilarDiagnostico(input),
    priorizacion: compilarPriorizacion(input),
    articulacionInstitucional: compilarArticulacion(input), // ← Requiere MTE
    planAccion: compilarPlanAccion(input),
    agenda: compilarAgenda(input),
    marcoSeguimiento: compilarSeguimiento(input),
    marcoGobernanza: compilarGobernanza(input),
    anexosMetodologicos: compilarAnexos(input),
    notaAprobacion: compilarNota(input),
  };
  
  return {
    ok: true,
    document: { ...sections, compiledAt: now(), isCongealed: true }
  };
}
```

---

## APÉNDICE: TRAZABILIDAD COMPLETA

Trazabilidad verificable desde cualquier acción del Plan hasta su origen en la evidencia:

```
MonitoringItem.agendaItemId
  └─▶ AgendaItemDraft (linkedActionId)
      └─▶ ActionPlanAction.linkedObjectiveId
          └─▶ ActionPlanObjective.linkedStrategicLine (LE1, LE2, LE3, LE4)
              └─▶ StrategicLineSuggestion.candidatePriorityId
                  └─▶ CandidatePriority.sourceAreaId
                      └─▶ PSLAreaIntervencion.relatedEvidenceIds
                          └─▶ EvidenceAtom.id
                              └─▶ EvidenceAtom.provenance.documentId
                                  └─▶ MunicipalDocument
```

**Cada paso de esta cadena es verificable y auditable.**

---

## CONCLUSIONES

### Estado Actual

✅ **Nivel 2 (PSL) Robusto:**
- Pipeline MIT → PSL implementado y certificado (con condiciones)
- Compilación PSL-C funcional
- Integración técnica completa

⚠️ **Nivel 3 (Estrategia) Funcional pero Incompleto:**
- Priorización: ✅ Implementada
- Traducción estratégica: ⚠️ Provisional (EPVSATranslator, no MTE)
- Plan de Acción: ✅ Borrador funcional
- Agenda: ✅ Borrador funcional
- **Compilación PLS: 🔴 PENDIENTE CRÍTICA**

### Huecos Críticos (Bloquean Uso Institucional)

1. **H-02 — MTE Canónico** (Motor de Traducción Estratégica)
   - Sin esto: no hay alineación multimarco robusta
   - Tiempo: 2-3 sprints

2. **H-06 — LocalHealthPlanCompiler** (Compilador del PLS)
   - Sin esto: no hay documento institucional final
   - Tiempo: 2-3 sprints

3. **H-03 — StrategicFrameworkRegistry** (Registro de Marcos)
   - Prerequisito para H-02
   - Tiempo: 1-2 sprints

### Visibilidad para Próximos Pasos

**Inmediato:**
- Coordinar decisión sobre estructura del PLS (referencia vs inclusión PSL-C)
- Iniciar prueba conceptual de `StrategicFrameworkRegistry`

**Próximas 6 semanas:**
- Implementar MTE canónico (H-02)
- Iniciar `LocalHealthPlanCompiler` (H-06)
- Crear `ActionTemplateLibrary`

**Horizonte 3 meses:**
- Cierre de H-02, H-06, H-03
- Producto PLS completo
- Validación con municipio piloto

---

*Fin del informe exhaustivo de exploración del Pipeline PSL en COMPÁS NG*
