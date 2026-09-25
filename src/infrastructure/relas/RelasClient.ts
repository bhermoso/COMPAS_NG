import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, inMemoryPersistence, type Auth } from 'firebase/auth';
import { getFirestore, doc, collection, getDocs, getDocFromServer, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore';
import type { PlanPreparationDraft, PlanPreparationReview } from '../../domain/action-plan-catalog/PlanPreparationDraft';

// Public web configuration supplied by the project owner; this does not grant data access.
const config = {
 apiKey: 'AIzaSyDYNKa2o3mxaxYd426imxlhONkhUabsS3k',
 authDomain: 'compas-98dd7.firebaseapp.com',
 projectId: 'compas-98dd7',
 appId: '1:453759873152:web:110b0be2220ff59d91f665',
};
export interface RelasClient { auth: Auth; db: Firestore }
export interface RelasDraftRow { version: number; payload: PlanPreparationDraft }
export interface RelasReviewRow { version: number; payload: PlanPreparationReview }
let instance: RelasClient | undefined;
export function createRelasClient(): RelasClient {
 if (instance) return instance;
 const app = getApps().find(app => app.name === 'compas-relas') ?? initializeApp(config, 'compas-relas');
 instance = {auth: initializeAuth(app, {persistence: inMemoryPersistence}), db: getFirestore(app)};
 return instance;
}
export interface AccessProfile { administrator: boolean; scopes: {id:string;role:string}[] }
export async function readAccessProfile(client: RelasClient): Promise<AccessProfile> {
 const user = client.auth.currentUser;
 if (!user) throw new Error('Inicia sesión para acceder.');
 await user.reload();
 const owner = await getDocFromServer(doc(client.db, 'compas_admins', user.uid));
 if (owner.data()?.active === true) return {administrator:true,scopes:[]};
 const scopes = await getDocs(collection(client.db,'relas_memberships',user.uid,'scopes'));
 return {administrator:false, scopes:scopes.docs.filter(s=>s.data().active===true && ['reader','coordinator','administrator'].includes(s.data().role)).map(s=>({id:s.id,role:s.data().role}))};
}
export async function readMembership(client: RelasClient, scope: string) {
 const profile = await readAccessProfile(client);
 if (profile.administrator) return 'administrator';
 const access = profile.scopes.find(s=>s.id===scope);
 if (!access) throw new Error('La cuenta no tiene acceso activo a este ámbito.');
 return access.role;
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
export async function readRelasReview(client: RelasClient, scope: string, moduleId: string): Promise<RelasReviewRow | null> {
 const snapshot = await getDocFromServer(doc(client.db, 'relas_scopes', scope, 'reviews', moduleId));
 return snapshot.exists() ? snapshot.data() as RelasReviewRow : null;
}
export async function saveRelasReview(client: RelasClient, review: PlanPreparationReview, expectedVersion: number | null): Promise<RelasReviewRow> {
 const uid = client.auth.currentUser?.uid;
 if (!uid) throw new Error('Inicia sesión para consolidar.');
 const ref = doc(client.db, 'relas_scopes', review.municipalityId, 'reviews', review.moduleId);
 try {
  return await runTransaction(client.db, async tx => {
   const current = await tx.get(ref);
   if ((current.exists() ? current.data().version : null) !== expectedVersion) throw new Error('conflict');
   const version = (expectedVersion ?? 0) + 1;
   const row = {version, payload: JSON.parse(JSON.stringify(review)) as PlanPreparationReview, updatedBy: uid, updatedAt: serverTimestamp()};
   tx.set(ref, row);
   tx.set(doc(ref, 'history', String(version)), row);
   return {version, payload: row.payload};
  });
 } catch {
  throw new Error('No se ha consolidado: comprueba la conexión y que tu cuenta tenga administración general, o recupera la revisión actual.');
 }
}
