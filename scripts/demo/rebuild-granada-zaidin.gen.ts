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
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
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

/**
 * Escapa todo carácter no ASCII como \uXXXX (escape JSON válido).
 * El texto resultante es 100 % ASCII: sobrevive a cualquier canal de copia
 * (cmd con CP850, PowerShell 5.1 con CP1252, editores sin detección UTF-8)
 * y JSON.parse produce exactamente las mismas cadenas con tildes correctas.
 * Motivo: incidente de mojibake del 2026-07-07 («Granada-Zaid├¡n») causado
 * por copiar el fragmento a través de una consola con página de códigos CP850.
 */
function toAsciiSafeJson(jsonText: string): string {
  let out = "";
  for (let i = 0; i < jsonText.length; i++) {
    const code = jsonText.charCodeAt(i);
    out += code < 0x80
      ? jsonText[i]
      : "\\u" + code.toString(16).padStart(4, "0");
  }
  return out;
}

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

    // Artefactos 100 % ASCII: los acentos van como escapes JSON \uXXXX.
    // JSON.parse reconstruye las cadenas exactas ("Granada-Zaidín", "COMPÁS NG").
    const asciiValue = toAsciiSafeJson(value);
    expect(/^[\x00-\x7F]*$/.test(asciiValue)).toBe(true);
    expect(JSON.stringify(JSON.parse(asciiValue))).toBe(JSON.stringify(JSON.parse(value)));

    const consoleSnippet = [
      "// COMPAS NG - Restaurar el expediente demo de Granada-Zaidin.",
      "// (Comentarios sin tildes a proposito: este fichero es 100% ASCII para",
      "//  sobrevivir a consolas con pagina de codigos CP850/CP1252. Los acentos",
      "//  viajan como escapes \\uXXXX y se reconstruyen intactos al parsear.)",
      "// 1. Abrir http://localhost:5173/COMPAS_NG/ (puerto fijo: strictPort).",
      "// 2. Abrir DevTools -> Console y pegar ESTE FICHERO INTEGRO.",
      "// 3. Recargar la pagina y seleccionar el ambito Granada-Zaidin.",
      `localStorage.setItem(${JSON.stringify(key)}, JSON.stringify(`,
      asciiValue,
      "));",
      `console.log("Granada-Zaidin restaurado:", localStorage.getItem(${JSON.stringify(key)}).length, "caracteres");`,
      "",
    ].join("\n");
    expect(/^[\x00-\x7F]*$/.test(consoleSnippet)).toBe(true);

    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      resolve(outDir, "compas-ng-workspace-granada-zaidin.json"),
      asciiValue,
      "utf8"
    );
    writeFileSync(resolve(outDir, "restore-granada-zaidin.console.js"), consoleSnippet, "utf8");

    // Validación de ida y vuelta sobre lo escrito en disco.
    const writtenJson = readFileSync(
      resolve(outDir, "compas-ng-workspace-granada-zaidin.json"),
      "utf8"
    );
    const roundTrip = JSON.stringify(JSON.parse(writtenJson));
    for (const literal of ["Granada-Zaidín", "Andalucía", "COMPÁS", "ámbito", "—"]) {
      expect(roundTrip, `literal ${literal}`).toContain(literal);
    }

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
