import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=await createServer({plugins:[{name:'admin-preview',configureServer(s){s.middlewares.use('/admin-test',async(req,res)=>{res.setHeader('Content-Type','text/html');res.end(await s.transformIndexHtml('/admin-test',`<html><body><div id="root"></div><script type="module">import React from 'react';import {createRoot} from 'react-dom/client';import Panel from '/src/ui/components/AdministrationPanel.tsx';import '/src/index.css';import '/src/ui/components/BackupPanel.css';import '/src/ui/components/RelasAccess.css';createRoot(document.getElementById('root')).render(React.createElement('main',{className:'backup-recovery relas-access'},React.createElement('section',{className:'backup-panel'},React.createElement(Panel,{onOpenApp:()=>document.title='full-app',onOpenScope:s=>document.title=s}))));</script></body></html>`));});}}],server:{host:'127.0.0.1',port:0}});
await server.listen();let browser;
try {
 browser=await chromium.launch({executablePath:process.env.COMPAS_TEST_CHROMIUM||'/tmp/compas-chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/admin-test`);
 await page.getByRole('button',{name:'Abrir COMPAS completo'}).click();assert.equal(await page.title(),'full-app');
 await page.getByLabel('Ámbito compartido').fill('atarfe');await page.getByRole('button',{name:'Abrir ámbito',exact:true}).click();assert.equal(await page.title(),'atarfe');
 assert.match(await page.getByRole('link',{name:'Gestionar cuentas en Firebase'}).getAttribute('href'),/compas-98dd7\/authentication\/users/);
 assert.equal(await page.getByRole('button',{name:/generar clave|suscri|pagar/i}).count(),0);
 await page.screenshot({path:'/tmp/compas-admin-panel.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS: general administration navigation and explicit console links; no simulated account generator.');
}finally{await browser?.close();await server.close();}
