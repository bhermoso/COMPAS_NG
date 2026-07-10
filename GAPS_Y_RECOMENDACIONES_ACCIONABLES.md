# GAPS ARQUITECTÓNICOS Y PLAN DE ACCIÓN

## Resumen Ejecutivo de Gaps

COMPÁS NG tiene un Nivel 2 robusto (PSL ✅) pero un Nivel 3 incompleto (⚠️ Estrategia/Plan/Agenda).

**Bloqueantes Críticos para Producto Final (Plan Local de Salud):**

| Gap | Severidad | Tiempo | Bloqueante |
|---|---|---|---|
| **H-02: MTE Canónico** (Motor Traducción Estratégica) | 🔴 CRÍTICA | 2-3 sprints | ✅ Sí — sin esto, alineación EPVSA fallida |
| **H-06: LocalHealthPlanCompiler** (Compilador PLS) | 🔴 CRÍTICA | 2-3 sprints | ✅ Sí — sin esto, no existe documento institucional |
| **H-03: StrategicFrameworkRegistry** | 🔴 CRÍTICA | 1-2 sprints | ✅ Prereq para H-02 |
| **Validación Formal (G-PLS-5, G-PLS-6)** | 🟠 ALTA | 1 sprint | ✅ Sí — gates de compilación |

---

## GAPS DETALLADOS CON SOLUCIONES

### 1. H-02 — MOTOR DE TRADUCCIÓN ESTRATÉGICA CANÓNICO

**Problema Actual:**

```typescript
// EPVSATranslator — heurística textual simple
function inferStrategicLine(text: string) {
  if (text.includes("activo", "comunitario", ...)) return "LE1";
  if (text.includes("alimentación", "actividad", ...)) return "LE2";
  // etc
}
```

❌ **Limitaciones:**
- Solo busca keywords (error rate alto)
- Solo EPVSA (pierde ESCA, MAYORES, RELAS, PSMA)
- No consulta competencias municipales reales
- No vincula indicadores específicos
- No integra `StrategicFrameworkRegistry`

---

**Requisitos (CONTRACT-ACTION-PLAN.md § MTE-1, MTE-2, MTE-3):**

```
Regla MTE-1: Integrar múltiples marcos — EPVSA, ESCA, MAYORES (2020-23), 
RELAS, PSMA cuando hay hallazgos relacionados.

Regla MTE-2: Marcos como registro versionado (StrategicFrameworkRegistry), 
no lógica codificada.

Regla MTE-3: Motor propone, NO decide. Toda alineación requiere deliberación.
```

---

**Solución (Sprint 2-3):**

#### **PASO 1: Crear StrategicFrameworkRegistry**

```typescript
// src/domain/strategy/StrategicFrameworkRegistry.ts

interface StrategicFramework {
  id: "epvsa-2024-2030" | "esca-2023" | "mayores-2020-2023" | "relas" | "psma"
  name: string
  version: string
  validFrom: string
  validTo: string
  documentSource: {
    url: string
    DOI?: string
    reference: string
  }
  lines: StrategicLine[]
  objectives: StrategicObjective[]
  indicators: StrategicIndicator[]
  cautions: string[]
}

interface StrategicLine {
  id: string              // "LE1", "ESCA-OB1-LIN1", etc
  label: string
  description: string
  keywords: string[]      // ["activo", "comunitario", "participación", ...]
  relatedDeterminants: string[]
  targetPopulation?: string
}

interface StrategicObjective {
  id: string
  lineId: string
  label: string
  description: string
  targetPopulation?: string
  keywords: string[]
}

interface StrategicIndicator {
  id: string
  objectiveId: string
  label: string
  type: "input" | "process" | "output" | "outcome" | "impact"
  formula?: string
  unit: string
  dataSource: string
  baselineYear?: number
}

// Instancia para EPVSA 2024-30 (ejemplo mínimo)
const EPVSA_2024_2030: StrategicFramework = {
  id: "epvsa-2024-2030",
  name: "Estrategia de Promoción y Prevención de la Salud en Andalucía",
  version: "2024-2030",
  validFrom: "2024-01-01",
  validTo: "2030-12-31",
  documentSource: {
    url: "https://www.juntadeandalucia.es/...",
    reference: "Consejería de Salud"
  },
  lines: [
    {
      id: "LE1",
      label: "Acción local en salud y comunidad",
      description: "...",
      keywords: ["activo", "comunitario", "participación", "ciudadanía", "red", "intersectorial"],
      relatedDeterminants: ["social-cohesion", "community-resources"]
    },
    {
      id: "LE2",
      label: "Entornos y estilos de vida saludables",
      description: "...",
      keywords: ["alimentación", "actividad física", "bienestar", "emocional", "consumo", "estilo de vida"],
      relatedDeterminants: ["nutrition", "physical-activity", "mental-health"]
    },
    // LE3, LE4
  ],
  objectives: [
    {
      id: "LE1-OBJ-001",
      lineId: "LE1",
      label: "Fortalecer estructuras comunitarias para promoción de salud",
      targetPopulation: "comunidad local",
      keywords: ["refuerzo", "red comunitaria", "coordinación intersectorial"]
    },
    // más...
  ],
  indicators: [
    {
      id: "LE1-IND-001",
      objectiveId: "LE1-OBJ-001",
      label: "% de asociaciones comunitarias de salud activas",
      type: "output",
      unit: "%",
      dataSource: "registro local"
    },
    // más...
  ],
  cautions: [
    "No se interpreta como obligatorio para todos los municipios",
    "Adaptación a contexto local requerida"
  ]
};

// Similar para ESCA, MAYORES, RELAS, PSMA
```

#### **PASO 2: Implementar StrategicTranslationEngine (MTE)**

```typescript
// src/application/strategic-translation/StrategicTranslationEngine.ts

interface StrategicTranslationInput {
  prioritizationResult: PrioritizationResult
  frameworks: StrategicFramework[]  // ← EPVSA, ESCA, MAYORES, RELAS
  psl: LocalHealthProfile           // ← contexto municipal
  municipalityContext: MunicipalContext
}

interface FrameworkAlignment {
  frameworkId: "epvsa-2024-2030" | "esca-2023" | ...
  lineId: string                    // "LE1", "ESCA-OB1-LIN1"
  lineLabel: string
  objectiveId?: string
  objectiveLabel?: string
  alignmentStrength: "direct" | "thematic" | "potential"
  confidenceScore: number           // 0.0—1.0
  rationale: string
  relatedKeywords: string[]
  applicableToMunicipality: boolean // ← competencias municipales
  relatedIndicators: StrategicIndicator[]
}

interface StrategicTranslationOutput {
  suggestions: StrategicLineSuggestion[]  // Enhanced
  alignments: FrameworkAlignment[]        // Multimarco
  unalignedPriorities: {
    priorityId: string
    title: string
    rationale: string  // "Sin correspondencia en marcos registrados"
  }[]
  frameworksCovered: string[]             // ["EPVSA", "ESCA"]
  generalCautions: string[]
  requiresHumanValidation: true
}

function generateStrategicTranslation(
  input: StrategicTranslationInput
): StrategicTranslationOutput {
  
  const alignments: FrameworkAlignment[] = []
  const unaligned: StrategicLineSuggestion[] = []
  
  for (const priority of input.prioritizationResult.candidatePriorities) {
    
    // Para cada framework registrado
    for (const framework of input.frameworks) {
      
      // Buscar correspondencias por keywords + semántica
      const matchedLines = findMatchingLines(priority, framework)
      
      for (const line of matchedLines) {
        // Filtrar por competencias municipales
        if (isApplicableToMunicipality(line, input.municipalityContext)) {
          
          alignments.push({
            frameworkId: framework.id,
            lineId: line.id,
            lineLabel: line.label,
            alignmentStrength: computeAlignmentStrength(priority, line),
            confidenceScore: computeConfidence(priority, line),
            rationale: buildRationale(priority, line, framework),
            relatedKeywords: extractRelatedKeywords(priority, line),
            applicableToMunicipality: true,
            relatedIndicators: findRelatedIndicators(line, framework)
          })
        }
      }
    }
    
    // Si ningún framework tiene correspondencia
    if (alignments.filter(a => a.candidatePriorityId === priority.id).length === 0) {
      unaligned.push({
        id: `unaligned-${priority.id}`,
        priorityId: priority.id,
        title: priority.title,
        rationale: "No hay correspondencia en marcos estratégicos registrados. Puede requerir innovación local."
      })
    }
  }
  
  return {
    suggestions: mapAlignmentsToSuggestions(alignments),
    alignments,
    unalignedPriorities: unaligned,
    frameworksCovered: Array.from(new Set(alignments.map(a => a.frameworkId))),
    generalCautions: [
      "Las correspondencias son propuestas basadas en palabras clave y semántica.",
      "Requieren validación técnica e institucional antes de formalizar.",
      "Una prioridad puede alinearse con múltiples marcos simultáneamente.",
      "La aplicabilidad municipal debe verificarse para cada correspondencia."
    ],
    requiresHumanValidation: true
  }
}

// Funciones de matching semántico (usar bibliotecas como js-levenshtein o TF-IDF)
function findMatchingLines(
  priority: CandidatePriority, 
  framework: StrategicFramework
): StrategicLine[] {
  // Buscar líneas que compartan keywords con la prioridad
  // usando similitud de texto (no solo substring)
}

function computeAlignmentStrength(
  priority: CandidatePriority,
  line: StrategicLine
): "direct" | "thematic" | "potential" {
  // "direct": overlap significativo en keywords y descripción
  // "thematic": relación temática clara pero no directa
  // "potential": posible relación, requiere revisión humana
}
```

#### **PASO 3: Integrar en ActionPlanEngine**

```typescript
// ActionPlanEngine ahora consume StrategicTranslationOutput

export function generateActionPlanDraft(
  strategicTranslation: StrategicTranslationOutput,  // ← MTE output
  psl: LocalHealthProfile,
  municipalityContext: MunicipalContext
): ActionPlanDraft {
  
  // 1. Crear objetivos a partir de líneas sugeridas
  const objectives = buildObjectivesFromFrameworkLines(
    strategicTranslation.alignments,
    strategicTranslation.frameworks
  )
  
  // 2. Crear acciones vinculadas a objetivos
  const actions = buildActionsFromObjectives(objectives, psl)
  
  // 3. Asignar indicadores específicos del framework
  const indicators = assignFrameworkIndicators(
    actions,
    strategicTranslation.alignments
  )
  
  // 4. Documentar necesidades no priorizadas (H-06 gap G-PLS-7)
  const unaddressedNeeds = strategicTranslation.unalignedPriorities.map(up => ({
    title: up.title,
    rationale: up.rationale,
    considerationNotes: "Evaluar en ciclos posteriores o innovación local"
  }))
  
  return {
    title: "Borrador del Plan de Acción",
    pslReference: { ... },
    objectives,
    actions,
    indicators,
    unaddressedNeeds,  // ← Nuevo campo (gap G-PLS-7)
    cautions: [...strategicTranslation.generalCautions],
    requiresHumanValidation: true
  }
}
```

---

**Estimación:**
- **Crear StrategicFrameworkRegistry:** 5-7 días
- **Implementar StrategicTranslationEngine:** 10-14 días
- **Integración + tests:** 5-7 días
- **Total: 2-3 sprints**

---

### 2. H-06 — COMPILADOR DEL PLAN LOCAL DE SALUD

**Problema:**
No existe compilador final que integre PSL + Plan de Acción + Agenda + Monitoring en un documento institucional único.

**Solución (Sprint 2-3):**

```typescript
// src/application/local-health-plan-compiler/LocalHealthPlanCompiler.ts

interface LocalHealthPlanCompilerInput {
  psl: LocalHealthProfile          // status: "approved"
  pslc: LocalHealthProfileArtifact // coherente con psl.id
  actionPlan: ActionPlanDraft      // formalmente validado
  agenda: AgendaDraft              // formalmente validada
  monitoring: MonitoringDraft      // con marco evaluación
  
  planningPeriod: { start: string; end: string }
  approvalMetadata: {
    approvedAt: string
    approvedBy: string
    approvingBody: string  // "Pleno", "Junta de Gobierno"
    approvalActReference?: string  // link a acta
  }
  
  strategicAlignments?: FrameworkAlignment[]  // Del MTE
  municipalityContext: MunicipalContext
}

interface LocalHealthPlanDocument {
  // Portada + 12 secciones
  portada: PLSSection
  marcoInstitucional: PLSSection
  contextoTerritorial: PLSSection
  diagnosticoTerritorial: PLSSection        // ← Ref a PSL-C
  priorizacion: PLSSection
  articulacionInstitucional: PLSSection     // ← MTE output
  planAccion: PLSSection
  agenda: PLSSection
  marcoSeguimiento: PLSSection
  marcoGobernanza: PLSSection
  anexosMetodologicos: PLSSection
  notaAprobacionInstitucional: PLSSection
  
  resumenEjecutivo?: PLSSection              // Opcional, al inicio
  
  compiledAt: string
  compiledBy: string
  sourceHash: string                         // Auditoría
  isCongealed: true
}

interface PLSSection {
  title: string
  content: string
  metadata: {
    sourceId?: string    // Trazabilidad
    generatedAt: string
    authoredBy?: string
  }
}

// Gates de validación (precondiciones)
export function validateCompilerPreconditions(
  input: LocalHealthPlanCompilerInput
): CompilationViolation[] {
  const violations: CompilationViolation[] = []
  
  // G-PLS-1
  if (input.psl.status !== "approved") {
    violations.push({
      gate: "G-PLS-1",
      message: `PSL debe estar "approved". Estado actual: "${input.psl.status}"`
    })
  }
  
  // G-PLS-2
  if (input.pslc.sourcePSLId !== input.psl.id) {
    violations.push({
      gate: "G-PLS-2",
      message: "PSL-C no es coherente con PSL"
    })
  }
  
  // G-PLS-3 (validation formal del Plan de Acción)
  if (!input.actionPlan.validationStatus || 
      input.actionPlan.validationStatus !== "formally-validated") {
    violations.push({
      gate: "G-PLS-3",
      message: "ActionPlanDraft debe estar formalmente validado"
    })
  }
  
  // G-PLS-4 (validación formal de Agenda)
  if (!input.agenda.validationStatus || 
      input.agenda.validationStatus !== "formally-validated") {
    violations.push({
      gate: "G-PLS-4",
      message: "AgendaDraft debe estar formalmente validada"
    })
  }
  
  // G-PLS-5 (marco evaluación en Monitoring)
  if (!input.monitoring.evaluationFramework) {
    violations.push({
      gate: "G-PLS-5",
      message: "MonitoringDraft debe definir marco de evaluación"
    })
  }
  
  // G-PLS-6 (necesidades no priorizadas documentadas)
  if (!input.actionPlan.unaddressedNeeds || 
      input.actionPlan.unaddressedNeeds.length === 0) {
    violations.push({
      gate: "G-PLS-6",
      message: "Las necesidades no priorizadas deben estar documentadas con justificación"
    })
  }
  
  // G-PLS-7 (aprobación institucional)
  if (!input.approvalMetadata.approvedAt || 
      !input.approvalMetadata.approvedBy || 
      !input.approvalMetadata.approvingBody) {
    violations.push({
      gate: "G-PLS-7",
      message: "Aprobación institucional incompleta"
    })
  }
  
  return violations
}

// Entry point
export function compileLocalHealthPlan(
  input: LocalHealthPlanCompilerInput
): CompilationResult {
  
  const violations = validateCompilerPreconditions(input)
  if (violations.length > 0) {
    return { ok: false, violations }
  }
  
  const compiledAt = new Date().toISOString()
  
  // Compilar 12 secciones
  const sections = {
    resumenEjecutivo: compileExecutiveSummary(input),
    portada: compilePortada(input),
    marcoInstitucional: compileFramework(input),
    contextoTerritorial: compileContext(input),
    diagnosticoTerritorial: compileDiagnosis(input),  // Ref a PSL-C
    priorizacion: compilePrioritization(input),
    articulacionInstitucional: compileArticulation(input),
    planAccion: compilePlanAction(input),
    agenda: compileAgenda(input),
    marcoSeguimiento: compileMonitoring(input),
    marcoGobernanza: compileGovernance(input),
    anexosMetodologicos: compileAnnexes(input),
    notaAprobacion: compileApprovalNote(input)
  }
  
  const sourceHash = computePLSHash(input)
  
  return {
    ok: true,
    document: {
      ...sections,
      compiledAt,
      compiledBy: input.approvalMetadata.approvedBy,
      sourceHash,
      isCongealed: true
    }
  }
}

// Compiladores específicos por sección
function compileExecutiveSummary(input: LocalHealthPlanCompilerInput): PLSSection {
  // Síntesis de max 2-3 párrafos:
  // - Quién somos (municipio, población)
  // - Qué hallamos (resumen diagnóstico)
  // - Qué priorizamos (prioridades seleccionadas)
  // - Qué haremos (3-4 líneas de acción principales)
  // - Cómo seguimos (framework de evaluación)
  return {
    title: "Resumen Ejecutivo",
    content: generateExecutiveSummaryText(input),
    metadata: { generatedAt: new Date().toISOString() }
  }
}

function compileDiagnosis(input: LocalHealthPlanCompilerInput): PLSSection {
  // Opción A (RECOMENDADA): Referencia al PSL-C
  return {
    title: "Diagnóstico Territorial — Perfil de Salud Local",
    content: `Este Plan Local de Salud se fundamenta en el Perfil de Salud Local compilado
             el ${input.pslc.compiledAt}, generado desde el análisis integrado de evidencia 
             municipal. El diagnóstico territorial completo se consulta en:
             
             Referencia: PSL-C/v${input.pslc.version}
             ID: ${input.pslc.sourcePSLId}
             Compilado por: ${input.pslc.compiledBy}
             
             [Se adjunta como Anexo A el documento PSL-C completo, o se proporciona
             mediante referencia a sistema de gestión documental]
             
             SÍNTESIS DEL DIAGNÓSTICO:
             ${input.psl.territoritalSummary}
             
             ÁREAS DE INTERVENCIÓN IDENTIFICADAS:
             ${input.psl.areasDeIntervencion.map(a => 
               `- ${a.title}: ${a.rationale}`
             ).join('\n')}`,
    metadata: {
      sourceId: input.pslc.sourcePSLId,
      generatedAt: new Date().toISOString()
    }
  }
}

function compilePlanAction(input: LocalHealthPlanCompilerInput): PLSSection {
  // Tabla con: Objetivo | Acción | Indicadores | Responsable | Plazo
  const actionTable = input.actionPlan.objectives
    .map(obj => ({
      objective: obj.title,
      actions: input.actionPlan.actions.filter(a => a.linkedObjectiveId === obj.id)
    }))
  
  // Generar tabla HTML/DOCX
  return {
    title: "Plan de Acción",
    content: generateActionPlanTable(actionTable, input),
    metadata: { generatedAt: new Date().toISOString() }
  }
}

// Similar para otras secciones
```

**Secciones a compilar (12 + portada):**

| § | Sección | Datos Fuente | Implementación |
|---|---|---|---|
| RE | Resumen Ejecutivo | PSL + Plan + Agenda | Función `compileExecutiveSummary()` |
| I | Portada | Input metadatos | Función `compilePortada()` |
| II | Marco Institucional | MTE output + Frameworks | Función `compileFramework()` |
| III | Contexto Territorial | workspace.municipality | Función `compileContext()` |
| IV | Diagnóstico | PSL-C (ref o incluido) | Función `compileDiagnosis()` |
| V | Priorización | PSL.priorizacion + deliberación | Función `compilePrioritization()` |
| VI | Articulación | MTE FrameworkAlignments | Función `compileArticulation()` |
| VII | Plan de Acción | ActionPlanDraft | Función `compilePlanAction()` |
| VIII | Agenda | AgendaDraft | Función `compileAgenda()` |
| IX | Monitoreo | MonitoringDraft | Función `compileMonitoring()` |
| X | Gobernanza | Metadatos + estructura local | Función `compileGovernance()` |
| XII | Anexos | Fichas indicadores, estudios | Función `compileAnnexes()` |
| AN | Nota Aprobación | Input approvalMetadata | Función `compileApprovalNote()` |

---

**Estimación:**
- **Estructura compilador:** 5-7 días
- **Compiladores secciones (8 principales):** 14-21 días
- **Exportación DOCX + PDF:** 7-10 días
- **Tests + integración:** 7-10 días
- **Total: 2-3 sprints**

---

### 3. H-03 — STRATEGIC FRAMEWORK REGISTRY

**Necesario para:** H-02 (MTE Canónico)

**Estructura mínima:**

```typescript
// Ya descrita en sección H-02 anterior

// Persistencia: localStorage + exportación JSON
interface StrategicFrameworkRegistry {
  frameworks: StrategicFramework[]
  lastUpdated: string
  version: string
}

// API de consulta
function queryFrameworksByKeywords(
  keywords: string[],
  frameworks: StrategicFramework[]
): StrategicLine[] {
  // Buscar líneas que coincidan con keywords
}

function getFrameworksByPopulation(
  population: string,  // "poblacion-general", "mayores-60", etc
  frameworks: StrategicFramework[]
): StrategicFramework[] {
  // Filtrar marcos aplicables a población
}
```

**Estimación:**
- **Diseño + tipos:** 3-5 días
- **Instancia EPVSA:** 5-7 días
- **UI gestión:** 5-7 días
- **Tests:** 3-5 días
- **Total: 1-2 sprints**

---

## ROADMAP RECOMENDADO

### Sprint Actual (Inmediato)

**Decisiones:**
- [ ] D-PLS-1: ¿Cómo incluye el PLS su diagnóstico? (Opción A recomendada)
- [ ] Acordar formato de exportación final (DOCX vs PDF)

**Inicio de implementación:**
- [ ] Crear `StrategicFrameworkRegistry` (tipos + instancia EPVSA mínima)
- [ ] Documentar contrato de `LocalHealthPlanCompiler`

---

### Sprint +1 (1-2 semanas)

**Paralelizable:**
- [ ] **Rama A:** StrategicTranslationEngine (MTE) — dependiente de H-03
- [ ] **Rama B:** LocalHealthPlanCompiler — secciones iniciales (I-IV)
- [ ] **Rama C:** Validación formal (integrar gates G-PLS-3 a G-PLS-7)

**Verificación:**
- [ ] Tests de compilación con PSL validado
- [ ] Validación con municipio piloto

---

### Sprint +2 (2-4 semanas)

**Finalización:**
- [ ] MTE completamente integrado en ActionPlanEngine
- [ ] Compilador con 12 secciones finalizadas
- [ ] Exportación DOCX + PDF
- [ ] Generación de Resumen Ejecutivo

**Prueba end-to-end:**
- [ ] PSL → Priorización → MTE → Plan de Acción → Agenda → PLS compilado
- [ ] Validación de trazabilidad completa

---

## DEPENDENCIAS Y RESTRICCIONES

```
H-03 (Registry)
  ↓
H-02 (MTE)
  ↓
H-06 (PLS Compiler)

Las tres deben estar integradas para producto final.
Paralelizable: H-03 + H-06 (secciones independientes)
```

---

## CAMBIOS NECESARIOS EN ActionPlanDraft

**Actuales (problemas):**

```typescript
ActionPlanDraft {
  objectives, actions, indicators
  // ❌ Falta: unaddressedNeeds, validationStatus
}
```

**Propuesto (gap G-PLS-7):**

```typescript
ActionPlanDraft {
  objectives, actions, indicators
  unaddressedNeeds: Need[] {  // ← Nuevo
    title, rationale
    considerationNotes, evidenceIds
  }
  validationStatus: "draft" | "formally-validated"  // ← Nuevo
  validatedAt?: string
  validatedBy?: string
}
```

---

## CAMBIOS EN COMPILACIÓN Y GATES

**Nuevos gates de compilación:**

| Gate | Condición | Severidad |
|---|---|---|
| G-PLS-1 | `psl.status === "approved"` | 🔴 Bloqueante |
| G-PLS-2 | `pslc.sourcePSLId === psl.id` | 🔴 Bloqueante |
| G-PLS-3 | `actionPlan.validationStatus === "formally-validated"` | 🔴 Bloqueante |
| G-PLS-4 | `agenda.validationStatus === "formally-validated"` | 🔴 Bloqueante |
| G-PLS-5 | `monitoring.evaluationFramework` defined | 🔴 Bloqueante |
| G-PLS-6 | `actionPlan.unaddressedNeeds.length > 0` | 🟠 Advertencia |
| G-PLS-7 | `approvalMetadata` completo | 🔴 Bloqueante |

---

## REFERENCIAS DOCUMENTALES

- `docs/contracts/CONTRACT-ACTION-PLAN.md` — Reglas MTE-1, MTE-2, MTE-3
- `docs/contracts/CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md` — Estructura PLS 12 secciones
- `docs/architecture/ARCHITECTURAL-GAP-REGISTER.md` — H-02, H-03, H-06 detallados
- `src/application/health-profile-compiler/` — Patrón de compilador a replicar
- `src/application/action-plan/ActionPlanEngine.ts` — Punto de integración MTE

---

*Fin del documento de gaps y recomendaciones accionables*
