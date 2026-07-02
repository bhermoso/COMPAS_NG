import { createReadStream, createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createInterface } from "node:readline";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const source = resolve(process.argv[2] ?? resolve(scriptDir, "..", "EAS_COMPLETO.csv"));
const output = resolve(
  process.argv[3] ?? resolve(scriptDir, "..", "fixtures", "ibse-granada-provincia.csv")
);

const GRANADA_PROVINCE = "18.0";
const EAS_WAVE = "2023.0";

const ITEM_COLUMNS = [
  "P57B1_2023",
  "P57B2_2023",
  "P57B3_2023",
  "P57B4_2023",
  "P57B5_2023",
  "P57B6_2023",
  "P57C1_2023",
  "P57C2_2023",
];

const OUTPUT_COLUMNS = [
  "ibse_factor_vinculo",
  "ibse_factor_situacion",
  "ibse_factor_control",
  "ibse_factor_persona",
  "ibse_total",
  "monitor_ibse_complete",
];

function clean(raw) {
  return (raw ?? "").trim().replace(/^"|"$/g, "");
}

function validInteger(raw, min, max) {
  const value = Number(clean(raw));
  return Number.isInteger(value) && value >= min && value <= max ? value : null;
}

function calculateIBSE(values) {
  const [deprimido, feliz, solo, disfrutar, energia, tranquilo, optimista, bienMismo] = values;

  const vinculo = (((5 - deprimido) + (5 - solo)) / 2 - 1) * 25;
  const situacion = (((feliz + 1) + (disfrutar + 1)) / 2 - 1) * 25;
  const control = (((energia + 1) + (tranquilo + 1)) / 2 - 1) * 25;
  const persona = (((6 - optimista) + (6 - bienMismo)) / 2 - 1) * 25;
  const total = (vinculo + situacion + control + persona) / 4;

  return { vinculo, situacion, control, persona, total };
}

await mkdir(dirname(output), { recursive: true });

const lines = createInterface({
  input: createReadStream(source),
  crlfDelay: Infinity,
});
const writer = createWriteStream(output, { encoding: "utf8" });

let headerProcessed = false;
let provinceIndex = -1;
let waveIndex = -1;
let officialIndex = -1;
let itemIndexes = [];
let exported = 0;
let valid = 0;
let officialValid = 0;
let sumTotal = 0;
let sumVinculo = 0;
let sumSituacion = 0;
let sumControl = 0;
let sumPersona = 0;
let sumOfficial = 0;

writer.write(`${OUTPUT_COLUMNS.join(",")}\n`);

for await (const line of lines) {
  if (!headerProcessed) {
    const header = line
      .split(",")
      .map((value) => clean(value).replace(/^\uFEFF/, ""));

    provinceIndex = header.indexOf("PROV");
    waveIndex = header.indexOf("anioencuesta");
    officialIndex = header.indexOf("IBSE_100");
    itemIndexes = ITEM_COLUMNS.map((column) => header.indexOf(column));

    const missing = ITEM_COLUMNS.filter((_, index) => itemIndexes[index] === -1);
    if (provinceIndex === -1 || waveIndex === -1 || missing.length > 0) {
      throw new Error(`EAS source missing required columns: ${missing.join(", ") || "PROV/anioencuesta"}`);
    }

    headerProcessed = true;
    continue;
  }

  const fields = line.split(",");
  if (clean(fields[provinceIndex]) !== GRANADA_PROVINCE) continue;
  if (clean(fields[waveIndex]) !== EAS_WAVE) continue;

  exported++;
  const values = itemIndexes.map((index, itemIndex) =>
    validInteger(fields[index], 1, itemIndex < 6 ? 4 : 5)
  );

  if (values.some((value) => value === null)) {
    writer.write(",,,,,0\n");
    continue;
  }

  const scores = calculateIBSE(values);
  writer.write(
    [
      scores.vinculo,
      scores.situacion,
      scores.control,
      scores.persona,
      scores.total,
      2,
    ].join(",") + "\n"
  );

  valid++;
  sumVinculo += scores.vinculo;
  sumSituacion += scores.situacion;
  sumControl += scores.control;
  sumPersona += scores.persona;
  sumTotal += scores.total;

  const official = Number(clean(fields[officialIndex]));
  if (Number.isFinite(official)) {
    officialValid++;
    sumOfficial += official;
  }
}

await new Promise((resolveEnd, rejectEnd) => {
  writer.on("error", rejectEnd);
  writer.end(resolveEnd);
});

const mean = (sum) => (valid > 0 ? sum / valid : 0);

console.log("IBSE Granada provincial fixture generated");
console.log(`source=${source}`);
console.log(`output=${output}`);
console.log(`filter=PROV=${GRANADA_PROVINCE};anioencuesta=${EAS_WAVE}`);
console.log(`records=${exported}`);
console.log(`valid=${valid}`);
console.log(`incomplete=${exported - valid}`);
console.log(`meanTotal=${mean(sumTotal).toFixed(6)}`);
console.log(`meanFactorVinculo=${mean(sumVinculo).toFixed(6)}`);
console.log(`meanFactorSituacion=${mean(sumSituacion).toFixed(6)}`);
console.log(`meanFactorControl=${mean(sumControl).toFixed(6)}`);
console.log(`meanFactorPersona=${mean(sumPersona).toFixed(6)}`);
console.log(
  `officialIBSE100Mean=${officialValid > 0 ? (sumOfficial / officialValid).toFixed(6) : "n/a"}`
);
console.log(
  "caution=IBSE_100 uses a different EAS transformation and is not copied into ibse_total"
);
