import { useMemo, useState } from "react";
import {
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
import { ingestManualDocument } from "./application/document-ingestion";
import { generateLT1 } from "./application/lt1";
import {
  DocumentIngestionPanel,
  EvidenceStorePanel,
  LT1Panel,
} from "./ui/components";
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
    const result = ingestManualDocument({
      repository,
      evidenceStore,
      kind,
      title,
      plainText,
    });

    if (result === null) return;

    setRepository(result.repository);
    setEvidenceStore(result.evidenceStore);
    setLastProcessedDocument(result.document);
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

      <DocumentIngestionPanel
        documentKinds={DOCUMENT_KINDS}
        repository={repository}
        kind={kind}
        title={title}
        plainText={plainText}
        lastProcessedDocument={lastProcessedDocument}
        onKindChange={setKind}
        onTitleChange={setTitle}
        onPlainTextChange={setPlainText}
        onProcessDocument={handleProcessDocument}
      />

      <EvidenceStorePanel evidenceStore={evidenceStore} />

      <LT1Panel lt1={lt1} />
    </main>
  );
}
