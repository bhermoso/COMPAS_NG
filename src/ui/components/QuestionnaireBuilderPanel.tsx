import { useMemo } from "react";
import { createQuestionnaire, generateRedcapDictionaryArtifact } from "../../application/questionnaire";
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

      <details>
        <summary>Previsualizar CSV</summary>
        <pre>{artifact.content}</pre>
      </details>
    </section>
  );
}
