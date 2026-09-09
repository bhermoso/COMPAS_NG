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
describe("Preparación independiente del Plan", () => {
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
 expect(html).toContain("La propuesta cambió");
 expect(JSON.stringify(previous)).toBe(before);
 const participation = ZAIDIN_AGING_PROPOSAL.generalObjectives.find(g => g.code === "ENV-B-participacion")!;
 expect(participation.specificObjectives.map(o => o.code)).toEqual(expect.arrayContaining(["ENV-OE8.1", "ENV-OE8.2", "ENV-OE9.1", "ENV-OE9.2"]));
 expect(html).toContain("Objetivo estratégico propuesto");
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
 expect(html).toContain("La propuesta cambió");
 expect(html).toContain("Fuera del borrador");
 expect(html).toContain("<strong>soledad percibida</strong>");
 expect(html).toContain("Indicador adaptado");
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
