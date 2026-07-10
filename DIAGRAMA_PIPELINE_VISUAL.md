# Pipeline Visual: PSL → Plan de Acción → Agendas

## FLUJO COMPLETO (8 etapas)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         NIVEL 0: INGESTA DE EVIDENCIA                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  HealthReport (DOCX/PDF)  ComplementaryStudies (CSV)  TerritorialDoc  Community       │
│         ✅                       ✅                        ✅             ✅            │
│                                                                                          │
│           ↓        ↓        ↓        ↓        ↓        ↓        ↓        ↓              │
│     ┌─────────────────────────────────────────────────────────┐                         │
│     │      EvidenceStore (Atomizado por origen/kind)          │                         │
│     │  - ibse, duke, predimed, sf12, sueno, cage, etc        │                         │
│     │  - determinant, asset, indicator, methodological       │                         │
│     └─────────────────────────────────────────────────────────┘                         │
│                              ↓                                                           │
│     ┌─────────────────────────────────────────────────────────┐                         │
│     │   EvidenceStoreIntegrityGuard (Detecta conflictos)       │                         │
│     │   - errors, warnings (NO resuelve)                      │                         │
│     └─────────────────────────────────────────────────────────┘                         │
│                              ↓                                                           │
│            EvidenceStore (Saneado + ConflictReport)                                     │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                    NIVEL 1: MOTOR INTERPRETACIÓN TERRITORIAL (MIT)                      │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│              LT1Engine                          OITEngine                               │
│          ┌─────────────┐                    ┌─────────────┐                            │
│          │  LT1Result  │                    │  OITResult  │                            │
│          ├─────────────┤                    ├─────────────┤                            │
│          │ determinants[]                   │opportunities[]  {                        │
│          │ assets[]                         │   - Determinants + Assets                │
│          │ indicators[]                     │   - Participation + Indicators           │
│          │ qualitative[]                    │   - Methodological Review                │
│          │ methodCautions[]                 │   - Expand Evidence                      │
│          │ preliminary                      │ }                                        │
│          │  Opportunities[]                 │                                          │
│          │ territorialSummary               │ sourceSummary (= LT1)                   │
│          └─────────────┘                    └─────────────┘                            │
│                 ↓                                   ↓                                    │
│        DimensionDiagnostica             ReconciliacionInterpretativa                   │
│        (Agrupar evidencia)              (Resolver conflictos iniciales)                │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                 NIVEL 2: PERFIL DE SALUD LOCAL (PSL) — OBJETO VIVO                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  buildLocalHealthProfile() toma LT1 + OIT + Conflictos → LocalHealthProfile {          │
│                                                                                          │
│  ① IDENTIDAD                                                                            │
│     id, municipalityId, status, version, evidenceStoreVersion                          │
│                                                                                          │
│  ② MARCO ESTRATÉGICO                                                                   │
│     strategicFrameworkSectionIds[] (RELAS, ESCA, EPVSA, etc)                          │
│                                                                                          │
│  ③ INFORME DE SALUD                                                                    │
│     healthReportDocumentId (referencia, NO contenido)                                   │
│                                                                                          │
│  ④ DIAGNÓSTICO INTEGRADO (Snapshots estadísticos)                                     │
│     totalEvidenceAtoms, atomsByOrigin, atomsByKind, evidenceAtomIds[]                  │
│     originsSummary[] = ["ibse", "duke", "predimed", ...]                              │
│                                                                                          │
│  ⑤ INTERPRETACIÓN TERRITORIAL (Núcleo)                                                 │
│     territorialSummary (narrativa LT1)                                                 │
│     determinantCount, assetCount, indicatorCount, qualitativeFindingCount              │
│     preliminaryOpportunities[]                                                         │
│     tensionesEstructurales, conflictos, tensionesEscaladas                            │
│                                                                                          │
│  ⑥ CANDIDATURAS PARA INTERVENCIÓN                                                     │
│     areasDeIntervencion[] {                                                            │
│       id, title, rationale                                                             │
│       relatedEvidenceIds[] → EvidenceAtom → fuente original                            │
│       cautions, isAnalyticalGap                                                        │
│     }                                                                                    │
│                                                                                          │
│  ⑦ DOCUMENTO (Scaffold — requiere autoría humana)                                     │
│     conclusiones: PSLScaffoldChapter { content, status: "authored", ... }             │
│     cierreInterpretativo: PSLScaffoldChapter { ... }                                   │
│                                                                                          │
│  ⑧ PRIORIZACIÓN (Preparación deliberativa)                                            │
│     priorizacion {                                                                      │
│       candidaturasTecnicas[]  ← generadas por el sistema                               │
│       tematicasSeleccionadas[]  ← del proceso participativo (REDCap)                   │
│       deliberacionNota: string                                                         │
│       consensoDocumentado: boolean  ← HUMANO                                           │
│     }                                                                                    │
│     priorizacionStatus: "scaffold" | "partial" | "complete"                           │
│                                                                                          │
│  ⑨ CICLO DE VIDA                                                                       │
│     status: "generated" → "review" → "validated" → "approved"                         │
│     → "superseded" | "archived"                                                        │
│     validatedAt, validatedBy, approvedAt, approvedBy                                   │
│     requiresHumanValidation: true                                                      │
│ }                                                                                        │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐      │
│  │  Espacio de trabajo técnico: PerfilLocalDeSalud (PerfilInterpretativo)     │      │
│  │  ├─ interpretaciones[] (autoría sobre significado)                          │      │
│  │  ├─ hipotesis[] (afirmaciones por validar)                                │      │
│  │  ├─ preguntasAbiertas[] (incertidumbres)                                  │      │
│  │  ├─ sintesisTexto? (máx 3000 caracteres)                                 │      │
│  │  └─ Persistente, mutable, OPCIONAL                                        │      │
│  └─────────────────────────────────────────────────────────────────────────────┘      │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────┐                         │
│  │ COMPILACIÓN → LocalHealthProfileArtifact (PSL-C)        │                         │
│  │ - Precondiciones: status="validated", authorship done   │                         │
│  │ - Resultado: Documento CONGELADO (isCongealed: true)    │                         │
│  │ - Hash determinista (auditoría)                         │                         │
│  └──────────────────────────────────────────────────────────┘                         │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          ↓
                         LocalHealthProfile (status: "validated")
                                          ↓


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│              NIVEL 3: TRANSFORMACIÓN ESTRATÉGICA (⚠️  Parcialmente implementado)        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─ A. PRIORIZACIÓN ──────────────────────────────────────────────────────────────┐   │
│  │                                                                                 │   │
│  │  PrioritizationEngine(psl) → PrioritizationResult {                            │   │
│  │    candidatePriorities[] ← 1:1 mapping from psl.areasDeIntervencion            │   │
│  │    criteria[] (4 criterios orientativos, NO ponderados)                        │   │
│  │    cautions[] ("Es propuesta, no decisión")                                    │   │
│  │  }                                                                              │   │
│  │                                                                                 │   │
│  │  Lo que NO hace:                                                               │   │
│  │  ❌ No ordena por importancia                                                  │   │
│  │  ❌ No descarta automáticamente                                                │   │
│  │  ❌ No traduce a EPVSA (← siguiente)                                          │   │
│  │  ❌ No establece causalidad definitiva                                         │   │
│  └─ ✅ ──────────────────────────────────────────────────────────────────────────┘   │
│                                          ↓                                             │
│                                                                                          │
│  ┌─ B. TRADUCCIÓN ESTRATÉGICA (⚠️  PROVISIONAL) ───────────────────────────────┐   │
│  │                                                                                 │   │
│  │  EPVSATranslator(prioritizationResult) → EPVSATranslationResult {              │   │
│  │    suggestions[] {                                                              │   │
│  │      candidatePriorityId → candidateTitle                                      │   │
│  │      suggestedLine: "LE1" | "LE2" | "LE3" | "LE4" | "pending-review"         │   │
│  │      rationale, cautions, relatedEvidenceIds                                   │   │
│  │    }                                                                             │   │
│  │    generalCautions[] ("No sustituye deliberación", ...)                        │   │
│  │  }                                                                              │   │
│  │                                                                                 │   │
│  │  ⚠️  LIMITACIONES (Necesita MTE canónico — H-02):                             │   │
│  │  ❌ Solo EPVSA (pierde ESCA, MAYORES, RELAS, PSMA)                            │   │
│  │  ❌ Heurística textual simple (keywords)                                       │   │
│  │  ❌ No considera competencias municipales                                      │   │
│  │  ❌ No integra StrategicFrameworkRegistry                                      │   │
│  │  ❌ No vincula indicadores                                                     │   │
│  │                                                                                 │   │
│  │  LE1 = "Acción local en salud y comunidad" (participación, activos, redes)    │   │
│  │  LE2 = "Entornos y estilos de vida saludables" (alimentación, actividad)      │   │
│  │  LE3 = "Equidad, determinantes y vulnerabilidades" (desigualdad, renta)       │   │
│  │  LE4 = "Gobernanza, evaluación y conocimiento" (indicadores, seguimiento)     │   │
│  │                                                                                 │   │
│  └─ ⚠️  ──────────────────────────────────────────────────────────────────────────┘   │
│                                          ↓                                             │
│                                                                                          │
│  ┌─ C. PLAN DE ACCIÓN ───────────────────────────────────────────────────────┐   │
│  │                                                                             │   │
│  │  ActionPlanEngine(epvsa, frameworks, psl) → ActionPlanDraft {             │   │
│  │    pslReference {  ← snapsnot del PSL en momento de generación            │   │
│  │      pslId, status, validatedAt, isStale                                 │   │
│  │    }                                                                       │   │
│  │                                                                             │   │
│  │    objectives[] {                                                          │   │
│  │      id, title, linkedStrategicLine (LE1/LE2/LE3/LE4)                    │   │
│  │      rationale, frameworkAlignments[]                                     │   │
│  │    }                                                                       │   │
│  │                                                                             │   │
│  │    actions[] {                                                             │   │
│  │      id, title, description                                               │   │
│  │      linkedObjectiveId  ← vinculación a objetivo                          │   │
│  │      relatedEvidenceIds[] ← trazabilidad a atomo                          │   │
│  │      cautions, frameworkAlignments[]                                      │   │
│  │    }                                                                       │   │
│  │                                                                             │   │
│  │    indicators[] {                                                          │   │
│  │      id, title                                                             │   │
│  │      type: "process" | "output" | "outcome"                               │   │
│  │      linkedActionId                                                        │   │
│  │      measurementNote  ← SIN valores basales/metas/responsables            │   │
│  │    }                                                                       │   │
│  │                                                                             │   │
│  │    cautions[], requiresHumanValidation: true                              │   │
│  │  }                                                                         │   │
│  │                                                                             │   │
│  │  Lo que NO hace:                                                           │   │
│  │  ❌ No asigna presupuestos                                                │   │
│  │  ❌ No nombra responsables finales (solo perfiles genéricos)             │   │
│  │  ❌ No establece plazos reales (solo propone trimestres)                 │   │
│  │  ❌ No formaliza indicadores (faltan basales, metas, responsables)       │   │
│  │                                                                             │   │
│  └─ ✅ ──────────────────────────────────────────────────────────────────────┘   │
│                                          ↓                                             │
│                                                                                          │
│  ┌─ D. AGENDA (Distribución temporal) ────────────────────────────────────┐   │
│  │                                                                         │   │
│  │  AgendaEngine(actionPlan) → AgendaDraft {                              │   │
│  │    annualItems[] {                                                      │   │
│  │      id: "agenda-item-{order}-{actionId}"                              │   │
│  │      title: "Programar {action.title}"                                 │   │
│  │      linkedActionId                                                     │   │
│  │      suggestedQuarter: "Q1" | "Q2" | "Q3" | "Q4"  ← ORIENTATIVA       │   │
│  │      responsibleProfile: "Responsable municipal de salud"               │   │
│  │      description, cautions                                              │   │
│  │    }                                                                    │   │
│  │    cautions[]                                                           │   │
│  │  }                                                                      │   │
│  │                                                                         │   │
│  │  Lo que NO hace:                                                        │   │
│  │  ❌ No asigna responsables reales                                      │   │
│  │  ❌ No establece calendario municipal real                             │   │
│  │  ❌ No define recursos ejecutivos                                      │   │
│  │  ❌ No activa seguimiento (hasta validación)                          │   │
│  │                                                                         │   │
│  └─ ✅ ──────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          ↓
                            ActionPlanDraft + AgendaDraft
                                          ↓


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                  NIVEL 4: COMPILACIÓN DEL PLAN LOCAL DE SALUD                          │
│                      🔴 PENDIENTE CRÍTICA (H-06)                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  LocalHealthPlanCompiler(                                                               │
│    psl(validated),  pslc(artifact),  actionPlan,  agenda,  monitoring,                 │
│    planningPeriod,  approvalMetadata,  strategicAlignments                             │
│  ) → LocalHealthPlanDocument {                                                          │
│                                                                                          │
│  SECCIONES (12 + portada + nota aprobación):                                           │
│  ├─ RE Resumen Ejecutivo                          ⏳ Compilar                          │
│  ├─ I  Portada institucional                      ⏳ Template existe                    │
│  ├─ II Marco institucional de referencia          ⏳ Requiere MTE                       │
│  ├─ III Contexto territorial                      ✅ Datos en workspace               │
│  ├─ IV Diagnóstico → PSL-C                        ⏳ Referencia o inclusión            │
│  ├─ V Priorización                                ⏳ Compilar desde PSL                │
│  ├─ VI Articulación institucional                 ⏳ Requiere MTE                      │
│  ├─ VII Plan de Acción                            ⏳ Compilar desde ActionPlanDraft    │
│  ├─ VIII Agenda                                   ⏳ Compilar desde AgendaDraft        │
│  ├─ IX Marco de seguimiento                       ⏳ Compilar desde MonitoringDraft    │
│  ├─ X Marco de gobernanza                         ⏳ Metadatos workspace              │
│  ├─ XI Memoria del proceso                        🔴 Humano (opcional)                │
│  ├─ XII Anexos metodológicos                      ⏳ Fichas, estudios                  │
│  └─ AN Nota de aprobación institucional           🔴 Acto externo                      │
│                                                                                          │
│  PRECONDICIONES (Gates):                                                                │
│  ✅ G-PLS-1: psl.status = "approved"                                                  │
│  ✅ G-PLS-2: pslc.sourcePSLId = psl.id                                                │
│  ⏳ G-PLS-3: actionPlan.validationStatus = "formally-validated"                       │
│  ⏳ G-PLS-4: agenda.validationStatus = "formally-validated"                           │
│  ⏳ G-PLS-5: monitoring.evaluationFramework defined                                   │
│  ⏳ G-PLS-6: unaddressedNeeds[] documentadas                                          │
│  ✅ G-PLS-7: approvalMetadata completo                                                │
│                                                                                          │
│  SALIDA:                                                                                │
│  {                                                                                       │
│    portada, marcoInstitucional, contextoTerritorial, diagnosticoTerritorial,          │
│    priorizacion, articulacionInstitucional, planAccion, agenda,                        │
│    marcoSeguimiento, marcoGobernanza, anexosMetodologicos, notaAprobacion,            │
│    compiledAt, compiledBy, isCongealed: true                                           │
│  }                                                                                       │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                          ↓
                            LocalHealthPlanDocument (PLS)
                        Documento institucional definitivo
                          Inmutable tras compilación y aprobación
                                    (isCongealed: true)
```

---

## TRAZABILIDAD VERIFICABLE (Ejemplo Concreto)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  TRAZABILIDAD: MonitoringItem → Action → Objective → Evidence → Document Fuente    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  MonitoringItem {                                                                    │
│    id: "monitoring-001"                                                             │
│    agendaItemId: "agenda-item-1-action-005"                                         │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  AgendaItemDraft {                                                                   │
│    linkedActionId: "action-005"                                                     │
│    suggestedQuarter: "Q1"                                                           │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  ActionPlanAction {                                                                  │
│    id: "action-005"                                                                 │
│    linkedObjectiveId: "objective-002"                                               │
│    relatedEvidenceIds: ["atom-1847", "atom-2104"]                                    │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  ActionPlanObjective {                                                               │
│    id: "objective-002"                                                              │
│    linkedStrategicLine: "LE3"                                                       │
│    title: "Reducir desigualdades en acceso a servicios de salud"                    │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  StrategicLineSuggestion (EPVSA) {                                                   │
│    suggestedLine: "LE3"                                                             │
│    candidatePriorityId: "priority-002-area-047"                                    │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  CandidatePriority {                                                                │
│    sourceAreaId: "area-047"                                                         │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  PSLAreaIntervencion {                                                               │
│    id: "area-047"                                                                   │
│    title: "Acceso desigual a servicios de atención primaria en zona rural"         │
│    relatedEvidenceIds: ["atom-1847", "atom-2104", "atom-3922"]                     │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  EvidenceAtom {                                                                      │
│    id: "atom-1847"                                                                  │
│    kind: "determinant"                                                              │
│    content: "Distancia media 15 km a centro de salud"                               │
│    provenance: {                                                                    │
│      origin: "health-report"                                                        │
│      documentId: "doc-healthcare-profile-2024"                                      │
│      sectionId: "cap-ii-determinantes"                                              │
│      pageRef: "p. 24-26"                                                            │
│    }                                                                                 │
│  }                                                                                   │
│    ↓ (vinculación)                                                                   │
│  MunicipalDocument {                                                                 │
│    id: "doc-healthcare-profile-2024"                                                │
│    title: "Informe de Salud Territorios Periurbanos — 2024"                        │
│    kind: "health-report"                                                            │
│    linkedDocumentId: "storage-uuid-xxx"                                             │
│    source: "SEDHAP / Consejería de Salud de Andalucía"                             │
│  }                                                                                   │
│                                                                                      │
│  ✅ CADENA COMPLETA VERIFICABLE Y AUDITABLE                                        │
│     De cualquier ítem de monitoreo hasta su origen en documentación oficial         │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ESTADO DE IMPLEMENTACIÓN POR COMPONENTE

| Componente | Código | Tipo | Estado | Gap |
|---|---|---|---|---|
| **NIVEL 0: EvidenceStore** | `domain/evidence`, `application/evidence` | Infraestructura | ✅ Funcional | Ninguno |
| **NIVEL 1: MIT (LT1)** | `application/lt1/LT1Engine.ts` | Motor | ✅ Funcional | Ninguno |
| **NIVEL 1: OIT** | `application/oit/OITEngine.ts` | Motor | ✅ Funcional | Ninguno |
| **NIVEL 2: PSL** | `application/health-profile/buildLocalHealthProfile.ts` | Generador | ✅ Funcional | Ninguno |
| **NIVEL 2: Compilación PSL-C** | `application/health-profile-compiler/LocalHealthProfileCompiler.ts` | Compilador | ✅ Funcional | Ninguno |
| **NIVEL 3: Priorización** | `application/prioritization/PrioritizationEngine.ts` | Motor | ✅ Funcional | Ninguno |
| **NIVEL 3: Traducción EPVSA** | `application/epvsa/EPVSATranslator.ts` | Motor | ⚠️ Provisional | H-02: MTE canónico |
| **NIVEL 3: Plan de Acción** | `application/action-plan/ActionPlanEngine.ts` | Motor | ✅ Borrador funcional | Validación formal, indicadores detallados |
| **NIVEL 3: Agenda** | `application/agenda/AgendaEngine.ts` | Motor | ✅ Borrador funcional | Validación formal, calendario real |
| **NIVEL 4: Compilación PLS** | **FALTA** | Compilador | 🔴 PENDIENTE | H-06: LocalHealthPlanCompiler |
| **Strategic Framework Registry** | **FALTA** | Infraestructura | 🔴 PENDIENTE | H-03: StrategicFrameworkRegistry |
| **Validación Formal (UI)** | `ui/components/FormalValidationForm.tsx` | UI | ✅ Funcional | Consumo en pipeline no integrado |
| **Action Template Library** | **FALTA** | Librería | 🔴 PENDIENTE | Necesaria para ciclos posteriores |

---

## DECISIONES CRÍTICAS PENDIENTES

### D-PLS-1: ¿Cómo incluye el PLS su diagnóstico?

**Opción A (Recomendada):** Referencia ligera a PSL-C compilado
```
PLS.diagnosticoTerritorial = { 
  sourcePSLId: "psl-xxx", 
  sourcePSLCVersion: "PSL-C/v1",
  referencePath: "url/compas/psl-artifact/psl-xxx"
}
```
✅ Ventaja: No duplica contenido, trazabilidad clara, versionable

**Opción B:** PSL-C incluido físicamente
```
PLS.diagnosticoTerritorial = { 
  pslcContent: { ... entire PSL-C ... }
}
```
❌ Desventaja: Duplicación, pérdida de versioning, dificulta auditoría

### D-FRAMEWORK-1: ¿Cómo se integran múltiples marcos?

**Opción:** `StrategicFrameworkRegistry` centralizado + búsqueda multimarco
```
SELECT objetivos 
FROM registry 
WHERE (framework IN ["EPVSA", "ESCA", "RELAS"]) 
  AND (keywords MATCH priority.keywords)
  AND (targetPopulation COMPATIBLE WITH psl.targetPopulation)
```

---

*Fin del diagrama y documentación visual del pipeline PSL*
