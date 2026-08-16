import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LinkInvite } from './lumen-link-api';

const KEY='lumen.link.pending.invites.v1';

export type PendingInvite=LinkInvite&{createdAt:string;label?:string};

export async function loadPendingInvites():Promise<PendingInvite[]>{
 try{const raw=await AsyncStorage.getItem(KEY);if(!raw)return[];const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed:[]}catch{return[]}
}

export async function savePendingInvite(invite:LinkInvite,label?:string){
 const list=await loadPendingInvites();
 const next=[{...invite,label,createdAt:new Date().toISOString()},...list.filter(x=>x.id!==invite.id)].slice(0,20);
 await AsyncStorage.setItem(KEY,JSON.stringify(next));
 return next;
}

export async function removePendingInvite(id:string){
 const next=(await loadPendingInvites()).filter(x=>x.id!==id);
 await AsyncStorage.setItem(KEY,JSON.stringify(next));
 return next;
}

export async function pruneExpiredInvites(){
 const now=Date.now();
 const next=(await loadPendingInvites()).filter(x=>Date.parse(x.expiresAt)>now);
 await AsyncStorage.setItem(KEY,JSON.stringify(next));
 return next;
}
