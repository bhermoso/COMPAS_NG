import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ActionPlanCatalogPanel } from "../src/ui/components/ActionPlanCatalogPanel";
import { getEligibleActionPlanModules } from "../src/domain/action-plan-catalog";
import type { DeliberativePrioritySelection } from "../src/domain/deliberative-prioritisation";
import type { LecturaEstrategicaLocal } from "../src/domain/strategic-scenario";
import { LECTURA_COMPLEJA } from "./strategic-scenario-fixtures";

const scenario = { ...LECTURA_COMPLEJA.escenarios[0], id: "aging", tema: "Envejecimiento saludable" };
const lectura: LecturaEstrategicaLocal = { ...LECTURA_COMPLEJA, id: "lectura-ui", escenarios: [scenario] };
const selection: DeliberativePrioritySelection = {
  id: "selection-ui",
  municipalityId: lectura.municipalityId,
  sourceLecturaId: lectura.id,
  sourcePSLId: lectura.sourcePSLId,
  sourcePSLVersion: lectura.sourcePSLVersion,
  candidateScenarioIds: [scenario.id],
  selectedScenarioIds: [scenario.id],
  catalogModuleLinks: [{ scenarioId: scenario.id, moduleId: "env-2027-2030" }],
  citizenTopicIds: [],
  deliberationRationale: "Acuerdo de prueba",
  citizenInfluenceStatement: "Constancia de prueba",
  decidedBy: "Grupo Motor",
  decidedByRole: "group-motor",
  decidedAt: "2026-09-04T08:00:00.000Z",
  requiresHumanValidation: true,
};

describe("PA-RELAS-02 — representación editorial", () => {
  it("muestra las dos líneas para consulta aunque aún no exista selección", () => {
    const html = renderToStaticMarkup(createElement(ActionPlanCatalogPanel, {
      municipalityId: lectura.municipalityId,
      lectura,
      eligibleModules: [],
      reviews: [],
      onSave: () => [],
    }));
    expect(html).toContain("Líneas estratégicas disponibles");
    expect(html).toContain("Envejecimiento saludable");
    expect(html).toContain("Prevención y abordaje de las adicciones");
    expect(html).toContain("Puedes examinar su arquitectura");
    expect(html).not.toContain("Aceptar todo");
  });

  it("identifica propuesta, procedencia, decisiones humanas y ficha técnica", () => {
    const html = renderToStaticMarkup(createElement(ActionPlanCatalogPanel, {
      municipalityId: lectura.municipalityId,
      lectura,
      selection,
      eligibleModules: getEligibleActionPlanModules(lectura, selection),
      reviews: [],
      onSave: () => [],
    }));

    expect(html).toContain("Módulo propuesto");
    expect(html).toContain("Grupo Motor seleccionó la prioridad");
    expect(html).toContain("Aceptar todo");
    expect(html).toContain("Adaptar");
    expect(html).toContain("Ver ficha técnica propuesta");
    expect(html).toContain("Pendiente de asignación formal");
    expect(html).toContain("no genera actuaciones");
  });
});
