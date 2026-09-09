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
