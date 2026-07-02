import type { MunicipalityWorkspace } from "../../../domain/workspace";

const KEY_PREFIX = "compas-ng:workspace";
const SCHEMA_VERSION = "1.0.0";

export function buildWorkspaceStorageKey(municipalityId: string): string {
  return `${KEY_PREFIX}:${municipalityId}`;
}

export function hasWorkspaceInLocalStorage(municipalityId: string): boolean {
  try {
    return localStorage.getItem(buildWorkspaceStorageKey(municipalityId)) !== null;
  } catch {
    return false;
  }
}

// Tipos documentales canónicos: una sola versión activa por municipio.
// Se aplica al hidratar desde localStorage para sanear datos anteriores
// al commit que introdujo replaceMunicipalDocumentByKind.
const CANONICAL_SINGLE_KINDS = ["health-report", "community-asset"] as const;

function hasCoreWorkspaceCollections(value: unknown): value is MunicipalityWorkspace {
  if (value === null || typeof value !== "object") return false;
  const workspace = value as {
    municipality?: { identity?: { id?: unknown } };
    repository?: { documents?: unknown };
    evidenceStore?: { atoms?: unknown };
  };

  return (
    typeof workspace.municipality?.identity?.id === "string" &&
    Array.isArray(workspace.repository?.documents) &&
    Array.isArray(workspace.evidenceStore?.atoms)
  );
}

// Elimina duplicados de tipos canónicos conservando el documento con
// createdAt más reciente (lexicográfico ISO 8601). En caso de empate,
// prevalece el último del array. Tipos acumulables no se modifican.
function normalizeCanonicalDocuments(
  workspace: MunicipalityWorkspace
): MunicipalityWorkspace {
  if (!hasCoreWorkspaceCollections(workspace)) return workspace;

  const docs = workspace.repository.documents;
  let deduped = [...docs];
  let changed = false;

  for (const kind of CANONICAL_SINGLE_KINDS) {
    const ofKind = deduped.filter((d) => d.kind === kind);
    if (ofKind.length <= 1) continue;

    const toKeep = ofKind.reduce((best, curr) =>
      curr.createdAt >= best.createdAt ? curr : best
    );
    deduped = deduped.filter((d) => d.kind !== kind || d.id === toKeep.id);
    changed = true;
  }

  // Purgar átomos huérfanos: su documentId no existe en el repositorio post-deduplicación.
  const docIds = new Set(deduped.map((d) => d.id));
  const prunedAtoms = workspace.evidenceStore.atoms.filter(
    (a) => a.provenance.documentId === undefined || docIds.has(a.provenance.documentId)
  );
  const atomsChanged = prunedAtoms.length !== workspace.evidenceStore.atoms.length;

  if (!changed && !atomsChanged) return workspace;

  return {
    ...workspace,
    repository: {
      ...workspace.repository,
      documents: deduped,
      updatedAt: new Date().toISOString(),
    },
    evidenceStore: atomsChanged
      ? {
          ...workspace.evidenceStore,
          atoms: prunedAtoms,
          updatedAt: new Date().toISOString(),
        }
      : workspace.evidenceStore,
  };
}

// Elimina originalHtml y bodyHtml antes de serializar para no superar la cuota
// de localStorage (~5 MB). bodyText se preserva; HealthReportViewer lo usa como
// fallback cuando bodyHtml es undefined.
function stripHtmlFields(workspace: MunicipalityWorkspace): MunicipalityWorkspace {
  if (!workspace.healthReport) return workspace;
  const hr = workspace.healthReport;
  return {
    ...workspace,
    healthReport: {
      ...hr,
      body: { ...hr.body, originalHtml: undefined },
      sections: hr.sections.map((sec) => ({
        ...sec,
        bodyHtml: sec.bodyHtml?.includes("<table") ? sec.bodyHtml : undefined,
      })),
    },
  };
}

export function saveWorkspaceToLocalStorage(
  workspace: MunicipalityWorkspace
): boolean {
  try {
    const key = buildWorkspaceStorageKey(workspace.municipality.identity.id);
    localStorage.setItem(key, JSON.stringify(stripHtmlFields(workspace)));
    return true;
  } catch {
    return false;
  }
}

export function loadWorkspaceFromLocalStorage(
  municipalityId: string
): MunicipalityWorkspace | null {
  try {
    const key = buildWorkspaceStorageKey(municipalityId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = JSON.parse(raw) as any;

    // Descartar datos de versiones de esquema distintas
    if (parsed.schemaVersion !== SCHEMA_VERSION) return null;

    // Migrar formato anterior healthReports[] → healthReport singular
    if (Array.isArray(parsed.healthReports)) {
      parsed.healthReport = parsed.healthReports[0] ?? undefined;
      delete parsed.healthReports;
    }

    // Normalizar IBSEStudy: campo añadido en b66193a — rellenar en workspaces anteriores
    if (parsed.ibseStudy && !Array.isArray(parsed.ibseStudy.methodologicalCautions)) {
      parsed.ibseStudy.methodologicalCautions = [];
    }

    if (parsed.dukeStudy && !Array.isArray(parsed.dukeStudy.methodologicalCautions)) {
      parsed.dukeStudy.methodologicalCautions = [];
    }

    if (parsed.dukeStudy && !Array.isArray(parsed.dukeStudy.warnings)) {
      parsed.dukeStudy.warnings = [];
    }

    if (parsed.predimedStudy && !Array.isArray(parsed.predimedStudy.methodologicalCautions)) {
      parsed.predimedStudy.methodologicalCautions = [];
    }

    if (parsed.predimedStudy && !Array.isArray(parsed.predimedStudy.warnings)) {
      parsed.predimedStudy.warnings = [];
    }

    if (parsed.sf12Study && !Array.isArray(parsed.sf12Study.methodologicalCautions)) {
      parsed.sf12Study.methodologicalCautions = [];
    }

    if (parsed.sf12Study && !Array.isArray(parsed.sf12Study.warnings)) {
      parsed.sf12Study.warnings = [];
    }

    if (parsed.suenoStudy && !Array.isArray(parsed.suenoStudy.methodologicalCautions)) {
      parsed.suenoStudy.methodologicalCautions = [];
    }

    if (parsed.suenoStudy && !Array.isArray(parsed.suenoStudy.warnings)) {
      parsed.suenoStudy.warnings = [];
    }

    if (parsed.cageStudy && !Array.isArray(parsed.cageStudy.methodologicalCautions)) {
      parsed.cageStudy.methodologicalCautions = [];
    }

    if (parsed.cageStudy && !Array.isArray(parsed.cageStudy.warnings)) {
      parsed.cageStudy.warnings = [];
    }

    if (parsed.auditcStudy && !Array.isArray(parsed.auditcStudy.methodologicalCautions)) {
      parsed.auditcStudy.methodologicalCautions = [];
    }

    if (parsed.auditcStudy && !Array.isArray(parsed.auditcStudy.warnings)) {
      parsed.auditcStudy.warnings = [];
    }

    if (parsed.ipaqStudy && !Array.isArray(parsed.ipaqStudy.methodologicalCautions)) {
      parsed.ipaqStudy.methodologicalCautions = [];
    }

    if (parsed.ipaqStudy && !Array.isArray(parsed.ipaqStudy.warnings)) {
      parsed.ipaqStudy.warnings = [];
    }

    if (parsed.ghq12Study && !Array.isArray(parsed.ghq12Study.methodologicalCautions)) {
      parsed.ghq12Study.methodologicalCautions = [];
    }

    if (parsed.ghq12Study && !Array.isArray(parsed.ghq12Study.warnings)) {
      parsed.ghq12Study.warnings = [];
    }

    if (parsed.phq9Study && !Array.isArray(parsed.phq9Study.methodologicalCautions)) {
      parsed.phq9Study.methodologicalCautions = [];
    }

    if (parsed.phq9Study && !Array.isArray(parsed.phq9Study.warnings)) {
      parsed.phq9Study.warnings = [];
    }

    if (parsed.psqiStudy && !Array.isArray(parsed.psqiStudy.methodologicalCautions)) {
      parsed.psqiStudy.methodologicalCautions = [];
    }

    if (parsed.psqiStudy && !Array.isArray(parsed.psqiStudy.warnings)) {
      parsed.psqiStudy.warnings = [];
    }

    if (parsed.fagerstromStudy && !Array.isArray(parsed.fagerstromStudy.methodologicalCautions)) {
      parsed.fagerstromStudy.methodologicalCautions = [];
    }

    if (parsed.fagerstromStudy && !Array.isArray(parsed.fagerstromStudy.warnings)) {
      parsed.fagerstromStudy.warnings = [];
    }

    // Migrar kind incorrecto en documentos EAS complementarios (registrados como
    // "redcap-export" antes de la corrección semántica). Los tags son la fuente
    // canónica de identificación; el kind solo afecta al display en el Repositorio.
    if (Array.isArray(parsed.repository?.documents)) {
      const EAS_COMPLEMENTARY_TAGS = new Set(["duke-eas", "predimed-eas", "sf12-eas"]);
      parsed.repository.documents = parsed.repository.documents.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc: any) => {
          if (
            doc.kind === "redcap-export" &&
            Array.isArray(doc.tags) &&
            doc.tags.some((t: string) => EAS_COMPLEMENTARY_TAGS.has(t))
          ) {
            return { ...doc, kind: "complementary-study" };
          }
          return doc;
        }
      );
    }

    // Repair trazabilidad: si existe un study pero no el documento correspondiente
    // en el repositorio, el workspace está en estado inconsistente (atoms huérfanos).
    // Se limpia el study y sus atoms para forzar recarga limpia por el usuario.
    if (Array.isArray(parsed.repository?.documents) && Array.isArray(parsed.evidenceStore?.atoms)) {
      const docs: { tags?: string[] }[] = parsed.repository.documents;
      const hasDocWithTag = (tag: string) =>
        docs.some((d) => Array.isArray(d.tags) && d.tags.includes(tag));

      const studyRepairs: Array<{ studyKey: string; originTag: string; atomOrigin: string }> = [
        { studyKey: "ibseStudy",     originTag: "ibse",        atomOrigin: "ibse" },
        { studyKey: "dukeStudy",     originTag: "duke-eas",    atomOrigin: "complementary-study" },
        { studyKey: "predimedStudy", originTag: "predimed-eas", atomOrigin: "complementary-study" },
        { studyKey: "sf12Study",     originTag: "sf12-eas",    atomOrigin: "complementary-study" },
        { studyKey: "suenoStudy",    originTag: "sueno-eas",   atomOrigin: "complementary-study" },
        { studyKey: "cageStudy",     originTag: "cage-eas",    atomOrigin: "complementary-study" },
        { studyKey: "auditcStudy",   originTag: "auditc",      atomOrigin: "complementary-study" },
        { studyKey: "ipaqStudy",     originTag: "ipaq-eas",    atomOrigin: "complementary-study" },
        { studyKey: "ghq12Study",    originTag: "ghq12",       atomOrigin: "complementary-study" },
        { studyKey: "phq9Study",     originTag: "phq9",        atomOrigin: "complementary-study" },
        { studyKey: "psqiStudy",     originTag: "psqi",        atomOrigin: "complementary-study" },
        { studyKey: "fagerstromStudy", originTag: "fagerstrom", atomOrigin: "complementary-study" },
      ];

      for (const { studyKey, originTag, atomOrigin } of studyRepairs) {
        if (parsed[studyKey] === undefined) continue;
        if (!hasDocWithTag(originTag)) {
          // Study sin documento: limpiar study y atoms derivados
          delete parsed[studyKey];
          parsed.evidenceStore.atoms = parsed.evidenceStore.atoms.filter(
            (a: { provenance?: { origin?: string; documentId?: string }; tags?: string[] }) => {
              if (atomOrigin === "ibse") return a.provenance?.origin !== "ibse";
              return !(
                a.provenance?.origin === "complementary-study" &&
                Array.isArray(a.tags) &&
                a.tags.includes(originTag)
              );
            }
          );
        }
      }

      // También limpiar atoms ibse huérfanos sin ibseStudy (pueden existir de versiones anteriores)
      if (!parsed.ibseStudy) {
        parsed.evidenceStore.atoms = parsed.evidenceStore.atoms.filter(
          (a: { provenance?: { origin?: string } }) => a.provenance?.origin !== "ibse"
        );
      }
    }

    if (!hasCoreWorkspaceCollections(parsed)) return null;

    return normalizeCanonicalDocuments(parsed as MunicipalityWorkspace);
  } catch {
    return null;
  }
}

export function clearWorkspaceFromLocalStorage(municipalityId: string): void {
  try {
    localStorage.removeItem(buildWorkspaceStorageKey(municipalityId));
  } catch {
    // ignorar
  }
}
