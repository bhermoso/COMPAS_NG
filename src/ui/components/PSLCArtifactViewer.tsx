import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import type { PSLCDocumentSection } from "../../application/psl-c-export";
import { buildPSLCDocumentModel } from "../../application/psl-c-export";

/**
 * PSLCArtifactViewer — visor institucional de SOLO LECTURA del artefacto
 * congelado PSL-C.
 *
 * Renderiza el MISMO modelo documental que los exports DOCX y PDF
 * (buildPSLCDocumentModel): lectura visual (síntesis, señales del Informe,
 * trazadores, señales para deliberación), documento principal de lectura
 * territorial, agenda del Grupo Motor y anexo técnico. La lectura visual se
 * activa cuando el artefacto lleva el documento canónico congelado (esquema 2);
 * un artefacto legacy (sin él) se muestra en su forma textual clásica. No hay
 * entrada viva: el documento es función del artefacto.
 *
 * Reglas: no edita el artefacto; no genera recomendaciones ni texto nuevo;
 * no inventa datos ausentes; mantiene visible la frontera con el Plan de
 * Acción y la trazabilidad (en el anexo).
 */

interface PSLCArtifactViewerProps {
  artifact: LocalHealthProfileArtifact;
}

function StructuredBody({ section }: { section: PSLCDocumentSection }) {
  switch (section.kind ?? "text") {
    case "summaryCards":
      return (
        <div className="pslc-viewer__cards">
          {(section.cards ?? []).map((card, i) => (
            <p
              key={i}
              className={
                "pslc-viewer__card" +
                (card.destacado ? " pslc-viewer__card--destacado" : "")
              }
            >
              {card.texto}
            </p>
          ))}
        </div>
      );
    case "table": {
      const table = section.table;
      if (table === undefined) return null;
      return (
        <>
          <table className="pslc-viewer__tabla">
            <thead>
              <tr>
                {table.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {table.nota !== undefined ? (
            <p className="pslc-viewer__nota">{table.nota}</p>
          ) : null}
        </>
      );
    }
    case "barRanking":
      return (
        <div className="pslc-viewer__ranking">
          {(section.ranking ?? []).map((item, i) => (
            <div key={i} className="pslc-viewer__ranking-fila">
              <span className="pslc-viewer__ranking-etiqueta">
                {item.etiqueta}
              </span>
              <span className="pv-bar__pista">
                <span
                  className="pv-bar__relleno pv--informe"
                  style={{
                    width: `${Math.max(4, (item.valor / Math.max(1, item.max)) * 100)}%`,
                  }}
                />
              </span>
              <span className="pslc-viewer__ranking-valor">{item.valor}</span>
            </div>
          ))}
        </div>
      );
    case "compactSignalList":
      return (
        <ul className="pslc-viewer__senales">
          {(section.signalList ?? []).map((item, i) => (
            <li key={i}>
              <strong>{item.grupo}</strong> — {item.senal} ({item.fuente}).{" "}
              <em>{item.pregunta}</em>
            </li>
          ))}
        </ul>
      );
    case "groupMotorAgenda":
      return (
        <div className="pslc-viewer__agenda">
          {(section.agenda ?? []).map((entrada, i) => (
            <div key={i} className="pslc-viewer__agenda-entrada">
              <p className="pslc-viewer__agenda-tema">{entrada.tema}</p>
              <p>Señal: {entrada.senal}</p>
              <p>Mecanismo plausible: {entrada.mecanismo}</p>
              <p>Quién puede quedar fuera: {entrada.oculto}</p>
              <p>
                <em>{entrada.pregunta}</em>
              </p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
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
            // El cierre de autoría humana se distingue del cuerpo compilado (voz
            // autoral, Art. 16). Se identifica por sectionId canónico (la ruta
            // legacy no lo lleva y conserva su presentación).
            (section.sectionId === "human-closing"
              ? " pslc-viewer__cierre-humano"
              : "") +
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
          <StructuredBody section={section} />
          {section.paragraphs.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
