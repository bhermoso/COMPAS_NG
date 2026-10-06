/**
 * nhsDerivedProjection
 *
 * Proyección BREVE derivada del Perfil de Salud Local canónico (GOV-P4-01 · PR-D).
 *
 * Reoriginación del antiguo «Perfil de Salud tipo NHS»: la vista breve deja de
 * consumir el artefacto autónomo `NHSHealthProfileArtifact` y pasa a proyectarse
 * MECÁNICAMENTE desde el documento canónico sellado. Fuente primaria única:
 * `editorialView` + `technicalSpace`.
 *
 * Doctrina (CONTRACT-NHS §0; Fundamentos del Perfil único):
 *  - `computePosition` está descartado. Esta proyección NO emite posición
 *    municipio↔referencia (`above`/`below`/`similar`), ni «mejor»/«peor», ni
 *    ranking, ni ningún veredicto: presenta los datos del trazador y deja la
 *    interpretación al lector.
 *  - Preserva `esProxy`. La condición de proxy contextual depende EXCLUSIVAMENTE
 *    del booleano `esProxy`; nunca se infiere del texto de `escala`.
 *  - No fabrica identidad: el trazador canónico (`TrazadorRow`) NO tiene ID de
 *    fila. La identidad de proyección es POSICIONAL + textual (`bloque`,
 *    `indicador`). No se une con `technicalSpace.comparativeReferences` ni se
 *    construye ninguna tabla local de correspondencia.
 *  - Las filas comparativas proceden del trazador. Cuando no hay trazador, la
 *    salida sigue usando las piezas canónicas disponibles: overview, fuentes,
 *    peso textual del Informe, lecturas territoriales, preguntas del Grupo Motor
 *    y cautelas. No se fabrica un indicador comparable donde no existe.
 *
 * Capa pura: no importa workspace, estudios, agregados, módulos metodológicos,
 * el compilador NHS ni los tipos `NHS*`. No contiene umbrales ni aritmética.
 */

import type { CanonicalProfileDocument } from "./canonicalProfileDocument";

/**
 * Fila derivada: paso-a-través literal de una fila del trazador canónico.
 * Los campos son cadenas ya formateadas por el canónico (la unidad va embebida
 * en `valor`/referencias); la aritmética comparativa es imposible por construcción.
 */
export interface NHSDerivedRow {
  bloque: string;
  indicador: string;
  valor: string;
  /** Referencia provincial (o el literal canónico "no disponible"). */
  refGranada: string;
  /** Referencia andaluza (o el literal canónico "no disponible"). */
  refAndalucia: string;
  esProxy: boolean;
  /** Etiqueta canónica de escala; paso-a-través literal (no se analiza su texto). */
  escala: string;
}

export interface NHSDerivedOverviewMessage {
  id: string;
  title: string;
  text: string;
  signal: string;
  source: string;
  variant: "informe" | "estudio" | "activo" | string;
}

export interface NHSDerivedSourceBlock {
  id: string;
  title: string;
  whatItAdds: string;
  whatItDoesNotAllow: string;
  variant: "informe" | "estudio" | "activo" | string;
}

export interface NHSDerivedInformeRankingItem {
  etiqueta: string;
  valor: number;
  max: number;
}

export interface NHSDerivedInformeRanking {
  items: NHSDerivedInformeRankingItem[];
  unidad: string;
  caption: string;
}

export interface NHSDerivedTerritorialReading {
  title: string;
  reading: string;
  groupMotorQuestion: string;
}

export interface NHSDerivedPrincipalSignal {
  grupo: string;
  senal: string;
  fuente: string;
  pregunta: string;
}

export interface NHSDerivedAgendaItem {
  id: string;
  tema: string;
  senal: string;
  mecanismo: string;
  oculto: string;
  pregunta: string;
  variant: string;
}

export interface NHSDerivedDocumentaryBase {
  evidenceAtoms: number;
  complementaryStudies: number;
  informeTitle: string | null;
  informeSections: number | null;
  scaleWarnings: string[];
}

export interface NHSDerivedMethodologicalCaution {
  id: string;
  text: string;
  origin: string;
}

/**
 * Resultado de proyección:
 *  - `available: true`  → hay documento canónico; `rows` refleja el trazador
 *    (puede ser un array vacío: proyección vacía válida, sin fabricar filas).
 *  - `available: false` → documento ausente, legacy o incompleto. NUNCA se
 *    usa el artefacto NHS como fallback.
 */
export type NHSDerivedProjection =
  | {
      available: true;
      territory: string;
      generatedDateLabel: string;
      readingStatus: string;
      pendingDeclaration: string | null;
      overview: NHSDerivedOverviewMessage[];
      sourceBlocks: NHSDerivedSourceBlock[];
      informeSignalRanking: NHSDerivedInformeRanking | null;
      territorialReadings: NHSDerivedTerritorialReading[];
      principalSignals: NHSDerivedPrincipalSignal[];
      groupMotorAgenda: NHSDerivedAgendaItem[];
      documentaryBase: NHSDerivedDocumentaryBase | null;
      methodologicalCautions: NHSDerivedMethodologicalCaution[];
      rows: NHSDerivedRow[];
    }
  | { available: false };

/**
 * Proyecta el documento canónico sellado a la representación breve derivada.
 *
 * `null` — tal como lo devuelve `readSealedCanonicalDocument` ante un sello
 * inexistente, legacy o incompleto — ⇒ estado «no disponible» tipado.
 *
 * Las filas comparativas siguen siendo 1:1 por posición con el trazador. El
 * resto de la salida es paso-a-través de piezas canónicas ya selladas.
 */
export function projectNHSDerived(
  doc: CanonicalProfileDocument | null
): NHSDerivedProjection {
  if (doc === null) return { available: false };
  const rows: NHSDerivedRow[] = (doc.editorialView.tracerTable ?? []).map((r) => ({
    bloque: r.bloque,
    indicador: r.indicador,
    valor: r.valor,
    refGranada: r.refGranada,
    refAndalucia: r.refAndalucia,
    esProxy: r.esProxy,
    escala: r.escala,
  }));
  return {
    available: true,
    territory: doc.editorialView.header?.territory ?? "territorio",
    generatedDateLabel: doc.generatedDateLabel ?? "",
    readingStatus: doc.editorialView.readingStatus ?? "integrated",
    pendingDeclaration: doc.editorialView.pendingDeclaration ?? null,
    overview: (doc.editorialView.overview ?? []).map((m) => ({
      id: m.id,
      title: m.title,
      text: m.text,
      signal: m.signal,
      source: m.source,
      variant: m.variant,
    })),
    sourceBlocks: (doc.editorialView.sourceBlocks ?? []).map((b) => ({
      id: b.id,
      title: b.title,
      whatItAdds: b.whatItAdds,
      whatItDoesNotAllow: b.whatItDoesNotAllow,
      variant: b.variant,
    })),
    informeSignalRanking:
      doc.editorialView.informeSignalRanking === null
      || doc.editorialView.informeSignalRanking === undefined
        ? null
        : {
            items: doc.editorialView.informeSignalRanking.items.map((i) => ({ ...i })),
            unidad: doc.editorialView.informeSignalRanking.unidad,
            caption: doc.editorialView.informeSignalRanking.caption,
          },
    territorialReadings: (doc.editorialView.territorialReadings ?? []).map((r) => ({
      title: r.title,
      reading: r.reading,
      groupMotorQuestion: r.groupMotorQuestion,
    })),
    principalSignals: (doc.editorialView.principalSignals ?? []).map((s) => ({ ...s })),
    groupMotorAgenda: (doc.editorialView.groupMotorAgenda ?? []).map((a) => ({ ...a })),
    documentaryBase:
      doc.technicalSpace?.documentaryBase === undefined
        ? null
        : {
            evidenceAtoms: doc.technicalSpace.documentaryBase.evidenceAtoms,
            complementaryStudies: doc.technicalSpace.documentaryBase.complementaryStudies,
            informeTitle: doc.technicalSpace.documentaryBase.informeTitle,
            informeSections: doc.technicalSpace.documentaryBase.informeSections,
            scaleWarnings: [...doc.technicalSpace.documentaryBase.scaleWarnings],
          },
    methodologicalCautions: (doc.technicalSpace?.cautions ?? []).map((c) => ({ ...c })),
    rows,
  };
}
