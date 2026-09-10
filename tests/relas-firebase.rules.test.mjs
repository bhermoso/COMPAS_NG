import {readFileSync} from 'node:fs';
import {test, before, after, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {initializeTestEnvironment, assertFails, assertSucceeds} from '@firebase/rules-unit-testing';
import {doc, getDoc, setDoc, writeBatch, serverTimestamp, deleteDoc} from 'firebase/firestore';
let env;
const scope='granada-zaidin';
const path=`relas_scopes/${scope}/drafts/aging`;
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-compas-relas',firestore:{rules:readFileSync('firebase/firestore.rules','utf8')}});});
after(async()=>{await env?.cleanup();});
beforeEach(async()=>{
 await env.clearFirestore();
 await env.withSecurityRulesDisabled(async ctx=>{
  for(const [uid,s,role] of [['coord',scope,'coordinator'],['reader',scope,'reader'],['other','atarfe','coordinator']]) await setDoc(doc(ctx.firestore(),`relas_memberships/${uid}/scopes/${s}`),{active:true,role});
 });
});
const db=uid=>env.authenticatedContext(uid).firestore();
const row=(uid,version=1)=>({version,payload:{municipalityId:scope,moduleId:'aging',decisions:{}},updatedBy:uid,updatedAt:serverTimestamp()});
function save(uid,version=1,override={}){const d=db(uid);const batch=writeBatch(d);const data={...row(uid,version),...override};batch.set(doc(d,path),data);batch.set(doc(d,`${path}/history/${version}`),data);return batch.commit();}
test('coordinator saves with immutable history; next version accepted',async()=>{
 await assertSucceeds(save('coord'));await assertSucceeds(save('coord',2));
 assert.equal((await getDoc(doc(db('coord'),path))).data().version,2);
 await assertSucceeds(getDoc(doc(db('coord'),`${path}/history/1`)));
 await assertFails(deleteDoc(doc(db('coord'),`${path}/history/1`)));
});
test('anonymous, other scope and unassigned accounts cannot read or write',async()=>{
 await save('coord');
 for(const d of [env.unauthenticatedContext().firestore(),db('other'),db('unknown')]) await assertFails(getDoc(doc(d,path)));
 await assertFails(save('other',2));await assertFails(save('unknown',2));
});
test('reader reads but cannot edit or self-authorize',async()=>{
 await save('coord');await assertSucceeds(getDoc(doc(db('reader'),path)));
 await assertFails(save('reader',2));
 await assertFails(setDoc(doc(db('reader'),`relas_memberships/reader/scopes/${scope}`),{active:true,role:'administrator'}));
});
test('revoking membership blocks the same authenticated account',async()=>{
 await save('coord');await env.withSecurityRulesDisabled(ctx=>setDoc(doc(ctx.firestore(),`relas_memberships/coord/scopes/${scope}`),{active:false,role:'coordinator'}));
 await assertFails(getDoc(doc(db('coord'),path)));await assertFails(save('coord',2));
});
test('forged author, scope, version or timestamp rejected',async()=>{
 await assertFails(save('coord',1,{updatedBy:'other'}));
 await assertFails(save('coord',1,{payload:{municipalityId:'atarfe',moduleId:'aging',decisions:{}}}));
 await assertFails(save('coord',99));await assertFails(save('coord',1,{updatedAt:new Date(0)}));
});
test('missing history, stale version and deletion rejected',async()=>{
 await assertFails(setDoc(doc(db('coord'),path),row('coord')));
 await save('coord');await save('coord',2);
 await assertFails(save('coord',2));await assertFails(deleteDoc(doc(db('coord'),path)));
});
