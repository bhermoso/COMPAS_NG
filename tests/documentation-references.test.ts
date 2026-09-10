import { describe, it, expect } from 'vitest';
import { resolveDocumentReference } from '../src/ui/components/Documentation';
import seed from '../public/seeds/compas-ng-workspace-granada-zaidin.json';
import type { MunicipalDocument } from '../src/domain/repository';
const docs = seed.repository.documents as MunicipalDocument[];
describe('Document references', () => {
 it('does not substitute another file for an explicit missing ID', () => {
  expect(resolveDocumentReference(docs, {documentId:'missing',fileName:docs[0].sourceFileName})).toEqual([]);
 });
 it('preserves ambiguity instead of selecting an arbitrary original', () => {
  const original = docs.find(d => d.sourceFileName)!;
  expect(resolveDocumentReference([original,{...original,id:'duplicate'}],{fileName:original.sourceFileName})).toHaveLength(2);
 });
 it('resolves both retained UGC sources separately', () => {
  for(const name of ['Informe Zaidin Centro Este.docx','Informe Zaidin Sur.docx']) {
   const found=resolveDocumentReference(docs,{fileName:name});
   expect(found).toHaveLength(1);expect(found[0].sourceText).toContain('VIGILANCIA INTEGRAL DE LA SALUD');
  }
 });
});
