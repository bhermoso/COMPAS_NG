import type { MunicipalityWorkspace } from "../../../domain/workspace";

/**
 * PerfilFuentesPanel — «Enriquecimiento de fuentes del Perfil».
 *
 * VISTA DE IMPACTO, no cargador: este bloque NO carga documentos ni
 * sustituye al Repositorio documental. Resume cómo las fuentes ya
 * incorporadas enriquecen la lectura del Perfil y qué DIMENSIONES
 * diagnósticas siguen pendientes. La carga de nuevas fuentes se hace
 * siempre desde el selector/cargador documental habitual (pestaña
 * «Diagnóstico territorial» · Repositorio documental).
 *
 * Reglas:
 *   - Sin categorías de carga propias: solo dimensiones de impacto.
 *   - Las fuentes candidatas (BADEA/IECA) se citan dentro de la dimensión
 *     a la que servirían, pendientes de carga por el cargador habitual,
 *     nunca como incorporadas.
 *   - No es requisito de compilación y no produce recomendaciones.
 */

interface PerfilFuentesPanelProps {
  workspace: MunicipalityWorkspace;
}

type EstadoDimension = "cubierta" | "parcial" | "pendiente";

interface DimensionImpacto {
  dimension: string;
  estado: EstadoDimension;
  detalle: string;
}

const MARCA: Record<EstadoDimension, string> = {
  cubierta: "✓",
  parcial: "◐",
  pendiente: "○",
};

export function PerfilFuentesPanel({ workspace }: PerfilFuentesPanelProps) {
  const nombre = workspace.municipality.identity.name;
  const docs = workspace.repository.documents;
  const atoms = workspace.evidenceStore.atoms;

  // ── Señales reales del expediente (sin duplicar categorías de carga) ──────
  const territoriales = docs.filter(
    (d) => d.kind === "territorial-documentation"
  ).length;
  const marcos = docs.filter((d) => d.kind === "strategic-framework").length;
  const cualitativos = atoms.filter(
    (a) => a.kind === "qualitative-observation"
  ).length;
  const activos = atoms.filter(
    (a) => a.provenance.origin === "localiza-salud"
  ).length;
  const determinantes = atoms.filter((a) => a.kind === "determinant").length;
  const indicadores = atoms.filter((a) => a.kind === "indicator").length;
  const cautelas = atoms.filter(
    (a) => a.kind === "methodological-caution"
  ).length;
  const estudios = [
    workspace.ibseStudy,
    workspace.dukeStudy,
    workspace.predimedStudy,
    workspace.sf12Study,
    workspace.suenoStudy,
    workspace.cageStudy,
    workspace.auditcStudy,
    workspace.ipaqStudy,
    workspace.ghq12Study,
    workspace.phq9Study,
    workspace.psqiStudy,
    workspace.fagerstromStudy,
    workspace.sbqStudy,
  ].filter(Boolean).length;
  const preguntasAbiertas =
    workspace.perfilLocalDeSalud?.preguntasAbiertas.filter(
      (q) => q.status === "abierta"
    ).length ?? 0;
  const tieneInforme = workspace.healthReport !== undefined;

  const BADEA_CANDIDATA =
    "Fuente candidata: BADEA/IECA — pendiente de carga por el cargador " +
    "documental habitual; no incorporada todavía.";

  // ── Dimensiones de impacto sobre el Perfil ────────────────────────────────
  const dimensiones: DimensionImpacto[] = [
    {
      dimension: "Situación de salud",
      estado: tieneInforme || estudios > 0 ? "cubierta" : "pendiente",
      detalle:
        tieneInforme || estudios > 0
          ? `${tieneInforme ? "Informe de Salud" : "Sin Informe"} + ${estudios} ` +
            `estudio(s) complementario(s) con ${indicadores} indicador(es): ` +
            `alimentan los capítulos de situación de salud y bienestar.`
          : "Sin fuente diagnóstica primaria ni estudios todavía.",
    },
    {
      dimension: "Determinantes sociales",
      estado: determinantes > 0 ? "cubierta" : "pendiente",
      detalle:
        determinantes > 0
          ? `${determinantes} determinante(s) con evidencia directa.`
          : `Sin evidencia directa: la lectura se sostiene por hipótesis ` +
            `epidemiológico-sociales. ${BADEA_CANDIDATA}`,
    },
    {
      dimension: "Desigualdades",
      estado: "pendiente",
      detalle:
        `Los agregados disponibles no están desagregados por sexo, edad ni ` +
        `condición socioeconómica: la ausencia consta como incertidumbre. ` +
        `${BADEA_CANDIDATA}`,
    },
    {
      dimension: "Activos y capacidades",
      estado: activos > 0 ? "cubierta" : "pendiente",
      detalle:
        activos > 0
          ? `${activos} activo(s) de Localiza Salud con lectura salutogénica; ` +
            `pendientes de validación territorial fina.`
          : "Sin activos incorporados todavía.",
    },
    {
      dimension: "Experiencia vivida / cualitativo",
      estado: cualitativos > 0 ? "parcial" : "pendiente",
      detalle:
        cualitativos > 0
          ? `${cualitativos} elemento(s) cualitativo(s): base aún limitada para ` +
            `la perspectiva ciudadana.`
          : "Sin material cualitativo/participativo todavía.",
    },
    {
      dimension: "Incertidumbres",
      estado: cautelas > 0 ? "cubierta" : "pendiente",
      detalle:
        cautelas > 0
          ? `${cautelas} cautela(s) metodológica(s) declaradas (escala ` +
            `proxy/contextual incluida): alimentan las incertidumbres críticas ` +
            `del documento.`
          : "Sin cautelas registradas.",
    },
    {
      dimension: "Preguntas para el Grupo Motor",
      estado: preguntasAbiertas > 0 ? "parcial" : "pendiente",
      detalle:
        preguntasAbiertas > 0
          ? `${preguntasAbiertas} pregunta(s) abierta(s) del equipo técnico, ` +
            `además de las preguntas de contraste generadas por el diagnóstico.`
          : `El diagnóstico genera preguntas de contraste; el equipo puede ` +
            `añadir las suyas en el enriquecimiento interpretativo.`,
    },
    {
      dimension: "Anexo técnico / contexto",
      estado: territoriales > 0 || marcos > 0 ? "cubierta" : "pendiente",
      detalle:
        territoriales > 0 || marcos > 0
          ? `${territoriales} documento(s) territoriales de contexto y ` +
            `${marcos} marco(s) estratégico(s) de referencia (los marcos son ` +
            `insumos para el Plan de Acción, no evidencia diagnóstica).`
          : "Sin documentación territorial de contexto todavía.",
    },
  ];

  return (
    <section
      id="psl-enriquecimiento-fuentes"
      className="workspace-panel ekc-panel"
    >
      <p className="eyebrow">
        Espacio de trabajo del equipo técnico · {nombre} — no forma parte del
        documento institucional
      </p>
      <h2 className="ekc-panel__title">Enriquecimiento de fuentes del Perfil</h2>
      <p className="panel-note">
        Este bloque no carga documentos. Resume cómo las fuentes incorporadas
        al Repositorio documental enriquecen la lectura del Perfil y qué
        dimensiones siguen pendientes. Para cargar nuevas fuentes, usa el
        selector/cargador documental habitual (pestaña «Diagnóstico
        territorial» · Repositorio documental). Las fuentes amplían la base de
        evidencia; no sustituyen la interpretación técnica del equipo y no
        producen recomendaciones ni actuaciones.
      </p>

      <h3 className="ekc-panel__subtitle">
        Dimensiones diagnósticas del Perfil: cobertura actual
      </h3>
      <ul className="pslc-salidas__items">
        {dimensiones.map((d) => (
          <li
            key={d.dimension}
            className={
              d.estado === "pendiente"
                ? "pslc-salidas__item"
                : "pslc-salidas__item pslc-salidas__item--ok"
            }
          >
            <span aria-hidden="true">{MARCA[d.estado]}</span>{" "}
            <strong>{d.dimension}</strong> — {d.estado}. {d.detalle}
          </li>
        ))}
      </ul>
      <p className="panel-note">
        La cobertura de dimensiones es orientativa y no condiciona la
        compilación del PSL-C: el documento se compila con la base disponible y
        declara sus incertidumbres.
      </p>
    </section>
  );
}
