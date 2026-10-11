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
    sourceTitle:
      "Planes Locales de Intervención en Zonas Desfavorecidas - Junta de Andalucía",
    sourcePageUrl:
      "https://www.juntadeandalucia.es/organismos/serviciossocialesfamiliaseigualdad/areas/inclusion/zonas-transformacion/paginas/planes-zonas-transformacion.html",
    planUrl:
      "https://www.aytoloja.org/ayuntamiento/doc/planlocalzdesfavorecidas.pdf",
    listedByJunta: true,
    accessStatus: "listed-url-unreachable",
    checkedAt: "2026-10-10",
    notes: [
      "Loja figura en el listado oficial de la Junta de Andalucía para la provincia de Granada.",
      "El enlace municipal al PDF del plan local estaba identificado oficialmente, pero no respondió a la comprobación de descarga del 2026-10-10.",
      "Debe tratarse como fuente oficial localizada y pendiente de incorporación textual al expediente, no como documento ya descargado.",
    ],
  },
};

export function getEracisMunicipalContext(
  municipalityId: string
): EracisMunicipalContext | undefined {
  return ERACIS_CONTEXTS[municipalityId];
}
