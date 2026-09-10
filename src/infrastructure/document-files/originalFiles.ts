// Private originals stay in this browser; they are never bundled or uploaded.
function database(): Promise<IDBDatabase> {
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open('compas-original-documents',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('files');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(new Error('No se pudo abrir el almacenamiento de archivos de este navegador.'));
 });
}
export async function saveOriginalFile(municipalityId:string,documentId:string,file:File):Promise<void>{
 const db=await database();
 try { await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction('files','readwrite');
  tx.objectStore('files').put(file,[municipalityId,documentId]);
  tx.oncomplete=()=>resolve();
  tx.onabort=()=>reject(new Error('No se pudo conservar el archivo original. Comprueba el espacio disponible en este navegador.'));
  tx.onerror=()=>reject(new Error('No se pudo conservar el archivo original.'));
 }); } finally { db.close(); }
}
export async function loadOriginalFile(municipalityId:string,documentId:string):Promise<File|undefined>{
 const db=await database();
 try { return await new Promise<File|undefined>((resolve,reject)=>{
  const request=db.transaction('files').objectStore('files').get([municipalityId,documentId]);
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(new Error('No se pudo recuperar el archivo original.'));
 }); } finally { db.close(); }
}
export async function deleteOriginalFile(municipalityId:string,documentId:string):Promise<void>{
 const db=await database();
 try { await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction('files','readwrite');
  tx.objectStore('files').delete([municipalityId,documentId]);
  tx.oncomplete=()=>resolve();
  tx.onabort=()=>reject(new Error('No se pudo eliminar el archivo original conservado en este navegador.'));
  tx.onerror=()=>reject(new Error('No se pudo eliminar el archivo original.'));
 }); } finally { db.close(); }
}

export interface OriginalEntry { municipalityId: string; documentId: string; file: File }
/** Includes unreferenced originals, so a backup does not silently discard them. */
export async function listOriginalFiles(): Promise<OriginalEntry[]> {
 const db = await database();
 try { return await new Promise<OriginalEntry[]>((resolve, reject) => {
  const entries: OriginalEntry[] = []; const tx = db.transaction('files');
  const request = tx.objectStore('files').openCursor();
  request.onsuccess = () => {
   const cursor = request.result; if (!cursor) return;
   const key = cursor.key;
   if (!Array.isArray(key) || key.length !== 2 || key.some(k => typeof k !== 'string') || !(cursor.value instanceof File)) { tx.abort(); return; }
   entries.push({municipalityId:key[0] as string, documentId:key[1] as string, file:cursor.value}); cursor.continue();
  };
  tx.oncomplete = () => resolve(entries);
  tx.onabort = tx.onerror = () => reject(new Error('No se han podido leer todos los originales. No se ha generado una copia incompleta.'));
 }); } finally { db.close(); }
}
/** Restore is additive; an existing original is never overwritten. */
export async function addOriginalFiles(entries: OriginalEntry[]): Promise<void> {
 const existing = new Map((await listOriginalFiles()).map(e => [JSON.stringify([e.municipalityId,e.documentId]),e.file]));
 const additions: OriginalEntry[] = [];
 for (const entry of entries) {
  const old = existing.get(JSON.stringify([entry.municipalityId,entry.documentId]));
  if (!old) { additions.push(entry); continue; }
  const a = new Uint8Array(await old.arrayBuffer()), b = new Uint8Array(await entry.file.arrayBuffer());
  if (old.name !== entry.file.name || old.type !== entry.file.type || old.lastModified !== entry.file.lastModified || a.length !== b.length || a.some((v,i) => v !== b[i])) throw new Error('Existe una versión diferente del original: ' + entry.file.name);
 }
 const db = await database();
 try { await new Promise<void>((resolve,reject) => {
  const tx = db.transaction('files','readwrite');
  for (const entry of additions) tx.objectStore('files').add(entry.file,[entry.municipalityId,entry.documentId]);
  tx.oncomplete = () => resolve();
  tx.onabort = tx.onerror = () => reject(new Error('No se pudieron incorporar los originales; no se ha sobrescrito ninguno. Comprueba el espacio y que no haya otra recuperación en curso.'));
 }); } finally { db.close(); }
}
