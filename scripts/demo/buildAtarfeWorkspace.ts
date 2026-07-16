/**
 * scripts/demo/buildAtarfeWorkspace.ts
 *
 * Constructor REPRODUCIBLE y HONESTO del expediente canónico de Atarfe.
 *
 * Usa EXCLUSIVAMENTE los servicios reales de COMPÁS NG y fuentes genuinamente
 * municipales de Atarfe, según la clasificación de procedencia de fixtures/README.md:
 *
 *   - Informe de Salud de Atarfe (fixtures/health-reports/Informe_Salud_Atarfe.docx):
 *     base epidemiológica oficial (componente N). Se preserva como HealthReportDocument;
 *     NO genera EvidenceAtoms (D-HR-01 / Art. 7 bis §3).
 *   - IBSE Atarfe (fixtures/ibse-atarfe.csv, `municipal-demo`, REDCap Monitor IBSE
 *     Atarfe 2026, n=909): único estudio genuinamente municipal (componente +1).
 *     Muestra MIXTA (menores de 16 y personas de 16 o más), sin desglose etario.
 *
 * EXCLUIDO DELIBERADAMENTE (no es Atarfe / no es honesto atribuirlo a su población):
 *   - EAS provinciales de Granada (DUKE/PREDIMED/SF-12/Sueño/CAGE/IPAQ, `provincial-eas-granada`).
 *   - Fixtures `synthetic-validation` (AUDIT-C/GHQ-12/PHQ-9/PSQI/Fagerström/SBQ).
 *   - Priorización derivada de desarrollo (no procede de proceso REDCap participativo real).
 *
 * REPRODUCIBILIDAD (revisión 2026-07-16):
 *   Los servicios de dominio emiten `crypto.randomUUID()` y `new Date()` en cada
 *   llamada. Para que dos reconstrucciones con las MISMAS fuentes produzcan bytes
 *   idénticos (mismo SHA-256), este constructor canónico aplica un contexto
 *   determinista: sello temporal fijo (CANONICAL_TIMESTAMP) e identificadores
 *   estables para el documento sanitario, el HealthReportDocument y el IBSEStudy.
 *   La determinización se limita a este constructor (canonicalizeWorkspace); NO
 *   altera el comportamiento normal de la aplicación en tiempo de ejecución.
 *
 * No fabrica datos ni promociona fixtures sintéticas a producción.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createCompleteMunicipalityWorkspace } from "../../src/application/workspace";
import { createHealthReportDocumentFromDocx } from "../../src/application/health-report";
import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "../../src/application/ibse";
import {
  createIBSEStudy,
  IBSE_MIXED_SAMPLE_SENTENCE,
  IBSE_PARTICIPANT_SAMPLE_CAUTION,
} from "../../src/domain/ibse";
import {
  addMunicipalDocument,
  type AddMunicipalDocumentInput,
  type MunicipalDocument,
} from "../../src/domain/repository";
import {
  stableAssetKey,
  upsertEvidenceAtom,
  type EvidenceAtom,
} from "../../src/domain/evidence";
import type { HealthReportAuthor } from "../../src/domain/health-report";
import type { MunicipalityWorkspace } from "../../src/domain/workspace";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fixturePath = (name: string): string => resolve(repoRoot, "fixtures", name);

function toArrayBuffer(path: string): ArrayBuffer {
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export const ATARFE_ID = "atarfe";
export const ATARFE_INE = "18022";

// ── Contexto determinista del constructor canónico ───────────────────────────
// Sello temporal fijo y documentado. Reemplaza a `new Date()` en todos los campos
// createdAt/updatedAt/extractedAt del expediente para que la serialización sea
// byte a byte estable entre reconstrucciones. Fecha: construcción canónica 2026-07-16.
export const CANONICAL_TIMESTAMP = "2026-07-16T00:00:00.000Z";

// Identificadores estables (reemplazan a `crypto.randomUUID()` sólo en este expediente).
export const HEALTH_REPORT_DOCUMENT_ID = "doc-health-report-atarfe"; // documento del repositorio
export const HEALTH_REPORT_ID = "health-report-atarfe"; // HealthReportDocument
export const IBSE_STUDY_ID = "ibse-study-atarfe"; // IBSEStudy
export const IBSE_DOCUMENT_ID = "doc-ibse-atarfe"; // documento del repositorio (ya estable)

// SHA-256 documentado de las dos fuentes de entrada. Las pruebas verifican que las
// fixtures en disco coinciden: si cambian, el expediente deja de ser reproducible
// contra estas fuentes y la validación falla de forma ruidosa.
export const ATARFE_INPUT_SHA256 = {
  healthReportDocx:
    "597fcacf0342eeb8970ef61b3a9b1d58cfe9eeb1c6703af7639e843a6c5b8e2c",
  ibseCsv: "b2c6126c937b88de55c6aaae6c611f6c4bec75cd90e968916732c577039fa703",
} as const;

const HEALTH_REPORT_DOCX = fixturePath("health-reports/Informe_Salud_Atarfe.docx");
const IBSE_CSV = fixturePath("ibse-atarfe.csv");
export const HEALTH_REPORT_DOCX_PATH = HEALTH_REPORT_DOCX;
export const IBSE_CSV_PATH = IBSE_CSV;

const HEALTH_REPORT_TITLE =
  "Informe de la situación de salud en el municipio de Atarfe";
const HEALTH_REPORT_PERIOD = "21 de noviembre de 2025";

// Autoría del Informe de Salud (Art. 16). Firmantes presentes en el documento:
// «Carlos del Moral Campaña. Epidemiólogo Distrito Granada-Metropolitano» y
// «María José Molina Rueda. Epidemióloga Distrito Granada-Metropolitano»,
// Unidad de Prevención, Promoción y Vigilancia de la Salud.
const HEALTH_REPORT_AUTHORS: HealthReportAuthor[] = [
  {
    name: "Carlos del Moral Campaña",
    role: "Epidemiólogo",
    organisation:
      "Unidad de Prevención, Promoción y Vigilancia de la Salud — Distrito Granada-Metropolitano",
    signatureOrder: 1,
  },
  {
    name: "María José Molina Rueda",
    role: "Epidemióloga",
    organisation:
      "Unidad de Prevención, Promoción y Vigilancia de la Salud — Distrito Granada-Metropolitano",
    signatureOrder: 2,
  },
];

// Discriminador de la muestra IBSE de Atarfe. El CSV `ibse-atarfe.csv` es una
// muestra MIXTA (menores de 16 y personas de 16 o más) y NO trae desglose etario:
// el export no permite recuentos válidos por estrato. Por eso el estudio se marca
// "mixed" y NO se afirma "población escolar".
export const ATARFE_IBSE_SAMPLE_SCOPE = "mixed" as const;

// Cautelas de muestra que viajan en el estudio y en cada átomo IBSE.
export const ATARFE_IBSE_SAMPLE_CAUTIONS: readonly string[] = [
  IBSE_MIXED_SAMPLE_SENTENCE,
  IBSE_PARTICIPANT_SAMPLE_CAUTION,
];

export interface AtarfeBuildResult {
  workspace: MunicipalityWorkspace;
  counts: {
    documents: number;
    studies: number;
    studyAtoms: number;
    totalAtoms: number;
    healthReportAtoms: number;
  };
}

/** Registra un estudio: enlaza cada átomo a su documento y hace upsert trazable. */
function registerStudy(
  current: MunicipalityWorkspace,
  studyPatch: Partial<MunicipalityWorkspace>,
  document: AddMunicipalDocumentInput,
  atoms: EvidenceAtom[]
): MunicipalityWorkspace {
  let evidenceStore = current.evidenceStore;
  for (const atom of atoms) {
    const linked: EvidenceAtom = {
      ...atom,
      provenance: { ...atom.provenance, documentId: document.id },
    };
    evidenceStore = upsertEvidenceAtom(
      evidenceStore,
      linked,
      stableAssetKey(linked.municipalityId, linked.provenance.origin, linked.title)
    );
  }
  return {
    ...current,
    ...studyPatch,
    repository: addMunicipalDocument(current.repository, document),
    evidenceStore,
  };
}

/**
 * Contexto canónico determinista. Reemplaza TODO timestamp generado (municipio,
 * repositorio, documentos, EvidenceStore, átomos, Informe e IBSE) por
 * CANONICAL_TIMESTAMP, y fija los identificadores no deterministas del Informe y
 * del IBSEStudy. No modifica el contenido: sólo neutraliza las fuentes de
 * variación byte a byte. Confinado a este constructor canónico.
 */
function canonicalizeWorkspace(ws: MunicipalityWorkspace): MunicipalityWorkspace {
  const T = CANONICAL_TIMESTAMP;

  const documents: MunicipalDocument[] = ws.repository.documents.map((d) => ({
    ...d,
    source: d.source.collectedAt !== undefined
      ? { ...d.source, collectedAt: T }
      : d.source,
    createdAt: T,
    updatedAt: T,
  }));

  const atoms: EvidenceAtom[] = ws.evidenceStore.atoms.map((a) => ({
    ...a,
    provenance: { ...a.provenance, extractedAt: T },
    createdAt: T,
    updatedAt: T,
  }));

  return {
    ...ws,
    municipality: {
      ...ws.municipality,
      metadata: { ...ws.municipality.metadata, createdAt: T, updatedAt: T },
    },
    repository: { ...ws.repository, documents, createdAt: T, updatedAt: T },
    evidenceStore: { ...ws.evidenceStore, atoms, createdAt: T, updatedAt: T },
    healthReport: ws.healthReport
      ? {
          ...ws.healthReport,
          id: HEALTH_REPORT_ID,
          linkedDocumentId: HEALTH_REPORT_DOCUMENT_ID,
          createdAt: T,
          updatedAt: T,
        }
      : ws.healthReport,
    ibseStudy: ws.ibseStudy
      ? { ...ws.ibseStudy, id: IBSE_STUDY_ID, createdAt: T, updatedAt: T }
      : ws.ibseStudy,
    createdAt: T,
    updatedAt: T,
  };
}

export async function buildAtarfeWorkspace(): Promise<AtarfeBuildResult> {
  let ws = createCompleteMunicipalityWorkspace({
    id: ATARFE_ID,
    name: "Atarfe",
    province: "Granada",
    ineCode: ATARFE_INE,
    createdBy: "COMPÁS NG",
  });

  // ── 1. Informe de Salud — fuente diagnóstica primaria (N, D-HR-01) ─────────
  // Se preserva como HealthReportDocument con su autoría; NO genera EvidenceAtoms.
  const healthReport = await createHealthReportDocumentFromDocx({
    arrayBuffer: toArrayBuffer(HEALTH_REPORT_DOCX),
    municipalityId: ATARFE_ID,
    linkedDocumentId: HEALTH_REPORT_DOCUMENT_ID,
    sourceFileName: "Informe_Salud_Atarfe.docx",
    title: HEALTH_REPORT_TITLE,
    reportingPeriod: HEALTH_REPORT_PERIOD,
    authors: HEALTH_REPORT_AUTHORS,
  });
  ws = {
    ...ws,
    repository: addMunicipalDocument(ws.repository, {
      id: HEALTH_REPORT_DOCUMENT_ID,
      kind: "health-report",
      title: HEALTH_REPORT_TITLE,
      source: {
        system: "Carga directa de fuente documental primaria",
        collectedAt: CANONICAL_TIMESTAMP,
      },
      sourceFileName: "Informe_Salud_Atarfe.docx",
      tags: ["health-report", "primary-source"],
      territorialScale: "municipio",
      contentMode: "full-text-non-atomized",
    }),
    healthReport,
  };

  // ── 2. IBSE municipal — único estudio genuinamente de Atarfe (+1) ──────────
  // fixtures/ibse-atarfe.csv: `municipal-demo`, REDCap Monitor IBSE Atarfe 2026.
  // Muestra MIXTA (menores de 16 y 16 o más) sin desglose etario en el export:
  // se marca `sampleScope: "mixed"` y se anteponen las cautelas de muestra a las
  // del parser, de modo que viajen con el estudio y con cada átomo (limitations).
  const ibseParsed = parseIBSECSV(readFileSync(IBSE_CSV, "utf-8"));
  const ibseStudy = createIBSEStudy({
    municipalityId: ATARFE_ID,
    sourceFileName: "ibse-atarfe.csv",
    aggregates: ibseParsed.aggregates,
    sampleScope: ATARFE_IBSE_SAMPLE_SCOPE,
    // Sin `strataCounts`: el CSV no aporta recuentos válidos por edad.
    methodologicalCautions: [
      ...ATARFE_IBSE_SAMPLE_CAUTIONS,
      ...ibseParsed.methodologicalCautions,
    ],
  });
  const ibseAtoms = ibseStudyToEvidenceAtoms(ibseStudy);
  ws = registerStudy(
    ws,
    { ibseStudy },
    {
      id: IBSE_DOCUMENT_ID,
      kind: "redcap-export",
      title: "IBSE — Monitor IBSE Atarfe 2026 (REDCap municipal, muestra mixta)",
      sourceFileName: "ibse-atarfe.csv",
      source: {
        system:
          "REDCap · Monitor IBSE Atarfe 2026 (datos primarios municipales; muestra mixta <16 y 16+)",
      },
      tags: ["redcap-export", "ibse"],
      territorialScale: "municipio",
      contentMode: "atomized",
    },
    ibseAtoms
  );

  // ── 3. Determinización canónica (sello temporal + IDs estables) ────────────
  ws = canonicalizeWorkspace(ws);

  const healthReportAtoms = ws.evidenceStore.atoms.filter(
    (a) => a.provenance.origin === "health-report"
  ).length;

  return {
    workspace: ws,
    counts: {
      documents: ws.repository.documents.length,
      studies: 1,
      studyAtoms: ibseAtoms.length,
      totalAtoms: ws.evidenceStore.atoms.length,
      healthReportAtoms,
    },
  };
}
