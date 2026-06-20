import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createEmptyPipelineResult } from "./domain/pipeline";
import "./App.css";

const workspace = createCompleteMunicipalityWorkspace({
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "COMPÁS NG",
});

const pipeline = createEmptyPipelineResult(workspace);

export default function App() {
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
          <p>{workspace.repository.documents.length} documentos cargados</p>
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
    </main>
  );
}
