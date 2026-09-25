import { describe,it,expect } from "vitest";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";
import { replaceZaidinFinalDraft } from "../src/application/workspace/replaceZaidinFinalDraft";
import { createZaidinFinalActionPlanDraft, ZAIDIN_AGING_PROPOSAL } from "../src/domain/action-plan-catalog/PlanPreparationDraft";
describe("Sustitución final Zaidín",()=>{
 it("archiva el borrador anterior sin modificar las validaciones ni otros ámbitos",()=>{
  const workspace=createCompleteMunicipalityWorkspace({id:"granada-zaidin",name:"Zaidín"});
  const old=createZaidinFinalActionPlanDraft(undefined,"2026-09-20");
  old.version="anterior";old.decisions["ENV-OE5.1"]={status:"modified",sourceText:"Original",text:"Texto anterior propio"};
  old.decisions["ENV-OE5.2"]={status:"excluded",sourceText:"Excluido anterior"};
  const other={...old,municipalityId:"atarfe"};
  workspace.planPreparationDrafts=[old,other];
  const before=JSON.stringify(workspace);
  const result=replaceZaidinFinalDraft(workspace,"2026-09-25");
  expect(JSON.stringify(workspace)).toBe(before);
  expect(result.planPreparationDraftHistory![0].draft).toEqual(old);
  expect(result.planPreparationDrafts).toContain(other);
  const current=result.planPreparationDrafts!.find(d=>d.municipalityId==="granada-zaidin")!;
  expect(current.version).toBe(ZAIDIN_AGING_PROPOSAL.version);
  expect(current.decisions["ENV-OE5.1"].status).toBe("included");
  expect(current.decisions["ENV-OE5.2"].status).toBe("included");
  expect(result.validatedActionPlans).toBe(workspace.validatedActionPlans);
  expect(replaceZaidinFinalDraft(result)).toBe(result);
  const reopened=JSON.parse(JSON.stringify(result));
  expect(replaceZaidinFinalDraft(reopened)).toBe(reopened);
  expect(reopened.planPreparationDraftHistory[0].draft.decisions["ENV-OE5.1"].text).toBe("Texto anterior propio");
 });
 it("no cambia otros municipios",()=>{
  const w=createCompleteMunicipalityWorkspace({id:"atarfe",name:"Atarfe"});
  expect(replaceZaidinFinalDraft(w)).toBe(w);
 });
});
