/**
 * pslcDocx
 *
 * Serialización DOCX del modelo documental institucional del PSL-C.
 * La estructura y el contenido proceden íntegramente de
 * buildPSLCDocumentModel (capa pura): aquí solo se traduce a Word.
 */

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import type { PSLCDocumentModel } from "./pslcDocumentModel";
import { buildPSLCDocumentModel } from "./pslcDocumentModel";

// ── Modelo → Document ─────────────────────────────────────────────────────────

export function buildPSLCDocx(model: PSLCDocumentModel): Document {
  const children: Paragraph[] = [];

  // Portada
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      children: [new TextRun(model.title)],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: model.subtitle, italics: true })],
    })
  );
  for (const p of model.portada) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120 },
        children: [new TextRun({ text: p, size: 20 })],
      })
    );
  }

  // Secciones: capítulos numerados y bloques institucionales
  for (const section of model.sections) {
    children.push(
      new Paragraph({
        heading:
          section.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
        spacing: { before: 320, after: 120 },
        children: [new TextRun(section.title)],
      })
    );
    for (const p of section.paragraphs) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun(p)],
        })
      );
    }
  }

  return new Document({
    creator: "COMPÁS NG",
    title: model.title,
    description: model.subtitle,
    sections: [{ children }],
  });
}

// ── API de exportación ────────────────────────────────────────────────────────

/** Serializa el artefacto congelado a un Blob DOCX (navegador). */
export async function exportPSLCArtifactToDocxBlob(
  artifact: LocalHealthProfileArtifact
): Promise<{ blob: Blob; fileName: string }> {
  const model = buildPSLCDocumentModel(artifact);
  const blob = await Packer.toBlob(buildPSLCDocx(model));
  return { blob, fileName: model.fileName };
}

/** Serializa el artefacto congelado a Buffer (entorno Node: tests, scripts). */
export async function exportPSLCArtifactToDocxBuffer(
  artifact: LocalHealthProfileArtifact
): Promise<Buffer> {
  const model = buildPSLCDocumentModel(artifact);
  return Packer.toBuffer(buildPSLCDocx(model));
}
