import type {
  UGCDenominatorType,
  UGCIndicatorNature,
} from "./UGCClinicalAssistanceReading";

export interface UGCIndicatorClassification {
  nature: UGCIndicatorNature;
  denominatorType: UGCDenominatorType;
  /** Identificador de la regla aplicada, para auditar la clasificación. */
  basis: string;
}

/**
 * Clasificación por ÁREA cuando el área es inequívoca respecto a la familia.
 * Tiene prioridad sobre las reglas de nombre.
 */
const AREA_RULES: Record<
  string,
  { nature: UGCIndicatorNature; denominatorType: UGCDenominatorType }
> = {
  Mortalidad: { nature: "assistance-mortality", denominatorType: "events" },
  "Información Municipal": {
    nature: "municipal-context",
    denominatorType: "municipal-resource",
  },
  "Información Usuarios BDU": {
    nature: "assigned-population",
    denominatorType: "assigned-population",
  },
};

interface NameRule {
  id: string;
  pattern: RegExp;
  nature: UGCIndicatorNature;
  denominatorType: UGCDenominatorType;
}

/**
 * Reglas por patrón del NOMBRE, en orden de prioridad (primer match gana). Cada
 * regla es reproducible, explicable y auditable. No son reglas clínicas ni
 * causales: solo agrupan el TIPO de indicador por su enunciado. Ante la
 * ausencia de match: `unknown` (no se fuerza ninguna familia).
 */
const NAME_RULES: NameRule[] = [
  {
    id: "name:mortalidad",
    pattern: /mortalidad|fallecimient/i,
    nature: "assistance-mortality",
    denominatorType: "events",
  },
  {
    id: "name:frecuentacion",
    pattern: /hiperfrecuentad|frecuentaci[oó]n/i,
    nature: "service-utilization",
    denominatorType: "attended-population",
  },
  {
    id: "name:ingresos",
    pattern: /\bingresos?\b/i,
    nature: "service-utilization",
    denominatorType: "events",
  },
  {
    id: "name:calidad",
    pattern: /calidad\b/i,
    nature: "care-quality",
    denominatorType: "unknown",
  },
  {
    id: "name:cobertura",
    pattern: /\bcobertura\b/i,
    nature: "care-process",
    denominatorType: "assigned-population",
  },
  {
    id: "name:tao-administrativo",
    pattern: /\bTAO\b|tarjeta de cuidados/i,
    nature: "administrative-record",
    denominatorType: "registered-patients",
  },
  {
    id: "name:estado-salud-registrado",
    pattern:
      /prevalencia|tasa bruta.*neo|nuevos diagn[oó]sticos neo|incidencia de|retinopat[ií]a|\bUPP\b|citolog[ií]as anormales|casos? nuevos|nº casos|\bIVEs?\b/i,
    nature: "registered-health-status",
    denominatorType: "registered-patients",
  },
  {
    id: "name:proceso-programatico",
    pattern:
      /\bPAI\b|P\.A\.|cartera servicios|diagn[oó]stico precoz|\bPID\b|PDPRD|retinograf[ií]a|hba1c|exploraci[oó]n de pies|citolog[ií]a|incluid|en seguimiento|test de braden|vacunad|plan de actuaci[oó]n|con determinaci[oó]n|prueba del tal[oó]n|opioides|braden|captaci[oó]n|gestante|pu[eé]rpera|educaci[oó]n maternal|reci[eé]n nacid|registro de peso|detecci[oó]n obesidad|registro del h[aá]bito|fumadores|tab[aá]qui|\bCDI\b|intervenci[oó]n avanzada/i,
    nature: "care-process",
    denominatorType: "registered-patients",
  },
];

/**
 * Clasifica un indicador clínico-asistencial de forma conservadora. El área
 * inequívoca (Mortalidad / Información Municipal / Información Usuarios BDU)
 * prevalece; en su defecto se aplican patrones de nombre; si nada encaja,
 * `unknown`. Función pura y determinista.
 */
export function classifyUGCIndicator(
  indicatorName: string,
  area: string
): UGCIndicatorClassification {
  const areaRule = AREA_RULES[area];
  if (areaRule) {
    return { ...areaRule, basis: `area:${area}` };
  }
  for (const rule of NAME_RULES) {
    if (rule.pattern.test(indicatorName)) {
      return {
        nature: rule.nature,
        denominatorType: rule.denominatorType,
        basis: rule.id,
      };
    }
  }
  return { nature: "unknown", denominatorType: "unknown", basis: "default" };
}
