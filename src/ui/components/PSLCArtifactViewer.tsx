import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import { buildPSLCDocumentModel } from "../../application/psl-c-export";

/**
 * PSLCArtifactViewer — visor institucional de SOLO LECTURA del artefacto
 * congelado PSL-C.
 *
 * Renderiza el MISMO modelo documental que los exports DOCX y PDF
 * (buildPSLCDocumentModel): documento principal de lectura territorial
 * (lectura ejecutiva → situación → desafíos → capacidades → incertidumbres →
 * conclusiones) seguido del anexo técnico (alcance, base documental,
 * cautelas, estado del conocimiento y trazabilidad/hash).
 *
 * Reglas: no edita el artefacto; no genera recomendaciones ni texto nuevo;
 * no inventa datos ausentes; mantiene visible la frontera con el Plan de
 * Acción y la trazabilidad (en el anexo).
 */

interface PSLCArtifactViewerProps {
  artifact: LocalHealthProfileArtifact;
}

export function PSLCArtifactViewer({ artifact }: PSLCArtifactViewerProps) {
  const model = buildPSLCDocumentModel(artifact);

  return (
    <article className="pslc-viewer" aria-label="Documento institucional PSL-C">

      {/* ── Portada institucional ────────────────────────────────────────── */}
      <header className="pslc-viewer__portada psl-doc-section">
        <p className="eyebrow">Perfil de Salud Local · documento institucional compilado</p>
        <h2>{model.title}</h2>
        <p className="panel-note">{model.subtitle}</p>
        <div className="pslc-viewer__meta">
          {model.portada.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </header>

      {/* ── Documento principal y anexo técnico ─────────────────────────── */}
      {model.sections.map((section, i) => (
        <section
          key={i}
          className={
            "psl-doc-section pslc-viewer__capitulo" +
            (section.level === 2 ? " pslc-viewer__sub" : "") +
            (section.title === "Frontera institucional"
              ? " pslc-viewer__frontera"
              : "") +
            (section.title === "Anexo técnico" ? " pslc-viewer__anexo" : "")
          }
        >
          {section.level === 1 ? (
            <h3>{section.title}</h3>
          ) : (
            <h4>{section.title}</h4>
          )}
          {section.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
