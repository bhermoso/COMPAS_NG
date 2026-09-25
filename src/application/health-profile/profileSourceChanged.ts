import type { LocalHealthProfile } from '../../domain/health-profile';
import type { MunicipalityWorkspace } from '../../domain/workspace';

/** The evidence store can be unchanged even when the primary report changes. */
export function profileSourceChanged(profile:LocalHealthProfile,workspace:MunicipalityWorkspace):boolean {
 return profile.healthReportDocumentId !== workspace.healthReport?.linkedDocumentId;
}
