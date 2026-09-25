import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { MunicipalDocument } from "../../domain/repository";
import { classifyUGCIndicator } from "./classifyUGCIndicator";
import type {
  UGCClinicalAssistanceDocumentReading,
  UGCClinicalAssistanceReading,
  UGCClinicalAssistanceSignal,
  UGCDocumentClassification,
  UGCIndicatorNature,
  UGCNominalCoincidence,
} from "./UGCClinicalAssistanceReading";

const AREA_RE = /^ÁREA:\s*(.+)$/i;
const CLASSIFICATION_RE = /^A\s+(mejorar|mantener)\s*:/i;
const INDICATOR_RE = /^Indicador:\s*(.+)$/i;

/** Limitaciones fijas de cada señal: lo que la fuente NO aporta. */
const SIGNAL_LIMITATIONS: string[] = [
  "Señal documental seleccionada por la vigilancia asistencial de la UGC; no es un resultado epidemiológico cuantificado.",
  "Sin valor observado, sin referencia numérica del Distrito, sin desviación típica, sin periodo y sin denominador verificable.",
  "El comparador documental 'Distrito' es de escala sanitaria no identificada en el documento.",
  "Comparabilidad no evaluable; la clasificación 'A mejorar' es autoría del documento, no interpretación de COMPÁS.",
];

const READING_LIMITATIONS: string[] = [
  "N1b agrupa señales documentales por UGC; no es la base epidemiológica poblacional (N1a) ni la sustituye.",
  "No contiene prevalencias, tasas, valores, rankings, diferencias entre UGC ni dirección clínica.",
  "Las coincidencias entre UGC son coincidencias documentales de indicadores seleccionados, no problemas comunes ni prioridades sanitarias.",
  "La escala de todas las señales es UGC; el comparador 'Distrito' queda como distrito sanitario no identificado.",
];

function normalizeDocumentClassification(
  raw: string | undefined
): UGCDocumentClassification {
  if (raw === "mejorar") return "a-mejorar";
  if (raw === "mantener") return "mantener";
  return "unknown";
}

/** Lee la UGC del propio texto ("Unidad de Gestión Clínica: …"). */
function readUgcFromText(sourceText: string): string | undefined {
  const match = sourceText.match(
    /Unidad de Gesti[oó]n Cl[ií]nica:\s*(.+?)\s*$/im
  );
  return match ? match[1].trim() : undefined;
}

function isUgcClinicalAssistanceDocument(doc: MunicipalDocument): boolean {
  if (typeof doc.sourceText !== "string" || doc.sourceText.length === 0) {
    return false;
  }
  if (doc.documentNature === "ugc-clinical-assistance-report") return true;
  // Compatibilidad: documento territorial con texto que declara su UGC.
  return (
    doc.kind === "territorial-documentation" &&
    /Unidad de Gesti[oó]n Cl[ií]nica:/i.test(doc.sourceText)
  );
}

function buildDocumentReading(
  doc: MunicipalDocument,
  municipalityId: string
): UGCClinicalAssistanceDocumentReading {
  const ugc = doc.ugc ?? readUgcFromText(doc.sourceText ?? "") ?? doc.title;
  const lines = (doc.sourceText ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const signals: UGCClinicalAssistanceSignal[] = [];
  const areasInOrder: string[] = [];
  const signalCountByArea: Record<string, number> = {};
  let currentArea = "";
  let currentClassification: UGCDocumentClassification = "unknown";
  let ordinal = 0;

  for (const line of lines) {
    const areaMatch = line.match(AREA_RE);
    if (areaMatch) {
      currentArea = areaMatch[1].trim();
      currentClassification = "unknown";
      if (!areasInOrder.includes(currentArea)) areasInOrder.push(currentArea);
      continue;
    }
    const classificationMatch = line.match(CLASSIFICATION_RE);
    if (classificationMatch) {
      currentClassification = normalizeDocumentClassification(
        classificationMatch[1].toLowerCase()
      );
      continue;
    }
    const indicatorMatch = line.match(INDICATOR_RE);
    if (!indicatorMatch) continue;

    const indicatorName = indicatorMatch[1].trim();
    ordinal += 1;
    const classification = classifyUGCIndicator(indicatorName, currentArea);
    signalCountByArea[currentArea] = (signalCountByArea[currentArea] ?? 0) + 1;

    signals.push({
      id: `${doc.id}#${ordinal}`,
      documentId: doc.id,
      municipalityId,
      ugc,
      territorialScale: "ugc",
      area: currentArea,
      indicatorName,
      ordinal,
      documentClassification: currentClassification,
      documentClassificationStatus: "document-authored-classification",
      indicatorNature: classification.nature,
      classificationBasis: classification.basis,
      denominatorType: classification.denominatorType,
      comparability: "not-evaluable",
      referenceScope: "unknown-sanitary-district",
      sourceFragment: line,
      limitations: SIGNAL_LIMITATIONS,
    });
  }

  const naturesPresent = Array.from(
    new Set(signals.map((signal) => signal.indicatorNature))
  ) as UGCIndicatorNature[];

  return {
    documentId: doc.id,
    municipalityId,
    ugc,
    sourceFileName: doc.sourceFileName,
    territorialScale: "ugc",
    areas: areasInOrder,
    signalCount: signals.length,
    signalCountByArea,
    naturesPresent,
    signals,
    limitations: [...READING_LIMITATIONS],
  };
}

/**
 * Coincidencias NOMINALES de indicadores entre UGCs (coincidencia documental).
 * No es agregación cuantitativa: solo indica en qué UGCs aparece cada nombre.
 */
function buildNominalCoincidences(
  documents: UGCClinicalAssistanceDocumentReading[]
): UGCNominalCoincidence[] {
  const ugcsByName = new Map<string, string[]>();
  for (const document of documents) {
    const seen = new Set<string>();
    for (const signal of document.signals) {
      if (seen.has(signal.indicatorName)) continue;
      seen.add(signal.indicatorName);
      const list = ugcsByName.get(signal.indicatorName) ?? [];
      if (!list.includes(document.ugc)) list.push(document.ugc);
      ugcsByName.set(signal.indicatorName, list);
    }
  }
  const coincidences: UGCNominalCoincidence[] = [];
  for (const [indicatorName, ugcs] of ugcsByName) {
    if (ugcs.length > 1) coincidences.push({ indicatorName, ugcs });
  }
  return coincidences;
}

/**
 * Construye la lectura N1b desde el workspace real, leyendo el `sourceText`
 * íntegro de los informes clínico-asistenciales por UGC. Función pura: no muta
 * el workspace, no crea EvidenceAtoms, no toca N1a/N2/N3/N4.
 */
export function buildUGCClinicalAssistanceReading(
  workspace: MunicipalityWorkspace
): UGCClinicalAssistanceReading {
  const municipalityId = workspace.municipality.identity.id;
  const documents = workspace.repository.documents
    .filter(isUgcClinicalAssistanceDocument)
    .map((doc) => buildDocumentReading(doc, municipalityId));

  const signals = documents.flatMap((document) => document.signals);

  return {
    present: signals.length > 0,
    documents,
    signals,
    nominalCoincidences: buildNominalCoincidences(documents),
    limitations: [...READING_LIMITATIONS],
  };
}
