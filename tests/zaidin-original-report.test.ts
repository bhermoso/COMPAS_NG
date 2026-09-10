import {describe,it,expect} from 'vitest';
import seed from '../public/seeds/compas-ng-workspace-granada-zaidin.json';
import {correctZaidinHealthReport,ZAIDIN_REPORT_CORRECTION,ZAIDIN_PDF_DOCUMENT_ID} from '../src/application/workspace/correctZaidinHealthReport';
import type {MunicipalityWorkspace} from '../src/domain/workspace';
import {parseWorkspaceJSON} from '../src/infrastructure/persistence/local-storage';
function historical():MunicipalityWorkspace {
 const current=structuredClone(seed) as unknown as MunicipalityWorkspace;
 const old=current.previousHealthReports![0];
 return {...current,healthReport:old,previousHealthReports:[],
  appliedSeedMigrations:current.appliedSeedMigrations?.filter(x=>x!==ZAIDIN_REPORT_CORRECTION),
  repository:{...current.repository,documents:current.repository.documents.filter(d=>d.id!==ZAIDIN_PDF_DOCUMENT_ID).map(d=>d.id===old.linkedDocumentId?{...d,kind:'health-report',status:'uploaded',title:old.title}:d)}};
}
describe('Informe original del Zaidín',()=>{
 it('sustituye la conversión conservando el historial, las UGC y el trabajo del expediente',()=>{
  const original=historical();const snapshot=JSON.stringify(original);const next=correctZaidinHealthReport(original);
  expect(next.healthReport?.sourceFileName).toBe('informe salud granada-zaidin completo abril 2023.pdf');
  expect(next.previousHealthReports?.[0]).toEqual(original.healthReport);
  expect(next.repository.documents.filter(d=>d.kind==='territorial-documentation')).toEqual(original.repository.documents.filter(d=>d.kind==='territorial-documentation'));
  expect(next.evidenceStore).toBe(original.evidenceStore);
  expect(next.indicatorWorksheets).toBe(original.indicatorWorksheets);
  expect(JSON.stringify(original)).toBe(snapshot);
  expect(correctZaidinHealthReport(next)).toBe(next);
 });
 it('no reemplaza informes posteriores ni resucita un PDF eliminado después de la corrección',()=>{
  const current=historical();current.healthReport={...current.healthReport!,sourceFileName:'informe-actualizado.pdf'};
  expect(correctZaidinHealthReport(current)).toBe(current);
  const corrected=correctZaidinHealthReport(historical());corrected.healthReport=undefined;
  corrected.repository.documents=corrected.repository.documents.filter(d=>d.id!==ZAIDIN_PDF_DOCUMENT_ID);
  expect(correctZaidinHealthReport(corrected)).toBe(corrected);
 });
 it('corrige al importar expedientes antiguos y el seed nuevo ya apunta al PDF',()=>{
  const parsed=parseWorkspaceJSON(JSON.stringify(historical()));
  expect(parsed?.healthReport?.linkedDocumentId).toBe(ZAIDIN_PDF_DOCUMENT_ID);
  expect(seed.healthReport.linkedDocumentId).toBe(ZAIDIN_PDF_DOCUMENT_ID);
 });
});
