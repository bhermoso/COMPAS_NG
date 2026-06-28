# AUDITORÍA DE IMPLEMENTACIÓN

==============================
PANELES Y COMPONENTES
==============================
src/application/agenda/AgendaEngine.ts
src/application/questionnaire/QuestionnaireBuilder.ts
src/application/questionnaire/redcap/RedcapDictionaryBuilder.ts
src/domain/questionnaire/QuestionnaireDefinition.ts
src/domain/questionnaire/QuestionnaireProject.ts
src/domain/questionnaire/artifacts/QuestionnaireArtifact.ts
src/domain/strategic-framework/StrategicFramework.ts
src/domain/strategic-framework/createStrategicFramework.ts
src/domain/strategy/StrategicFrameworkRegistry.ts
src/ui/components/ActionPlanPanel.tsx
src/ui/components/AgendaPanel.tsx
src/ui/components/CAGEPanel.tsx
src/ui/components/DUKEPanel.tsx
src/ui/components/DocumentIngestionPanel.tsx
src/ui/components/DocumentRepositoryPanel.tsx
src/ui/components/EPVSAPanel.tsx
src/ui/components/EstudiosComplementariosPanel.tsx
src/ui/components/EvidenceStorePanel.tsx
src/ui/components/IBSEPanel.tsx
src/ui/components/LT1Panel.tsx
src/ui/components/LocalHealthProfilePanel.tsx
src/ui/components/MonitoringPanel.tsx
src/ui/components/MunicipalInventoryPanel.tsx
src/ui/components/OITPanel.tsx
src/ui/components/PREDIMEDPanel.tsx
src/ui/components/PipelineTracePanel.tsx
src/ui/components/PrioritizationPanel.tsx
src/ui/components/QuestionnaireBuilderPanel.tsx
src/ui/components/ReconciliacionPanel.tsx
src/ui/components/SF12Panel.tsx
src/ui/components/StrategicFrameworkPanel.tsx
src/ui/components/SuenoPanel.tsx
src/ui/components/ThematicPrioritisationPanel.tsx

==============================
COMPONENTES REFERENCIADOS
==============================

----- QuestionnaireBuilderPanel -----
src/ui/components/index.ts:28:export * from "./QuestionnaireBuilderPanel";
src/ui/components/QuestionnaireBuilderPanel.tsx:6:export function QuestionnaireBuilderPanel() {

----- LocalHealthProfilePanel -----
src/ui/components/index.ts:14:export * from "./LocalHealthProfilePanel";
src/ui/components/LocalHealthProfilePanel.tsx:1:export function LocalHealthProfilePanel() {

----- StrategicFrameworkPanel -----
src/App.css:895:/* ── StrategicFrameworkPanel ──────────────────────────────── */
src/ui/components/index.ts:26:export * from "./StrategicFrameworkPanel";
src/ui/components/StrategicFrameworkPanel.tsx:3:interface StrategicFrameworkPanelProps {
src/ui/components/StrategicFrameworkPanel.tsx:7:export function StrategicFrameworkPanel({ framework }: StrategicFrameworkPanelProps) {

----- ActionPlan -----
src/App.tsx:69:  ActionPlanPanel,
src/App.tsx:1879:            <ActionPlanPanel
src/application/action-plan/ActionPlanEngine.ts:43:export interface ActionPlanObjective {
src/application/action-plan/ActionPlanEngine.ts:51:export interface ActionPlanAction {
src/application/action-plan/ActionPlanEngine.ts:61:export interface ActionPlanIndicator {
src/application/action-plan/ActionPlanEngine.ts:69:export interface ActionPlanDraft {
src/application/action-plan/ActionPlanEngine.ts:74:  objectives: ActionPlanObjective[];
src/application/action-plan/ActionPlanEngine.ts:75:  actions: ActionPlanAction[];
src/application/action-plan/ActionPlanEngine.ts:76:  indicators: ActionPlanIndicator[];
src/application/action-plan/ActionPlanEngine.ts:106:export function generateActionPlanDraft(
src/application/action-plan/ActionPlanEngine.ts:111:): ActionPlanDraft {
src/application/action-plan/ActionPlanEngine.ts:125:      action: null as ActionPlanAction | null, // filled below
src/application/action-plan/ActionPlanEngine.ts:234:): ActionPlanObjective {
src/application/action-plan/ActionPlanEngine.ts:250:): ActionPlanAction {
src/application/action-plan/ActionPlanEngine.ts:264:  action: ActionPlanAction,
src/application/action-plan/ActionPlanEngine.ts:266:): ActionPlanIndicator[] {
src/application/action-plan/index.ts:1:export * from "./ActionPlanEngine";
src/application/agenda/AgendaEngine.ts:1:import type { ActionPlanAction, ActionPlanDraft } from "../action-plan";
src/application/agenda/AgendaEngine.ts:23:export function generateAgendaDraft(actionPlan: ActionPlanDraft): AgendaDraft {
src/application/agenda/AgendaEngine.ts:40:  action: ActionPlanAction,
src/application/runtime/MunicipalityRuntime.ts:11:import type { ActionPlanDraft } from "../action-plan";
src/application/runtime/MunicipalityRuntime.ts:12:import { generateActionPlanDraft } from "../action-plan";
src/application/runtime/MunicipalityRuntime.ts:61:  actionPlan: ActionPlanDraft;
src/application/runtime/MunicipalityRuntime.ts:79:  // por el MIT (interpretación territorial) y el motor de acción (ActionPlan).
src/application/runtime/MunicipalityRuntime.ts:146:  const actionPlan = generateActionPlanDraft(epvsa, frameworks, psl, pslIsStale);
src/application/runtime/MunicipalityRuntime.ts:188:    actionPlan: ActionPlanDraft;
src/ui/components/ActionPlanPanel.tsx:2:import type { ActionPlanDraft, FrameworkAlignment } from "../../application/action-plan";
src/ui/components/ActionPlanPanel.tsx:4:interface ActionPlanPanelProps {
src/ui/components/ActionPlanPanel.tsx:5:  actionPlan: ActionPlanDraft;
src/ui/components/ActionPlanPanel.tsx:17:// Muestra los frameworkAlignments ya calculados por ActionPlanEngine.
src/ui/components/ActionPlanPanel.tsx:78:export function ActionPlanPanel({ actionPlan, isEmpty = false, isBlocked = false }: ActionPlanPanelProps) {
src/ui/components/index.ts:23:export * from "./ActionPlanPanel";
docs/contracts/CONTRACT-ACTION-PLAN.md:33:| `ActionPlanEngine` | `StrategicTranslationResult` + frameworks + `LocalHealthProfile` | `ActionPlanDraft` |
docs/contracts/CONTRACT-ACTION-PLAN.md:34:| `AgendaEngine` | `ActionPlanDraft` | `AgendaDraft` |
docs/contracts/CONTRACT-ACTION-PLAN.md:61:            ActionPlanEngine ◄── PSL (PSLReference) ────────────┘
docs/contracts/CONTRACT-ACTION-PLAN.md:84:            └─▶ ActionPlanAction.linkedObjectiveId
docs/contracts/CONTRACT-ACTION-PLAN.md:85:                    └─▶ ActionPlanObjective.linkedStrategicLine  (EPVSA)
docs/contracts/CONTRACT-ACTION-PLAN.md:249:## 8. Plan de Acción (`ActionPlanEngine`)
docs/contracts/CONTRACT-ACTION-PLAN.md:276:**Objetivos (`ActionPlanObjective`)**
docs/contracts/CONTRACT-ACTION-PLAN.md:285:**Actuaciones (`ActionPlanAction`)**
docs/contracts/CONTRACT-ACTION-PLAN.md:296:**Indicadores preliminares (`ActionPlanIndicator`)**
docs/contracts/CONTRACT-ACTION-PLAN.md:500:| `ActionPlanDraft` | El equipo revisa objetivos, actuaciones e indicadores; asigna responsables y recursos |
docs/contracts/CONTRACT-ACTION-PLAN.md:524:Los `ActionPlanIndicator` generados por el motor son scaffolds de medición.
docs/contracts/CONTRACT-ACTION-PLAN.md:552:explícitamente al objeto `ActionPlanDraft`. La interfaz lo señala con un
docs/contracts/CONTRACT-COMPILER.md:59:| `ActionPlanDraft` | Borrador técnico del Nivel 3. Objetivos, actuaciones e indicadores preliminares. Requiere validación humana | Implementado |
docs/contracts/CONTRACT-COMPILER.md:114:El `ActionPlanDraft` generado por el Nivel 3, revisado por el equipo técnico
docs/contracts/CONTRACT-COMPILER.md:271:El `ActionPlanDraft` del Nivel 3 es un borrador técnico interno. Si se
docs/contracts/CONTRACT-MIT-PSL.md:542:- El `ActionPlanDraft` incluye `pslReference.isStale: true`, informando a

----- Compiler -----
docs/architecture/OPERATING-CONSTITUTION.md:386:| Contrato del Compiler | `docs/contracts/CONTRACT-COMPILER.md` | Compilador del Plan Local de Salud |
docs/contracts/CONTRACT-INDEX.md:124:**Consumidores:** Compiler (futuro).
docs/contracts/CONTRACT-INDEX.md:170:**Consumidores futuros:** Plan de Acción, Compiler.
tests/atarfe-workspace.test.ts:473:  it('Plan de Acción / Agenda / Compiler: evidencia + priorización disponibles', () => {

----- Agenda -----
src/App.tsx:70:  AgendaPanel,
src/App.tsx:446:  // PSL validado: requisito para que el Nivel 3 (Plan, Agenda, Seguimiento) sea accesible.
src/App.tsx:1884:            <AgendaPanel
src/application/agenda/AgendaEngine.ts:3:export type AgendaQuarter = "Q1" | "Q2" | "Q3" | "Q4";
src/application/agenda/AgendaEngine.ts:5:export interface AgendaItemDraft {
src/application/agenda/AgendaEngine.ts:9:  suggestedQuarter: AgendaQuarter;
src/application/agenda/AgendaEngine.ts:16:export interface AgendaDraft {
src/application/agenda/AgendaEngine.ts:18:  annualItems: AgendaItemDraft[];
src/application/agenda/AgendaEngine.ts:23:export function generateAgendaDraft(actionPlan: ActionPlanDraft): AgendaDraft {
src/application/agenda/AgendaEngine.ts:27:      buildAgendaItem(action, index + 1)
src/application/agenda/AgendaEngine.ts:39:function buildAgendaItem(
src/application/agenda/AgendaEngine.ts:42:): AgendaItemDraft {
src/application/agenda/AgendaEngine.ts:56:function inferQuarter(order: number): AgendaQuarter {
src/application/agenda/AgendaEngine.ts:57:  const sequence: AgendaQuarter[] = ["Q1", "Q2", "Q3", "Q4"];
src/application/agenda/index.ts:1:export * from "./AgendaEngine";
src/application/monitoring/MonitoringEngine.ts:1:import type { AgendaDraft } from "../agenda";
src/application/monitoring/MonitoringEngine.ts:27:  agenda: AgendaDraft
src/application/runtime/MunicipalityRuntime.ts:13:import type { AgendaDraft } from "../agenda";
src/application/runtime/MunicipalityRuntime.ts:14:import { generateAgendaDraft } from "../agenda";
src/application/runtime/MunicipalityRuntime.ts:62:  agenda: AgendaDraft;
src/application/runtime/MunicipalityRuntime.ts:147:  const agenda = generateAgendaDraft(actionPlan);
src/application/runtime/MunicipalityRuntime.ts:189:    agenda: AgendaDraft;
src/application/runtime/MunicipalityRuntime.ts:293:        : "Sin evidencia real. Agenda generada sobre pipeline vacío. No representa compromisos ejecutivos.",
src/ui/components/AgendaPanel.tsx:1:import type { AgendaDraft, AgendaQuarter } from "../../application/agenda";
src/ui/components/AgendaPanel.tsx:3:const QUARTER_LABEL: Record<AgendaQuarter, string> = {
src/ui/components/AgendaPanel.tsx:10:interface AgendaPanelProps {
src/ui/components/AgendaPanel.tsx:11:  agenda: AgendaDraft;
src/ui/components/AgendaPanel.tsx:16:export function AgendaPanel({ agenda, isEmpty = false, isBlocked = false }: AgendaPanelProps) {
src/ui/components/AgendaPanel.tsx:21:          <p className="eyebrow">Agenda</p>
src/ui/components/AgendaPanel.tsx:32:          <strong>Agenda anual no disponible</strong>
src/ui/components/index.ts:24:export * from "./AgendaPanel";
src/ui/components/LocalHealthPlanningCycle.tsx:138:      label:       "Agendas anuales",
src/ui/components/MonitoringPanel.tsx:36:            <li>Agenda anual acordada institucionalmente.</li>
src/ui/components/PipelineTracePanel.tsx:28:  "agenda":          "Agenda anual",
docs/architecture/OPERATING-CONSTITUTION.md:57:  │   → Agenda
docs/architecture/OPERATING-CONSTITUTION.md:103:                → Agenda
docs/architecture/OPERATING-CONSTITUTION.md:110:la Agenda y el Seguimiento **no se persisten en localStorage**. Se recalculan en
docs/architecture/OPERATING-CONSTITUTION.md:140:el Motor de Interpretación Territorial, el PSL, el Plan de Acción, la Agenda,
docs/architecture/OPERATING-CONSTITUTION.md:385:| Contrato del Plan de Acción | `docs/contracts/CONTRACT-ACTION-PLAN.md` | Plan de Acción, Agenda, Seguimiento |
docs/contracts/CONTRACT-ACTION-PLAN.md:6:> Motor de Traducción Estratégica, Plan de Acción, Agenda tipo y Seguimiento.
docs/contracts/CONTRACT-ACTION-PLAN.md:34:| `AgendaEngine` | `ActionPlanDraft` | `AgendaDraft` |
docs/contracts/CONTRACT-ACTION-PLAN.md:35:| `MonitoringEngine` | `AgendaDraft` | `MonitoringDraft` |
docs/contracts/CONTRACT-ACTION-PLAN.md:64:            AgendaEngine
docs/contracts/CONTRACT-ACTION-PLAN.md:83:    └─▶ AgendaItemDraft.linkedActionId
docs/contracts/CONTRACT-ACTION-PLAN.md:355:## 9. Agenda tipo (`AgendaEngine`)
docs/contracts/CONTRACT-ACTION-PLAN.md:365:**`AgendaDraft`**
docs/contracts/CONTRACT-ACTION-PLAN.md:371:**`AgendaItemDraft`**
docs/contracts/CONTRACT-ACTION-PLAN.md:388:### 9.4 Cautelas fijas de la Agenda
docs/contracts/CONTRACT-ACTION-PLAN.md:397:### 9.5 Lo que la Agenda no hace
docs/contracts/CONTRACT-ACTION-PLAN.md:410:Transforma la Agenda en un borrador inicial de seguimiento. Registra cada
docs/contracts/CONTRACT-ACTION-PLAN.md:419:- `trackedItems`: uno por ítem de la Agenda.
docs/contracts/CONTRACT-ACTION-PLAN.md:501:| `AgendaDraft` | El equipo asigna calendarios reales, responsables concretos y condiciones de ejecución |
docs/contracts/CONTRACT-ACTION-PLAN.md:535:**I-N3-5 — La Agenda no activa ejecución**
docs/contracts/CONTRACT-ACTION-PLAN.md:537:La existencia de un `AgendaDraft` no activa ningún proceso de ejecución real.
docs/contracts/CONTRACT-ACTION-PLAN.md:686:| 2026-06-24 | Primera redacción. Documenta el estado del código a partir del commit `1e582f5`. Formaliza PSL-C1 en el Nivel 3, la cadena de trazabilidad completa, la heurística EPVSA, `PSLReference`, `FrameworkAlignment`, la distinción Agenda/ejecución y Seguimiento/evaluación, los riesgos conocidos y los criterios de evolución para los stages `evaluation` y `compiler`. |
docs/contracts/CONTRACT-COMPILER.md:75:            └─▶ Nivel 3: Priorización → EPVSA → Plan de Acción → Agenda → Seguimiento
docs/contracts/CONTRACT-COMPILER.md:118:### 5.3 Agenda revisada
docs/contracts/CONTRACT-COMPILER.md:120:El `AgendaDraft` con distribución trimestral ajustada a ciclos municipales
docs/contracts/CONTRACT-COMPILER.md:149:| G-C6 | Agenda con responsables y calendarios reales asignados | Sin mecanismo de asignación implementado |
docs/contracts/CONTRACT-COMPILER.md:185:| IX | Agenda | Distribución temporal validada |
docs/contracts/CONTRACT-COMPILER.md:241:Agenda, Seguimiento). El compilador requiere `"approved"`: una condición
docs/contracts/CONTRACT-COMPILER.md:357:| `CONTRACT-ACTION-PLAN.md` | El Plan de Acción, la Agenda y el Seguimiento del Nivel 3 son capítulos del Plan Local de Salud compilado. El compilador toma como entrada el PSL aprobado y los objetos validados del Nivel 3 derivados de ese PSL |
docs/contracts/CONTRACT-COMPILER.md:370:- **Priorización, EPVSA, Plan de Acción, Agenda y Seguimiento**: véase
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:555:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
docs/contracts/CONTRACT-EVIDENCE.md:427:- **Priorización técnica, EPVSA, Plan de Acción, Agenda y Seguimiento**.
docs/contracts/CONTRACT-INDEX.md:121:Contrato del bloque de Nivel 3: Priorización temática, Motor de Traducción Estratégica (versión inicial), Plan de Acción, Agenda y Seguimiento. Define que ningún motor del Nivel 3 puede producir documentos definitivos sin validación humana explícita.
docs/contracts/CONTRACT-MIT-PSL.md:69:Plan de Acción, Agenda, Seguimiento) solo pueden operar sobre el PSL. No
docs/contracts/CONTRACT-MIT-PSL.md:463:referencia `PSLReference`). La Agenda consume el Plan de Acción. El Seguimiento
docs/contracts/CONTRACT-MIT-PSL.md:464:consume la Agenda.
docs/contracts/CONTRACT-MIT-PSL.md:540:- El Plan de Acción, la Agenda y el Seguimiento son generados a partir del PSL
docs/contracts/CONTRACT-MIT-PSL.md:582:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
docs/contracts/CONTRACT-PERSISTENCE.md:154:(MIT, Reconciliación, PSL no validado, Plan de Acción, Agenda, Seguimiento):
docs/contracts/CONTRACT-PERSISTENCE.md:421:- **Plan de Acción, Agenda, Seguimiento y Compilador**: motores del Nivel 3.
docs/contracts/CONTRACT-REPOSITORY.md:385:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
tests/atarfe-workspace.test.ts:473:  it('Plan de Acción / Agenda / Compiler: evidencia + priorización disponibles', () => {

----- Seguimiento -----
src/App.tsx:446:  // PSL validado: requisito para que el Nivel 3 (Plan, Agenda, Seguimiento) sea accesible.
src/application/monitoring/MonitoringEngine.ts:30:    title: "Seguimiento inicial de actuaciones",
src/application/runtime/MunicipalityRuntime.ts:301:        : "Sin evidencia real. Seguimiento generado sobre pipeline vacío. No refleja ejecución real.",
src/ui/components/MonitoringPanel.tsx:21:          <p className="eyebrow">Seguimiento</p>
src/ui/components/MonitoringPanel.tsx:32:          <strong>Seguimiento no disponible</strong>
src/ui/components/PipelineTracePanel.tsx:29:  "monitoring":      "Seguimiento",
docs/architecture/OPERATING-CONSTITUTION.md:58:  │   → Seguimiento
docs/architecture/OPERATING-CONSTITUTION.md:104:                  → Seguimiento
docs/architecture/OPERATING-CONSTITUTION.md:110:la Agenda y el Seguimiento **no se persisten en localStorage**. Se recalculan en
docs/architecture/OPERATING-CONSTITUTION.md:141:el Seguimiento y el Compilador como objetos productivos.
docs/architecture/OPERATING-CONSTITUTION.md:385:| Contrato del Plan de Acción | `docs/contracts/CONTRACT-ACTION-PLAN.md` | Plan de Acción, Agenda, Seguimiento |
docs/contracts/CONTRACT-ACTION-PLAN.md:6:> Motor de Traducción Estratégica, Plan de Acción, Agenda tipo y Seguimiento.
docs/contracts/CONTRACT-ACTION-PLAN.md:406:## 10. Seguimiento (`MonitoringEngine`)
docs/contracts/CONTRACT-ACTION-PLAN.md:418:- `title`: "Seguimiento inicial de actuaciones".
docs/contracts/CONTRACT-ACTION-PLAN.md:450:### 10.4 Cautelas fijas del Seguimiento
docs/contracts/CONTRACT-ACTION-PLAN.md:456:### 10.5 Lo que el Seguimiento no es
docs/contracts/CONTRACT-ACTION-PLAN.md:541:**I-N3-6 — El Seguimiento no es evaluación de impacto**
docs/contracts/CONTRACT-ACTION-PLAN.md:686:| 2026-06-24 | Primera redacción. Documenta el estado del código a partir del commit `1e582f5`. Formaliza PSL-C1 en el Nivel 3, la cadena de trazabilidad completa, la heurística EPVSA, `PSLReference`, `FrameworkAlignment`, la distinción Agenda/ejecución y Seguimiento/evaluación, los riesgos conocidos y los criterios de evolución para los stages `evaluation` y `compiler`. |
docs/contracts/CONTRACT-COMPILER.md:75:            └─▶ Nivel 3: Priorización → EPVSA → Plan de Acción → Agenda → Seguimiento
docs/contracts/CONTRACT-COMPILER.md:123:### 5.4 Seguimiento inicial
docs/contracts/CONTRACT-COMPILER.md:186:| X | Seguimiento | Ítems de seguimiento con estado inicial |
docs/contracts/CONTRACT-COMPILER.md:241:Agenda, Seguimiento). El compilador requiere `"approved"`: una condición
docs/contracts/CONTRACT-COMPILER.md:357:| `CONTRACT-ACTION-PLAN.md` | El Plan de Acción, la Agenda y el Seguimiento del Nivel 3 son capítulos del Plan Local de Salud compilado. El compilador toma como entrada el PSL aprobado y los objetos validados del Nivel 3 derivados de ese PSL |
docs/contracts/CONTRACT-COMPILER.md:370:- **Priorización, EPVSA, Plan de Acción, Agenda y Seguimiento**: véase
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:555:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
docs/contracts/CONTRACT-EVIDENCE.md:427:- **Priorización técnica, EPVSA, Plan de Acción, Agenda y Seguimiento**.
docs/contracts/CONTRACT-INDEX.md:121:Contrato del bloque de Nivel 3: Priorización temática, Motor de Traducción Estratégica (versión inicial), Plan de Acción, Agenda y Seguimiento. Define que ningún motor del Nivel 3 puede producir documentos definitivos sin validación humana explícita.
docs/contracts/CONTRACT-MIT-PSL.md:69:Plan de Acción, Agenda, Seguimiento) solo pueden operar sobre el PSL. No
docs/contracts/CONTRACT-MIT-PSL.md:463:referencia `PSLReference`). La Agenda consume el Plan de Acción. El Seguimiento
docs/contracts/CONTRACT-MIT-PSL.md:540:- El Plan de Acción, la Agenda y el Seguimiento son generados a partir del PSL
docs/contracts/CONTRACT-MIT-PSL.md:582:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.
docs/contracts/CONTRACT-PERSISTENCE.md:154:(MIT, Reconciliación, PSL no validado, Plan de Acción, Agenda, Seguimiento):
docs/contracts/CONTRACT-PERSISTENCE.md:421:- **Plan de Acción, Agenda, Seguimiento y Compilador**: motores del Nivel 3.
docs/contracts/CONTRACT-REPOSITORY.md:385:- **Plan de Acción, Agenda y Seguimiento**: motores del Nivel 3.

----- MIT -----
src/application/health-profile/buildLocalHealthProfile.ts:277:  // ── Bloque 2: síntesis diagnóstica del MIT ────────────────────────────────
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:8: *   El MIT los utiliza como evidencia principal.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:103:// El MIT usa IBSE_FACTORES como evidencia principal; IBSE_RESUMEN es apoyo contextual.
src/application/reconciliation/ReconciliacionEngine.ts:4: * Procesamiento situado entre el Estado Territorial Evolutivo (MIT, Nivel 2)
src/application/reconciliation/ReconciliacionEngine.ts:8: *   tensionesEstructurales (MIT)
src/application/reconciliation/ReconciliacionEngine.ts:104:  // 2. Analizar cada tensión estructural del MIT:
src/application/runtime/MunicipalityRuntime.ts:38:  // Nivel 2 — Motor de Interpretación Territorial (MIT)
src/application/runtime/MunicipalityRuntime.ts:44:  // Campos derivados del MIT / reconciliacion — para compatibilidad con paneles UI.
src/application/runtime/MunicipalityRuntime.ts:79:  // por el MIT (interpretación territorial) y el motor de acción (ActionPlan).
src/application/runtime/MunicipalityRuntime.ts:82:  // ── Nivel 2: Motor de Interpretación Territorial (MIT)
src/application/runtime/MunicipalityRuntime.ts:102:  // Las áreas escaladas tienen prioridad; el OIT del MIT actúa como fallback.
src/application/runtime/MunicipalityRuntime.ts:121:  // el PSL. El PSL sintetiza el análisis territorial (MIT + Reconciliación + OIT)
src/application/runtime/MunicipalityRuntime.ts:214:  // ── Nivel 2: MIT ────────────────────────────────────────────────────────
src/application/runtime/MunicipalityRuntime.ts:224:    ? buildMITMessage(mit)
src/application/runtime/MunicipalityRuntime.ts:311:function buildMITMessage(mit: EstadoTerritorialEvolutivo): string {
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:2: * Motor de Interpretación Territorial (MIT)
docs/architecture/OPERATING-CONSTITUTION.md:46:  │   Motor de Interpretación Territorial (MIT)
docs/architecture/OPERATING-CONSTITUTION.md:63:- **Ningún motor del Nivel 3** puede consumir directamente outputs del MIT
docs/architecture/OPERATING-CONSTITUTION.md:67:- **El MIT y los motores del Nivel 2** no modifican el Repositorio Documental
docs/architecture/OPERATING-CONSTITUTION.md:97:    → MIT → ETE
docs/architecture/OPERATING-CONSTITUTION.md:109:Los resultados del MIT, la Reconciliación, el PSL no validado, el Plan de Acción,
docs/architecture/OPERATING-CONSTITUTION.md:123:| **Interpretación** | Lectura territorial del conjunto de evidencia | MIT, Reconciliación, PSL | El equipo técnico mediante validación explícita |
docs/architecture/OPERATING-CONSTITUTION.md:226:   Añadir el MIT, el PSL o cualquier motor del Nivel 3 no requiere refactorizar
docs/architecture/OPERATING-CONSTITUTION.md:309:6. COMMIT EXPLÍCITO
docs/architecture/OPERATING-CONSTITUTION.md:347:          → MIT / ETE
docs/architecture/OPERATING-CONSTITUTION.md:384:| Contrato MIT-PSL | `docs/contracts/CONTRACT-MIT-PSL.md` | Motor de Interpretación Territorial y PSL |
docs/contracts/CONTRACT-ACTION-PLAN.md:48:    └─▶ MIT → EstadoTerritorialEvolutivo
docs/contracts/CONTRACT-ACTION-PLAN.md:670:- **MIT, Reconciliación y PSL**: véase `CONTRACT-MIT-PSL.md`.
docs/contracts/CONTRACT-COMPILER.md:74:    └─▶ Nivel 2: MIT → Reconciliación → PSL
docs/contracts/CONTRACT-COMPILER.md:354:| `CONTRACT-MIT-PSL.md` | El PSL en estado `"approved"` es la entrada principal del compilador. PSL-I1 (el PSL referencia el Informe de Salud; no lo contiene) aplica también al documento compilado |
docs/contracts/CONTRACT-COMPILER.md:366:- **Análisis territorial**: MIT, LT1, OIT, Reconciliación. Véase
docs/contracts/CONTRACT-COMPILER.md:367:  `CONTRACT-MIT-PSL.md`.
docs/contracts/CONTRACT-COMPILER.md:369:  `CONTRACT-MIT-PSL.md`.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:415:las entradas del MIT. El PSL se construye a partir del MIT completo, del
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:545:- **MIT y PSL**: el sistema consume la evidencia generada por los estudios;
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:546:  sus contratos están en `CONTRACT-MIT-PSL.md`.
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:136:### En el MIT
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:164:- Uso por MIT → ver CONTRACT-MIT-PSL.md.
docs/contracts/CONTRACT-EVIDENCE.md:172:Territorial (MIT). El runtime lo aplica automáticamente (`MunicipalityRuntime`).
docs/contracts/CONTRACT-EVIDENCE.md:216:  sanitizedStore: EvidenceStore   — store saneado listo para el MIT
docs/contracts/CONTRACT-EVIDENCE.md:227:El `sanitizedStore` es el único objeto que el MIT tiene autorizado a consumir.
docs/contracts/CONTRACT-EVIDENCE.md:263:primaria del instrumento. El MIT los utiliza como indicadores directos.
docs/contracts/CONTRACT-EVIDENCE.md:332:## 6. Relación EvidenceStore → MIT → PSL
docs/contracts/CONTRACT-EVIDENCE.md:335:Territorial (MIT). El flujo es estrictamente unidireccional:
docs/contracts/CONTRACT-EVIDENCE.md:340:        → MIT (createEstadoTerritorialEvolutivo)
docs/contracts/CONTRACT-EVIDENCE.md:346:**El MIT lee el `sanitizedStore`; no lo modifica.**
docs/contracts/CONTRACT-EVIDENCE.md:348:El MIT clasifica los átomos por `kind`:
docs/contracts/CONTRACT-EVIDENCE.md:388:**I-E5 — El MIT no modifica el store**
docs/contracts/CONTRACT-EVIDENCE.md:421:- **MIT / EstadoTerritorialEvolutivo**: lógica interna del motor territorial,
docs/contracts/CONTRACT-INDEX.md:30:**Consumidores:** EvidenceStore, MIT.
docs/contracts/CONTRACT-INDEX.md:51:Contrato de `EvidenceAtom`, `EvidenceStore` y `EvidenceStoreIntegrityGuard`. Define los tipos de átomo (`EvidenceAtomKind`), los niveles de confianza, la clave estable de deduplicación, y las 5 reglas de integridad (A–E) que el Guard aplica antes de exponer el store al MIT.
docs/contracts/CONTRACT-INDEX.md:54:**Consumidores:** MIT, PSL.
docs/contracts/CONTRACT-INDEX.md:55:**Relacionado con:** CONTRACT-COMPLEMENTARY-STUDIES, CONTRACT-EVIDENCE-QUALITY, CONTRACT-MIT-PSL.
docs/contracts/CONTRACT-INDEX.md:87:**Consumidores:** MIT (priorización por confianza), PSL (validación de capítulos).
docs/contracts/CONTRACT-INDEX.md:100:**Consumidores:** MIT, PSL, equipo técnico como referencia.
docs/contracts/CONTRACT-INDEX.md:101:**Relacionado con:** CONTRACT-MIT-PSL.
docs/contracts/CONTRACT-INDEX.md:105:### CONTRACT-MIT-PSL
docs/contracts/CONTRACT-INDEX.md:108:Contrato del Motor de Interpretación Territorial (MIT) y del Perfil de Salud Local (PSL). Define LT1, OIT, Reconciliación Interpretativa, los 7 capítulos del PSL, los 6 estados del PSL y la regla PSL-C1 (el Nivel 3 solo consume PSL, nunca EvidenceStore directamente).
docs/contracts/CONTRACT-INDEX.md:125:**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-COMPILER, CONTRACT-STRATEGIC-TRANSLATION.
docs/contracts/CONTRACT-INDEX.md:136:**Relacionado con:** CONTRACT-MIT-PSL, CONTRACT-ACTION-PLAN.
docs/contracts/CONTRACT-INDEX.md:171:**Relacionado con:** CONTRACT-STRATEGIC-REPOSITORY, CONTRACT-MIT-PSL, CONTRACT-ACTION-PLAN.
docs/contracts/CONTRACT-INDEX.md:181:**Consumidores futuros:** MIT (extensión futura).
docs/contracts/CONTRACT-INDEX.md:182:**Relacionado con:** CONTRACT-INTERPRETATION, CONTRACT-MIT-PSL.
docs/contracts/CONTRACT-INDEX.md:198:CONTRACT-MIT-PSL
docs/contracts/CONTRACT-INTERPRETATION.md:55:**El sistema** (MIT, Reconciliación): organiza y clasifica la evidencia,
docs/contracts/CONTRACT-INTERPRETATION.md:105:producida por el MIT y la Reconciliación. Incluye la clasificación por tipo
docs/contracts/CONTRACT-INTERPRETATION.md:109:**Quién la genera**: el Motor de Interpretación Territorial (MIT) y el
docs/contracts/CONTRACT-INTERPRETATION.md:176:## 3. El Motor de Interpretación Territorial (MIT)
docs/contracts/CONTRACT-INTERPRETATION.md:180:El MIT transforma el `EvidenceStore` saneado en una lectura territorial
docs/contracts/CONTRACT-INTERPRETATION.md:188:El MIT acepta exclusivamente un `EvidenceStore` ya saneado por el
docs/contracts/CONTRACT-INTERPRETATION.md:194:El MIT produce un `EstadoTerritorialEvolutivo` que incluye:
docs/contracts/CONTRACT-INTERPRETATION.md:202:Todas las salidas del MIT llevan `requiresHumanValidation: true`.
docs/contracts/CONTRACT-INTERPRETATION.md:205:### 3.4 Restricciones del MIT
docs/contracts/CONTRACT-INTERPRETATION.md:207:El MIT **no puede**:
docs/contracts/CONTRACT-INTERPRETATION.md:219:siempre el mismo `EstadoTerritorialEvolutivo`. El MIT es determinista
docs/contracts/CONTRACT-INTERPRETATION.md:257:| IV — Interpretación territorial | Lectura asistida | Sistema (MIT + Reconciliación) |
docs/contracts/CONTRACT-INTERPRETATION.md:367:### 7.3 Relación con el MIT
docs/contracts/CONTRACT-INTERPRETATION.md:370:del proceso interpretativo del MIT, añadiendo una capa adicional entre la
docs/contracts/CONTRACT-INTERPRETATION.md:430:El MIT opera sobre `EvidenceAtom` derivados del Informe de Salud. Su lectura
docs/contracts/CONTRACT-INTERPRETATION.md:441:| `CONTRACT-EVIDENCE.md` | Define los `EvidenceAtom` que son las entradas del MIT |
docs/contracts/CONTRACT-INTERPRETATION.md:442:| `CONTRACT-MIT-PSL.md` | Formaliza el MIT, la Reconciliación y el PSL como objetos de dominio |
docs/contracts/CONTRACT-INTERPRETATION.md:454:| 2026-06-27 | Primera redacción. Establece la gramática completa del proceso interpretativo: capas, restricciones, papel del MIT y del PSL, papel de la IA, marco para la futura Inferencia Estructural Territorial e invariantes. |
docs/contracts/CONTRACT-MIT-PSL.md:5:> Motor de Interpretación Territorial (MIT), la Reconciliación Interpretativa
docs/contracts/CONTRACT-MIT-PSL.md:20:El **Motor de Interpretación Territorial (MIT)** transforma el `EvidenceStore`
docs/contracts/CONTRACT-MIT-PSL.md:26:Ningún motor del Nivel 3 puede consumir directamente los outputs del MIT.
docs/contracts/CONTRACT-MIT-PSL.md:32:### El MIT interpreta, no decide
docs/contracts/CONTRACT-MIT-PSL.md:34:El MIT organiza, clasifica y relaciona evidencia. No adopta conclusiones
docs/contracts/CONTRACT-MIT-PSL.md:36:de planificación. Todo output del MIT es una propuesta analítica que requiere
docs/contracts/CONTRACT-MIT-PSL.md:75:## 3. Entradas del MIT
docs/contracts/CONTRACT-MIT-PSL.md:77:El MIT acepta como entrada un `EvidenceStore` **ya saneado** por el
docs/contracts/CONTRACT-MIT-PSL.md:96:El MIT no distingue entre fuentes implementadas y pendientes: procesa los
docs/contracts/CONTRACT-MIT-PSL.md:102:ausencia no impide la ejecución del MIT, pero el PSL la señala explícitamente
docs/contracts/CONTRACT-MIT-PSL.md:107:## 4. Motor de Interpretación Territorial (MIT)
docs/contracts/CONTRACT-MIT-PSL.md:111:El MIT produce un `EstadoTerritorialEvolutivo`, que incluye:
docs/contracts/CONTRACT-MIT-PSL.md:128:LT1 es una sub-rutina interna del MIT, no una etapa de pipeline independiente.
docs/contracts/CONTRACT-MIT-PSL.md:154:OIT es otra sub-rutina interna del MIT. Transforma el resultado de LT1 en
docs/contracts/CONTRACT-MIT-PSL.md:175:`provenance.origin === "longi"`. Si está activa, el MIT genera una nota
docs/contracts/CONTRACT-MIT-PSL.md:177:el MIT señala que la interpretación se basa en el estado actual sin contexto
docs/contracts/CONTRACT-MIT-PSL.md:185:El MIT detecta heurísticamente las siguientes tensiones:
docs/contracts/CONTRACT-MIT-PSL.md:200:módulos computacionales ejecutables. El MIT los aplica leyendo los elementos
docs/contracts/CONTRACT-MIT-PSL.md:209:La Reconciliación es un motor que actúa **entre** el Nivel 2 (MIT) y el Nivel 3
docs/contracts/CONTRACT-MIT-PSL.md:210:(PSL → Priorización). No forma parte del MIT ni del PSL; es el puente que
docs/contracts/CONTRACT-MIT-PSL.md:211:determina qué tensiones del MIT tienen suficiente consistencia para convertirse
docs/contracts/CONTRACT-MIT-PSL.md:216:- `EstadoTerritorialEvolutivo` producido por el MIT en la ejecución actual.
docs/contracts/CONTRACT-MIT-PSL.md:237:Las tensiones estructurales del MIT pasan por un Filtro de Relevancia antes
docs/contracts/CONTRACT-MIT-PSL.md:274:por la Reconciliación como `oitParaDecision` (en lugar del OIT directo del MIT).
docs/contracts/CONTRACT-MIT-PSL.md:278:Si no hay tensiones escaladas, el MIT actúa como fallback: sus Áreas de
docs/contracts/CONTRACT-MIT-PSL.md:350:Síntesis del MIT y la Reconciliación: resumen territorial, determinantes,
docs/contracts/CONTRACT-MIT-PSL.md:363:de la síntesis del MIT. El equipo técnico debe redactar o revisar las
docs/contracts/CONTRACT-MIT-PSL.md:471:**I-MIT-1 — El MIT no modifica el `EvidenceStore`**
docs/contracts/CONTRACT-MIT-PSL.md:473:El MIT lee el store saneado y produce su output. No escribe en el store, no
docs/contracts/CONTRACT-MIT-PSL.md:477:**I-MIT-2 — Los outputs del MIT siempre llevan `requiresHumanValidation: true`**
docs/contracts/CONTRACT-MIT-PSL.md:484:**I-MIT-3 — Los conflictos interpretativos nunca tienen resolución automática**
docs/contracts/CONTRACT-MIT-PSL.md:571:Este contrato regula exclusivamente el MIT, la Reconciliación Interpretativa
docs/contracts/CONTRACT-PERSISTENCE.md:154:(MIT, Reconciliación, PSL no validado, Plan de Acción, Agenda, Seguimiento):
docs/contracts/CONTRACT-PERSISTENCE.md:303:- `runtime.mit.version !== historial.at(-1)?.version` (la versión del MIT
docs/contracts/CONTRACT-PERSISTENCE.md:416:- **Motor de Interpretación Territorial (MIT) y PSL**: análisis territorial
docs/contracts/CONTRACT-PERSISTENCE.md:417:  y ciclo de vida del PSL. Véase `CONTRACT-MIT-PSL.md`.
docs/contracts/CONTRACT-REPOSITORY.md:22:analítico —incluido el Motor de Interpretación Territorial (MIT), el Perfil
docs/contracts/CONTRACT-REPOSITORY.md:375:- **Motor de Interpretación Territorial (MIT)**: el motor que transforma el
docs/contracts/CONTRACT-SCALE-PANELS.md:136:#### C.4 · Integración con MIT
docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:182:- Perfil de Salud Local → CONTRACT-MIT-PSL.md
docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:158:## Diferencia respecto a las inferencias del MIT
docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:160:| | MIT (Motor Interpretación Territorial) | MTE (Motor Traducción Estratégica) |
docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:172:- PSL → CONTRACT-MIT-PSL.md
docs/contracts/CONTRACT-TERRITORIAL-STRUCTURAL-INFERENCE.md:89:## Relación con el MIT
tests/atarfe-workspace.test.ts:458:  it('MIT: evidenceStore no vacío (motores pueden arrancar)', () => {

----- MunicipalSnapshot -----
src/App.tsx:40:import { createMunicipalSnapshot } from "./domain/municipality-context";
src/App.tsx:348:    const snapshot = createMunicipalSnapshot(workspace);
src/application/municipal-inventory/createMunicipalInventory.ts:1:import type { MunicipalSnapshot } from "../../domain/municipality-context";
src/application/municipal-inventory/createMunicipalInventory.ts:34:  snapshot: MunicipalSnapshot
src/domain/municipality-context/createMunicipalityContext.ts:2:import type { MunicipalSnapshot } from "./MunicipalityContext";
src/domain/municipality-context/createMunicipalityContext.ts:10: *     └─▶ createMunicipalSnapshot()
src/domain/municipality-context/createMunicipalityContext.ts:11: *           └─▶ MunicipalSnapshot
src/domain/municipality-context/createMunicipalityContext.ts:19:export function createMunicipalSnapshot(
src/domain/municipality-context/createMunicipalityContext.ts:21:): MunicipalSnapshot {
src/domain/municipality-context/MunicipalityContext.ts:4: * Nota de nomenclatura: el tipo se llama MunicipalSnapshot (no MunicipalityContext)
src/domain/municipality-context/MunicipalityContext.ts:7: * MunicipalSnapshot refleja mejor su semántica: es una fotografía del estado
src/domain/municipality-context/MunicipalityContext.ts:27:export interface MunicipalSnapshot {
tests/atarfe-complementary-studies.test.ts:29:import { createMunicipalSnapshot } from "../src/domain/municipality-context";
tests/atarfe-complementary-studies.test.ts:214:const inventory = createMunicipalInventory(createMunicipalSnapshot(workspace));
tests/atarfe-workspace.test.ts:38:import { createMunicipalSnapshot } from '../src/domain/municipality-context'
tests/atarfe-workspace.test.ts:211:const snapshot  = createMunicipalSnapshot(workspace)
tests/atarfe-workspace.test.ts:404:// ── MunicipalSnapshot e Inventario ────────────────────────────────────────
tests/atarfe-workspace.test.ts:406:describe('Atarfe — MunicipalSnapshot e Inventario', () => {

----- EvidenceStore -----
src/App.css:1587:/* ── EvidenceStore — contenido de átomo ─────────────────── */
src/App.css:4755:/* ── EvidenceStore — resumen por origen ─────────────────────────────────── */
src/App.css:4989:/* ── EvidenceStorePanel colapsable ───────────────────────────────────────── */
src/App.tsx:56:  EvidenceStorePanel,
src/App.tsx:1577:          // (Localiza Salud, community-asset, manual) vía EvidenceStore.atoms
src/App.tsx:1767:            <EvidenceStorePanel
src/application/document-ingestion/ManualDocumentIngestionService.ts:7:import type { EvidenceStore } from "../../domain/evidence";
src/application/document-ingestion/ManualDocumentIngestionService.ts:12:  evidenceStore: EvidenceStore;
src/application/document-ingestion/ManualDocumentIngestionService.ts:20:  evidenceStore: EvidenceStore;
src/application/evidence/EvidenceStoreIntegrityGuard.ts:2: * EvidenceStoreIntegrityGuard
src/application/evidence/EvidenceStoreIntegrityGuard.ts:4: * Validates and sanitizes an EvidenceStore before it enters the runtime
src/application/evidence/EvidenceStoreIntegrityGuard.ts:19:  type EvidenceStore,
src/application/evidence/EvidenceStoreIntegrityGuard.ts:92:  sanitizedStore: EvidenceStore;
src/application/evidence/EvidenceStoreIntegrityGuard.ts:100:export function runEvidenceStoreIntegrityGuard(
src/application/evidence/EvidenceStoreIntegrityGuard.ts:101:  store: EvidenceStore
src/application/evidence/EvidenceStoreIntegrityGuard.ts:151:  const sanitizedStore: EvidenceStore = {
src/application/evidence/index.ts:1:export * from "./EvidenceStoreIntegrityGuard";
src/application/evidence-pipeline/DocumentToEvidencePipeline.ts:6:  type EvidenceStore,
src/application/evidence-pipeline/DocumentToEvidencePipeline.ts:13:  store: EvidenceStore;
src/application/evidence-pipeline/DocumentToEvidencePipeline.ts:19:  store: EvidenceStore;
src/application/health-profile/buildLocalHealthProfile.ts:18:import type { EvidenceStore } from "../../domain/evidence";
src/application/health-profile/buildLocalHealthProfile.ts:52:  sanitizedStore: EvidenceStore;
src/application/lt1/LT1Engine.ts:1:import type { EvidenceAtom, EvidenceStore } from "../../domain/evidence";
src/application/lt1/LT1Engine.ts:15:export function generateLT1(store: EvidenceStore): LT1Result {
src/application/runtime/MunicipalityRuntime.ts:18:  runEvidenceStoreIntegrityGuard,
src/application/runtime/MunicipalityRuntime.ts:75:  // ── Nivel 1: integridad del EvidenceStore
src/application/runtime/MunicipalityRuntime.ts:76:  const integrityGuard = runEvidenceStoreIntegrityGuard(input.workspace.evidenceStore);
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:23:import type { EvidenceStore } from "../../domain/evidence";
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:75:  evidenceStore: EvidenceStore;             // ya sanitizado por el IntegrityGuard
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:99:    // Deterministic: stable across re-renders as long as EvidenceStore is unchanged.
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:116:  store: EvidenceStore
src/application/workspace/CreateMunicipalityWorkspace.ts:11:  createEvidenceStore,
src/application/workspace/CreateMunicipalityWorkspace.ts:28:  const evidenceStore = createEvidenceStore(municipality.identity.id);
src/domain/evidence/EvidenceStore.ts:9:export interface EvidenceStore {
src/domain/evidence/EvidenceStore.ts:16:export function createEvidenceStore(
src/domain/evidence/EvidenceStore.ts:18:): EvidenceStore {
src/domain/evidence/EvidenceStore.ts:30:  store: EvidenceStore,
src/domain/evidence/EvidenceStore.ts:32:): EvidenceStore {
src/domain/evidence/EvidenceStore.ts:41:  store: EvidenceStore,
src/domain/evidence/EvidenceStore.ts:48:  store: EvidenceStore,
src/domain/evidence/EvidenceStore.ts:55:  store: EvidenceStore,
src/domain/evidence/EvidenceStore.ts:62:  store: EvidenceStore
src/domain/evidence/EvidenceStore.ts:70:  store: EvidenceStore,
src/domain/evidence/EvidenceStore.ts:94:  store: EvidenceStore,
src/domain/evidence/EvidenceStore.ts:97:): EvidenceStore {
src/domain/evidence/index.ts:2:export * from "./EvidenceStore";
src/domain/municipality-context/MunicipalityContext.ts:24:import type { EvidenceStore } from "../evidence";
src/domain/municipality-context/MunicipalityContext.ts:46:  evidenceStore: EvidenceStore;
src/domain/workspace/MunicipalityWorkspace.ts:3:import type { EvidenceStore } from "../evidence";
src/domain/workspace/MunicipalityWorkspace.ts:45:  evidenceStore: EvidenceStore;
src/domain/workspace/MunicipalityWorkspace.ts:77:  evidenceStore: EvidenceStore
src/ui/components/EvidenceStorePanel.tsx:3:  EvidenceStore,
src/ui/components/EvidenceStorePanel.tsx:44:interface EvidenceStorePanelProps {
src/ui/components/EvidenceStorePanel.tsx:45:  evidenceStore: EvidenceStore;
src/ui/components/EvidenceStorePanel.tsx:49:export function EvidenceStorePanel({ evidenceStore, defaultOpen = true }: EvidenceStorePanelProps) {
src/ui/components/index.ts:5:export * from "./EvidenceStorePanel";
docs/architecture/OPERATING-CONSTITUTION.md:40:  │   → EvidenceStore (EvidenceAtom[])
docs/architecture/OPERATING-CONSTITUTION.md:64:  ni del EvidenceStore. El **PSL validado** es el único objeto autorizado
docs/architecture/OPERATING-CONSTITUTION.md:68:  ni los documentos del Nivel 1. Solo leen el EvidenceStore saneado.
docs/architecture/OPERATING-CONSTITUTION.md:92:de entrada (EvidenceStore saneado) y un único puente autorizado al Nivel 3 (PSL).
docs/architecture/OPERATING-CONSTITUTION.md:95:EvidenceStore
docs/architecture/OPERATING-CONSTITUTION.md:111:cada sesión a partir del EvidenceStore persisitido. Solo el **PSL validado** por el
docs/architecture/OPERATING-CONSTITUTION.md:160:**Bloque C — EvidenceStore**
docs/architecture/OPERATING-CONSTITUTION.md:199:   el EvidenceStore. No existen estudios "especiales".
docs/architecture/OPERATING-CONSTITUTION.md:202:   Todo `EvidenceAtom` en el EvidenceStore activo tiene un `provenance.documentId`
docs/architecture/OPERATING-CONSTITUTION.md:218:   Los paneles de Repositorio Documental, Estudios Complementarios, EvidenceStore
docs/architecture/OPERATING-CONSTITUTION.md:345:      → EvidenceStore (atoms[])
docs/architecture/OPERATING-CONSTITUTION.md:356:  desaparecen del `EvidenceStore` antes de que el workspace se persista.
docs/architecture/OPERATING-CONSTITUTION.md:382:| Contrato de Evidencia | `docs/contracts/CONTRACT-EVIDENCE.md` | EvidenceAtom, EvidenceStore, IntegrityGuard |
docs/contracts/CONTRACT-ACTION-PLAN.md:47:EvidenceStore (saneado por IntegrityGuard)
docs/contracts/CONTRACT-ACTION-PLAN.md:96:existir sin un origen trazable en el EvidenceStore a través del PSL.
docs/contracts/CONTRACT-ACTION-PLAN.md:468:Cuando el `EvidenceStore` está vacío (ningún documento ha generado átomos),
docs/contracts/CONTRACT-ACTION-PLAN.md:593:El Nivel 3 genera objetos con estructura completa aunque el EvidenceStore esté
docs/contracts/CONTRACT-ACTION-PLAN.md:667:- **EvidenceStore, IntegrityGuard, pipelines de evidencia**: véase
docs/contracts/CONTRACT-COMPILER.md:73:Nivel 1: EvidenceStore (IntegrityGuard)
docs/contracts/CONTRACT-COMPILER.md:132:`EvidenceStore` a través del PSL. Sin esta trazabilidad, el documento
docs/contracts/CONTRACT-COMPILER.md:215:El compilador no ejecuta el IntegrityGuard, no procesa el `EvidenceStore`,
docs/contracts/CONTRACT-COMPILER.md:247:La ejecución del compilador no altera el `EvidenceStore`, el repositorio
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:21:- enriquecen el `EvidenceStore` con indicadores, factores y hallazgos que
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:334:  parser específico si sus resultados van a alimentar el `EvidenceStore`.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:414:Los Estudios Complementarios alimentan el `EvidenceStore`, que forma parte de
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:424:todas las fuentes del `EvidenceStore`. La decisión de priorización es siempre
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:444:el `EvidenceStore` ni en localStorage. Solo sobreviven los agregados
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:550:- **EvidenceAtom y EvidenceStore**: estructura, IntegrityGuard y pipelines
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:159:SAM alimenta la Tripirámide; la Tripirámide informa al EvidenceStore a través de átomos `kind: "sample-quality"`.
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:130:### En el EvidenceStore
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:132:El EvidenceStore permite filtrar átomos por `confidence` mediante `getEvidenceAtomsByConfidence()`.
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:134:El EvidenceStoreIntegrityGuard valida que los átomos derivados (`qualitative-observation`) no se presenten como fuentes primarias.
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:146:El Perfil de Salud Local incluye la calidad de la evidencia en cada capítulo mediante la trazabilidad al EvidenceStore.
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:163:- Integración con EvidenceStore → ver CONTRACT-EVIDENCE.md.
docs/contracts/CONTRACT-EVIDENCE.md:5:> `EvidenceAtom`, `EvidenceStore`, `EvidenceStoreIntegrityGuard` y las
docs/contracts/CONTRACT-EVIDENCE.md:23:El `EvidenceStore` es la colección de átomos activos de un municipio. Es el
docs/contracts/CONTRACT-EVIDENCE.md:128:## 3. `EvidenceStore`
docs/contracts/CONTRACT-EVIDENCE.md:130:El `EvidenceStore` es la colección de átomos activos de un municipio.
docs/contracts/CONTRACT-EVIDENCE.md:133:EvidenceStore {
docs/contracts/CONTRACT-EVIDENCE.md:166:## 4. `EvidenceStoreIntegrityGuard`
docs/contracts/CONTRACT-EVIDENCE.md:168:El IntegrityGuard valida y sanea el `EvidenceStore` antes de que entre en el
docs/contracts/CONTRACT-EVIDENCE.md:216:  sanitizedStore: EvidenceStore   — store saneado listo para el MIT
docs/contracts/CONTRACT-EVIDENCE.md:332:## 6. Relación EvidenceStore → MIT → PSL
docs/contracts/CONTRACT-EVIDENCE.md:334:El `EvidenceStore` es la única fuente que alimenta el Motor de Interpretación
docs/contracts/CONTRACT-EVIDENCE.md:338:EvidenceStore
docs/contracts/CONTRACT-EVIDENCE.md:390:Reconciliación ni del constructor del PSL modifica el `EvidenceStore`.
docs/contracts/CONTRACT-INDEX.md:30:**Consumidores:** EvidenceStore, MIT.
docs/contracts/CONTRACT-INDEX.md:51:Contrato de `EvidenceAtom`, `EvidenceStore` y `EvidenceStoreIntegrityGuard`. Define los tipos de átomo (`EvidenceAtomKind`), los niveles de confianza, la clave estable de deduplicación, y las 5 reglas de integridad (A–E) que el Guard aplica antes de exponer el store al MIT.
docs/contracts/CONTRACT-INDEX.md:62:Contrato de los estudios complementarios como pipeline. Define el flujo canónico (CSV → Parser → Study → EvidenceAtoms → EvidenceStore), los 6 instrumentos admitidos, los invariantes de aislamiento municipal y la regla de no almacenamiento de registros individuales.
docs/contracts/CONTRACT-INDEX.md:65:**Consumidores:** EvidenceStore, CONTRACT-SCALE-PANELS (gramática visual).
docs/contracts/CONTRACT-INDEX.md:108:Contrato del Motor de Interpretación Territorial (MIT) y del Perfil de Salud Local (PSL). Define LT1, OIT, Reconciliación Interpretativa, los 7 capítulos del PSL, los 6 estados del PSL y la regla PSL-C1 (el Nivel 3 solo consume PSL, nunca EvidenceStore directamente).
docs/contracts/CONTRACT-INDEX.md:148:**Consumidores futuros:** EvidenceStore (átomos `kind: "sample-quality"`), paneles de estudios.
docs/contracts/CONTRACT-INTERPRETATION.md:110:Motor de Reconciliación Interpretativa, sobre el `EvidenceStore` saneado.
docs/contracts/CONTRACT-INTERPRETATION.md:180:El MIT transforma el `EvidenceStore` saneado en una lectura territorial
docs/contracts/CONTRACT-INTERPRETATION.md:188:El MIT acepta exclusivamente un `EvidenceStore` ya saneado por el
docs/contracts/CONTRACT-INTERPRETATION.md:189:`EvidenceStoreIntegrityGuard`. No procesa documentos directamente. No
docs/contracts/CONTRACT-INTERPRETATION.md:213:- modificar el `EvidenceStore` ni los documentos fuente;
docs/contracts/CONTRACT-INTERPRETATION.md:214:- operar sobre información que no esté en el `EvidenceStore` saneado.
docs/contracts/CONTRACT-INTERPRETATION.md:218:La misma versión del `EvidenceStore` (mismo `updatedAt`) produce
docs/contracts/CONTRACT-INTERPRETATION.md:256:| III — Diagnóstico integrado | Evidencia organizada | Sistema (desde EvidenceStore) |
docs/contracts/CONTRACT-INTERPRETATION.md:306:- Las lecturas territoriales son regenerables desde el mismo `EvidenceStore`.
docs/contracts/CONTRACT-MIT-PSL.md:20:El **Motor de Interpretación Territorial (MIT)** transforma el `EvidenceStore`
docs/contracts/CONTRACT-MIT-PSL.md:41:La dimensión diagnóstica (LT1) es la clasificación del `EvidenceStore` por
docs/contracts/CONTRACT-MIT-PSL.md:77:El MIT acepta como entrada un `EvidenceStore` **ya saneado** por el
docs/contracts/CONTRACT-MIT-PSL.md:78:`EvidenceStoreIntegrityGuard`. No opera sobre el store original.
docs/contracts/CONTRACT-MIT-PSL.md:341:Estadísticas del `EvidenceStore` saneado: conteos por origen y por tipo,
docs/contracts/CONTRACT-MIT-PSL.md:420:(`validatedAt`) y el estado del `EvidenceStore` en ese momento
docs/contracts/CONTRACT-MIT-PSL.md:471:**I-MIT-1 — El MIT no modifica el `EvidenceStore`**
docs/contracts/CONTRACT-MIT-PSL.md:530:   `EvidenceStore` ha cambiado desde que se validó el PSL.
docs/contracts/CONTRACT-MIT-PSL.md:577:- **EvidenceAtom y EvidenceStore**: estructura, pipelines de generación,
docs/contracts/CONTRACT-PERSISTENCE.md:297:en el `EvidenceStore`.
docs/contracts/CONTRACT-REPOSITORY.md:61:partir del `EvidenceStore`. No es un documento del repositorio, no puede ser
docs/contracts/CONTRACT-REPOSITORY.md:208:- auditar qué documentos han contribuido al `EvidenceStore` activo.
docs/contracts/CONTRACT-REPOSITORY.md:263:purga del `EvidenceStore`.
docs/contracts/CONTRACT-REPOSITORY.md:357:generados a partir del `EvidenceStore`, no documentos del repositorio.
docs/contracts/CONTRACT-REPOSITORY.md:373:- **EvidenceAtom y EvidenceStore**: su estructura, ciclo de vida, reglas de
docs/contracts/CONTRACT-REPOSITORY.md:376:  `EvidenceStore` en un Estado Territorial Evolutivo.
docs/contracts/CONTRACT-SCALE-PANELS.md:129:#### C.3 · Integración con EvidenceStore
docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:143:Átomo de evidencia (EvidenceStore)
docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:162:| Entrada | EvidenceStore | PSL validado + Repositorio Estratégico |
docs/contracts/CONTRACT-STRATEGIC-TRANSLATION.md:174:- EvidenceStore → CONTRACT-EVIDENCE.md
tests/atarfe-workspace.test.ts:372:// ── EvidenceStore ──────────────────────────────────────────────────────────
tests/atarfe-workspace.test.ts:374:describe('Atarfe — EvidenceStore', () => {

----- IBSE -----
src/App.css:1600:/* ── IBSE Panel ─────────────────────────────────────────── */
src/App.css:5100:   Reemplaza los antiguos ibse-* en paneles no-IBSE.
src/App.css:5277:/* Umbrales IBSE posicionados sobre 100 */
src/App.css:5304:/* Clasificación de nivel (solo IBSE) */
src/App.tsx:22:import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "./application/ibse";
src/App.tsx:23:import { createIBSEStudy } from "./domain/ibse";
src/App.tsx:141:const IBSE_DOCUMENT_TAG = "ibse";
src/App.tsx:153:function isIBSEDocument(document: MunicipalDocument | undefined): boolean {
src/App.tsx:154:  return hasDocumentTag(document, IBSE_DOCUMENT_TAG);
src/App.tsx:276:  const [isLoadingIBSE, setIsLoadingIBSE] = useState(false);
src/App.tsx:590:  async function handleLoadIBSECSV(file: File): Promise<void> {
src/App.tsx:591:    setIsLoadingIBSE(true);
src/App.tsx:594:      const { aggregates, methodologicalCautions, warnings } = parseIBSECSV(text);
src/App.tsx:596:      const study = createIBSEStudy({
src/App.tsx:610:          IBSE_DOCUMENT_TAG
src/App.tsx:615:          title: `IBSE - ${file.name}`,
src/App.tsx:617:            system: "Importación REDCap IBSE",
src/App.tsx:621:          tags: ["redcap-export", IBSE_DOCUMENT_TAG],
src/App.tsx:647:          ? `IBSE cargado: ${aggregates.nValid} registros válidos · Media total: ${aggregates.meanTotal} · ${ibseAtoms.length} indicadores incorporados al análisis territorial.${warn}`
src/App.tsx:653:      setIsLoadingIBSE(false);
src/App.tsx:1192:    if (isIBSEDocument(deletedDocument)) {
src/App.tsx:1194:      setIsLoadingIBSE(false);
src/App.tsx:1226:      const deletesIBSE = isIBSEDocument(doc);
src/App.tsx:1245:              if (deletesIBSE && atom.provenance.origin === "ibse") return false;
src/App.tsx:1293:        ibseStudy: deletesIBSE ? undefined : prev.ibseStudy,
src/App.tsx:1330:    setIsLoadingIBSE(false);
src/App.tsx:1784:              isLoadingIBSE={isLoadingIBSE}
src/App.tsx:1786:              onLoadIBSECSV={handleLoadIBSECSV}
src/application/evidence/EvidenceStoreIntegrityGuard.ts:61:  //   IBSE_FACTORES → kind "indicator"   (5 atoms: meanTotal + 4 factors)
src/application/evidence/EvidenceStoreIntegrityGuard.ts:62:  //   IBSE_RESUMEN  → kind "qualitative-observation" (1 atom: structural interpretation)
src/application/evidence/EvidenceStoreIntegrityGuard.ts:74:// ── Rule D: IBSE completeness ─────────────────────────────────────────────
src/application/evidence/EvidenceStoreIntegrityGuard.ts:75:// Counts IBSE_FACTORES only (kind: "indicator") — the primary quantitative layer.
src/application/evidence/EvidenceStoreIntegrityGuard.ts:76:// IBSE_RESUMEN (kind: "qualitative-observation") is excluded by design:
src/application/evidence/EvidenceStoreIntegrityGuard.ts:80:const IBSE_EXPECTED_INDICATOR_COUNT = 5;
src/application/evidence/EvidenceStoreIntegrityGuard.ts:139:  // Rule D — IBSE completeness (post-filter check over accepted atoms)
src/application/evidence/EvidenceStoreIntegrityGuard.ts:143:  if (ibseIndicators.length > 0 && ibseIndicators.length !== IBSE_EXPECTED_INDICATOR_COUNT) {
src/application/evidence/EvidenceStoreIntegrityGuard.ts:145:      `IBSE incompleto: se esperan ${IBSE_EXPECTED_INDICATOR_COUNT} indicadores ` +
src/application/evidence/EvidenceStoreIntegrityGuard.ts:147:        `Los resultados del análisis IBSE pueden ser parciales.`
src/application/health-profile/buildLocalHealthProfile.ts:28:import type { IBSEStudy } from "../../domain/ibse";
src/application/health-profile/buildLocalHealthProfile.ts:252:  ibseStudy: IBSEStudy | undefined,
src/application/health-profile/buildLocalHealthProfile.ts:306:  // ── Bloque 5: IBSE ────────────────────────────────────────────────────────
src/application/health-profile/buildLocalHealthProfile.ts:310:      `El estudio IBSE registra un índice total de bienestar socioemocional ` +
src/application/ibse/IBSECSVParser.ts:1:import type { IBSEAggregates } from "../../domain/ibse";
src/application/ibse/IBSECSVParser.ts:5:const IBSE_MODULE_ID = "ibse";
src/application/ibse/IBSECSVParser.ts:7:const ibseModule = getMethodologicalModule(IBSE_MODULE_ID);
src/application/ibse/IBSECSVParser.ts:9:  throw new Error("Módulo metodológico IBSE sin adaptador REDCap configurado.");
src/application/ibse/IBSECSVParser.ts:25:const EMPTY_AGGREGATES: IBSEAggregates = {
src/application/ibse/IBSECSVParser.ts:35:export interface IBSECSVParseResult {
src/application/ibse/IBSECSVParser.ts:36:  aggregates: IBSEAggregates;
src/application/ibse/IBSECSVParser.ts:41:export function parseIBSECSV(csvText: string): IBSECSVParseResult {
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:2: * Conversión de IBSEStudy → EvidenceAtom (dos niveles diferenciados)
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:4: * IBSE_FACTORES — 5 átomos, kind: "indicator"
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:5: *   Evidencia cuantitativa primaria. Fuente directa del instrumento IBSE.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:7: *   Son la base de cualquier análisis territorial que use datos IBSE.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:10: * IBSE_RESUMEN — 1 átomo, kind: "qualitative-observation"
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:11: *   Síntesis automática derivada del procesamiento de IBSE_FACTORES.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:16: *   es una regla del sistema, no una conclusión metodológica del instrumento IBSE.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:19: *   IBSE_RESUMEN constituye una síntesis automática derivada del procesamiento
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:25:import type { IBSEStudy } from "../../domain/ibse";
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:27:interface IBSEFactorDef {
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:30:    IBSEStudy["aggregates"],
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:36:const IBSE_FACTOR_DEFS: IBSEFactorDef[] = [
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:38:    title: "IBSE – Índice total de bienestar socioemocional",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:40:    description: "Índice total (media de los 8 ítems IBSE). Escala 0–100, mayor = mejor bienestar.",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:43:    title: "IBSE – Factor Vínculo",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:48:    title: "IBSE – Factor Situación",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:53:    title: "IBSE – Factor Control",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:58:    title: "IBSE – Factor Persona",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:64:export function ibseStudyToEvidenceAtoms(study: IBSEStudy): EvidenceAtom[] {
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:70:  // IBSE_FACTORES — 5 atoms, one per factor + total index (kind: "indicator")
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:71:  const factorAtoms = IBSE_FACTOR_DEFS.map((def) => {
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:87:          "Agregado municipal calculado desde exportación REDCap. Instrumento IBSE (Bericat, 2014) adaptado para planificación local de salud.",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:95:  // IBSE_RESUMEN — 1 atom, interpretación estructural de los factores (kind: "qualitative-observation")
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:96:  const resumenAtom = buildIBSEResumen(study, confidence);
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:101:// ── IBSE_RESUMEN — Síntesis automática derivada ───────────────────────────
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:103:// El MIT usa IBSE_FACTORES como evidencia principal; IBSE_RESUMEN es apoyo contextual.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:106:function clasificarNivelIBSE(valor: number): string {
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:113:function buildIBSEResumen(study: IBSEStudy, confidence: "low" | "medium"): EvidenceAtom {
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:134:    "Síntesis automática derivada de IBSE_FACTORES. No es fuente primaria de evidencia cuantitativa.",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:136:    `Índice IBSE total: ${agg.meanTotal}/100 — ${clasificarNivelIBSE(agg.meanTotal)}.`,
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:142:  // [Regla del sistema] Heuristic alert — not a methodological conclusion of IBSE
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:154:    "[Contrato arquitectónico] IBSE_RESUMEN constituye una síntesis automática derivada del " +
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:163:    title: "IBSE – Resumen interpretativo estructural (derivado)",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:173:        "Síntesis automática derivada del procesamiento de los resultados de IBSE_FACTORES. " +
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:175:        "IBSE_RESUMEN no es una fuente primaria de conocimiento ni una interpretación experta. " +
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:176:        "No debe prevalecer sobre los datos cuantitativos (IBSE_FACTORES) cuando exista discrepancia. " +
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:177:        "IBSE_RESUMEN constituye una síntesis automática derivada del procesamiento de los resultados " +
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:181:        "[Regla del sistema] Los umbrales de clasificación (alto/medio/bajo) son heurísticos definidos por el sistema, no por el instrumento IBSE ni por criterios normativos o clínicos.",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:182:        "[Regla del sistema] La alerta por dispersión interfactorial alta (>20 puntos) es una regla automática del sistema, no una conclusión metodológica del instrumento IBSE (Bericat, 2014).",
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:184:        "IBSE_RESUMEN debe emplearse solo como observación contextual de apoyo; IBSE_FACTORES constituye la fuente primaria de evidencia cuantitativa.",
src/application/ibse/index.ts:1:export * from "./IBSECSVParser";
src/application/ibse/index.ts:2:export * from "./IBSEStudyToEvidenceAtoms";
src/application/municipal-inventory/createMunicipalInventory.ts:9:  hasIBSE: boolean;
src/application/municipal-inventory/createMunicipalInventory.ts:37:  const hasIBSE        = snapshot.ibseStudy !== undefined;
src/application/municipal-inventory/createMunicipalInventory.ts:62:  if (hasIBSE && ibseValidRecordCount === 0) {
src/application/municipal-inventory/createMunicipalInventory.ts:63:    warnings.push("IBSE cargado sin registros completos.");
src/application/municipal-inventory/createMunicipalInventory.ts:72:    hasIBSE,
src/application/reconciliation/ReconciliacionEngine.ts:290:        "Coexistencia de IBSE (bienestar individual escolar) e Informe de Salud " +
src/application/reconciliation/ReconciliacionEngine.ts:330:        `IBSE (escala individual) + ${lt1.indicators.length} indicador(es) poblacional(es). ` +
src/domain/ibse/IBSEAggregates.ts:1:export interface IBSEAggregates {
src/domain/ibse/IBSEStudy.ts:2:import type { IBSEAggregates } from "./IBSEAggregates";
src/domain/ibse/IBSEStudy.ts:4:export interface IBSEStudy {
src/domain/ibse/IBSEStudy.ts:8:  aggregates: IBSEAggregates;
src/domain/ibse/IBSEStudy.ts:15:export interface CreateIBSEStudyInput {
src/domain/ibse/IBSEStudy.ts:18:  aggregates: IBSEAggregates;
src/domain/ibse/IBSEStudy.ts:23:export function createIBSEStudy(input: CreateIBSEStudyInput): IBSEStudy {
src/domain/ibse/index.ts:1:export * from "./IBSEAggregates";
src/domain/ibse/index.ts:2:export * from "./IBSEStudy";
src/domain/methodology/definitions/ibse.ts:3:// Definición canónica del Índice de Bienestar Socioemocional (IBSE).
src/domain/methodology/definitions/ibse.ts:15:export const IBSE_MODULE: MethodologicalModule = {
src/domain/methodology/definitions/ibse.ts:22:    shortName: "IBSE",
src/domain/methodology/definitions/ibse.ts:42:  // MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv
src/domain/methodology/index.ts:32:export { IBSE_MODULE } from "./definitions/ibse";
src/domain/methodology/registry.ts:2:import { IBSE_MODULE } from "./definitions/ibse";
src/domain/methodology/registry.ts:11:  [IBSE_MODULE.identity.id, IBSE_MODULE],
src/domain/municipality-context/MunicipalityContext.ts:18:import type { IBSEStudy } from "../ibse";
src/domain/municipality-context/MunicipalityContext.ts:34:  ibseStudy?: IBSEStudy;
src/domain/questionnaire/QuestionnaireDefinition.ts:21:  // Módulos metodológicos seleccionados (IBSE, DUKE, CAGE, ...)
src/domain/strategic-framework/createStrategicFramework.ts:57:          "El diagnóstico de salud de " + municipalityName + " se sustenta en fuentes de información diversas y complementarias: el Informe de Salud Municipal elaborado por el Distrito Sanitario" + (sanitaryDistrict !== undefined ? " " + sanitaryDistrict : "") + ", los registros del Sistema de Información Sanitaria de Andalucía (SISA), los datos del Instituto de Estadística y Cartografía de Andalucía (IECA), los indicadores del IBSE (Inventario de Bienestar Subjetivo Escolar) cuando están disponibles, y las aportaciones de la ciudadanía a través de los procesos participativos.",
src/domain/strategy/StrategicFrameworkRegistry.ts:76:      "Puntuación IBSE (Bienestar Socioemocional Escolar)",
src/domain/strategy/StrategicFrameworkRegistry.ts:375:      "Identificación de prioridades de salud con participación de la ciudadanía y los actores locales. Instrumentos: IBSE, papeleta temática, diagnóstico comunitario.",
src/domain/workspace/MunicipalityWorkspace.ts:5:import type { IBSEStudy } from "../ibse";
src/domain/workspace/MunicipalityWorkspace.ts:47:  ibseStudy?: IBSEStudy;
src/infrastructure/persistence/local-storage/LocalStorageWorkspacePersistence.ts:138:    // Normalizar IBSEStudy: campo añadido en b66193a — rellenar en workspaces anteriores
src/ui/components/DocumentIngestionPanel.tsx:130:            Los instrumentos tipificados (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12) se cargan
src/ui/components/DocumentRepositoryPanel.tsx:29:  ibse: "IBSE",
src/ui/components/DocumentRepositoryPanel.tsx:48:// 2. Estudios complementarios (IBSE, EAS)
src/ui/components/EstudiosComplementariosPanel.tsx:2:import type { IBSEStudy } from "../../domain/ibse";
src/ui/components/EstudiosComplementariosPanel.tsx:9:import { IBSEPanel } from "./IBSEPanel";
src/ui/components/EstudiosComplementariosPanel.tsx:138:  ibseStudy?: IBSEStudy;
src/ui/components/EstudiosComplementariosPanel.tsx:139:  isLoadingIBSE?: boolean;
src/ui/components/EstudiosComplementariosPanel.tsx:141:  onLoadIBSECSV?: (file: File) => void;
src/ui/components/EstudiosComplementariosPanel.tsx:177:  isLoadingIBSE,
src/ui/components/EstudiosComplementariosPanel.tsx:179:  onLoadIBSECSV,
src/ui/components/EstudiosComplementariosPanel.tsx:234:          name="IBSE"
src/ui/components/EstudiosComplementariosPanel.tsx:238:          isLoading={isLoadingIBSE}
src/ui/components/EstudiosComplementariosPanel.tsx:242:          onLoadCSV={onLoadIBSECSV}
src/ui/components/EstudiosComplementariosPanel.tsx:245:          <IBSEPanel ibseStudy={ibseStudy} isLoading={isLoadingIBSE} message={ibseMessage} onLoadCSV={onLoadIBSECSV} />
src/ui/components/EvidenceStorePanel.tsx:25:  "ibse":                  "IBSE",
src/ui/components/IBSEPanel.tsx:1:import type { IBSEStudy } from "../../domain/ibse";
src/ui/components/IBSEPanel.tsx:3:interface IBSEPanelProps {
src/ui/components/IBSEPanel.tsx:4:  ibseStudy?: IBSEStudy;
src/ui/components/IBSEPanel.tsx:18:interface IBSEBarRowProps {
src/ui/components/IBSEPanel.tsx:24:function IBSEBarRow({ label, value, isTotal = false }: IBSEBarRowProps) {
src/ui/components/IBSEPanel.tsx:47:export function IBSEPanel({
src/ui/components/IBSEPanel.tsx:52:}: IBSEPanelProps) {
src/ui/components/IBSEPanel.tsx:75:          <p className="study-hint">Procesando CSV IBSE…</p>
src/ui/components/IBSEPanel.tsx:112:                <IBSEBarRow
src/ui/components/IBSEPanel.tsx:113:                  label="IBSE Total"
src/ui/components/IBSEPanel.tsx:117:                <IBSEBarRow
src/ui/components/IBSEPanel.tsx:121:                <IBSEBarRow
src/ui/components/IBSEPanel.tsx:125:                <IBSEBarRow
src/ui/components/IBSEPanel.tsx:129:                <IBSEBarRow
src/ui/components/IBSEPanel.tsx:197:          Ningún estudio IBSE cargado para este municipio. Importa la
src/ui/components/index.ts:6:export * from "./IBSEPanel";
src/ui/components/LocalHealthProfileView.tsx:42:  "ibse":                  "IBSE",
src/ui/components/LocalHealthProfileView.tsx:432:              estudio IBSE, la priorización ciudadana y los estudios complementarios.
src/ui/components/LocalHealthProfileView.tsx:650:                <span className="psl-doc-source-flag__name">IBSE</span>
src/ui/components/LT1Panel.tsx:9:  "ibse":                  "IBSE",
src/ui/components/MunicipalInventoryPanel.tsx:54:          label="IBSE"
src/ui/components/MunicipalInventoryPanel.tsx:55:          present={inventory.hasIBSE}
src/ui/components/MunicipalInventoryPanel.tsx:57:            inventory.hasIBSE
src/ui/components/QuestionnaireBuilderPanel.tsx:12:      name: "Estudio complementario IBSE",
src/ui/components/QuestionnaireBuilderPanel.tsx:16:        name: "Monitor IBSE",
src/ui/components/QuestionnaireBuilderPanel.tsx:56:        Descargar CSV REDCap (IBSE)
docs/architecture/OPERATING-CONSTITUTION.md:82:| IBSE (REDCap) | `redcap-export` + tag `"ibse"` | Por `tag` (uno por municipio) |
docs/architecture/OPERATING-CONSTITUTION.md:155:- Los seis estudios (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS)
docs/architecture/OPERATING-CONSTITUTION.md:197:   IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS tienen el mismo
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:41:IBSE, SF-12, DUKE, PREDIMED, CAGE, ESCA y cualquier otro instrumento que se
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:44:de IBSE en COMPÁS NG no le otorga una categoría distinta al resto.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:50:| **IBSE** — Índice de Bienestar Socioemocional | `validated-scale` | Implementado (módulo en `draft`; ver §9) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:80:(por ejemplo: bloque sociodemográfico EAS + IBSE + PREDIMED). En ese caso,
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:97:| IBSE (exportación REDCap municipal) | `"redcap-export"` | `"ibse"` | Por tag (uno por municipio) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:110:**Razón de la distinción `redcap-export` vs `complementary-study`:** IBSE
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:124:| IBSE | `redcap-export` | `"ibse"` |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:132:**Nota:** La Priorización Temática comparte `kind: "redcap-export"` con IBSE
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:167:El caso IBSE ilustra la distinción:
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:169:- **IBSE_FACTORES** (5 átomos, `kind: "indicator"`): evidencia cuantitativa
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:171:- **IBSE_RESUMEN** (1 átomo, `kind: "qualitative-observation"`, tag
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:172:  `"ibse-derived"`): síntesis automática derivada de IBSE_FACTORES. No es
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:200:descarta los individuales. Solo los agregados sobreviven en `IBSEAggregates`
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:202:contrato de cada instrumento, no solo de IBSE.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:224:El parser IBSE ilustra esta dependencia: lee sus nombres de columna directamente
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:225:desde `IBSE_MODULE.adapters.redcap.columns`, no los tiene hardcoded.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:254:Los instrumentos de Estudios Complementarios validados (IBSE, SF-12, DUKE,
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:282:### 5.6 Estado actual de IBSE en la Biblioteca
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:284:El módulo `IBSE_MODULE` está en estado `"draft"` por la siguiente razón
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:288:> (`MonitorIBSEATARFE2026_DataDictionary_2026-06-20.csv`). Pendiente el
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:372:| **Estudio interpretado** | Objeto de dominio (`IBSEStudy` o equivalente) que contiene los agregados municipales calculados a partir de la exportación. Es la representación interna del estudio en COMPÁS NG |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:380:IBSE; instrumento SF-12 original; etc.), el módulo metodológico de COMPÁS NG
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:386:factores IBSE), el adaptador REDCap del módulo debe documentar esta desviación
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:394:**I-CE-1 — IBSE no es una categoría arquitectónica**
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:396:IBSE es una implementación concreta de la categoría Estudios Complementarios.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:401:desarrollo actual de IBSE en el código no le confiere ningún privilegio
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:458:`IBSE_MODULE.identity.status === "draft"` indica que la definición está
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:484:| **IBSE** | **Implementado** (módulo en `draft`; pendiente de `validated`) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:497:- Sus parsers **hardcodean los nombres de columna** (p. ej. `P5701`–`P5711` en DUKE; `Predimed` con fallback a ítems en PREDIMED; `PCS12_SP`/`MCS12_SP` en SF-12; `P33_R`/`P33A` en Sueño; `CAGE_R`/`CAGE` en CAGE), en lugar de derivarlos de un módulo metodológico como hace el parser de IBSE.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:509:seguir el mismo patrón que IBSE:
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:566:| 2026-06-24 | Primera redacción. Establece la taxonomía correcta (Estudios Complementarios como categoría; IBSE como implementación). Documenta el estado actual de IBSE en la Biblioteca Metodológica, el patrón de implementación para futuros instrumentos y los invariantes de privacidad y trazabilidad. |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:568:| 2026-06-27 | Sprint 0: SF-12 EAS, Sueño EAS y CAGE-EAS pasan de «Conceptual» a «Implementado» (implementados en commits `7f47034`, `20080cd` y `9c73fa0` respectivamente). §3.1 y §3.2 actualizados para reflejar la distinción real entre `kind: "redcap-export"` (IBSE) y `kind: "complementary-study"` (instrumentos EAS). Nota §9a ampliada para incluir los cinco instrumentos EAS sin `MethodologicalModule`. |
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:84:- IBSE: n observado = 811 válidos de 811 totales (muestra específica Atarfe)
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:155:SAM (Sistema de Auditoría Muestral) es la metodología de evaluación de calidad muestral de COMPÁS NG. No es un módulo IBSE.
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:166:Un IBSE con muestra baja sigue produciendo sus átomos con sus valores reales.
docs/contracts/CONTRACT-EVIDENCE.md:68:| `low` | Evidencia metodológicamente débil: muestra insuficiente (IBSE con menos de 30 registros válidos), fuente no verificada o limitaciones conocidas graves |
docs/contracts/CONTRACT-EVIDENCE.md:99:| `ibse` | Estudio IBSE (Índice de Bienestar Socioemocional) |
docs/contracts/CONTRACT-EVIDENCE.md:200:**Regla D — Completitud IBSE**
docs/contracts/CONTRACT-EVIDENCE.md:201:Si el store contiene átomos IBSE con `kind: "indicator"`, deben ser
docs/contracts/CONTRACT-EVIDENCE.md:253:### 5.2 Pipeline IBSE (`IBSEStudyToEvidenceAtoms`)
docs/contracts/CONTRACT-EVIDENCE.md:255:**Origen:** `"ibse"` · **Activación:** explícita (importación CSV REDCap IBSE)
docs/contracts/CONTRACT-EVIDENCE.md:259:**IBSE_FACTORES — 5 átomos, `kind: "indicator"`**
docs/contracts/CONTRACT-EVIDENCE.md:268:**IBSE_RESUMEN — 1 átomo, `kind: "qualitative-observation"`**
docs/contracts/CONTRACT-EVIDENCE.md:270:Síntesis automática derivada de IBSE_FACTORES. Identifica el factor de menor
docs/contracts/CONTRACT-EVIDENCE.md:273:**IBSE_RESUMEN no es evidencia primaria.** Es un derivado del sistema. No debe
docs/contracts/CONTRACT-EVIDENCE.md:274:prevalecer sobre los datos cuantitativos (IBSE_FACTORES) cuando exista
docs/contracts/CONTRACT-EVIDENCE.md:277:metodológicas del instrumento IBSE (Bericat, 2014).
docs/contracts/CONTRACT-EVIDENCE.md:399:**I-E7 — IBSE_RESUMEN es siempre secundario**
docs/contracts/CONTRACT-EVIDENCE.md:402:su contenido y los datos de IBSE_FACTORES (`kind: "indicator"`), los datos
docs/contracts/CONTRACT-EVIDENCE.md:431:  (IBSE, SF-12, DUKE, PREDIMED y otros).
docs/contracts/CONTRACT-EVIDENCE.md:439:| 2026-06-24 | Primera redacción. Documenta el estado del código a partir del commit `1e582f5`. Incluye la distinción IBSE_FACTORES / IBSE_RESUMEN, las reglas A–E del IntegrityGuard y la correspondencia DocumentKind → EvidenceOrigin del pipeline genérico. |
docs/contracts/CONTRACT-INDEX.md:64:**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
docs/contracts/CONTRACT-INDEX.md:73:Gramática editorial de los paneles de estudios complementarios. Distingue tres categorías: bloques obligatorios en UI (metadatos, barras, referencias, recordatorio), bloques condicionales (interpretación asistida, cautelas) y bloques de referencia de sistema (identidad, integraciones). Define también para qué instrumentos aplica la interpretación asistida (solo IBSE entre los actuales).
docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
docs/contracts/CONTRACT-MIT-PSL.md:87:| IBSE | `ibse` | Implementado |
docs/contracts/CONTRACT-MIT-PSL.md:227:| `fuente` | Coexistencia de fuentes con escalas o poblaciones distintas (IBSE + Informe de Salud; ciudadanía + técnica) |
docs/contracts/CONTRACT-MIT-PSL.md:228:| `escala` | IBSE (escala individual) + indicadores poblacionales |
docs/contracts/CONTRACT-MIT-PSL.md:244:3. **Divergencia de fuente significativa**: coexistencia de IBSE e Informe
docs/contracts/CONTRACT-MIT-PSL.md:342:IDs de átomos activos, presencia de fuentes relevantes (IBSE, Priorización
docs/contracts/CONTRACT-PERSISTENCE.md:38:| `ibseStudy` | Estudio complementario IBSE procesado, si existe |
docs/contracts/CONTRACT-PERSISTENCE.md:214:Esta migración garantiza que el tipo `IBSEStudy` sea estructuralmente válido
docs/contracts/CONTRACT-REPOSITORY.md:92:| `redcap-export` | Exportación REDCap | Por `tag` (IBSE, TP) o acumulable | Sí |
docs/contracts/CONTRACT-REPOSITORY.md:108:### IBSE y Priorización Temática dentro de `redcap-export`
docs/contracts/CONTRACT-REPOSITORY.md:110:IBSE (Índice de Bienestar Socioemocional) y la Priorización Temática son
docs/contracts/CONTRACT-REPOSITORY.md:116:| IBSE | `redcap-export` | `"ibse"` |
docs/contracts/CONTRACT-REPOSITORY.md:119:**El `kind` compartido no implica sustitución mutua.** Registrar un nuevo IBSE
docs/contracts/CONTRACT-REPOSITORY.md:124:para identificar o sustituir documentos IBSE o de Priorización Temática.
docs/contracts/CONTRACT-REPOSITORY.md:159:| `"ibse"` | IBSE — Índice de Bienestar Socioemocional |
docs/contracts/CONTRACT-REPOSITORY.md:188:de CSV IBSE, importación de CSV de Priorización Temática, ingesta manual de
docs/contracts/CONTRACT-REPOSITORY.md:258:IBSE y Priorización Temática. La purga de evidencia derivada asociada es
docs/contracts/CONTRACT-REPOSITORY.md:324:**I-R4 — Unicidad del documento IBSE**
docs/contracts/CONTRACT-REPOSITORY.md:332:**I-R6 — IBSE y Priorización Temática son independientes**
docs/contracts/CONTRACT-REPOSITORY.md:333:La existencia, sustitución o eliminación de un documento IBSE no afecta al
docs/contracts/CONTRACT-REPOSITORY.md:391:  (IBSE, SF-12, DUKE, PREDIMED y otros).
docs/contracts/CONTRACT-SCALE-PANELS.md:20:| IBSE | IBSEPanel |
docs/contracts/CONTRACT-SCALE-PANELS.md:88:**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).
docs/contracts/CONTRACT-SCALE-PANELS.md:175:### IBSE
tests/atarfe-complementary-studies.test.ts:7:import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "../src/application/ibse";
tests/atarfe-complementary-studies.test.ts:13:import { createIBSEStudy } from "../src/domain/ibse";
tests/atarfe-complementary-studies.test.ts:77:const ibseParsed = parseIBSECSV(fixture("ibse-atarfe.csv"));
tests/atarfe-complementary-studies.test.ts:78:const ibseStudy = createIBSEStudy({
tests/atarfe-complementary-studies.test.ts:91:    title: "IBSE - ibse-atarfe.csv",
tests/atarfe-complementary-studies.test.ts:93:    source: { system: "Importacion REDCap IBSE" },
tests/atarfe-complementary-studies.test.ts:261:    expect(inventory.hasIBSE).toBe(true);
tests/atarfe-workspace.test.ts:18: *   - IBSE: fixture no versionado (datos municipales, no EAS provincial).
tests/atarfe-workspace.test.ts:19: *     El IBSE ya existe en el workspace de producción de Atarfe vía REDCap.
tests/atarfe-workspace.test.ts:486:  it('IBSE: no en este test (fixture municipal no versionado — ya cargado en prod)', () => {
tests/atarfe-workspace.test.ts:487:    // El IBSE de Atarfe existe en el workspace de producción (localStorage del navegador).
tests/atarfe-workspace.test.ts:488:    // No hay fixture versionado para IBSE municipal; se carga vía REDCap en la UI.
tests/home-complementary-studies.smoke.mjs:115:  for (const label of ["IBSE", "DUKE-EAS", "PREDIMED-EAS", "SF-12 EAS", "Sueño EAS", "CAGE-EAS"]) {
tests/home-complementary-studies.smoke.mjs:119:  await checkStudyRow(page, "IBSE", "#ibse-csv-input");
tests/ibse.test.ts:3:import { createIBSEStudy } from "../src/domain/ibse";
tests/ibse.test.ts:7:function makeStudy(overrides: Partial<Parameters<typeof createIBSEStudy>[0]> = {}) {
tests/ibse.test.ts:8:  return createIBSEStudy({
tests/ibse.test.ts:25:describe("IBSEStudyToEvidenceAtoms — escala 0–100", () => {
tests/load-atarfe-complete.mjs:14:  { name: "IBSE", input: "ibse-csv-input", file: "ibse-atarfe.csv", field: "ibseStudy", tag: "ibse", atoms: 6 },
tests/load-atarfe-complete.mjs:178:  if (ibse)  console.log(`  IBSE           n=${ibse.aggregates.nValid} válidos · media IBSE total=${ibse.aggregates.meanTotal}`);

----- DUKE -----
src/App.tsx:24:import { parseDUKECSV, dukeStudyToEvidenceAtoms } from "./application/duke";
src/App.tsx:25:import { createDUKEStudy } from "./domain/duke";
src/App.tsx:142:const DUKE_DOCUMENT_TAG = "duke-eas";
src/App.tsx:157:function isDUKEDocument(document: MunicipalDocument | undefined): boolean {
src/App.tsx:158:  return hasDocumentTag(document, DUKE_DOCUMENT_TAG);
src/App.tsx:278:  const [isLoadingDUKE, setIsLoadingDUKE] = useState(false);
src/App.tsx:657:  async function handleLoadDUKECSV(file: File): Promise<void> {
src/App.tsx:658:    setIsLoadingDUKE(true);
src/App.tsx:661:      const { aggregates, methodologicalCautions, warnings } = parseDUKECSV(text);
src/App.tsx:663:      const study = createDUKEStudy({
src/App.tsx:678:          DUKE_DOCUMENT_TAG
src/App.tsx:683:          title: `DUKE-EAS - ${file.name}`,
src/App.tsx:685:            system: "EAS microdatos — Apoyo social funcional (DUKE-UNC-11)",
src/App.tsx:689:          tags: ["complementary-study", DUKE_DOCUMENT_TAG, "eas"],
src/App.tsx:698:                atom.tags.includes(DUKE_DOCUMENT_TAG)
src/App.tsx:718:          ? `DUKE-EAS cargado: ${aggregates.nValidGlobal} registros globales validos de ${aggregates.n}. Apoyo bajo global: ${aggregates.lowGlobalPercentage.toFixed(1)} %. ${dukeAtoms.length} evidencias incorporadas.${warn}`
src/App.tsx:719:          : `CSV DUKE-EAS procesado sin registros globales completos.${warn}`
src/App.tsx:724:      setIsLoadingDUKE(false);
src/App.tsx:1196:    if (isDUKEDocument(deletedDocument)) {
src/App.tsx:1198:      setIsLoadingDUKE(false);
src/App.tsx:1227:      const deletesDUKE = isDUKEDocument(doc);
src/App.tsx:1247:                deletesDUKE &&
src/App.tsx:1249:                atom.tags.includes(DUKE_DOCUMENT_TAG)
src/App.tsx:1294:        dukeStudy: deletesDUKE ? undefined : prev.dukeStudy,
src/App.tsx:1332:    setIsLoadingDUKE(false);
src/App.tsx:1788:              isLoadingDUKE={isLoadingDUKE}
src/App.tsx:1790:              onLoadDUKECSV={handleLoadDUKECSV}
src/application/duke/DUKECSVParser.ts:2:  DUKEAggregates,
src/application/duke/DUKECSVParser.ts:3:  DUKERowInput,
src/application/duke/DUKECSVParser.ts:4:  DUKERowScores,
src/application/duke/DUKECSVParser.ts:9:// ── Configuración derivada de DUKE_EAS_MODULE ─────────────────────────────────
src/application/duke/DUKECSVParser.ts:16:    "[DUKECSVParser] Módulo 'duke-eas' no encontrado en el registro metodológico. " +
src/application/duke/DUKECSVParser.ts:17:    "Verifica que DUKE_EAS_MODULE esté registrado en domain/methodology/registry.ts."
src/application/duke/DUKECSVParser.ts:23:    "[DUKECSVParser] DUKE_EAS_MODULE no tiene adaptador SAV configurado. " +
src/application/duke/DUKECSVParser.ts:35:function dimToFields(dimensionId: string): readonly (keyof DUKERowInput)[] {
src/application/duke/DUKECSVParser.ts:39:      `[DUKECSVParser] Dimensión "${dimensionId}" no encontrada en DUKE_EAS_MODULE. ` +
src/application/duke/DUKECSVParser.ts:47:        `[DUKECSVParser] Columna SAV para el ítem "${id}" no encontrada en DUKE_EAS_MODULE.adapters.sav.`
src/application/duke/DUKECSVParser.ts:50:    return col as keyof DUKERowInput;
src/application/duke/DUKECSVParser.ts:60:const EMPTY_AGGREGATES: DUKEAggregates = {
src/application/duke/DUKECSVParser.ts:82:export interface DUKECSVParseResult {
src/application/duke/DUKECSVParser.ts:83:  aggregates: DUKEAggregates;
src/application/duke/DUKECSVParser.ts:88:function isValidDUKEResponse(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
src/application/duke/DUKECSVParser.ts:98:  input: DUKERowInput,
src/application/duke/DUKECSVParser.ts:99:  fields: readonly (keyof DUKERowInput)[]
src/application/duke/DUKECSVParser.ts:104:    if (!isValidDUKEResponse(value)) return null;
src/application/duke/DUKECSVParser.ts:110:export function calculateDUKEScores(input: DUKERowInput): DUKERowScores {
src/application/duke/DUKECSVParser.ts:128:function parseDUKEValue(raw: string | undefined): number | null {
src/application/duke/DUKECSVParser.ts:132:  return isValidDUKEResponse(value) ? value : null;
src/application/duke/DUKECSVParser.ts:135:function readDUKERow(
src/application/duke/DUKECSVParser.ts:138:): DUKERowInput {
src/application/duke/DUKECSVParser.ts:139:  return ITEM_FIELDS.reduce<DUKERowInput>((acc, field) => {
src/application/duke/DUKECSVParser.ts:141:    acc[field] = index === -1 ? null : parseDUKEValue(row[index]);
src/application/duke/DUKECSVParser.ts:154:function buildCautions(aggregates: DUKEAggregates): string[] {
src/application/duke/DUKECSVParser.ts:156:    "DUKE-EAS: recodificacion reconstruida empiricamente desde los microdatos EAS disponibles con reproduccion 100 %. No se presenta como criterio clinico universal.",
src/application/duke/DUKECSVParser.ts:169:      "CSV sin registros DUKE completos para la escala global. Verifica el formato y los valores validos 1..5."
src/application/duke/DUKECSVParser.ts:181:      `${incompleteRate.toFixed(1)} % de registros con DUKE global incompleto/no calculable. Posible sesgo de no respuesta.`
src/application/duke/DUKECSVParser.ts:188:export function parseDUKECSV(csvText: string): DUKECSVParseResult {
src/application/duke/DUKECSVParser.ts:209:      ? [`Columnas DUKE-EAS no encontradas: ${missing.join(", ")}.`]
src/application/duke/DUKECSVParser.ts:231:    const scores = calculateDUKEScores(readDUKERow(row, indexes));
src/application/duke/DUKECSVParser.ts:262:  const aggregates: DUKEAggregates = {
src/application/duke/DUKEStudyToEvidenceAtoms.ts:2:import type { DUKEStudy } from "../../domain/duke";
src/application/duke/DUKEStudyToEvidenceAtoms.ts:4:interface DUKEIndicatorDef {
src/application/duke/DUKEStudyToEvidenceAtoms.ts:8:    DUKEStudy["aggregates"],
src/application/duke/DUKEStudyToEvidenceAtoms.ts:12:    DUKEStudy["aggregates"],
src/application/duke/DUKEStudyToEvidenceAtoms.ts:16:    DUKEStudy["aggregates"],
src/application/duke/DUKEStudyToEvidenceAtoms.ts:20:    DUKEStudy["aggregates"],
src/application/duke/DUKEStudyToEvidenceAtoms.ts:24:    DUKEStudy["aggregates"],
src/application/duke/DUKEStudyToEvidenceAtoms.ts:31:const DUKE_INDICATORS: DUKEIndicatorDef[] = [
src/application/duke/DUKEStudyToEvidenceAtoms.ts:34:    title: "DUKE-EAS - Apoyo social funcional global",
src/application/duke/DUKEStudyToEvidenceAtoms.ts:45:    title: "DUKE-EAS - Apoyo confidencial",
src/application/duke/DUKEStudyToEvidenceAtoms.ts:56:    title: "DUKE-EAS - Apoyo afectivo",
src/application/duke/DUKEStudyToEvidenceAtoms.ts:71:export function dukeStudyToEvidenceAtoms(study: DUKEStudy): EvidenceAtom[] {
src/application/duke/DUKEStudyToEvidenceAtoms.ts:87:  const indicatorAtoms = DUKE_INDICATORS.map((def) => {
src/application/duke/DUKEStudyToEvidenceAtoms.ts:112:          "Agregado municipal calculado desde CSV DUKE-EAS. La recodificacion implementada se reconstruyo empiricamente desde los microdatos EAS disponibles con reproduccion 100 %.",
src/application/duke/DUKEStudyToEvidenceAtoms.ts:124:    title: "DUKE-EAS - Cautela metodologica de recodificacion",
src/application/duke/DUKEStudyToEvidenceAtoms.ts:126:      "La recodificacion DUKE-EAS usada por COMPAS NG reproduce al 100 % los microdatos EAS disponibles, " +
src/application/duke/DUKEStudyToEvidenceAtoms.ts:137:        "Cautela metodologica asociada al procesamiento DUKE-EAS como estudio complementario concreto.",
src/application/duke/index.ts:1:export * from "./DUKECSVParser";
src/application/duke/index.ts:2:export * from "./DUKEStudyToEvidenceAtoms";
src/application/municipal-inventory/createMunicipalInventory.ts:10:  hasDUKE: boolean;
src/application/municipal-inventory/createMunicipalInventory.ts:38:  const hasDUKE        = snapshot.dukeStudy !== undefined;
src/application/municipal-inventory/createMunicipalInventory.ts:73:    hasDUKE,
src/domain/duke/DUKEAggregates.ts:1:export type DUKEResponseValue = 1 | 2 | 3 | 4 | 5;
src/domain/duke/DUKEAggregates.ts:3:export type DUKERecodedSupport = 0 | 1 | 993;
src/domain/duke/DUKEAggregates.ts:5:export interface DUKERowInput {
src/domain/duke/DUKEAggregates.ts:19:export interface DUKERowScores {
src/domain/duke/DUKEAggregates.ts:23:  P57GLOBAL_R: DUKERecodedSupport;
src/domain/duke/DUKEAggregates.ts:24:  P57_AC_R: DUKERecodedSupport;
src/domain/duke/DUKEAggregates.ts:25:  P57_AF_R: DUKERecodedSupport;
src/domain/duke/DUKEAggregates.ts:28:export interface DUKEAggregates {
src/domain/duke/DUKEStudy.ts:2:import type { DUKEAggregates } from "./DUKEAggregates";
src/domain/duke/DUKEStudy.ts:4:export interface DUKEStudy {
src/domain/duke/DUKEStudy.ts:8:  aggregates: DUKEAggregates;
src/domain/duke/DUKEStudy.ts:15:export interface CreateDUKEStudyInput {
src/domain/duke/DUKEStudy.ts:18:  aggregates: DUKEAggregates;
src/domain/duke/DUKEStudy.ts:23:export function createDUKEStudy(input: CreateDUKEStudyInput): DUKEStudy {
src/domain/duke/index.ts:1:export * from "./DUKEAggregates";
src/domain/duke/index.ts:2:export * from "./DUKEStudy";
src/domain/methodology/definitions/duke-eas.ts:3:// Definición canónica del Duke-UNC-11 en su adaptación EAS (DUKE-EAS).
src/domain/methodology/definitions/duke-eas.ts:13:// Esta definición es declarativa. El parser DUKECSVParser.ts no la consume todavía.
src/domain/methodology/definitions/duke-eas.ts:25:export const DUKE_EAS_MODULE: MethodologicalModule = {
src/domain/methodology/definitions/duke-eas.ts:31:    name: "Apoyo Social Funcional DUKE-EAS",
src/domain/methodology/definitions/duke-eas.ts:32:    shortName: "DUKE-EAS",
src/domain/methodology/definitions/duke-eas.ts:262:      source: "Fixture EAS Granada — parseDUKECSV (fixtures/duke-eas-granada.csv, n=3028)",
src/domain/methodology/registry.ts:3:import { DUKE_EAS_MODULE } from "./definitions/duke-eas";
src/domain/methodology/registry.ts:12:  [DUKE_EAS_MODULE.identity.id, DUKE_EAS_MODULE],
src/domain/municipality-context/MunicipalityContext.ts:19:import type { DUKEStudy } from "../duke";
src/domain/municipality-context/MunicipalityContext.ts:36:  dukeStudy?: DUKEStudy;
src/domain/questionnaire/QuestionnaireDefinition.ts:21:  // Módulos metodológicos seleccionados (IBSE, DUKE, CAGE, ...)
src/domain/workspace/MunicipalityWorkspace.ts:6:import type { DUKEStudy } from "../duke";
src/domain/workspace/MunicipalityWorkspace.ts:48:  dukeStudy?: DUKEStudy;
src/ui/components/DocumentIngestionPanel.tsx:130:            Los instrumentos tipificados (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12) se cargan
src/ui/components/DocumentRepositoryPanel.tsx:30:  "duke-eas": "DUKE-EAS",
src/ui/components/DUKEPanel.tsx:1:import type { DUKEStudy } from "../../domain/duke";
src/ui/components/DUKEPanel.tsx:3:interface DUKEPanelProps {
src/ui/components/DUKEPanel.tsx:4:  dukeStudy?: DUKEStudy;
src/ui/components/DUKEPanel.tsx:10:// DUKE-UNC-11: escala 0–55, mayor = mayor apoyo social percibido.
src/ui/components/DUKEPanel.tsx:12:const DUKE_MAX = 55;
src/ui/components/DUKEPanel.tsx:14:interface DUKEBarRowProps {
src/ui/components/DUKEPanel.tsx:22:function DUKEBarRow({ label, value, nValid, lowPercent, isTotal = false }: DUKEBarRowProps) {
src/ui/components/DUKEPanel.tsx:23:  const pct = (value / DUKE_MAX) * 100;
src/ui/components/DUKEPanel.tsx:32:            aria-label={`${value} sobre ${DUKE_MAX}`}
src/ui/components/DUKEPanel.tsx:36:      <td className="study-bar-row__value">{value}/{DUKE_MAX}</td>
src/ui/components/DUKEPanel.tsx:44:export function DUKEPanel({
src/ui/components/DUKEPanel.tsx:49:}: DUKEPanelProps) {
src/ui/components/DUKEPanel.tsx:55:            Cargar CSV DUKE-EAS (.csv)
src/ui/components/DUKEPanel.tsx:71:          <p className="study-hint">Procesando CSV DUKE-EAS…</p>
src/ui/components/DUKEPanel.tsx:90:                <DUKEBarRow
src/ui/components/DUKEPanel.tsx:97:                <DUKEBarRow
src/ui/components/DUKEPanel.tsx:103:                <DUKEBarRow
src/ui/components/DUKEPanel.tsx:141:          Ningún estudio DUKE-EAS cargado para este municipio. Importa un CSV
src/ui/components/EstudiosComplementariosPanel.tsx:3:import type { DUKEStudy } from "../../domain/duke";
src/ui/components/EstudiosComplementariosPanel.tsx:10:import { DUKEPanel } from "./DUKEPanel";
src/ui/components/EstudiosComplementariosPanel.tsx:143:  dukeStudy?: DUKEStudy;
src/ui/components/EstudiosComplementariosPanel.tsx:144:  isLoadingDUKE?: boolean;
src/ui/components/EstudiosComplementariosPanel.tsx:146:  onLoadDUKECSV?: (file: File) => void;
src/ui/components/EstudiosComplementariosPanel.tsx:181:  isLoadingDUKE,
src/ui/components/EstudiosComplementariosPanel.tsx:183:  onLoadDUKECSV,
src/ui/components/EstudiosComplementariosPanel.tsx:249:          name="DUKE-EAS"
src/ui/components/EstudiosComplementariosPanel.tsx:253:          isLoading={isLoadingDUKE}
src/ui/components/EstudiosComplementariosPanel.tsx:257:          onLoadCSV={onLoadDUKECSV}
src/ui/components/EstudiosComplementariosPanel.tsx:260:          <DUKEPanel dukeStudy={dukeStudy} isLoading={isLoadingDUKE} message={dukeMessage} onLoadCSV={onLoadDUKECSV} />
src/ui/components/index.ts:7:export * from "./DUKEPanel";
src/ui/components/LocalHealthProfileView.tsx:654:                <span className="psl-doc-source-flag__name">DUKE-EAS</span>
src/ui/components/MunicipalInventoryPanel.tsx:63:          label="Apoyo social funcional (DUKE-EAS)"
src/ui/components/MunicipalInventoryPanel.tsx:64:          present={inventory.hasDUKE}
src/ui/components/MunicipalInventoryPanel.tsx:66:            inventory.hasDUKE
docs/architecture/OPERATING-CONSTITUTION.md:84:| Estudios EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `complementary-study` + tag propio | Acumulable por tag |
docs/architecture/OPERATING-CONSTITUTION.md:155:- Los seis estudios (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS)
docs/architecture/OPERATING-CONSTITUTION.md:197:   IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS tienen el mismo
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:41:IBSE, SF-12, DUKE, PREDIMED, CAGE, ESCA y cualquier otro instrumento que se
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:51:| **DUKE-EAS** — Apoyo social funcional (Duke-UNC-11 sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:98:| Instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `"complementary-study"` | Tag propio del instrumento | Por tag (uno por municipio) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:112:por el equipo. Los instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) son
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:126:| DUKE-EAS | `complementary-study` | `"duke-eas"` |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:254:Los instrumentos de Estudios Complementarios validados (IBSE, SF-12, DUKE,
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:450:SF-12, DUKE, PREDIMED, CAGE y otros instrumentos reconocidos en DOMAIN-MODEL.md
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:485:| **DUKE-EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:492:### Nota §9a — Deuda técnica: DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS sin MethodologicalModule
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:497:- Sus parsers **hardcodean los nombres de columna** (p. ej. `P5701`–`P5711` en DUKE; `Predimed` con fallback a ítems en PREDIMED; `PCS12_SP`/`MCS12_SP` en SF-12; `P33_R`/`P33A` en Sueño; `CAGE_R`/`CAGE` en CAGE), en lugar de derivarlos de un módulo metodológico como hace el parser de IBSE.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:502:Adicionalmente, DUKE-EAS tiene un `MethodologicalModule` parcial en `domain/methodology/definitions/duke-eas.ts` que **sí está registrado** en el registry y del que el parser DUKE deriva su configuración de columnas. El resto de instrumentos EAS (PREDIMED, SF-12, Sueño, CAGE) no tienen módulo registrado.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:567:| 2026-06-25 | Actualización de estado: DUKE-EAS y PREDIMED-EAS pasan de «Conceptual» a «Implementado» en §2.2 y §9. Se añade nota §9a documentando la deuda técnica por ausencia de `MethodologicalModule` en la Biblioteca Metodológica y la desviación de parsers respecto al patrón §10. |
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:85:- DUKE-EAS: n válido global = 3.028 (datos provinciales, no específicos de Atarfe)
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:92:- Recodificaciones reconstructivas documentadas (p. ej., regla EAS-DUKE).
docs/contracts/CONTRACT-EVIDENCE.md:431:  (IBSE, SF-12, DUKE, PREDIMED y otros).
docs/contracts/CONTRACT-INDEX.md:64:**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
docs/contracts/CONTRACT-PERSISTENCE.md:39:| `dukeStudy` | Estudio DUKE-EAS procesado, si existe |
docs/contracts/CONTRACT-REPOSITORY.md:391:  (IBSE, SF-12, DUKE, PREDIMED y otros).
docs/contracts/CONTRACT-SCALE-PANELS.md:21:| DUKE-EAS | DUKEPanel |
docs/contracts/CONTRACT-SCALE-PANELS.md:88:**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).
docs/contracts/CONTRACT-SCALE-PANELS.md:184:### DUKE-EAS
tests/atarfe-complementary-studies.test.ts:8:import { parseDUKECSV, dukeStudyToEvidenceAtoms } from "../src/application/duke";
tests/atarfe-complementary-studies.test.ts:14:import { createDUKEStudy } from "../src/domain/duke";
tests/atarfe-complementary-studies.test.ts:99:const dukeParsed = parseDUKECSV(fixture("duke-eas-granada.csv"));
tests/atarfe-complementary-studies.test.ts:100:const dukeStudy = createDUKEStudy({
tests/atarfe-complementary-studies.test.ts:114:    title: "DUKE-EAS - duke-eas-granada.csv",
tests/atarfe-complementary-studies.test.ts:262:    expect(inventory.hasDUKE).toBe(true);
tests/atarfe-workspace.test.ts:7: *   parseDUKECSV / parsePREDIMEDCSV → createStudy → toEvidenceAtoms → workspace
tests/atarfe-workspace.test.ts:10: *   - DUKE-EAS     → fixtures/duke-eas-granada.csv (n=3028, referencia provincial Granada)
tests/atarfe-workspace.test.ts:28:import { parseDUKECSV, dukeStudyToEvidenceAtoms } from '../src/application/duke'
tests/atarfe-workspace.test.ts:29:import { createDUKEStudy } from '../src/domain/duke'
tests/atarfe-workspace.test.ts:44:const DUKE_CSV     = readFileSync(resolve(_dir, '../fixtures/duke-eas-granada.csv'), 'utf-8')
tests/atarfe-workspace.test.ts:49:// Replica el flujo de App.tsx (handleLoadDUKECSV / handleLoadPREDIMEDCSV /
tests/atarfe-workspace.test.ts:53:const DUKE_DOC_ID      = 'duke-eas-granada-fixture'
tests/atarfe-workspace.test.ts:66:// 2. DUKE-EAS
tests/atarfe-workspace.test.ts:67:const dukeParseResult = parseDUKECSV(DUKE_CSV)
tests/atarfe-workspace.test.ts:68:const dukeStudy = createDUKEStudy({
tests/atarfe-workspace.test.ts:77:  provenance: { ...a.provenance, documentId: DUKE_DOC_ID },
tests/atarfe-workspace.test.ts:89:      id:           DUKE_DOC_ID,
tests/atarfe-workspace.test.ts:91:      title:        'DUKE-EAS - duke-eas-granada.csv',
tests/atarfe-workspace.test.ts:93:      source:       { system: 'EAS microdatos — Apoyo social funcional (DUKE-UNC-11)' },
tests/atarfe-workspace.test.ts:230:  it('3 documentos en el repositorio (DUKE + PREDIMED + SF-12)', () => {
tests/atarfe-workspace.test.ts:235:// ── DUKE-EAS ──────────────────────────────────────────────────────────────
tests/atarfe-workspace.test.ts:237:describe('Atarfe — DUKE-EAS (fixtures/duke-eas-granada.csv)', () => {
tests/atarfe-workspace.test.ts:261:    const doc = workspace.repository.documents.find(d => d.id === DUKE_DOC_ID)
tests/atarfe-workspace.test.ts:375:  it('14 átomos totales (4 DUKE + 2 PREDIMED + 3 SF-12 + 5 TP)', () => {
tests/atarfe-workspace.test.ts:414:  it('inventory.hasDUKE = true', () => {
tests/atarfe-workspace.test.ts:415:    expect(inventory.hasDUKE).toBe(true)
tests/atarfe-workspace.test.ts:462:  it('Perfil de Salud Local: DUKE, PREDIMED y SF-12 presentes en snapshot', () => {
tests/duke.test.ts:5:import { parseDUKECSV, calculateDUKEScores } from '../src/application/duke/DUKECSVParser'
tests/duke.test.ts:6:import { createDUKEStudy } from '../src/domain/duke'
tests/duke.test.ts:7:import { dukeStudyToEvidenceAtoms } from '../src/application/duke/DUKEStudyToEvidenceAtoms'
tests/duke.test.ts:12:// ── Fixture: parseDUKECSV ────────────────────────────────────────────────────
tests/duke.test.ts:14:describe('parseDUKECSV — fixture granada (3028 registros)', () => {
tests/duke.test.ts:15:  const result = parseDUKECSV(FIXTURE_CSV)
tests/duke.test.ts:60:// ── Unidad: calculateDUKEScores ──────────────────────────────────────────────
tests/duke.test.ts:62:describe('calculateDUKEScores — casos unitarios', () => {
tests/duke.test.ts:77:    const scores = calculateDUKEScores(all5s)
tests/duke.test.ts:87:    const scores = calculateDUKEScores(all1s)
tests/duke.test.ts:98:    const scores = calculateDUKEScores({ ...all5s, P5701: null })
tests/duke.test.ts:109:    const scores = calculateDUKEScores({ ...all5s, P5703: null })
tests/duke.test.ts:122:  const parsed = parseDUKECSV(FIXTURE_CSV)
tests/duke.test.ts:123:  const study = createDUKEStudy({
tests/duke.test.ts:169:    const emptyParsed = parseDUKECSV('')
tests/duke.test.ts:170:    const emptyStudy = createDUKEStudy({
tests/duke.test.ts:180:// ── Casos de borde: parseDUKECSV ─────────────────────────────────────────────
tests/duke.test.ts:182:describe('parseDUKECSV — casos de borde', () => {
tests/duke.test.ts:184:    const result = parseDUKECSV('')
tests/duke.test.ts:192:    const result = parseDUKECSV(header + '\n')
tests/duke.test.ts:202:    const result = parseDUKECSV(csv)
tests/duke.test.ts:215:    const result = parseDUKECSV(csv)
tests/home-complementary-studies.smoke.mjs:115:  for (const label of ["IBSE", "DUKE-EAS", "PREDIMED-EAS", "SF-12 EAS", "Sueño EAS", "CAGE-EAS"]) {
tests/home-complementary-studies.smoke.mjs:120:  await checkStudyRow(page, "DUKE-EAS", "#duke-csv-input");
tests/load-atarfe-complete.mjs:15:  { name: "DUKE-EAS", input: "duke-csv-input", file: "duke-eas-granada.csv", field: "dukeStudy", tag: "duke-eas", atoms: 4 },
tests/load-atarfe-complete.mjs:179:  if (duke)  console.log(`  DUKE-EAS       n=${duke.aggregates.nValidGlobal} · media global=${duke.aggregates.meanGlobal}/55 · apoyo bajo=${duke.aggregates.lowGlobalPercentage}%`);
tests/methodology-registry.test.ts:223:            // ascendente (PREDIMED) como descendente (DUKE-EAS).

----- PREDIMED -----
src/App.tsx:26:import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "./application/predimed";
src/App.tsx:27:import { createPREDIMEDStudy } from "./domain/predimed";
src/App.tsx:143:const PREDIMED_DOCUMENT_TAG = "predimed-eas";
src/App.tsx:161:function isPREDIMEDDocument(document: MunicipalDocument | undefined): boolean {
src/App.tsx:162:  return hasDocumentTag(document, PREDIMED_DOCUMENT_TAG);
src/App.tsx:280:  const [isLoadingPREDIMED, setIsLoadingPREDIMED] = useState(false);
src/App.tsx:728:  async function handleLoadPREDIMEDCSV(file: File): Promise<void> {
src/App.tsx:729:    setIsLoadingPREDIMED(true);
src/App.tsx:732:      const { aggregates, methodologicalCautions, warnings } = parsePREDIMEDCSV(text);
src/App.tsx:734:      const study = createPREDIMEDStudy({
src/App.tsx:749:          PREDIMED_DOCUMENT_TAG
src/App.tsx:754:          title: `PREDIMED-EAS - ${file.name}`,
src/App.tsx:756:            system: "EAS microdatos — Adherencia dieta mediterránea (PREDIMED-14)",
src/App.tsx:760:          tags: ["complementary-study", PREDIMED_DOCUMENT_TAG, "eas"],
src/App.tsx:769:                atom.tags.includes(PREDIMED_DOCUMENT_TAG)
src/App.tsx:789:          ? `PREDIMED-EAS cargado: ${aggregates.nValid} registros validos de ${aggregates.n}. Alta adherencia: ${aggregates.highPercentage.toFixed(1)} %. ${predimedAtoms.length} evidencias incorporadas.${warn}`
src/App.tsx:790:          : `CSV PREDIMED-EAS procesado sin registros completos.${warn}`
src/App.tsx:795:      setIsLoadingPREDIMED(false);
src/App.tsx:1200:    if (isPREDIMEDDocument(deletedDocument)) {
src/App.tsx:1202:      setIsLoadingPREDIMED(false);
src/App.tsx:1228:      const deletesPREDIMED = isPREDIMEDDocument(doc);
src/App.tsx:1254:                deletesPREDIMED &&
src/App.tsx:1256:                atom.tags.includes(PREDIMED_DOCUMENT_TAG)
src/App.tsx:1295:        predimedStudy: deletesPREDIMED ? undefined : prev.predimedStudy,
src/App.tsx:1334:    setIsLoadingPREDIMED(false);
src/App.tsx:1792:              isLoadingPREDIMED={isLoadingPREDIMED}
src/App.tsx:1794:              onLoadPREDIMEDCSV={handleLoadPREDIMEDCSV}
src/application/municipal-inventory/createMunicipalInventory.ts:11:  hasPREDIMED: boolean;
src/application/municipal-inventory/createMunicipalInventory.ts:39:  const hasPREDIMED    = snapshot.predimedStudy !== undefined;
src/application/municipal-inventory/createMunicipalInventory.ts:74:    hasPREDIMED,
src/application/predimed/index.ts:1:export * from "./PREDIMEDCSVParser";
src/application/predimed/index.ts:2:export * from "./PREDIMEDStudyToEvidenceAtoms";
src/application/predimed/PREDIMEDCSVParser.ts:1:import type { PREDIMEDAggregates } from "../../domain/predimed";
src/application/predimed/PREDIMEDCSVParser.ts:5:// ── Configuración derivada de PREDIMED_EAS_MODULE ─────────────────────────────
src/application/predimed/PREDIMEDCSVParser.ts:12:    "[PREDIMEDCSVParser] Módulo 'predimed-eas' no encontrado en el registro metodológico. " +
src/application/predimed/PREDIMEDCSVParser.ts:13:    "Verifica que PREDIMED_EAS_MODULE esté registrado en domain/methodology/registry.ts."
src/application/predimed/PREDIMEDCSVParser.ts:19:    "[PREDIMEDCSVParser] PREDIMED_EAS_MODULE sin adaptador SAV configurado. " +
src/application/predimed/PREDIMEDCSVParser.ts:31:    "[PREDIMEDCSVParser] Variable canónica 'predimedScore' no encontrada en PREDIMED_EAS_MODULE.adapters.sav. " +
src/application/predimed/PREDIMEDCSVParser.ts:38:// Ver: PREDIMED_EAS_MODULE.algorithm.notes y fixtures/README.md.
src/application/predimed/PREDIMEDCSVParser.ts:48:const EMPTY_AGGREGATES: PREDIMEDAggregates = {
src/application/predimed/PREDIMEDCSVParser.ts:61:export interface PREDIMEDCSVParseResult {
src/application/predimed/PREDIMEDCSVParser.ts:62:  aggregates: PREDIMEDAggregates;
src/application/predimed/PREDIMEDCSVParser.ts:86:function buildCautions(aggregates: PREDIMEDAggregates): string[] {
src/application/predimed/PREDIMEDCSVParser.ts:89:    "PREDIMED-14: adherencia baja <= 6, media 7-8, alta >= 9. Corte segun Martinez-Gonzalez (2012), adaptacion EAS Andalucia.",
src/application/predimed/PREDIMEDCSVParser.ts:102:      "CSV sin registros PREDIMED completos. Verifica el formato y los valores validos (0..14) de la columna Predimed."
src/application/predimed/PREDIMEDCSVParser.ts:115:      `En los microdatos EAS READY, Predimed solo se calcula para registros de oleadas que incluyen el modulo PREDIMED-14.`
src/application/predimed/PREDIMEDCSVParser.ts:122:export function parsePREDIMEDCSV(csvText: string): PREDIMEDCSVParseResult {
src/application/predimed/PREDIMEDCSVParser.ts:155:        `El CSV no contiene datos PREDIMED procesables.`
src/application/predimed/PREDIMEDCSVParser.ts:192:  const aggregates: PREDIMEDAggregates = {
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:2:import type { PREDIMEDStudy } from "../../domain/predimed";
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:8:export function predimedStudyToEvidenceAtoms(study: PREDIMEDStudy): EvidenceAtom[] {
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:20:    title: "PREDIMED-EAS - Adherencia a dieta mediterranea",
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:22:      `Puntuacion media PREDIMED-14: ${aggregates.meanScore}/14. ` +
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:36:        "Agregado municipal calculado desde CSV PREDIMED-EAS. " +
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:49:    title: "PREDIMED-EAS - Cautela metodologica",
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:51:      "El indice PREDIMED-14 mide adherencia a la dieta mediterranea mediante 14 items dicotomicos. " +
src/application/predimed/PREDIMEDStudyToEvidenceAtoms.ts:63:        "Cautela metodologica asociada al procesamiento PREDIMED-EAS como estudio complementario concreto.",
src/domain/methodology/definitions/predimed-eas.ts:3:// Definición canónica del PREDIMED-14 en su adaptación EAS (PREDIMED-EAS).
src/domain/methodology/definitions/predimed-eas.ts:17:// Esta definición es declarativa. PREDIMEDCSVParser.ts no la consume todavía.
src/domain/methodology/definitions/predimed-eas.ts:20:export const PREDIMED_EAS_MODULE: MethodologicalModule = {
src/domain/methodology/definitions/predimed-eas.ts:26:    name: "Adherencia a la Dieta Mediterránea PREDIMED-EAS",
src/domain/methodology/definitions/predimed-eas.ts:27:    shortName: "PREDIMED-EAS",
src/domain/methodology/definitions/predimed-eas.ts:29:      "Cuestionario PREDIMED-14 de adherencia a la dieta mediterránea en su " +
src/domain/methodology/definitions/predimed-eas.ts:44:      "Adaptación del cuestionario PREDIMED-14 para la Encuesta Andaluza de Salud. " +
src/domain/methodology/definitions/predimed-eas.ts:49:      "del parser PREDIMEDCSVParser.ts. La publicación primaria específica del " +
src/domain/methodology/definitions/predimed-eas.ts:50:      "instrumento PREDIMED-14 y sus umbrales está pendiente de contraste. " +
src/domain/methodology/definitions/predimed-eas.ts:51:      "El estudio PREDIMED original: Estruch R et al., N Engl J Med 2013;368:1279-1290.",
src/domain/methodology/definitions/predimed-eas.ts:249:          "Administrar los 14 ítems dietéticos del cuestionario PREDIMED. " +
src/domain/methodology/definitions/predimed-eas.ts:282:      "Solo algunos oleadas EAS incluyen el módulo PREDIMED; la tasa de incompletos " +
src/domain/methodology/definitions/predimed-eas.ts:334:      "(712 de 3064 en el fixture Granada = 23,2 %). Las oleadas sin módulo PREDIMED " +
src/domain/methodology/definitions/predimed-eas.ts:339:      "Difieren de otras clasificaciones PREDIMED publicadas.",
src/domain/methodology/definitions/predimed-eas.ts:348:    "Solo las oleadas EAS que incluyen el módulo PREDIMED tienen `Predimed` válido. " +
src/domain/methodology/definitions/predimed-eas.ts:369:      authors: "Estruch, R. et al. (PREDIMED Study Investigators)",
src/domain/methodology/definitions/predimed-eas.ts:377:        "como factor cardioprotector. El cuestionario PREDIMED-14 fue desarrollado " +
src/domain/methodology/registry.ts:4:import { PREDIMED_EAS_MODULE } from "./definitions/predimed-eas";
src/domain/methodology/registry.ts:13:  [PREDIMED_EAS_MODULE.identity.id, PREDIMED_EAS_MODULE],
src/domain/municipality-context/MunicipalityContext.ts:20:import type { PREDIMEDStudy } from "../predimed";
src/domain/municipality-context/MunicipalityContext.ts:38:  predimedStudy?: PREDIMEDStudy;
src/domain/predimed/index.ts:1:export * from "./PREDIMEDAggregates";
src/domain/predimed/index.ts:2:export * from "./PREDIMEDStudy";
src/domain/predimed/PREDIMEDAggregates.ts:1:export interface PREDIMEDAggregates {
src/domain/predimed/PREDIMEDStudy.ts:2:import type { PREDIMEDAggregates } from "./PREDIMEDAggregates";
src/domain/predimed/PREDIMEDStudy.ts:4:export interface PREDIMEDStudy {
src/domain/predimed/PREDIMEDStudy.ts:8:  aggregates: PREDIMEDAggregates;
src/domain/predimed/PREDIMEDStudy.ts:15:export interface CreatePREDIMEDStudyInput {
src/domain/predimed/PREDIMEDStudy.ts:18:  aggregates: PREDIMEDAggregates;
src/domain/predimed/PREDIMEDStudy.ts:23:export function createPREDIMEDStudy(input: CreatePREDIMEDStudyInput): PREDIMEDStudy {
src/domain/workspace/MunicipalityWorkspace.ts:7:import type { PREDIMEDStudy } from "../predimed";
src/domain/workspace/MunicipalityWorkspace.ts:49:  predimedStudy?: PREDIMEDStudy;
src/ui/components/DocumentIngestionPanel.tsx:130:            Los instrumentos tipificados (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12) se cargan
src/ui/components/DocumentRepositoryPanel.tsx:31:  "predimed-eas": "PREDIMED-EAS",
src/ui/components/EstudiosComplementariosPanel.tsx:4:import type { PREDIMEDStudy } from "../../domain/predimed";
src/ui/components/EstudiosComplementariosPanel.tsx:11:import { PREDIMEDPanel } from "./PREDIMEDPanel";
src/ui/components/EstudiosComplementariosPanel.tsx:148:  predimedStudy?: PREDIMEDStudy;
src/ui/components/EstudiosComplementariosPanel.tsx:149:  isLoadingPREDIMED?: boolean;
src/ui/components/EstudiosComplementariosPanel.tsx:151:  onLoadPREDIMEDCSV?: (file: File) => void;
src/ui/components/EstudiosComplementariosPanel.tsx:185:  isLoadingPREDIMED,
src/ui/components/EstudiosComplementariosPanel.tsx:187:  onLoadPREDIMEDCSV,
src/ui/components/EstudiosComplementariosPanel.tsx:264:          name="PREDIMED-EAS"
src/ui/components/EstudiosComplementariosPanel.tsx:268:          isLoading={isLoadingPREDIMED}
src/ui/components/EstudiosComplementariosPanel.tsx:272:          onLoadCSV={onLoadPREDIMEDCSV}
src/ui/components/EstudiosComplementariosPanel.tsx:275:          <PREDIMEDPanel predimedStudy={predimedStudy} isLoading={isLoadingPREDIMED} message={predimedMessage} onLoadCSV={onLoadPREDIMEDCSV} />
src/ui/components/index.ts:8:export * from "./PREDIMEDPanel";
src/ui/components/LocalHealthProfileView.tsx:658:                <span className="psl-doc-source-flag__name">PREDIMED-EAS</span>
src/ui/components/MunicipalInventoryPanel.tsx:72:          label="Adherencia dieta mediterránea (PREDIMED-EAS)"
src/ui/components/MunicipalInventoryPanel.tsx:73:          present={inventory.hasPREDIMED}
src/ui/components/MunicipalInventoryPanel.tsx:75:            inventory.hasPREDIMED
src/ui/components/PREDIMEDPanel.tsx:1:import type { PREDIMEDStudy } from "../../domain/predimed";
src/ui/components/PREDIMEDPanel.tsx:3:interface PREDIMEDPanelProps {
src/ui/components/PREDIMEDPanel.tsx:4:  predimedStudy?: PREDIMEDStudy;
src/ui/components/PREDIMEDPanel.tsx:10:// PREDIMED-14: 14 ítems binarios. Cortes: alta ≥9, media 7–8, baja ≤6.
src/ui/components/PREDIMEDPanel.tsx:12:export function PREDIMEDPanel({
src/ui/components/PREDIMEDPanel.tsx:17:}: PREDIMEDPanelProps) {
src/ui/components/PREDIMEDPanel.tsx:23:            Cargar CSV PREDIMED-EAS (.csv)
src/ui/components/PREDIMEDPanel.tsx:39:          <p className="study-hint">Procesando CSV PREDIMED-EAS…</p>
src/ui/components/PREDIMEDPanel.tsx:64:                  <td className="study-bar-row__label">Media PREDIMED</td>
src/ui/components/PREDIMEDPanel.tsx:154:          Ningún estudio PREDIMED-EAS cargado para este municipio. Importa un
docs/architecture/OPERATING-CONSTITUTION.md:84:| Estudios EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `complementary-study` + tag propio | Acumulable por tag |
docs/architecture/OPERATING-CONSTITUTION.md:155:- Los seis estudios (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS)
docs/architecture/OPERATING-CONSTITUTION.md:197:   IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS tienen el mismo
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:41:IBSE, SF-12, DUKE, PREDIMED, CAGE, ESCA y cualquier otro instrumento que se
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:52:| **PREDIMED-EAS** — Adherencia a Dieta Mediterránea (PREDIMED-14 sobre EAS) | `validated-scale` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:80:(por ejemplo: bloque sociodemográfico EAS + IBSE + PREDIMED). En ese caso,
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:98:| Instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `"complementary-study"` | Tag propio del instrumento | Por tag (uno por municipio) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:112:por el equipo. Los instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) son
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:127:| PREDIMED-EAS | `complementary-study` | `"predimed-eas"` |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:255:PREDIMED) son `validated-scale`. Los módulos específicos del municipio son
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:450:SF-12, DUKE, PREDIMED, CAGE y otros instrumentos reconocidos en DOMAIN-MODEL.md
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:486:| **PREDIMED-EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:492:### Nota §9a — Deuda técnica: DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS sin MethodologicalModule
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:497:- Sus parsers **hardcodean los nombres de columna** (p. ej. `P5701`–`P5711` en DUKE; `Predimed` con fallback a ítems en PREDIMED; `PCS12_SP`/`MCS12_SP` en SF-12; `P33_R`/`P33A` en Sueño; `CAGE_R`/`CAGE` en CAGE), en lugar de derivarlos de un módulo metodológico como hace el parser de IBSE.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:502:Adicionalmente, DUKE-EAS tiene un `MethodologicalModule` parcial en `domain/methodology/definitions/duke-eas.ts` que **sí está registrado** en el registry y del que el parser DUKE deriva su configuración de columnas. El resto de instrumentos EAS (PREDIMED, SF-12, Sueño, CAGE) no tienen módulo registrado.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:567:| 2026-06-25 | Actualización de estado: DUKE-EAS y PREDIMED-EAS pasan de «Conceptual» a «Implementado» en §2.2 y §9. Se añade nota §9a documentando la deuda técnica por ausencia de `MethodologicalModule` en la Biblioteca Metodológica y la desviación de parsers respecto al patrón §10. |
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:86:- PREDIMED-EAS: n válido = 712
docs/contracts/CONTRACT-EVIDENCE.md:431:  (IBSE, SF-12, DUKE, PREDIMED y otros).
docs/contracts/CONTRACT-INDEX.md:64:**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
docs/contracts/CONTRACT-PERSISTENCE.md:40:| `predimedStudy` | Estudio PREDIMED-EAS procesado, si existe |
docs/contracts/CONTRACT-REPOSITORY.md:391:  (IBSE, SF-12, DUKE, PREDIMED y otros).
docs/contracts/CONTRACT-SCALE-PANELS.md:22:| PREDIMED-EAS | PREDIMEDPanel |
docs/contracts/CONTRACT-SCALE-PANELS.md:192:### PREDIMED-EAS
tests/atarfe-complementary-studies.test.ts:9:import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "../src/application/predimed";
tests/atarfe-complementary-studies.test.ts:15:import { createPREDIMEDStudy } from "../src/domain/predimed";
tests/atarfe-complementary-studies.test.ts:122:const predimedParsed = parsePREDIMEDCSV(fixture("predimed-eas-granada.csv"));
tests/atarfe-complementary-studies.test.ts:123:const predimedStudy = createPREDIMEDStudy({
tests/atarfe-complementary-studies.test.ts:137:    title: "PREDIMED-EAS - predimed-eas-granada.csv",
tests/atarfe-complementary-studies.test.ts:263:    expect(inventory.hasPREDIMED).toBe(true);
tests/atarfe-workspace.test.ts:7: *   parseDUKECSV / parsePREDIMEDCSV → createStudy → toEvidenceAtoms → workspace
tests/atarfe-workspace.test.ts:11: *   - PREDIMED-EAS → fixtures/predimed-eas-granada.csv (n=3064, oleadas con módulo)
tests/atarfe-workspace.test.ts:30:import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from '../src/application/predimed'
tests/atarfe-workspace.test.ts:31:import { createPREDIMEDStudy } from '../src/domain/predimed'
tests/atarfe-workspace.test.ts:45:const PREDIMED_CSV = readFileSync(resolve(_dir, '../fixtures/predimed-eas-granada.csv'), 'utf-8')
tests/atarfe-workspace.test.ts:49:// Replica el flujo de App.tsx (handleLoadDUKECSV / handleLoadPREDIMEDCSV /
tests/atarfe-workspace.test.ts:54:const PREDIMED_DOC_ID  = 'predimed-eas-granada-fixture'
tests/atarfe-workspace.test.ts:102:// 3. PREDIMED-EAS
tests/atarfe-workspace.test.ts:103:const predimedParseResult = parsePREDIMEDCSV(PREDIMED_CSV)
tests/atarfe-workspace.test.ts:104:const predimedStudy = createPREDIMEDStudy({
tests/atarfe-workspace.test.ts:113:  provenance: { ...a.provenance, documentId: PREDIMED_DOC_ID },
tests/atarfe-workspace.test.ts:125:      id:           PREDIMED_DOC_ID,
tests/atarfe-workspace.test.ts:127:      title:        'PREDIMED-EAS - predimed-eas-granada.csv',
tests/atarfe-workspace.test.ts:129:      source:       { system: 'EAS microdatos — Adherencia dieta mediterránea (PREDIMED-14)' },
tests/atarfe-workspace.test.ts:230:  it('3 documentos en el repositorio (DUKE + PREDIMED + SF-12)', () => {
tests/atarfe-workspace.test.ts:268:// ── PREDIMED-EAS ─────────────────────────────────────────────────────────
tests/atarfe-workspace.test.ts:270:describe('Atarfe — PREDIMED-EAS (fixtures/predimed-eas-granada.csv)', () => {
tests/atarfe-workspace.test.ts:283:  it('nValid = 712 (oleadas con módulo PREDIMED activo)', () => {
tests/atarfe-workspace.test.ts:294:    const doc = workspace.repository.documents.find(d => d.id === PREDIMED_DOC_ID)
tests/atarfe-workspace.test.ts:375:  it('14 átomos totales (4 DUKE + 2 PREDIMED + 3 SF-12 + 5 TP)', () => {
tests/atarfe-workspace.test.ts:418:  it('inventory.hasPREDIMED = true', () => {
tests/atarfe-workspace.test.ts:419:    expect(inventory.hasPREDIMED).toBe(true)
tests/atarfe-workspace.test.ts:462:  it('Perfil de Salud Local: DUKE, PREDIMED y SF-12 presentes en snapshot', () => {
tests/home-complementary-studies.smoke.mjs:115:  for (const label of ["IBSE", "DUKE-EAS", "PREDIMED-EAS", "SF-12 EAS", "Sueño EAS", "CAGE-EAS"]) {
tests/home-complementary-studies.smoke.mjs:121:  await checkStudyRow(page, "PREDIMED-EAS", "#predimed-csv-input");
tests/load-atarfe-complete.mjs:16:  { name: "PREDIMED-EAS", input: "predimed-csv-input", file: "predimed-eas-granada.csv", field: "predimedStudy", tag: "predimed-eas", atoms: 2 },
tests/load-atarfe-complete.mjs:180:  if (pred)  console.log(`  PREDIMED-EAS   n=${pred.aggregates.nValid} · media Predimed=${pred.aggregates.meanScore} · alta adherencia=${pred.aggregates.highPercentage}%`);
tests/methodology-registry.test.ts:223:            // ascendente (PREDIMED) como descendente (DUKE-EAS).
tests/predimed.test.ts:5:import { parsePREDIMEDCSV } from '../src/application/predimed/PREDIMEDCSVParser'
tests/predimed.test.ts:6:import { createPREDIMEDStudy } from '../src/domain/predimed'
tests/predimed.test.ts:7:import { predimedStudyToEvidenceAtoms } from '../src/application/predimed/PREDIMEDStudyToEvidenceAtoms'
tests/predimed.test.ts:12:// ── Fixture: parsePREDIMEDCSV ────────────────────────────────────────────────
tests/predimed.test.ts:14:describe('parsePREDIMEDCSV — fixture granada (3064 registros)', () => {
tests/predimed.test.ts:15:  const result = parsePREDIMEDCSV(FIXTURE_CSV)
tests/predimed.test.ts:25:  it('puntuación media PREDIMED correcta', () => {
tests/predimed.test.ts:38:  it('registros incompletos correctos (oleadas sin módulo PREDIMED)', () => {
tests/predimed.test.ts:54:  const parsed = parsePREDIMEDCSV(FIXTURE_CSV)
tests/predimed.test.ts:55:  const study = createPREDIMEDStudy({
tests/predimed.test.ts:98:    const emptyParsed = parsePREDIMEDCSV('')
tests/predimed.test.ts:99:    const emptyStudy = createPREDIMEDStudy({
tests/predimed.test.ts:109:// ── Casos de borde: parsePREDIMEDCSV ─────────────────────────────────────────
tests/predimed.test.ts:111:describe('parsePREDIMEDCSV — casos de borde', () => {
tests/predimed.test.ts:113:    const result = parsePREDIMEDCSV('')
tests/predimed.test.ts:125:    const result = parsePREDIMEDCSV(csv)
tests/predimed.test.ts:132:    const result = parsePREDIMEDCSV(csv)
tests/predimed.test.ts:139:    const result = parsePREDIMEDCSV(csv)
tests/predimed.test.ts:145:    const result = parsePREDIMEDCSV('Predimed\n0')
tests/predimed.test.ts:154:    const result = parsePREDIMEDCSV('Predimed\n14')
tests/predimed.test.ts:162:    const result = parsePREDIMEDCSV('Predimed\n15')
tests/predimed.test.ts:168:    const result = parsePREDIMEDCSV('Predimed\n-1')
tests/predimed.test.ts:174:    const result = parsePREDIMEDCSV('Predimed\n6\n7')
tests/predimed.test.ts:181:    const result = parsePREDIMEDCSV('Predimed\n8\n9')
tests/predimed.test.ts:190:    const result = parsePREDIMEDCSV('Predimed\n\n8')
tests/predimed.test.ts:198:    const result = parsePREDIMEDCSV('Predimed\n8.6')

----- SF12 -----
src/App.tsx:28:import { parseSF12CSV, sf12StudyToEvidenceAtoms } from "./application/sf12";
src/App.tsx:29:import { createSF12Study } from "./domain/sf12";
src/App.tsx:144:const SF12_DOCUMENT_TAG = "sf12-eas";
src/App.tsx:165:function isSF12Document(document: MunicipalDocument | undefined): boolean {
src/App.tsx:166:  return hasDocumentTag(document, SF12_DOCUMENT_TAG);
src/App.tsx:282:  const [isLoadingSF12, setIsLoadingSF12] = useState(false);
src/App.tsx:799:  async function handleLoadSF12CSV(file: File): Promise<void> {
src/App.tsx:800:    setIsLoadingSF12(true);
src/App.tsx:803:      const { aggregates, methodologicalCautions, warnings } = parseSF12CSV(text);
src/App.tsx:805:      const study = createSF12Study({
src/App.tsx:820:          SF12_DOCUMENT_TAG
src/App.tsx:831:          tags: ["complementary-study", SF12_DOCUMENT_TAG, "eas"],
src/App.tsx:840:                atom.tags.includes(SF12_DOCUMENT_TAG)
src/App.tsx:866:      setIsLoadingSF12(false);
src/App.tsx:1204:    if (isSF12Document(deletedDocument)) {
src/App.tsx:1206:      setIsLoadingSF12(false);
src/App.tsx:1229:      const deletesSF12 = isSF12Document(doc);
src/App.tsx:1261:                deletesSF12 &&
src/App.tsx:1263:                atom.tags.includes(SF12_DOCUMENT_TAG)
src/App.tsx:1296:        sf12Study: deletesSF12 ? undefined : prev.sf12Study,
src/App.tsx:1336:    setIsLoadingSF12(false);
src/App.tsx:1796:              isLoadingSF12={isLoadingSF12}
src/App.tsx:1798:              onLoadSF12CSV={handleLoadSF12CSV}
src/application/municipal-inventory/createMunicipalInventory.ts:12:  hasSF12: boolean;
src/application/municipal-inventory/createMunicipalInventory.ts:40:  const hasSF12        = snapshot.sf12Study !== undefined;
src/application/municipal-inventory/createMunicipalInventory.ts:75:    hasSF12,
src/application/sf12/index.ts:1:export * from "./SF12CSVParser";
src/application/sf12/index.ts:2:export * from "./SF12StudyToEvidenceAtoms";
src/application/sf12/SF12CSVParser.ts:1:import type { SF12Aggregates } from "../../domain/sf12";
src/application/sf12/SF12CSVParser.ts:9:const EMPTY_AGGREGATES: SF12Aggregates = {
src/application/sf12/SF12CSVParser.ts:19:export interface SF12CSVParseResult {
src/application/sf12/SF12CSVParser.ts:20:  aggregates: SF12Aggregates;
src/application/sf12/SF12CSVParser.ts:36:function buildCautions(aggregates: SF12Aggregates): string[] {
src/application/sf12/SF12CSVParser.ts:74:export function parseSF12CSV(csvText: string): SF12CSVParseResult {
src/application/sf12/SF12CSVParser.ts:127:  const aggregates: SF12Aggregates = {
src/application/sf12/SF12StudyToEvidenceAtoms.ts:2:import type { SF12Study } from "../../domain/sf12";
src/application/sf12/SF12StudyToEvidenceAtoms.ts:4:export function sf12StudyToEvidenceAtoms(study: SF12Study): EvidenceAtom[] {
src/domain/municipality-context/MunicipalityContext.ts:21:import type { SF12Study } from "../sf12";
src/domain/municipality-context/MunicipalityContext.ts:40:  sf12Study?: SF12Study;
src/domain/sf12/index.ts:1:export * from "./SF12Aggregates";
src/domain/sf12/index.ts:2:export * from "./SF12Study";
src/domain/sf12/SF12Aggregates.ts:1:export interface SF12Aggregates {
src/domain/sf12/SF12Study.ts:2:import type { SF12Aggregates } from "./SF12Aggregates";
src/domain/sf12/SF12Study.ts:4:export interface SF12Study {
src/domain/sf12/SF12Study.ts:8:  aggregates: SF12Aggregates;
src/domain/sf12/SF12Study.ts:15:export interface CreateSF12StudyInput {
src/domain/sf12/SF12Study.ts:18:  aggregates: SF12Aggregates;
src/domain/sf12/SF12Study.ts:23:export function createSF12Study(input: CreateSF12StudyInput): SF12Study {
src/domain/workspace/MunicipalityWorkspace.ts:8:import type { SF12Study } from "../sf12";
src/domain/workspace/MunicipalityWorkspace.ts:50:  sf12Study?: SF12Study;
src/ui/components/EstudiosComplementariosPanel.tsx:5:import type { SF12Study } from "../../domain/sf12";
src/ui/components/EstudiosComplementariosPanel.tsx:12:import { SF12Panel } from "./SF12Panel";
src/ui/components/EstudiosComplementariosPanel.tsx:153:  sf12Study?: SF12Study;
src/ui/components/EstudiosComplementariosPanel.tsx:154:  isLoadingSF12?: boolean;
src/ui/components/EstudiosComplementariosPanel.tsx:156:  onLoadSF12CSV?: (file: File) => void;
src/ui/components/EstudiosComplementariosPanel.tsx:189:  isLoadingSF12,
src/ui/components/EstudiosComplementariosPanel.tsx:191:  onLoadSF12CSV,
src/ui/components/EstudiosComplementariosPanel.tsx:283:          isLoading={isLoadingSF12}
src/ui/components/EstudiosComplementariosPanel.tsx:287:          onLoadCSV={onLoadSF12CSV}
src/ui/components/EstudiosComplementariosPanel.tsx:290:          <SF12Panel sf12Study={sf12Study} isLoading={isLoadingSF12} message={sf12Message} onLoadCSV={onLoadSF12CSV} />
src/ui/components/index.ts:9:export * from "./SF12Panel";
src/ui/components/MunicipalInventoryPanel.tsx:82:          present={inventory.hasSF12}
src/ui/components/MunicipalInventoryPanel.tsx:84:            inventory.hasSF12
src/ui/components/SF12Panel.tsx:1:import type { SF12Study } from "../../domain/sf12";
src/ui/components/SF12Panel.tsx:3:interface SF12PanelProps {
src/ui/components/SF12Panel.tsx:4:  sf12Study?: SF12Study;
src/ui/components/SF12Panel.tsx:13:export function SF12Panel({
src/ui/components/SF12Panel.tsx:18:}: SF12PanelProps) {
docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
docs/contracts/CONTRACT-SCALE-PANELS.md:23:| SF-12 EAS | SF12Panel |
tests/atarfe-complementary-studies.test.ts:10:import { parseSF12CSV, sf12StudyToEvidenceAtoms } from "../src/application/sf12";
tests/atarfe-complementary-studies.test.ts:16:import { createSF12Study } from "../src/domain/sf12";
tests/atarfe-complementary-studies.test.ts:145:const sf12Parsed = parseSF12CSV(fixture("sf12-eas-granada.csv"));
tests/atarfe-complementary-studies.test.ts:146:const sf12Study = createSF12Study({
tests/atarfe-complementary-studies.test.ts:264:    expect(inventory.hasSF12).toBe(true);
tests/atarfe-workspace.test.ts:32:import { parseSF12CSV, sf12StudyToEvidenceAtoms } from '../src/application/sf12'
tests/atarfe-workspace.test.ts:33:import { createSF12Study } from '../src/domain/sf12'
tests/atarfe-workspace.test.ts:46:const SF12_CSV     = readFileSync(resolve(_dir, '../fixtures/sf12-eas-granada.csv'), 'utf-8')
tests/atarfe-workspace.test.ts:55:const SF12_DOC_ID      = 'sf12-eas-granada-fixture'
tests/atarfe-workspace.test.ts:139:const sf12ParseResult = parseSF12CSV(SF12_CSV)
tests/atarfe-workspace.test.ts:140:const sf12Study = createSF12Study({
tests/atarfe-workspace.test.ts:149:  provenance: { ...a.provenance, documentId: SF12_DOC_ID },
tests/atarfe-workspace.test.ts:161:      id:           SF12_DOC_ID,
tests/atarfe-workspace.test.ts:331:    const doc = workspace.repository.documents.find(d => d.id === SF12_DOC_ID)
tests/atarfe-workspace.test.ts:422:  it('inventory.hasSF12 = true', () => {
tests/atarfe-workspace.test.ts:423:    expect(inventory.hasSF12).toBe(true)
tests/sf12.test.ts:5:import { parseSF12CSV } from '../src/application/sf12/SF12CSVParser'
tests/sf12.test.ts:6:import { createSF12Study } from '../src/domain/sf12'
tests/sf12.test.ts:7:import { sf12StudyToEvidenceAtoms } from '../src/application/sf12/SF12StudyToEvidenceAtoms'
tests/sf12.test.ts:12:// ── Fixture: parseSF12CSV ────────────────────────────────────────────────────
tests/sf12.test.ts:14:describe('parseSF12CSV — fixture granada (3064 registros)', () => {
tests/sf12.test.ts:15:  const result = parseSF12CSV(FIXTURE_CSV)
tests/sf12.test.ts:63:  const parsed = parseSF12CSV(FIXTURE_CSV)
tests/sf12.test.ts:64:  const study = createSF12Study({
tests/sf12.test.ts:124:    const emptyParsed = parseSF12CSV('')
tests/sf12.test.ts:125:    const emptyStudy = createSF12Study({
tests/sf12.test.ts:135:// ── Casos de borde: parseSF12CSV ─────────────────────────────────────────────
tests/sf12.test.ts:137:describe('parseSF12CSV — casos de borde', () => {
tests/sf12.test.ts:139:    const result = parseSF12CSV('')
tests/sf12.test.ts:147:    const result = parseSF12CSV(csv)
tests/sf12.test.ts:155:    const result = parseSF12CSV(csv)
tests/sf12.test.ts:164:    const result = parseSF12CSV(csv)
tests/sf12.test.ts:174:    const result = parseSF12CSV(csv)

----- Sueno -----
src/App.tsx:30:import { parseSuenoCSV, suenoStudyToEvidenceAtoms } from "./application/sueno";
src/App.tsx:31:import { createSuenoStudy } from "./domain/sueno";
src/App.tsx:169:function isSuenoDocument(document: MunicipalDocument | undefined): boolean {
src/App.tsx:284:  const [isLoadingSueno, setIsLoadingSueno] = useState(false);
src/App.tsx:285:  const [suenoMessage, setSuenoMessage] = useState<string | null>(null);
src/App.tsx:870:  async function handleLoadSuenoCSV(file: File): Promise<void> {
src/App.tsx:871:    setIsLoadingSueno(true);
src/App.tsx:874:      const { aggregates, methodologicalCautions, warnings } = parseSuenoCSV(text);
src/App.tsx:876:      const study = createSuenoStudy({
src/App.tsx:929:      setSuenoMessage(
src/App.tsx:935:      setSuenoMessage("Error al procesar el CSV. Verifica que incluya la columna P33_R.");
src/App.tsx:937:      setIsLoadingSueno(false);
src/App.tsx:1208:    if (isSuenoDocument(deletedDocument)) {
src/App.tsx:1209:      setSuenoMessage(null);
src/App.tsx:1210:      setIsLoadingSueno(false);
src/App.tsx:1230:      const deletesSueno = isSuenoDocument(doc);
src/App.tsx:1268:                deletesSueno &&
src/App.tsx:1297:        suenoStudy: deletesSueno ? undefined : prev.suenoStudy,
src/App.tsx:1337:    setSuenoMessage(null);
src/App.tsx:1338:    setIsLoadingSueno(false);
src/App.tsx:1800:              isLoadingSueno={isLoadingSueno}
src/App.tsx:1802:              onLoadSuenoCSV={handleLoadSuenoCSV}
src/application/municipal-inventory/createMunicipalInventory.ts:13:  hasSueno: boolean;
src/application/municipal-inventory/createMunicipalInventory.ts:41:  const hasSueno       = snapshot.suenoStudy !== undefined;
src/application/municipal-inventory/createMunicipalInventory.ts:76:    hasSueno,
src/application/sueno/index.ts:1:export * from "./SuenoCSVParser";
src/application/sueno/index.ts:2:export * from "./SuenoStudyToEvidenceAtoms";
src/application/sueno/SuenoCSVParser.ts:1:import type { SuenoAggregates } from "../../domain/sueno";
src/application/sueno/SuenoCSVParser.ts:11:const EMPTY_AGGREGATES: SuenoAggregates = {
src/application/sueno/SuenoCSVParser.ts:17:export interface SuenoCSVParseResult {
src/application/sueno/SuenoCSVParser.ts:18:  aggregates: SuenoAggregates;
src/application/sueno/SuenoCSVParser.ts:35:function buildCautions(aggregates: SuenoAggregates): string[] {
src/application/sueno/SuenoCSVParser.ts:80:export function parseSuenoCSV(csvText: string): SuenoCSVParseResult {
src/application/sueno/SuenoCSVParser.ts:125:  const aggregates: SuenoAggregates = {
src/application/sueno/SuenoStudyToEvidenceAtoms.ts:2:import type { SuenoStudy } from "../../domain/sueno";
src/application/sueno/SuenoStudyToEvidenceAtoms.ts:4:export function suenoStudyToEvidenceAtoms(study: SuenoStudy): EvidenceAtom[] {
src/domain/municipality-context/MunicipalityContext.ts:22:import type { SuenoStudy } from "../sueno";
src/domain/municipality-context/MunicipalityContext.ts:42:  suenoStudy?: SuenoStudy;
src/domain/sueno/index.ts:1:export * from "./SuenoAggregates";
src/domain/sueno/index.ts:2:export * from "./SuenoStudy";
src/domain/sueno/SuenoAggregates.ts:1:export interface SuenoAggregates {
src/domain/sueno/SuenoStudy.ts:2:import type { SuenoAggregates } from "./SuenoAggregates";
src/domain/sueno/SuenoStudy.ts:4:export interface SuenoStudy {
src/domain/sueno/SuenoStudy.ts:8:  aggregates: SuenoAggregates;
src/domain/sueno/SuenoStudy.ts:15:export interface CreateSuenoStudyInput {
src/domain/sueno/SuenoStudy.ts:18:  aggregates: SuenoAggregates;
src/domain/sueno/SuenoStudy.ts:23:export function createSuenoStudy(input: CreateSuenoStudyInput): SuenoStudy {
src/domain/workspace/MunicipalityWorkspace.ts:9:import type { SuenoStudy } from "../sueno";
src/domain/workspace/MunicipalityWorkspace.ts:51:  suenoStudy?: SuenoStudy;
src/ui/components/EstudiosComplementariosPanel.tsx:6:import type { SuenoStudy } from "../../domain/sueno";
src/ui/components/EstudiosComplementariosPanel.tsx:13:import { SuenoPanel } from "./SuenoPanel";
src/ui/components/EstudiosComplementariosPanel.tsx:158:  suenoStudy?: SuenoStudy;
src/ui/components/EstudiosComplementariosPanel.tsx:159:  isLoadingSueno?: boolean;
src/ui/components/EstudiosComplementariosPanel.tsx:161:  onLoadSuenoCSV?: (file: File) => void;
src/ui/components/EstudiosComplementariosPanel.tsx:193:  isLoadingSueno,
src/ui/components/EstudiosComplementariosPanel.tsx:195:  onLoadSuenoCSV,
src/ui/components/EstudiosComplementariosPanel.tsx:298:          isLoading={isLoadingSueno}
src/ui/components/EstudiosComplementariosPanel.tsx:302:          onLoadCSV={onLoadSuenoCSV}
src/ui/components/EstudiosComplementariosPanel.tsx:305:          <SuenoPanel suenoStudy={suenoStudy} isLoading={isLoadingSueno} message={suenoMessage} onLoadCSV={onLoadSuenoCSV} />
src/ui/components/index.ts:10:export * from "./SuenoPanel";
src/ui/components/MunicipalInventoryPanel.tsx:91:          present={inventory.hasSueno}
src/ui/components/MunicipalInventoryPanel.tsx:93:            inventory.hasSueno
src/ui/components/SuenoPanel.tsx:1:import type { SuenoStudy } from "../../domain/sueno";
src/ui/components/SuenoPanel.tsx:3:interface SuenoPanelProps {
src/ui/components/SuenoPanel.tsx:4:  suenoStudy?: SuenoStudy;
src/ui/components/SuenoPanel.tsx:13:export function SuenoPanel({
src/ui/components/SuenoPanel.tsx:18:}: SuenoPanelProps) {
docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
docs/contracts/CONTRACT-SCALE-PANELS.md:24:| Sueño EAS | SuenoPanel |
tests/atarfe-complementary-studies.test.ts:11:import { parseSuenoCSV, suenoStudyToEvidenceAtoms } from "../src/application/sueno";
tests/atarfe-complementary-studies.test.ts:17:import { createSuenoStudy } from "../src/domain/sueno";
tests/atarfe-complementary-studies.test.ts:168:const suenoParsed = parseSuenoCSV(fixture("sueno-eas-granada.csv"));
tests/atarfe-complementary-studies.test.ts:169:const suenoStudy = createSuenoStudy({
tests/atarfe-complementary-studies.test.ts:183:    title: "Sueno EAS - sueno-eas-granada.csv",
tests/atarfe-complementary-studies.test.ts:185:    source: { system: "EAS microdatos - Sueno" },
tests/atarfe-complementary-studies.test.ts:265:    expect(inventory.hasSueno).toBe(true);
tests/load-atarfe-complete.mjs:18:  { name: "Sueno EAS", input: "sueno-csv-input", file: "sueno-eas-granada.csv", field: "suenoStudy", tag: "sueno-eas", atoms: 3 },
tests/sueno.test.ts:5:import { parseSuenoCSV } from '../src/application/sueno/SuenoCSVParser'
tests/sueno.test.ts:6:import { createSuenoStudy } from '../src/domain/sueno'
tests/sueno.test.ts:7:import { suenoStudyToEvidenceAtoms } from '../src/application/sueno/SuenoStudyToEvidenceAtoms'
tests/sueno.test.ts:12:// ── Fixture: parseSuenoCSV ───────────────────────────────────────────────────
tests/sueno.test.ts:14:describe('parseSuenoCSV — fixture granada (3064 registros)', () => {
tests/sueno.test.ts:15:  const result = parseSuenoCSV(FIXTURE_CSV)
tests/sueno.test.ts:56:// ── Unidad: parseSuenoCSV — casos de borde ──────────────────────────────────
tests/sueno.test.ts:58:describe('parseSuenoCSV — casos de borde', () => {
tests/sueno.test.ts:60:    const result = parseSuenoCSV('')
tests/sueno.test.ts:67:    const result = parseSuenoCSV('P33_R,P33A\n')
tests/sueno.test.ts:72:    const result = parseSuenoCSV('P33A\n1\n0\n')
tests/sueno.test.ts:79:    const result = parseSuenoCSV(csv)
tests/sueno.test.ts:89:    const result = parseSuenoCSV(csv)
tests/sueno.test.ts:97:    const result = parseSuenoCSV(csv)
tests/sueno.test.ts:105:    const result = parseSuenoCSV(csv)
tests/sueno.test.ts:116:  const parsed = parseSuenoCSV(FIXTURE_CSV)
tests/sueno.test.ts:117:  const study = createSuenoStudy({
tests/sueno.test.ts:176:    const emptyParsed = parseSuenoCSV('')
tests/sueno.test.ts:177:    const emptyStudy = createSuenoStudy({
tests/sueno.test.ts:188:    const smallParsed = parseSuenoCSV(`P33_R,P33A\n${smallCsv}`)
tests/sueno.test.ts:189:    const smallStudy = createSuenoStudy({

----- CAGE -----
src/App.tsx:32:import { parseCAGECSV, cageStudyToEvidenceAtoms } from "./application/cage";
src/App.tsx:33:import { createCAGEStudy } from "./domain/cage";
src/App.tsx:146:const CAGE_DOCUMENT_TAG = "cage-eas";
src/App.tsx:173:function isCAGEDocument(document: MunicipalDocument | undefined): boolean {
src/App.tsx:174:  return hasDocumentTag(document, CAGE_DOCUMENT_TAG);
src/App.tsx:286:  const [isLoadingCAGE, setIsLoadingCAGE] = useState(false);
src/App.tsx:941:  async function handleLoadCAGECSV(file: File): Promise<void> {
src/App.tsx:942:    setIsLoadingCAGE(true);
src/App.tsx:945:      const { aggregates, methodologicalCautions, warnings } = parseCAGECSV(text);
src/App.tsx:947:      const study = createCAGEStudy({
src/App.tsx:962:          CAGE_DOCUMENT_TAG
src/App.tsx:967:          title: `CAGE-EAS - ${file.name}`,
src/App.tsx:969:            system: "EAS microdatos — Consumo de alcohol (CAGE_R / CAGE)",
src/App.tsx:973:          tags: ["complementary-study", CAGE_DOCUMENT_TAG, "eas"],
src/App.tsx:982:                atom.tags.includes(CAGE_DOCUMENT_TAG)
src/App.tsx:1001:        aggregates.nValidCAGER > 0
src/App.tsx:1002:          ? `CAGE-EAS cargado: ${aggregates.nValidCAGER} registros CAGE_R válidos de ${aggregates.n}. Riesgo de alcoholismo: ${aggregates.pctRisk.toFixed(1)} % (n=${aggregates.nRisk}). ${cageAtoms.length} evidencias incorporadas.${warn}`
src/App.tsx:1003:          : `CSV CAGE-EAS procesado sin registros CAGE_R válidos.${warn}`
src/App.tsx:1006:      setCageMessage("Error al procesar el CSV. Verifica que incluya la columna CAGE_R.");
src/App.tsx:1008:      setIsLoadingCAGE(false);
src/App.tsx:1212:    if (isCAGEDocument(deletedDocument)) {
src/App.tsx:1214:      setIsLoadingCAGE(false);
src/App.tsx:1231:      const deletesCAGE = isCAGEDocument(doc);
src/App.tsx:1275:                deletesCAGE &&
src/App.tsx:1277:                atom.tags.includes(CAGE_DOCUMENT_TAG)
src/App.tsx:1298:        cageStudy: deletesCAGE ? undefined : prev.cageStudy,
src/App.tsx:1340:    setIsLoadingCAGE(false);
src/App.tsx:1804:              isLoadingCAGE={isLoadingCAGE}
src/App.tsx:1806:              onLoadCAGECSV={handleLoadCAGECSV}
src/application/cage/CAGECSVParser.ts:1:import type { CAGEAggregates } from "../../domain/cage";
src/application/cage/CAGECSVParser.ts:5:// COMPÁS NG los consume directamente — no recalcula el CAGE desde ítems individuales.
src/application/cage/CAGECSVParser.ts:6:// CAGE_R es el indicador de riesgo binario (0=No / 1=Sí).
src/application/cage/CAGECSVParser.ts:7:// CAGE clasifica el nivel de consumo en cuatro categorías ordinales (1–4).
src/application/cage/CAGECSVParser.ts:9:const CAGE_R_FIELD = "CAGE_R";
src/application/cage/CAGECSVParser.ts:10:const CAGE_FIELD = "CAGE";
src/application/cage/CAGECSVParser.ts:15:const EMPTY_AGGREGATES: CAGEAggregates = {
src/application/cage/CAGECSVParser.ts:17:  nValidCAGER: 0, missingCAGER: 0, nRisk: 0, pctRisk: 0,
src/application/cage/CAGECSVParser.ts:18:  nValidCAGE: 0, nCAGE1: 0, nCAGE2: 0, nCAGE3: 0, nCAGE4: 0,
src/application/cage/CAGECSVParser.ts:21:export interface CAGECSVParseResult {
src/application/cage/CAGECSVParser.ts:22:  aggregates: CAGEAggregates;
src/application/cage/CAGECSVParser.ts:49:function buildCautions(aggregates: CAGEAggregates): string[] {
src/application/cage/CAGECSVParser.ts:51:    "CAGE_R y CAGE son campos derivados oficiales de la Encuesta Andaluza de Salud (EAS). " +
src/application/cage/CAGECSVParser.ts:52:      "COMPÁS NG los consume directamente sin recalcular el CAGE desde ítems individuales.",
src/application/cage/CAGECSVParser.ts:53:    "El missing en CAGE_R (~18 % en la EAS Granada) es estructural: corresponde a personas abstemias " +
src/application/cage/CAGECSVParser.ts:63:      `CSV vacío o sin registros de datos. Verifica que incluya la columna ${CAGE_R_FIELD}.`,
src/application/cage/CAGECSVParser.ts:68:  if (aggregates.nValidCAGER === 0) {
src/application/cage/CAGECSVParser.ts:70:      `CSV sin registros válidos en ${CAGE_R_FIELD}. Verifica que la columna contenga valores 0 o 1.`
src/application/cage/CAGECSVParser.ts:72:  } else if (aggregates.nValidCAGER < 30) {
src/application/cage/CAGECSVParser.ts:73:    cautions.push(`Muestra pequeña (${aggregates.nValidCAGER} registros CAGE_R válidos). Interpretar con precaución.`);
src/application/cage/CAGECSVParser.ts:76:  if (aggregates.nValidCAGER > 0 && aggregates.nRisk < 10) {
src/application/cage/CAGECSVParser.ts:78:      `Prevalencia de riesgo muy baja (n=${aggregates.nRisk} personas con CAGE_R=1). ` +
src/application/cage/CAGECSVParser.ts:86:export function parseCAGECSV(csvText: string): CAGECSVParseResult {
src/application/cage/CAGECSVParser.ts:98:  const cageRIdx = header.indexOf(CAGE_R_FIELD);
src/application/cage/CAGECSVParser.ts:99:  const cageIdx  = header.indexOf(CAGE_FIELD);
src/application/cage/CAGECSVParser.ts:105:      `Columnas "${CAGE_R_FIELD}" y "${CAGE_FIELD}" no encontradas. El CSV no contiene datos CAGE-EAS procesables.`
src/application/cage/CAGECSVParser.ts:109:  if (cageRIdx === -1) warnings.push(`Columna "${CAGE_R_FIELD}" no encontrada.`);
src/application/cage/CAGECSVParser.ts:110:  if (cageIdx === -1)  warnings.push(`Columna "${CAGE_FIELD}" no encontrada.`);
src/application/cage/CAGECSVParser.ts:113:  let nValidCAGER = 0, nRisk = 0;
src/application/cage/CAGECSVParser.ts:114:  let nValidCAGE = 0, nCAGE1 = 0, nCAGE2 = 0, nCAGE3 = 0, nCAGE4 = 0;
src/application/cage/CAGECSVParser.ts:122:      if (v !== null) { nValidCAGER++; if (v === 1) nRisk++; }
src/application/cage/CAGECSVParser.ts:128:        nValidCAGE++;
src/application/cage/CAGECSVParser.ts:129:        if (v === 1) nCAGE1++;
src/application/cage/CAGECSVParser.ts:130:        else if (v === 2) nCAGE2++;
src/application/cage/CAGECSVParser.ts:131:        else if (v === 3) nCAGE3++;
src/application/cage/CAGECSVParser.ts:132:        else if (v === 4) nCAGE4++;
src/application/cage/CAGECSVParser.ts:137:  const aggregates: CAGEAggregates = {
src/application/cage/CAGECSVParser.ts:139:    nValidCAGER, missingCAGER: n - nValidCAGER,
src/application/cage/CAGECSVParser.ts:140:    nRisk, pctRisk: pct(nRisk, nValidCAGER),
src/application/cage/CAGECSVParser.ts:141:    nValidCAGE, nCAGE1, nCAGE2, nCAGE3, nCAGE4,
src/application/cage/CAGEStudyToEvidenceAtoms.ts:2:import type { CAGEStudy } from "../../domain/cage";
src/application/cage/CAGEStudyToEvidenceAtoms.ts:4:export function cageStudyToEvidenceAtoms(study: CAGEStudy): EvidenceAtom[] {
src/application/cage/CAGEStudyToEvidenceAtoms.ts:5:  if (study.aggregates.nValidCAGER === 0) return [];
src/application/cage/CAGEStudyToEvidenceAtoms.ts:8:  const confidence = aggregates.nValidCAGER >= 30 ? "medium" : "low";
src/application/cage/CAGEStudyToEvidenceAtoms.ts:14:    title: "CAGE-EAS - Riesgo de alcoholismo (CAGE_R)",
src/application/cage/CAGEStudyToEvidenceAtoms.ts:16:      `${aggregates.pctRisk.toFixed(1)} % de la muestra con CAGE_R presenta riesgo de alcoholismo ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:18:      `n con riesgo: ${aggregates.nRisk} de ${aggregates.nValidCAGER} válidos. ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:19:      `Missing / no procede (abstinentes): ${aggregates.missingCAGER} de ${aggregates.n}. ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:30:        "CAGE_R es un campo derivado pre-calculado por la EAS que clasifica el riesgo de alcoholismo. " +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:40:  if (aggregates.nValidCAGE >= 30) {
src/application/cage/CAGEStudyToEvidenceAtoms.ts:41:    const nRiesgoOPerjudicial = aggregates.nCAGE2 + aggregates.nCAGE3 + aggregates.nCAGE4;
src/application/cage/CAGEStudyToEvidenceAtoms.ts:46:      title: "CAGE-EAS - Clasificación ordinal de consumo (CAGE)",
src/application/cage/CAGEStudyToEvidenceAtoms.ts:48:        `Entre los ${aggregates.nValidCAGE} registros con CAGE válido: ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:49:        `${aggregates.nCAGE1} bebedores sociales (${((aggregates.nCAGE1 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:50:        `${aggregates.nCAGE2} consumo de riesgo (${((aggregates.nCAGE2 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:51:        `${aggregates.nCAGE3} consumo perjudicial (${((aggregates.nCAGE3 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:52:        `${aggregates.nCAGE4} dependencia alcohólica (${((aggregates.nCAGE4 / aggregates.nValidCAGE) * 100).toFixed(1)} %). ` +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:63:          "CAGE es el campo ordinal pre-calculado por la EAS que clasifica el nivel de consumo en 4 categorías. " +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:77:    title: "CAGE-EAS - Cautela metodológica",
src/application/cage/CAGEStudyToEvidenceAtoms.ts:79:      "CAGE_R y CAGE son indicadores propios de la EAS para monitorización del consumo de alcohol en la población andaluza. " +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:80:      "COMPÁS NG los consume directamente sin recalcular el CAGE desde ítems individuales. " +
src/application/cage/CAGEStudyToEvidenceAtoms.ts:92:      description: "Cautela metodológica asociada al procesamiento de CAGE-EAS como estudio complementario.",
src/application/cage/index.ts:1:export * from "./CAGECSVParser";
src/application/cage/index.ts:2:export * from "./CAGEStudyToEvidenceAtoms";
src/application/municipal-inventory/createMunicipalInventory.ts:14:  hasCAGE: boolean;
src/application/municipal-inventory/createMunicipalInventory.ts:42:  const hasCAGE        = snapshot.cageStudy !== undefined;
src/application/municipal-inventory/createMunicipalInventory.ts:54:  const cageRecordCount         = snapshot.cageStudy?.aggregates.nValidCAGER ?? 0;
src/application/municipal-inventory/createMunicipalInventory.ts:77:    hasCAGE,
src/domain/cage/CAGEAggregates.ts:1:export interface CAGEAggregates {
src/domain/cage/CAGEAggregates.ts:3:  // CAGE_R — riesgo de alcoholismo (campo canónico primario, ~82 % cobertura en EAS)
src/domain/cage/CAGEAggregates.ts:4:  nValidCAGER: number;
src/domain/cage/CAGEAggregates.ts:5:  missingCAGER: number;
src/domain/cage/CAGEAggregates.ts:8:  // CAGE — clasificación ordinal de nivel de consumo (1–4, mismo n que CAGE_R)
src/domain/cage/CAGEAggregates.ts:9:  nValidCAGE: number;
src/domain/cage/CAGEAggregates.ts:10:  nCAGE1: number; // Bebedor social
src/domain/cage/CAGEAggregates.ts:11:  nCAGE2: number; // Consumo de riesgo
src/domain/cage/CAGEAggregates.ts:12:  nCAGE3: number; // Consumo perjudicial
src/domain/cage/CAGEAggregates.ts:13:  nCAGE4: number; // Dependencia alcohólica
src/domain/cage/CAGEStudy.ts:2:import type { CAGEAggregates } from "./CAGEAggregates";
src/domain/cage/CAGEStudy.ts:4:export interface CAGEStudy {
src/domain/cage/CAGEStudy.ts:8:  aggregates: CAGEAggregates;
src/domain/cage/CAGEStudy.ts:15:export interface CreateCAGEStudyInput {
src/domain/cage/CAGEStudy.ts:18:  aggregates: CAGEAggregates;
src/domain/cage/CAGEStudy.ts:23:export function createCAGEStudy(input: CreateCAGEStudyInput): CAGEStudy {
src/domain/cage/index.ts:1:export * from "./CAGEAggregates";
src/domain/cage/index.ts:2:export * from "./CAGEStudy";
src/domain/municipality-context/MunicipalityContext.ts:23:import type { CAGEStudy } from "../cage";
src/domain/municipality-context/MunicipalityContext.ts:44:  cageStudy?: CAGEStudy;
src/domain/questionnaire/QuestionnaireDefinition.ts:21:  // Módulos metodológicos seleccionados (IBSE, DUKE, CAGE, ...)
src/domain/workspace/MunicipalityWorkspace.ts:10:import type { CAGEStudy } from "../cage";
src/domain/workspace/MunicipalityWorkspace.ts:52:  cageStudy?: CAGEStudy;
src/ui/components/CAGEPanel.tsx:1:import type { CAGEStudy } from "../../domain/cage";
src/ui/components/CAGEPanel.tsx:3:interface CAGEPanelProps {
src/ui/components/CAGEPanel.tsx:4:  cageStudy?: CAGEStudy;
src/ui/components/CAGEPanel.tsx:10:// CAGE-EAS: cribado de riesgo de alcoholismo (variable dicotómica CAGE_R).
src/ui/components/CAGEPanel.tsx:11:// CAGE ordinal 1–4: 1 = bebedor social, 2 = consumo de riesgo, 3 = perjudicial, 4 = dependencia.
src/ui/components/CAGEPanel.tsx:12:// Cautela: el CAGE es un cribado, no un diagnóstico clínico.
src/ui/components/CAGEPanel.tsx:14:export function CAGEPanel({
src/ui/components/CAGEPanel.tsx:19:}: CAGEPanelProps) {
src/ui/components/CAGEPanel.tsx:25:            Cargar CSV CAGE-EAS (.csv)
src/ui/components/CAGEPanel.tsx:41:          <p className="study-hint">Procesando CSV CAGE-EAS…</p>
src/ui/components/CAGEPanel.tsx:56:            n válido CAGE_R = {cageStudy.aggregates.nValidCAGER}
src/ui/components/CAGEPanel.tsx:57:            {cageStudy.aggregates.missingCAGER > 0 && (
src/ui/components/CAGEPanel.tsx:58:              <> · Abstinentes / no administrado: {cageStudy.aggregates.missingCAGER}</>
src/ui/components/CAGEPanel.tsx:66:                  <td className="study-bar-row__label">Riesgo de alcoholismo (CAGE_R)</td>
src/ui/components/CAGEPanel.tsx:80:                    n={cageStudy.aggregates.nRisk} de {cageStudy.aggregates.nValidCAGER}
src/ui/components/CAGEPanel.tsx:84:                {/* Distribución ordinal CAGE si disponible */}
src/ui/components/CAGEPanel.tsx:85:                {cageStudy.aggregates.nValidCAGE > 0 && (
src/ui/components/CAGEPanel.tsx:94:                              width: `${(cageStudy.aggregates.nCAGE1 / cageStudy.aggregates.nValidCAGE) * 100}%`
src/ui/components/CAGEPanel.tsx:100:                        {((cageStudy.aggregates.nCAGE1 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
src/ui/components/CAGEPanel.tsx:102:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE1}</td>
src/ui/components/CAGEPanel.tsx:111:                              width: `${(cageStudy.aggregates.nCAGE2 / cageStudy.aggregates.nValidCAGE) * 100}%`
src/ui/components/CAGEPanel.tsx:117:                        {((cageStudy.aggregates.nCAGE2 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
src/ui/components/CAGEPanel.tsx:119:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE2}</td>
src/ui/components/CAGEPanel.tsx:128:                              width: `${(cageStudy.aggregates.nCAGE3 / cageStudy.aggregates.nValidCAGE) * 100}%`
src/ui/components/CAGEPanel.tsx:134:                        {((cageStudy.aggregates.nCAGE3 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
src/ui/components/CAGEPanel.tsx:136:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE3}</td>
src/ui/components/CAGEPanel.tsx:145:                              width: `${(cageStudy.aggregates.nCAGE4 / cageStudy.aggregates.nValidCAGE) * 100}%`
src/ui/components/CAGEPanel.tsx:151:                        {((cageStudy.aggregates.nCAGE4 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
src/ui/components/CAGEPanel.tsx:153:                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE4}</td>
src/ui/components/CAGEPanel.tsx:184:          Ningún estudio CAGE-EAS cargado para este municipio. Importa un CSV con
src/ui/components/CAGEPanel.tsx:185:          la columna <code>CAGE_R</code> y opcionalmente <code>CAGE</code>.
src/ui/components/DocumentRepositoryPanel.tsx:34:  "cage-eas": "CAGE-EAS",
src/ui/components/EstudiosComplementariosPanel.tsx:7:import type { CAGEStudy } from "../../domain/cage";
src/ui/components/EstudiosComplementariosPanel.tsx:14:import { CAGEPanel } from "./CAGEPanel";
src/ui/components/EstudiosComplementariosPanel.tsx:163:  cageStudy?: CAGEStudy;
src/ui/components/EstudiosComplementariosPanel.tsx:164:  isLoadingCAGE?: boolean;
src/ui/components/EstudiosComplementariosPanel.tsx:166:  onLoadCAGECSV?: (file: File) => void;
src/ui/components/EstudiosComplementariosPanel.tsx:197:  isLoadingCAGE,
src/ui/components/EstudiosComplementariosPanel.tsx:199:  onLoadCAGECSV,
src/ui/components/EstudiosComplementariosPanel.tsx:309:          name="CAGE-EAS"
src/ui/components/EstudiosComplementariosPanel.tsx:313:          isLoading={isLoadingCAGE}
src/ui/components/EstudiosComplementariosPanel.tsx:314:          recordSummary={cageStudy ? `${cageStudy.aggregates.nValidCAGER} válidos CAGE_R · riesgo ${cageStudy.aggregates.pctRisk.toFixed(1)} %` : undefined}
src/ui/components/EstudiosComplementariosPanel.tsx:317:          onLoadCSV={onLoadCAGECSV}
src/ui/components/EstudiosComplementariosPanel.tsx:320:          <CAGEPanel cageStudy={cageStudy} isLoading={isLoadingCAGE} message={cageMessage} onLoadCSV={onLoadCAGECSV} />
src/ui/components/index.ts:11:export * from "./CAGEPanel";
src/ui/components/MunicipalInventoryPanel.tsx:99:          label="Consumo de alcohol — riesgo (CAGE-EAS)"
src/ui/components/MunicipalInventoryPanel.tsx:100:          present={inventory.hasCAGE}
src/ui/components/MunicipalInventoryPanel.tsx:102:            inventory.hasCAGE
src/ui/components/MunicipalInventoryPanel.tsx:103:              ? `${inventory.cageRecordCount} registros válidos CAGE_R`
docs/architecture/OPERATING-CONSTITUTION.md:84:| Estudios EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `complementary-study` + tag propio | Acumulable por tag |
docs/architecture/OPERATING-CONSTITUTION.md:155:- Los seis estudios (IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS)
docs/architecture/OPERATING-CONSTITUTION.md:197:   IBSE, DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS tienen el mismo
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:41:IBSE, SF-12, DUKE, PREDIMED, CAGE, ESCA y cualquier otro instrumento que se
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:55:| **CAGE-EAS** — Riesgo de alcoholismo (CAGE_R / CAGE sobre EAS) | `eas-official-block` | Implementado (sin `MethodologicalModule` en Biblioteca; ver §9a) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:98:| Instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) | `"complementary-study"` | Tag propio del instrumento | Por tag (uno por municipio) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:112:por el equipo. Los instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE) son
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:130:| CAGE-EAS | `complementary-study` | `"cage-eas"` |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:450:SF-12, DUKE, PREDIMED, CAGE y otros instrumentos reconocidos en DOMAIN-MODEL.md
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:489:| **CAGE-EAS** | **Implementado** — dominio, parser, EvidenceAtoms, panel, workspace, inventario. Sin `MethodologicalModule` en Biblioteca (véase nota §9a). |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:492:### Nota §9a — Deuda técnica: DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS y CAGE-EAS sin MethodologicalModule
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:497:- Sus parsers **hardcodean los nombres de columna** (p. ej. `P5701`–`P5711` en DUKE; `Predimed` con fallback a ítems en PREDIMED; `PCS12_SP`/`MCS12_SP` en SF-12; `P33_R`/`P33A` en Sueño; `CAGE_R`/`CAGE` en CAGE), en lugar de derivarlos de un módulo metodológico como hace el parser de IBSE.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:502:Adicionalmente, DUKE-EAS tiene un `MethodologicalModule` parcial en `domain/methodology/definitions/duke-eas.ts` que **sí está registrado** en el registry y del que el parser DUKE deriva su configuración de columnas. El resto de instrumentos EAS (PREDIMED, SF-12, Sueño, CAGE) no tienen módulo registrado.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:568:| 2026-06-27 | Sprint 0: SF-12 EAS, Sueño EAS y CAGE-EAS pasan de «Conceptual» a «Implementado» (implementados en commits `7f47034`, `20080cd` y `9c73fa0` respectivamente). §3.1 y §3.2 actualizados para reflejar la distinción real entre `kind: "redcap-export"` (IBSE) y `kind: "complementary-study"` (instrumentos EAS). Nota §9a ampliada para incluir los cinco instrumentos EAS sin `MethodologicalModule`. |
docs/contracts/CONTRACT-DYNAMIC-TRIPYRAMID.md:89:- CAGE-EAS: n válido CAGE_R = 2.513
docs/contracts/CONTRACT-INDEX.md:64:**Productores:** Parsers CSV (IBSE, DUKE, PREDIMED, SF-12, Sueño, CAGE).
docs/contracts/CONTRACT-INDEX.md:75:**Productores:** Paneles React (IBSEPanel, DUKEPanel, PREDIMEDPanel, SF12Panel, SuenoPanel, CAGEPanel).
docs/contracts/CONTRACT-PERSISTENCE.md:43:| `cageStudy` | Estudio CAGE-EAS procesado, si existe |
docs/contracts/CONTRACT-SCALE-PANELS.md:25:| CAGE-EAS | CAGEPanel |
docs/contracts/CONTRACT-SCALE-PANELS.md:88:**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).
docs/contracts/CONTRACT-SCALE-PANELS.md:213:### CAGE-EAS
docs/contracts/CONTRACT-SCALE-PANELS.md:215:- **Variable:** CAGE_R (riesgo alcoholismo, proporción positiva) y CAGE ordinal (1–4).
docs/contracts/CONTRACT-SCALE-PANELS.md:218:- **Cautela:** el CAGE es un cribado, no un diagnóstico. Resultados requieren confirmación clínica.
tests/atarfe-complementary-studies.test.ts:12:import { parseCAGECSV, cageStudyToEvidenceAtoms } from "../src/application/cage";
tests/atarfe-complementary-studies.test.ts:18:import { createCAGEStudy } from "../src/domain/cage";
tests/atarfe-complementary-studies.test.ts:191:const cageParsed = parseCAGECSV(fixture("cage-eas-granada.csv"));
tests/atarfe-complementary-studies.test.ts:192:const cageStudy = createCAGEStudy({
tests/atarfe-complementary-studies.test.ts:206:    title: "CAGE-EAS - cage-eas-granada.csv",
tests/atarfe-complementary-studies.test.ts:233:    expect(workspace.cageStudy?.aggregates.nValidCAGER).toBe(2513);
tests/atarfe-complementary-studies.test.ts:266:    expect(inventory.hasCAGE).toBe(true);
tests/cage.test.ts:5:import { parseCAGECSV } from '../src/application/cage/CAGECSVParser'
tests/cage.test.ts:6:import { createCAGEStudy } from '../src/domain/cage'
tests/cage.test.ts:7:import { cageStudyToEvidenceAtoms } from '../src/application/cage/CAGEStudyToEvidenceAtoms'
tests/cage.test.ts:12:// ── Fixture: parseCAGECSV ────────────────────────────────────────────────────
tests/cage.test.ts:14:describe('parseCAGECSV — fixture granada (3064 registros)', () => {
tests/cage.test.ts:15:  const result = parseCAGECSV(FIXTURE_CSV)
tests/cage.test.ts:21:  it('CAGE_R — 2513 válidos, 551 missing estructural (~18 %)', () => {
tests/cage.test.ts:22:    expect(result.aggregates.nValidCAGER).toBe(2513)
tests/cage.test.ts:23:    expect(result.aggregates.missingCAGER).toBe(551)
tests/cage.test.ts:26:  it('CAGE_R — 14 con riesgo (0.6 % sobre válidos)', () => {
tests/cage.test.ts:31:  it('CAGE ordinal — 2513 válidos, concordantes con CAGE_R', () => {
tests/cage.test.ts:32:    expect(result.aggregates.nValidCAGE).toBe(2513)
tests/cage.test.ts:35:  it('CAGE ordinal — distribución coherente: nCAGE1 = nNoRisk', () => {
tests/cage.test.ts:36:    expect(result.aggregates.nCAGE1).toBe(2499)
tests/cage.test.ts:37:    expect(result.aggregates.nCAGE2).toBe(7)
tests/cage.test.ts:38:    expect(result.aggregates.nCAGE3).toBe(3)
tests/cage.test.ts:39:    expect(result.aggregates.nCAGE4).toBe(4)
tests/cage.test.ts:42:  it('suma CAGE ordinal 2-4 coincide con nRisk', () => {
tests/cage.test.ts:43:    const { nCAGE2, nCAGE3, nCAGE4, nRisk } = result.aggregates
tests/cage.test.ts:44:    expect(nCAGE2 + nCAGE3 + nCAGE4).toBe(nRisk)
tests/cage.test.ts:71:    // AUDIT-C es un instrumento diferente; no debe aparecer como parte del análisis CAGE
tests/cage.test.ts:72:    const hasAuditCAsCAGE = result.methodologicalCautions.some(c =>
tests/cage.test.ts:73:      c.toUpperCase().includes('AUDIT-C') && c.toUpperCase().includes('CAGE')
tests/cage.test.ts:75:    expect(hasAuditCAsCAGE).toBe(false)
tests/cage.test.ts:79:// ── Unidad: parseCAGECSV — casos de borde ───────────────────────────────────
tests/cage.test.ts:81:describe('parseCAGECSV — casos de borde', () => {
tests/cage.test.ts:83:    const result = parseCAGECSV('')
tests/cage.test.ts:85:    expect(result.aggregates.nValidCAGER).toBe(0)
tests/cage.test.ts:90:    const result = parseCAGECSV('CAGE_R,CAGE\n')
tests/cage.test.ts:94:  it('sin columna CAGE_R genera warning', () => {
tests/cage.test.ts:95:    const result = parseCAGECSV('CAGE\n1\n2\n')
tests/cage.test.ts:97:    expect(result.aggregates.nValidCAGER).toBe(0)
tests/cage.test.ts:101:    const csv = 'CAGE_R,CAGE\n1.0,2.0\n0.0,1.0\n'
tests/cage.test.ts:102:    const result = parseCAGECSV(csv)
tests/cage.test.ts:104:    expect(result.aggregates.nValidCAGER).toBe(2)
tests/cage.test.ts:106:    expect(result.aggregates.nCAGE2).toBe(1)
tests/cage.test.ts:107:    expect(result.aggregates.nCAGE1).toBe(1)
tests/cage.test.ts:111:    const csv = 'CAGE_R,CAGE\n994.0,994.0\n0,1\n'
tests/cage.test.ts:112:    const result = parseCAGECSV(csv)
tests/cage.test.ts:114:    expect(result.aggregates.nValidCAGER).toBe(1)
tests/cage.test.ts:115:    expect(result.aggregates.missingCAGER).toBe(1)
tests/cage.test.ts:120:    const csv = `CAGE_R,CAGE\n${rows}\n`
tests/cage.test.ts:121:    const result = parseCAGECSV(csv)
tests/cage.test.ts:133:    const csv = `CAGE_R,CAGE\n${rows}\n`
tests/cage.test.ts:134:    const result = parseCAGECSV(csv)
tests/cage.test.ts:146:  const parsed = parseCAGECSV(FIXTURE_CSV)
tests/cage.test.ts:147:  const study = createCAGEStudy({
tests/cage.test.ts:156:  it('genera exactamente 3 átomos (CAGE_R + ordinal + cautela)', () => {
tests/cage.test.ts:192:  it('confidence es "medium" (nValidCAGER >= 30)', () => {
tests/cage.test.ts:205:  it('ningún átomo presenta AUDIT-C como sinónimo de CAGE', () => {
tests/cage.test.ts:207:      expect(atom.content.toUpperCase()).not.toMatch(/AUDIT-C.*CAGE|CAGE.*=.*AUDIT/i)
tests/cage.test.ts:211:  it('devuelve array vacío cuando nValidCAGER=0', () => {
tests/cage.test.ts:212:    const emptyParsed = parseCAGECSV('')
tests/cage.test.ts:213:    const emptyStudy = createCAGEStudy({
tests/cage.test.ts:222:  it('omite átomo ordinal cuando nValidCAGE < 30', () => {
tests/cage.test.ts:224:    const smallParsed = parseCAGECSV(`CAGE_R,CAGE\n${smallCsv}`)
tests/cage.test.ts:225:    const smallStudy = createCAGEStudy({
tests/home-complementary-studies.smoke.mjs:115:  for (const label of ["IBSE", "DUKE-EAS", "PREDIMED-EAS", "SF-12 EAS", "Sueño EAS", "CAGE-EAS"]) {
tests/home-complementary-studies.smoke.mjs:124:  await checkStudyRow(page, "CAGE-EAS", "#cage-csv-input");
tests/load-atarfe-complete.mjs:19:  { name: "CAGE-EAS", input: "cage-csv-input", file: "cage-eas-granada.csv", field: "cageStudy", tag: "cage-eas", atoms: 3 },
tests/load-atarfe-complete.mjs:183:  if (cage)  console.log(`  CAGE-EAS       n=${cage.aggregates.nValidCAGER} válidos CAGE_R · riesgo=${cage.aggregates.pctRisk}% (n=${cage.aggregates.nRisk}) · abstinentes=${cage.aggregates.missingCAGER}`);

==============================
COMPONENTES NO IMPORTADOS
==============================
src/domain/methodology/adapters/EASHouseholdDomainModel.ts
src/domain/methodology/adapters/EASSavAdapter.ts
src/types/mammoth.d.ts

==============================
TODOS LOS TODO/FIXME
==============================
src/App.tsx:1859:            {/* Participación ciudadana — proceso independiente de selección temática */}
src/application/health-profile/buildLocalHealthProfile.ts:13: *  - Los capítulos V y VI son scaffold marcados como "authored" pendiente.
src/application/ibse/IBSEStudyToEvidenceAtoms.ts:147:      "Se recomienda revisar cada factor de forma independiente."
src/application/runtime/MunicipalityRuntime.ts:277:        : "Sin evidencia real. Sugerencia EPVSA pendiente de revisión por ausencia de base documental.",
src/application/runtime/MunicipalityRuntime.ts:300:        ? `${stages.monitoring.trackedItems.length} actuación(es) en seguimiento inicial. Estado: pendiente de validación.`
src/application/sueno/SuenoCSVParser.ts:7:// Son dimensiones independientes: se espera ~29 % de discordancia entre ambas.
src/application/sueno/SuenoCSVParser.ts:40:      "Son dimensiones independientes: no deben sumarse ni compararse directamente.",
src/application/sueno/SuenoStudyToEvidenceAtoms.ts:61:          "Mide percepción de descanso, complementaria e independiente de P33_R (duración).",
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:17: * No son etapas de pipeline independientes ni sistemas computacionales separados.
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:29:// no un módulo independiente con pipeline propio.
src/application/territorial-interpretation/TerritorialInterpretationEngine.ts:86:  // Sub-rutinas internas (no son etapas de pipeline independientes)
src/domain/methodology/definitions/duke-eas.ts:10:// - Bibliografía: referencias identificadas; contraste completo con texto original pendiente.
src/domain/methodology/definitions/duke-eas.ts:282:    "con el instrumento original (Broadhead, 1988) está pendiente.",
src/domain/methodology/definitions/ibse.ts:322:      notes: "Referencia bibliográfica completa pendiente de contraste con la fuente primaria.",
src/domain/methodology/definitions/ibse.ts:363:    // sav: pendiente de contraste con EAS_dif_Adultos.sav
src/domain/methodology/definitions/predimed-eas.ts:12://   primaria pendiente de verificación.
src/domain/methodology/definitions/predimed-eas.ts:14://   original pendiente.
src/domain/methodology/definitions/predimed-eas.ts:50:      "instrumento PREDIMED-14 y sus umbrales está pendiente de contraste. " +
src/domain/methodology/definitions/predimed-eas.ts:353:    "el contraste con la publicación primaria de referencia está pendiente.",
src/domain/methodology/definitions/predimed-eas.ts:366:        "La publicación específica está pendiente de identificación exacta.",
src/domain/thematic-prioritisation/ThematicPrioritisationStudy.ts:2:// Es independiente de ThematicPrioritisation (la decisión técnica).
src/ui/components/IBSEPanel.tsx:164:                  Se recomienda revisar cada factor de forma independiente.
src/ui/components/LocalHealthPlanningCycle.tsx:72:  // Mientras el PSL no está validado, la priorización formal permanece pendiente,
src/ui/components/LocalHealthProfileView.tsx:233:            <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
src/ui/components/LocalHealthProfileView.tsx:890:            <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
src/ui/components/LT1Panel.tsx:164:          Cada sección colapsa/expande de forma independiente.
src/ui/components/MonitoringPanel.tsx:72:                <span className="status-pill">pendiente</span>
src/ui/components/PipelineTracePanel.tsx:36:  pending:   "pendiente",
src/ui/components/ReconciliacionPanel.tsx:172:          pendientes y qué conflictos entre fuentes no han podido resolverse.
src/ui/components/ReconciliacionPanel.tsx:185:            {tensionesNoEscaladas.length} pendiente{tensionesNoEscaladas.length !== 1 ? "s" : ""}
src/ui/components/ReconciliacionPanel.tsx:239:          pendientes de seguimiento técnico.
src/ui/components/ThematicPrioritisationModal.tsx:236:                  Top 5 aplicado. No hay cambios pendientes que guardar.
src/ui/components/ThematicPrioritisationPanel.tsx:22:          independiente del análisis automático de evidencia.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:262:| `draft` | Definición en construcción o pendiente de contraste con fuente primaria |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:295:El adaptador SAV está pendiente de contraste con el fichero de referencia.
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:409:ausencia del Informe de Salud independientemente de cuántos estudios
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:453:implementación está pendiente. El contrato de la categoría se aplica a todos
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:459:pendiente de contraste completo con la fuente primaria. El parser puede
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:484:| **IBSE** | **Implementado** (módulo en `draft`; pendiente de `validated`) |
docs/contracts/CONTRACT-COMPLEMENTARY-STUDIES.md:500:Esta situación es conocida y aceptada en la implementación actual. No bloquea el uso en producción. La formalización de los módulos en la Biblioteca queda como tarea pendiente explícita antes de que los instrumentos puedan transitar al estado `Validado`.
docs/contracts/CONTRACT-EVIDENCE-QUALITY.md:34:La calidad de la evidencia se articula en cuatro dimensiones independientes.
docs/contracts/CONTRACT-INDEX.md:167:Define el Motor de Traducción Estratégica (MTE): flujo PSL validado → Priorizaciones → Repositorio Estratégico → Borrador Plan de Acción. Establece 6 restricciones explícitas de no-sustitución y el invariante de trazabilidad completa. `StrategicDerivationTrace` pendiente de especificación en el sprint de implementación.
docs/contracts/CONTRACT-INDEX.md:180:**Productores futuros:** Investigación metodológica pendiente.
docs/contracts/CONTRACT-INTERPRETATION.md:400:de output, independientemente de la cantidad de evidencia disponible.
docs/contracts/CONTRACT-INTERPRETATION.md:432:El documento fuente permanece íntegro e independiente de cualquier lectura
docs/contracts/CONTRACT-MIT-PSL.md:91:| EAS | `eas` | Origen reconocido; parser pendiente |
docs/contracts/CONTRACT-MIT-PSL.md:92:| CMI | `cmi` | Origen reconocido; parser pendiente |
docs/contracts/CONTRACT-MIT-PSL.md:96:El MIT no distingue entre fuentes implementadas y pendientes: procesa los
docs/contracts/CONTRACT-MIT-PSL.md:97:átomos que encuentre en el store, independientemente de su procedencia. La
docs/contracts/CONTRACT-MIT-PSL.md:128:LT1 es una sub-rutina interna del MIT, no una etapa de pipeline independiente.
docs/contracts/CONTRACT-MIT-PSL.md:181:proceso (concepto del dominio pendiente de implementar).
docs/contracts/CONTRACT-MIT-PSL.md:586:  del proceso finalizado; pendiente de diseño e implementación.
docs/contracts/CONTRACT-PERSISTENCE.md:85:   (formularios, mensajes de carga, selecciones pendientes).
docs/contracts/CONTRACT-REPOSITORY.md:121:de cada uno es independiente y opera sobre su tag, no sobre el `kind`.
docs/contracts/CONTRACT-REPOSITORY.md:287:   así como los mensajes de interfaz pendientes relacionados con ese documento.
docs/contracts/CONTRACT-REPOSITORY.md:332:**I-R6 — IBSE y Priorización Temática son independientes**
docs/contracts/CONTRACT-SCALE-PANELS.md:88:**Aplica a:** IBSE (4 factores comparables). No aplica a SF-12 (2 componentes independientes), Sueño (2 variables independientes), CAGE (distribución ordinal), ni DUKE (3 dimensiones superpuestas).
docs/contracts/CONTRACT-SCALE-PANELS.md:189:- **Interpretación asistida (B.1):** no aplica (dimensiones superpuestas, no independientes).
docs/contracts/CONTRACT-SCALE-PANELS.md:203:- **Interpretación asistida (B.1):** no aplica (los componentes son independientes y no comparables entre sí).
docs/contracts/CONTRACT-STRATEGIC-REPOSITORY.md:26:Los siguientes acrónimos tienen un único significado válido dentro de COMPÁS NG, independientemente de cualquier uso externo al proyecto. El contrato fija estas denominaciones.
docs/visual/references/reconecta-reference.css:74: * Aplicada a TODO el body mediante regla !important en encuesta.
docs/visual/references/reconecta-reference.css:402:   7. NOTA METODOLÓGICA (campo "ficha_metodologica")
docs/visual/references/VISUAL-REFERENCE-REDCAP-RECONecta.md:16:Extraídos de los estilos inline del campo descriptivo `presentacion`. Son los únicos colores definidos por el diseñador del proyecto, independientemente de la plataforma REDCap.
