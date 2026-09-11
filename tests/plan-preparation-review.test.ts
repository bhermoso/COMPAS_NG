import {describe,expect,it} from 'vitest';
import {consolidatedTextFor,type PlanPreparationDecision,type PlanPreparationReviewDecision} from '../src/domain/action-plan-catalog/PlanPreparationDraft';

describe('Plan de Acción — consolidación administrativa',()=>{
 const source='Texto vigente';
 const proposal:PlanPreparationDecision={status:'modified',sourceText:source,text:'Propuesta territorial'};
 it('no convierte una propuesta territorial en texto consolidado sin revisión',()=>{
  expect(consolidatedTextFor(source,proposal,undefined)).toBe(source);
 });
 it('acepta, rechaza o reformula sin perder el texto de origen',()=>{
  const reviewedAt='2026-09-11T10:00:00.000Z';
  const accepted:PlanPreparationReviewDecision={status:'accepted',sourceText:source,proposedText:proposal.text,reviewedAt};
  const rejected:PlanPreparationReviewDecision={status:'rejected',sourceText:source,proposedText:proposal.text,reviewedAt};
  const reformulated:PlanPreparationReviewDecision={status:'reformulated',sourceText:source,proposedText:proposal.text,consolidatedText:'Redacción administrativa',reviewedAt};
  expect(consolidatedTextFor(source,proposal,accepted)).toBe('Propuesta territorial');
  expect(consolidatedTextFor(source,proposal,rejected)).toBe(source);
  expect(consolidatedTextFor(source,proposal,reformulated)).toBe('Redacción administrativa');
 });
});
