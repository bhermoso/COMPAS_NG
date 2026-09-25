import type { MunicipalityWorkspace } from "../../domain/workspace/MunicipalityWorkspace";
import { createZaidinFinalActionPlanDraft, ZAIDIN_AGING_PROPOSAL } from "../../domain/action-plan-catalog/PlanPreparationDraft";

/** Explicit replacement authorized for the final September 25 edition. Never validates it. */
export function replaceZaidinFinalDraft(workspace: MunicipalityWorkspace, date = new Date().toISOString()): MunicipalityWorkspace {
 if (workspace.municipality.identity.id !== "granada-zaidin") return workspace;
 const drafts = workspace.planPreparationDrafts ?? [];
 const matches = drafts.filter(d=>d.municipalityId==="granada-zaidin"&&d.moduleId===ZAIDIN_AGING_PROPOSAL.id);
 if (matches.some(d=>d.version===ZAIDIN_AGING_PROPOSAL.version)) return workspace;
 return {...workspace,
  planPreparationDraftHistory: [...(workspace.planPreparationDraftHistory??[]), ...matches.map(draft=>({
   replacedAt:date, replacementVersion:ZAIDIN_AGING_PROPOSAL.version, draft:JSON.parse(JSON.stringify(draft)) as typeof draft
  }))],
  planPreparationDrafts:[...drafts.filter(d=>!(d.municipalityId==="granada-zaidin"&&d.moduleId===ZAIDIN_AGING_PROPOSAL.id)),createZaidinFinalActionPlanDraft(matches[0],date)],
  updatedAt:date
 };
}
