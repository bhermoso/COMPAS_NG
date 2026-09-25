/**
 * tests/lt1-scaffold-quality.test.ts
 *
 * Verifica que LT1Engine.buildSummary() y los scaffolds de buildLocalHealthProfile
 * producen texto orientado al territorio en lugar de metadiscurso del sistema.
 *
 * Cubre los tests A, B y C del incremento mínimo del Perfil como producto.
 *
 * Invariante general: los textos generados por el sistema deben hablar del
 * territorio, no del pipeline interno de COMPÁS NG.
 */

import { describe, it, expect } from "vitest";
import { generateLT1 } from "../src/application/lt1";
import { buildLocalHealthProfile } from "../src/application/health-profile";
import { runEvidenceStoreIntegrityGuard } from "../src/application/evidence";
import { createEstadoTerritorialEvolutivo } from "../src/application/territorial-interpretation";
import { runReconciliacionInterpretativa } from "../src/application/reconciliation";
import { generateOIT } from "../src/application/oit";
import { createEvidenceStore, createEvidenceAtom } from "../src/domain/evidence";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MUN_ID = "atarfe-test";

function makeStore() {
  return createEvidenceStore(MUN_ID);
}

function makeAtom(kind: "indicator" | "determinant" | "asset" | "qualitative-observation" | "participation" | "methodological-caution", index: number) {
  return createEvidenceAtom({
    id: `atom-${kind}-${index}`,
    municipalityId: MUN_ID,
    kind,
    title: `${kind} ${index}`,
    content: `Contenido de prueba para ${kind} ${index}.`,
    provenance: {
      origin: "territorial-documentation",
      extractedAt: new Date().toISOString(),
    },
  });
}

function makeRichStore() {
  const base = makeStore();
  return {
    ...base,
    atoms: [
      makeAtom("indicator", 1),
      makeAtom("indicator", 2),
      makeAtom("determinant", 1),
      makeAtom("determinant", 2),
      makeAtom("asset", 1),
      makeAtom("qualitative-observation", 1),
      makeAtom("participation", 1),
      makeAtom("methodological-caution", 1),
    ],
  };
}

// Frases de metadiscurso que no deben aparecer en texto generado al usuario
const METADISCURSO_PATTERNS = [
  "construida a partir de",
  "no establece causalidad",
  "el sistema",
  "trazabilidad",
  "EvidenceAtom",
  "pipeline",
  "repositorio no contiene",
  "evidencias estructuradas procedentes de",
  "La lectura territorial se ha construido",
  "El diagnóstico se ha construido a partir",
  "Base documental insuficiente",
];

function containsMetadiscurso(text: string): string[] {
  return METADISCURSO_PATTERNS.filter((pattern) =>
    text.toLowerCase().includes(pattern.toLowerCase())
  );
}

// ── Test A: LT1 territorial tone con átomos ───────────────────────────────────

describe("LT1Engine buildSummary — tono territorial (con átomos)", () => {
  it("no contiene frases de metadiscurso del sistema", () => {
    const store = makeRichStore();
    const result = generateLT1(store);

    const violations = containsMetadiscurso(result.summary);
    expect(violations).toHaveLength(0);
  });

  it("contiene vocabulario territorial en lugar de vocabulario de pipeline", () => {
    const store = makeRichStore();
    const { summary } = generateLT1(store);

    const territorialTerms = ["territorio", "lectura", "patrón", "contrastar", "capacidades"];
    const found = territorialTerms.some((t) =>
      summary.toLowerCase().includes(t.toLowerCase())
    );
    expect(found).toBe(true);
  });

  it("menciona determinantes en lenguaje territorial cuando hay átomos de tipo determinant", () => {
    const store = { ...makeStore(), atoms: [makeAtom("determinant", 1)] };
    const { summary } = generateLT1(store);

    expect(summary).toContain("territorio");
    expect(summary.toLowerCase()).not.toContain("no establece causalidad");
  });

  it("menciona activos como palancas de acción cuando hay átomos de tipo asset", () => {
    const store = { ...makeStore(), atoms: [makeAtom("asset", 1)] };
    const { summary } = generateLT1(store);

    expect(summary.toLowerCase()).toMatch(/activo|capacidad|palanca/);
    expect(summary.toLowerCase()).not.toContain("se registran");
  });

  it("menciona perspectiva ciudadana en lenguaje territorial cuando hay participación", () => {
    const store = { ...makeStore(), atoms: [makeAtom("participation", 1)] };
    const { summary } = generateLT1(store);

    expect(summary.toLowerCase()).toMatch(/ciudadana|comunit|contrastar|grupo motor/);
  });

  it("el cierre es una invitación a validar, no un disclaimer del sistema", () => {
    const store = makeRichStore();
    const { summary } = generateLT1(store);

    expect(summary).toContain("equipo técnico");
    expect(summary.toLowerCase()).not.toContain("priorización automática");
  });
});

// ── Test B: LT1 caso sin átomos ───────────────────────────────────────────────

describe("LT1Engine buildSummary — caso sin átomos", () => {
  it("devuelve mensaje orientado al territorio, no error técnico del sistema", () => {
    const store = makeStore();
    const { summary } = generateLT1(store);

    expect(summary.toLowerCase()).not.toContain("evidenceatom");
    expect(summary.toLowerCase()).not.toContain("pipeline");
    expect(summary.toLowerCase()).not.toContain("repositorio no contiene");
    expect(summary.toLowerCase()).not.toContain("ingesta");
  });

  it("el mensaje vacío orienta a qué se puede incorporar", () => {
    const store = makeStore();
    const { summary } = generateLT1(store);

    expect(summary.toLowerCase()).toMatch(/perfil|información|territorial|diagnós/);
  });
});

// ── Test C: scaffolds de Cap. V y VI — calidad del texto generado ─────────────

describe("buildLocalHealthProfile — calidad territorial de scaffolds", () => {
  function buildMinimalPSL() {
    const workspace = createCompleteMunicipalityWorkspace({ id: MUN_ID, name: "Atarfe" });
    const store = makeRichStore();

    const integrityResult = runEvidenceStoreIntegrityGuard(store);
    const sanitizedStore = integrityResult.sanitizedStore;

    const mit = createEstadoTerritorialEvolutivo({
      evidenceStore: sanitizedStore,
      strategicFrameworks: [],
    });
    const reconciliacion = runReconciliacionInterpretativa(mit, []);
    const oitParaDecision = generateOIT(mit.dimensionDiagnostica);

    return buildLocalHealthProfile({
      sanitizedStore,
      integrityResult,
      mit,
      reconciliacion,
      oitParaDecision,
      workspace,
    });
  }

  it("Cap. V conclusiones no empieza con metadiscurso de construcción del diagnóstico", () => {
    const psl = buildMinimalPSL();
    const content = psl.conclusiones.content;

    expect(content).not.toMatch(/^La lectura territorial se ha construido/);
    expect(content).not.toMatch(/^El diagnóstico se ha construido/);
    expect(content).not.toMatch(/^Base documental insuficiente/);
  });

  it("Cap. V conclusiones contiene orientación territorial para el equipo", () => {
    const psl = buildMinimalPSL();
    const content = psl.conclusiones.content;

    const hasOrientation = (
      content.includes("equipo técnico") ||
      content.includes("Grupo Motor") ||
      content.includes("territorio")
    );
    expect(hasOrientation).toBe(true);
  });

  it("Cap. VI cierre no empieza con metadiscurso de conteo de evidencias", () => {
    const psl = buildMinimalPSL();
    const content = psl.cierreInterpretativo.content;

    expect(content).not.toMatch(/^El diagnóstico se ha construido a partir de \d+ evidencias/);
    expect(content).not.toMatch(/^Base documental insuficiente/);
  });

  it("Cap. VI cierre contiene vocabulario interpretativo territorial", () => {
    const psl = buildMinimalPSL();
    const content = psl.cierreInterpretativo.content;

    const hasInterpretativo = (
      content.toLowerCase().includes("comprensión") ||
      content.toLowerCase().includes("territorio") ||
      content.toLowerCase().includes("priorización") ||
      content.toLowerCase().includes("incertidumbre")
    );
    expect(hasInterpretativo).toBe(true);
  });

  it("Cap. V y VI mantienen status scaffold — no se convierten en authored automáticamente", () => {
    const psl = buildMinimalPSL();
    expect(psl.conclusiones.status).toBe("scaffold");
    expect(psl.cierreInterpretativo.status).toBe("scaffold");
  });

  it("Cap. V y VI no contienen listas de origins técnicos internos", () => {
    const psl = buildMinimalPSL();
    const content = psl.conclusiones.content + psl.cierreInterpretativo.content;

    expect(content.toLowerCase()).not.toContain("health-report, ibse");
    expect(content.toLowerCase()).not.toContain("procedentes de:");
    expect(content.toLowerCase()).not.toContain("evidenceatom");
  });
});

// ── Regresión: generateLT1 sigue siendo correcto estructuralmente ─────────────

describe("generateLT1 — integridad estructural", () => {
  it("devuelve requiresHumanValidation: true con átomos", () => {
    const store = makeRichStore();
    const result = generateLT1(store);
    expect(result.requiresHumanValidation).toBe(true);
  });

  it("devuelve requiresHumanValidation: true sin átomos", () => {
    const store = makeStore();
    const result = generateLT1(store);
    expect(result.requiresHumanValidation).toBe(true);
  });

  it("clasifica átomos correctamente por tipo", () => {
    const store = makeRichStore();
    const result = generateLT1(store);
    expect(result.determinants.length).toBe(2);
    expect(result.assets.length).toBe(1);
    expect(result.indicators.length).toBe(2);
    expect(result.qualitativeFindings.length).toBe(2); // qualitative-observation + participation
    expect(result.methodologicalCautions.length).toBe(1);
  });
});
