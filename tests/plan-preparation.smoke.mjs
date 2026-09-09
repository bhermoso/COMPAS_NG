// Contexto de navegador aislado: todos los valores introducidos son de prueba.
// node tests/plan-preparation.smoke.mjs; opcional COMPAS_TEST_CHROMIUM y COMPAS_TEST_SCREENSHOT.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const server=await createServer({server:{host:'127.0.0.1',port:0}});await server.listen();let browser;
try{
 browser=await chromium.launch({...(process.env.COMPAS_TEST_CHROMIUM ? {executablePath:process.env.COMPAS_TEST_CHROMIUM} : {}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/COMPAS_NG/`);
 const plan=()=>page.locator('.app-nav__tab').filter({hasText:'Plan de Acción'}).click();
 const zaidin=async()=>{await page.getByRole('button',{name:/Cambiar ámbito/}).click();await page.locator('.municipality-selector__option').filter({hasText:'Zaidín'}).click();await page.waitForFunction(()=>!!localStorage.getItem('compas-ng:workspace:granada-zaidin'));};
 await plan();await zaidin();
 const panel=page.locator('.pcm-preparation').first();
 assert.equal(await panel.locator('.pcm-general').count(),4);
 assert.equal(await panel.locator('select').count(),41);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('compas-ng:workspace:granada-zaidin')));
 await panel.getByLabel('Selección de borrador ENV-OE5.1',{exact:true}).selectOption('included');
 const ind=panel.locator('.pcm-specific').first().locator('.pcm-sheet');await ind.locator(':scope > summary').click();
 await panel.getByLabel('Selección de borrador ENV-I5.1',{exact:true}).selectOption('modified');
 await panel.getByLabel('Nueva redacción · ENV-I5.1',{exact:true}).fill('INDICADOR SOLO DE PRUEBA');
 const sheet=ind.locator('.indicator-worksheet');await sheet.locator(':scope > summary').click();
 await sheet.locator('.planning-instruments > summary').click();
 await sheet.getByRole('button',{name:'Añadir como opción pendiente a la ficha · CENVE',exact:true}).click();
 assert.match(await sheet.locator('label').filter({has:page.locator('span').filter({hasText:/^Instrumento o registro, versión y procedimiento de recogida$/})}).locator('textarea').inputValue(),/CENVE/);
 await sheet.getByLabel('Persona y entidad responsables de consolidar el indicador',{exact:true}).fill('RESPONSABLE SOLO DE PRUEBA');
 await sheet.getByRole('button',{name:'Añadir actuación vinculada',exact:true}).click();
 await sheet.getByLabel('Nombre de la actuación o programa',{exact:true}).fill('ACTUACIÓN SOLO DE PRUEBA');
 await panel.getByLabel('Selección de borrador ENV-OE5.1',{exact:true}).selectOption('excluded');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('compas-ng:workspace:granada-zaidin')).planPreparationDrafts?.[0]?.decisions['ENV-OE5.1']?.status==='excluded');
 assert.ok(await panel.getByText('Fuera del borrador porque un elemento superior está excluido.',{exact:false}).count());
 await page.reload();await plan();await zaidin();
 assert.equal(await panel.getByLabel('Selección de borrador ENV-OE5.1',{exact:true}).inputValue(),'excluded');
 await panel.getByLabel('Selección de borrador ENV-OE5.1',{exact:true}).selectOption('included');
 await panel.locator('.pcm-specific').first().locator('.pcm-sheet > summary').click();
 assert.equal(await panel.getByLabel('Nueva redacción · ENV-I5.1',{exact:true}).inputValue(),'INDICADOR SOLO DE PRUEBA');
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('compas-ng:workspace:granada-zaidin')));
 assert.match(after.indicatorWorksheets[0].values.instrument,/CENVE/);
 assert.equal(after.indicatorWorksheets[0].actions[0].values.name,'ACTUACIÓN SOLO DE PRUEBA');
 assert.equal(after.indicatorWorksheets[0].values.owner,'RESPONSABLE SOLO DE PRUEBA');
 assert.deepEqual(after.evidenceStore,before.evidenceStore);assert.deepEqual(after.actionPlanModuleReviews,before.actionPlanModuleReviews);
 if(process.env.COMPAS_TEST_SCREENSHOT) await page.screenshot({path:process.env.COMPAS_TEST_SCREENSHOT});
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log('PASS: 4 bloques, 41 controles, editar/excluir/recargar/recuperar, ficha y actuación conservadas, evidencia y revisión formal intactas, sin errores JS ni desbordamiento móvil');
}finally{await browser?.close();await server.close();}
