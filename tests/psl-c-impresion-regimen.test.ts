/**
 * Régimen de impresión ÚNICO del Perfil (GOV-SALIDA-01 · PR-4).
 *
 * Verifica, de forma estática sobre `src/App.css`, que la impresión es
 * determinista: un solo bloque `@media print`; la lectura canónica (`.pie-*`)
 * es la raíz imprimible; el visor institucional (`.pslc-viewer`) y el espacio
 * técnico no se imprimen; y abrir/cerrar un `<details>` no cambia qué se
 * imprime (se retiró el régimen dual gobernado por `:has(details[open]
 * .pslc-viewer)`).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "..", "src", "App.css"),
  "utf8"
);

/** Extrae el cuerpo del único bloque `@media print { ... }` por balance de llaves. */
function mediaPrintBlock(source: string): string {
  const start = source.indexOf("@media print");
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error("bloque @media print no balanceado");
}

describe("impresión — régimen único y determinista", () => {
  it("existe un solo bloque @media print", () => {
    expect((css.match(/@media print/g) ?? [])).toHaveLength(1);
  });

  it("no hay régimen dual gobernado por el estado de un <details>", () => {
    // Los antiguos selectores gate quedan retirados (pueden citarse en comentario).
    expect(css).not.toContain("body:has(details[open] .pslc-viewer)");
    expect(css).not.toContain("body:not(:has(details[open] .pslc-viewer))");
    // Ningún selector `:has(` dentro del bloque de impresión.
    expect(mediaPrintBlock(css)).not.toContain(":has(");
  });

  it("el visor institucional y el espacio técnico no se imprimen", () => {
    const block = mediaPrintBlock(css);
    expect(block).toMatch(/\.pslc-viewer[\s,]/);
    expect(block).toContain(".psl-technical-space");
    // Ambos bajo una regla display:none dentro del bloque de impresión.
    expect(block).toMatch(/\.pslc-viewer\s*\{[^}]*display:\s*none/s);
  });

  it("la lectura canónica (.pie-*) es la raíz imprimible", () => {
    const block = mediaPrintBlock(css);
    expect(block).toContain(".pie-doc");
    // El anexo colapsado de la lectura tampoco se imprime.
    expect(block).toMatch(/\.pie-annex\s*\{[^}]*display:\s*none/s);
  });
});
