/**
 * Lote D — gramática territorial de la lectura del Perfil (ATARFE-ÁMBITO).
 *
 * Defecto: varias expresiones GENERADAS de la lectura (señales integradas,
 * interpretación, vista editorial, referencias de indicadores) codificaban
 * vocabulario inframunicipal —«distrito», «distrital», «barrio(s)», «Unidad
 * Asistencial»— y un fallback «contexto provincial» independiente de que una
 * fuente real acreditara origen provincial. Atarfe es un MUNICIPIO (código INE
 * 18022, sin territorialType): su lectura no puede leerse como la de un distrito.
 *
 * Corrección: una fuente única (`territorialGrammar`) resuelve la escala y deriva
 * un léxico componible. Municipio nunca cae al vocabulario inframunicipal; el
 * caso canónico Granada-Zaidín (distrito) reproduce su redacción salvo las tres
 * correcciones doctrinales autorizadas (fallback «contexto provincial» neutro y
 * etiqueta «muestra local del ámbito» para muestras locales reales).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseWorkspaceJSON } from "../src/infrastructure/persistence/local-storage";
import { buildDiagnosticAnswers } from "../src/application/health-profile/diagnosticAnswers";
import { buildIntegratedInterpretation } from "../src/application/health-profile/integratedInterpretation";
import { buildIntegratedProfileSignals } from "../src/application/health-profile/integratedProfileSignals";
import { buildProfileIntegratedEditorialView } from "../src/application/health-profile/profileIntegratedEditorialView";
import { buildIndicatorComparisonReferences } from "../src/application/health-profile/complementaryIndicatorReferences";
import {
  resolveTerritorialScope,
  territorialScopeNoun,
  territorialLexicon,
} from "../src/application/health-profile/territorialGrammar";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

const _dir = dirname(fileURLToPath(import.meta.url));
function seed(id: string): MunicipalityWorkspace {
  return parseWorkspaceJSON(
    readFileSync(resolve(_dir, `../public/seeds/compas-ng-workspace-${id}.json`), "utf8")
  )!;
}
function answersOf(ws: MunicipalityWorkspace) {
  const atoms = ws.evidenceStore.atoms;
  return buildDiagnosticAnswers({
    workspace: ws,
    determinantTitles: atoms.filter((a) => a.kind === "determinant").map((a) => a.title),
    assets: atoms.filter((a) => a.kind === "asset").map((a) => ({ title: a.title, content: a.content })),
    indicatorTitles: atoms.filter((a) => a.kind === "indicator").map((a) => a.title),
  });
}
/** Serializa TODA la lectura generada de un municipio (texto observable). */
function generatedText(ws: MunicipalityWorkspace): string {
  const ans = answersOf(ws);
  return JSON.stringify({
    interp: buildIntegratedInterpretation(ans),
    signals: buildIntegratedProfileSignals(ans),
    view: buildProfileIntegratedEditorialView(ans, {
      territory: ws.municipality.identity.id,
      status: "Borrador",
      informeTitulo: `Informe ${ws.municipality.identity.id}`,
      generatedDate: "x",
    }),
    refs: buildIndicatorComparisonReferences({ workspace: ws }),
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. Fuente única: resolución de escala y léxico
// ══════════════════════════════════════════════════════════════════════════════

describe("Lote D · gramática territorial (fuente única)", () => {
  it("D1.1 territorialType explícito manda: «distrito» → distrito, «municipio» → municipio", () => {
    expect(resolveTerritorialScope({ territorialType: "distrito" })).toBe("distrito");
    expect(resolveTerritorialScope({ territorialType: "municipio" })).toBe("municipio");
    expect(territorialScopeNoun({ territorialType: "distrito" })).toBe("distrito");
  });

  it("D1.2 sin territorialType pero con código INE municipal → municipio (caso Atarfe)", () => {
    expect(resolveTerritorialScope({ ineCode: "18022" })).toBe("municipio");
    expect(territorialScopeNoun({ ineCode: "18022" })).toBe("municipio");
  });

  it("D1.3 sin nada que lo resuelva → ámbito territorial (fallback neutro)", () => {
    expect(resolveTerritorialScope({})).toBe("ambito");
    expect(resolveTerritorialScope(undefined)).toBe("ambito");
    expect(territorialScopeNoun({})).toBe("ámbito territorial");
  });

  it("D1.4 el léxico de distrito reproduce el vocabulario inframunicipal canónico", () => {
    const lex = territorialLexicon({ territorialType: "distrito" });
    expect(lex.scope).toBe("distrito");
    expect(lex.dentroDelAmbito).toBe("dentro del distrito");
    expect(lex.vidaCotidianaLocus).toBe("del barrio");
    expect(lex.sinDesagregacionInterna).toBe("sin desagregación distrital");
    expect(lex.escalaFinaAdj).toBe("distrital");
    expect(lex.delScope).toBe("del distrito");
    expect(lex.usaUnidadAsistencial).toBe(true);
  });

  it("D1.5 el léxico de municipio evita todo vocabulario inframunicipal", () => {
    const lex = territorialLexicon({ ineCode: "18022" });
    expect(lex.scope).toBe("municipio");
    expect(lex.dentroDelAmbito).toBe("dentro del municipio");
    expect(lex.vidaCotidianaLocus).toBe("del municipio");
    expect(lex.sinDesagregacionInterna).toBe("sin desagregación interna");
    expect(lex.escalaFinaAdj).toBe("interna");
    expect(lex.delScope).toBe("del municipio");
    expect(lex.usaUnidadAsistencial).toBe(false);
    // Ni «distrito», ni «barrio», ni «distrital» en ningún primitivo.
    const flat = JSON.stringify(lex);
    expect(flat).not.toMatch(/distrit|barrio/);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. Atarfe (municipio): la lectura generada no adopta vocabulario de distrito
// ══════════════════════════════════════════════════════════════════════════════

describe("Lote D · Atarfe (municipio por INE) — ausencia en el texto generado", () => {
  const atarfe = seed("atarfe");
  const text = generatedText(atarfe);

  it("D2.1 la identidad resuelve como municipio por su código INE, sin modificar el seed", () => {
    expect(atarfe.municipality.identity.territorialType).toBeUndefined();
    expect(atarfe.municipality.identity.ineCode).toBe("18022");
    expect(territorialScopeNoun(atarfe.municipality.identity)).toBe("municipio");
  });

  it("D2.2 el texto generado NO contiene «distrito» ni «distrital»", () => {
    expect(text).not.toMatch(/distrito/);
    expect(text).not.toMatch(/distrital/);
  });

  it("D2.3 el texto generado NO contiene «barrio(s)» ni «Unidad Asistencial»", () => {
    expect(text).not.toMatch(/barrio/);
    expect(text).not.toContain("Unidad Asistencial");
  });

  it("D2.4 el fallback NO afirma «contexto provincial» ni etiqueta «territorial/demo»", () => {
    expect(text).not.toContain("contexto provincial");
    expect(text).not.toContain("territorial/demo");
  });

  it("D2.5 en su lugar aparece el léxico municipal (municipio, desagregación interna)", () => {
    expect(text).toContain("municipio");
    expect(text).toContain("sin desagregación interna");
    // La incertidumbre central usa ejes genéricos, no «por barrios».
    expect(text).toContain("por sexo, edad, renta o zona");
  });

  it("D2.6 muestra local del IBSE real: etiqueta «muestra local del ámbito, no representativa»", () => {
    const refs = buildIndicatorComparisonReferences({ workspace: atarfe }).references;
    expect(refs.length).toBeGreaterThan(0);
    // Todas las referencias de Atarfe son locales (IBSE municipal): etiqueta local.
    expect(refs.every((r) => r.esLocal)).toBe(true);
    for (const r of refs) {
      expect(r.territorialLabel).toBe(
        "valor de la muestra local del ámbito (agregado real del estudio cargado)"
      );
      expect(r.comparisonReading).toContain("muestra local del ámbito, no representativa");
      expect(r.scaleCaution).toContain("estimación poblacional del municipio");
      expect(r.scaleCaution).not.toMatch(/distrit/);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 3. Granada-Zaidín (distrito): la redacción inframunicipal se conserva
// ══════════════════════════════════════════════════════════════════════════════

describe("Lote D · REGRESIÓN Granada-Zaidín (distrito) — vocabulario preservado", () => {
  const zaidin = seed("granada-zaidin");
  const text = generatedText(zaidin);

  it("D3.1 la identidad se conserva como distrito", () => {
    expect(zaidin.municipality.identity.territorialType).toBe("distrito");
    expect(territorialScopeNoun(zaidin.municipality.identity)).toBe("distrito");
  });

  it("D3.2 conserva el vocabulario inframunicipal legítimo", () => {
    expect(text).toContain("sin desagregación distrital");
    expect(text).toContain("del barrio");
    expect(text).toContain("Unidad Asistencial");
    // Mención legítima del municipio matriz (BADEA / Granada capital) intacta.
    expect(text).toContain("municipio matriz");
    // La pregunta de mortalidad conserva su forma inframunicipal.
    expect(text).toContain("no de distrito");
  });

  it("D3.3 las cautelas provinciales acreditadas por fuente real se conservan", () => {
    // «contexto provincial/externo» de una señal NO local es procedencia real,
    // no el fallback neutralizado; debe seguir presente.
    expect(text).toContain("contexto provincial/externo, no estimación distrital");
  });

  it("D3.4 sus muestras locales reales adoptan la etiqueta «muestra local del ámbito» (corrección #4)", () => {
    const refs = buildIndicatorComparisonReferences({ workspace: zaidin }).references;
    const locales = refs.filter((r) => r.esLocal);
    expect(locales.length).toBeGreaterThan(0);
    for (const r of locales) {
      expect(r.territorialLabel).toBe(
        "valor de la muestra local del ámbito (agregado real del estudio cargado)"
      );
      // La cautela de escala del distrito conserva «del distrito».
      expect(r.scaleCaution).toContain("estimación poblacional del distrito");
    }
    // Las referencias proxy/demo conservan su etiqueta territorial/demo.
    const proxy = refs.filter((r) => r.demoProxy);
    expect(proxy.length).toBeGreaterThan(0);
    for (const r of proxy) {
      expect(r.territorialLabel).toContain("muestra territorial/demo");
    }
  });
});
