/**
 * pslcDocx
 *
 * Serialización DOCX del modelo documental institucional del PSL-C.
 * La estructura y el contenido proceden íntegramente de
 * buildPSLCDocumentModel (capa pura): aquí solo se traduce a Word,
 * incluidas las secciones estructuradas del contrato visual (síntesis,
 * tablas, ranking de señales del Informe y agenda del Grupo Motor).
 */

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import type {
  PSLCDocumentModel,
  PSLCDocumentSection,
} from "./pslcDocumentModel";
import { buildPSLCDocumentModel } from "./pslcDocumentModel";

// ── Helpers ───────────────────────────────────────────────────────────────────

type DocxChild = Paragraph | Table;

function parrafo(text: string, opts: { bold?: boolean; italics?: boolean; size?: number } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italics,
        size: opts.size,
      }),
    ],
  });
}

function celda(text: string, bold = false): TableCell {
  return new TableCell({
    children: [
      new Paragraph({ children: [new TextRun({ text, bold, size: 16 })] }),
    ],
  });
}

function tabla(headers: string[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h) => celda(h, true)) }),
      ...rows.map((r) => new TableRow({ children: r.map((c) => celda(c)) })),
    ],
  });
}

// Ranking visual robusto en Word: barra textual proporcional (sin gráficos
// frágiles), conforme al contrato visual (fallback de tabla visual).
function barraTextual(valor: number, max: number): string {
  const unidades = Math.max(1, Math.round((valor / max) * 20));
  return "█".repeat(unidades);
}

function renderSection(section: PSLCDocumentSection): DocxChild[] {
  const children: DocxChild[] = [
    new Paragraph({
      heading:
        section.level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
      spacing: { before: 320, after: 120 },
      children: [new TextRun(section.title)],
    }),
  ];

  switch (section.kind ?? "text") {
    case "summaryCards": {
      for (const card of section.cards ?? []) {
        children.push(
          parrafo(card.texto, {
            bold: card.destacado,
            size: card.destacado ? 22 : 18,
          })
        );
      }
      break;
    }
    case "table": {
      if (section.table !== undefined) {
        children.push(tabla(section.table.headers, section.table.rows));
        if (section.table.nota !== undefined) {
          children.push(parrafo(section.table.nota, { italics: true, size: 16 }));
        }
      }
      break;
    }
    case "barRanking": {
      const items = section.ranking ?? [];
      children.push(
        tabla(
          ["Dimensión", "Peso textual", "Menciones"],
          items.map((i) => [i.etiqueta, barraTextual(i.valor, i.max), String(i.valor)])
        )
      );
      break;
    }
    case "compactSignalList": {
      for (const item of section.signalList ?? []) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: item.grupo + " — ", bold: true, size: 18 }),
              new TextRun({ text: item.senal + " (" + item.fuente + "). ", size: 18 }),
              new TextRun({ text: item.pregunta, italics: true, size: 18 }),
            ],
          })
        );
      }
      break;
    }
    case "groupMotorAgenda": {
      for (const entrada of section.agenda ?? []) {
        children.push(
          parrafo(entrada.tema, { bold: true }),
          parrafo("Señal: " + entrada.senal, { size: 18 }),
          parrafo("Mecanismo plausible: " + entrada.mecanismo, { size: 18 }),
          parrafo("Quién puede quedar fuera: " + entrada.oculto, { size: 18 }),
          parrafo(entrada.pregunta, { italics: true, size: 18 })
        );
      }
      break;
    }
    default:
      break;
  }

  for (const p of section.paragraphs) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun(p)],
      })
    );
  }
  return children;
}

// ── Modelo → Document ─────────────────────────────────────────────────────────

export function buildPSLCDocx(model: PSLCDocumentModel): Document {
  const children: DocxChild[] = [];

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

  // Secciones: estructuradas, capítulos y bloques institucionales
  for (const section of model.sections) {
    children.push(...renderSection(section));
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
