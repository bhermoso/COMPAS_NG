import { beforeEach, describe, expect, it } from "vitest";
import {
  ACTIVE_MUNICIPALITY_STORAGE_KEY,
  readActiveMunicipalityId,
  saveActiveMunicipalityId,
} from "../src/appWorkspaceHydration";

const store = new Map<string, string>();

(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
  clear: () => {
    store.clear();
  },
  key: (index: number) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
};

const municipalities = [
  { id: "atarfe" },
  { id: "granada-zaidin" },
];

beforeEach(() => {
  store.clear();
});

describe("ámbito activo del expediente", () => {
  it("restaura el último ámbito elegido y no vuelve siempre a Atarfe", () => {
    expect(readActiveMunicipalityId(municipalities, "granada-zaidin")).toBe(
      "granada-zaidin"
    );

    expect(saveActiveMunicipalityId("granada-zaidin")).toBe(true);
    expect(store.get(ACTIVE_MUNICIPALITY_STORAGE_KEY)).toBe("granada-zaidin");
    expect(readActiveMunicipalityId(municipalities, "atarfe")).toBe(
      "granada-zaidin"
    );

    store.set(ACTIVE_MUNICIPALITY_STORAGE_KEY, "ambito-inexistente");
    expect(readActiveMunicipalityId(municipalities, "granada-zaidin")).toBe(
      "granada-zaidin"
    );
  });
});
