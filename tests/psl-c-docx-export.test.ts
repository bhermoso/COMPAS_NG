/**
 * tests/psl-c-docx-export.test.ts
 *
 * Export DOCX del artefacto institucional congelado PSL-C.
 * Se testea la capa intermedia estructurada (buildPSLCDocumentModel, pura)
 * y la serialización como humo (el binario es un ZIP válido no vacío).
 *
 * Estructura protegida: seis capítulos canónicos I–VI + bloques
 * institucionales no capitulares; sin capítulo VII; sin espacios de trabajo
 * internos ni textos de la UI; con hash, cautelas y frontera con el Plan
 * de Acción.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import { compileLocalHealthProfile } from "../src/application/health-profile-compiler";
import {
  createPerfilLocalDeSalud,
  addHypothesis,
  addOpenQuestion,
  updateSynthesis,
  NARRATIVE_CHAPTER_TITLES,
} from "../src/application/health-profile";
import {
  buildPSLCDocumentModel,
  pslcDocxFileName,
  exportPSLCArtifactToDocxBuffer,
} from "../src/application/psl-c-export";
import type { PSLCDocumentModel } from "../src/application/psl-c-export";
import type { LocalHealthProfileArtifact } from "../src/domain/health-profile-artifact";
import type { LocalHealthProfile, PerfilLocalDeSalud } from "../src/domain/health-profile";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

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

function perfilConConocimiento(): PerfilLocalDeSalud {
  let perfil = createPerfilLocalDeSalud("granada-zaidin");
  perfil = addHypothesis(perfil, {
    espacio: "situacion-salud",
    enunciado: "El malestar emocional detectado se concentra en población cuidadora.",
    plausibilidad: "moderada",
    indicios: ["señales de salud mental y apoyo social"],
    preguntasResolutoras: ["Explotación desagregada de GHQ-12"],
    autorNombre: "Equipo técnico",
  });
  perfil = addOpenQuestion(perfil, {
    espacio: "desigualdades",
    formulacion: "No se conoce la distribución interna de renta y vivienda del distrito.",
    relevancia: "condiciona la lectura de desigualdades en salud.",
    urgencia: "alta",
    viasResolucion: ["Sección censal INE"],
  });
  perfil = updateSynthesis(
    perfil,
    "El distrito combina un patrón contextual de malestar psicosocial con un tejido comunitario denso."
  );
  return perfil;
}

let artifact: LocalHealthProfileArtifact;
let model: PSLCDocumentModel;
let textoCompleto: string;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  const perfil = perfilConConocimiento();
  const ws: MunicipalityWorkspace = { ...loaded, perfilLocalDeSalud: perfil };
  const generated = createMunicipalityRuntime({ workspace: ws }).psl;
  const compilable: LocalHealthProfile = {
    ...generated,
    status: "validated",
    validatedAt: "2026-07-08T12:00:00.000Z",
    validatedBy: "Equipo técnico de salud pública",
    conclusiones: { ...generated.conclusiones, status: "authored" },
    cierreInterpretativo: { ...generated.cierreInterpretativo, status: "authored" },
    priorizacionStatus: "complete",
    priorizacion: {
      ...generated.priorizacion,
      consensoDocumentado: true,
      deliberacionNota: "El Grupo Motor deliberó y documentó el consenso.",
    },
  };
  const result = compileLocalHealthProfile({
    psl: compilable,
    perfil,
    municipalityName: ws.municipality.identity.name,
    municipalityProvince: ws.municipality.identity.province ?? "",
    existingArtifactCount: 0,
  });
  if (!result.ok) throw new Error("compilación del arnés falló");
  artifact = result.artifact;
  model = buildPSLCDocumentModel(artifact);
  textoCompleto = [
    model.title,
    model.subtitle,
    ...model.portada,
    ...model.sections.flatMap((s) => [s.title, ...s.paragraphs]),
  ].join("\n");
}, 60000);

describe("export DOCX — estructura del modelo documental", () => {
  it("contiene los seis capítulos canónicos y ningún capítulo VII", () => {
    const titulos = model.sections.map((s) => s.title);
    NARRATIVE_CHAPTER_TITLES.forEach((titulo, i) => {
      const numeral = ["I", "II", "III", "IV", "V", "VI"][i];
      expect(titulos).toContain(`${numeral}. ${titulo}`);
    });
    expect(titulos.some((t) => t.startsWith("VII."))).toBe(false);
    expect(textoCompleto).not.toMatch(/(^|\n)VII\.\s/);
  });

  it("los bloques institucionales no capitulares acompañan al documento", () => {
    const titulos = model.sections.map((s) => s.title);
    for (const bloque of [
      "Base documental",
      "Cierre interpretativo",
      "Estado del conocimiento",
      "Cautelas metodológicas",
      "Frontera institucional",
      "Trazabilidad",
    ]) {
      expect(titulos).toContain(bloque);
    }
  });

  it("no exporta espacios de trabajo internos ni textos de la UI", () => {
    expect(textoCompleto).not.toMatch(
      /Redactar documento|Nueva hipótesis|Documentar deliberación|Revertir a borrador|Guardar|Espacio de trabajo del equipo técnico|botón|pantalla/i
    );
  });

  it("incluye hash y trazabilidad", () => {
    expect(textoCompleto).toContain(artifact.sourceHash);
    expect(textoCompleto).toContain("Trazabilidad");
    expect(textoCompleto).toContain(artifact.sourcePSLId);
  });

  it("incluye cautelas y frontera con el Plan de Acción", () => {
    expect(textoCompleto).toContain("Cautelas metodológicas");
    expect(textoCompleto).toContain(
      "no formula recomendaciones, actuaciones, programas ni objetivos estratégicos"
    );
    expect(textoCompleto).toContain("Plan de Acción");
    expect(textoCompleto).toContain("fase posterior del proceso de planificación");
    expect(textoCompleto).toContain("contexto exploratorio");
  });

  it("no incluye recomendaciones, programas ni causalidad demostrada", () => {
    expect(textoCompleto).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|debe ponerse en marcha|programa de|l[íi]nea estrat[ée]gica|objetivo operativo/i
    );
    expect(textoCompleto).not.toMatch(
      /demuestra que|queda demostrado|causa directa|relaci[óo]n causal confirmada/i
    );
  });

  it("el nombre de archivo es estable y seguro", () => {
    expect(pslcDocxFileName(artifact)).toBe("psl-c-granada-zaidin-2027-2030.docx");
    expect(model.fileName).toBe("psl-c-granada-zaidin-2027-2030.docx");
  });
});

describe("export DOCX — serialización", () => {
  it("produce un DOCX binario válido (ZIP no vacío)", async () => {
    const buffer = await exportPSLCArtifactToDocxBuffer(artifact);
    expect(buffer.length).toBeGreaterThan(1000);
    // Firma ZIP: PK
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });
});
