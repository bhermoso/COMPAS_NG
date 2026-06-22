import { useMemo } from "react";
import { createQuestionnaire, generateRedcapDictionaryArtifact } from "../../application/questionnaire";
import { getAllMethodologicalModules } from "../../domain/methodology";
import type { QuestionnaireProject } from "../../domain/questionnaire";

export function QuestionnaireBuilderPanel() {
  const project = useMemo<QuestionnaireProject>(() => {
    const now = new Date().toISOString();

    return {
      id: "estudio-complementario-ibse",
      name: "Estudio complementario IBSE",
      status: "draft",
      questionnaire: createQuestionnaire({
        id: "monitor_ibse",
        name: "Monitor IBSE",
        description: "Primer estudio complementario generado desde la Biblioteca Metodológica.",
        methodologicalModules: ["ibse"],
        outputs: ["redcap"],
      }),
      requestedOutputs: ["redcap"],
      createdAt: now,
      updatedAt: now,
    };
  }, []);

  const artifact = useMemo(
    () => generateRedcapDictionaryArtifact(project),
    [project]
  );

  const modules = useMemo(() => getAllMethodologicalModules(), []);

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Constructor de Estudios Complementarios</p>
          <h2>Generador experimental</h2>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const blob = new Blob([artifact.content], { type: artifact.mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = artifact.name;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Descargar CSV REDCap (IBSE)
      </button>

      <section style={{ marginTop: "1rem" }}>
        <h3>Catálogo metodológico disponible</h3>
        <ul>
          {modules.map((module) => (
            <li key={module.identity.id}>
              <strong>{module.identity.shortName}</strong>
              {" · "}
              {module.identity.version}
              {" · "}
              {module.identity.status}
              {" · "}
              {module.identity.category}
            </li>
          ))}
        </ul>
      </section>

      <details>
        <summary>Previsualizar CSV</summary>
        <pre>{artifact.content}</pre>
      </details>
    </section>
  );
}
