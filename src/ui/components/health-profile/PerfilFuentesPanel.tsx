import type { MunicipalityWorkspace } from "../../../domain/workspace";

/**
 * PerfilFuentesPanel — «Enriquecimiento de fuentes del Perfil».
 *
 * Primer plano del enriquecimiento del Perfil Local de Salud: incorporar
 * nuevas fuentes territoriales, estadísticas, sociales y comunitarias que
 * amplíen la base de evidencia antes de compilar el PSL-C. Es un plano
 * distinto del «Enriquecimiento interpretativo» (lectura técnica humana
 * sobre la evidencia disponible), que aparece después.
 *
 * Reglas:
 *   - Muestra SOLO lo que existe de verdad en el expediente (workspace);
 *     las fuentes candidatas se declaran pendientes, nunca incorporadas.
 *   - No promete automatizaciones inexistentes ni inventa indicadores.
 *   - No es requisito de compilación: el PSL-C se compila con la base
 *     disponible.
 *   - No produce recomendaciones ni actuaciones.
 */

interface PerfilFuentesPanelProps {
  workspace: MunicipalityWorkspace;
}

interface FuenteCandidata {
  nombre: string;
  descripcion: string;
  estado: string;
}

const FUENTES_CANDIDATAS: FuenteCandidata[] = [
  {
    nombre: "BADEA / IECA",
    descripcion:
      "Indicadores territoriales y sociodemográficos oficiales para " +
      "contextualizar determinantes sociales, estructura poblacional y " +
      "desigualdades. No hay datos BADEA incorporados al Perfil mientras no " +
      "se cargue una fuente real.",
    estado: "pendiente de integración o carga estructurada",
  },
  {
    nombre: "Indicadores sociodemográficos y determinantes sociales",
    descripcion:
      "Renta, empleo, educación y vivienda del ámbito, para caracterizar los " +
      "determinantes que la evidencia actual no documenta de forma directa.",
    estado: "pendiente de incorporación",
  },
  {
    nombre: "Infancia y adolescencia",
    descripcion:
      "Fuentes específicas de población infantil y adolescente que amplíen " +
      "la lectura del bienestar socioemocional escolar.",
    estado: "preparada como fuente candidata",
  },
  {
    nombre: "Envejecimiento, dependencia y soledad",
    descripcion:
      "Fuentes sobre estructura de edad, dependencia y soledad no deseada, " +
      "que permitirían contrastar el eje de envejecimiento señalado por el " +
      "mapa de activos.",
    estado: "pendiente de incorporación",
  },
  {
    nombre: "Medio urbano y entorno cotidiano",
    descripcion:
      "Documentación sobre espacio público, accesibilidad y usos cotidianos, " +
      "vinculada a la hipótesis de entorno urbano y vida activa.",
    estado: "requiere carga estructurada",
  },
  {
    nombre: "Activos comunitarios verificados",
    descripcion:
      "Validación territorial fina del inventario Localiza Salud para " +
      "atribuir cada activo al ámbito con precisión.",
    estado: "pendiente de verificación territorial",
  },
  {
    nombre: "Documentación cualitativa y participativa adicional",
    descripcion:
      "Material cualitativo, actas y procesos participativos que aporten la " +
      "perspectiva ciudadana al diagnóstico.",
    estado: "preparada como fuente candidata",
  },
];

export function PerfilFuentesPanel({ workspace }: PerfilFuentesPanelProps) {
  const nombre = workspace.municipality.identity.name;
  const docs = workspace.repository.documents;
  const atoms = workspace.evidenceStore.atoms;

  // ── Fuentes reales ya presentes en el expediente ──────────────────────────
  const territoriales = docs.filter((d) => d.kind === "territorial-documentation");
  const marcos = docs.filter((d) => d.kind === "strategic-framework");
  const cualitativos =
    docs.filter((d) => d.kind === "qualitative-material").length +
    atoms.filter((a) => a.kind === "qualitative-observation").length;
  const activos = atoms.filter(
    (a) => a.provenance.origin === "localiza-salud"
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

  const incorporadas: string[] = [];
  if (workspace.healthReport) {
    incorporadas.push(
      `Fuente diagnóstica primaria: «${workspace.healthReport.title}» ` +
        `(preservada íntegra en el Repositorio documental).`
    );
  }
  if (territoriales.length > 0) {
    incorporadas.push(
      `Documentación territorial de contexto: ${territoriales.length} documento(s) ` +
        `(${territoriales.map((d) => d.title).slice(0, 2).join("; ")}${
          territoriales.length > 2 ? "; …" : ""
        }).`
    );
  }
  if (estudios > 0) {
    incorporadas.push(`Estudios complementarios: ${estudios} instrumento(s).`);
  }
  if (activos > 0) {
    incorporadas.push(
      `Activos y recursos comunitarios (Localiza Salud): ${activos}, ` +
        `pendientes de validación territorial fina.`
    );
  }
  if (cualitativos > 0) {
    incorporadas.push(
      `Material cualitativo/participativo: ${cualitativos} elemento(s).`
    );
  }
  if (marcos.length > 0) {
    incorporadas.push(
      `Marcos estratégicos de referencia: ${marcos.length} (insumos para el ` +
        `Plan de Acción; no son evidencia diagnóstica).`
    );
  }
  incorporadas.push(
    `Total del expediente: ${docs.length} documento(s) y ${atoms.length} ` +
      `elemento(s) de evidencia.`
  );

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
        Sirve para incorporar nuevas fuentes territoriales, estadísticas,
        sociales y comunitarias antes de compilar el PSL-C: amplían la base de
        evidencia y mejoran la lectura territorial del documento. No sustituyen
        la interpretación técnica del equipo y no producen recomendaciones ni
        actuaciones. Cada fuente cargada alimenta el diagnóstico, la base
        documental, los estudios o el anexo técnico según su tipo. Las fuentes
        candidatas todavía no incorporadas no generan contenido sustantivo en
        el Perfil. La incorporación se realiza con los cargadores del
        Repositorio documental (documentación territorial, estudios, activos,
        material cualitativo).
      </p>

      <h3 className="ekc-panel__subtitle">Fuentes incorporadas al expediente</h3>
      {incorporadas.length > 1 ? (
        <ul className="pslc-salidas__items">
          {incorporadas.map((f, i) => (
            <li key={i} className="pslc-salidas__item pslc-salidas__item--ok">
              <span aria-hidden="true">✓</span> {f}
            </li>
          ))}
        </ul>
      ) : (
        <p className="panel-note">
          Sin fuentes incorporadas todavía. Comienza por el Informe de Salud en
          el Repositorio documental.
        </p>
      )}

      <h3 className="ekc-panel__subtitle">
        Fuentes candidatas · pendientes de incorporación
      </h3>
      <ul className="pslc-salidas__items">
        {FUENTES_CANDIDATAS.map((f) => (
          <li key={f.nombre} className="pslc-salidas__item">
            <span aria-hidden="true">◌</span> <strong>{f.nombre}</strong> —{" "}
            {f.descripcion} Estado: <em>{f.estado}</em>.
          </li>
        ))}
      </ul>
      <p className="panel-note">
        Estas fuentes están preparadas como candidatas: no se muestran datos ni
        indicadores suyos porque no hay carga real. Su incorporación es
        opcional y no condiciona la compilación del PSL-C.
      </p>
    </section>
  );
}
