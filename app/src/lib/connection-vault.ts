import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NetworkMember } from './connection-network';

const KEY='lumen-link-network-v1';

export async function loadConnectionNetwork():Promise<NetworkMember[]>{
 try{const raw=await AsyncStorage.getItem(KEY);if(!raw)return[];const parsed=JSON.parse(raw);return Array.isArray(parsed)?parsed:[];}catch{return[];}
}

export async function saveConnectionNetwork(members:NetworkMember[]){
 await AsyncStorage.setItem(KEY,JSON.stringify(members));
}

export async function addConnectionMember(member:NetworkMember){
 const current=await loadConnectionNetwork();
 const next=[member,...current.filter(x=>x.id!==member.id)].slice(0,50);
 await saveConnectionNetwork(next);
 return next;
}

export async function removeConnectionMember(id:string){
 const current=await loadConnectionNetwork();
 const next=current.filter(x=>x.id!==id);
 await saveConnectionNetwork(next);
 return next;
}

export async function clearConnectionNetwork(){await AsyncStorage.removeItem(KEY);}
