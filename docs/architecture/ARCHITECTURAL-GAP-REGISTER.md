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
| H-09 | SAM / calidad muestral | Investigación metodológica + implementación pendiente | `CONTRACT-DYNAMIC-TRIPYRAMID.md`; `EvidenceOrigin: "sam"` reservado; Blueprint | Diseñado como futuro | Evaluación de calidad muestral | Media |
| H-10 | Integración Constructor Metodológico → REDCap → EvidenceStore | Implementación pendiente | `QuestionnaireBuilder`; `RedcapDictionaryBuilder`; `RedcapDictionaryCsvExporter`; ausencia de ciclo end-to-end | Builder y exportador básicos existen; integración completa no implementada | Ciclo Encuesta Municipal completo | Media |
| H-11 | Visor PDF nativo para Informe de Salud | Implementación pendiente | `PdfToHealthReport.ts`; ROADMAP deuda documentada; visor actual no nativo | Deuda documentada, no bloqueante | UX documental | Baja |
| H-12 | Anexo Técnico Metodológico | Implementación pendiente + decisión estructural menor | `INSTITUTIONAL-PRODUCTS-ARCHITECTURE.md`; `METHODOLOGICAL-FOUNDATIONS`; relación con SAM | Producto identificado; estructura y compilador pendientes | Producto documental metodológico | Media |
| H-13 | Memoria endocualitativa del proceso local | Reserva arquitectónica | `FOUNDATIONS.md`; `ROADMAP.md`; principio endocualitativo | Principio definido, mecanismo no diseñado | Memoria longitudinal del proceso | Media |
| H-14 | ExecutiveSummaryArtifact como tipo independiente | Retirado / absorbido | `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md`; H-08 | Absorbido por H-08; no debe implementarse como artefacto autónomo salvo nueva decisión metodológica | Nada | Baja |

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

