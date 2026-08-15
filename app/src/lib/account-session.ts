import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY='lumen.account.access-token.v1';

export async function getAccessToken(){
 try{return await SecureStore.getItemAsync(TOKEN_KEY)}catch{return null}
}

export async function setAccessToken(token:string){
 const clean=token.trim();if(!clean)throw new Error('empty_access_token');
 await SecureStore.setItemAsync(TOKEN_KEY,clean,{keychainAccessible:SecureStore.AFTER_FIRST_UNLOCK});
}

export async function clearAccessToken(){
 try{await SecureStore.deleteItemAsync(TOKEN_KEY)}catch{}
}

export async function hasAccessToken(){return !!(await getAccessToken())}
