import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import { parseNarrativeChapters } from "../../application/health-profile";

/**
 * PSLCArtifactViewer — visor institucional de SOLO LECTURA del artefacto
 * congelado PSL-C (LocalHealthProfileArtifact).
 *
 * Reglas que esta vista garantiza:
 *   - No edita el artefacto (congelado e inmutable por contrato).
 *   - No genera recomendaciones, programas, actuaciones ni objetivos
 *     estratégicos: muestra el documento compilado tal cual.
 *   - No inventa datos: los campos ausentes se declaran "no disponible"
 *     o se omiten.
 *   - Mantiene visible la frontera institucional con el Plan de Acción.
 */

interface PSLCArtifactViewerProps {
  artifact: LocalHealthProfileArtifact;
}

const URGENCIA_LABEL: Record<string, string> = {
  alta: "urgencia alta",
  media: "urgencia media",
  baja: "urgencia baja",
};

function fecha(iso: string | undefined): string {
  if (!iso) return "no disponible";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "no disponible";
  return (
    d.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  );
}

function parrafos(content: string): string[] {
  return content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function PSLCArtifactViewer({ artifact }: PSLCArtifactViewerProps) {
  const capitulos = parseNarrativeChapters(artifact.conclusiones.content);
  const origenes = Object.entries(artifact.baseDocumental.atomsByOrigin);
  const ekc = artifact.ekcSnapshot;

  return (
    <article className="pslc-viewer" aria-label="Documento institucional PSL-C">

      {/* ── 1. Portada institucional ─────────────────────────────────────── */}
      <header className="pslc-viewer__portada psl-doc-section">
        <p className="eyebrow">Perfil de Salud Local · documento institucional compilado</p>
        <h2>
          Perfil de Salud Local de {artifact.portada.municipalityName}
          {artifact.portada.municipalityProvince
            ? ` (${artifact.portada.municipalityProvince})`
            : ""}
        </h2>
        <p className="panel-note">
          Versión {artifact.portada.artifactVersion} · compilado el{" "}
          {fecha(artifact.compiledAt)}
          {artifact.compiledBy ? ` · por ${artifact.compiledBy}` : ""}. Artefacto
          congelado: representa el estado del diagnóstico en el momento de su
          compilación y no admite edición.
        </p>
        <dl className="pslc-viewer__meta">
          <div>
            <dt>Validación técnica</dt>
            <dd>
              {artifact.notaValidacion.pslValidatedBy ?? "no disponible"} ·{" "}
              {fecha(artifact.notaValidacion.pslValidatedAt)}
            </dd>
          </div>
          <div>
            <dt>Trazabilidad (hash del PSL fuente)</dt>
            <dd>
              <code>{artifact.sourceHash}</code>
            </dd>
          </div>
          <div>
            <dt>Documento fuente</dt>
            <dd>
              PSL {artifact.sourcePSLId} · versión {fecha(artifact.sourcePSLVersion)}
            </dd>
          </div>
        </dl>
      </header>

      {/* ── 2. Identificación y base documental ──────────────────────────── */}
      <section className="psl-doc-section">
        <p className="eyebrow">Base documental</p>
        <h3>Identificación y evidencia del diagnóstico</h3>
        <p className="panel-note">
          Este documento procede de la compilación institucional del diagnóstico
          validado; recoge conclusiones interpretativas y no contiene
          recomendaciones.
        </p>
        <ul className="pslc-viewer__base">
          <li>
            <strong>{artifact.baseDocumental.totalEvidenceAtoms}</strong> elementos
            de evidencia
            {artifact.baseDocumental.integrityErrors > 0
              ? ` · ${artifact.baseDocumental.integrityErrors} error(es) de integridad`
              : ""}
          </li>
          <li>
            <strong>{artifact.baseDocumental.complementaryStudyCount}</strong>{" "}
            estudios complementarios
          </li>
          <li>
            Informe de Salud:{" "}
            {artifact.informeSalud.title
              ? `«${artifact.informeSalud.title}» (${artifact.informeSalud.sectionCount} secciones; preservado íntegro, referenciado sin atomizar)`
              : "no disponible"}
          </li>
          {origenes.length > 0 && (
            <li>
              Orígenes de evidencia:{" "}
              {origenes.map(([o, n]) => `${o} (${n})`).join("; ")}
            </li>
          )}
        </ul>
        {(artifact.lecturaTerritorial.limitacionesDiagnosticas?.length ?? 0) > 0 && (
          <div className="psl-doc-notice psl-doc-notice--warning">
            <strong>Advertencia de escala.</strong>{" "}
            {artifact.lecturaTerritorial.limitacionesDiagnosticas!.join(" ")}
          </div>
        )}
      </section>

      {/* ── 3. Núcleo narrativo ──────────────────────────────────────────── */}
      <section className="psl-doc-section">
        <p className="eyebrow">Documento del diagnóstico</p>
        <h3>Resumen y lectura territorial</h3>
        {artifact.lecturaTerritorial.territorialSummary ? (
          <p>{artifact.lecturaTerritorial.territorialSummary}</p>
        ) : (
          <p className="panel-note">Resumen territorial no disponible.</p>
        )}
        <p className="panel-note">
          Lectura territorial: {artifact.lecturaTerritorial.determinantCount}{" "}
          determinantes documentados; {artifact.lecturaTerritorial.assetCount}{" "}
          activos; {artifact.lecturaTerritorial.indicatorCount} indicadores;{" "}
          {artifact.lecturaTerritorial.methodologicalCautionCount} cautelas
          metodológicas.
        </p>

        <h3>Conclusiones interpretativas</h3>
        {capitulos.length > 0 ? (
          capitulos.map((c) => (
            <section key={c.numeral} className="pslc-viewer__capitulo">
              <h4>
                {c.numeral}. {c.title}
              </h4>
              {parrafos(c.content).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))
        ) : (
          parrafos(artifact.conclusiones.content).map((p, i) => <p key={i}>{p}</p>)
        )}

        {artifact.cierreInterpretativo.content.trim().length > 0 && (
          <>
            <h3>Cierre interpretativo</h3>
            {parrafos(artifact.cierreInterpretativo.content).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </>
        )}
      </section>

      {/* ── 4. Estado del conocimiento ───────────────────────────────────── */}
      <section className="psl-doc-section">
        <p className="eyebrow">Estado del conocimiento</p>
        <h3>Conocimiento del equipo técnico en el momento de la compilación</h3>
        {ekc === null ? (
          <p className="panel-note">
            Esta compilación no registró espacio de conocimiento del equipo
            técnico (EKC no disponible).
          </p>
        ) : (
          <ul className="pslc-viewer__ekc">
            <li>
              <strong>{ekc.interpretacionesActivas}</strong> interpretaciones
              activas ({ekc.interpretacionesSuperadas} superadas)
            </li>
            <li>
              <strong>{ekc.hipotesisActivas}</strong> hipótesis en estudio (
              {ekc.hipotesisResueltas} resueltas; {ekc.hipotesisDescartadas}{" "}
              descartadas)
            </li>
            <li>
              <strong>{ekc.preguntasAbiertas}</strong> preguntas abiertas (
              {ekc.preguntasResueltas} resueltas)
            </li>
            <li>
              Síntesis del técnico:{" "}
              {ekc.tieneSintesis
                ? "incorporada al capítulo de conclusiones"
                : "no disponible"}
            </li>
          </ul>
        )}

        {artifact.hipotesisActivas.length > 0 && (
          <>
            <h4>Hipótesis diagnósticas en estudio</h4>
            <ul>
              {artifact.hipotesisActivas.map((h, i) => (
                <li key={i}>
                  {h.enunciado} — plausibilidad {h.plausibilidad}, pendiente de
                  contraste ({h.autorNombre})
                </li>
              ))}
            </ul>
          </>
        )}

        {artifact.preguntasAbiertas.length > 0 && (
          <>
            <h4>Preguntas abiertas del diagnóstico</h4>
            <ul>
              {artifact.preguntasAbiertas.map((q, i) => (
                <li key={i}>
                  {q.formulacion} ({URGENCIA_LABEL[q.urgencia] ?? q.urgencia}) —{" "}
                  {q.relevancia}
                </li>
              ))}
            </ul>
          </>
        )}

        <h4>Cautelas metodológicas</h4>
        <p className="panel-note">
          {artifact.cautelasMetodologicas.nota}
          {artifact.cautelasMetodologicas.hasCautelas
            ? ` (${artifact.cautelasMetodologicas.integrityWarnings} aviso(s) de integridad registrados.)`
            : ""}
        </p>
      </section>

      {/* ── 5. Frontera institucional ────────────────────────────────────── */}
      <footer className="psl-doc-section pslc-viewer__frontera">
        <p className="eyebrow">Frontera institucional</p>
        <h3>Qué es — y qué no es — este documento</h3>
        <p>
          Este Perfil de Salud Local concluye el diagnóstico: no formula
          recomendaciones, actuaciones, programas ni objetivos estratégicos. La
          traducción a prioridades y acciones corresponde al Plan de Acción, que
          es una fase posterior del proceso de planificación y se elabora con el
          Grupo Motor a partir de este documento.
        </p>
        {artifact.priorizacion.candidaturasTecnicas.length > 0 && (
          <p className="panel-note">
            El documento deja preparadas{" "}
            {artifact.priorizacion.candidaturasTecnicas.length} candidatura(s)
            técnica(s) para esa deliberación posterior:{" "}
            {artifact.priorizacion.candidaturasTecnicas
              .map((c) => c.title)
              .join("; ")}
            . {artifact.priorizacion.deliberacionNota}
          </p>
        )}
        <p className="panel-note">
          Consenso del Grupo Motor documentado:{" "}
          {artifact.priorizacion.consensoDocumentado ? "sí" : "no disponible"}.
        </p>
      </footer>
    </article>
  );
}
