/**
 * tests/psl-c-artifact-viewer.test.tsx
 *
 * Visor institucional de solo lectura del artefacto congelado PSL-C.
 * Renderiza el componente a marcado estático (sin navegador) sobre un
 * artefacto compilado desde el expediente vigente Granada-Zaidín 56/92 y
 * verifica que el documento visible:
 *   - contiene portada, base documental, conclusiones, estado del
 *     conocimiento y cautelas;
 *   - mantiene la frontera institucional con el Plan de Acción;
 *   - no introduce recomendaciones, programas ni causalidad demostrada;
 *   - no inventa datos ausentes (EKC sin perfil → "no disponible").
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import { compileLocalHealthProfile } from "../src/application/health-profile-compiler";
import {
  createPerfilLocalDeSalud,
  addInterpretation,
  addHypothesis,
  addOpenQuestion,
  updateSynthesis,
} from "../src/application/health-profile";
import { PSLCArtifactViewer } from "../src/ui/components/PSLCArtifactViewer";
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
  perfil = addInterpretation(perfil, {
    espacio: "determinantes",
    enunciado:
      "La presión del envejecimiento sobre las redes de cuidado condiciona la salud del distrito.",
    certeza: "moderada",
    evidenciaIds: ["localiza-atom-1"],
    autorNombre: "Equipo técnico",
  });
  perfil = addHypothesis(perfil, {
    espacio: "situacion-salud",
    enunciado:
      "El malestar emocional detectado se concentra en población cuidadora.",
    plausibilidad: "moderada",
    indicios: ["señales de salud mental y apoyo social"],
    preguntasResolutoras: ["Explotación desagregada de GHQ-12"],
    autorNombre: "Equipo técnico",
  });
  perfil = addOpenQuestion(perfil, {
    espacio: "desigualdades",
    formulacion:
      "No se conoce la distribución interna de renta y vivienda del distrito.",
    relevancia: "condiciona la lectura de desigualdades en salud.",
    urgencia: "alta",
    viasResolucion: ["Sección censal INE"],
  });
  perfil = updateSynthesis(
    perfil,
    "El distrito combina un patrón contextual de malestar psicosocial con un tejido comunitario denso orientado a mayores."
  );
  return perfil;
}

function pslCompilable(generated: LocalHealthProfile): LocalHealthProfile {
  return {
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
      deliberacionNota:
        "El Grupo Motor deliberó sobre las cuestiones de contraste y documentó el consenso alcanzado.",
    },
  };
}

let ws: MunicipalityWorkspace;
let generated: LocalHealthProfile;
let artifact: LocalHealthProfileArtifact;
let html: string;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  const perfil = perfilConConocimiento();
  ws = { ...loaded, perfilLocalDeSalud: perfil };
  generated = createMunicipalityRuntime({ workspace: ws }).psl;
  const result = compileLocalHealthProfile({
    psl: pslCompilable(generated),
    perfil,
    compiledBy: "Equipo técnico de salud pública",
    municipalityName: ws.municipality.identity.name,
    municipalityProvince: ws.municipality.identity.province ?? "",
    existingArtifactCount: 0,
  });
  if (!result.ok) throw new Error("La compilación del arnés falló");
  artifact = result.artifact;
  html = renderToStaticMarkup(<PSLCArtifactViewer artifact={artifact} />);
}, 60000);

describe("visor PSL-C — documento institucional renderizado", () => {
  it("renderiza portada con municipio, versión, fecha y trazabilidad", () => {
    expect(html).toContain("Perfil de Salud Local de Granada-Zaidín");
    expect(html).toContain("PSL-C/v1");
    expect(html).toContain("Artefacto congelado");
    expect(html).toContain(artifact.sourceHash);
    expect(html).toContain("Equipo técnico de salud pública");
  });

  it("muestra la base documental y declara la compilación institucional", () => {
    expect(html).toContain("92</strong> elementos");
    expect(html).toContain("estudios complementarios");
    expect(html).toContain("preservado íntegro, referenciado sin atomizar");
    expect(html).toContain(
      "compilación institucional del diagnóstico validado"
    );
    expect(html).toContain("no contiene recomendaciones");
  });

  it("muestra el núcleo narrativo por capítulos con conclusiones y cautelas", () => {
    expect(html).toContain("I. Alcance, fuentes y escala de la evidencia");
    expect(html).toContain("VI. Conclusiones técnicas para la priorización");
    expect(html).toContain("El diagnóstico apunta a un distrito");
    expect(html).toContain("Síntesis diagnóstica del equipo técnico.");
    expect(html).toContain("contexto exploratorio");
    expect(html).toContain("Ninguna de estas lecturas constituye causalidad demostrada");
    expect(html).toContain("Cierre interpretativo");
  });

  it("muestra el estado del conocimiento: EKC, hipótesis y preguntas abiertas", () => {
    expect(html).toContain("Estado del conocimiento");
    expect(html).toContain("interpretaciones");
    expect(html).toContain("hipótesis en estudio");
    expect(html).toContain("El malestar emocional detectado se concentra en población cuidadora.");
    expect(html).toContain("plausibilidad moderada, pendiente de");
    expect(html).toContain("distribución interna de renta y vivienda");
    expect(html).toContain("urgencia alta");
    expect(html).toContain("incorporada al capítulo de conclusiones");
    expect(html).toContain("Cautelas metodológicas");
  });

  it("mantiene la frontera institucional con el Plan de Acción", () => {
    expect(html).toContain("Frontera institucional");
    expect(html).toContain(
      "no formula recomendaciones, actuaciones, programas ni objetivos estratégicos"
    );
    expect(html).toContain("Plan de Acción");
    expect(html).toContain("fase posterior del proceso de planificación");
    expect(html).toContain("Consenso del Grupo Motor documentado:");
  });

  it("no introduce recomendaciones, programas ni causalidad demostrada", () => {
    expect(html).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|debe ponerse en marcha|programa de|l[íi]nea estrat[ée]gica|objetivo operativo/i
    );
    expect(html).not.toMatch(
      /demuestra que|queda demostrado|causa directa|relaci[óo]n causal confirmada/i
    );
  });

  it("sin espacio de conocimiento, declara EKC no disponible en lugar de inventarlo", () => {
    const sinPerfil = compileLocalHealthProfile({
      psl: pslCompilable(generated),
      municipalityName: ws.municipality.identity.name,
      municipalityProvince: ws.municipality.identity.province ?? "",
      existingArtifactCount: 0,
    });
    if (!sinPerfil.ok) throw new Error("compilación sin perfil falló");
    const htmlSinPerfil = renderToStaticMarkup(
      <PSLCArtifactViewer artifact={sinPerfil.artifact} />
    );
    expect(htmlSinPerfil).toContain("EKC no disponible");
    expect(htmlSinPerfil).not.toContain("Hipótesis diagnósticas en estudio");
  });
});
