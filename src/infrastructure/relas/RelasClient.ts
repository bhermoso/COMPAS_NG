import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, inMemoryPersistence, type Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore';
import type { PlanPreparationDraft } from '../../domain/action-plan-catalog/PlanPreparationDraft';

// Public web configuration supplied by the project owner; this does not grant data access.
const config = {
 apiKey: 'AIzaSyDYNKa2o3mxaxYd426imxlhONkhUabsS3k',
 authDomain: 'compas-98dd7.firebaseapp.com',
 projectId: 'compas-98dd7',
 appId: '1:453759873152:web:110b0be2220ff59d91f665',
};
export interface RelasClient { auth: Auth; db: Firestore }
export interface RelasDraftRow { version: number; payload: PlanPreparationDraft }
let instance: RelasClient | undefined;
export function createRelasClient(): RelasClient {
 if (instance) return instance;
 const app = getApps().find(app => app.name === 'compas-relas') ?? initializeApp(config, 'compas-relas');
 instance = {auth: initializeAuth(app, {persistence: inMemoryPersistence}), db: getFirestore(app)};
 return instance;
}
export async function readMembership(client: RelasClient, scope: string) {
 const user = client.auth.currentUser;
 if (!user) throw new Error('No se ha podido comprobar la sesión.');
 await user.reload();
 const snapshot = await getDocFromServer(doc(client.db, 'relas_memberships', user.uid, 'scopes', scope));
 const membership = snapshot.data();
 if (!membership?.active || !['reader','coordinator','administrator'].includes(membership.role)) throw new Error('La cuenta no tiene acceso activo a RELAS Zaidín.');
 return membership.role as string;
}
export async function readRelasDraft(client: RelasClient, scope: string, moduleId: string): Promise<RelasDraftRow | null> {
 const snapshot = await getDocFromServer(doc(client.db, 'relas_scopes', scope, 'drafts', moduleId));
 return snapshot.exists() ? snapshot.data() as RelasDraftRow : null;
}
export async function saveRelasDraft(client: RelasClient, draft: PlanPreparationDraft, expectedVersion: number | null): Promise<RelasDraftRow> {
 const uid = client.auth.currentUser?.uid;
 if (!uid) throw new Error('Inicia sesión para guardar.');
 const ref = doc(client.db, 'relas_scopes', draft.municipalityId, 'drafts', draft.moduleId);
 try {
  return await runTransaction(client.db, async tx => {
   const current = await tx.get(ref);
   if ((current.exists() ? current.data().version : null) !== expectedVersion) throw new Error('conflict');
   const version = (expectedVersion ?? 0) + 1;
   const row = {version, payload: JSON.parse(JSON.stringify(draft)) as PlanPreparationDraft, updatedBy: uid, updatedAt: serverTimestamp()};
   tx.set(ref, row);
   tx.set(doc(ref, 'history', String(version)), row);
   return {version, payload: row.payload};
  });
 } catch {
  throw new Error('No se ha guardado: comprueba la conexión y tus permisos o recupera la versión actual del servidor. Tus cambios en pantalla se conservan.');
 }
}
