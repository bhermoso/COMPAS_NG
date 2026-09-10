import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import type { MunicipalityWorkspace } from '../../domain/workspace/MunicipalityWorkspace';
import type { MunicipalDocument } from '../../domain/repository';
import { DocumentAccess } from './DocumentAccess';

interface Reference { documentId?: string; fileName?: string }
const DocumentationContext = createContext<((reference: Reference) => void) | null>(null);

// An explicit ID never falls back to a similarly named document.
export function resolveDocumentReference(documents: MunicipalDocument[], reference: Reference) {
  if (reference.documentId) return documents.filter(d => d.id === reference.documentId);
  if (reference.fileName) return documents.filter(d => d.sourceFileName === reference.fileName);
  return [];
}

export function DocumentReference({ children, documentId, fileName }: Reference & { children: ReactNode }) {
  const open = useContext(DocumentationContext);
  if (!open) return <>{children}</>;
  return <button type="button" className="document-reference" onClick={() => open({ documentId, fileName })}>{children}</button>;
}

export function DocumentationProvider({ workspace, children }: { workspace: MunicipalityWorkspace; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [reference, setReference] = useState<Reference | null>(null);
  const [query, setQuery] = useState('');
  const documents = workspace.repository.documents;
  const matches = reference ? resolveDocumentReference(documents, reference) : [];
  const selected = matches.length === 1 ? matches[0] : undefined;
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = documents.filter(d => normalize(`${d.title} ${d.sourceFileName ?? ''} ${d.source.system ?? ''}`).includes(normalize(query)));
  function open(next: Reference | null) { setReference(next); setQuery(''); dialog.current?.showModal(); }
  const historical = selected && workspace.previousHealthReports?.find(r => r.linkedDocumentId === selected.id);
  return <DocumentationContext.Provider value={open}>
    {children}
    <button type="button" className="documentation-launcher" onClick={() => open(null)}>Consultar documentación ({documents.length})</button>
    <dialog ref={dialog} className="documentation-dialog" aria-labelledby="documentation-title">
      <header><h2 id="documentation-title">{selected ? selected.title : 'Documentación del expediente'}</h2><button type="button" autoFocus onClick={() => dialog.current?.close()}>Cerrar</button></header>
      {selected ? <>
        <p><strong>Archivo de referencia:</strong> {selected.sourceFileName ?? 'Nombre no registrado'}</p>
        <p>{selected.source.system}</p>
        <DocumentAccess key={selected.id} document={selected} />
        {historical?.body.originalText && !selected.sourceText && <details><summary>Consultar texto de la conversión histórica</summary><p className="documentation-text">{historical.body.originalText}</p></details>}
        <p><button type="button" onClick={() => setReference(null)}>Ver toda la documentación</button></p>
      </> : <>
        {reference && <p role="status"><strong>{matches.length ? 'Hay varias referencias con ese nombre.' : 'No se ha localizado el documento en este expediente.'}</strong> {reference.fileName ?? reference.documentId}. {matches.length ? 'Selecciona el documento correspondiente.' : 'Puedes buscarlo en el catálogo. Una mención no acredita que el archivo esté disponible.'}</p>}
        <label>Buscar por título o nombre de archivo<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <ul>{(matches.length > 1 && !query ? matches : filtered).map(d => <li key={d.id}><DocumentReference documentId={d.id}>{d.title}</DocumentReference><small>{d.sourceFileName ?? 'Sin nombre de archivo'}{d.status === 'archived' ? ' · Referencia histórica' : ''}</small></li>)}</ul>
        {!filtered.length && <p>No hay documentos que coincidan con la búsqueda.</p>}
      </>}
    </dialog>
  </DocumentationContext.Provider>;
}
