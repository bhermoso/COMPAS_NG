import { useMemo, useState } from "react";
import {
  addMunicipalDocument,
  type DocumentKind,
  type MunicipalDocumentRepository,
} from "./domain/repository";
import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createEmptyPipelineResult } from "./domain/pipeline";
import "./App.css";

const INITIAL_WORKSPACE = createCompleteMunicipalityWorkspace({
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "COMPÁS NG",
});

const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: "health-report", label: "Informe de Salud" },
  { value: "complementary-study", label: "Estudio complementario" },
  { value: "eas-variable", label: "Variables EAS" },
  { value: "cmi-indicator", label: "CMI / Indicadores" },
  { value: "community-asset", label: "Activos comunitarios" },
  { value: "localiza-salud", label: "Localiza Salud" },
  { value: "redcap-export", label: "REDCap" },
  { value: "territorial-documentation", label: "Documentación territorial" },
  { value: "qualitative-material", label: "Material endocualitativo" },
  { value: "longitudinal-evidence", label: "Evidencia longitudinal" },
  { value: "other", label: "Otro" },
];

export default function App() {
  const [repository, setRepository] =
    useState<MunicipalDocumentRepository>(INITIAL_WORKSPACE.repository);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<DocumentKind>("health-report");

  const workspace = useMemo(
    () => ({
      ...INITIAL_WORKSPACE,
      repository,
      updatedAt: new Date().toISOString(),
    }),
    [repository]
  );

  const pipeline = createEmptyPipelineResult(workspace);

  function handleAddDocument() {
    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    setRepository((currentRepository) =>
      addMunicipalDocument(currentRepository, {
        id: crypto.randomUUID(),
        kind,
        title: cleanTitle,
        source: {
          system: "Carga manual inicial",
          collectedAt: new Date().toISOString(),
        },
        tags: [kind],
      })
    );

    setTitle("");
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="gradient-bar" />
        <p className="eyebrow">COMPÁS NG</p>
        <h1>Infraestructura municipal para Planes Locales de Salud 2027–2030</h1>
        <p className="lead">
          Sistema modular para integrar evidencia, activos, participación,
          planificación estratégica, seguimiento y evaluación.
        </p>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Municipio activo</h2>
          <p><strong>{workspace.municipality.identity.name}</strong></p>
          <p>{workspace.municipality.identity.province}</p>
          <p>INE: {workspace.municipality.identity.ineCode}</p>
        </article>

        <article className="card">
          <h2>Repositorio documental</h2>
          <p><strong>{workspace.repository.documents.length}</strong> documentos registrados</p>
          <p>Entrada única municipal de evidencias.</p>
        </article>

        <article className="card">
          <h2>Grafo de evidencia</h2>
          <p>{workspace.evidence.nodes.length} nodos</p>
          <p>{workspace.evidence.relationships.length} relaciones</p>
        </article>

        <article className="card">
          <h2>Pipeline</h2>
          <ol>
            {pipeline.trace.map((item) => (
              <li key={`${item.stage}-${item.createdAt}`}>
                <strong>{item.stage}</strong>: {item.status}
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Repositorio Documental Municipal</p>
            <h2>Fuentes municipales disponibles</h2>
          </div>
          <p className="panel-note">
            Registra aquí las fuentes que alimentarán el Motor de Evidencia,
            LT1, OIT, Priorización y Plan de Acción.
          </p>
        </div>

        <div className="document-form">
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as DocumentKind)}
          >
            {DOCUMENT_KINDS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Título del documento o fuente"
          />

          <button type="button" onClick={handleAddDocument}>
            Registrar fuente
          </button>
        </div>

        <div className="document-list">
          {repository.documents.length === 0 ? (
            <p className="empty-state">
              Aún no hay documentos registrados. Añade Informe de Salud,
              activos, REDCap, Localiza Salud, CMI u otras fuentes municipales.
            </p>
          ) : (
            repository.documents.map((document) => (
              <article className="document-row" key={document.id}>
                <div>
                  <p className="document-kind">{document.kind}</p>
                  <h3>{document.title}</h3>
                </div>
                <span className="status-pill">{document.status}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
