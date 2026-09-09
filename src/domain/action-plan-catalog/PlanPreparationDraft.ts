import { HEALTHY_AGING_MODULE, type ActionPlanCatalogModule } from "./ActionPlanCatalog";
export const ZAIDIN_PROPOSAL_VERSION = "zaidin-4-bloques-2026-09-09-r2";
export const plainProposalText = (text: string) => text.replaceAll("**", "");
export const proposalStrategicText = "**Favorecer** el **envejecimiento saludable** de las personas mayores del Zaidín mediante la **reducción del edadismo**, la **prevención y el abordaje de la soledad no deseada**, el **mantenimiento de la autonomía** y el **fortalecimiento de la participación comunitaria**.";
export const proposalObjectiveTexts: Record<string, string> = {
  "ENV-OE5.1": "**Reducir las actitudes edadistas entre la población escolarizada** (PROGRAMA MANY AGES, ONE LIFE).",
  "ENV-OE5.2": "Incrementar la **visibilidad de las personas mayores como personas capaces, diversas y socialmente activas en las iniciativas comunitarias** (CAMPAÑA/FESTIVAL ZAIDÍN SENIOR FEST).",
  "ENV-OE2.1": "Aumentar la **detección de situaciones de soledad o riesgo de soledad** entre las personas mayores contactadas por los **recursos y agentes participantes**.",
  "ENV-OE2.2": "Reducir la **soledad percibida** entre las personas mayores **incorporadas a una intervención por situación de soledad**.",
  "ENV-OE3.1": "Mejorar la red social de las personas mayores identificadas **con riesgo de aislamiento social**.",
  "ENV-OE3.2": "Mejorar el **apoyo social percibido** por las personas mayores identificadas **con apoyo insuficiente**.",
  "ENV-OE6.1": "Aumentar la **capacidad de los agentes comunitarios** para **identificar y canalizar situaciones de soledad o riesgo de aislamiento social**.",
  "ENV-OE6.2": "Incrementar la **implicación de los activos comunitarios** en **actuaciones orientadas a favorecer relaciones sociales y prevenir la soledad**.",
  "ENV-OE7.2": "Mejorar la **continuidad entre la detección comunitaria, la valoración y la respuesta ante situaciones de soledad o aislamiento**.",
  "ENV-OE1.1": "Mantener y fortalecer la **autonomía de las personas mayores participantes para decidir y desarrollar su vida cotidiana, sus relaciones y su participación comunitaria**, con los **apoyos que necesiten**.",
  "ENV-OE1.2": "Mejorar el **bienestar emocional de las personas mayores** participantes en **intervenciones específicamente dirigidas a este fin**.",
  "ENV-OE8.1": "Reducir las **barreras de accesibilidad identificadas como prioritarias en los espacios y equipamientos comunitarios**.",
  "ENV-OE8.2": "Mejorar la **accesibilidad a los recursos y actividades comunitarias dirigidos o abiertos a las personas mayores**.",
  "ENV-OE4.1": "Aumentar la **participación de las personas mayores en actividades comunitarias significativas para ellas**.",
  "ENV-OE4.2": "Incrementar el **protagonismo de las personas mayores como agentes activos de la comunidad**.",
  "ENV-OE9.1": "Mejorar las **competencias digitales funcionales** de las personas mayores **con dificultades para utilizar servicios digitales**.",
  "ENV-OE9.2": "Aumentar la **autonomía de las personas mayores para realizar gestiones digitales esenciales**.",
  "ENV-OE7.1": "Consolidar la **participación estable de los recursos sanitarios, sociales, municipales y comunitarios en la coordinación de la línea de envejecimiento saludable**."
};
export const proposalBlocks = [
  {
    "code": "ENV-B-edadismo",
    "name": "Edadismo",
    "text": "**Reducir el edadismo entre la población escolarizada y promover en el ámbito comunitario el reconocimiento social de las personas mayores (CAMPAÑA/FESTIVAL ZAIDÍN SENIOR FEST).**",
    "objectives": [
      "ENV-OE5.1",
      "ENV-OE5.2"
    ]
  },
  {
    "code": "ENV-B-soledad",
    "name": "Soledad no deseada",
    "text": "Prevenir y reducir la **soledad no deseada** y el **aislamiento social**, fortaleciendo las **relaciones**, el **apoyo social** y la **respuesta comunitaria**.",
    "objectives": [
      "ENV-OE2.1",
      "ENV-OE2.2",
      "ENV-OE3.1",
      "ENV-OE3.2",
      "ENV-OE6.1",
      "ENV-OE6.2",
      "ENV-OE7.2"
    ]
  },
  {
    "code": "ENV-B-autonomia",
    "name": "Autonomía",
    "text": "Preservar y fortalecer la **autonomía de las personas mayores para decidir y desarrollar su vida cotidiana, sus relaciones y su participación en la comunidad**, contando con los **apoyos que necesiten**, y promover su **bienestar emocional**.",
    "objectives": [
      "ENV-OE1.1",
      "ENV-OE1.2"
    ]
  },
  {
    "code": "ENV-B-participacion",
    "name": "Participación",
    "text": "Incrementar la **participación significativa** y el **protagonismo de las personas mayores en la comunidad**, reduciendo las **barreras de accesibilidad a los recursos, servicios y actividades comunitarias** y la **brecha digital**, y fortaleciendo la **coordinación comunitaria**.",
    "objectives": [
      "ENV-OE4.1",
      "ENV-OE4.2",
      "ENV-OE8.1",
      "ENV-OE8.2",
      "ENV-OE9.1",
      "ENV-OE9.2",
      "ENV-OE7.1"
    ]
  }
];
export const ZAIDIN_AGING_PROPOSAL: ActionPlanCatalogModule = {
 ...HEALTHY_AGING_MODULE, version: ZAIDIN_PROPOSAL_VERSION,
 sourceLabel: "Propuesta de El Zaidín revisada por Blas · documento de trabajo 92418", sourceDate: "2026-09-09",
 strategicObjective: plainProposalText(proposalStrategicText),
 generalObjectives: proposalBlocks.map(block => ({code: block.code, title: plainProposalText(block.text),
 specificObjectives: block.objectives.map(code => {
 const original = HEALTHY_AGING_MODULE.generalObjectives.flatMap(g => g.specificObjectives).find(o => o.code === code);
 if (!original) throw new Error(`Objetivo original ausente: ${code}`);
 return {...original, title: plainProposalText(proposalObjectiveTexts[code])};
 })}))
};
export interface PlanPreparationDecision { status: "pending" | "included" | "excluded" | "modified"; text?: string; sourceText: string }
export interface PlanPreparationDraft { municipalityId: string; moduleId: string; version: string; updatedAt: string; decisions: Record<string, PlanPreparationDecision> }
export function excludedByAncestor(draft: PlanPreparationDraft | undefined, ancestors: string[]): boolean {
 return ancestors.some(id => draft?.decisions[id]?.status === "excluded");
}
