/**
 * scripts/demo/buildGranadaZaidinWorkspace.ts
 *
 * Reconstrucción reproducible del expediente demo de Granada-Zaidín.
 *
 * Construye el MunicipalityWorkspace del ámbito piloto usando exclusivamente
 * los servicios reales de COMPÁS NG y material fuente preservado en el
 * repositorio. No fabrica datos: todo procede de:
 *
 *   - docs/source-material/territorial-cases/granada-zaidin/  (Informe de Salud,
 *     Informes Vigía, CSV de Localiza Salud auditado)
 *   - fixtures/  (los 13 CSV de estudios complementarios)
 *   - docs/methodology/reconstruction/GRANADA-ZAIDIN-ACTIVOS-LOCALIZA-AUDIT.md §8
 *     (texto normalizado de activos, sin datos personales — RGPD)
 *
 * Reglas respetadas:
 *   - D-HR-01: el Informe de Salud se preserva sin generar EvidenceAtoms.
 *   - Los datos provinciales/externos se etiquetan como evidencia contextual
 *     (proxy) del piloto, nunca como estimación específica del distrito.
 *   - Los Informes Vigía se registran como referencia documental territorial
 *     sin atomizar, para no alterar la línea base de evidencias del piloto.
 *   - Granada-Zaidín es distrito, sin código INE propio.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createCompleteMunicipalityWorkspace } from "../../src/application/workspace";
import { ingestManualDocument } from "../../src/application/document-ingestion";
import { createHealthReportDocumentFromDocx } from "../../src/application/health-report";

import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "../../src/application/ibse";
import { parseDUKECSV, dukeStudyToEvidenceAtoms } from "../../src/application/duke";
import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "../../src/application/predimed";
import { parseSF12CSV, sf12StudyToEvidenceAtoms } from "../../src/application/sf12";
import { parseSuenoCSV, suenoStudyToEvidenceAtoms } from "../../src/application/sueno";
import { parseCAGECSV, cageStudyToEvidenceAtoms } from "../../src/application/cage";
import { parseAUDITCCSV, auditcStudyToEvidenceAtoms } from "../../src/application/auditc";
import { parseIPAQCSV, ipaqStudyToEvidenceAtoms } from "../../src/application/ipaq";
import { parseGHQ12CSV, ghq12StudyToEvidenceAtoms } from "../../src/application/ghq12";
import { parsePHQ9CSV, phq9StudyToEvidenceAtoms } from "../../src/application/phq9";
import { parsePSQICSV, psqiStudyToEvidenceAtoms } from "../../src/application/psqi";
import { parseFagerstromCSV, fagerstromStudyToEvidenceAtoms } from "../../src/application/fagerstrom";
import { parseSBQCSV, sbqStudyToEvidenceAtoms } from "../../src/application/sbq";

import { createIBSEStudy } from "../../src/domain/ibse";
import { createDUKEStudy } from "../../src/domain/duke";
import { createPREDIMEDStudy } from "../../src/domain/predimed";
import { createSF12Study } from "../../src/domain/sf12";
import { createSuenoStudy } from "../../src/domain/sueno";
import { createCAGEStudy } from "../../src/domain/cage";
import { createAUDITCStudy } from "../../src/domain/auditc";
import { createIPAQStudy } from "../../src/domain/ipaq";
import { createGHQ12Study } from "../../src/domain/ghq12";
import { createPHQ9Study } from "../../src/domain/phq9";
import { createPSQIStudy } from "../../src/domain/psqi";
import { createFagerstromStudy } from "../../src/domain/fagerstrom";
import { createSBQStudy } from "../../src/domain/sbq";

import {
  addMunicipalDocument,
  type AddMunicipalDocumentInput,
} from "../../src/domain/repository";
import {
  stableAssetKey,
  upsertEvidenceAtom,
  type EvidenceAtom,
} from "../../src/domain/evidence";
import type { MunicipalityWorkspace } from "../../src/domain/workspace";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = (name: string): string =>
  readFileSync(resolve(repoRoot, "fixtures", name), "utf-8");

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
 * Cautela metodológica del piloto: los estudios usan datos de ámbito provincial
 * de Granada (EAS VI) o de origen externo al distrito, deliberadamente, como
 * contexto de prueba del motor de perfiles.
 */
export const PROXY_CAUTION =
  "Evidencia contextual (proxy) del piloto Granada-Zaidín: datos de ámbito " +
  "provincial de Granada (EAS VI) o de origen externo al distrito. No " +
  "constituyen estimación específica del distrito. Señal contextual para " +
  "orientar la interpretación, pendiente de contraste territorial.";

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

function registerStudy(
  current: MunicipalityWorkspace,
  studyPatch: Partial<MunicipalityWorkspace>,
  document: AddMunicipalDocumentInput,
  atoms: EvidenceAtom[]
): MunicipalityWorkspace {
  const now = new Date().toISOString();
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
    evidenceStore: { ...evidenceStore, updatedAt: now },
    updatedAt: now,
  };
}

function toArrayBuffer(path: string): ArrayBuffer {
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
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

  // ── 2. Los 13 estudios complementarios (fixtures reales + cautela proxy) ──
  const withProxy = (cautions: string[]): string[] => [...cautions, PROXY_CAUTION];

  const ibseParsed = parseIBSECSV(fixture("ibse-granada-provincia.csv"));
  const ibseStudy = createIBSEStudy({ municipalityId, sourceFileName: "ibse-granada-provincia.csv", aggregates: ibseParsed.aggregates, methodologicalCautions: withProxy(ibseParsed.methodologicalCautions) });
  ws = registerStudy(ws, { ibseStudy }, { id: "doc-ibse", kind: "redcap-export", title: "IBSE — Granada provincia (proxy piloto)", sourceFileName: "ibse-granada-provincia.csv", source: { system: "REDCap IBSE · contexto proxy del piloto" }, tags: ["redcap-export", "ibse"] }, ibseStudyToEvidenceAtoms(ibseStudy));

  const dukeParsed = parseDUKECSV(fixture("duke-eas-granada.csv"));
  const dukeStudy = createDUKEStudy({ municipalityId, sourceFileName: "duke-eas-granada.csv", aggregates: dukeParsed.aggregates, methodologicalCautions: withProxy(dukeParsed.methodologicalCautions), warnings: dukeParsed.warnings });
  ws = registerStudy(ws, { dukeStudy }, { id: "doc-duke", kind: "complementary-study", title: "DUKE-EAS — Granada provincia (proxy piloto)", sourceFileName: "duke-eas-granada.csv", source: { system: "EAS Granada · contexto proxy del piloto" }, tags: ["complementary-study", "duke-eas"] }, dukeStudyToEvidenceAtoms(dukeStudy));

  const predimedParsed = parsePREDIMEDCSV(fixture("predimed-eas-granada.csv"));
  const predimedStudy = createPREDIMEDStudy({ municipalityId, sourceFileName: "predimed-eas-granada.csv", aggregates: predimedParsed.aggregates, methodologicalCautions: withProxy(predimedParsed.methodologicalCautions), warnings: predimedParsed.warnings });
  ws = registerStudy(ws, { predimedStudy }, { id: "doc-predimed", kind: "complementary-study", title: "PREDIMED-EAS — Granada provincia (proxy piloto)", sourceFileName: "predimed-eas-granada.csv", source: { system: "EAS Granada · contexto proxy del piloto" }, tags: ["complementary-study", "predimed-eas"] }, predimedStudyToEvidenceAtoms(predimedStudy));

  const sf12Parsed = parseSF12CSV(fixture("sf12-eas-granada.csv"));
  const sf12Study = createSF12Study({ municipalityId, sourceFileName: "sf12-eas-granada.csv", aggregates: sf12Parsed.aggregates, methodologicalCautions: withProxy(sf12Parsed.methodologicalCautions), warnings: sf12Parsed.warnings });
  ws = registerStudy(ws, { sf12Study }, { id: "doc-sf12", kind: "complementary-study", title: "SF-12 EAS — Granada provincia (proxy piloto)", sourceFileName: "sf12-eas-granada.csv", source: { system: "EAS Granada · contexto proxy del piloto" }, tags: ["complementary-study", "sf12-eas"] }, sf12StudyToEvidenceAtoms(sf12Study));

  const suenoParsed = parseSuenoCSV(fixture("sueno-eas-granada.csv"));
  const suenoStudy = createSuenoStudy({ municipalityId, sourceFileName: "sueno-eas-granada.csv", aggregates: suenoParsed.aggregates, methodologicalCautions: withProxy(suenoParsed.methodologicalCautions), warnings: suenoParsed.warnings });
  ws = registerStudy(ws, { suenoStudy }, { id: "doc-sueno", kind: "complementary-study", title: "Sueño EAS — Granada provincia (proxy piloto)", sourceFileName: "sueno-eas-granada.csv", source: { system: "EAS Granada · contexto proxy del piloto" }, tags: ["complementary-study", "sueno-eas"] }, suenoStudyToEvidenceAtoms(suenoStudy));

  const cageParsed = parseCAGECSV(fixture("cage-eas-granada.csv"));
  const cageStudy = createCAGEStudy({ municipalityId, sourceFileName: "cage-eas-granada.csv", aggregates: cageParsed.aggregates, methodologicalCautions: withProxy(cageParsed.methodologicalCautions), warnings: cageParsed.warnings });
  ws = registerStudy(ws, { cageStudy }, { id: "doc-cage", kind: "complementary-study", title: "CAGE-EAS — Granada provincia (proxy piloto)", sourceFileName: "cage-eas-granada.csv", source: { system: "EAS Granada · contexto proxy del piloto" }, tags: ["complementary-study", "cage-eas"] }, cageStudyToEvidenceAtoms(cageStudy));

  const auditcParsed = parseAUDITCCSV(fixture("auditc-municipal.csv"));
  const auditcStudy = createAUDITCStudy({ municipalityId, sourceFileName: "auditc-municipal.csv", aggregates: auditcParsed.aggregates, methodologicalCautions: withProxy(auditcParsed.methodologicalCautions), warnings: auditcParsed.warnings });
  ws = registerStudy(ws, { auditcStudy }, { id: "doc-auditc", kind: "redcap-export", title: "AUDIT-C — origen externo (proxy piloto)", sourceFileName: "auditc-municipal.csv", source: { system: "REDCap AUDIT-C · contexto proxy del piloto" }, tags: ["redcap-export", "auditc"] }, auditcStudyToEvidenceAtoms(auditcStudy));

  const ipaqParsed = parseIPAQCSV(fixture("ipaq-eas-granada.csv"));
  const ipaqStudy = createIPAQStudy({ municipalityId, sourceFileName: "ipaq-eas-granada.csv", aggregates: ipaqParsed.aggregates, methodologicalCautions: withProxy(ipaqParsed.methodologicalCautions), warnings: ipaqParsed.warnings });
  ws = registerStudy(ws, { ipaqStudy }, { id: "doc-ipaq", kind: "complementary-study", title: "IPAQ-EAS — Granada provincia (proxy piloto)", sourceFileName: "ipaq-eas-granada.csv", source: { system: "EAS Granada · contexto proxy del piloto" }, tags: ["complementary-study", "ipaq-eas"] }, ipaqStudyToEvidenceAtoms(ipaqStudy));

  const ghq12Parsed = parseGHQ12CSV(fixture("ghq12-municipal.csv"));
  const ghq12Study = createGHQ12Study({ municipalityId, sourceFileName: "ghq12-municipal.csv", aggregates: ghq12Parsed.aggregates, methodologicalCautions: withProxy(ghq12Parsed.methodologicalCautions), warnings: ghq12Parsed.warnings });
  ws = registerStudy(ws, { ghq12Study }, { id: "doc-ghq12", kind: "redcap-export", title: "GHQ-12 — origen externo (proxy piloto)", sourceFileName: "ghq12-municipal.csv", source: { system: "REDCap GHQ-12 · contexto proxy del piloto" }, tags: ["redcap-export", "ghq12"] }, ghq12StudyToEvidenceAtoms(ghq12Study));

  const phq9Parsed = parsePHQ9CSV(fixture("phq9-municipal.csv"));
  const phq9Study = createPHQ9Study({ municipalityId, sourceFileName: "phq9-municipal.csv", aggregates: phq9Parsed.aggregates, methodologicalCautions: withProxy(phq9Parsed.methodologicalCautions), warnings: phq9Parsed.warnings });
  ws = registerStudy(ws, { phq9Study }, { id: "doc-phq9", kind: "redcap-export", title: "PHQ-9 — origen externo (proxy piloto)", sourceFileName: "phq9-municipal.csv", source: { system: "REDCap PHQ-9 · contexto proxy del piloto" }, tags: ["redcap-export", "phq9"] }, phq9StudyToEvidenceAtoms(phq9Study));

  const psqiParsed = parsePSQICSV(fixture("psqi-municipal.csv"));
  const psqiStudy = createPSQIStudy({ municipalityId, sourceFileName: "psqi-municipal.csv", aggregates: psqiParsed.aggregates, methodologicalCautions: withProxy(psqiParsed.methodologicalCautions), warnings: psqiParsed.warnings });
  ws = registerStudy(ws, { psqiStudy }, { id: "doc-psqi", kind: "redcap-export", title: "PSQI — origen externo (proxy piloto)", sourceFileName: "psqi-municipal.csv", source: { system: "REDCap PSQI · contexto proxy del piloto" }, tags: ["redcap-export", "psqi"] }, psqiStudyToEvidenceAtoms(psqiStudy));

  const fagerstromParsed = parseFagerstromCSV(fixture("fagerstrom-municipal.csv"));
  const fagerstromStudy = createFagerstromStudy({ municipalityId, sourceFileName: "fagerstrom-municipal.csv", aggregates: fagerstromParsed.aggregates, methodologicalCautions: withProxy(fagerstromParsed.methodologicalCautions), warnings: fagerstromParsed.warnings });
  ws = registerStudy(ws, { fagerstromStudy }, { id: "doc-fagerstrom", kind: "redcap-export", title: "Fagerström — origen externo (proxy piloto)", sourceFileName: "fagerstrom-municipal.csv", source: { system: "REDCap Fagerström · contexto proxy del piloto" }, tags: ["redcap-export", "fagerstrom"] }, fagerstromStudyToEvidenceAtoms(fagerstromStudy));

  const sbqParsed = parseSBQCSV(fixture("sbq-municipal.csv"));
  const sbqStudy = createSBQStudy({ municipalityId, sourceFileName: "sbq-municipal.csv", aggregates: sbqParsed.aggregates, methodologicalCautions: withProxy(sbqParsed.methodologicalCautions), warnings: sbqParsed.warnings });
  ws = registerStudy(ws, { sbqStudy }, { id: "doc-sbq", kind: "redcap-export", title: "SBQ — origen externo (proxy piloto)", sourceFileName: "sbq-municipal.csv", source: { system: "REDCap SBQ · contexto proxy del piloto" }, tags: ["redcap-export", "sbq"] }, sbqStudyToEvidenceAtoms(sbqStudy));

  const studyAtoms = ws.evidenceStore.atoms.length;

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

  // ── 4. Informes Vigía — referencia documental territorial (sin atomizar) ──
  for (const path of VIGIA_DOCX) {
    const fileName = path.split(/[\\/]/).pop()!;
    ws = {
      ...ws,
      repository: addMunicipalDocument(ws.repository, {
        id: crypto.randomUUID(),
        kind: "territorial-documentation",
        title: fileName.replace(/\.docx$/i, ""),
        source: {
          system:
            "Referencia documental territorial — texto no atomizado en la reconstrucción",
          collectedAt: new Date().toISOString(),
        },
        sourceFileName: fileName,
        canGenerateEvidence: false,
        tags: ["territorial-documentation"],
      }),
      updatedAt: new Date().toISOString(),
    };
  }

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
      studies: 13,
      studyAtoms,
      localizaAtoms,
      totalAtoms,
      healthReportAtoms,
    },
  };
}
