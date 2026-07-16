/**
 * LocalHealthProfileCompiler
 *
 * Transforma un LocalHealthProfile en estado "validated" en un
 * LocalHealthProfileArtifact (PSL-C): documento institucional exportable,
 * inmutable y trazable.
 *
 * Contratos garantizados (CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER):
 *  - No modifica el PSL origen.
 *  - No accede al EvidenceStore ni al MunicipalDocumentRepository.
 *  - No produce texto narrativo nuevo.
 *  - No lanza excepciones: devuelve CompilationResult tipado.
 *  - El artefacto resultante tiene isCongealed: true (invariante).
 *  - Toda la información proviene del LocalHealthProfile.
 */

import type { LocalHealthProfile, PerfilLocalDeSalud } from "../../domain/health-profile";
import type {
  EKCSnapshot,
  LocalHealthProfileArtifact,
  PSLCArtifactAreaIntervencion,
  PSLCArtifactCandidatura,
  PSLCArtifactCierreInterpretativo,
  PSLCArtifactHipotesis,
  PSLCArtifactPreguntaAbierta,
} from "../../domain/health-profile-artifact";
import { computePerfilEstadoGlobal, institutionalHealthReportTitle } from "../health-profile";
import type { DiagnosticAnswers } from "../health-profile";
import {
  buildPSLCCanonicalDocument,
  sealCanonicalDocument,
  type PSLCCanonicalDocument,
} from "../psl-c-canonical";

// ── Tipos públicos ─────────────────────────────────────────────────────────────

export interface CompileLocalHealthProfileInput {
  psl: LocalHealthProfile;
  compiledBy?: string;
  municipalityName: string;
  municipalityProvince: string;
  /** Número de artefactos ya compilados para este municipio (para el versioning). */
  existingArtifactCount: number;
  /** PerfilLocalDeSalud opcional. Si se pasa, el artefacto incluye EKC snapshot,
   *  hipótesis activas y preguntas abiertas congeladas desde el perfil. */
  perfil?: PerfilLocalDeSalud;
  /** Instantánea de respuestas diagnósticas del expediente. Si se pasa, el
   *  artefacto congela el documento canónico (esquema 2). Aditivo: al omitirse,
   *  la compilación mantiene su forma legacy sin `canonicalDocument`. */
  diagnosticAnswers?: DiagnosticAnswers;
}

export interface CompilationViolation {
  gate: string;
  message: string;
}

export type CompilationResult =
  | { ok: true; artifact: LocalHealthProfileArtifact }
  | { ok: false; violations: CompilationViolation[] };

// ── Validación de precondiciones ──────────────────────────────────────────────

export function validateCompilationPreconditions(
  psl: LocalHealthProfile
): CompilationViolation[] {
  const violations: CompilationViolation[] = [];

  if (psl.status !== "validated") {
    violations.push({
      gate: "G-LHC-1",
      message: `El PSL debe estar en estado "validated". Estado actual: "${psl.status}".`,
    });
  }

  // G-LHC-2 (autoría de `conclusiones`) y G-LHC-6 (contenido de `conclusiones`)
  // RETIRADOS en el Paso 4 (Art. 16: el cuerpo diagnóstico es compilado y
  // trazable, no editable a mano; su dignidad la garantiza el documento canónico
  // compilado, no la autoría de un string de capítulos). La autoría humana se
  // conserva sobre el cierre interpretativo (G-LHC-3 / G-LHC-7).

  if (psl.cierreInterpretativo.status !== "authored") {
    violations.push({
      gate: "G-LHC-3",
      message: `El cierre interpretativo (bloque institucional no capitular) debe estar en estado "authored". Estado actual: "${psl.cierreInterpretativo.status}".`,
    });
  }

  if (psl.priorizacionStatus !== "complete") {
    violations.push({
      gate: "G-LHC-4",
      message: `La priorización (bloque de preparación deliberativa) debe estar en estado "complete". Estado actual: "${psl.priorizacionStatus}".`,
    });
  }

  if (!psl.priorizacion.consensoDocumentado) {
    violations.push({
      gate: "G-LHC-5",
      message: "El consenso del Grupo Motor debe estar documentado (consensoDocumentado: true).",
    });
  }

  // G-LHC-6 RETIRADO en el Paso 4 (ver nota junto a G-LHC-2).

  if (!psl.cierreInterpretativo.content.trim()) {
    violations.push({
      gate: "G-LHC-7",
      message: "El cierre interpretativo no puede estar vacío.",
    });
  }

  // G-LHC-8: Regla N+1 (Art. 7 bis A / I-LHPM-7). El Informe de Salud es el
  // componente N; por sí solo no es un Perfil. Hay Perfil solo si concurre al
  // menos UNA fuente adicional (+1) de las tres familias válidas: estudios
  // complementarios, activos y capacidades, o priorización ciudadana. Si no
  // existe ninguna fuente +1 válida, el producto es el Informe de Salud —no un
  // Perfil— aunque el expediente tenga átomos de un origen no elegible: la
  // compilación se bloquea. (El bloqueo depende de la PRESENCIA del +1, no del
  // recuento de átomos.)
  if (!hasPlusOneSource(psl)) {
    violations.push({
      gate: "G-LHC-8",
      message:
        "Regla N+1 (I-LHPM-7): sin ninguna fuente adicional válida (estudios " +
        "complementarios, activos o priorización ciudadana), el producto es el " +
        "Informe de Salud, no un Perfil de Salud Local.",
    });
  }

  return violations;
}

/**
 * Presencia de al menos una fuente adicional (+1) de la regla N+1 (Art. 7 bis A):
 * estudios complementarios, activos y capacidades, o priorización ciudadana.
 * El Informe de Salud es el componente N y no cuenta como +1.
 */
function hasPlusOneSource(psl: LocalHealthProfile): boolean {
  const estudios = psl.complementaryStudyCount > 0;
  const activos = psl.assetCount > 0;
  const priorizacionCiudadana =
    psl.thematicPrioritisationPresent ||
    psl.priorizacion.hasParticipatorySelection;
  return estudios || activos || priorizacionCiudadana;
}

/**
 * Gate estructural del cuerpo compilado (G-LHC-9, Paso 4). Sustituye a G-LHC-2/6:
 * el cuerpo diagnóstico es compilado, así que la garantía de dignidad recae sobre
 * la estructura y la trazabilidad del documento, no sobre la autoría de un string
 * de capítulos.
 *
 * - Camino canónico (esquema 2): el documento debe tener cabecera, bloques de
 *   fuente y cierre; procedencia diagnóstica y snapshot de priorización sellados;
 *   y coherencia readingStatus↔territorialReadings (`integrated` ⇒ hay hilos;
 *   `prioritization-pending` ⇒ 0 hilos, no se fabrica lectura).
 * - Camino legacy (sin documento canónico): fallback estructural — el cuerpo
 *   principal (`conclusiones.content`) no puede quedar vacío, de modo que ninguna
 *   vía abra la compilación de un cuerpo vacío tras retirar G-LHC-2/6.
 */
export function validateCompiledBody(
  canonicalDoc: PSLCCanonicalDocument | undefined,
  psl: LocalHealthProfile
): CompilationViolation[] {
  const violations: CompilationViolation[] = [];
  const fail = (message: string): void => {
    violations.push({ gate: "G-LHC-9", message });
  };

  if (canonicalDoc === undefined) {
    // Fallback legacy: sin documento canónico, el cuerpo compilado es el string de
    // conclusiones; no puede quedar vacío.
    if (!psl.conclusiones.content.trim()) {
      fail(
        "El cuerpo principal del Perfil está vacío y el expediente no compila " +
          "documento canónico (esquema legacy): no puede generarse un artefacto " +
          "institucional con cuerpo vacío."
      );
    }
    return violations;
  }

  const { editorialView, readingStatus, provenance } = canonicalDoc;

  // 1. Estructura mínima digna: cabecera, bloques de fuente y cierre.
  if (editorialView.header.title.trim().length === 0) {
    fail("El documento canónico no tiene cabecera (título vacío).");
  }
  if (editorialView.sourceBlocks.length === 0) {
    fail("El documento canónico no tiene bloques de fuente.");
  }
  if (editorialView.closing.length === 0) {
    fail("El documento canónico no tiene cierre.");
  }

  // 2. Trazabilidad: procedencia diagnóstica y snapshot de priorización sellados.
  if (provenance?.diagnosticAnswersSnapshot === undefined) {
    fail(
      "El documento canónico no sella la procedencia diagnóstica (trazabilidad ausente)."
    );
  }
  if (provenance?.prioritizationSnapshot === undefined) {
    fail("El documento canónico no sella la instantánea de priorización.");
  }

  // 3. Coherencia readingStatus ↔ territorialReadings.
  if (
    readingStatus === "integrated" &&
    editorialView.territorialReadings.length === 0
  ) {
    fail(
      "Incoherencia: readingStatus 'integrated' sin ningún hilo territorial."
    );
  }
  if (
    readingStatus === "prioritization-pending" &&
    editorialView.territorialReadings.length > 0
  ) {
    fail(
      "Incoherencia: readingStatus 'prioritization-pending' con hilos territoriales " +
        "(el documento no debe fabricar lectura)."
    );
  }

  return violations;
}

// ── Hash determinista del PSL ─────────────────────────────────────────────────
// Identifica de forma única el estado del PSL en el momento de compilación.
// Usa los campos que constituyen el contenido del diagnóstico y la validación.
// No usa crypto para evitar dependencias externas en el dominio.

export function computePSLHash(psl: LocalHealthProfile): string {
  const payload = [
    psl.id,
    psl.version,
    psl.evidenceStoreVersion,
    psl.status,
    psl.totalEvidenceAtoms.toString(),
    psl.conclusiones.content,
    psl.conclusiones.status,
    psl.cierreInterpretativo.content,
    psl.cierreInterpretativo.status,
    psl.priorizacionStatus,
    psl.priorizacion.consensoDocumentado.toString(),
    psl.priorizacion.deliberacionNota,
    psl.priorizacion.tematicasSeleccionadasIds.join(","),
    psl.areasDeIntervencion.map((a) => a.id).join(","),
    psl.validatedAt ?? "",
    psl.validatedBy ?? "",
  ].join("|");

  // djb2 hash: determinista, sin dependencias externas, suficiente para auditoría.
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) ^ payload.charCodeAt(i);
    hash = hash >>> 0; // mantiene 32 bits sin signo
  }
  return `psl-${hash.toString(16).padStart(8, "0")}`;
}

// ── Compilador ────────────────────────────────────────────────────────────────

export function compileLocalHealthProfile(
  input: CompileLocalHealthProfileInput
): CompilationResult {
  const { psl, compiledBy, municipalityName, municipalityProvince, existingArtifactCount } = input;

  const violations = validateCompilationPreconditions(psl);
  if (violations.length > 0) {
    return { ok: false, violations };
  }

  const compiledAt = new Date().toISOString();
  const artifactVersion = `PSL-C/v${existingArtifactCount + 1}`;
  const sourceHash = computePSLHash(psl);

  // ── Documento canónico congelado (esquema 2) ───────────────────────────────
  // Se hornea desde la instantánea de respuestas diagnósticas, no del estado
  // vivo. La fecha se pre-formatea de forma determinista dentro del builder.
  const canonicalDoc =
    input.diagnosticAnswers !== undefined
      ? buildPSLCCanonicalDocument({
          answers: input.diagnosticAnswers,
          territory: municipalityName,
          status: psl.status,
          // Paridad de cabecera (paso 3): se sella el título INSTITUCIONAL del
          // Informe, el mismo transform que usan pantalla y export, no el crudo.
          informeTitulo:
            psl.healthReportTitle !== undefined
              ? institutionalHealthReportTitle(
                  psl.municipalityId,
                  psl.healthReportTitle
                )
              : undefined,
          generatedAtISO: psl.generatedAt,
          // Contexto compilado (Paso 4): el documento canónico decide readingStatus
          // y sella la priorización solo con estos campos, sin acceder al PSL.
          pslContext: {
            totalEvidenceAtoms: psl.totalEvidenceAtoms,
            complementaryStudyCount: psl.complementaryStudyCount,
            assetCount: psl.assetCount,
            hasParticipatoryPrioritisation:
              psl.thematicPrioritisationPresent ||
              psl.priorizacion.hasParticipatorySelection,
            prioritizacion: psl.priorizacion,
          },
        })
      : undefined;

  // ── Gate estructural del cuerpo compilado (Paso 4, en lugar de G-LHC-2/6) ───
  // Retirada la autoría sobre `conclusiones`, la dignidad del Perfil ya no la
  // garantiza un string de capítulos sino el cuerpo COMPILADO. El gate se aplica
  // SIEMPRE (también al camino legacy sin documento canónico), para que ninguna
  // vía permita compilar un cuerpo principal vacío tras retirar G-LHC-2/6.
  const bodyViolations = validateCompiledBody(canonicalDoc, psl);
  if (bodyViolations.length > 0) {
    return { ok: false, violations: bodyViolations };
  }

  const canonicalDocument =
    canonicalDoc !== undefined ? sealCanonicalDocument(canonicalDoc) : undefined;

  // ── Puente PerfilLocalDeSalud ──────────────────────────────────────────────
  let ekcSnapshot: EKCSnapshot | null = null;
  let hipotesisActivas: PSLCArtifactHipotesis[] = [];
  let preguntasAbiertasPerfil: PSLCArtifactPreguntaAbierta[] = [];
  let generatedFromPerfilId: string | null = null;

  if (input.perfil) {
    const perfil = input.perfil;
    const estado = computePerfilEstadoGlobal(perfil);

    ekcSnapshot = {
      capturedAt: compiledAt,
      interpretacionesActivas: estado.interpretacionesActivas,
      interpretacionesSuperadas: estado.interpretacionesSuperadas,
      hipotesisActivas: estado.hipotesisActivas,
      hipotesisResueltas: estado.hipotesisResueltas,
      hipotesisDescartadas: estado.hipotesisDescartadas,
      preguntasAbiertas: estado.preguntasAbiertas,
      preguntasResueltas: estado.preguntasResueltas,
      tieneSintesis: estado.tieneSintesis,
      alertasGlobalesCount: estado.alertasGlobales.length,
      ultimaActualizacion: estado.ultimaActualizacion,
    };

    hipotesisActivas = perfil.hipotesis
      .filter(h => h.status === "activa")
      .map(h => ({
        enunciado: h.enunciado,
        plausibilidad: h.plausibilidad,
        espacio: h.espacio,
        formuladaEn: h.formuladaEn,
        autorNombre: h.autorNombre,
      }));

    preguntasAbiertasPerfil = perfil.preguntasAbiertas
      .filter(pq => pq.status === "abierta")
      .map(pq => ({
        formulacion: pq.formulacion,
        relevancia: pq.relevancia,
        urgencia: pq.urgencia,
        espacio: pq.espacio,
        creadaEn: pq.creadaEn,
      }));

    generatedFromPerfilId = perfil.id;
  }

  const areasDeIntervencion: PSLCArtifactAreaIntervencion[] = psl.areasDeIntervencion.map(
    (area) => ({
      title: area.title,
      rationale: area.rationale,
      cautions: [...area.cautions],
    })
  );

  const candidaturasTecnicas: PSLCArtifactCandidatura[] =
    psl.priorizacion.candidaturasTecnicas.map((c) => ({
      title: c.title,
      rationale: c.rationale,
    }));

  const artifact: LocalHealthProfileArtifact = {
    // ── Identidad ──────────────────────────────────────────────────────────
    id: crypto.randomUUID(),
    municipalityId: psl.municipalityId,
    artifactVersion,
    compiledAt,
    compiledBy,

    // ── Trazabilidad ───────────────────────────────────────────────────────
    sourcePSLId: psl.id,
    sourcePSLVersion: psl.version,
    sourcePSLEvidenceStoreVersion: psl.evidenceStoreVersion,
    sourceHash,
    evidenceAtomIds: [...psl.evidenceAtomIds],

    // ── Portada ────────────────────────────────────────────────────────────
    portada: {
      municipalityName,
      municipalityProvince,
      compiledAt,
      artifactVersion,
    },

    // ── Identificación municipal ───────────────────────────────────────────
    identificacionMunicipal: {
      municipalityId: psl.municipalityId,
      municipalityName,
      municipalityProvince,
      pslGeneratedAt: psl.generatedAt,
      pslValidatedAt: psl.validatedAt,
      pslValidatedBy: psl.validatedBy,
    },

    // ── Bloque: Marco estratégico ─────────────────────────────────────────
    marcoEstrategico: {
      sectionIds: [...psl.strategicFrameworkSectionIds],
    },

    // ── Bloque: Informe de Salud — referencia, no contenido ─────────────
    informeSalud: {
      documentId: psl.healthReportDocumentId,
      title: psl.healthReportTitle,
      sectionCount: psl.healthReportSectionCount,
      atomCount: psl.healthReportAtomCount,
    },

    // ── Bloque: Base documental ─────────────────────────────────────────
    baseDocumental: {
      totalEvidenceAtoms: psl.totalEvidenceAtoms,
      integrityErrors: psl.integrityErrors,
      integrityWarnings: psl.integrityWarnings,
      atomsByOrigin: { ...psl.atomsByOrigin },
      atomsByKind: { ...psl.atomsByKind },
      originsSummary: [...psl.originsSummary],
      complementaryStudyCount: psl.complementaryStudyCount,
      ibsePresent: psl.ibsePresent,
      dukePresent: psl.dukePresent,
      predimedPresent: psl.predimedPresent,
      sf12Present: psl.sf12Present,
      suenoPresent: psl.suenoPresent,
      cagePresent: psl.cagePresent,
      auditcPresent: psl.auditcPresent,
      ipaqPresent: psl.ipaqPresent,
      ghq12Present: psl.ghq12Present,
      phq9Present: psl.phq9Present,
      psqiPresent: psl.psqiPresent,
      fagerstromPresent: psl.fagerstromPresent,
      sbqPresent: psl.sbqPresent,
      thematicPrioritisationPresent: psl.thematicPrioritisationPresent,
    },

    // ── Bloque: Lectura territorial ──────────────────────────────────────
    lecturaTerritorial: {
      territorialSummary: psl.territorialSummary,
      determinantCount: psl.determinantCount,
      assetCount: psl.assetCount,
      indicatorCount: psl.indicatorCount,
      qualitativeFindingCount: psl.qualitativeFindingCount,
      methodologicalCautionCount: psl.methodologicalCautionCount,
      preliminaryOpportunities: [...psl.preliminaryOpportunities],
      longitudinalActive: psl.longitudinalActive,
      longitudinalNote: psl.longitudinalNote,
      longitudinalEvidenceCount: psl.longitudinalEvidenceCount,
      marcosAplicados: psl.marcosAplicados.map((m) => ({ ...m })),
      tensionesEstructurales: [...psl.tensionesEstructurales],
      limitacionesDiagnosticas: [...(psl.limitacionesDiagnosticas ?? [])],
      tensionesEscaladasCount: psl.tensionesEscaladas.length,
      tensionesNoEscaladasCount: psl.tensionesNoEscaladas.length,
      ruidoEstructuralCount: psl.ruidoEstructural.length,
      conflictosCount: psl.conflictos.length,
      areasDeIntervencion,
    },

    // ── Documento del Perfil (seis capítulos narrativos) — autoría humana ─────────────────────────────
    conclusiones: {
      content: psl.conclusiones.content,
    },

    // ── Bloque: Cierre interpretativo (no capitular) — autoría humana ──────────────────
    cierreInterpretativo: {
      content: psl.cierreInterpretativo.content,
    } satisfies PSLCArtifactCierreInterpretativo,

    // ── Bloque: Priorización — preparación deliberativa ────────────────────────────────────────────
    priorizacion: {
      candidaturasTecnicas,
      hasTechnicalCandidatures: psl.priorizacion.hasTechnicalCandidatures,
      tematicasSeleccionadasLabels: [...psl.priorizacion.tematicasSeleccionadasLabels],
      hasParticipatorySelection: psl.priorizacion.hasParticipatorySelection,
      deliberacionNota: psl.priorizacion.deliberacionNota,
      consensoDocumentado: psl.priorizacion.consensoDocumentado,
      priorizacionStatus: psl.priorizacionStatus,
    },

    // ── Nota de validación ─────────────────────────────────────────────────
    notaValidacion: {
      pslValidatedAt: psl.validatedAt,
      pslValidatedBy: psl.validatedBy,
      compiledAt,
      compiledBy,
      sourcePSLId: psl.id,
      sourceHash,
    },

    // ── Cautelas metodológicas ─────────────────────────────────────────────
    cautelasMetodologicas: {
      integrityErrors: psl.integrityErrors,
      integrityWarnings: psl.integrityWarnings,
      hasCautelas: psl.integrityWarnings > 0 || psl.integrityErrors > 0,
      nota:
        "Este documento ha sido generado por COMPÁS NG a partir de evidencia " +
        "estructurada y contenido de autoría humana. Las interpretaciones " +
        "territoriales y las áreas de intervención son propuestas técnicas " +
        "que requieren validación institucional. COMPÁS NG no adopta decisiones " +
        "de planificación; facilita su fundamentación.",
    },

    // ── Puente PerfilLocalDeSalud → PSL-C ─────────────────────────────────
    ekcSnapshot,
    hipotesisActivas,
    preguntasAbiertas: preguntasAbiertasPerfil,
    generatedFromPerfilId,

    // ── Documento canónico congelado (esquema 2, aditivo) ─────────────────
    ...(canonicalDocument !== undefined ? { canonicalDocument } : {}),

    // ── Invariante ────────────────────────────────────────────────────────
    isCongealed: true,
  };

  return { ok: true, artifact };
}
