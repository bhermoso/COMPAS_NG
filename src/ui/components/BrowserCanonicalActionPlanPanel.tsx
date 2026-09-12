import {useEffect,useMemo,useState} from 'react';
import {readAccessProfile} from '../../infrastructure/relas/RelasClient';
import {createBrowserRelasClient} from '../../infrastructure/relas/BrowserRelasClient';
import TerritorialWorkspace from './TerritorialWorkspace';
import {LegacyActionPlanCatalogPanel,type LegacyActionPlanCatalogPanelProps} from './LegacyActionPlanCatalogPanel';

export function ActionPlanCatalogPanel(props:LegacyActionPlanCatalogPanelProps){
 const authenticatedEntry=new URLSearchParams(window.location.search).get('vista')==='app';
 const client=useMemo(()=>createBrowserRelasClient(),[]);
 const [administrator,setAdministrator]=useState<boolean|null>(authenticatedEntry?null:false);
 useEffect(()=>{
  if(!authenticatedEntry){setAdministrator(false);return;}
  let cancelled=false;
  readAccessProfile(client).then(profile=>{if(!cancelled)setAdministrator(profile.administrator);}).catch(()=>{if(!cancelled)setAdministrator(false);});
  return()=>{cancelled=true;};
 },[authenticatedEntry,client]);
 if(authenticatedEntry&&administrator===null)return <section className="workspace-panel"><p>Recuperando el Plan de Acción compartido…</p></section>;
 if(authenticatedEntry&&administrator)return <TerritorialWorkspace client={client} scope={props.municipalityId} role="administrator" onBack={()=>{}}/>;
 return <LegacyActionPlanCatalogPanel {...props}/>;
}
