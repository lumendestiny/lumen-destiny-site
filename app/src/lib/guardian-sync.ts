import { fetchAccountGuardians, SyncedGuardian } from './account-api';
import { getAccessToken } from './account-session';
import { listVaultGuardians, saveVaultGuardian, VaultGuardian } from './guardian-vault';

export type GuardianSyncSnapshot={signedIn:boolean;local:VaultGuardian[];remote:SyncedGuardian[];mergedIds:string[]};

export async function syncGuardianVault():Promise<GuardianSyncSnapshot>{
 const local=await listVaultGuardians();
 const token=await getAccessToken();
 if(!token)return{signedIn:false,local,remote:[],mergedIds:local.map(x=>x.id)};
 try{
  const remote=await fetchAccountGuardians(token);
  for(const g of remote){if(g?.id)await saveVaultGuardian(g.id,g.ownershipSource==='gift'||g.ownershipSource==='claim'?'gift':'issued')}
  const refreshed=await listVaultGuardians();
  return{signedIn:true,local:refreshed,remote,mergedIds:refreshed.map(x=>x.id)};
 }catch{
  return{signedIn:true,local,remote:[],mergedIds:local.map(x=>x.id)};
 }
}
