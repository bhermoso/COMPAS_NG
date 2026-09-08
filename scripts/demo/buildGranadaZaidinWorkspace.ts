/**
 * scripts/demo/buildGranadaZaidinWorkspace.ts
 *
 * RECONSTRUCCIÓN REPRODUCIBLE de Granada-Zaidín con fuentes territoriales
 * observadas, sin resultados de escalas no aplicadas.
 *
 * Las escalas permanecen disponibles en el catálogo metodológico de COMPÁS NG,
 * pero este constructor no incorpora resultados si no existe una aplicación
 * real y trazable en el distrito.
 *
 * Construye el MunicipalityWorkspace del ámbito piloto usando exclusivamente
 * los servicios reales de COMPÁS NG y material fuente preservado en el
 * repositorio. No fabrica datos: todo procede de:
 *
 *   - docs/source-material/territorial-cases/granada-zaidin/  (Informe de Salud,
 *     Informes Vigía, CSV de Localiza Salud auditado)
 *   - docs/methodology/reconstruction/GRANADA-ZAIDIN-ACTIVOS-LOCALIZA-AUDIT.md §8
 *     (texto normalizado de activos, sin datos personales — RGPD)
 *
 * Reglas respetadas:
 *   - D-HR-01: el Informe de Salud se preserva sin generar EvidenceAtoms.
 *   - Ningún fixture de desarrollo se promueve a evidencia municipal.
 *   - Los Informes Vigía se registran como referencia documental territorial
 *     sin atomizar, para no alterar la línea base de evidencias del piloto.
 *   - Granada-Zaidín es distrito, sin código INE propio.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createCompleteMunicipalityWorkspace } from "../../src/application/workspace";
import {
  ingestManualDocument,
  extractDocxText,
} from "../../src/application/document-ingestion";
import { createHealthReportDocumentFromDocx } from "../../src/application/health-report";

import {
  addMunicipalDocument,
  type MunicipalDocumentRepository,
} from "../../src/domain/repository";
import type { MunicipalityWorkspace } from "../../src/domain/workspace";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const GRANADA_ZAIDIN_ID = "granada-zaidin";

export const HEALTH_REPORT_DOCX = resolve(
  repoRoot,
  "docs/source-material/territorial-cases/granada-zaidin/Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx"
);

export const VIGIA_DOCX = [
  "docs/source-material/territorial-cases/granada-zaidin/Informe Zaidin Centro Este.docx",
  "docs/source-material/territorial-cases/granada-zaidin/Informe Zaidin Sur.docx",
].map((p) => resolve(repoRoot, p));

/**
 * Texto normalizado de activos Localiza Salud — copia literal de
 * GRANADA-ZAIDIN-ACTIVOS-LOCALIZA-AUDIT.md §8 (15 entradas válidas del CSV
 * MapaDeActivo_PLS_Zaidin.csv, sin datos de contacto personal).
 */
export const LOCALIZA_SALUD_ZAIDIN_TEXT = [
  "Centro Participación Activa Mayores Zaidín | Talleres deportivos y socioculturales para mayores de 60 años. CPA Zaidín.",
  "Asociación de Pacientes Cardíacos de Granada y Provincia | Atención integral al paciente cardíaco. Rehabilitación fase III. Apoyo psicológico y social.",
  "Centro Participación Activa Mayores Manuel Benítez Carrasco | Talleres deportivos y socioculturales. CMSS Zaidín.",
  "CMSS Zaidín — Centro de Gestión Municipal | Espacios para actividades comunitarias y asociaciones. Programas ERACIS. CMSS Zaidín.",
  "Cruz Roja Granada — Atención social y voluntariado | Proyectos de atención social, emergencias y voluntariado. Cuesta Escoriaza.",
  "Profesional experta en prevención y promoción de la salud | Servicios de prevención y promoción en el ámbito comunitario.",
  "Proyecto Hombre Granada | Tratamiento y prevención de adicciones.",
  "Bailes de Salón | Taller de baile comunitario. Asociación Cultural Acuario. Margarita Xirgú.",
  "Centro de Participación Activa Zaidín | Consejería de Inclusión Social. Actividades para mayores. Valencia nº 4.",
  "Fundación Albihar | Salud mental comunitaria. Atención y rehabilitación psicosocial.",
  "Cruz Roja Granada — Programa específico Zaidín | Programa de intervención específica en el distrito.",
  "V Plan Municipal de Prevención de Adicciones | Plan municipal del Ayuntamiento de Granada para la prevención de drogodependencias.",
  "Unidad Salud Mental Comunitaria Zaidín | SAS — Distrito AP Granada-Metropolitano. América, 14.",
  "Escuela de Salud y Cuidados del Colegio de Enfermería de Granada | Actividades formativas en salud y cuidados. COEGRA.",
  "Centro de Salud Zaidín Sur | SAS — Distrito AP Granada-Metropolitano. Envejecimiento activo. Poeta Gracián, 7.",
].join("\n");

export const LOCALIZA_ASSET_COUNT = 15;

// ── Marcos estratégicos y normativos ─────────────────────────────────────────

export const STRATEGIC_FRAMEWORK_KEYS = [
  "epvsa",
  "esca",
  "plan-mayores-andalucia-2020-2023",
] as const;

export type StrategicFrameworkKey = (typeof STRATEGIC_FRAMEWORK_KEYS)[number];

export interface StrategicFrameworkSpec {
  frameworkKey: StrategicFrameworkKey;
  title: string;
  /** Nombre del fichero PDF fuente. */
  pdfFileName: string;
  /** Ruta del PDF relativa a la raíz del repositorio (trazabilidad). */
  pdfRepoPath: string;
}

/**
 * Identificador documental estable de un marco: depende de municipalityId,
 * del kind "strategic-framework" y de la clave del marco. Nunca es un UUID
 * nuevo por ejecución — es la base de la idempotencia.
 */
export function strategicFrameworkDocumentId(
  municipalityId: string,
  frameworkKey: StrategicFrameworkKey
): string {
  return `strategic-framework:${municipalityId}:${frameworkKey}`;
}

const STRATEGIC_FRAMEWORK_PDFS: Array<{
  frameworkKey: StrategicFrameworkKey;
  title: string;
  pdfFileName: string;
}> = [
  {
    frameworkKey: "epvsa",
    title: "EPVSA — Estrategia de Promoción de la Vida Saludable en Andalucía 2024–2030",
    pdfFileName: "08_Lineas_EPVSA_02abril24.pdf",
  },
  {
    frameworkKey: "esca",
    title: "ESCA — Estrategia de Salud Comunitaria de Andalucía 2026-2030",
    pdfFileName: "Estrategia de Salud Comunitaria de Andalucia 2026-2030-ESCA.pdf",
  },
  {
    frameworkKey: "plan-mayores-andalucia-2020-2023",
    title: "Plan Estratégico Integral para Personas Mayores en Andalucía 2020-2023",
    pdfFileName: "Plan de mayores 2020-23.pdf",
  },
];

/**
 * Resuelve las tres fuentes obligatorias de marcos desde sus PDF reales,
 * preservados en docs/source-material/strategic-frameworks/. Falla
 * explícitamente si falta cualquiera de los tres: nunca carga un subconjunto
 * en silencio. El StrategicFrameworkRegistry queda como metadato auxiliar del
 * dominio; no sustituye al documento cuando el PDF existe.
 */
export function buildStrategicFrameworkSpecs(rootDir: string): StrategicFrameworkSpec[] {
  const dir = "docs/source-material/strategic-frameworks";
  const specs: StrategicFrameworkSpec[] = [];
  const missing: string[] = [];
  for (const marco of STRATEGIC_FRAMEWORK_PDFS) {
    const pdfRepoPath = `${dir}/${marco.pdfFileName}`;
    if (!existsSync(resolve(rootDir, pdfRepoPath))) {
      missing.push(`${marco.frameworkKey} → ${pdfRepoPath}`);
      continue;
    }
    specs.push({ ...marco, pdfRepoPath });
  }
  if (missing.length > 0) {
    throw new Error(
      `Fuente obligatoria ausente: no existe el PDF de ${missing.join("; ")}. ` +
      `No se carga ningún marco.`
    );
  }
  return specs;
}

/** Normalización para deduplicar títulos y nombres de fichero equivalentes. */
function normalizeForDedup(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Registra los marcos de forma idempotente: antes de añadir cada marco elimina
 * cualquier documento strategic-framework previo equivalente — mismo id
 * estable, misma etiqueta framework:{clave}, mismo título normalizado o mismo
 * fichero fuente normalizado (esto último neutraliza duplicados heredados de
 * cargas manuales por la UI, que usaban UUID y carecían de clave de marco).
 * Los marcos se registran como referencia documental sin generación de
 * evidencias (canGenerateEvidence: false — totales auditados intactos).
 */
export function upsertStrategicFrameworkDocuments(
  repository: MunicipalDocumentRepository,
  municipalityId: string,
  specs: StrategicFrameworkSpec[]
): MunicipalDocumentRepository {
  let next = repository;
  for (const spec of specs) {
    const stableId = strategicFrameworkDocumentId(municipalityId, spec.frameworkKey);
    const frameworkTag = `framework:${spec.frameworkKey}`;
    const normTitle = normalizeForDedup(spec.title);
    const normPdf = normalizeForDedup(spec.pdfFileName);
    next = {
      ...next,
      documents: next.documents.filter((d) => {
        if (d.kind !== "strategic-framework") return true;
        if (d.id === stableId || d.tags.includes(frameworkTag)) return false;
        if (normalizeForDedup(d.title) === normTitle) return false;
        if (d.sourceFileName && normalizeForDedup(d.sourceFileName) === normPdf) return false;
        return true;
      }),
    };
    next = addMunicipalDocument(next, {
      id: stableId,
      kind: "strategic-framework",
      title: spec.title,
      source: {
        organization: "Junta de Andalucía",
        system: "Archivo PDF — referencia documental",
        url: spec.pdfRepoPath,
        collectedAt: new Date().toISOString(),
      },
      sourceFileName: spec.pdfFileName,
      canGenerateEvidence: false,
      tags: ["strategic-framework", frameworkTag],
    });
  }
  return next;
}

export interface GranadaZaidinBuildResult {
  workspace: MunicipalityWorkspace;
  counts: {
    documents: number;
    studies: number;
    studyAtoms: number;
    localizaAtoms: number;
    totalAtoms: number;
    healthReportAtoms: number;
  };
}

function toArrayBuffer(path: string): ArrayBuffer {
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

/**
 * Lee la UGC declarada en el propio texto del informe ("Unidad de Gestión
 * Clínica: Zaidín Sur"). No se hardcodea: procede del documento fuente.
 */
export function extractUgcLabel(sourceText: string): string | undefined {
  const match = sourceText.match(
    /Unidad de Gesti[oó]n Cl[ií]nica:\s*(.+?)\s*$/im
  );
  return match ? match[1].trim() : undefined;
}

export async function buildGranadaZaidinWorkspace(): Promise<GranadaZaidinBuildResult> {
  const municipalityId = GRANADA_ZAIDIN_ID;

  let ws = createCompleteMunicipalityWorkspace({
    id: municipalityId,
    name: "Granada-Zaidín",
    province: "Granada",
    territorialType: "distrito",
    createdBy: "COMPÁS NG",
  });

  // ── 1. Informe de Salud — fuente diagnóstica primaria (D-HR-01) ────────────
  const hrDocumentId = crypto.randomUUID();
  const healthReport = await createHealthReportDocumentFromDocx({
    arrayBuffer: toArrayBuffer(HEALTH_REPORT_DOCX),
    municipalityId,
    linkedDocumentId: hrDocumentId,
    sourceFileName: "Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx",
    title: "Informe Salud Granada Abril2023 estilo Atarfe",
    authors: [],
  });
  ws = {
    ...ws,
    repository: addMunicipalDocument(ws.repository, {
      id: hrDocumentId,
      kind: "health-report",
      title: "Informe Salud Granada Abril2023 estilo Atarfe",
      source: {
        system: "Carga directa de fuente documental primaria",
        collectedAt: new Date().toISOString(),
      },
      sourceFileName: "Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx",
      tags: ["health-report", "primary-source"],
    }),
    healthReport,
    updatedAt: new Date().toISOString(),
  };

  // ── 2. Estudios complementarios ─────────────────────────────────────────
  // Ninguno consta como aplicado en Granada-Zaidín. Los trece instrumentos
  // permanecen disponibles en la aplicación para futuras importaciones reales.
  const studyAtoms = 0;

  // ── 3. Activos Localiza Salud (texto normalizado auditado; vía real) ──────
  const localizaResult = ingestManualDocument({
    repository: ws.repository,
    evidenceStore: ws.evidenceStore,
    kind: "localiza-salud",
    title: "Activos Localiza Salud — Zaidín (auditados)",
    plainText: LOCALIZA_SALUD_ZAIDIN_TEXT,
    sourceFileName: "MapaDeActivo_PLS_Zaidin.csv",
    sourceSystem: "Localiza Salud — texto normalizado (auditoría RGPD)",
  });
  if (localizaResult === null) {
    throw new Error("La ingesta de Localiza Salud devolvió null: revisar texto normalizado.");
  }
  ws = {
    ...ws,
    repository: localizaResult.repository,
    evidenceStore: localizaResult.evidenceStore,
    updatedAt: new Date().toISOString(),
  };

  // ── 4. Informes Vigía — informes clínico-asistenciales por UGC ────────────
  // Texto íntegro persistido y trazable, SIN atomizar ni interpretar: no genera
  // EvidenceAtoms (canGenerateEvidence:false), no altera la línea 92 de
  // evidencias. La UGC se lee del propio texto ("Unidad de Gestión Clínica: …"),
  // sin hardcodear. Una UGC NO es un distrito municipal ni un distrito sanitario.
  for (const path of VIGIA_DOCX) {
    const fileName = path.split(/[\\/]/).pop()!;
    const sourceText = await extractDocxText(toArrayBuffer(path));
    ws = {
      ...ws,
      repository: addMunicipalDocument(ws.repository, {
        id: crypto.randomUUID(),
        kind: "territorial-documentation",
        title: fileName.replace(/\.docx$/i, ""),
        source: {
          system:
            "Informe clínico-asistencial por UGC (Vigilancia Integral de la Salud) — texto íntegro persistido, no atomizado ni interpretado",
          collectedAt: new Date().toISOString(),
        },
        sourceFileName: fileName,
        sourceText,
        canGenerateEvidence: false,
        tags: ["territorial-documentation"],
        documentNature: "ugc-clinical-assistance-report",
        territorialScale: "unidad-gestion-clinica",
        ugc: extractUgcLabel(sourceText),
        contentMode: "full-text-non-atomized",
      }),
      updatedAt: new Date().toISOString(),
    };
  }

  // ── 5. Marcos estratégicos y normativos (EPVSA, ESCA, Plan de Mayores) ────
  // Carga idempotente por clave estable; falla explícitamente si falta alguna
  // fuente obligatoria; sin generación de evidencias (totales intactos).
  ws = {
    ...ws,
    repository: upsertStrategicFrameworkDocuments(
      ws.repository,
      municipalityId,
      buildStrategicFrameworkSpecs(repoRoot)
    ),
    updatedAt: new Date().toISOString(),
  };

  const totalAtoms = ws.evidenceStore.atoms.length;
  const localizaAtoms = ws.evidenceStore.atoms.filter(
    (a) => a.provenance.origin === "localiza-salud"
  ).length;
  const healthReportAtoms = ws.evidenceStore.atoms.filter(
    (a) => a.provenance.origin === "health-report"
  ).length;

  return {
    workspace: ws,
    counts: {
      documents: ws.repository.documents.length,
      studies: 0,
      studyAtoms,
      localizaAtoms,
      totalAtoms,
      healthReportAtoms,
    },
  };
}
