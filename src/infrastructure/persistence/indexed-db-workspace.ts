import type { MunicipalityWorkspace } from "../../domain/workspace";
import {
  parseWorkspaceJSON,
  serializeWorkspaceForStorage,
} from "./local-storage";

const DB_NAME = "compas-ng-workspaces";
const DB_VERSION = 1;
const STORE_NAME = "workspaces";

function indexedDbAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!indexedDbAvailable()) {
      reject(new Error("IndexedDB no disponible"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("No se pudo abrir el almacenamiento ampliado."));
  });
}

export async function saveWorkspaceToIndexedDB(
  workspace: MunicipalityWorkspace
): Promise<boolean> {
  let db: IDBDatabase;
  try {
    db = await database();
  } catch {
    return false;
  }

  try {
    const raw = serializeWorkspaceForStorage(workspace);
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx
        .objectStore(STORE_NAME)
        .put(raw, workspace.municipality.identity.id);
      tx.oncomplete = () => resolve();
      tx.onabort = () =>
        reject(new Error("No se pudo guardar el expediente completo."));
      tx.onerror = () =>
        reject(new Error("No se pudo guardar el expediente completo."));
    });
    return true;
  } catch {
    return false;
  } finally {
    db.close();
  }
}

export async function loadWorkspaceFromIndexedDB(
  municipalityId: string
): Promise<MunicipalityWorkspace | null> {
  let db: IDBDatabase;
  try {
    db = await database();
  } catch {
    return null;
  }

  try {
    const raw = await new Promise<unknown>((resolve, reject) => {
      const request = db
        .transaction(STORE_NAME)
        .objectStore(STORE_NAME)
        .get(municipalityId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(new Error("No se pudo recuperar el expediente completo."));
    });
    return typeof raw === "string" ? parseWorkspaceJSON(raw) : null;
  } catch {
    return null;
  } finally {
    db.close();
  }
}
