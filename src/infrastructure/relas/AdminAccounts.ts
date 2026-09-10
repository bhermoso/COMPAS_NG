import {deleteApp, initializeApp} from 'firebase/app';
import {connectAuthEmulator, createUserWithEmailAndPassword, initializeAuth, inMemoryPersistence, signOut} from 'firebase/auth';
import {collection, doc, getDocs, runTransaction, serverTimestamp, writeBatch} from 'firebase/firestore';
import {readAccessProfile, type RelasClient} from './RelasClient';

export interface ManagedAccount {uid:string;email:string;scope:string;role:'coordinator'|'reader';active:boolean}
export interface NewAccount {uid:string;email:string;password:string}
export interface TerritorialSpace {id:string;name:string;type:'municipio'|'mancomunidad'|'distrito-municipal'}

async function requireAdministrator(client:RelasClient) {
 if (!(await readAccessProfile(client)).administrator) throw new Error('Esta operación requiere administración general.');
}

export async function listTerritorialSpaces(client:RelasClient):Promise<TerritorialSpace[]> {
 await requireAdministrator(client);
 const rows=await getDocs(collection(client.db,'relas_scopes'));
 return rows.docs.map(d=>({id:d.id,name:d.data().name,type:d.data().type}) as TerritorialSpace).sort((a,b)=>a.name.localeCompare(b.name,'es'));
}

export async function createTerritorialSpace(client:RelasClient,space:TerritorialSpace) {
 await requireAdministrator(client);
 if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(space.id)||!space.name.trim()) throw new Error('Indica el nombre y un identificador válido para el ámbito.');
 const ref=doc(client.db,'relas_scopes',space.id);
 await runTransaction(client.db,async tx=>{
  if((await tx.get(ref)).exists()) throw new Error('Ya existe un espacio con ese identificador. No se ha modificado.');
  tx.set(ref,{name:space.name.trim(),type:space.type,createdBy:client.auth.currentUser!.uid,createdAt:serverTimestamp()});
 });
}

export async function listManagedAccounts(client:RelasClient):Promise<ManagedAccount[]> {
 await requireAdministrator(client);
 const snapshot=await getDocs(collection(client.db,'compas_access_accounts'));
 return snapshot.docs.map(d=>({uid:d.id,...d.data()}) as ManagedAccount).filter(a=>typeof a.email==='string'&&typeof a.scope==='string');
}

export async function createTerritorialAccount(client:RelasClient,email:string):Promise<NewAccount> {
 await requireAdministrator(client);
 // A separate, memory-only Auth instance keeps the administrator's session intact.
 const app=initializeApp(client.auth.app.options,`compas-alta-${crypto.randomUUID()}`);
 const auth=initializeAuth(app,{persistence:inMemoryPersistence});
 const emulator=client.auth.emulatorConfig;
 if(emulator) connectAuthEmulator(auth,`${emulator.protocol}://${emulator.host}:${emulator.port}`,{disableWarnings:true});
 const password='Aa7!'+Array.from(crypto.getRandomValues(new Uint8Array(18)),b=>b.toString(16).padStart(2,'0')).join('');
 try {
  const result=await createUserWithEmailAndPassword(auth,email.trim(),password);
  return {uid:result.user.uid,email:result.user.email??email.trim(),password};
 } finally {
  await signOut(auth).catch(()=>{});
  await deleteApp(app);
 }
}

export async function saveManagedAccess(client:RelasClient,account:ManagedAccount) {
 await requireAdministrator(client);
 if(account.uid===client.auth.currentUser?.uid) throw new Error('Tu administración general no se modifica desde los accesos territoriales.');
 const {uid,...data}=account;
 const batch=writeBatch(client.db);
 batch.set(doc(client.db,'compas_access_accounts',uid),data);
 batch.set(doc(client.db,'relas_memberships',uid,'scopes',account.scope),{active:account.active,role:account.role});
 await batch.commit();
}

export function accessError(error:unknown):string {
 const code=(error as {code?:string}).code;
 if(code==='permission-denied') return 'Firebase ha denegado el cambio. Publica las reglas de gestión de accesos del panel y vuelve a intentarlo. No se ha confirmado ningún permiso nuevo.';
 if(code==='auth/email-already-in-use') return 'Ese correo ya tiene una cuenta. No se ha cambiado su contraseña ni sus permisos. Puedes revisar esa cuenta en Firebase.';
 if(code==='auth/invalid-email') return 'Revisa el correo electrónico.';
 if(code==='auth/too-many-requests') return 'Firebase ha limitado temporalmente las altas. Vuelve a intentarlo más tarde.';
 return error instanceof Error?error.message:'No se ha podido completar la operación. Comprueba la conexión y vuelve a intentarlo.';
}
