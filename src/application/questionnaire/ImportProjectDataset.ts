/**
 * importProjectDataset
 *
 * Orquesta la importación de un dataset REDCap multi-instrumento sobre los
 * parsers existentes. Cada parser consume únicamente las columnas que conoce;
 * el CSV no se divide físicamente.
 *
 * Contratos invariantes:
 *   - No modifica ningún contrato del Sistema de Estudios Complementarios.
 *   - No persiste el CSV bruto.
 *   - No crea nuevos parsers — reutiliza los existentes.
 *   - No hace que los estudios dependan de REDCap.
 *   - El PSL sigue consumiendo los estudios de la misma forma.
 *
 * Módulos soportados (con adapters.redcap): ibse, auditc, ghq12, phq9, psqi, fagerstrom, sbq.
 * Módulos EAS (adapters.sav): duke-eas, predimed-eas, sf12-eas, sueno-eas, cage-eas, ipaq-eas
 *   → skipped con razón "no-redcap-adapter".
 */

import type { EvidenceAtom } from "../../domain/evidence";
import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { ProjectDatasetImport } from "../../domain/questionnaire";

import { getMethodologicalModule } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

import { parseIBSECSV } from "../ibse/IBSECSVParser";
import { createIBSEStudy } from "../../domain/ibse";
import { ibseStudyToEvidenceAtoms } from "../ibse/IBSEStudyToEvidenceAtoms";

import { parseAUDITCCSV } from "../auditc/AUDITCCSVParser";
import { createAUDITCStudy } from "../../domain/auditc";
import { auditcStudyToEvidenceAtoms } from "../auditc/AUDITCStudyToEvidenceAtoms";

import { parseGHQ12CSV } from "../ghq12/GHQ12CSVParser";
import { createGHQ12Study } from "../../domain/ghq12";
import { ghq12StudyToEvidenceAtoms } from "../ghq12/GHQ12StudyToEvidenceAtoms";

import { parsePHQ9CSV } from "../phq9/PHQ9CSVParser";
import { createPHQ9Study } from "../../domain/phq9";
import { phq9StudyToEvidenceAtoms } from "../phq9/PHQ9StudyToEvidenceAtoms";

import { parsePSQICSV } from "../psqi/PSQICSVParser";
import { createPSQIStudy } from "../../domain/psqi";
import { psqiStudyToEvidenceAtoms } from "../psqi/PSQIStudyToEvidenceAtoms";

import { parseFagerstromCSV } from "../fagerstrom/FagerstromCSVParser";
import { createFagerstromStudy } from "../../domain/fagerstrom";
import { fagerstromStudyToEvidenceAtoms } from "../fagerstrom/FagerstromStudyToEvidenceAtoms";

import { parseSBQCSV } from "../sbq/SBQCSVParser";
import { createSBQStudy } from "../../domain/sbq";
import { sbqStudyToEvidenceAtoms } from "../sbq/SBQStudyToEvidenceAtoms";

// ── Tipos públicos ────────────────────────────────────────────────────────────

export type SkipReason =
  | "no-redcap-adapter"   // módulo sin adaptador REDCap (EAS/SAV)
  | "no-columns"          // completedColumn no encontrada en la cabecera del CSV
  | "no-valid-records";   // columnas encontradas pero nValid = 0

export interface StudyImportSuccess {
  moduleId: string;
  atoms: EvidenceAtom[];
  nValid: number;
  /** Aplica el estudio al workspace sin mutarlo. */
  applyStudy: (prev: MunicipalityWorkspace) => MunicipalityWorkspace;
}

export interface StudyImportSkip {
  moduleId: string;
  reason: SkipReason;
}

export interface StudyImportFailure {
  moduleId: string;
  error: string;
}

export interface ProjectImportResult {
  succeeded: StudyImportSuccess[];
  skipped: StudyImportSkip[];
  failed: StudyImportFailure[];
  metadata: ProjectDatasetImport;
}

// ── Router moduleId → runner ──────────────────────────────────────────────────
// Función tipada que: parsea el CSV, construye el Study y devuelve atoms + patch.

type RunnerResult = {
  nValid: number;
  atoms: EvidenceAtom[];
  applyStudy: (prev: MunicipalityWorkspace) => MunicipalityWorkspace;
};

type Runner = (
  csvText: string,
  municipalityId: string,
  fileName: string
) => RunnerResult | null;

const RUNNERS: Readonly<Record<string, Runner>> = {
  ibse: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions } = parseIBSECSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createIBSEStudy({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions });
    const atoms = ibseStudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, ibseStudy: study }) };
  },
  auditc: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions, warnings } = parseAUDITCCSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createAUDITCStudy({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions, warnings });
    const atoms = auditcStudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, auditcStudy: study }) };
  },
  ghq12: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions, warnings } = parseGHQ12CSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createGHQ12Study({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions, warnings });
    const atoms = ghq12StudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, ghq12Study: study }) };
  },
  phq9: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions, warnings } = parsePHQ9CSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createPHQ9Study({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions, warnings });
    const atoms = phq9StudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, phq9Study: study }) };
  },
  psqi: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions, warnings } = parsePSQICSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createPSQIStudy({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions, warnings });
    const atoms = psqiStudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, psqiStudy: study }) };
  },
  fagerstrom: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions, warnings } = parseFagerstromCSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createFagerstromStudy({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions, warnings });
    const atoms = fagerstromStudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, fagerstromStudy: study }) };
  },
  sbq: (csv, mId, fName) => {
    const { aggregates, methodologicalCautions, warnings } = parseSBQCSV(csv);
    if (aggregates.nValid === 0) return null;
    const study = createSBQStudy({ municipalityId: mId, sourceFileName: fName, aggregates, methodologicalCautions, warnings });
    const atoms = sbqStudyToEvidenceAtoms(study);
    return { nValid: aggregates.nValid, atoms, applyStudy: (prev) => ({ ...prev, sbqStudy: study }) };
  },
};

// ── Utilidad de detección ─────────────────────────────────────────────────────

/**
 * Devuelve true si la columna aparece en la cabecera del CSV.
 * Usa splitRow para manejar celdas entrecomilladas.
 */
function headerContains(csvText: string, column: string): boolean {
  const firstLine = csvText.split(/\r?\n/)[0] ?? "";
  const headers = splitRow(firstLine).map((h) => h.trim());
  return headers.includes(column);
}

function countDataRows(csvText: string): number {
  return csvText.split(/\r?\n/).filter((l) => l.trim().length > 0).length - 1;
}

// ── Función principal ─────────────────────────────────────────────────────────

export function importProjectDataset(
  csvText: string,
  moduleIds: string[],
  municipalityId: string,
  fileName: string,
  projectId: string,
  projectName: string,
): ProjectImportResult {
  const now = new Date().toISOString();
  const rowCount = Math.max(0, countDataRows(csvText));

  const succeeded: StudyImportSuccess[] = [];
  const skipped: StudyImportSkip[] = [];
  const failed: StudyImportFailure[] = [];

  const detectedModules: string[] = [];
  const processedModules: string[] = [];
  const skippedModules: string[] = [];

  for (const moduleId of moduleIds) {
    const module = getMethodologicalModule(moduleId);

    // 1. Verificar que el módulo tiene adaptador REDCap
    if (!module?.adapters?.redcap) {
      skipped.push({ moduleId, reason: "no-redcap-adapter" });
      skippedModules.push(moduleId);
      continue;
    }

    // 2. Verificar que la completedColumn está en la cabecera del CSV
    const completedColumn = module.adapters.redcap.completedColumn;
    if (!headerContains(csvText, completedColumn)) {
      skipped.push({ moduleId, reason: "no-columns" });
      skippedModules.push(moduleId);
      continue;
    }
    detectedModules.push(moduleId);

    // 3. Ejecutar el runner correspondiente
    const runner = RUNNERS[moduleId];
    if (!runner) {
      // Módulo tiene adaptador REDCap pero sin runner implementado (no debería ocurrir)
      skipped.push({ moduleId, reason: "no-columns" });
      skippedModules.push(moduleId);
      continue;
    }

    try {
      const result = runner(csvText, municipalityId, fileName);
      if (result === null) {
        // nValid = 0
        skipped.push({ moduleId, reason: "no-valid-records" });
        skippedModules.push(moduleId);
      } else {
        succeeded.push({ moduleId, atoms: result.atoms, nValid: result.nValid, applyStudy: result.applyStudy });
        processedModules.push(moduleId);
      }
    } catch (err) {
      failed.push({ moduleId, error: err instanceof Error ? err.message : String(err) });
      skippedModules.push(moduleId);
    }
  }

  const metadata: ProjectDatasetImport = {
    id: crypto.randomUUID(),
    projectId,
    projectName,
    fileName,
    importedAt: now,
    rowCount,
    detectedModules,
    processedModules,
    skippedModules,
  };

  return { succeeded, skipped, failed, metadata };
}
