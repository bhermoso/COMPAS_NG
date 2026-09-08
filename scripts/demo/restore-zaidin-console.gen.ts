/**
 * scripts/demo/restore-zaidin-console.gen.ts
 *
 * Genera el fragmento de restauración en consola de Granada-Zaidín
 * SIEMPRE desde el EXPORT VIGENTE (56/92):
 *   municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json
 *
 * Se ejecuta con: npm run restore:zaidin
 * (config vitest.rebuild.config.ts — NO forma parte de `npm test`).
 *
 * El fragmento resultante es 100 % ASCII (el export vigente ya lo es) y no
 * puede reponer la reconstrucción mínima 15/51: no la lee en ningún caso.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const exportsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../municipalities/granada-zaidin/exports"
);

const VIGENTE = "compas-ng-workspace-granada-zaidin.json";
const KEY = "compas-ng:workspace:granada-zaidin";

describe("Generador — restore de Granada-Zaidín desde el export vigente", () => {
  it("produce restore-granada-zaidin.console.js a partir del vigente 56/92", () => {
    const value = readFileSync(resolve(exportsDir, VIGENTE), "utf8");

    // El export vigente debe ser ASCII puro y corresponder a la línea 56/92.
    expect(/^[\x00-\x7F]*$/.test(value)).toBe(true);
    const ws = JSON.parse(value);
    const atoms = ws.evidenceStore.atoms;
    expect(ws.municipality.identity.territorialType).toBe("distrito");
    expect(ws.repository.documents.length).toBe(20);
    expect(atoms.length).toBe(92);
    expect(
      atoms.filter((a: { provenance: { origin: string } }) => a.provenance.origin === "localiza-salud").length
    ).toBe(56);

    const snippet = [
      "// COMPAS NG - Restaurar el expediente VIGENTE (56/92) de Granada-Zaidin.",
      "// Generado desde el export vigente con: npm run restore:zaidin",
      "// (Comentarios sin tildes a proposito: fichero 100% ASCII, inmune a",
      "//  consolas con pagina de codigos CP850/CP1252.)",
      "// 1. Abrir http://localhost:5173/COMPAS_NG/ (puerto fijo: strictPort).",
      "// 2. Abrir DevTools -> Console y pegar ESTE FICHERO INTEGRO.",
      "// 3. Recargar la pagina y seleccionar el ambito Granada-Zaidin.",
      `localStorage.setItem(${JSON.stringify(KEY)}, JSON.stringify(`,
      value,
      "));",
      `console.log("Granada-Zaidin 56/92 restaurado:", localStorage.getItem(${JSON.stringify(KEY)}).length, "caracteres");`,
      "",
    ].join("\n");
    expect(/^[\x00-\x7F]*$/.test(snippet)).toBe(true);

    writeFileSync(resolve(exportsDir, "restore-granada-zaidin.console.js"), snippet, "utf8");

    process.stdout.write(
      `\nRestore regenerado desde el export vigente: ${value.length} caracteres · ` +
        `20 docs · 92 evidencias · 56 Localiza Salud · distrito\n`
    );
  }, 60000);
});
