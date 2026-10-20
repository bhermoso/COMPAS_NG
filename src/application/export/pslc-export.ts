import { Document, Packer, Paragraph, TextRun, Heading, Table, TableRow, TableCell, BorderStyle, convertInchesToTwip } from "docx";
import jsPDF from "jspdf";
import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact/LocalHealthProfileArtifact";

/**
 * Export LocalHealthProfileArtifact (PSL-C) to DOCX format.
 * Generates a structured Word document with all sections and metadata.
 */
export async function exportPSLCToDocx(
  artifact: LocalHealthProfileArtifact
): Promise<Buffer> {
  const sections = [
    // Portada
    new Paragraph({
      text: artifact.portada.municipalityName,
      heading: "Heading1",
      thematicBreak: false,
    }),
    new Paragraph({
      text: `Provincia: ${artifact.portada.municipalityProvince}`,
      spacing: { line: 240 },
    }),
    new Paragraph({
      text: `Compilado: ${new Date(artifact.portada.compiledAt).toLocaleDateString("es-ES")}`,
      spacing: { line: 240 },
    }),
    new Paragraph({ text: "", spacing: { line: 480 } }),

    // Identificación
    new Paragraph({
      text: "Identificación Municipal",
      heading: "Heading2",
    }),
    new Paragraph({
      text: `ID: ${artifact.identificacionMunicipal.municipalityId}`,
    }),
    new Paragraph({
      text: `Nombre: ${artifact.identificacionMunicipal.municipalityName}`,
    }),
    new Paragraph({
      text: `Perfil Generado: ${new Date(artifact.identificacionMunicipal.pslGeneratedAt).toLocaleDateString("es-ES")}`,
    }),
    artifact.identificacionMunicipal.pslValidatedAt
      ? new Paragraph({
          text: `Validado: ${new Date(artifact.identificacionMunicipal.pslValidatedAt).toLocaleDateString("es-ES")} por ${artifact.identificacionMunicipal.pslValidatedBy || "N/A"}`,
        })
      : new Paragraph({ text: "Estado: No validado aún" }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Base Documental
    new Paragraph({
      text: "Base Documental",
      heading: "Heading2",
    }),
    new Paragraph({
      text: `Total de Átomos de Evidencia: ${artifact.baseDocumental.totalEvidenceAtoms}`,
    }),
    new Paragraph({
      text: `Errores de Integridad: ${artifact.baseDocumental.integrityErrors}`,
    }),
    new Paragraph({
      text: `Advertencias: ${artifact.baseDocumental.integrityWarnings}`,
    }),
    new Paragraph({
      text: `Orígenes: ${artifact.baseDocumental.originsSummary.join(", ")}`,
    }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Lectura Territorial
    new Paragraph({
      text: "Lectura Territorial",
      heading: "Heading2",
    }),
    new Paragraph({
      text: artifact.lecturaTerritorial.territorialSummary,
    }),
    new Paragraph({
      text: `Determinantes: ${artifact.lecturaTerritorial.determinantCount}`,
    }),
    new Paragraph({
      text: `Activos: ${artifact.lecturaTerritorial.assetCount}`,
    }),
    new Paragraph({
      text: `Indicadores: ${artifact.lecturaTerritorial.indicatorCount}`,
    }),
    artifact.lecturaTerritorial.areasDeIntervencion.length > 0
      ? new Paragraph({
          text: `Áreas de Intervención: ${artifact.lecturaTerritorial.areasDeIntervencion.map((a) => a.title).join(", ")}`,
        })
      : new Paragraph({ text: "Sin áreas de intervención definidas" }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Conclusiones
    new Paragraph({
      text: "Conclusiones",
      heading: "Heading2",
    }),
    new Paragraph({
      text: artifact.conclusiones.content,
    }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Cierre Interpretativo
    new Paragraph({
      text: "Cierre Interpretativo",
      heading: "Heading2",
    }),
    new Paragraph({
      text: artifact.cierreInterpretativo.content,
    }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Priorización
    new Paragraph({
      text: "Priorización",
      heading: "Heading2",
    }),
    new Paragraph({
      text: `Estado: ${artifact.priorizacion.priorizacionStatus}`,
    }),
    artifact.priorizacion.tematicasSeleccionadasLabels.length > 0
      ? new Paragraph({
          text: `Temáticas: ${artifact.priorizacion.tematicasSeleccionadasLabels.join(", ")}`,
        })
      : new Paragraph({ text: "Sin temáticas seleccionadas" }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Nota de Validación
    new Paragraph({
      text: "Nota de Validación y Trazabilidad",
      heading: "Heading2",
    }),
    new Paragraph({
      text: `Artefacto: PSL-C ${artifact.artifactVersion}`,
    }),
    new Paragraph({
      text: `Hash del PSL Fuente: ${artifact.sourceHash.substring(0, 16)}...`,
    }),
    new Paragraph({
      text: `Compilado: ${new Date(artifact.notaValidacion.compiledAt).toLocaleDateString("es-ES")}`,
    }),
    artifact.notaValidacion.pslValidatedAt
      ? new Paragraph({
          text: `Validado: ${new Date(artifact.notaValidacion.pslValidatedAt).toLocaleDateString("es-ES")}`,
        })
      : new Paragraph({ text: "Estado: En proceso de validación" }),
    new Paragraph({ text: "", spacing: { line: 240 } }),

    // Cautelas Metodológicas
    new Paragraph({
      text: "Cautelas Metodológicas",
      heading: "Heading2",
    }),
    new Paragraph({
      text: artifact.cautelasMetodologicas.nota,
      italics: true,
    }),
  ];

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

/**
 * Export LocalHealthProfileArtifact (PSL-C) to PDF format.
 * Generates a text-based PDF with all sections and metadata.
 */
export function exportPSLCToPdf(artifact: LocalHealthProfileArtifact): Buffer {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const addText = (text: string, size: number = 10, bold: boolean = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");

    const lines = doc.splitTextToSize(text, contentWidth);
    const lineHeight = size * 0.35;

    if (yPosition + lineHeight * lines.length > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.text(lines, margin, yPosition);
    yPosition += lineHeight * lines.length + 2;
  };

  const addSection = (title: string) => {
    if (yPosition + 10 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    yPosition += 5;
    addText(title, 14, true);
    yPosition += 3;
  };

  // Portada
  addSection(artifact.portada.municipalityName);
  addText(`Provincia: ${artifact.portada.municipalityProvince}`);
  addText(`Compilado: ${new Date(artifact.portada.compiledAt).toLocaleDateString("es-ES")}`);

  // Identificación
  addSection("Identificación Municipal");
  addText(`ID: ${artifact.identificacionMunicipal.municipalityId}`);
  addText(`Nombre: ${artifact.identificacionMunicipal.municipalityName}`);
  addText(
    `Perfil Generado: ${new Date(artifact.identificacionMunicipal.pslGeneratedAt).toLocaleDateString("es-ES")}`
  );
  if (artifact.identificacionMunicipal.pslValidatedAt) {
    addText(
      `Validado: ${new Date(artifact.identificacionMunicipal.pslValidatedAt).toLocaleDateString("es-ES")} por ${artifact.identificacionMunicipal.pslValidatedBy || "N/A"}`
    );
  }

  // Base Documental
  addSection("Base Documental");
  addText(`Total de Átomos de Evidencia: ${artifact.baseDocumental.totalEvidenceAtoms}`);
  addText(`Errores de Integridad: ${artifact.baseDocumental.integrityErrors}`);
  addText(`Advertencias: ${artifact.baseDocumental.integrityWarnings}`);
  addText(`Orígenes: ${artifact.baseDocumental.originsSummary.join(", ")}`);

  // Lectura Territorial
  addSection("Lectura Territorial");
  addText(artifact.lecturaTerritorial.territorialSummary);
  addText(`Determinantes: ${artifact.lecturaTerritorial.determinantCount}`);
  addText(`Activos: ${artifact.lecturaTerritorial.assetCount}`);
  addText(`Indicadores: ${artifact.lecturaTerritorial.indicatorCount}`);
  if (artifact.lecturaTerritorial.areasDeIntervencion.length > 0) {
    addText(
      `Áreas de Intervención: ${artifact.lecturaTerritorial.areasDeIntervencion.map((a) => a.title).join(", ")}`
    );
  }

  // Conclusiones
  addSection("Conclusiones");
  addText(artifact.conclusiones.content);

  // Cierre Interpretativo
  addSection("Cierre Interpretativo");
  addText(artifact.cierreInterpretativo.content);

  // Priorización
  addSection("Priorización");
  addText(`Estado: ${artifact.priorizacion.priorizacionStatus}`);
  if (artifact.priorizacion.tematicasSeleccionadasLabels.length > 0) {
    addText(`Temáticas: ${artifact.priorizacion.tematicasSeleccionadasLabels.join(", ")}`);
  }

  // Nota de Validación
  addSection("Nota de Validación y Trazabilidad");
  addText(`Artefacto: PSL-C ${artifact.artifactVersion}`);
  addText(`Hash del PSL Fuente: ${artifact.sourceHash.substring(0, 16)}...`);
  addText(`Compilado: ${new Date(artifact.notaValidacion.compiledAt).toLocaleDateString("es-ES")}`);
  if (artifact.notaValidacion.pslValidatedAt) {
    addText(
      `Validado: ${new Date(artifact.notaValidacion.pslValidatedAt).toLocaleDateString("es-ES")}`
    );
  }

  // Cautelas Metodológicas
  addSection("Cautelas Metodológicas");
  addText(artifact.cautelasMetodologicas.nota);

  return Buffer.from(doc.output("arraybuffer"));
}
