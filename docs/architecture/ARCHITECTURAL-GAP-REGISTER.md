# COMPÁS NG — Architectural Gap Register

> Registro de huecos arquitectónicos, decisiones abiertas y deuda clasificada.
> No es una hoja de ruta ni una lista de tareas.
> Su función es distinguir entre deuda técnica real, implementación pendiente,
> investigación metodológica y decisiones todavía abiertas.

---

## 1. Propósito

Este documento clasifica los huecos detectados entre:

1. arquitectura declarada;
2. arquitectura implementada;
3. contratos metodológicos;
4. productos institucionales previstos.

El objetivo es evitar que todo lo no implementado aparezca mezclado bajo la palabra
"pendiente".

---

## 2. Categorías

| Categoría | Significado |
|---|---|
| **Deuda técnica** | Algo implementado de forma provisional o incompleta que deberá corregirse. |
| **Implementación pendiente** | Algo diseñado y contractualizado, pero todavía no construido. |
| **Decisión metodológica abierta** | Algo cuyo diseño todavía requiere decisión conceptual. |
| **Investigación metodológica** | Algo que necesita contraste documental, bibliográfico o metodológico. |
| **Reserva arquitectónica** | Diseño deliberadamente preservado para una fase futura. |

---

## 3. Huecos arquitectónicos registrados

| ID | Hueco | Categoría | Evidencia | Estado | Bloquea | Prioridad |
|---|---|---|---|---|---|---|
| H-01 | Biblioteca Metodológica incompleta para DUKE, PREDIMED, SF-12, Sueño y CAGE | Deuda técnica | `CONTRACT-COMPLEMENTARY-STUDIES.md §9a`; `domain/methodology/registry.ts`; parsers EAS implementados | Reconocida | Constructor REDCap completo / validación metodológica | Alta |
| H-02 | Motor de Traducción Estratégica canónico (MTE) | Implementación pendiente | `CONTRACT-STRATEGIC-TRANSLATION.md`; `BLUEPRINT-PRODUCTION.md`; `EPVSATranslator` provisional | Diseñado contractualmente | Sustitución de EPVSATranslator / Plan Local de Salud robusto | Alta |
| H-03 | Strategic Repository gestionable | Implementación pendiente | `CONTRACT-STRATEGIC-REPOSITORY.md`; menciones en MTE y Blueprint | Diseñado contractualmente | MTE | Alta |
| H-04 | Flujo institucional de aprobación del PSL (`validated` → `approved`) | Implementación pendiente (parcial) | `approvePSL.ts`; `PSLApprovalRecord`; `handleApprovePSL` en `App.tsx`; `PSLApproveAction` en `LocalHealthProfileView.tsx` | Integración UI completada (Sprint 2); consumo por `LocalHealthPlanCompiler` pendiente | LocalHealthPlanCompiler / PLS | Alta |
| H-05 | Validación formal de ActionPlanDraft, AgendaDraft y MonitoringDraft | Implementación pendiente (parcial) | `FormalValidationRecord`; `createFormalValidation.ts`; `FormalValidationForm`; `handleFormalValidation` en `App.tsx` | UI integrada en ActionPlanPanel y AgendaPanel (Sprint 2); consumo por `LocalHealthPlanCompiler` pendiente | LocalHealthPlanCompiler / PLS | Alta |
| H-06 | LocalHealthPlanCompiler | Implementación pendiente | `CONTRACT-LOCAL-HEALTH-PLAN-COMPILER.md`; `CompilationManifest`; `LocalHealthPlanDocument` | Contrato existente, implementación pendiente | Producto PLS | Alta |
| H-07 | Necesidades no priorizadas (`UnaddressedNeed[]`) integradas en Plan de Acción | Implementación pendiente | `LocalHealthPlanDocument.ts`; `CONTRACT-LOCAL-HEALTH-PLAN-COMPILER.md`; ausencia en `ActionPlanDraft` | Tipo definido en PLS, no integrado en ActionPlanDraft | Gates del PLS | Media |
| H-08 | Resumen Ejecutivo como sección inicial del PLS | Implementación pendiente | `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md`; `BENCHMARK-INSTITUTIONAL-PRODUCTS.md`; Gap Register H-14 absorbido | Decisión metodológica resuelta; pendiente de implementación en LocalHealthPlanCompiler | LocalHealthPlanCompiler / exportación PLS | Media |
| H-09 | SAM — Tripirámide visual y EvidenceAtoms | Implementación pendiente | `CONTRACT-DYNAMIC-TRIPYRAMID.md`; motor + integración implementados (Producto 2, 2026-06-29); visualización y `kind: "sample-quality"` pendientes | Motor puro implementado; capa de integración implementada | Tripirámide visual; generación de EvidenceAtoms desde SAM; integración en workspace | Media |
| H-10 | Integración Constructor Metodológico → REDCap → EvidenceStore | Implementación pendiente | `QuestionnaireBuilder`; `RedcapDictionaryBuilder`; `RedcapDictionaryCsvExporter`; ausencia de ciclo end-to-end | Builder y exportador básicos existen; integración completa no implementada | Ciclo Encuesta Municipal completo | Media |
| H-11 | Visor PDF nativo para Informe de Salud | Implementación pendiente | `PdfToHealthReport.ts`; ROADMAP deuda documentada; visor actual no nativo | Deuda documentada, no bloqueante | UX documental | Baja |
| H-12 | Anexo Técnico Metodológico | Implementación pendiente + decisión estructural menor | `INSTITUTIONAL-PRODUCTS-ARCHITECTURE.md`; `METHODOLOGICAL-FOUNDATIONS`; relación con SAM | Producto identificado; estructura y compilador pendientes | Producto documental metodológico | Media |
| H-13 | Memoria endocualitativa del proceso local | Reserva arquitectónica | `FOUNDATIONS.md`; `ROADMAP.md`; principio endocualitativo | Principio definido, mecanismo no diseñado | Memoria longitudinal del proceso | Media |
| H-14 | ExecutiveSummaryArtifact como tipo independiente | Retirado / absorbido | `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md`; H-08 | Absorbido por H-08; no debe implementarse como artefacto autónomo salvo nueva decisión metodológica | Nada | Baja |
| H-15 | D-HR-01 — Health-report como fuente primaria no atomizable | Decisión metodológica abierta | `src/application/health-report/HealthReportToEvidencePipeline.ts`; `src/App.tsx:715`; `CONTRACT-EVIDENCE.md §5.1`; `CONTRACT-REPOSITORY.md §3`; `docs/architecture/DOMAIN-MODEL.md §3` | Contradicción entre regla metodológica (el Informe de Salud no debe convertirse en EvidenceAtom) y pipeline dedicada activa que lo hace | Revisión metodológica + sprint específico | Alta |

---

## H-15 — D-HR-01: Health-report como fuente primaria no atomizable

**Categoría:** Decisión metodológica abierta
**Identificador interno:** D-HR-01
**Detectada:** 2026-07-07
**Estado:** Contradicción documentada. No resuelta. Bloqueada hasta sprint específico.

### Estado actual del código

`src/domain/repository/MunicipalDocumentRepository.ts` define:

```typescript
function defaultCanGenerateEvidence(kind: DocumentKind): boolean {
  return kind !== "health-report";
}
```

Este flag bloquea la pipeline genérica (`DocumentToEvidencePipeline`) para el Informe de Salud.

Sin embargo, `src/application/health-report/HealthReportToEvidencePipeline.ts` es una pipeline dedicada que convierte cada sección del `HealthReportDocument` en un `EvidenceAtom` con `origin: "health-report"`. Es llamada explícitamente en `src/App.tsx:715` durante `handleLoadHealthReport`:

```typescript
const hrAtoms = healthReportToEvidenceAtoms(healthReport);
// → atoms añadidos al EvidenceStore con origin: "health-report"
```

Los átomos resultantes alimentan el MIT, que tiene `KIND_CONSTRAINTS["health-report"]` definido en el IntegrityGuard. El PSL consume estos átomos a través del EvidenceStore.

### Regla metodológica consolidada

El Informe de Salud del Territorio es una fuente epidemiológica oficial, institucional, canónica e íntegra. Debe:

- cargarse, conservarse y visualizarse íntegramente;
- mantenerse literal como fuente diagnóstica primaria;
- compilarse o referenciarse como base del Perfil de Salud Local.

No debe:
- convertirse en EvidenceAtom ordinario ni ser procesado por ninguna pipeline de atomización;
- mezclarse con el flujo de evidencia territorial genérica;
- ser sustituido por inferencia automática del motor.

El Perfil de Salud Local no es una copia del Informe de Salud. El Perfil parte del Informe como base epidemiológica oficial y lo amplía con interpretación territorial desde sociología de la salud, epidemiología social, determinantes sociales, salutogénesis, activos comunitarios, participación ciudadana y conocimiento profesional del equipo técnico.

### Contradicción

`canGenerateEvidence = false` bloquea únicamente la pipeline genérica. No bloquea `HealthReportToEvidencePipeline`, que opera por una ruta paralela explícita. El Informe de Salud sí genera `EvidenceAtom` hoy, en contradicción con la regla metodológica consolidada.

El `CONTRACT-EVIDENCE.md §5.1` describe esta pipeline como "explícita y controlada, no automática", lo que es técnicamente correcto pero no resuelve la contradicción metodológica de fondo: el contenido del informe oficial se atomiza y entra en el mismo pipeline analítico que cualquier otra fuente documental.

### Impacto potencial si se resuelve

Resolver D-HR-01 implicaría:
1. Eliminar o desconectar `HealthReportToEvidencePipeline` del flujo de `App.tsx`.
2. Decidir qué consume el MIT si no hay átomos de `origin: "health-report"` en el store.
3. Revisar si los compiladores PSL-C y PSL-NHS leen directamente el `HealthReportDocument` en lugar del EvidenceStore para la dimensión epidemiológica.
4. Actualizar `CONTRACT-EVIDENCE.md §5.1`, `CONTRACT-MIT-PSL.md §3` y posiblemente `CONTRACT-REPOSITORY.md`.
5. Adaptar los tests que verifican átomos con `origin: "health-report"`.

Este impacto afecta al Nivel 1, al Nivel 2 y a los compiladores del Nivel 3. No es un cambio puntual.

### Decisión pendiente

¿Debe el Informe de Salud contribuir al EvidenceStore como átomos (modelo actual) o debe permanecer como objeto `HealthReportDocument` de solo lectura, accesible directamente por los compiladores institucionales sin pasar por el MIT?

Esta decisión requiere deliberación metodológica explícita con el equipo técnico. No puede resolverse sin un sprint dedicado con contrato previo.

### Restricciones

- No resolver sin sprint específico y contrato previo aprobado.
- No modificar `HealthReportToEvidencePipeline`, `CONTRACT-EVIDENCE.md`, `CONTRACT-MIT-PSL.md` ni `CONTRACT-REPOSITORY.md` fuera de ese sprint.
- La pipeline actual puede seguir operativa mientras la decisión esté abierta.

## 4. No son deuda

Los siguientes elementos aparecen como "pendientes" o "provisionales" en grep, pero no
deben clasificarse como deuda técnica:

- La interpretación marcada como provisional.
- La exigencia de validación humana.
- La ausencia de estado global fuera de municipio.
- La inexistencia de átomos huérfanos.
- Los outputs bloqueados hasta PSL validado.
- Los componentes reservados para fases futuras.
- Las referencias bibliográficas pendientes de contraste, salvo cuando bloqueen la validación de un módulo.

---

## 5. Principio rector

No todo hueco debe cerrarse inmediatamente.

Un hueco solo debe convertirse en tarea de implementación cuando:

1. bloquea un producto institucional;
2. tiene contrato suficiente;
3. no requiere una decisión metodológica previa;
4. puede ejecutarse con intervención mínima, reversible y verificable.

