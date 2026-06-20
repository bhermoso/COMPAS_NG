import { useMemo, useState } from "react";
import {
  addMunicipalDocument,
  type DocumentKind,
  type MunicipalDocument,
  type MunicipalDocumentRepository,
} from "./domain/repository";
import {
  createEvidenceStore,
  type EvidenceStore,
} from "./domain/evidence";
import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createEmptyPipelineResult } from "./domain/pipeline";
import { transformDocumentToEvidence } from "./application/evidence-pipeline";
import { generateLT1 } from "./application/lt1";
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

  const [evidenceStore, setEvidenceStore] = useState<EvidenceStore>(
    createEvidenceStore(INITIAL_WORKSPACE.municipality.identity.id)
  );

  const [title, setTitle] = useState("");
  const [plainText, setPlainText] = useState("");
  const [kind, setKind] = useState<DocumentKind>("health-report");
  const [lastProcessedDocument, setLastProcessedDocument] =
    useState<MunicipalDocument | null>(null);

  const workspace = useMemo(
    () => ({
      ...INITIAL_WORKSPACE,
      repository,
      evidence: INITIAL_WORKSPACE.evidence,
      updatedAt: new Date().toISOString(),
    }),
    [repository]
  );

  const pipeline = createEmptyPipelineResult(workspace);
  const lt1 = generateLT1(evidenceStore);

  function handleProcessDocument() {
    const cleanTitle = title.trim();
    const cleanText = plainText.trim();

    if (!cleanTitle || !cleanText) return;

    const documentId = crypto.randomUUID();

    const nextRepository = addMunicipalDocument(repository, {
      id: documentId,
      kind,
      title: cleanTitle,
      source: {
        system: "Entrada manual inicial",
        collectedAt: new Date().toISOString(),
      },
      tags: [kind],
    });

    const registeredDocument = nextRepository.documents.find(
      (document) => document.id === documentId
    );

    if (!registeredDocument) return;

    const result = transformDocumentToEvidence({
      store: evidenceStore,
      document: registeredDocument,
      plainText: cleanText,
    });

    setRepository(nextRepository);
    setEvidenceStore(result.store);
    setLastProcessedDocument(registeredDocument);
    setTitle("");
    setPlainText("");
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
          <h2>EvidenceStore</h2>
          <p><strong>{evidenceStore.atoms.length}</strong> EvidenceAtom</p>
          <p>Unidad canónica de conocimiento para motores.</p>
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
            <h2>Fuente manual → EvidenceAtom → LT1</h2>
          </div>
          <p className="panel-note">
            Esta primera tubería registra una fuente, transforma su texto en
            EvidenceAtom y alimenta la lectura territorial LT1.
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

          <button type="button" onClick={handleProcessDocument}>
            Procesar documento
          </button>
        </div>

        <textarea
          value={plainText}
          onChange={(event) => setPlainText(event.target.value)}
          placeholder="Pega aquí texto simulado o manual. Cada línea no vacía generará un EvidenceAtom."
          rows={8}
        />

        {lastProcessedDocument && (
          <p className="panel-note">
            Última fuente procesada: <strong>{lastProcessedDocument.title}</strong>
          </p>
        )}

        <div className="document-list">
          {repository.documents.length === 0 ? (
            <p className="empty-state">
              Aún no hay documentos registrados. Añade texto manual para crear
              las primeras evidencias estructuradas.
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

      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">EvidenceStore</p>
            <h2>Evidencias estructuradas</h2>
          </div>
          <p className="panel-note">
            Todas las fuentes deben convertirse en EvidenceAtom antes de
            alimentar motores.
          </p>
        </div>

        <div className="document-list">
          {evidenceStore.atoms.length === 0 ? (
            <p className="empty-state">Aún no hay EvidenceAtom generados.</p>
          ) : (
            evidenceStore.atoms.map((atom) => (
              <article className="document-row" key={atom.id}>
                <div>
                  <p className="document-kind">{atom.kind}</p>
                  <h3>{atom.title}</h3>
                  <p>{atom.content}</p>
                  <p className="panel-note">
                    Origen: {atom.provenance.origin} · Validación humana requerida:{" "}
                    {atom.methodology.requiresHumanValidation ? "sí" : "no"}
                  </p>
                </div>
                <span className="status-pill">{atom.confidence}</span>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">LT1</p>
            <h2>Lectura territorial inicial</h2>
          </div>
          <p className="panel-note">
            Lectura preliminar, no causal y no priorizadora. Requiere validación
            técnica y comunitaria.
          </p>
        </div>

        <article className="card">
          <h3>Síntesis</h3>
          <p>{lt1.summary}</p>
        </article>

        <section className="grid">
          <article className="card">
            <h3>Determinantes</h3>
            <p>{lt1.determinants.length}</p>
          </article>

          <article className="card">
            <h3>Activos</h3>
            <p>{lt1.assets.length}</p>
          </article>

          <article className="card">
            <h3>Indicadores</h3>
            <p>{lt1.indicators.length}</p>
          </article>

          <article className="card">
            <h3>Cautelas</h3>
            <p>{lt1.methodologicalCautions.length}</p>
          </article>
        </section>

        <div className="document-list">
          <h3>Oportunidades preliminares</h3>
          {lt1.preliminaryOpportunities.map((opportunity) => (
            <p key={opportunity}>{opportunity}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
