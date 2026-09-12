import {getApps,initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {createRelasClient,type RelasClient} from './RelasClient';

let browserClient:RelasClient|undefined;

export function createBrowserRelasClient():RelasClient{
 if(browserClient)return browserClient;
 const base=createRelasClient();
 const app=getApps().find(item=>item.name==='compas-relas-browser')
  ??initializeApp(base.auth.app.options,'compas-relas-browser');
 browserClient={auth:getAuth(app),db:getFirestore(app)};
 return browserClient;
}
