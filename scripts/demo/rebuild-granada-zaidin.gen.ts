/**
 * scripts/demo/rebuild-granada-zaidin.gen.ts
 *
 * Generador del expediente restaurable de Granada-Zaidín.
 * Se ejecuta con: npm run rebuild:zaidin
 * (config dedicada vitest.rebuild.config.ts — NO forma parte de `npm test`).
 *
 * Produce en municipalities/granada-zaidin/exports/:
 *   - compas-ng-workspace-granada-zaidin.json      valor exacto de localStorage
 *   - restore-granada-zaidin.console.js            fragmento para pegar en consola
 *
 * La serialización se obtiene llamando al servicio real
 * saveWorkspaceToLocalStorage sobre una simulación de localStorage, de modo
 * que el fichero exportado es byte a byte lo que la aplicación escribiría.
 */

import { describe, it, expect } from "vitest";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Simulación de localStorage ANTES de usar la capa de persistencia real.
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

import {
  saveWorkspaceToLocalStorage,
  loadWorkspaceFromLocalStorage,
  buildWorkspaceStorageKey,
} from "../../src/infrastructure/persistence/local-storage";
import { buildGranadaZaidinWorkspace, GRANADA_ZAIDIN_ID } from "./buildGranadaZaidinWorkspace";

const outDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../municipalities/granada-zaidin/exports"
);

describe("Generador — expediente restaurable de Granada-Zaidín", () => {
  it("construye, verifica y exporta el expediente", async () => {
    const { workspace, counts } = await buildGranadaZaidinWorkspace();

    // Guardado con el servicio real → serialización idéntica a la de la app.
    expect(saveWorkspaceToLocalStorage(workspace)).toBe(true);
    const key = buildWorkspaceStorageKey(GRANADA_ZAIDIN_ID);
    const value = store.get(key)!;

    // El valor debe poder recargarse con el servicio real sin pérdida.
    const reloaded = loadWorkspaceFromLocalStorage(GRANADA_ZAIDIN_ID);
    expect(reloaded).not.toBeNull();
    expect(reloaded!.evidenceStore.atoms.length).toBe(counts.totalAtoms);
    expect(reloaded!.healthReport).toBeDefined();

    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, "compas-ng-workspace-granada-zaidin.json"), value, "utf8");
    writeFileSync(
      resolve(outDir, "restore-granada-zaidin.console.js"),
      [
        "// COMPÁS NG — Restauración del expediente demo de Granada-Zaidín",
        "// 1. Abrir http://localhost:5173/COMPAS_NG/ (el puerto es fijo: strictPort).",
        "// 2. Abrir DevTools → Console y pegar ESTE FICHERO ÍNTEGRO.",
        "// 3. Recargar la página y seleccionar el ámbito Granada-Zaidín.",
        `localStorage.setItem(${JSON.stringify(key)}, JSON.stringify(`,
        value,
        "));",
        `console.log("Granada-Zaidín restaurado:", localStorage.getItem(${JSON.stringify(key)}).length, "caracteres");`,
        "",
      ].join("\n"),
      "utf8"
    );

    process.stdout.write(
      [
        "",
        "════ Expediente Granada-Zaidín generado ════",
        `Clave localStorage : ${key}`,
        `Tamaño del valor   : ${value.length} caracteres`,
        `Documentos         : ${counts.documents}`,
        `Estudios           : ${counts.studies}`,
        `Evidencias estudios: ${counts.studyAtoms}`,
        `Activos Localiza   : ${counts.localizaAtoms}`,
        `Evidencias totales : ${counts.totalAtoms}`,
        `Átomos del Informe : ${counts.healthReportAtoms} (D-HR-01)`,
        `Salida             : ${outDir}`,
        "",
      ].join("\n")
    );
  }, 180000);
});
