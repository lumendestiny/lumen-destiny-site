(()=>{
  const userId=String(localStorage.getItem('lumen-auth-user-id')||'').trim();
  if(!userId)return;
  const map={
    'lumen-connection-profile-v1':`lumen-connection-profile-v2:${userId}`,
    'lumen-connection-network-web-v1':`lumen-connection-network-web-v2:${userId}`
  };
  const get=Storage.prototype.getItem,set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
  Storage.prototype.getItem=function(key){return get.call(this,map[key]||key)};
  Storage.prototype.setItem=function(key,value){return set.call(this,map[key]||key,value)};
  Storage.prototype.removeItem=function(key){return remove.call(this,map[key]||key)};
})();
