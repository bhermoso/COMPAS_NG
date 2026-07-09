/**
 * tests/perfil-fuentes-enriquecimiento.test.tsx
 *
 * «Enriquecimiento de fuentes del Perfil»: plano de producto para incorporar
 * nuevas fuentes territoriales antes de compilar el PSL-C, separado del
 * enriquecimiento interpretativo (lectura técnica humana).
 *
 * Protege la honestidad del bloque: las fuentes reales del expediente se
 * resumen desde el workspace; las candidatas (BADEA/IECA, sociodemográficas,
 * etc.) se declaran pendientes y jamás como datos incorporados.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { PerfilFuentesPanel } from "../src/ui/components/health-profile/PerfilFuentesPanel";
import { PerfilLocalDeSaludPanel } from "../src/ui/components/health-profile/PerfilLocalDeSaludPanel";
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
let html: string;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  html = renderToStaticMarkup(<PerfilFuentesPanel workspace={ws} />);
}, 60000);

describe("enriquecimiento de fuentes — presentación y honestidad", () => {
  it("explica su función y su relación con el PSL-C", () => {
    expect(html).toContain("Enriquecimiento de fuentes del Perfil");
    expect(html).toContain("antes de compilar el PSL-C");
    expect(html).toContain("amplían la base de evidencia");
    expect(html).toContain("No sustituyen la interpretación técnica");
    expect(html).toContain("no producen recomendaciones ni actuaciones");
    expect(html).toContain(
      "no generan contenido sustantivo en el Perfil"
    );
    expect(html).toContain('id="psl-enriquecimiento-fuentes"');
  });

  it("resume las fuentes reales del expediente vigente 56/92", () => {
    expect(html).toContain("Fuentes incorporadas al expediente");
    expect(html).toContain("Fuente diagnóstica primaria");
    expect(html).toContain("13 instrumento(s)");
    expect(html).toContain("Localiza Salud): 56");
    expect(html).toContain("20 documento(s) y 92 elemento(s) de evidencia");
    expect(html).toContain("Documentación territorial de contexto");
    expect(html).toContain("no son evidencia diagnóstica"); // marcos
  });

  it("BADEA/IECA es fuente candidata pendiente, nunca dato incorporado", () => {
    expect(html).toContain("Fuentes candidatas · pendientes de incorporación");
    expect(html).toContain("BADEA / IECA");
    expect(html).toContain("pendiente de integración o carga estructurada");
    expect(html).toContain(
      "No hay datos BADEA incorporados al Perfil mientras no se cargue una fuente real"
    );
    // BADEA no aparece entre las incorporadas
    const incorporadas = html.slice(
      html.indexOf("Fuentes incorporadas al expediente"),
      html.indexOf("Fuentes candidatas")
    );
    expect(incorporadas).not.toContain("BADEA");
    // Sin estados afirmativos falsos ni promesas de automatización
    // (la única mención a "incorporados" junto a BADEA es la negación honesta)
    expect(html).not.toMatch(/BADEA[^<]*(analizad[oa]|disponible)/i);
    const conIncorporad = html.match(/BADEA[^<]*incorporad/gi) ?? [];
    const negacionHonesta = html.match(/No hay datos BADEA incorporad/gi) ?? [];
    expect(conIncorporad.length).toBe(negacionHonesta.length);
    expect(html).not.toMatch(
      /descarga autom[áa]tica|integraci[óo]n autom[áa]tica|sincronizaci[óo]n/i
    );
  });

  it("las candidatas cubren los ámbitos previstos con lenguaje de estado", () => {
    for (const candidata of [
      "Indicadores sociodemográficos y determinantes sociales",
      "Infancia y adolescencia",
      "Envejecimiento, dependencia y soledad",
      "Medio urbano y entorno cotidiano",
      "Activos comunitarios verificados",
      "Documentación cualitativa y participativa adicional",
    ]) {
      expect(html).toContain(candidata);
    }
    expect(html).toContain("no condiciona la compilación del PSL-C");
  });

  it("no introduce recomendaciones, programas ni plan de acción como contenido del Perfil", () => {
    expect(html).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|programa de|objetivo estrat[ée]gico/i
    );
  });
});

describe("enriquecimiento de fuentes — separación de planos", () => {
  it("las fuentes aparecen antes que el enriquecimiento interpretativo", () => {
    const ambos = renderToStaticMarkup(
      <>
        <PerfilFuentesPanel workspace={ws} />
        <PerfilLocalDeSaludPanel
          perfil={ws.perfilLocalDeSalud}
          municipalityId="granada-zaidin"
          municipalityName="Granada-Zaidín"
          onUpdatePerfil={() => {}}
        />
      </>
    );
    const fuentes = ambos.indexOf("Enriquecimiento de fuentes del Perfil");
    const interpretativo = ambos.indexOf(
      "Enriquecimiento interpretativo del Perfil"
    );
    expect(fuentes).toBeGreaterThan(-1);
    expect(interpretativo).toBeGreaterThan(fuentes);
    // El interpretativo remite a las fuentes como paso previo posible
    expect(ambos).toContain("incorporar nuevas fuentes territoriales");
  });

  it("App monta el panel de fuentes antes del interpretativo", () => {
    const app = readFileSync(
      resolve(dirname(fileURLToPath(import.meta.url)), "../src/App.tsx"),
      "utf8"
    );
    const fuentes = app.indexOf("<PerfilFuentesPanel");
    const interpretativo = app.indexOf("<PerfilLocalDeSaludPanel");
    expect(fuentes).toBeGreaterThan(-1);
    expect(interpretativo).toBeGreaterThan(fuentes);
  });
});
