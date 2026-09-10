import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const server=await createServer({server:{host:'127.0.0.1',port:0}});await server.listen();let browser;
try{
 browser=await chromium.launch({executablePath:process.env.COMPAS_TEST_CHROMIUM,headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/COMPAS_NG/');
 await page.evaluate(async()=>{
  const React=(await import('/COMPAS_NG/node_modules/.vite/deps/react.js')).default;
  const client=(await import('/COMPAS_NG/node_modules/.vite/deps/react-dom_client.js')).default;
  const {DocumentationProvider,DocumentReference}=await import('/COMPAS_NG/src/ui/components/Documentation.tsx');
  const {HealthReportViewer}=await import('/COMPAS_NG/src/ui/components/HealthReportViewer.tsx');
  const {DocumentRepositoryPanel}=await import('/COMPAS_NG/src/ui/components/DocumentRepositoryPanel.tsx');
  const seed=await(await fetch('/COMPAS_NG/seeds/compas-ng-workspace-granada-zaidin.json')).json();
  const root=document.createElement('div');root.id='report-check';document.body.append(root);
  client.createRoot(root).render(React.createElement(DocumentationProvider,{workspace:seed},
   React.createElement(DocumentReference,{fileName:"Informe Zaidin Sur.docx"},"Referencia UGC"),
   React.createElement(DocumentReference,{documentId:"missing"},"Referencia ausente"),
   React.createElement(HealthReportViewer,{healthReport:seed.healthReport,repository:seed.repository}),
   React.createElement(DocumentRepositoryPanel,{repository:seed.repository})));
 });
 const root=page.locator('#report-check');await root.locator('.fde-source-toggle').click();
 const link=root.locator('.hr-viewer__source-access').getByRole('link',{name:/Abrir documento/});
 await link.waitFor();
 const response=await page.request.get(new URL(await link.getAttribute('href'),page.url()).href);assert.equal(response.status(),200);
 const digest=b=>createHash('sha256').update(b).digest('hex');
 assert.equal(digest(await response.body()),digest(readFileSync('docs/source-material/health-reports/informe-salud-zaidin-abril-2023.pdf')));
 for(const title of ['Informe Zaidin Centro Este','Informe Zaidin Sur']){
  const row=root.locator('.document-row').filter({has:page.getByRole('heading',{name:title,exact:true})}).last();
  await row.getByText('Consultar texto conservado',{exact:true}).click();
  assert.match(await row.innerText(),/VIGILANCIA INTEGRAL DE LA SALUD/);
 }
 await root.getByRole('button',{name:'Referencia UGC',exact:true}).click();
 const dialog=root.getByRole('dialog');await dialog.getByText('Consultar texto conservado',{exact:true}).click();
 assert.match(await dialog.innerText(),/VIGILANCIA INTEGRAL DE LA SALUD/);
 assert.match(await dialog.innerText(),/Archivo original no disponible/);
 await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);
 await root.getByRole('button',{name:'Referencia ausente',exact:true}).click();
 await dialog.getByText(/No se ha localizado/).waitFor();
 await dialog.getByRole('searchbox').fill('EPVSA');
 await dialog.getByRole('button',{name:/EPVSA/}).click();
 const framework=dialog.getByRole('link',{name:/Abrir documento/});
 assert.equal((await page.request.get(new URL(await framework.getAttribute('href'),page.url()).href)).status(),200);
 await dialog.getByRole('button',{name:'Cerrar',exact:true}).click();
 console.log('PASS: references, missing document, catalogue search, original PDF and retained UGC texts');
}finally{await browser?.close();await server.close();}
