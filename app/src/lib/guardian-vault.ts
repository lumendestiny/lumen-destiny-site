import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY='lumen.my-guardian.v1';
export type VaultGuardian={id:string;addedAt:string;source:'issued'|'gift'|'manual'};

async function readRaw():Promise<VaultGuardian[]>{
 try{const raw=await AsyncStorage.getItem(KEY);const list=raw?JSON.parse(raw):[];return Array.isArray(list)?list.filter(x=>x&&typeof x.id==='string'):[]}catch{return[]}
}
export async function listVaultGuardians(){return readRaw()}
export async function saveVaultGuardian(id:string,source:VaultGuardian['source']='issued'){
 const clean=id.trim().toUpperCase();if(!/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(clean))throw new Error('invalid_guardian_id');
 const list=await readRaw(),existing=list.find(x=>x.id===clean),next=[{id:clean,addedAt:existing?.addedAt||new Date().toISOString(),source:existing?.source||source},...list.filter(x=>x.id!==clean)].slice(0,100);
 await AsyncStorage.setItem(KEY,JSON.stringify(next));return next[0];
}
export async function removeVaultGuardian(id:string){const clean=id.trim().toUpperCase();const list=(await readRaw()).filter(x=>x.id!==clean);await AsyncStorage.setItem(KEY,JSON.stringify(list));return list}
