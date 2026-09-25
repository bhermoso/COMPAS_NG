import {GoogleAuthProvider,browserPopupRedirectResolver,signInWithEmailAndPassword,signInWithPopup,signOut} from 'firebase/auth';
import type {RelasClient} from './RelasClient';

export async function loginRelasWithPassword(client:RelasClient,email:string,password:string){
 return signInWithEmailAndPassword(client.auth,email.trim(),password);
}

export async function loginRelasWithGoogle(client:RelasClient){
 const provider=new GoogleAuthProvider();
 provider.setCustomParameters({prompt:'select_account'});
 return signInWithPopup(client.auth,provider,browserPopupRedirectResolver);
}

export async function logoutRelas(client:RelasClient){
 return signOut(client.auth);
}
