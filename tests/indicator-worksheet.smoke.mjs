// Isolated browser context: all entered content is test-only and never touches user data.
// Run: node tests/indicator-worksheet.smoke.mjs
// Optional: COMPAS_TEST_CHROMIUM=/path/to/chromium COMPAS_TEST_OUTPUT=/tmp/output
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";

const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
await server.listen();
const output = process.env.COMPAS_TEST_OUTPUT;
let browser;
try {
  browser = await chromium.launch({ headless: true,
    ...(process.env.COMPAS_TEST_CHROMIUM ? { executablePath: process.env.COMPAS_TEST_CHROMIUM } : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const address = server.httpServer.address();
  await page.goto(`http://127.0.0.1:${address.port}/COMPAS_NG/`);
  const plan = () => page.locator(".app-nav__tab").filter({ hasText: "Plan de Acción" }).click();
  const changeMunicipality = async (name, id) => {
    await page.getByRole("button", { name: /Cambiar ámbito/ }).click();
    await page.locator(".municipality-selector__option").filter({ hasText: name }).click();
    await page.waitForFunction((id) => {
      const raw = localStorage.getItem(`compas-ng:workspace:${id}`);
      return raw && JSON.parse(raw).repository.documents.length > 0;
    }, id);
  };
  const openSheet = async () => {
    const general = page.locator(".pcm-general").first();
    if (await general.getAttribute("open") === null) await general.locator(":scope > summary").click();
    const sheet = general.locator(".indicator-worksheet").first();
    if (await sheet.getAttribute("open") === null) await sheet.locator(":scope > summary").click();
    return sheet;
  };
  const snapshot = (id) => page.evaluate((id) => JSON.parse(localStorage.getItem(`compas-ng:workspace:${id}`)), id);
  await plan();
  await changeMunicipality("Zaidín", "granada-zaidin");
  assert.equal(await page.locator(".indicator-worksheet").count(), 30);
  const before = await snapshot("granada-zaidin");
  let sheet = await openSheet();
  const owner = "RESPONSABLE DE PRUEBA — no es un dato real";
  assert.equal(await sheet.getByLabel("Persona y entidad responsables de consolidar el indicador").inputValue(), "");
  await sheet.getByLabel("Persona y entidad responsables de consolidar el indicador").fill(owner);
  await sheet.getByRole("button", { name: "Añadir actuación vinculada", exact: true }).click();
  const action = sheet.locator(".indicator-worksheet__action").first();
  await action.getByLabel("Nombre de la actuación o programa", { exact: true }).fill("ACTUACIÓN SOLO DE PRUEBA");
  await action.getByRole("button", { name: "Añadir entrega de datos", exact: true }).click();
  await action.getByLabel("Periodo al que corresponden los datos").fill("PERIODO DE PRUEBA");
  await action.getByLabel("Numerador o recuento observado (si se dispone)").fill("0");
  await action.getByRole("button", { name: "Añadir entrega de datos", exact: true }).click();
  await sheet.getByRole("button", { name: "Añadir periodo de consolidación", exact: true }).click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("compas-ng:workspace:granada-zaidin")).indicatorWorksheets?.[0]?.consolidations.length === 1);
  const saved = await snapshot("granada-zaidin");
  assert.equal(saved.indicatorWorksheets[0].actions[0].returns.length, 2);
  assert.equal(saved.indicatorWorksheets[0].consolidations[0].status, "pending");
  assert.deepEqual(saved.indicatorWorksheets[0].consolidations[0].values, {});
  assert.deepEqual(saved.evidenceStore, before.evidenceStore);
  assert.deepEqual(saved.actionPlanModuleReviews, before.actionPlanModuleReviews);

  const downloaded = page.waitForEvent("download");
  await sheet.getByRole("button", { name: "Descargar ficha y actuaciones (Word)", exact: true }).click();
  const download = await downloaded;
  assert.match(download.suggestedFilename(), /granada-zaidin-ENV-I1\.1\.docx$/);
  assert.equal(await download.failure(), null);
  if (output) { await mkdir(output, { recursive: true }); await download.saveAs(`${output}/ficha-exportada-prueba.docx`); }

  await changeMunicipality("Atarfe", "atarfe");
  sheet = await openSheet();
  assert.equal(await sheet.getByLabel("Persona y entidad responsables de consolidar el indicador").inputValue(), "");
  await changeMunicipality("Zaidín", "granada-zaidin");
  await page.reload(); await plan();
  // Existing app starts in Atarfe after reload; reopen the saved municipality.
  await changeMunicipality("Zaidín", "granada-zaidin");
  sheet = await openSheet();
  assert.equal(await sheet.getByLabel("Persona y entidad responsables de consolidar el indicador").inputValue(), owner);
  assert.equal(await sheet.getByLabel("Numerador o recuento observado (si se dispone)").first().inputValue(), "0");
  assert.equal(await sheet.getByLabel("Numerador o recuento observado (si se dispone)").nth(1).inputValue(), "");
  page.once("dialog", (dialog) => dialog.dismiss());
  await sheet.getByRole("button", { name: "Eliminar actuación", exact: true }).click();
  assert.equal(await sheet.locator(".indicator-worksheet__action").count(), 1);
  if (output) await sheet.screenshot({ path: `${output}/ficha-pantalla-prueba.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await sheet.evaluate((element) => element.scrollWidth <= element.clientWidth + 1), true);
  assert.deepEqual(errors, []);
  console.log("PASS: 30 fichas; edición, actuaciones, entregas, Word, recarga, aislamiento municipal, cancelación de borrado y pantalla estrecha.");
} finally {
  await browser?.close();
  await server.close();
}
