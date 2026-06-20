import { useMemo, useState } from "react";
import {
  type DocumentKind,
  type MunicipalDocument,
} from "./domain/repository";
import { type MunicipalityWorkspace } from "./domain/workspace";
import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createMunicipalityRuntime } from "./application/runtime";
import { ingestManualDocument } from "./application/document-ingestion";

import {
  DocumentIngestionPanel,
  EvidenceStorePanel,
  LT1Panel,
  OITPanel,
  PrioritizationPanel,
  EPVSAPanel,
  ActionPlanPanel,
  AgendaPanel,
  MonitoringPanel,
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
  const [workspace, setWorkspace] =
    useState<MunicipalityWorkspace>(INITIAL_WORKSPACE);

  const [title, setTitle] = useState("");
  const [plainText, setPlainText] = useState("");
  const [kind, setKind] = useState<DocumentKind>("health-report");
  const [lastProcessedDocument, setLastProcessedDocument] =
    useState<MunicipalDocument | null>(null);

  const runtime = useMemo(
    () => createMunicipalityRuntime({ workspace }),
    [workspace]
  );

  function handleProcessDocument() {
    const result = ingestManualDocument({
      repository: workspace.repository,
      evidenceStore: workspace.evidenceStore,
      kind,
      title,
      plainText,
    });

    if (result === null) return;

    setWorkspace((prev) => ({
      ...prev,
      repository: result.repository,
      evidenceStore: result.evidenceStore,
      updatedAt: new Date().toISOString(),
    }));
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
          <p><strong>{runtime.workspace.municipality.identity.name}</strong></p>
          <p>{runtime.workspace.municipality.identity.province}</p>
          <p>INE: {runtime.workspace.municipality.identity.ineCode}</p>
        </article>

        <article className="card">
          <h2>Repositorio documental</h2>
          <p>
            <strong>{runtime.workspace.repository.documents.length}</strong>{" "}
            documentos registrados
          </p>
          <p>Entrada única municipal de evidencias.</p>
        </article>

        <article className="card">
          <h2>EvidenceStore</h2>
          <p>
            <strong>{runtime.workspace.evidenceStore.atoms.length}</strong>{" "}
            EvidenceAtom
          </p>
          <p>Unidad canónica de conocimiento para motores.</p>
        </article>

        <article className="card">
          <h2>Pipeline</h2>
          <ol>
            {runtime.pipeline.trace.map((item) => (
              <li key={`${item.stage}-${item.createdAt}`}>
                <strong>{item.stage}</strong>: {item.status}
              </li>
            ))}
          </ol>
        </article>
      </section>

      <DocumentIngestionPanel
        documentKinds={DOCUMENT_KINDS}
        repository={runtime.workspace.repository}
        kind={kind}
        title={title}
        plainText={plainText}
        lastProcessedDocument={lastProcessedDocument}
        onKindChange={setKind}
        onTitleChange={setTitle}
        onPlainTextChange={setPlainText}
        onProcessDocument={handleProcessDocument}
      />

      <EvidenceStorePanel evidenceStore={runtime.workspace.evidenceStore} />

      <LT1Panel lt1={runtime.lt1} />

      <OITPanel oit={runtime.oit} />

      <PrioritizationPanel prioritization={runtime.prioritization} />

      <EPVSAPanel epvsa={runtime.epvsa} />

      <ActionPlanPanel actionPlan={runtime.actionPlan} />

      <AgendaPanel agenda={runtime.agenda} />

      <MonitoringPanel monitoring={runtime.monitoring} />
    </main>
  );
}
