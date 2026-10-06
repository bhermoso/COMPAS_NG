import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { CanonicalProfileDocument } from "../src/application/health-profile/canonicalProfileDocument";
import {
  exportNHSDerivedPdfToBuffer,
  nhsDerivedPdfFileName,
} from "../src/application/health-profile/nhsDerivedPdf";

function alfacarCanonicalDocument(): CanonicalProfileDocument {
  const seedPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../public/seeds/compas-ng-workspace-alfacar.json"
  );
  const workspace = JSON.parse(readFileSync(seedPath, "utf8"));
  const artifact = workspace.compiledProfiles[workspace.compiledProfiles.length - 1];
  return JSON.parse(artifact.canonicalDocument.payload) as CanonicalProfileDocument;
}

describe("Perfil LHP derivado · export PDF", () => {
  it("genera un PDF válido para Alfacar aunque no haya trazador cuantitativo", () => {
    const document = alfacarCanonicalDocument();
    const pdf = exportNHSDerivedPdfToBuffer(document);
    const signature = String.fromCharCode(...pdf.slice(0, 4));

    expect(signature).toBe("%PDF");
    expect(pdf.length).toBeGreaterThan(5000);
    expect(nhsDerivedPdfFileName(document)).toBe("perfil-lhp-alfacar.pdf");
  });

  it("mantiene una salida PDF digna cuando no hay sello canónico", () => {
    const pdf = exportNHSDerivedPdfToBuffer(null);
    const signature = String.fromCharCode(...pdf.slice(0, 4));

    expect(signature).toBe("%PDF");
    expect(nhsDerivedPdfFileName(null)).toBe("perfil-lhp.pdf");
  });
});
