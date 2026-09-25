import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HEALTHY_AGING_MODULE } from "../src/domain/action-plan-catalog/ActionPlanCatalog";
import { ZAIDIN_AGING_PROPOSAL, excludedByAncestor, type PlanPreparationDraft } from "../src/domain/action-plan-catalog/PlanPreparationDraft";
import { PlanPreparationPanel } from "../src/ui/components/PlanPreparationPanel";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";
import { parseWorkspaceJSON } from "../src/infrastructure/persistence/local-storage";
import { isEmptyWorkspaceForPersistenceGuard } from "../src/application/workspace/isEmptyWorkspaceForPersistenceGuard";
import { createIndicatorWorksheet, worksheetContextChanged, worksheetKey } from "../src/domain/action-plan-catalog/IndicatorWorksheet";
const draft: PlanPreparationDraft = { municipalityId: "granada-zaidin", moduleId: ZAIDIN_AGING_PROPOSAL.id, version: ZAIDIN_AGING_PROPOSAL.version, updatedAt: "2026-09-09", decisions: {
 "ENV-OE5.1": {status: "excluded", sourceText: "anterior"}, "ENV-I5.1": {status: "modified", text: "Indicador adaptado", sourceText: "original"}
}};

function findElement(node: ReactNode, predicate: (element: ReactElement<Record<string, unknown>>) => boolean): ReactElement<Record<string, unknown>> | undefined {
 if (Array.isArray(node)) {
  for (const child of node) {
   const found = findElement(child, predicate);
   if (found) return found;
  }
  return undefined;
 }
 if (!isValidElement(node)) return undefined;
 const element = node as ReactElement<Record<string, unknown> & {children?: ReactNode}>;
 if (predicate(element)) return element;
 return findElement(element.props.children, predicate);
}

describe("Preparación independiente del Plan", () => {
 it("muestra una caja editable con propuesta para cada objetivo general", () => {
 const panel = PlanPreparationPanel({module: ZAIDIN_AGING_PROPOSAL, municipalityId: draft.municipalityId, onChange: () => {}, renderWorksheet: () => null});
 for (const general of ZAIDIN_AGING_PROPOSAL.generalObjectives) {
  const label = `Redacción del objetivo general · ${general.code}`;
  const textarea = findElement(panel, element => element.type === "textarea" && element.props["aria-label"] === label);
  expect(textarea).toBeDefined();
  expect(textarea!.props.value).toBe(general.title);
 }
 const html = renderToStaticMarkup(panel);
 expect(html.match(/Propuesta inicial de objetivo general:/g)).toHaveLength(4);
 expect(html.match(/Propuesta inicial del objetivo general/g)).toHaveLength(4);
 expect(html).not.toContain("Guardado en el expediente local");
 const changes: PlanPreparationDraft[] = [];
 const emptyAgeism = {...draft, decisions:{[ZAIDIN_AGING_PROPOSAL.generalObjectives[0].code]:{status:"modified" as const,sourceText:ZAIDIN_AGING_PROPOSAL.generalObjectives[0].title,text:""}}};
 const restored = PlanPreparationPanel({module:ZAIDIN_AGING_PROPOSAL,municipalityId:draft.municipalityId,draft:emptyAgeism,onChange:next=>changes.push(next),renderWorksheet:()=>null});
 const recover = findElement(restored, element=>element.type==="button"&&element.props["aria-label"]==="Usar propuesta inicial · ENV-B-edadismo");
 expect(recover).toBeDefined();
 (recover!.props.onClick as () => void)();
 expect(changes[0].decisions["ENV-B-edadismo"].text).toBe(ZAIDIN_AGING_PROPOSAL.generalObjectives[0].title);
 });
 it("reagrupa los 18 objetivos sin cambiar indicadores ni catálogo original", () => {
 const original = HEALTHY_AGING_MODULE.generalObjectives.flatMap(g => g.specificObjectives);
 const next = ZAIDIN_AGING_PROPOSAL.generalObjectives.flatMap(g => g.specificObjectives);
 expect(ZAIDIN_AGING_PROPOSAL.generalObjectives.map(g => g.specificObjectives.length)).toEqual([2,7,2,7]);
 expect(next.map(o => o.code).sort()).toEqual(original.map(o => o.code).sort());
 for (const o of next) expect(o.indicator).toEqual(original.find(x => x.code === o.code)!.indicator);
 expect(HEALTHY_AGING_MODULE.generalObjectives).toHaveLength(9);
 expect(ZAIDIN_AGING_PROPOSAL.generalObjectives[3].specificObjectives.map(o => o.code)).toContain("ENV-OE9.1");
 });
 it("conserva el borrador anterior y avisa de la revisión editorial", () => {
 const previous = {...draft, version: "zaidin-4-bloques-2026-09-09", decisions: {"ENV-OE1.1": {status: "modified" as const, sourceText: "Autonomía funcional anterior", text: "Redacción propia que debe conservarse"}}};
 const before = JSON.stringify(previous);
 const html = renderToStaticMarkup(<PlanPreparationPanel module={ZAIDIN_AGING_PROPOSAL} municipalityId={draft.municipalityId} draft={previous} onChange={() => {}} renderWorksheet={() => null}/>);
 expect(html).toContain("Redacción propia que debe conservarse");
 expect(html).toContain("La referencia de partida ha cambiado");
 expect(JSON.stringify(previous)).toBe(before);
 const participation = ZAIDIN_AGING_PROPOSAL.generalObjectives.find(g => g.code === "ENV-B-participacion")!;
 expect(participation.specificObjectives.map(o => o.code)).toEqual(expect.arrayContaining(["ENV-OE8.1", "ENV-OE8.2", "ENV-OE9.1", "ENV-OE9.2"]));
 expect(html).toContain("Objetivo estratégico vigente");
 expect(html).toContain("<strong>envejecimiento saludable</strong>");
 });
 it("persiste decisiones sin crear evidencia ni revisiones formales", () => {
 const workspace = createCompleteMunicipalityWorkspace({id: draft.municipalityId, name: "Prueba"});
 workspace.planPreparationDrafts = [draft];
 const restored = parseWorkspaceJSON(JSON.stringify(workspace))!;
 expect(restored.planPreparationDrafts).toEqual([draft]);
 expect(isEmptyWorkspaceForPersistenceGuard(restored)).toBe(false);
 expect(restored.evidenceStore.atoms).toEqual([]);
 expect(restored.actionPlanModuleReviews ?? []).toEqual([]);
 });
 it("excluir el padre no borra decisiones del indicador y permite recuperarlas", () => {
 expect(excludedByAncestor(draft, ["ENV-OE5.1"])).toBe(true);
 const restored = {...draft, decisions: {...draft.decisions, "ENV-OE5.1": {...draft.decisions["ENV-OE5.1"], status: "included" as const}}};
 expect(excludedByAncestor(restored, ["ENV-OE5.1"])).toBe(false);
 expect(restored.decisions["ENV-I5.1"].text).toBe("Indicador adaptado");
 });
 it("permite elegir en borrador sin perfil, muestra negritas y avisa cambios previos", () => {
 const html = renderToStaticMarkup(<PlanPreparationPanel module={ZAIDIN_AGING_PROPOSAL} municipalityId={draft.municipalityId} draft={draft} onChange={() => {}} renderWorksheet={() => null}/>);
 expect((html.match(/<select /g) ?? []).length).toBe(41);
 expect(html).toContain("La referencia de partida ha cambiado");
 expect(html).toContain("Fuera del Plan");
 expect(html).toContain("<strong>soledad percibida</strong>");
 expect(html).toContain("Indicador adaptado");
 });
 it("guarda inmediatamente la redacción modificada sin crear revisión administrativa", () => {
 const changes: PlanPreparationDraft[] = [];
 const source = ZAIDIN_AGING_PROPOSAL.generalObjectives[0].specificObjectives[1].title;
 const first = PlanPreparationPanel({module: ZAIDIN_AGING_PROPOSAL, municipalityId: draft.municipalityId, onChange: next => changes.push(next), renderWorksheet: () => null});
 const select = findElement(first, element => element.type === "select" && element.props["aria-label"] === "Estado del Plan ENV-OE5.2");
 expect(select).toBeDefined();
 (select!.props.onChange as (event: {target: {value: string}}) => void)({target: {value: "modified"}});
 expect(changes).toHaveLength(1);
 expect(changes[0].decisions["ENV-OE5.2"]).toMatchObject({status: "modified", sourceText: source, text: source});
 expect(changes[0].decisions[ZAIDIN_AGING_PROPOSAL.id]).toMatchObject({status: "included"});
 expect(changes[0].decisions[ZAIDIN_AGING_PROPOSAL.generalObjectives[0].code]).toMatchObject({status: "included"});
 const second = PlanPreparationPanel({module: ZAIDIN_AGING_PROPOSAL, municipalityId: draft.municipalityId, draft: changes[0], onChange: next => changes.push(next), renderWorksheet: () => null});
 const textarea = findElement(second, element => element.type === "textarea" && element.props["aria-label"] === "Redacción vigente · ENV-OE5.2");
 expect(textarea).toBeDefined();
 const saveButton = findElement(second, element => element.type === "button" && element.props["aria-label"] === "Guardar redacción vigente · ENV-OE5.2");
 expect(saveButton).toBeDefined();
 (textarea!.props.onChange as (event: {target: {value: string}}) => void)({target: {value: "Texto definitivo de prueba"}});
 expect(changes).toHaveLength(2);
 expect(changes[1].decisions["ENV-OE5.2"]).toMatchObject({status: "modified", sourceText: source, text: "Texto definitivo de prueba"});
 });
 it("guarda necesidades no priorizadas y marco de evaluación para el futuro PLS", () => {
 const changes: PlanPreparationDraft[] = [];
 const first = PlanPreparationPanel({module: ZAIDIN_AGING_PROPOSAL, municipalityId: draft.municipalityId, draft, onChange: next => changes.push(next), renderWorksheet: () => null});
 const needs = findElement(first, element => element.type === "textarea" && element.props["aria-label"] === "Necesidades diagnosticadas no priorizadas");
 expect(needs).toBeDefined();
 (needs!.props.onChange as (event: {target: {value: string}}) => void)({target: {value: "Movilidad segura — Queda fuera por falta de recursos este ciclo"}});
 expect(changes[0].unaddressedNeeds?.[0]).toMatchObject({
  title: "Movilidad segura",
  justification: "Queda fuera por falta de recursos este ciclo",
 });
 expect(changes[0].decisions).toEqual(draft.decisions);

 const second = PlanPreparationPanel({module: ZAIDIN_AGING_PROPOSAL, municipalityId: draft.municipalityId, draft: changes[0], onChange: next => changes.push(next), renderWorksheet: () => null});
 const questions = findElement(second, element => element.type === "textarea" && element.props["aria-label"] === "Preguntas de evaluación");
 expect(questions).toBeDefined();
 (questions!.props.onChange as (event: {target: {value: string}}) => void)({target: {value: "¿Se reduce la soledad?\n¿Mejora la participación?"}});
 expect(changes[1].unaddressedNeeds).toEqual(changes[0].unaddressedNeeds);
 expect(changes[1].evaluationFramework?.evaluationQuestions).toEqual(["¿Se reduce la soledad?","¿Mejora la participación?"]);
 });
 it("sanea propuestas antiguas guardadas con campañas entre paréntesis", () => {
 const campaign = ["CAMPAÑA", "FESTIVAL"].join("/");
 const fest = ["ZAIDÍN", "SENIOR", "FEST"].join(" ");
 const oldText = `Incrementar la visibilidad de las personas mayores (${campaign} ${fest}).`;
 const previous: PlanPreparationDraft = {
  ...draft,
  decisions: {
   "ENV-OE5.2": {
    status: "modified",
    sourceText: oldText,
    text: oldText,
   },
  },
 };
 const html = renderToStaticMarkup(<PlanPreparationPanel module={ZAIDIN_AGING_PROPOSAL} municipalityId={draft.municipalityId} draft={previous} onChange={() => {}} renderWorksheet={() => null}/>);
 expect(html).toContain("Incrementar la visibilidad de las personas mayores.");
 expect(html).not.toContain(fest);
 expect(html).not.toContain(campaign);
 });
 it("conserva identidad de fichas al cambiar versión y objetivo general", () => {
 const context = {municipalityId:draft.municipalityId,moduleId:draft.moduleId,indicatorCode:"ENV-I5.1"};
 const oldContext = {...context, moduleVersion: "3.1", generalObjective: "ENV-OG5", objective: "Redacción anterior", line: "Envejecimiento saludable", indicator: "Indicador", unit: "%", source: "Original"};
 const sheet = createIndicatorWorksheet(oldContext);
 sheet.values.owner = "Responsable de prueba";
 const newContext = {...oldContext, moduleVersion: ZAIDIN_AGING_PROPOSAL.version, generalObjective: "ENV-B-edadismo", objective: "Redacción revisada"};
 expect(worksheetKey(sheet.context)).toBe(worksheetKey(newContext));
 expect(worksheetContextChanged(sheet, newContext)).toBe(true);
 expect(sheet.context).toEqual(oldContext);
 expect(sheet.values.owner).toBe("Responsable de prueba");
 expect(worksheetKey({...context,municipalityId:"atarfe"})).not.toBe(worksheetKey(context));
 });
});
