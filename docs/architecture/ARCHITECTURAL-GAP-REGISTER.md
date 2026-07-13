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
| H-01 | ~~Biblioteca Metodológica incompleta para DUKE, PREDIMED, SF-12, Sueño y CAGE~~ **CERRADO** | ~~Deuda técnica~~ | `CONTRACT-COMPLEMENTARY-STUDIES.md §9a`; todos los 13 instrumentos tienen `MethodologicalModule` registrado en `domain/methodology/registry.ts` | ✓ Cerrado — 2026-07-13 | ~~Constructor REDCap~~ — cerrado | ~~Alta~~ **Cerrada** |
| H-02 | Motor de Traducción Estratégica canónico (MTE) | Implementación pendiente | `CONTRACT-STRATEGIC-TRANSLATION.md`; `BLUEPRINT-PRODUCTION.md`; `EPVSATranslator` provisional | Diseñado contractualmente | Sustitución de EPVSATranslator / Plan Local de Salud robusto | Alta |
| H-03 | Strategic Repository gestionable | Implementación pendiente | `CONTRACT-STRATEGIC-REPOSITORY.md`; menciones en MTE y Blueprint | Diseñado contractualmente | MTE | Alta |
| H-04 | Flujo institucional de aprobación del PSL (`validated` → `approved`) | Implementación pendiente (parcial) | `approvePSL.ts`; `PSLApprovalRecord`; `handleApprovePSL` en `App.tsx`; `PSLApproveAction` en `LocalHealthProfileView.tsx` | Integración UI completada (Sprint 2); consumo por `LocalHealthPlanCompiler` pendiente | LocalHealthPlanCompiler / PLS | Alta |
| H-05 | Validación formal de ActionPlanDraft, AgendaDraft y MonitoringDraft | Implementación pendiente (parcial) | `FormalValidationRecord`; `createFormalValidation.ts`; `FormalValidationForm`; `handleFormalValidation` en `App.tsx` | UI integrada en ActionPlanPanel y AgendaPanel (Sprint 2); consumo por `LocalHealthPlanCompiler` pendiente | LocalHealthPlanCompiler / PLS | Alta |
| H-06 | LocalHealthPlanCompiler | Implementación pendiente | `CONTRACT-LOCAL-HEALTH-PLAN-COMPILER.md`; `CompilationManifest`; `LocalHealthPlanDocument` | Contrato existente, implementación pendiente | Producto PLS | Alta |
| H-07 | Necesidades no priorizadas (`UnaddressedNeed[]`) integradas en Plan de Acción | Implementación pendiente | `LocalHealthPlanDocument.ts`; `CONTRACT-LOCAL-HEALTH-PLAN-COMPILER.md`; ausencia en `ActionPlanDraft` | Tipo definido en PLS, no integrado en ActionPlanDraft | Gates del PLS | Media |
| H-08 | Resumen Ejecutivo como sección inicial del PLS | Implementación pendiente | `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md`; `BENCHMARK-INSTITUTIONAL-PRODUCTS.md`; Gap Register H-14 absorbido | Decisión metodológica resuelta; pendiente de implementación en LocalHealthPlanCompiler | LocalHealthPlanCompiler / exportación PLS | Media |
| H-09 | SAM — Tripirámide visual y EvidenceAtoms | Implementación pendiente (parcial) | `CONTRACT-DYNAMIC-TRIPYRAMID.md`; motor + integración implementados; `populationReferenceRegistry.ts` añadido; IBSEPanel consume SAM cuando ref. disponible (2026-07-13) | Motor implementado; IBSEPanel parcialmente conectado; Tripirámide visual y EvidenceAtoms pendientes | Tripirámide visual; `kind: "sample-quality"` EvidenceAtoms; otros paneles sin conexión SAM | Media |
| H-10 | Integración Constructor Metodológico → REDCap → EvidenceStore | Implementación pendiente | `QuestionnaireBuilder`; `RedcapDictionaryBuilder`; `RedcapDictionaryCsvExporter`; ausencia de ciclo end-to-end | Builder y exportador básicos existen; integración completa no implementada | Ciclo Encuesta Municipal completo | Media |
| H-11 | Visor PDF nativo para Informe de Salud | Implementación pendiente | `PdfToHealthReport.ts`; ROADMAP deuda documentada; visor actual no nativo | Deuda documentada, no bloqueante | UX documental | Baja |
| H-12 | Anexo Técnico Metodológico | Implementación pendiente + decisión estructural menor | `INSTITUTIONAL-PRODUCTS-ARCHITECTURE.md`; `METHODOLOGICAL-FOUNDATIONS`; relación con SAM | Producto identificado; estructura y compilador pendientes | Producto documental metodológico | Media |
| H-13 | Memoria endocualitativa del proceso local | Reserva arquitectónica | `FOUNDATIONS.md`; `ROADMAP.md`; principio endocualitativo | Principio definido, mecanismo no diseñado | Memoria longitudinal del proceso | Media |
| H-14 | ExecutiveSummaryArtifact como tipo independiente | Retirado / absorbido | `CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT.md`; H-08 | Absorbido por H-08; no debe implementarse como artefacto autónomo salvo nueva decisión metodológica | Nada | Baja |
| H-15 | D-HR-01 — Health-report como fuente primaria no atomizable | ~~Decisión metodológica abierta~~ **RESUELTA** | `src/App.tsx`; `CONTRACT-EVIDENCE.md §5.1`; `CONTRACT-REPOSITORY.md §3` | ~~Contradicción entre regla metodológica y pipeline activa~~ Resuelta: DOCX/PDF no generan EvidenceAtom; pipeline aislada | ✓ Resuelto — 2026-07-07 | ~~Alta~~ **Cerrada** |
| H-16 | BADEA/IECA — Ingesta de indicadores municipales | Implementación pendiente | Necesidad de datos municipales BADEA/IECA; riesgo de duplicación; granularidad municipal variable; decisión sobre `EvidenceOrigin` pendiente | Sin parser específico; próximo paso: piloto controlado con consulta verificada, guion de normalización y prueba de ingesta | **Pendiente de piloto controlado** — línea inmediata de trabajo | Media |

---

## H-15 — D-HR-01: Health-report como fuente primaria no atomizable

**Categoría:** ~~Decisión metodológica abierta~~ → **RESUELTA**
**Identificador interno:** D-HR-01
**Detectada:** 2026-07-07
**Resuelta:** 2026-07-07

> **Estado:** CERRADA. La contradicción ha sido neutralizada en el flujo activo del producto.
> `HealthReportToEvidencePipeline` queda aislada fuera de la ruta de carga institucional.
> Ver condiciones de cierre a continuación.

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

### Condiciones de cierre (2026-07-07)

1. **DOCX no genera EvidenceAtom.** La llamada a `healthReportToEvidenceAtoms` ha sido eliminada de `handleLoadHealthReport` en `App.tsx`. El flujo activo de carga DOCX ya no llama a la función.
2. **PDF no genera EvidenceAtom.** `createHealthReportDocumentFromPdf` no extrae texto ni crea secciones diagnósticas. La función es síncrona y produce un `HealthReportDocument` con `sections: []` y `body.originalText: ""`.
3. **`HealthReportToEvidencePipeline` aislada.** La función `healthReportToEvidenceAtoms` permanece en el código como utilidad accesible para tests y análisis histórico, pero no está importada ni llamada desde ningún camino institucional de carga.
4. **Átomos legacy purgados.** El flujo de carga filtra `atoms.filter(a => a.provenance.origin !== "health-report")` para limpiar el store antes de actualizar el workspace.
5. **Contratos actualizados.** `CONTRACT-EVIDENCE.md §5.1`, `CONTRACT-REPOSITORY.md §3` y `CONTRACT-MIT-PSL.md §3` reflejan el nuevo estatuto.
6. **`canGenerateEvidence = false`** para `kind: "health-report"` por defecto en el repositorio.

### Restricciones históricas (cumplidas)

~~No resolver sin sprint específico y contrato previo aprobado.~~
~~No modificar `HealthReportToEvidencePipeline`, `CONTRACT-EVIDENCE.md`, `CONTRACT-MIT-PSL.md` ni `CONTRACT-REPOSITORY.md` fuera de ese sprint.~~
~~La pipeline actual puede seguir operativa mientras la decisión esté abierta.~~

---

## H-16 — BADEA/IECA: Ingesta de indicadores municipales

**Categoría:** Implementación pendiente
**Identificador:** H-16
**Detectado:** 2026-07-07
**Estado:** Pendiente de piloto controlado. Línea inmediata de trabajo para enriquecer territorialmente el Perfil Local de Salud.

### Descripción

BADEA (Banco de Datos Estadísticos de Andalucía) e IECA (Instituto de Estadística y Cartografía de Andalucía) son fuentes de indicadores municipales oficiales (demografía, economía, vivienda, salud). BADEA/IECA puede enriquecer significativamente el diagnóstico territorial del Perfil, aportando indicadores cuantitativos oficiales que actualmente deben introducirse manualmente.

Actualmente no existe un parser específico para ingesta estructurada de estas fuentes en COMPÁS NG. El flujo de integración aún no ha sido pilotado.

### Próximo paso previsto: piloto controlado

Antes de diseñar el parser definitivo, se realizará un piloto controlado que incluye:

1. **Consulta municipal BADEA/IECA verificada**: selección de un municipio concreto y una consulta BADEA reproducible. Verificación de que los datos existen a granularidad municipal y no solo provincial.
2. **Guion externo de normalización**: definición del formato tabular de salida de la consulta BADEA (columnas esperadas, unidades, períodos) antes de implementar ningún código.
3. **Prueba de ingesta**: ingesta del CSV/JSON normalizado en COMPÁS NG, inicialmente mediante el tipo `territorial-documentation` con metadatos de fuente IECA explícitos.
4. **Evaluación de clasificación heurística**: verificar si la clasificación heurística del pipeline genérico clasifica correctamente los indicadores BADEA como `indicator`, `determinant` u otros kinds. Identificar falsos positivos y negativos.
5. **Decisión sobre deduplicación/idempotencia**: evaluar si `addEvidenceAtom` es suficiente o si se necesita `upsertEvidenceAtom` con una clave estable (período + municipio + indicador). Definir la estrategia de reimportación cuando cambian los datos.
6. **Decisión posterior sobre parser específico**: en función del piloto, decidir si se crea un nuevo `DocumentKind` (e.g., `"badea-export"`) con un `EvidenceOrigin` propio (e.g., `"ieca"`) o si se reutiliza `"cmi"` (ya definido pero sin parser activo).

### Necesidades técnicas identificadas

- Granularidad municipal no garantizada para todos los indicadores: algunos solo están disponibles a escala provincial o comarcal.
- Riesgo de duplicación por reimportación de la misma consulta con diferentes fechas de descarga.
- Sincronización futura de `PopulationReference` (datos de padrón) desde vía distinta al repositorio documental.
- El `EvidenceOrigin` adecuado requiere decisión explícita antes de implementar el parser.

### Estado actual y relación con productos

- **No implementado.** No hay parser, no hay `DocumentKind` específico, no hay `EvidenceOrigin` propio para BADEA/IECA.
- **No bloquea ningún producto activo** (Perfil Local de Salud, selector documental, IS, IBSE, ni ningún motor del Nivel 2 o 3).
- **Sí es línea inmediata de trabajo** para enriquecer el Perfil Local de Salud con indicadores cuantitativos oficiales de contexto territorial.

### Restricciones

- No implementar parser definitivo sin completar el piloto controlado.
- No usar `"other"` como origen para datos BADEA/IECA en producción.
- No añadir indicadores BADEA manualmente como `territorial-documentation` sin declarar explícitamente la fuente IECA en los metadatos del documento.

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

