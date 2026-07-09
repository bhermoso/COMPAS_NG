/**
 * tests/profile-writing-contract.test.ts
 *
 * Contrato de escritura del Perfil Local de Salud
 * (docs/architecture/PROFILE-WRITING-CONTRACT.md).
 *
 * El Perfil no describe indicadores ni lista fuentes: interpreta señales de
 * salud como expresiones situadas de condiciones de vida, desigualdades
 * potenciales, recursos comunitarios, experiencias vividas e incertidumbres
 * pendientes de contraste territorial. Y nunca recomienda.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import { compileLocalHealthProfile } from "../src/application/health-profile-compiler";
import { buildPSLCDocumentModel } from "../src/application/psl-c-export";
import {
  checkProfileWritingContract,
  DIAGNOSTIC_ENGINE_QUESTIONS,
  PROFILE_READING_DIMENSIONS,
  POSITIVE_WRITING_CRITERIA,
  LOCAL_PRIMACY_RULE,
} from "../src/application/health-profile";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import type { LocalHealthProfile } from "../src/domain/health-profile";

const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => {
    store.set(k, v);
  },
  removeItem: (k: string) => {
    store.delete(k);
  },
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};

const EXPORT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json"
);

let ws: MunicipalityWorkspace;
let psl: LocalHealthProfile;
let texto: string;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
  texto = psl.conclusiones.content;
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// Contrato: constantes operativas
// ══════════════════════════════════════════════════════════════════════════════

describe("contrato de escritura — definición operativa", () => {
  it("expone las siete dimensiones de lectura y las preguntas-motor", () => {
    expect(PROFILE_READING_DIMENSIONS).toHaveLength(7);
    expect(DIAGNOSTIC_ENGINE_QUESTIONS).toHaveLength(9);
    for (const q of DIAGNOSTIC_ENGINE_QUESTIONS) {
      expect(q.startsWith("¿")).toBe(true);
    }
  });

  it("el verificador caza recomendaciones, programas y causalidad falsa", () => {
    expect(
      checkProfileWritingContract("Se recomienda implantar el servicio.")
    ).not.toHaveLength(0);
    expect(
      checkProfileWritingContract("El programa de intervención previsto…")
    ).not.toHaveLength(0);
    expect(
      checkProfileWritingContract("Esto demuestra que el entorno causa el patrón.")
    ).not.toHaveLength(0);
    // Las negaciones legítimas no violan el contrato
    expect(
      checkProfileWritingContract(
        "Este capítulo no formula recomendaciones, actuaciones ni programas."
      )
    ).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Principio de primacía local
// ══════════════════════════════════════════════════════════════════════════════

describe("contrato de escritura — primacía local", () => {
  it("el contrato declara la primacía de la evidencia local", () => {
    expect(LOCAL_PRIMACY_RULE).toContain("comenta primero la evidencia local");
    expect(LOCAL_PRIMACY_RULE).toContain("No pueden convertirse en la historia principal");
    expect(
      POSITIVE_WRITING_CRITERIA.some((c) => c.includes("prioritizesLocalEvidence"))
    ).toBe(true);
    // Y el documento metodológico recoge la sección
    const doc = readFileSync(
      resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../docs/architecture/PROFILE-WRITING-CONTRACT.md"
      ),
      "utf8"
    );
    expect(doc).toContain("Principio de primacía local");
    expect(doc).toContain("nunca sustituye a la evidencia");
  });

  it("la lectura comenta el Informe y los estudios antes que el contexto externo BADEA", () => {
    const informe = texto.indexOf("cubre la base oficial del diagnóstico");
    const badea = texto.indexOf("Contexto municipal de referencia (BADEA/IECA");
    const estudios = texto.indexOf("no aportan solo");
    expect(informe).toBeGreaterThan(-1);
    expect(badea).toBeGreaterThan(-1);
    expect(estudios).toBeGreaterThan(-1);
    // En el capítulo de contexto, la fuente primaria precede al proxy externo
    expect(informe).toBeLessThan(badea);
  });

  it("BADEA contextualiza sin protagonizar y conserva su cautela proxy", () => {
    // Pocas menciones: contexto, no historia principal
    const menciones = texto.match(/BADEA/g) ?? [];
    expect(menciones.length).toBeLessThanOrEqual(2);
    expect(texto).toContain("no constituye una estimación específica del distrito");
    // La evidencia propia del proceso domina el relato
    const estudiosMenciones = texto.match(/estudios complementarios/g) ?? [];
    expect(estudiosMenciones.length).toBeGreaterThan(menciones.length);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Calidad positiva de la lectura territorial
// ══════════════════════════════════════════════════════════════════════════════

describe("contrato de escritura — calidad positiva del Perfil", () => {
  it("el Informe de Salud tiene función analítica, no solo documental", () => {
    expect(texto).toContain("estructura la lectura de situación");
    expect(texto).toContain("preservado íntegro");
  });

  it("los estudios se leen como señales de vida cotidiana, no como centro del Perfil", () => {
    expect(texto).toContain("expresión de la vida cotidiana");
    expect(texto).toContain("no son el centro del Perfil");
    expect(texto).toContain("cómo se duerme");
  });

  it("los indicadores se traducen a preguntas diagnósticas", () => {
    expect(texto).toContain(
      "Cada trazador abre una pregunta diagnóstica más que cierra un dato"
    );
    expect(texto).toContain("¿qué condiciones de vida del distrito producen este patrón?");
  });

  it("los determinantes se formulan como mecanismos sociales plausibles", () => {
    expect(texto).toContain("pueden estar operando como mecanismos sociales");
    expect(texto).toContain("Ninguna de estas lecturas constituye causalidad demostrada");
  });

  it("las desigualdades no observables quedan declaradas como tales", () => {
    expect(texto).toContain("no un indicio de equidad");
    expect(texto).toContain("Determinantes no evaluables");
  });

  it("los activos son capacidades potenciales conectadas con desafíos, no cobertura", () => {
    expect(texto).toContain("capacidades potenciales");
    expect(texto).toContain("no prueban cobertura ni resultado");
    expect(texto).toContain("reconocidas o pendientes de validación");
    expect(texto).toContain("conectadas con los desafíos del capítulo IV");
  });

  it("la experiencia comunitaria es conocimiento pendiente, nunca inventado", () => {
    expect(texto).toContain("experiencia vivida del vecindario");
    expect(texto).toContain("conocimiento pendiente de incorporación");
    expect(texto).toContain("no un vacío");
  });

  it("BADEA aparece como contexto municipal proxy, no estimación distrital", () => {
    expect(texto).toContain("Contexto municipal de referencia (BADEA/IECA");
    expect(texto).toContain("no constituye una estimación específica del distrito");
  });

  it("el Grupo Motor es fuente de conocimiento, no trámite de validación", () => {
    expect(texto).toContain("conocimiento experiencial del Grupo Motor");
    expect(texto).toContain("mecanismos, barreras, significados");
    expect(texto).toContain("producción de conocimiento, no un trámite de validación");
  });

  it("hay preguntas vivas para la deliberación", () => {
    const preguntas = texto.match(/¿[^?]+\?/g) ?? [];
    expect(preguntas.length).toBeGreaterThanOrEqual(3);
    expect(texto).toContain("Preguntas de contraste territorial");
  });

  it("la conclusión invita a deliberar y a la acción futura sin recomendar", () => {
    expect(texto).toContain("lectura viva del territorio");
    expect(texto).toContain("prepara la acción futura sin anticiparla");
    expect(texto).toContain("no formula recomendaciones");
  });

  it("la lectura ejecutiva del PSL-C abre por la comprensión del territorio", () => {
    const compilable: LocalHealthProfile = {
      ...psl,
      status: "validated",
      validatedAt: "2026-07-09T09:00:00.000Z",
      validatedBy: "Equipo técnico",
      conclusiones: { ...psl.conclusiones, status: "authored" },
      cierreInterpretativo: { ...psl.cierreInterpretativo, status: "authored" },
      priorizacionStatus: "complete",
      priorizacion: {
        ...psl.priorizacion,
        consensoDocumentado: true,
        deliberacionNota: "Consenso documentado por el Grupo Motor.",
      },
    };
    const result = compileLocalHealthProfile({
      psl: compilable,
      municipalityName: ws.municipality.identity.name,
      municipalityProvince: ws.municipality.identity.province ?? "",
      existingArtifactCount: 0,
    });
    if (!result.ok) throw new Error("compilación falló");
    const model = buildPSLCDocumentModel(result.artifact);
    const lectura = model.sections[0];
    expect(lectura.title).toBe("Lectura ejecutiva territorial");
    // Abre comprendiendo el territorio, no enumerando fuentes
    expect(lectura.paragraphs[0]).not.toMatch(/^El diagnóstico se apoya en \d/);
    expect(lectura.paragraphs.join("\n")).toContain("distrito");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Fronteras y regresión
// ══════════════════════════════════════════════════════════════════════════════

describe("contrato de escritura — fronteras", () => {
  it("el documento completo supera el verificador del contrato", () => {
    const violations = checkProfileWritingContract(
      texto + "\n" + psl.cierreInterpretativo.content
    );
    expect(violations).toEqual([]);
  });

  it("sin recomendaciones, programas, objetivos ni capítulo VII", () => {
    expect(texto).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|programa de|objetivo estrat[ée]gico|l[íi]nea estrat[ée]gica/i
    );
    expect(texto).not.toMatch(/(^|\n)VII\.\s/);
    expect(texto).not.toMatch(/Redactar documento|Nueva hipótesis|botón|pantalla/i);
  });

  it("el expediente 56/92 permanece intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
