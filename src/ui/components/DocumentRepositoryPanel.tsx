import { FrameworkReference } from "./FrameworkReference";
import { DocumentReference } from "./Documentation";
import type {
  MunicipalDocument,
  MunicipalDocumentRepository,
} from "../../domain/repository";
import { DocumentAccess } from './DocumentAccess.tsx';
import { getCategory, KIND_LABEL, STUDY_LABEL_BY_TAG } from "./documentRepositoryCategorization";

const STATUS_LABEL: Record<string, string> = {
  uploaded: "Cargado",
  validated: "Validado",
  rejected: "Rechazado",
  archived: "Archivado",
};

function getDocumentKindLabel(document: MunicipalDocument): string {
  if (document.kind === 'territorial-documentation' && document.sourceText?.includes('VIGILANCIA INTEGRAL DE LA SALUD')) return 'Informe de Vigilancia Integral de la Salud · UGC';
  const studyTag = document.tags.find((tag) => STUDY_LABEL_BY_TAG[tag] !== undefined);
  if (studyTag !== undefined) {
    return `${STUDY_LABEL_BY_TAG[studyTag]} · ${KIND_LABEL[document.kind]}`;
  }
  return KIND_LABEL[document.kind] ?? document.kind;
}

const STUDY_TAG_ORDER: Record<string, number> = {
  ibse: 0,
  "duke-eas": 1,
  "predimed-eas": 2,
  "sf12-eas": 3,
  "sueno-eas": 4,
  "cage-eas": 5,
  auditc: 6,
  "ipaq-eas": 7,
  ghq12: 8,
  phq9: 9,
  psqi: 10,
  fagerstrom: 11,
  sbq: 12,
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

function DocumentRow({
  document,
  onDelete,
}: {
  document: MunicipalDocument;
  onDelete?: (documentId: string) => void;
}) {
  return (
    <article
      className="document-row"
      data-document-kind={document.kind}
      data-document-tags={document.tags.join(" ")}
    >
      <div>
        <p className="document-kind">
          {getDocumentKindLabel(document)}
        </p>
        <h3><DocumentReference documentId={document.id}>{document.title}</DocumentReference></h3>
        {document.source.system && (
          <p className="doc-repo__source">{document.source.system}</p>
        )}
      </div>
      <div className="doc-repo__actions">
        <span className="status-pill">
          {document.status === 'uploaded' ? 'Registrado' : STATUS_LABEL[document.status] ?? document.status}
        </span>
        {onDelete && (
          <button
            type="button"
            className="doc-repo__delete"
            onClick={() => {
              if (
                window.confirm(
                  `¿Eliminar «${document.title}»?\nSe borrarán también sus evidencias derivadas.`
                )
              ) {
                onDelete(document.id);
              }
            }}
          >
            Eliminar
          </button>
        )}
      </div>
      <DocumentAccess document={document} />
    </article>
  );
}

export function DocumentRepositoryPanel({ repository, onDelete }: DocumentRepositoryPanelProps) {
  // Solo muestra "otras fuentes documentales" — las capas 1–3 (Informe de Salud,
  // Estudios complementarios, Activos para la salud) tienen sus propios paneles.
  const otherDocs = sortWithinCategory(
    repository.documents.filter((d) => getCategory(d) === "other-source")
  );

  // Los marcos estratégicos y normativos se muestran aparte: son insumo de la
  // fase de Plan de Acción / Plan Local de Salud, no evidencia diagnóstica.
  const strategicDocs = sortWithinCategory(
    repository.documents.filter((d) => getCategory(d) === "strategic-input")
  );

  return (
    <>
      <section className="workspace-panel">
        <h2>Todos los documentos del expediente</h2>
        <p>Consulta los originales, el texto conservado y las referencias de todas las categorías. <strong>Registrar un documento no implica conservar su archivo ni aprobarlo.</strong></p>
        <p>Los archivos que incorpores se conservan en este navegador. <strong>Para trasladarlos a otro equipo,</strong> utiliza «Copias y recuperación del trabajo» y descarga la copia con originales.</p>
        <details><summary>Abrir catálogo completo · {repository.documents.length} documentos</summary>
          <div className="document-list">{repository.documents.map(document=><DocumentRow key={document.id} document={document} onDelete={onDelete}/>)}</div>
        </details>
      </section>
      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Diagnóstico territorial</p>
            <h2>
              Otras fuentes documentales
              {otherDocs.length > 0 && (
                <span className="doc-repo__count">{otherDocs.length}</span>
              )}
            </h2>
          </div>
          <p className="panel-note">
            Memorias, planes, diagnósticos sectoriales, encuestas y otros documentos
            incorporados al análisis territorial del ámbito.
          </p>
        </div>

        {otherDocs.length === 0 ? (
          <p className="empty-state">
            No hay fuentes documentales adicionales registradas.
            Puedes incorporar memorias de actividades, planes locales, diagnósticos de
            barrio u otros documentos de contexto desde el formulario inferior.
          </p>
        ) : (
          <div className="document-list">
            {otherDocs.map((document) => (
              <DocumentRow key={document.id} document={document} onDelete={onDelete} />
            ))}
          </div>
        )}
      </section>

      {strategicDocs.length > 0 && (
        <section className="workspace-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Insumos para planificación</p>
              <h2>
                Marcos estratégicos para Plan de Acción
                <span className="doc-repo__count">{strategicDocs.length}</span>
              </h2>
            </div>
            <p className="panel-note">
              Marcos estratégicos y normativos de referencia (<FrameworkReference name="epvsa" />, <FrameworkReference name="esca" />, planes
              autonómicos). Son insumo para la fase de Plan de Acción / Plan Local
              de Salud: no forman parte de la evidencia diagnóstica del Perfil ni
              generan conclusiones o recomendaciones dentro de él.
            </p>
          </div>
          <div className="document-list">
            {strategicDocs.map((document) => (
              <DocumentRow key={document.id} document={document} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
