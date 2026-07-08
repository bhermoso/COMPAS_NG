/**
 * andalusiaReferenceContract
 *
 * CONTRATO ÚNICO de referencias autonómicas de Andalucía para el Perfil.
 * Fuente de verdad compartida entre la capa comparativa EAS
 * (EASComparativeReferences, que calcula desde los fixtures autonómicos con
 * los parsers canónicos) y la capa de referencias del Perfil
 * (complementaryIndicatorReferences, síncrona y sin acceso a fixtures).
 *
 * Cada entrada asocia de forma EXPLÍCITA, por id (nunca por heurística
 * textual):
 *   - el id del indicador en el Perfil;
 *   - el valor autonómico vigente (redondeo del parser canónico);
 *   - el id de la referencia comparativa EAS que lo respalda, cuando esa capa
 *     la publica; o el método de derivación directa desde el fixture cuando
 *     no la publica (agregados DUKE confidencial/afectivo).
 *
 * La sincronización se garantiza por test (tests/eas-comparative-references):
 * cada valor de este contrato se contrasta contra el cálculo real desde los
 * fixtures. Si un fixture autonómico cambia, ese test falla y obliga a
 * actualizar el contrato de forma consciente.
 *
 * Reglas semánticas cerradas que este contrato respeta:
 *   - Solo instrumentos EAS con fixture autonómico equivalente (6): DUKE,
 *     PREDIMED, SF-12, Sueño, CAGE, IPAQ.
 *   - IBSE queda fuera (sin referencia autonómica equivalente del monitor).
 *   - AUDIT-C, GHQ-12, PHQ-9, PSQI, Fagerström y SBQ quedan fuera (sin
 *     referencia provincial ni autonómica; no se finge).
 */

export interface AndalusiaReferenceContractEntry {
  /** Id del indicador en la capa de referencias del Perfil. */
  perfilIndicatorId: string;
  /** Valor autonómico vigente (mismo redondeo que el parser canónico). */
  value: number;
  /**
   * Id de la referencia en EASComparativeReferences que respalda el valor;
   * ausente cuando esa capa no publica el agregado (derivación directa).
   */
  easReferenceId?: string;
  /** Cómo se obtiene el valor desde los microdatos del fixture autonómico. */
  method: string;
}

export const ANDALUSIA_EAS_REFERENCE_CONTRACT: AndalusiaReferenceContractEntry[] = [
  {
    perfilIndicatorId: "duke-apoyo-global",
    value: 47.3,
    easReferenceId: "duke-global-mean",
    method: "media DUKE global (suma P5701–P5711) de duke-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "duke-apoyo-confidencial",
    value: 29.9,
    method:
      "agregado meanConfidential del parser DUKE canónico sobre duke-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "duke-apoyo-afectivo",
    value: 17.4,
    method:
      "agregado meanAffective del parser DUKE canónico sobre duke-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "predimed-adherencia",
    value: 6.5,
    easReferenceId: "predimed-mean",
    method: "media PREDIMED-14 de predimed-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "sf12-pcs",
    value: 50.72,
    easReferenceId: "sf12-pcs-mean",
    method: "media PCS12_SP de sf12-eas-andalucia.csv (2 decimales)",
  },
  {
    perfilIndicatorId: "sf12-mcs",
    value: 51.22,
    easReferenceId: "sf12-mcs-mean",
    method: "media MCS12_SP de sf12-eas-andalucia.csv (2 decimales)",
  },
  {
    perfilIndicatorId: "sueno-insuficiente",
    value: 27.2,
    easReferenceId: "sueno-insuficiente",
    method: "porcentaje P33_R de sueno-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "sueno-no-descansa",
    value: 22.1,
    easReferenceId: "sueno-no-descansa",
    method: "porcentaje P33A de sueno-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "cage-riesgo",
    value: 1.0,
    easReferenceId: "cage-risk",
    method: "porcentaje CAGE_R de cage-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "ipaq-alta",
    value: 16.1,
    easReferenceId: "ipaq-high",
    method: "porcentaje IPAQ_DICO de ipaq-eas-andalucia.csv",
  },
  {
    perfilIndicatorId: "ipaq-inactividad",
    value: 36.6,
    easReferenceId: "ipaq-inactive",
    method: "porcentaje P34A_R de ipaq-eas-andalucia.csv",
  },
];

/** Búsqueda directa valor autonómico por id de indicador del Perfil. */
export const ANDALUSIA_REFERENCE_VALUE_BY_INDICATOR: Readonly<
  Record<string, number>
> = Object.fromEntries(
  ANDALUSIA_EAS_REFERENCE_CONTRACT.map((e) => [e.perfilIndicatorId, e.value])
);

/** Etiqueta institucional única de la referencia autonómica. */
export const ANDALUSIA_REFERENCE_LABEL =
  "referencia autonómica calculada desde microdatos EAS de Andalucía " +
  "mediante fixture autonómico equivalente";
