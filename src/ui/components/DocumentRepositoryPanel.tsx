import type {
  DocumentKind,
  MunicipalDocument,
  MunicipalDocumentRepository,
} from "../../domain/repository";

const KIND_LABEL: Record<DocumentKind, string> = {
  "health-report": "Informe de Salud",
  "localiza-salud": "Localiza Salud",
  "complementary-study": "Estudio complementario",
  "eas-variable": "Variable EAS",
  "cmi-indicator": "Indicador CMI",
  "community-asset": "Activo comunitario",
  "redcap-export": "Exportación REDCap",
  "territorial-documentation": "Documentación territorial",
  "qualitative-material": "Material cualitativo",
  "longitudinal-evidence": "Evidencia longitudinal",
  other: "Otro documento",
};

const STATUS_LABEL: Record<string, string> = {
  uploaded: "Cargado",
  validated: "Validado",
  rejected: "Rechazado",
  archived: "Archivado",
};

const STUDY_LABEL_BY_TAG: Record<string, string> = {
  ibse: "IBSE",
  "duke-eas": "DUKE-EAS",
  "predimed-eas": "PREDIMED-EAS",
  "sf12-eas": "SF-12 EAS",
  "sueno-eas": "Sueño EAS",
  "cage-eas": "CAGE-EAS",
};

function getDocumentKindLabel(document: MunicipalDocument): string {
  const studyTag = document.tags.find((tag) => STUDY_LABEL_BY_TAG[tag] !== undefined);
  if (studyTag !== undefined) {
    return `${STUDY_LABEL_BY_TAG[studyTag]} · ${KIND_LABEL[document.kind]}`;
  }
  return KIND_LABEL[document.kind] ?? document.kind;
}

// ── Categorías del repositorio documental ─────────────────────────────────────
// Jerarquía institucional:
// 1. Fuente documental primaria (Informe de Salud)
// 2. Estudios complementarios (IBSE, EAS)
// 3. Activos comunitarios y territorio
// 4. Otras fuentes

type DocCategory =
  | "primary-source"
  | "complementary-study"
  | "community-asset"
  | "other-source";

const CATEGORY_LABEL: Record<DocCategory, string> = {
  "primary-source":      "Fuente documental primaria",
  "complementary-study": "Estudios complementarios",
  "community-asset":     "Activos comunitarios",
  "other-source":        "Otras fuentes documentales",
};

function getCategory(document: MunicipalDocument): DocCategory {
  if (document.kind === "health-report") return "primary-source";
  if (document.kind === "community-asset") return "community-asset";
  if (
    document.kind === "complementary-study" ||
    (document.kind === "redcap-export" && document.tags.some((t) => STUDY_LABEL_BY_TAG[t]))
  ) {
    return "complementary-study";
  }
  return "other-source";
}

const CATEGORY_ORDER: DocCategory[] = [
  "primary-source",
  "complementary-study",
  "community-asset",
  "other-source",
];

const STUDY_TAG_ORDER: Record<string, number> = {
  ibse: 0,
  "duke-eas": 1,
  "predimed-eas": 2,
  "sf12-eas": 3,
  "sueno-eas": 4,
  "cage-eas": 5,
};

function sortWithinCategory(docs: MunicipalDocument[]): MunicipalDocument[] {
  return [...docs].sort((a, b) => {
    const ta = Math.min(...a.tags.map((t) => STUDY_TAG_ORDER[t] ?? 99));
    const tb = Math.min(...b.tags.map((t) => STUDY_TAG_ORDER[t] ?? 99));
    return ta - tb;
  });
}

interface DocumentRepositoryPanelProps {
  repository: MunicipalDocumentRepository;
  onDelete?: (documentId: string) => void;
}

export function DocumentRepositoryPanel({ repository, onDelete }: DocumentRepositoryPanelProps) {
  // Agrupar por categoría
  const grouped = new Map<DocCategory, MunicipalDocument[]>();
  for (const cat of CATEGORY_ORDER) {
    grouped.set(cat, []);
  }
  for (const doc of repository.documents) {
    const cat = getCategory(doc);
    grouped.get(cat)!.push(doc);
  }

  const totalDocuments = repository.documents.length;

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Repositorio documental</p>
          <h2>
            Documentos registrados
            {totalDocuments > 0 && (
              <span className="doc-repo__count">{totalDocuments}</span>
            )}
          </h2>
        </div>
        <p className="panel-note">
          Fuentes documentales cargadas en este espacio de trabajo municipal.
          Cada documento alimenta el análisis territorial según su tipo.
        </p>
      </div>

      {totalDocuments === 0 ? (
        <p className="empty-state">
          Todavía no hay documentos registrados. Usa el panel superior para
          añadir el primero.
        </p>
      ) : (
        <>
          {CATEGORY_ORDER.map((cat) => {
            const docs = sortWithinCategory(grouped.get(cat) ?? []);
            if (docs.length === 0) return null;
            return (
              <div key={cat} className="doc-repo__group">
                <p className="doc-repo__group-label">{CATEGORY_LABEL[cat]}</p>
                <div className="document-list">
                  {docs.map((document) => (
                    <article
                      className={`document-row${document.kind === "health-report" ? " document-row--primary" : ""}`}
                      key={document.id}
                      data-document-kind={document.kind}
                      data-document-tags={document.tags.join(" ")}
                    >
                      <div>
                        <p className="document-kind">
                          {getDocumentKindLabel(document)}
                        </p>
                        <h3>
                          {document.title}
                          {document.kind === "health-report" && (
                            <span className="doc-repo__primary-badge">
                              Documento fuente principal
                            </span>
                          )}
                        </h3>
                        {document.source.system && (
                          <p className="doc-repo__source">{document.source.system}</p>
                        )}
                      </div>
                      <div className="doc-repo__actions">
                        <span className="status-pill">
                          {STATUS_LABEL[document.status] ?? document.status}
                        </span>
                        {onDelete && (
                          <button
                            type="button"
                            className="doc-repo__delete"
                            onClick={() => {
                              if (window.confirm(
                                `¿Eliminar «${document.title}»?\nSe borrarán también sus evidencias derivadas.`
                              )) {
                                onDelete(document.id);
                              }
                            }}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </section>
  );
}
