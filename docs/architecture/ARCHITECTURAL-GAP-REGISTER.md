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

| ID | Hueco | Categoría | Estado | Bloquea | Prioridad |
|---|---|---|---|---|---|
| H-01 | Biblioteca Metodológica incompleta para DUKE, PREDIMED, SF-12, Sueño y CAGE | Deuda técnica | Reconocida | Constructor REDCap completo / validación metodológica | Alta |
| H-02 | Motor de Traducción Estratégica canónico (MTE) | Implementación pendiente | Diseñado contractualmente | Sustitución de EPVSATranslator / Plan Local de Salud robusto | Alta |
| H-03 | Strategic Repository gestionable | Implementación pendiente | Diseñado contractualmente | MTE | Alta |
| H-04 | Transición institucional PSL `validated` → `approved` | Implementación pendiente | Tipos definidos, UI pendiente | LocalHealthPlanCompiler / PLS | Alta |
| H-05 | Validación formal de ActionPlanDraft, AgendaDraft y MonitoringDraft | Implementación pendiente | Tipos parciales definidos | LocalHealthPlanCompiler / PLS | Alta |
| H-06 | LocalHealthPlanCompiler | Implementación pendiente | Contrato existente, implementación pendiente | Producto PLS | Alta |
| H-07 | Necesidades no priorizadas (`UnaddressedNeed[]`) integradas en Plan de Acción | Implementación pendiente | Tipo definido en PLS, no integrado en ActionPlanDraft | Gates del PLS | Media |
| H-08 | Resumen Ejecutivo como sección/export independiente del PLS | Decisión metodológica abierta | Decisión parcialmente resuelta en contrato PLS | Producto comunicativo político | Media |
| H-09 | SAM / calidad muestral | Investigación metodológica + implementación pendiente | Diseñado como futuro | Evaluación de calidad muestral | Media |
| H-10 | Parser de resultados del Constructor REDCap → EvidenceStore | Implementación pendiente | No implementado | Ciclo Encuesta Municipal completo | Media |
| H-11 | Visor PDF nativo para Informe de Salud | Implementación pendiente | Deuda documentada, no bloqueante | UX documental | Baja |
| H-12 | Anexo Técnico Metodológico | Decisión metodológica abierta | Sin definición estructural | Producto documental metodológico | Media |
| H-13 | Memoria endocualitativa del proceso local | Reserva arquitectónica | Principio definido, mecanismo no diseñado | Memoria longitudinal del proceso | Media |
| H-14 | ExecutiveSummaryArtifact como tipo independiente | Decisión metodológica abierta | Evitar duplicidad con sección inicial del PLS | Arquitectura de compiladores | Baja |

---

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

