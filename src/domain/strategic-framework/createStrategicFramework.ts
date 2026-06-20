import type { StrategicFramework, StrategicFrameworkInput } from "./StrategicFramework";

export function createStrategicFramework(
  input: StrategicFrameworkInput
): StrategicFramework {
  const { municipalityName, sanitaryDistrict } = input;

  const districtRef = sanitaryDistrict !== undefined
    ? ` (Distrito Sanitario ${sanitaryDistrict})`
    : "";

  return {
    municipalityName,
    sanitaryDistrict,
    sections: [
      {
        id: "normativo",
        title: "Marco normativo",
        body: [
          "La acción local en salud en " + municipalityName + districtRef + " se enmarca en un conjunto de disposiciones normativas que establecen los fundamentos legales de la planificación sanitaria y la promoción de la salud.",
          "La Ley 33/2011, de 4 de octubre, General de Salud Pública, obliga a las administraciones públicas a articular políticas intersectoriales orientadas a reducir las desigualdades en salud y a reforzar la capacidad de respuesta comunitaria ante los determinantes sociales.",
          "La Ley 2/1998, de 15 de junio, de Salud de Andalucía, y la Ley 16/2011, de 23 de diciembre, de Salud Pública de Andalucía, completan el marco autonómico, atribuyendo a los municipios un papel activo en el diagnóstico territorial, la planificación local y la participación ciudadana en salud.",
          "El Decreto 69/2022, por el que se regulan los planes locales de salud, concreta las obligaciones y los instrumentos de los que disponen los municipios para desarrollar esta función.",
        ],
      },
      {
        id: "estrategico",
        title: "Marco estratégico: EPVSA 2024–2030",
        body: [
          "La Estrategia de Promoción de la Vida Saludable en Andalucía 2024–2030 (EPVSA) constituye el eje estratégico de referencia para la planificación local de salud en la comunidad autónoma. Define líneas de acción prioritarias en torno a la alimentación saludable, la actividad física, el bienestar emocional, la prevención de consumos perjudiciales y los entornos favorecedores de salud.",
          "En " + municipalityName + ", el Plan Local de Salud 2027–2030 adopta la EPVSA como marco orientador, traduciendo sus objetivos estratégicos en intervenciones adaptadas al contexto territorial, epidemiológico y socioeconómico del municipio.",
          "La alineación con la EPVSA permite articular la acción local con los recursos autonómicos disponibles, facilitar la comparabilidad de indicadores entre municipios RELAS y dotar al Plan Local de coherencia con las políticas de salud pública de la Junta de Andalucía.",
        ],
      },
      {
        id: "metodologico",
        title: "Marco metodológico: RELAS",
        body: [
          "La Red Local de Acción en Salud (RELAS) de Granada proporciona el marco metodológico en el que se inscribe el proceso de elaboración del Plan Local de Salud de " + municipalityName + ". RELAS integra a municipios, distritos sanitarios y equipos de salud pública en un proceso compartido de diagnóstico, planificación y evaluación.",
          "La metodología RELAS articula cuatro fases: diagnóstico de situación, priorización participativa, planificación de la acción e implementación y seguimiento. Cada fase combina análisis epidemiológico, participación ciudadana y trabajo intersectorial.",
          "El presente bloque marco constituye la sección introductoria del Perfil de Salud Local de " + municipalityName + ", que integrará el Informe de Salud, los estudios complementarios, la priorización temática, el mapa de activos comunitarios y la futura capa de mejoramiento municipal.",
        ],
      },
      {
        id: "salutogenico",
        title: "Enfoque salutogénico y basado en activos",
        body: [
          "El Plan Local de Salud de " + municipalityName + " adopta un enfoque salutogénico, orientado a identificar y movilizar los activos en salud presentes en el territorio: recursos personales, comunitarios e institucionales que contribuyen a la generación y el mantenimiento de la salud.",
          "Este enfoque, complementario al análisis epidemiológico de necesidades, reconoce la capacidad de las personas y las comunidades para participar activamente en la mejora de su salud y la de su entorno. Incorpora las dimensiones de resiliencia comunitaria, capital social y bienestar percibido como elementos sustantivos del diagnóstico territorial.",
          "La integración del mapa de activos comunitarios en el diagnóstico garantiza que las intervenciones del Plan Local se apoyen en fortalezas reales y no únicamente en la identificación de problemas o déficits.",
        ],
      },
      {
        id: "fuentes",
        title: "Fuentes de información y legitimidad del diagnóstico",
        body: [
          "El diagnóstico de salud de " + municipalityName + " se sustenta en fuentes de información diversas y complementarias: el Informe de Salud Municipal elaborado por el Distrito Sanitario" + (sanitaryDistrict !== undefined ? " " + sanitaryDistrict : "") + ", los registros del Sistema de Información Sanitaria de Andalucía (SISA), los datos del Instituto de Estadística y Cartografía de Andalucía (IECA), los indicadores del IBSE (Inventario de Bienestar Subjetivo Escolar) cuando están disponibles, y las aportaciones de la ciudadanía a través de los procesos participativos.",
          "La legitimidad del diagnóstico descansa en la pluralidad de fuentes, la transparencia metodológica y la participación de los actores locales en la validación de resultados. Ninguna fuente aislada determina las conclusiones del Perfil de Salud Local; la triangulación de evidencias es el criterio rector.",
          "Toda la documentación integrada en este proceso queda registrada en el repositorio documental de COMPÁS NG, garantizando la trazabilidad y reproducibilidad del diagnóstico.",
        ],
      },
    ],
  };
}
