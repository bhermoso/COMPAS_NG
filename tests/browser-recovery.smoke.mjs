import assert from 'node:assert/strict';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'vite';
import {chromium} from 'playwright';
const server=await createServer({server:{host:'127.0.0.1',port:0}});await server.listen();
const dir=await mkdtemp(join(tmpdir(),'compas-backup-test-'));let browser;
try {
 browser=await chromium.launch({executablePath:process.env.COMPAS_TEST_CHROMIUM,headless:true,args:['--no-sandbox']});
 const base='http://127.0.0.1:'+server.httpServer.address().port+'/COMPAS_NG/';
 const createPage=async()=>{const context=await browser.newContext();const page=await context.newPage();await page.goto(base+'?vista=recuperacion');await page.getByRole('heading',{name:'Conservar y recuperar el trabajo'}).waitFor();return page;};
 const source=await createPage();
 assert.equal(await source.evaluate(()=>localStorage.length),0,'Recovery must not hydrate seeds');
 const seeds=await Promise.all(['atarfe','granada-zaidin'].map(id=>readFile('public/seeds/compas-ng-workspace-'+id+'.json','utf8')));
 await source.evaluate(async seeds=>{
  for(const text of seeds){const w=JSON.parse(text);localStorage.setItem('compas-ng:workspace:'+w.municipality.identity.id,text);}
  const {ZAIDIN_AGING_PROPOSAL}=await import('/COMPAS_NG/src/domain/action-plan-catalog/PlanPreparationDraft.ts');
  localStorage.setItem('compas-ng:demo:coordinacion-zaidin:v1',JSON.stringify({municipalityId:'demo-coordinacion-zaidin',moduleId:ZAIDIN_AGING_PROPOSAL.id,updatedAt:'2026-09-10T00:00:00Z',decisions:{},version:'coordinacion-zaidin-propuesta-v1'}));
  const {saveOriginalFile}=await import('/COMPAS_NG/src/infrastructure/document-files/originalFiles.ts');
  for(const id of ['atarfe','granada-zaidin'])await saveOriginalFile(id,'orphan-test',new File(['Prueba de conservación '+id],'prueba.txt',{type:'text/plain',lastModified:12345}));
 },seeds);
 const [download]=await Promise.all([source.waitForEvent('download'),source.getByRole('button',{name:'Descargar copia con originales'}).click()]);
 const path=join(dir,'copy.compas.json');await download.saveAs(path);const text=await readFile(path,'utf8');const backup=JSON.parse(text);
 assert.equal(backup.format,'compas-ng-browser-backup');assert.equal(backup.payload.storage.length,3);
 assert.ok(backup.payload.files.some(f=>f.name==='informe-salud-zaidin-abril-2023.pdf' && f.sha256==='c42dea2e4431f79f1accc19f95f9048b6d77273ae973d5424df5c6321fad06c1'));
 assert.ok(backup.payload.notices.some(n=>n.includes('original no conservado')));
 const target=await createPage();
 await target.getByLabel('Seleccionar copia de COMPÁS').setInputFiles(path);
 await target.getByText('Copia comprobada. Revisa su contenido antes de recuperar.').waitFor();
 await target.screenshot({path:'/tmp/compas-backup-review.png',fullPage:true});
 await target.getByRole('button',{name:'Recuperar sin sobrescribir'}).click();
 await target.getByText('Recuperación terminada.',{exact:false}).waitFor();
 const result=await target.evaluate(async()=>({storage:Object.fromEntries(Object.entries(localStorage)),files:(await (await import('/COMPAS_NG/src/infrastructure/document-files/originalFiles.ts')).listOriginalFiles()).map(e=>({municipalityId:e.municipalityId,documentId:e.documentId,name:e.file.name,size:e.file.size}))}));
 for(const entry of backup.payload.storage)assert.equal(result.storage[entry.key],entry.value,'Raw state must be preserved byte for byte');
 assert.equal(result.files.length,backup.payload.files.length);
 assert.deepEqual(await target.evaluate(async text=>{const {restoreBackup}=await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts');return (await restoreBackup(text)).conflicts;},text),[],'Restore is idempotent');
 const corrupt=JSON.parse(text);corrupt.payload.createdAt='alterado';
 assert.match(await target.evaluate(async text=>{try{await (await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts')).restoreBackup(text);return 'UNEXPECTED';}catch(e){return e.message;}},JSON.stringify(corrupt)),/huella|incompleta/);
 const fileCorrupt=JSON.parse(text);fileCorrupt.payload.files[0].base64='YQ==';
 assert.match(await target.evaluate(async b=>{const m=await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts');b.sha256=await m.digest(new TextEncoder().encode(JSON.stringify(b.payload)));try{await m.restoreBackup(JSON.stringify(b));return 'UNEXPECTED';}catch(e){return e.message;}},fileCorrupt),/Original alterado/);
 await target.evaluate(()=>localStorage.setItem('compas-ng:workspace:atarfe','version local que debe conservarse'));
 assert.match(await target.evaluate(async text=>{try{await (await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts')).restoreBackup(text);return 'UNEXPECTED';}catch(e){return e.message;}},text),/versiones diferentes/);
 assert.equal(await target.evaluate(()=>localStorage.getItem('compas-ng:workspace:atarfe')),'version local que debe conservarse');
 const quota=await createPage();
 const quotaResult=await quota.evaluate(async text=>{
  const m=await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts');const original=Storage.prototype.setItem;let n=0;Storage.prototype.setItem=function(...args){if(++n===2)throw new Error('quota-test');return original.apply(this,args);};
  try{await m.restoreBackup(text);return 'UNEXPECTED';}catch(e){return e.message;}finally{Storage.prototype.setItem=original;}
 },text);
 assert.match(quotaResult,/quota-test/);assert.equal(await quota.evaluate(()=>localStorage.length),0,'Storage writes must roll back on quota failure');
 await quota.evaluate(async text=>{await (await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts')).restoreBackup(text);},text);
 assert.equal(await quota.evaluate(()=>localStorage.length),3,'Recovery can be retried after quota failure');
 const malformed=JSON.parse(text);malformed.payload.storage[0].key='unrelated:setting';
 assert.match(await target.evaluate(async b=>{const m=await import('/COMPAS_NG/src/infrastructure/recovery/browserRecovery.ts');b.sha256=await m.digest(new TextEncoder().encode(JSON.stringify(b.payload)));try{await m.restoreBackup(JSON.stringify(b));return 'UNEXPECTED';}catch(e){return e.message;}},malformed),/clave/);
 console.log('PASS: empty recovery entry, UI export/import, 2 scopes, separate draft, original PDF hash, unreferenced originals, exact raw state, idempotence, envelope/file corruption, conflicts, foreign keys and quota rollback/retry.');
}finally{await browser?.close();await server.close();await rm(dir,{recursive:true,force:true});}
