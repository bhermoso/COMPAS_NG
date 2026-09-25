/**
 * Lote C-1 — deuda de representación menor (O1, O3).
 *
 *   O1 — El artefacto sellado (PSLCArtefactoCard) rotula sus áreas como «Áreas de
 *        intervención (N)», no «Cuestiones para contraste (N)». Elimina la colisión
 *        de etiqueta con el KPI de la vista viva (que cuenta groupMotorAgenda).
 *   O3 — El fallback OIT usa concordancia singular/plural real (1 activo / 5 activos),
 *        no «activo(s)»/«indicador(es)».
 *
 * (O5 —guarda `toBeDefined` antes de `whatItAdds`— vive en tests/perfil-lote-b.test.ts.)
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateLT1 } from "../src/application/lt1";
import { generateOIT } from "../src/application/oit";
import { createEvidenceStore, addEvidenceAtom, createEvidenceAtom } from "../src/domain/evidence";

const _dir = dirname(fileURLToPath(import.meta.url));

/** Aísla el cuerpo de la función PSLCArtefactoCard dentro del componente. */
function artefactoCardSource(): string {
  const full = readFileSync(
    resolve(_dir, "../src/ui/components/LocalHealthProfileView.tsx"),
    "utf8"
  );
  const start = full.indexOf("function PSLCArtefactoCard");
  expect(start).toBeGreaterThan(-1);
  // Hasta el siguiente límite de función de nivel superior.
  const rest = full.slice(start + 1);
  const nextFn = rest.search(/\n(export function|function) /);
  return full.slice(start, nextFn === -1 ? undefined : start + 1 + nextFn);
}

describe("Lote C-1 · O1 — etiqueta del artefacto sellado", () => {
  const card = artefactoCardSource();

  it("O1.1 el cuerpo del artefacto rotula «Áreas de intervención (»", () => {
    expect(card).toContain("Áreas de intervención ({areas.length})");
  });

  it("O1.2 el cuerpo del artefacto YA NO usa «Cuestiones para contraste»", () => {
    expect(card).not.toContain("Cuestiones para contraste");
  });

  it("O1.3 «Cuestiones para contraste» sobrevive SOLO como etiqueta del KPI de la vista viva", () => {
    const full = readFileSync(
      resolve(_dir, "../src/ui/components/LocalHealthProfileView.tsx"),
      "utf8"
    );
    // Debe seguir existiendo en el archivo (el KPI vivo), pero no dentro de la card.
    expect(full).toContain("Cuestiones para contraste");
  });
});

describe("Lote C-1 · O3 — concordancia singular/plural del fallback OIT", () => {
  function storeConActivos(n: number) {
    let store = createEvidenceStore("test-muni");
    for (let i = 0; i < n; i++) {
      store = addEvidenceAtom(
        store,
        createEvidenceAtom({
          id: `asset-${i + 1}`,
          municipalityId: "test-muni",
          kind: "asset",
          title: `Activo ${i + 1}`,
          content: `Activo comunitario ${i + 1}`,
          provenance: {
            origin: "localiza-salud",
            documentId: "doc-x",
            sourceLabel: "Localiza Salud",
            extractedAt: "2026-07-16T00:00:00.000Z",
          },
        })
      );
    }
    return store;
  }

  it("O3.1 un solo activo → «1 activo» (singular), sin «activo(s)»", () => {
    const oit = generateOIT(generateLT1(storeConActivos(1)));
    const fallback = oit.opportunities.find((o) => o.id === "oit-expand-evidence-base");
    expect(fallback).toBeDefined();
    expect(fallback!.rationale).toContain("ya incorpora 1 activo,");
    expect(fallback!.rationale).not.toContain("activo(s)");
    expect(fallback!.rationale).not.toContain("indicador(es)");
  });

  it("O3.2 varios activos → «3 activos» (plural)", () => {
    const oit = generateOIT(generateLT1(storeConActivos(3)));
    const fallback = oit.opportunities.find((o) => o.id === "oit-expand-evidence-base");
    expect(fallback!.rationale).toContain("ya incorpora 3 activos,");
  });
});
