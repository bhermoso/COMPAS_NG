/**
 * tests/psl-estado-documental.test.tsx
 *
 * Semántica de estados del documento en la pantalla del Perfil de Salud
 * Local: el usuario debe distinguir sin ambigüedad entre
 *   (1) borrador técnico generado,
 *   (2) Perfil validado técnicamente (pendiente de compilación institucional),
 *   (3) artefacto PSL-C compilado/congelado (el documento institucional).
 *
 * Regla protegida: «documento institucional completo» solo puede aparecer
 * asociado al artefacto PSL-C compilado, nunca al borrador ni al validado.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import { compileLocalHealthProfile } from "../src/application/health-profile-compiler";
import { LocalHealthProfileView } from "../src/ui/components/LocalHealthProfileView";
import type { LocalHealthProfileArtifact } from "../src/domain/health-profile-artifact";
import type { LocalHealthProfile } from "../src/domain/health-profile";
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

let ws: MunicipalityWorkspace;
let generado: LocalHealthProfile;
let validado: LocalHealthProfile;
let artifact: LocalHealthProfileArtifact;

function render(
  psl: LocalHealthProfile,
  compiledProfiles?: LocalHealthProfileArtifact[]
): string {
  return renderToStaticMarkup(
    <LocalHealthProfileView
      psl={psl}
      pslIsStale={false}
      municipalityName={ws.municipality.identity.name}
      compiledProfiles={compiledProfiles}
      onValidate={() => {}}
      onInvalidate={() => {}}
    />
  );
}

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  generado = createMunicipalityRuntime({ workspace: ws }).psl;
  validado = {
    ...generado,
    status: "validated",
    validatedAt: "2026-07-08T12:00:00.000Z",
    validatedBy: "Equipo técnico de salud pública",
  };
  const compilable: LocalHealthProfile = {
    ...validado,
    conclusiones: { ...validado.conclusiones, status: "authored" },
    cierreInterpretativo: { ...validado.cierreInterpretativo, status: "authored" },
    priorizacionStatus: "complete",
    priorizacion: {
      ...validado.priorizacion,
      consensoDocumentado: true,
      deliberacionNota: "El Grupo Motor deliberó y documentó el consenso.",
    },
  };
  const result = compileLocalHealthProfile({
    psl: compilable,
    municipalityName: ws.municipality.identity.name,
    municipalityProvince: ws.municipality.identity.province ?? "",
    existingArtifactCount: 0,
  });
  if (!result.ok) throw new Error("compilación del arnés falló");
  artifact = result.artifact;
}, 60000);

describe("estados documentales — borrador técnico", () => {
  it("el borrador generado no se presenta como documento institucional", () => {
    const html = render(generado);
    expect(html).toContain("Documento de trabajo");
    expect(html).not.toContain("documento institucional completo");
    expect(html).not.toContain("Validado técnicamente");
  });
});

describe("estados documentales — validado sin compilar", () => {
  it("«validado» significa validación técnica, con la fase institucional pendiente", () => {
    const html = render(validado);
    expect(html).toContain("Validado técnicamente");
    expect(html).toContain("pendiente de compilación institucional");
    expect(html).toContain(
      "el documento institucional (PSL-C) se crea al compilar"
    );
    expect(html).not.toContain("documento institucional completo");
  });

  it("los espacios de trabajo quedan marcados como fuera del documento institucional", () => {
    const html = render(validado);
    const marcas = html.match(/no forma parte del documento\s+institucional/g) ?? [];
    expect(marcas.length).toBeGreaterThanOrEqual(2);
  });
});

describe("estados documentales — PSL-C compilado", () => {
  it("«documento institucional completo» solo aparece con el artefacto congelado", () => {
    const html = render(validado, [artifact]);
    expect(html).toContain("Ver documento institucional completo");
    expect(html).toContain("Compilado como documento institucional");
    expect(html).toContain("Documento congelado");
  });

  it("la frontera con el Plan de Acción permanece intacta en la narrativa", () => {
    const html = render(validado, [artifact]);
    expect(html).toContain("no formula recomendaciones");
    expect(html).not.toMatch(/se recomienda|recomendamos|debe implantarse/i);
  });
});
