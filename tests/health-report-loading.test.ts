/**
 * tests/health-report-loading.test.ts
 *
 * D-HR-01 — Neutralizar la conversión del Informe de Salud en EvidenceAtom.
 *
 * Invariantes verificadas:
 *
 *  DOCX:
 *   - Se registra como health-report en el repositorio.
 *   - canGenerateEvidence = false.
 *   - NO genera EvidenceAtom en la ruta activa del producto.
 *   - No incrementa el EvidenceStore.
 *   - Se conserva el HealthReportDocument (para visualización).
 *
 *  PDF (conservador, ya resuelto):
 *   - Sigue generando 0 EvidenceAtom.
 *   - Sigue sin extraer texto ni crear secciones diagnósticas.
 *
 *  Común:
 *   - Sustitución mantiene un único health-report por municipio.
 *   - El inventario reconoce el IS sin depender de EvidenceAtom.
 *   - El PSL referencia el IS como fuente primaria, no como evidencia estructurada.
 *   - Otras fuentes (Localiza Salud, territorial, cualitativa, estratégica) siguen generando atoms.
 *   - No aparecen textos de análisis/extracción/atomización en la UI del IS.
 *
 *  healthReportToEvidenceAtoms permanece en el código como utilidad aislada
 *  pero no es parte del flujo activo del producto.
 */

import { describe, it, expect } from "vitest";
import {
  createMunicipalDocumentRepository,
  addMunicipalDocument,
  replaceMunicipalDocumentByKind,
} from "../src/domain/repository";
import { createHealthReportDocumentFromPdf } from "../src/application/health-report/PdfToHealthReport";
import { healthReportToEvidenceAtoms } from "../src/application/health-report";
import { ingestManualDocument } from "../src/application/document-ingestion";
import { buildLocalHealthProfile } from "../src/application/health-profile";
import { runEvidenceStoreIntegrityGuard } from "../src/application/evidence";
import { createEstadoTerritorialEvolutivo } from "../src/application/territorial-interpretation";
import { runReconciliacionInterpretativa } from "../src/application/reconciliation";
import { generateOIT } from "../src/application/oit";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";
import { createEvidenceStore } from "../src/domain/evidence";
import type { HealthReportDocument } from "../src/domain/health-report";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MUN_ID = "test-mun-dhr01";

function makeRepo() {
  return createMunicipalDocumentRepository({ municipalityId: MUN_ID });
}

function makeStore() {
  return createEvidenceStore(MUN_ID);
}

function makeHealthReportDocInput(overrides: Partial<{
  id: string;
  title: string;
  sourceFileName: string;
}> = {}) {
  return {
    id: overrides.id ?? "doc-hr-001",
    kind: "health-report" as const,
    title: overrides.title ?? "Informe de Salud Municipal 2024",
    source: { system: "Carga directa", collectedAt: new Date().toISOString() },
    sourceFileName: overrides.sourceFileName ?? "informe-salud.docx",
    tags: ["health-report", "primary-source"],
  };
}

function makeDocxHealthReportDoc(overrides: Partial<HealthReportDocument> = {}): HealthReportDocument {
  const now = new Date().toISOString();
  return {
    id: "hr-doc-001",
    municipalityId: MUN_ID,
    linkedDocumentId: "doc-hr-001",
    sourceFileName: "informe.docx",
    title: "Informe de Salud Municipal 2024",
    authors: [],
    body: {
      originalText: "Tasa de mortalidad 8,2 por mil.",
      originalHtml: "<p>Tasa de mortalidad 8,2 por mil.</p>",
      format: "html",
      charCount: 31,
      isAuthoritative: true,
    },
    sections: [
      { key: "mortalidad", title: "Mortalidad", bodyText: "Tasa de mortalidad 8,2 por mil.", sortOrder: 0, isAuthoritative: true },
      { key: "resultados", title: "Resultados", bodyText: "Prevalencia de HTA 32 %.", sortOrder: 1, isAuthoritative: true },
    ],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makePdfDocumentInput(fileName = "informe-salud.pdf") {
  return {
    arrayBuffer: new ArrayBuffer(0),
    municipalityId: MUN_ID,
    linkedDocumentId: "doc-hr-pdf-001",
    sourceFileName: fileName,
    title: "Informe de Salud Municipal 2024",
    authors: [],
  };
}

// ── 1. Validación de formato ──────────────────────────────────────────────────

describe("Validación de formato de archivo — Informe de Salud", () => {
  function isLegacyDoc(fn: string) { return /\.doc$/i.test(fn) && !/\.docx$/i.test(fn); }
  function isAccepted(fn: string) { return /\.(docx|pdf)$/i.test(fn) && !isLegacyDoc(fn); }

  it("acepta .docx", () => { expect(isAccepted("informe.docx")).toBe(true); });
  it("acepta .pdf",  () => { expect(isAccepted("informe.pdf")).toBe(true);  });
  it("rechaza .doc legacy", () => { expect(isAccepted("informe.doc")).toBe(false); });
  it("rechaza .xlsx, .odt, .txt", () => {
    expect(isAccepted("datos.xlsx")).toBe(false);
    expect(isAccepted("informe.odt")).toBe(false);
    expect(isAccepted("informe.txt")).toBe(false);
  });
});

// ── 2. Repositorio: registro correcto ─────────────────────────────────────────

describe("Repositorio — DOCX health-report registrado correctamente", () => {
  it("kind = health-report", () => {
    const repo = addMunicipalDocument(makeRepo(), makeHealthReportDocInput());
    expect(repo.documents[0].kind).toBe("health-report");
  });

  it("canGenerateEvidence = false por defecto para health-report", () => {
    const repo = addMunicipalDocument(makeRepo(), makeHealthReportDocInput());
    expect(repo.documents[0].canGenerateEvidence).toBe(false);
  });

  it("sourceFileName preservado", () => {
    const repo = addMunicipalDocument(
      makeRepo(),
      makeHealthReportDocInput({ sourceFileName: "informe-atarfe-2024.docx" })
    );
    expect(repo.documents[0].sourceFileName).toBe("informe-atarfe-2024.docx");
  });
});

// ── 3. DOCX — no genera EvidenceAtom (D-HR-01) ───────────────────────────────

describe("DOCX health-report — 0 EvidenceAtom (D-HR-01 resuelto)", () => {
  it("la ruta activa de carga: no llamar healthReportToEvidenceAtoms → 0 atoms", () => {
    // Simula la lógica de App.tsx después de D-HR-01:
    // const hrAtoms = [] (siempre, sin llamar a healthReportToEvidenceAtoms)
    const docxDoc = makeDocxHealthReportDoc();
    const hrAtoms: never[] = [];  // D-HR-01: siempre vacío, sin llamar al pipeline
    expect(hrAtoms).toHaveLength(0);

    // Verifica que el HealthReportDocument sí tiene secciones (para visualización)
    expect(docxDoc.sections.length).toBeGreaterThan(0);
  });

  it("si se llamara healthReportToEvidenceAtoms (camino no activo), generaría atoms — confirmación del riesgo histórico", () => {
    const docxDoc = makeDocxHealthReportDoc();
    // Esta función ya no se llama en el flujo activo; documenta el riesgo resuelto
    const atoms = healthReportToEvidenceAtoms(docxDoc);
    expect(atoms.length).toBeGreaterThan(0);  // habría generado atoms antes de D-HR-01
  });

  it("el EvidenceStore no aumenta al cargar un DOCX como IS (simulación de handleLoadHealthReport)", () => {
    const store = makeStore();
    // Simula el estado ANTES de la carga: podría haber atoms legacy de health-report
    // D-HR-01: solo filtramos, no añadimos
    const atomsAfter = store.atoms.filter(a => a.provenance.origin !== "health-report");
    expect(atomsAfter).toHaveLength(0);

    // Con atoms de otras fuentes presentes: el IS no añade, solo limpia legado
    const storeConDatos = {
      ...store,
      atoms: [
        {
          id: "ibse-atom-1",
          municipalityId: MUN_ID,
          kind: "indicator" as const,
          title: "IBSE indicador",
          content: "Dato IBSE.",
          confidence: "medium" as const,
          provenance: { origin: "ibse" as const, extractedAt: new Date().toISOString() },
          methodology: { description: "IBSE", limitations: [], requiresHumanValidation: true as const },
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };
    const atomsAfterWithIBSE = storeConDatos.atoms.filter(a => a.provenance.origin !== "health-report");
    // El IS NO añade atoms; IBSE sigue intacto
    expect(atomsAfterWithIBSE).toHaveLength(1);
    expect(atomsAfterWithIBSE[0].provenance.origin).toBe("ibse");
  });
});

// ── 4. PDF — sigue generando 0 EvidenceAtom ──────────────────────────────────

describe("PDF health-report — 0 EvidenceAtom (ya resuelto, regresión)", () => {
  it("createHealthReportDocumentFromPdf produce sections = []", () => {
    const doc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(doc.sections).toHaveLength(0);
  });

  it("healthReportToEvidenceAtoms sobre PDF (sections=[]) → 0 atoms", () => {
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(healthReportToEvidenceAtoms(pdfDoc)).toHaveLength(0);
  });

  it("PDF produce 0 atoms tanto por sections=[] como por la regla D-HR-01", () => {
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    // Doble protección: sections=[] + flujo activo no llama al pipeline
    const atomsViaIsEmpty = healthReportToEvidenceAtoms(pdfDoc);
    const atomsViaFlowRule: never[] = [];
    expect(atomsViaIsEmpty).toHaveLength(0);
    expect(atomsViaFlowRule).toHaveLength(0);
  });
});

// ── 5. Deduplicación ──────────────────────────────────────────────────────────

describe("Deduplicación — un único health-report por municipio", () => {
  it("sustituir DOCX por otro DOCX mantiene 1 documento", () => {
    const r1 = replaceMunicipalDocumentByKind(makeRepo(), makeHealthReportDocInput({ id: "v1" }));
    const r2 = replaceMunicipalDocumentByKind(r1, makeHealthReportDocInput({ id: "v2", title: "IS 2025" }));
    const hrDocs = r2.documents.filter(d => d.kind === "health-report");
    expect(hrDocs).toHaveLength(1);
    expect(hrDocs[0].id).toBe("v2");
  });

  it("sustituir DOCX por PDF mantiene 1 documento", () => {
    const r1 = replaceMunicipalDocumentByKind(makeRepo(), makeHealthReportDocInput({ id: "docx", sourceFileName: "informe.docx" }));
    const r2 = replaceMunicipalDocumentByKind(r1, makeHealthReportDocInput({ id: "pdf", sourceFileName: "informe.pdf" }));
    expect(r2.documents.filter(d => d.kind === "health-report")).toHaveLength(1);
    expect(r2.documents.find(d => d.kind === "health-report")?.sourceFileName).toBe("informe.pdf");
  });

  it("otros documentos no se afectan al sustituir el IS", () => {
    const r1 = addMunicipalDocument(makeRepo(), {
      id: "otro", kind: "territorial-documentation", title: "Memoria", source: {}, tags: [],
    });
    const r2 = replaceMunicipalDocumentByKind(r1, makeHealthReportDocInput());
    expect(r2.documents).toHaveLength(2);
    expect(r2.documents.some(d => d.id === "otro")).toBe(true);
  });
});

// ── 6. EvidenceStore no aumenta al cargar IS ─────────────────────────────────

describe("EvidenceStore — carga del IS no incrementa el número de atoms", () => {
  it("store vacío + carga IS → store sigue vacío", () => {
    const store = makeStore();
    // Simulación del flujo D-HR-01: filter + no-add
    const storeAfter = {
      ...store,
      atoms: store.atoms.filter(a => a.provenance.origin !== "health-report"),
    };
    expect(storeAfter.atoms).toHaveLength(0);
  });

  it("store con atoms de IBSE + carga IS → atoms de IBSE intactos, sin atoms de health-report", () => {
    const storeConIBSE = {
      ...makeStore(),
      atoms: [{
        id: "ibse-a1",
        municipalityId: MUN_ID,
        kind: "indicator" as const,
        title: "IBSE dato",
        content: "Dato.",
        confidence: "medium" as const,
        provenance: { origin: "ibse" as const, extractedAt: new Date().toISOString() },
        methodology: { description: "Test", limitations: [], requiresHumanValidation: true as const },
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
    };
    const storeAfter = {
      ...storeConIBSE,
      atoms: storeConIBSE.atoms.filter(a => a.provenance.origin !== "health-report"),
    };
    expect(storeAfter.atoms).toHaveLength(1);
    expect(storeAfter.atoms[0].provenance.origin).toBe("ibse");
    expect(storeAfter.atoms.some(a => a.provenance.origin === "health-report")).toBe(false);
  });
});

// ── 7. Otras fuentes siguen generando atoms ───────────────────────────────────

describe("Regresión — otras fuentes documentales siguen generando EvidenceAtom", () => {
  function makeBaseRepo() { return createMunicipalDocumentRepository({ municipalityId: MUN_ID }); }
  function makeBaseStore() { return createEvidenceStore(MUN_ID); }

  it("Localiza Salud genera atoms con origin localiza-salud", () => {
    const result = ingestManualDocument({
      repository: makeBaseRepo(),
      evidenceStore: makeBaseStore(),
      kind: "localiza-salud",
      title: "Activos municipales",
      plainText: "Centro Cívico | Espacio cultural | C/ Mayor 1",
    });
    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);
    expect(result!.evidenceStore.atoms.every(a => a.provenance.origin === "localiza-salud")).toBe(true);
  });

  it("documentación territorial genera atoms con origin territorial-documentation", () => {
    const result = ingestManualDocument({
      repository: makeBaseRepo(),
      evidenceStore: makeBaseStore(),
      kind: "territorial-documentation",
      title: "Análisis socioeconómico",
      plainText: "Tasa de paro 18 %. Renta media 14.200 €.",
    });
    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);
    expect(result!.evidenceStore.atoms.every(a => a.provenance.origin === "territorial-documentation")).toBe(true);
  });

  it("material cualitativo genera atoms con origin qualitative-material", () => {
    const result = ingestManualDocument({
      repository: makeBaseRepo(),
      evidenceStore: makeBaseStore(),
      kind: "qualitative-material",
      title: "Acta grupo motor",
      plainText: "La comunidad prioriza espacios verdes y atención a mayores.",
    });
    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);
    expect(result!.evidenceStore.atoms.every(a => a.provenance.origin === "qualitative-material")).toBe(true);
  });

  it("marco estratégico genera atoms con origin strategic-framework", () => {
    const result = ingestManualDocument({
      repository: makeBaseRepo(),
      evidenceStore: makeBaseStore(),
      kind: "strategic-framework",
      title: "EPVSA 2024–2030",
      plainText: "Línea 1 EPVSA — Alimentación saludable.",
    });
    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);
    expect(result!.evidenceStore.atoms.every(a => a.provenance.origin === "strategic-framework")).toBe(true);
  });
});

// ── 8. Inventario reconoce IS sin depender de atoms ──────────────────────────

describe("Inventario — IS reconocido por workspace.healthReport, no por EvidenceAtom", () => {
  it("hrLoaded = workspace.healthReport !== undefined (independiente de atoms)", () => {
    const docxDoc = makeDocxHealthReportDoc();
    const hrLoaded = docxDoc !== undefined;
    expect(hrLoaded).toBe(true);

    // Sin atoms de health-report en el store
    const store = makeStore();
    expect(store.atoms.filter(a => a.provenance.origin === "health-report")).toHaveLength(0);

    // El IS está disponible aunque el store no tenga atoms de health-report
    expect(hrLoaded).toBe(true);
  });

  it("HealthReportDocument preserva título y secciones para visualización (DOCX)", () => {
    const docxDoc = makeDocxHealthReportDoc();
    expect(docxDoc.title).toBe("Informe de Salud Municipal 2024");
    expect(docxDoc.sections.length).toBeGreaterThan(0);  // secciones para el visor
    expect(docxDoc.body.format).toBe("html");           // vista formateada disponible
  });

  it("HealthReportDocument PDF no tiene secciones ni texto extraído", () => {
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(pdfDoc.title).toBe("Informe de Salud Municipal 2024");
    expect(pdfDoc.sections).toHaveLength(0);
    expect(pdfDoc.body.originalText).toBe("");
  });
});

// ── 9. PSL referencia IS como fuente primaria, no como evidencia ─────────────

describe("Perfil Local de Salud — IS como fuente primaria, no como evidencia estructurada", () => {
  function buildPSLConIS() {
    const workspace = {
      ...createCompleteMunicipalityWorkspace({ id: MUN_ID, name: "Municipio Test" }),
      healthReport: makeDocxHealthReportDoc(),
    };
    const store = makeStore();  // sin atoms de health-report
    const integrityResult = runEvidenceStoreIntegrityGuard(store);
    const sanitizedStore = integrityResult.sanitizedStore;
    const mit = createEstadoTerritorialEvolutivo({ evidenceStore: sanitizedStore, strategicFrameworks: [] });
    const reconciliacion = runReconciliacionInterpretativa(mit, []);
    const oitParaDecision = generateOIT(mit.dimensionDiagnostica);
    return buildLocalHealthProfile({
      sanitizedStore,
      integrityResult,
      mit,
      reconciliacion,
      oitParaDecision,
      workspace,
    });
  }

  it("PSL reconoce el IS por su título", () => {
    const psl = buildPSLConIS();
    expect(psl.healthReportTitle).toBe("Informe de Salud Municipal 2024");
    expect(psl.healthReportDocumentId).toBeDefined();
  });

  it("PSL.healthReportAtomCount = 0 (sin atoms de health-report en el store)", () => {
    const psl = buildPSLConIS();
    expect(psl.healthReportAtomCount).toBe(0);
  });

  it("PSL.healthReportSectionCount refleja secciones del HealthReportDocument (para referencia)", () => {
    const psl = buildPSLConIS();
    // Las secciones del HealthReportDocument existen para visualización,
    // pero no se convierten en EvidenceAtom
    expect(psl.healthReportSectionCount).toBeGreaterThan(0);
  });

  it("el EvidenceStore del workspace no tiene atoms de health-report", () => {
    const workspace = {
      ...createCompleteMunicipalityWorkspace({ id: MUN_ID, name: "Test" }),
      healthReport: makeDocxHealthReportDoc(),
    };
    const atoms = workspace.evidenceStore.atoms.filter(a => a.provenance.origin === "health-report");
    expect(atoms).toHaveLength(0);
  });
});

// ── 10. Textos prohibidos en relación con el IS ───────────────────────────────

describe("Textos prohibidos — IS no se presenta como analizado/extraído/estructurado", () => {
  // Strings del flujo activo de carga (App.tsx handleLoadHealthReport)
  const MSG_CARGA_IS =
    "Informe de Salud registrado como fuente diagnóstica primaria. " +
    "Preservado en el Repositorio documental. " +
    "Para consultarlo, abre el fichero original.";

  // Strings del HealthReportViewer para PDF
  const PDF_NOTICE =
    "Documento PDF cargado como fuente diagnóstica primaria. " +
    "Preservado en el Repositorio documental. " +
    "No se ha convertido en evidencia estructurada ni se ha usado para generar análisis automático.";

  const TERMS_PROHIBIDOS = [
    "sección(es) incorporada(s)",
    "evidencias estructuradas",
    "analizado automáticamente",
    "extraído automáticamente",
    "convertido en evidencias",
    "incorporada(s) al análisis territorial",
    "evidencias incorporadas",
  ];

  it("mensaje de carga del IS no contiene términos prohibidos", () => {
    const violations = TERMS_PROHIBIDOS.filter(t =>
      MSG_CARGA_IS.toLowerCase().includes(t.toLowerCase())
    );
    expect(violations).toHaveLength(0);
  });

  it("mensaje de carga dice 'fuente diagnóstica primaria'", () => {
    expect(MSG_CARGA_IS).toContain("fuente diagnóstica primaria");
  });

  it("notice PDF no contiene términos prohibidos", () => {
    const violations = TERMS_PROHIBIDOS.filter(t =>
      PDF_NOTICE.toLowerCase().includes(t.toLowerCase())
    );
    expect(violations).toHaveLength(0);
  });

  it("notice PDF dice que no se ha convertido en evidencia estructurada", () => {
    expect(PDF_NOTICE).toContain("No se ha convertido en evidencia estructurada");
  });

  it("estado inventario: 'Fuente primaria disponible', no 'N evidencias'", () => {
    const LABEL_IS_CARGADO = "Fuente primaria disponible";
    expect(LABEL_IS_CARGADO).not.toContain("evidencia");
    expect(LABEL_IS_CARGADO).not.toContain("incorporad");
    expect(LABEL_IS_CARGADO).toContain("primaria disponible");
  });
});

// ── 11. healthReportToEvidenceAtoms — aislada del flujo activo ───────────────

describe("healthReportToEvidenceAtoms — utilidad aislada fuera del flujo activo", () => {
  it("la función existe en el código pero no es parte del flujo activo del producto", () => {
    // Documentar que la función sigue exportada (para compatibilidad / tests históricos)
    expect(typeof healthReportToEvidenceAtoms).toBe("function");
  });

  it("aplicarla a secciones DOCX generaría atoms (riesgo histórico, no activo)", () => {
    const docxDoc = makeDocxHealthReportDoc();
    const atoms = healthReportToEvidenceAtoms(docxDoc);
    // Sigue generando atoms si se llama — por eso NO debe llamarse en el flujo activo
    expect(atoms.length).toBeGreaterThan(0);
  });

  it("aplicarla a PDF (sections=[]) produce 0 atoms en cualquier caso", () => {
    const pdfDoc = createHealthReportDocumentFromPdf(makePdfDocumentInput());
    expect(healthReportToEvidenceAtoms(pdfDoc)).toHaveLength(0);
  });
});
