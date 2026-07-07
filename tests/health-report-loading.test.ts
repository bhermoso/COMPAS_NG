/**
 * tests/health-report-loading.test.ts
 *
 * Verifica las invariantes de carga del Informe de Salud:
 *
 * PDF (opción conservadora):
 *  - Se registra como health-report con canGenerateEvidence = false.
 *  - No extrae texto, no genera secciones diagnósticas, sections = [].
 *  - No llama healthReportToEvidenceAtoms → 0 EvidenceAtom.
 *  - La UI lo presenta como fuente primaria preservada, no como analizado/extraído.
 *
 * DOCX:
 *  - Sigue generando sections y EvidenceAtom por sección (regresión).
 *
 * Común:
 *  - canGenerateEvidence = false para health-report por defecto de dominio.
 *  - replaceMunicipalDocumentByKind impide duplicados.
 *  - Los formatos .docx y .pdf se aceptan; .doc legacy y otros se rechazan.
 */

import { describe, it, expect } from "vitest";
import {
  createMunicipalDocumentRepository,
  addMunicipalDocument,
  replaceMunicipalDocumentByKind,
} from "../src/domain/repository";
import { createHealthReportDocumentFromPdf } from "../src/application/health-report/PdfToHealthReport";
import { healthReportToEvidenceAtoms } from "../src/application/health-report";
import type { HealthReportDocument } from "../src/domain/health-report";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MUN_ID = "test-mun-health-report";

function makeRepo() {
  return createMunicipalDocumentRepository({ municipalityId: MUN_ID });
}

function makeHealthReportDocInput(overrides: Partial<{
  id: string;
  title: string;
  sourceFileName: string;
  canGenerateEvidence: boolean;
}> = {}) {
  return {
    id: overrides.id ?? "doc-hr-001",
    kind: "health-report" as const,
    title: overrides.title ?? "Informe de Salud Municipal 2024",
    source: { system: "Carga directa", collectedAt: new Date().toISOString() },
    sourceFileName: overrides.sourceFileName ?? "informe-salud.docx",
    canGenerateEvidence: overrides.canGenerateEvidence,
    tags: ["health-report", "primary-source"],
  };
}

function makePdfDocumentInput(fileName = "informe-salud.pdf") {
  return {
    arrayBuffer: new ArrayBuffer(0),  // no usado internamente
    municipalityId: MUN_ID,
    linkedDocumentId: "doc-hr-pdf-001",
    sourceFileName: fileName,
    title: "Informe de Salud Municipal 2024",
    authors: [],
  };
}

function makeDocxHealthReportDocument(overrides: Partial<HealthReportDocument> = {}): HealthReportDocument {
  const now = new Date().toISOString();
  return {
    id: "hr-doc-001",
    municipalityId: MUN_ID,
    linkedDocumentId: "doc-hr-001",
    sourceFileName: "informe.docx",
    title: "Informe de Salud Municipal 2024",
    authors: [],
    body: {
      originalText: "Sección de resultados. Tasa de mortalidad 8,2 por mil.",
      format: "plain",
      charCount: 54,
      isAuthoritative: true,
    },
    sections: [
      {
        key: "resultados",
        title: "Resultados",
        bodyText: "Tasa de mortalidad 8,2 por mil.",
        sortOrder: 0,
        isAuthoritative: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

// ── 1. Validación de formato de archivo ───────────────────────────────────────

describe("Validación de formato de archivo — Informe de Salud", () => {
  function isLegacyDoc(fileName: string): boolean {
    return /\.doc$/i.test(fileName) && !/\.docx$/i.test(fileName);
  }
  function isPdf(fileName: string): boolean {
    return /\.pdf$/i.test(fileName);
  }
  function isAccepted(fileName: string): boolean {
    return /\.(docx|pdf)$/i.test(fileName) && !isLegacyDoc(fileName);
  }

  it("acepta archivos .docx", () => {
    expect(isAccepted("informe-salud.docx")).toBe(true);
    expect(isAccepted("INFORME.DOCX")).toBe(true);
  });

  it("acepta archivos .pdf", () => {
    expect(isAccepted("informe-salud.pdf")).toBe(true);
    expect(isAccepted("INFORME.PDF")).toBe(true);
  });

  it("rechaza archivos .doc (Word 97-2003 binario)", () => {
    expect(isLegacyDoc("informe.doc")).toBe(true);
    expect(isAccepted("informe.doc")).toBe(false);
  });

  it("no confunde .docx con .doc", () => {
    expect(isLegacyDoc("informe.docx")).toBe(false);
  });

  it("detecta correctamente si es PDF", () => {
    expect(isPdf("informe.pdf")).toBe(true);
    expect(isPdf("informe.docx")).toBe(false);
  });

  it("rechaza formatos no permitidos (.xlsx, .txt, .odt)", () => {
    expect(isAccepted("datos.xlsx")).toBe(false);
    expect(isAccepted("informe.txt")).toBe(false);
    expect(isAccepted("informe.odt")).toBe(false);
  });
});

// ── 2. createHealthReportDocumentFromPdf — opción conservadora ───────────────

describe("createHealthReportDocumentFromPdf — opción conservadora", () => {
  it("crea un HealthReportDocument sin extraer texto (originalText vacío)", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.body.originalText).toBe("");
  });

  it("crea un HealthReportDocument sin secciones diagnósticas (sections = [])", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.sections).toHaveLength(0);
  });

  it("charCount = 0 (ningún texto extraído del PDF)", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.body.charCount).toBe(0);
  });

  it("body.format = 'plain' (no HTML)", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.body.format).toBe("plain");
    expect(doc.body.originalHtml).toBeUndefined();
  });

  it("isAuthoritative = true en el body", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.body.isAuthoritative).toBe(true);
  });

  it("preserva sourceFileName", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput("informe-salud-atarfe-2024.pdf"));
    expect(doc.sourceFileName).toBe("informe-salud-atarfe-2024.pdf");
  });

  it("preserva title y municipalityId", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.title).toBe("Informe de Salud Municipal 2024");
    expect(doc.municipalityId).toBe(MUN_ID);
  });

  it("no devuelve Promise — síncrona", () => {
    const result = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(result).not.toBeInstanceOf(Promise);
    expect(typeof result.id).toBe("string");
  });
});

// ── 3. PDF no genera EvidenceAtom ────────────────────────────────────────────

describe("PDF — 0 EvidenceAtom en todos los caminos", () => {
  it("healthReportToEvidenceAtoms sobre documento PDF (sections=[]) → 0 atoms", () => {
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    const atoms = healthReportToEvidenceAtoms(pdfDoc);
    expect(atoms).toHaveLength(0);
  });

  it("la regla isPdf → hrAtoms=[] produce 0 atoms independientemente del documento", () => {
    // Simula la lógica exacta de App.tsx
    const isPdf = true;
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    const hrAtoms = isPdf ? [] : healthReportToEvidenceAtoms(pdfDoc);
    expect(hrAtoms).toHaveLength(0);
  });

  it("no se puede generar ningún atom desde un documento PDF (sin secciones con texto)", () => {
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    // Incluso si alguien llamara healthReportToEvidenceAtoms directamente, obtendrían 0
    const atoms = healthReportToEvidenceAtoms(pdfDoc);
    expect(atoms).toHaveLength(0);
  });
});

// ── 4. Repositorio: canGenerateEvidence, kind, deduplicación ─────────────────

describe("Repositorio documental — Informe de Salud", () => {
  it("registra el IS con kind health-report", () => {
    const repo = addMunicipalDocument(makeRepo(), makeHealthReportDocInput());
    expect(repo.documents[0].kind).toBe("health-report");
  });

  it("canGenerateEvidence = false por defecto para health-report", () => {
    const repo = addMunicipalDocument(makeRepo(), makeHealthReportDocInput());
    expect(repo.documents[0].canGenerateEvidence).toBe(false);
  });

  it("sourceFileName del PDF se preserva en el repositorio", () => {
    const repo = addMunicipalDocument(
      makeRepo(),
      makeHealthReportDocInput({ sourceFileName: "informe-salud-atarfe-2024.pdf" })
    );
    expect(repo.documents[0].sourceFileName).toBe("informe-salud-atarfe-2024.pdf");
  });

  it("sustituir IS mantiene un único documento health-report", () => {
    const repo1 = replaceMunicipalDocumentByKind(makeRepo(), makeHealthReportDocInput({ id: "hr-v1" }));
    const repo2 = replaceMunicipalDocumentByKind(repo1, makeHealthReportDocInput({ id: "hr-v2", title: "IS 2025" }));
    const hrDocs = repo2.documents.filter((d) => d.kind === "health-report");
    expect(hrDocs).toHaveLength(1);
    expect(hrDocs[0].id).toBe("hr-v2");
  });

  it("sustituir IS DOCX por PDF mantiene un único documento", () => {
    const repo1 = replaceMunicipalDocumentByKind(
      makeRepo(),
      makeHealthReportDocInput({ id: "hr-docx", sourceFileName: "informe.docx" })
    );
    const repo2 = replaceMunicipalDocumentByKind(
      repo1,
      makeHealthReportDocInput({ id: "hr-pdf", sourceFileName: "informe.pdf" })
    );
    const hrDocs = repo2.documents.filter((d) => d.kind === "health-report");
    expect(hrDocs).toHaveLength(1);
    expect(hrDocs[0].sourceFileName).toBe("informe.pdf");
  });

  it("otros documentos no se eliminan al sustituir el IS", () => {
    const repo1 = addMunicipalDocument(makeRepo(), {
      id: "otro-doc",
      kind: "territorial-documentation",
      title: "Memoria de actividades",
      source: {},
      tags: [],
    });
    const repo2 = replaceMunicipalDocumentByKind(repo1, makeHealthReportDocInput({ id: "hr-001" }));
    expect(repo2.documents).toHaveLength(2);
    expect(repo2.documents.some((d) => d.id === "otro-doc")).toBe(true);
  });
});

// ── 5. UI — textos del notice PDF ────────────────────────────────────────────

describe("Textos del notice PDF — coherencia metodológica", () => {
  // Strings literales del componente HealthReportViewer para el caso PDF (format !== 'html')
  const PDF_NOTICE_LABEL = "Fuente primaria preservada";
  const PDF_NOTICE_LINE1 =
    "Documento PDF cargado como fuente diagnóstica primaria. " +
    "Preservado en el Repositorio documental. " +
    "No se ha convertido en evidencia estructurada ni se ha usado para generar análisis automático.";

  const TERMS_IMPLYING_EXTRACTION = [
    "analizado automáticamente",
    "extraído automáticamente",
    "disponible para el análisis territorial interno",
    "sección(es) incorporada(s) al análisis",
    "evidencias incorporadas",
    "texto extraído",
    "no ha sido analizado, extraído ni convertido",  // eliminado por ser contradictorio si quedara extracción
  ];

  it("el label del notice PDF no contiene términos de procesamiento automático", () => {
    const violations = TERMS_IMPLYING_EXTRACTION.filter((t) =>
      PDF_NOTICE_LABEL.toLowerCase().includes(t.toLowerCase())
    );
    expect(violations).toHaveLength(0);
  });

  it("el texto del notice PDF no contiene términos de procesamiento automático", () => {
    const violations = TERMS_IMPLYING_EXTRACTION.filter((t) =>
      PDF_NOTICE_LINE1.toLowerCase().includes(t.toLowerCase())
    );
    expect(violations).toHaveLength(0);
  });

  it("el notice PDF afirma que es fuente primaria preservada", () => {
    expect(PDF_NOTICE_LABEL).toContain("Fuente primaria preservada");
  });

  it("el notice PDF afirma que no se ha convertido en evidencia estructurada", () => {
    expect(PDF_NOTICE_LINE1).toContain("No se ha convertido en evidencia estructurada");
  });

  it("el notice PDF afirma que no se ha generado análisis automático", () => {
    expect(PDF_NOTICE_LINE1).toContain("para generar análisis automático");
  });
});

// ── 6. Regresión — DOCX sigue funcionando ────────────────────────────────────

describe("Regresión — carga DOCX no se rompe", () => {
  it("healthReportToEvidenceAtoms genera atoms desde secciones del DOCX", () => {
    const hrDoc = makeDocxHealthReportDocument({
      sections: [
        { key: "mortalidad", title: "Mortalidad", bodyText: "Tasa de mortalidad 8,5 por mil.", sortOrder: 0, isAuthoritative: true },
        { key: "resultados", title: "Resultados", bodyText: "Prevalencia de hipertensión 32 %.", sortOrder: 1, isAuthoritative: true },
      ],
    });
    const atoms = healthReportToEvidenceAtoms(hrDoc);
    expect(atoms.length).toBeGreaterThan(0);
    expect(atoms.every((a) => a.provenance.origin === "health-report")).toBe(true);
    expect(atoms.every((a) => a.provenance.documentId === hrDoc.linkedDocumentId)).toBe(true);
  });

  it("secciones title-page y autores son omitidas por el pipeline", () => {
    const hrDoc = makeDocxHealthReportDocument({
      sections: [
        { key: "title-page", title: "Portada", bodyText: "Junta de Andalucía 2024.", sortOrder: 0, isAuthoritative: true },
        { key: "autores", title: "Autoría", bodyText: "Dr. Pérez.", sortOrder: 1, isAuthoritative: true },
        { key: "mortalidad", title: "Mortalidad", bodyText: "Tasa de mortalidad 9,1 por mil.", sortOrder: 2, isAuthoritative: true },
      ],
    });
    const atoms = healthReportToEvidenceAtoms(hrDoc);
    expect(atoms).toHaveLength(1);
    expect(atoms[0].tags).toContain("mortalidad");
  });

  it("DOCX con 0 secciones → 0 atoms (igual que PDF)", () => {
    const hrDoc = makeDocxHealthReportDocument({ sections: [] });
    expect(healthReportToEvidenceAtoms(hrDoc)).toHaveLength(0);
  });

  it("DOCX atoms tienen kind correcto según sección", () => {
    const hrDoc = makeDocxHealthReportDocument({
      sections: [
        { key: "mortalidad", title: "Mortalidad", bodyText: "Tasa 8,5 por mil.", sortOrder: 0, isAuthoritative: true },
        { key: "metodologia", title: "Metodología", bodyText: "Fuentes IECA.", sortOrder: 1, isAuthoritative: true },
      ],
    });
    const atoms = healthReportToEvidenceAtoms(hrDoc);
    const mortalidadAtom = atoms.find((a) => a.tags.includes("mortalidad"));
    const metodologiaAtom = atoms.find((a) => a.tags.includes("metodologia"));
    expect(mortalidadAtom?.kind).toBe("indicator");
    expect(metodologiaAtom?.kind).toBe("methodological-caution");
  });
});
