import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

import { transformDocumentToEvidence } from "../src/application/evidence-pipeline/DocumentToEvidencePipeline";
import { createEvidenceStore } from "../src/domain/evidence/EvidenceStore";

describe("DocumentToEvidencePipeline - ingestion fixtures", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures", "ingestion");

  it("parses localiza-salud exports into asset evidence atoms", () => {
    const text = fs.readFileSync(path.join(fixturesDir, "localiza-salud.sample.txt"), "utf-8");

    const store = createEvidenceStore("mun-1");
    const document = {
      id: "localiza-1",
      municipalityId: "mun-1",
      kind: "localiza-salud",
      title: "Localiza Salud - muestra",
      status: "uploaded",
      source: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      canGenerateEvidence: true,
    } as any;

    const res = transformDocumentToEvidence({ store, document, plainText: text });

    expect(res.atomsCreated.length).toBeGreaterThan(0);
    res.atomsCreated.forEach((a) => expect(a.kind).toBe("asset"));
  });

  it("parses community-asset markdown into one atom per heading", () => {
    const text = fs.readFileSync(path.join(fixturesDir, "community-asset.sample.md"), "utf-8");

    const store = createEvidenceStore("mun-1");
    const document = {
      id: "community-1",
      municipalityId: "mun-1",
      kind: "community-asset",
      title: "Activos comunitarios - muestra",
      status: "uploaded",
      source: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      canGenerateEvidence: true,
    } as any;

    const res = transformDocumentToEvidence({ store, document, plainText: text });

    expect(res.atomsCreated.length).toBe(3);
    const titles = res.atomsCreated.map((a) => a.title.toLowerCase());
    expect(titles).toContain("biblioteca municipal");
    expect(titles).toContain("centro juvenil la plaza");
    expect(titles).toContain("huerto comunitario el prado");
  });
});
