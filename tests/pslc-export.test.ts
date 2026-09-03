import { describe, it, expect } from "vitest";
import { exportPSLCToDocx, exportPSLCToPdf } from "../src/application/export/pslc-export";
import type { LocalHealthProfileArtifact } from "../src/domain/health-profile-artifact/LocalHealthProfileArtifact";

// Sample PSL-C artifact for testing
const samplePSLC: LocalHealthProfileArtifact = {
  id: "pslc-1",
  municipalityId: "mun-1",
  artifactVersion: "PSL-C/v1",
  compiledAt: new Date().toISOString(),
  compiledBy: "test-user",

  sourcePSLId: "psl-1",
  sourcePSLVersion: "PSL/v1",
  sourcePSLEvidenceStoreVersion: "ES/v1",
  sourceHash: "abc123def456ghi789jkl",
  evidenceAtomIds: ["atom-1", "atom-2", "atom-3"],

  portada: {
    municipalityName: "Granada",
    municipalityProvince: "Granada",
    compiledAt: new Date().toISOString(),
    artifactVersion: "PSL-C/v1",
  },

  identificacionMunicipal: {
    municipalityId: "mun-1",
    municipalityName: "Granada",
    municipalityProvince: "Granada",
    pslGeneratedAt: new Date().toISOString(),
    pslValidatedAt: new Date().toISOString(),
    pslValidatedBy: "Dr. Juan García",
  },

  marcoEstrategico: {
    sectionIds: ["sec-1", "sec-2"],
  },

  informeSalud: {
    documentId: "doc-1",
    title: "Informe de Salud 2024",
    sectionCount: 6,
    atomCount: 15,
  },

  baseDocumental: {
    totalEvidenceAtoms: 42,
    integrityErrors: 0,
    integrityWarnings: 2,
    atomsByOrigin: {
      "health-report": 10,
      "complementary-study": 8,
      eas: 15,
      cmi: 9,
    },
    atomsByKind: {
      indicator: 20,
      determinant: 12,
      asset: 8,
      participation: 2,
    },
    originsSummary: [
      "health-report",
      "complementary-study",
      "eas",
      "cmi",
    ],
    complementaryStudyCount: 3,
    ibsePresent: true,
    dukePresent: true,
    predimedPresent: false,
    sf12Present: true,
    suenoPresent: true,
    cagePresent: false,
    thematicPrioritisationPresent: true,
  },

  lecturaTerritorial: {
    territorialSummary:
      "Granada presentó en 2024 un perfil de salud marcado por envejecimiento poblacional y aumento de enfermedades crónicas.",
    determinantCount: 12,
    assetCount: 8,
    indicatorCount: 20,
    qualitativeFindingCount: 5,
    methodologicalCautionCount: 3,
    preliminaryOpportunities: [
      "Fortalecer atención primaria",
      "Mejorar coordinación interinstitucional",
    ],
    longitudinalActive: true,
    longitudinalNote: "Seguimiento desde 2022",
    longitudinalEvidenceCount: 6,
    marcosAplicados: [
      { framework: "RELAS", elementCount: 5 },
      { framework: "ODS", elementCount: 8 },
    ],
    tensionesEstructurales: [
      "Recursos limitados",
      "Fragmentación sectorial",
    ],
    tensionesEscaladasCount: 2,
    tensionesNoEscaladasCount: 3,
    ruidoEstructuralCount: 1,
    conflictosCount: 0,
    areasDeIntervencion: [
      {
        title: "Enfermedades Crónicas",
        rationale: "Mayor prevalencia y morbimortalidad",
        cautions: ["Requiere validación con expertos", "Datos de 2023"],
      },
      {
        title: "Salud Mental",
        rationale: "Incremento de trastornos emocionales",
        cautions: ["Limitación muestral"],
      },
    ],
  },

  conclusiones: {
    content:
      "El perfil de salud de Granada requiere intervenciones coordinadas en atención crónica, salud mental y prevención de comportamientos de riesgo. La fragmentación del sistema limita la efectividad.",
  },

  cierreInterpretativo: {
    content:
      "La planificación local debe enfatizar la coordinación interinstitucional y el empoderamiento comunitario para la implementación sostenible.",
  },

  priorizacion: {
    candidaturasTecnicas: [
      {
        title: "Enfermedades Crónicas",
        rationale: "Mayor carga de enfermedad",
      },
    ],
    hasTechnicalCandidatures: true,
    tematicasSeleccionadasLabels: [
      "Enfermedades Crónicas",
      "Salud Mental",
    ],
    hasParticipatorySelection: true,
    deliberacionNota: "Consenso alcanzado en jornada de priorización",
    consensoDocumentado: true,
    priorizacionStatus: "complete",
  },

  notaValidacion: {
    pslValidatedAt: new Date().toISOString(),
    pslValidatedBy: "Dr. Juan García",
    compiledAt: new Date().toISOString(),
    compiledBy: "system-user",
    sourcePSLId: "psl-1",
    sourceHash: "abc123def456ghi789jkl",
  },

  cautelasMetodologicas: {
    integrityErrors: 0,
    integrityWarnings: 2,
    hasCautelas: true,
    nota: "Este perfil es una síntesis interpretativa de evidencia recopilada hasta la fecha de compilación. La calidad y completitud del análisis dependen de la disponibilidad y fiabilidad de fuentes. Se recomienda revisión anual.",
  },
};

describe("PSL-C Export — DOCX and PDF", () => {
  it("exports PSL-C to valid DOCX buffer", async () => {
    const buffer = await exportPSLCToDocx(samplePSLC);

    expect(buffer).toBeDefined();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(1000);

    // DOCX files start with PK (zip header)
    expect(buffer[0]).toBe(0x50); // 'P'
    expect(buffer[1]).toBe(0x4b); // 'K'
  });

  it("exports PSL-C to valid PDF buffer", () => {
    const buffer = exportPSLCToPdf(samplePSLC);

    expect(buffer).toBeDefined();
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(500);

    // PDF files start with %PDF
    expect(buffer.toString("ascii", 0, 4)).toBe("%PDF");
  });

  it("DOCX export is properly formed", async () => {
    const buffer = await exportPSLCToDocx(samplePSLC);

    // DOCX files are ZIP archives, verify structure
    const zipSignature = buffer.toString("ascii", 0, 2);
    expect(zipSignature).toBe("PK");
  });

  it("PDF export includes key metadata sections", () => {
    const buffer = exportPSLCToPdf(samplePSLC);
    const content = buffer.toString("utf-8", 0, Math.min(10000, buffer.length));

    // PDF is text-based, check for section headers
    expect(content).toContain("Identificaci");
    expect(content).toContain("Lectura Territorial");
  });

  it("handles empty areas de intervención gracefully", async () => {
    const emptyAreas = {
      ...samplePSLC,
      lecturaTerritorial: {
        ...samplePSLC.lecturaTerritorial,
        areasDeIntervencion: [],
      },
    };

    const docxBuffer = await exportPSLCToDocx(emptyAreas);
    const pdfBuffer = exportPSLCToPdf(emptyAreas);

    expect(docxBuffer.length).toBeGreaterThan(0);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it("PDF exporter includes hash reference in document", () => {
    const pdfBuffer = exportPSLCToPdf(samplePSLC);
    const content = pdfBuffer.toString("utf-8", 0, Math.min(50000, pdfBuffer.length));

    // Hash should be truncated in the PDF for security
    // Full 23-char hash should not appear
    expect(content).not.toContain("abc123def456ghi789jkl");
    
    // Document should contain the municipality and artifact info
    expect(content).toContain("Granada");
    expect(content).toContain("PSL-C");
  });
});
