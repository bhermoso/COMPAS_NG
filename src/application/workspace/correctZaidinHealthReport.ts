import type { MunicipalityWorkspace } from '../../domain/workspace';
import type { HealthReportDocument } from '../../domain/health-report';
import type { MunicipalDocument } from '../../domain/repository';

export const ZAIDIN_REPORT_CORRECTION = 'zaidin-original-pdf-abril2023-v1';
export const ZAIDIN_PDF_DOCUMENT_ID = 'health-report:granada-zaidin:original-abril-2023';
export const ZAIDIN_PDF_SOURCE = 'docs/source-material/health-reports/informe-salud-zaidin-abril-2023.pdf';
const stamp = '2026-09-10T00:00:00.000Z';
export const zaidinOriginalReport: HealthReportDocument = {
 id: 'health-report-original-zaidin-abril2023', municipalityId: 'granada-zaidin',
 linkedDocumentId: ZAIDIN_PDF_DOCUMENT_ID,
 sourceFileName: 'informe salud granada-zaidin completo abril 2023.pdf',
 title: 'Informe de Salud del Distrito Zaidín (Granada) — abril de 2023',
 reportingPeriod: 'Abril de 2023', authors: [],
 body: {originalText:'',format:'plain',charCount:0,isAuthoritative:true},
 sections: [],createdAt:stamp,updatedAt:stamp,
};
export const zaidinOriginalDocument: MunicipalDocument = {
 id:ZAIDIN_PDF_DOCUMENT_ID,municipalityId:'granada-zaidin',kind:'health-report',
 title:zaidinOriginalReport.title,status:'uploaded',
 source:{system:'PDF original aportado por la coordinación · 130 páginas',url:ZAIDIN_PDF_SOURCE,collectedAt:stamp},
 sourceFileName:zaidinOriginalReport.sourceFileName,canGenerateEvidence:false,
 tags:['health-report','primary-source','original-pdf'],createdAt:stamp,updatedAt:stamp,
};

/** Replace only the identified historical conversion. Never overwrite a later report. */
export function correctZaidinHealthReport(workspace:MunicipalityWorkspace):MunicipalityWorkspace {
 if(workspace.municipality.identity.id!=='granada-zaidin' ||
    workspace.appliedSeedMigrations?.includes(ZAIDIN_REPORT_CORRECTION))return workspace;
 const previous=workspace.healthReport;
 if(!previous || previous.sourceFileName!=='Informe_Salud_Granada_Abril2023_estilo_Atarfe.docx')return workspace;
 const record=workspace.repository.documents.find(d=>d.id===previous.linkedDocumentId);
 if(!record || record.sourceFileName!==previous.sourceFileName)return workspace;
 return {...workspace,
  healthReport:zaidinOriginalReport,
  previousProfileRevisions:workspace.validatedPSL ?
   [...(workspace.previousProfileRevisions??[]),{profile:workspace.validatedPSL,answers:workspace.validatedAnswersSnapshot}] :
   workspace.previousProfileRevisions,
  previousHealthReports:[...(workspace.previousHealthReports??[]),previous],
  repository:{...workspace.repository,documents:[
   ...workspace.repository.documents.filter(d=>d.id!==ZAIDIN_PDF_DOCUMENT_ID).map(d=>d.id===record.id ?
    {...d,kind:'other' as const,status:'archived' as const,title:'Conversión histórica del informe — Word estilo Atarfe',tags:[...d.tags,'historical-conversion'],updatedAt:stamp} : d),
   zaidinOriginalDocument,
  ],updatedAt:stamp},
  appliedSeedMigrations:[...(workspace.appliedSeedMigrations??[]),ZAIDIN_REPORT_CORRECTION],
 };
}
