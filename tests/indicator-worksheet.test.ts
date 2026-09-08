import { describe, expect, it } from "vitest";
import { Packer } from "docx";
import mammoth from "mammoth";
import { createIndicatorWorksheet, worksheetContextChanged, worksheetKey } from "../src/domain/action-plan-catalog/IndicatorWorksheet";
import { buildIndicatorWorksheetDocument } from "../src/application/action-plan/exportIndicatorWorksheet";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";
import { parseWorkspaceJSON } from "../src/infrastructure/persistence/local-storage";
import { isEmptyWorkspaceForPersistenceGuard } from "../src/application/workspace/isEmptyWorkspaceForPersistenceGuard";

const context = { municipalityId: "worksheet-test", moduleId: "env-2027-2030", moduleVersion: "3.1", line: "Envejecimiento saludable", generalObjective: "ENV-OG1", objective: "ENV-OE1.1", indicatorCode: "ENV-I1.1", indicator: "Autonomía funcional", unit: "%", source: "Propuesta documental" };

describe("Fichas cumplimentables — integridad y entrega", () => {
  it("no crea observaciones, actuaciones ni responsables y conserva la referencia original", () => {
    const sheet = createIndicatorWorksheet(context);
    expect(sheet.values).toEqual({});
    expect(sheet.actions).toEqual([]);
    expect(sheet.consolidations).toEqual([]);
    expect(worksheetContextChanged(sheet, { ...context, indicator: "Redacción adaptada" })).toBe(true);
    expect(sheet.context.indicator).toBe("Autonomía funcional");
    expect(worksheetKey({ ...context, municipalityId: "other" })).not.toBe(worksheetKey(context));
  });

  it("persiste fichas, actuaciones y varios periodos sin poblar diagnóstico ni decisiones", () => {
    const workspace = createCompleteMunicipalityWorkspace({ id: context.municipalityId, name: "Prueba de persistencia" });
    const sheet = createIndicatorWorksheet(context);
    sheet.values.owner = "Responsable de prueba";
    sheet.actions.push({ id: "action-test", values: { name: "Actuación de prueba" }, returns: [
      { id: "r1", values: { period: "periodo uno", numerator: "0", denominator: "10" } },
      { id: "r2", values: { period: "periodo dos", limitations: "Sin datos" } },
    ] });
    workspace.indicatorWorksheets = [sheet];
    const restored = parseWorkspaceJSON(JSON.stringify(workspace))!;
    expect(restored.indicatorWorksheets).toEqual([sheet]);
    expect(isEmptyWorkspaceForPersistenceGuard(restored)).toBe(false);
    expect(restored.evidenceStore.atoms).toEqual([]);
    expect(restored.actionPlanModuleReviews).toBeUndefined();
    expect(restored.validatedPSL).toBeUndefined();
    expect(parseWorkspaceJSON(JSON.stringify({ ...workspace, indicatorWorksheets: undefined }))?.indicatorWorksheets).toBeUndefined();
  });

  it("Word conserva texto, cero observado y ausencia de datos; la ficha individual excluye otras actuaciones", async () => {
    const sheet = createIndicatorWorksheet(context);
    sheet.values.owner = "Responsable de prueba & equipo";
    sheet.actions = [
      { id: "a1", values: { name: "Primera actuación" }, returns: [{ id: "r1", values: { numerator: "0" } }] },
      { id: "a2", values: { name: "Segunda actuación" }, returns: [] },
    ];
    const buffer = await Packer.toBuffer(buildIndicatorWorksheetDocument(sheet, "Pendiente del Grupo Motor", true, "a1"));
    const { value } = await mammoth.extractRawText({ buffer });
    expect(value).toContain("Responsable de prueba & equipo");
    expect(value).toContain("Primera actuación");
    expect(value).not.toContain("Segunda actuación");
    expect(value).toContain("\n0\n");
    expect(value).toContain("[Pendiente de cumplimentar]");
    expect(value).toContain("la referencia actual ha cambiado");
    expect(value).toContain("Pendiente del Grupo Motor");
  });
});
