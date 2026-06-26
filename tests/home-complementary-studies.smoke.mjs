import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HOST = "127.0.0.1";
const PORT = "5173";
const APP_URL = `http://${HOST}:${PORT}/COMPAS_NG/`;
const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const VITE_BIN = fileURLToPath(
  new URL("../node_modules/vite/bin/vite.js", import.meta.url)
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function serverResponds() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const response = await fetch(APP_URL, { signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(processRef) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 20000) {
    if (processRef?.exitCode !== null && processRef?.exitCode !== undefined) {
      throw new Error(`Vite dev server exited early with code ${processRef.exitCode}.`);
    }
    if (await serverResponds()) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${APP_URL}.`);
}

function startDevServer() {
  return spawn(
    process.execPath,
    [VITE_BIN, "--host", HOST, "--port", PORT, "--strictPort"],
    {
      cwd: REPO_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    }
  );
}

async function openInstrument(page, name, inputSelector) {
  const toggle = page.locator("button.ec-instrument__toggle").filter({ hasText: name });
  const count = await toggle.count();
  assert(count === 1, `Expected one accordion toggle for ${name}, found ${count}.`);
  await toggle.click();

  const input = page.locator(inputSelector);
  const inputCount = await input.count();
  assert(inputCount === 1, `Expected input ${inputSelector} for ${name}, found ${inputCount}.`);
  assert(await input.isVisible(), `Expected input ${inputSelector} for ${name} to be visible.`);
}

let serverProcess = null;
let browser = null;

try {
  if (!(await serverResponds())) {
    serverProcess = startDevServer();
    await waitForServer(serverProcess);
  }

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto(APP_URL, { waitUntil: "domcontentloaded" });

  const homeText = await page.locator("body").textContent();
  const normalizedHomeText =
    homeText?.normalize("NFD").replace(/\p{Diacritic}/gu, "") ?? "";
  assert(normalizedHomeText.includes("COMPAS NG"), "Home does not show COMPAS NG.");

  const scopeButton = page.locator("button").filter({ hasText: "Cambiar ámbito" });
  assert(await scopeButton.count() === 1, "Scope selector button 'Cambiar ámbito' not found.");

  const repositoryButton = page.getByRole("button", { name: "2 Repositorio documental" });
  assert(await repositoryButton.count() === 1, "Repository navigation button not found.");
  await repositoryButton.click();

  const repositoryText = await page.locator("body").textContent();
  for (const label of ["IBSE", "DUKE-EAS", "PREDIMED-EAS"]) {
    assert(repositoryText?.includes(label), `Complementary Studies panel does not show ${label}.`);
  }

  await openInstrument(page, "IBSE", "#ibse-csv-input");
  await openInstrument(page, "DUKE-EAS", "#duke-csv-input");
  await openInstrument(page, "PREDIMED-EAS", "#predimed-csv-input");

  assert(
    consoleErrors.length === 0,
    `Console errors detected:\n${consoleErrors.join("\n")}`
  );

  await context.close();
  console.log("Smoke test PASS: Home and Estudios Complementarios loaded without console errors.");
} finally {
  if (browser !== null) {
    await browser.close();
  }
  if (serverProcess !== null && serverProcess.exitCode === null) {
    serverProcess.kill();
  }
}
