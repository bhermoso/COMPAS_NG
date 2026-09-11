import {sendPasswordResetEmail} from 'firebase/auth';
import {readAccessProfile, type RelasClient} from './RelasClient';

export async function requestManagedPasswordReset(client:RelasClient,email:string) {
 const profile=await readAccessProfile(client);
 if(!profile.administrator) throw new Error('Esta operación requiere administración general.');
 client.auth.languageCode='es';
 await sendPasswordResetEmail(client.auth,email.trim());
}
