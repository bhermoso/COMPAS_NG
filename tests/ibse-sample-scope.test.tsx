/**
 * IBSE — discriminador de muestra (sampleScope) en dominio y en la interfaz.
 *
 * Verifica que la descripción del universo etario se deriva del discriminador y
 * que la interfaz de Atarfe declara MUESTRA MIXTA (no exclusivamente escolar), con
 * SAM por estrato "no evaluable" y átomos sobre "muestra participante".
 */

import { describe, it, expect, beforeAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { IBSEPanel } from "../src/ui/components/IBSEPanel";
import { createIBSEStudy } from "../src/domain/ibse";
import {
  describeIBSESampleScope,
  IBSE_MIXED_SAMPLE_SENTENCE,
} from "../src/domain/ibse";
import type { IBSEStudy, IBSESampleScope, IBSEStrataCounts } from "../src/domain/ibse";
import { buildAtarfeWorkspace } from "../scripts/demo/buildAtarfeWorkspace";

const AGG = {
  n: 909,
  nValid: 811,
  meanTotal: 63.2,
  meanFactorVinculo: 68.5,
  meanFactorSituacion: 60.1,
  meanFactorControl: 55.8,
  meanFactorPersona: 72.3,
};

function makeStudy(scope: IBSESampleScope): IBSEStudy {
  return createIBSEStudy({
    municipalityId: "atarfe",
    sourceFileName: "ibse-atarfe.csv",
    aggregates: AGG,
    sampleScope: scope,
    methodologicalCautions: [],
  });
}

// Estudio real de Atarfe (municipalityId "atarfe", como en el expediente) con
// desglose válido. El registry debe resolver "atarfe" → INE 18022 vía alias.
function makeStudyWithStrata(strataCounts: IBSEStrataCounts): IBSEStudy {
  return createIBSEStudy({
    municipalityId: "atarfe",
    sourceFileName: "ibse-atarfe.csv",
    aggregates: AGG,
    sampleScope: "mixed",
    strataCounts,
    methodologicalCautions: [],
  });
}

function render(study: IBSEStudy): string {
  return renderToStaticMarkup(
    createElement(IBSEPanel, { ibseStudy: study, municipalityName: "Atarfe" })
  );
}

describe("describeIBSESampleScope — derivado del discriminador", () => {
  it("mixed sin desglose → frase prudente contractual ('no permite desglosar')", () => {
    expect(describeIBSESampleScope("mixed").sampleSentence).toBe(IBSE_MIXED_SAMPLE_SENTENCE);
    expect(describeIBSESampleScope("mixed", { hasValidBreakdown: false }).sampleSentence).toBe(
      IBSE_MIXED_SAMPLE_SENTENCE
    );
  });
  it("mixed CON desglose válido → frase distinta (desglose etario validado)", () => {
    const s = describeIBSESampleScope("mixed", { hasValidBreakdown: true }).sampleSentence;
    expect(s).toContain("desglose etario validado");
    expect(s).not.toContain("no permite desglosar");
  });
  it("16-plus → declara 16 o más y universo EAS (no 'mismos datos')", () => {
    const d = describeIBSESampleScope("16-plus");
    expect(d.shortLabel).toMatch(/16/);
    expect(d.sampleSentence).toMatch(/universo poblacional de referencia con la EAS/i);
    expect(d.sampleSentence).not.toMatch(/mismos datos|misma muestra/i);
  });
  it("under-16 → declara menores y referencia de menores", () => {
    const d = describeIBSESampleScope("under-16");
    expect(d.shortLabel).toMatch(/menores/i);
  });
  it("unknown → no atribuye a ningún grupo poblacional concreto", () => {
    expect(describeIBSESampleScope("unknown").sampleSentence).toMatch(/no determinado/i);
  });
});

describe("IBSEPanel — la interfaz deriva del discriminador", () => {
  it("Atarfe (mixed): la interfaz dice muestra mixta, no exclusivamente escolar", () => {
    const html = render(makeStudy("mixed"));
    expect(html).toContain("Muestra municipal mixta");
    expect(html).toContain("menores de 16 y personas de 16 o más");
    // Las frases COMPUESTAS por el panel (síntesis, párrafo PSL) no atribuyen la
    // muestra a "población escolar": describen la muestra participante.
    expect(html).not.toContain("La población escolar de Atarfe");
    expect(html).toContain("La muestra municipal participante de Atarfe");
    expect(html).toContain("de la muestra municipal participante");
  });

  it("Atarfe (mixed): SAM por estrato se muestra como NO evaluable con este export", () => {
    const html = render(makeStudy("mixed"));
    expect(html).toMatch(/no evaluable por estrato/i);
  });

  it("la etiqueta de cabecera cambia con el discriminador (mixed ≠ 16-plus ≠ under-16)", () => {
    expect(render(makeStudy("mixed"))).toContain("Muestra municipal mixta");
    expect(render(makeStudy("16-plus"))).toContain("Muestra de 16 años o más");
    expect(render(makeStudy("under-16"))).toContain("Muestra de menores de 16");
  });

  it("mixed CON desglose válido (municipio 'atarfe' vía alias): AMBOS dictámenes y desglose validado", () => {
    const html = render(
      makeStudyWithStrata({ under16: { n: 520, nValid: 470 }, plus16: { n: 389, nValid: 341 } })
    );
    // El alias "atarfe" → 18022 resuelve las referencias: ambos estratos con su dictamen.
    expect(html).toContain("SAM — Menores de 16");
    expect(html).toContain("SAM — 16 años o más");
    // Cada uno con su N observado propio (nunca el total 811 en ambos).
    expect(html).toContain("N observado: 470");
    expect(html).toContain("N observado: 341");
    // Referencia de menores 6–15 (no 6–17).
    expect(html).toContain("6 a 15 años (menores de 16)");
    // La descripción NO contradice: con desglose válido no dice "no permite desglosar"…
    expect(html).not.toContain("no permite desglosar los resultados por edad");
    // …y sí indica que existe desglose etario validado.
    expect(html).toContain("desglose etario validado");
    // No presenta "no evaluable" cuando el desglose es válido y hay referencias.
    expect(html).not.toMatch(/no evaluable por estrato/i);
  });

  it("mixed SIN desglose (municipio 'atarfe' con referencias): sigue siendo NO evaluable y prudente", () => {
    // Estudio real de Atarfe mixed sin strataCounts → refs existen (alias) pero falta desglose.
    const study = createIBSEStudy({
      municipalityId: "atarfe",
      sourceFileName: "ibse-atarfe.csv",
      aggregates: AGG,
      sampleScope: "mixed",
      methodologicalCautions: [],
    });
    const html = render(study);
    expect(html).toMatch(/no evaluable por estrato/i);
    expect(html).not.toContain("SAM — Menores de 16");
    // Sin desglose, la declaración prudente se conserva.
    expect(html).toContain("no permite desglosar los resultados por edad");
    expect(html).not.toContain("desglose etario validado");
  });
});

describe("IBSEPanel — expediente real de Atarfe", () => {
  let atarfeStudy: IBSEStudy;
  beforeAll(async () => {
    const { workspace } = await buildAtarfeWorkspace();
    atarfeStudy = workspace.ibseStudy!;
  });

  it("el estudio real de Atarfe es 'mixed' y la interfaz lo refleja", () => {
    expect(atarfeStudy.sampleScope).toBe("mixed");
    const html = render(atarfeStudy);
    expect(html).toContain("Muestra municipal mixta");
    expect(html).not.toMatch(/población escolar de Atarfe/i);
  });
});
