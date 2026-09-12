import { ACTION_PLAN_CATALOG } from '../../domain/action-plan-catalog';
import { ZAIDIN_AGING_PROPOSAL } from '../../domain/action-plan-catalog/PlanPreparationDraft';
import {DefinitiveActionPlanPreview} from './DefinitiveActionPlanPreview';
import {LegacyActionPlanCatalogPanel,type LegacyActionPlanCatalogPanelProps} from './LegacyActionPlanCatalogPanel';

export function ActionPlanCatalogPanel(props:LegacyActionPlanCatalogPanelProps){
 const modules=ACTION_PLAN_CATALOG.map(original => props.municipalityId === 'granada-zaidin' && original.id === ZAIDIN_AGING_PROPOSAL.id ? ZAIDIN_AGING_PROPOSAL : original);
 return <>
  <DefinitiveActionPlanPreview municipalityId={props.municipalityId} modules={modules} drafts={props.drafts}/>
  <LegacyActionPlanCatalogPanel {...props}/>
 </>;
}
