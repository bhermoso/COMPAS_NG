/**
 * eracisMunicipalContext
 *
 * Contexto oficial mínimo sobre Planes Locales de Intervención en Zonas
 * Desfavorecidas (ERACIS/PLIZD). No descarga documentos en runtime ni crea
 * evidencia: identifica fuentes oficiales que deben tratarse como contexto
 * territorial hasta que el expediente incorpore el texto completo.
 */

export interface EracisMunicipalContext {
  municipalityId: string;
  municipalityName: string;
  province: string;
  disadvantagedZones: string[];
  officialAreaCodes?: string[];
  sourceTitle: string;
  sourcePageUrl: string;
  planUrl?: string;
  listedByJunta: boolean;
  accessStatus: "officially-listed" | "listed-url-unreachable";
  checkedAt: string;
  notes: string[];
}

const ERACIS_CONTEXTS: Record<string, EracisMunicipalContext> = {
  loja: {
    municipalityId: "loja",
    municipalityName: "Loja",
    province: "Granada",
    disadvantagedZones: ["Alcazaba y Alfaguara"],
    officialAreaCodes: ["181221"],
    sourceTitle:
      "BOJA 68/2026 - zonas desfavorecidas de Andalucía",
    sourcePageUrl:
      "https://www.juntadeandalucia.es/boja/2026/68/8",
    listedByJunta: true,
    accessStatus: "officially-listed",
    checkedAt: "2026-10-11",
    notes: [
      "Loja figura en fuente oficial de la Junta de Andalucía como municipio con zona desfavorecida.",
      "La zona oficial identificada para Loja es Alcazaba y Alfaguara.",
      "El dato acredita pertinencia territorial de ERACIS/PLIZD; el diagnóstico local completo debe incorporarse como documento si se obtiene.",
    ],
  },
};

export function getEracisMunicipalContext(
  municipalityId: string
): EracisMunicipalContext | undefined {
  return ERACIS_CONTEXTS[municipalityId];
}
