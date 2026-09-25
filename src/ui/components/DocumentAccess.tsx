import { useEffect,useState } from 'react';
import type { MunicipalDocument } from '../../domain/repository';
import { loadOriginalFile,saveOriginalFile } from '../../infrastructure/document-files/originalFiles';
import { documentAccessUrl, documentDownloadFileName, isPdfDocumentAccess } from './documentAccessUtils';

export function DocumentAccess({document:doc,documentLabel}:{document:MunicipalDocument;documentLabel?:string}){
 const contextualLabel=documentLabel?.trim();
 const [file,setFile]=useState<File>();const [message,setMessage]=useState('');
 const [loading,setLoading]=useState(true);
 // La consulta IndexedDB depende del documento; el reset evita mostrar un original anterior.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{let active=true;setFile(undefined);setLoading(true);setMessage('');
 loadOriginalFile(doc.municipalityId,doc.id).then(f=>{if(active)setFile(f);}).catch(e=>{if(active)setMessage(e.message);}).finally(()=>{if(active)setLoading(false);});
 return ()=>{active=false;};},[doc.id,doc.municipalityId]);
 const url=documentAccessUrl(doc.source.url);
 function download(){
  if(!file)return;
  const href=URL.createObjectURL(file);const a=window.document.createElement('a');
  a.href=href;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);
 }
 return <div className="document-access">
  {url && isPdfDocumentAccess(doc.source.url) && <div className="document-access__links">
   <a className="doc-repo__open" href={url} download={doc.sourceFileName ?? documentDownloadFileName(doc.source.url, doc.title)} aria-label={`${contextualLabel ? `Descargar ${contextualLabel}` : "Descargar PDF original"}: ${doc.title}`}>{contextualLabel ? `Descargar ${contextualLabel}` : "Descargar PDF original"}</a>
   <a className="doc-repo__open doc-repo__open--secondary" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${contextualLabel ? `Abrir ${contextualLabel} en nueva pestaña` : "Abrir PDF en nueva pestaña"}: ${doc.title}`}>{contextualLabel ? `Abrir ${contextualLabel} en nueva pestaña` : "Abrir en nueva pestaña"}</a>
   <p className="document-access__notice">Si el visor integrado muestra una pestaña vacía, usa la descarga {contextualLabel ? `del ${contextualLabel}` : "del PDF original"}.</p>
  </div>}
  {url && !isPdfDocumentAccess(doc.source.url) && <a className="doc-repo__open" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir documento: ${doc.title} (nueva pestaña)`}>Abrir documento ↗</a>}
  {file && <p><button type="button" onClick={download}>Descargar original · {file.name}</button> <small>Conservado en este navegador.</small></p>}
  {!loading && !file && !url && <p><strong>Archivo original no disponible.</strong> {doc.sourceText?.trim() ? 'Puedes consultar el texto conservado.' : 'Solo se conserva la referencia o los datos derivados.'}</p>}
  {doc.sourceText?.trim() && <details><summary>Consultar texto conservado</summary><p style={{whiteSpace:'pre-wrap'}}>{doc.sourceText}</p></details>}
  {!url && <label className="document-access__attach">{file ? 'Sustituir archivo conservado' : 'Adjuntar el archivo original'}
   <input type="file" aria-label={`Adjuntar original: ${doc.title}`} onChange={async e=>{
    const input=e.currentTarget;const next=input.files?.[0];if(!next)return;
    if(!window.confirm(`¿Vincular «${next.name}» a «${doc.title}»? Comprueba que corresponde a este documento. Sus datos y evidencias no se recalcularán.`)){input.value='';return;}
    try{await saveOriginalFile(doc.municipalityId,doc.id,next);setFile(next);setMessage('Archivo conservado. Para trasladarlo junto al expediente, utiliza «Copias y recuperación del trabajo» y descarga la copia con originales.');}
    catch(error){setMessage((error as Error).message);}
    input.value='';
   }}/>
  </label>}
  {message && <p role="status">{message}</p>}
 </div>;
}
