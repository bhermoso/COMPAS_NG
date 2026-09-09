import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import seed from '../public/seeds/compas-ng-workspace-granada-zaidin.json';
import { documentAccessUrl } from '../src/ui/components/documentAccess';
import { DocumentRepositoryPanel } from '../src/ui/components/DocumentRepositoryPanel';
import type { MunicipalDocumentRepository } from '../src/domain/repository';

describe('Acceso a documentos del repositorio', () => {
 const repository = seed.repository as MunicipalDocumentRepository;
 it('ofrece acceso a los tres PDF ya referenciados en los expedientes', () => {
  const documents = repository.documents.filter(d => d.kind === 'strategic-framework');
  expect(documents).toHaveLength(3);
  for (const document of documents) {
   expect(documentAccessUrl(document.source.url)).toMatch(/\.pdf/);
  }
  const html = renderToStaticMarkup(<DocumentRepositoryPanel repository={repository}/>);
  expect(html.match(/class="doc-repo__open"/g)).toHaveLength(6);
  expect(html).toContain('Todos los documentos del expediente');
 });
 it('no convierte rutas desconocidas o esquemas ejecutables en enlaces', () => {
  for(const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///tmp/a.pdf', 'docs/desconocido.pdf', '__proto__', undefined]) expect(documentAccessUrl(url)).toBeUndefined();
  expect(documentAccessUrl('https://example.org/doc.pdf')).toBe('https://example.org/doc.pdf');
 });
 it('distingue una referencia sin archivo y permite leer texto conservado', () => {
  const doc = {...repository.documents.find(d => d.kind === 'strategic-framework')!,source:{},sourceText:'Texto de referencia'};
  const html = renderToStaticMarkup(<DocumentRepositoryPanel repository={{...repository,documents:[doc]}}/>);
  expect(html).toContain('Adjuntar el archivo original');
  expect(html).toContain('Consultar texto conservado');
  expect(html).not.toContain('doc-repo__open');
 });
});
