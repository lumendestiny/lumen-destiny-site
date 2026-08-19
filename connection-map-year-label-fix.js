(()=>{
'use strict';
const normalize=v=>{v=String(v||'').toLowerCase();if(v.startsWith('ko'))return'ko';if(v.startsWith('zh'))return'zh';if(v.startsWith('ja'))return'ja';if(v.startsWith('vi'))return'vi';if(v.startsWith('tl')||v.startsWith('fil'))return'tl';if(v.startsWith('en'))return'en';return'ko'};
const lang=normalize(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');
if(lang!=='ko')return;
const fix=()=>{
  ['meYear','otherYear'].forEach(id=>{
    const select=document.getElementById(id);
    if(!select)return;
    [...select.options].forEach(option=>{
      const next=option.value?`${option.value}년`:'연도';
      if(option.textContent!==next)option.textContent=next;
    });
  });
};
const PROFILE_KEY='lumen-connection-profile-v1';
const ELEMENTS=['목','화','토','금','수'];
const readProfile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch{return null}};
const weakest=elements=>{if(!elements)return[];const values=ELEMENTS.map(k=>Number(elements[k]||0)),min=Math.min(...values);return ELEMENTS.filter(k=>Number(elements[k]||0)===min)};
function injectInviteStyles(){
  if(document.getElementById('lumenInviteStyle'))return;
  const style=document.createElement('style');style.id='lumenInviteStyle';style.textContent=`
  .connection-invite-card{margin:18px auto;padding:20px;border:1px solid #e5e6eb;border-radius:16px;background:#fff;box-shadow:0 5px 16px rgba(28,32,45,.035)}
  .connection-invite-card .invite-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}.connection-invite-card h2{margin:3px 0 6px;font-size:1.14rem;color:#242936}.connection-invite-card p{margin:0;color:#6d7280;line-height:1.6;font-size:.9rem}.connection-invite-card .invite-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.connection-invite-card button{min-height:50px;border:0;border-radius:10px;font:inherit;font-weight:800;cursor:pointer}.connection-invite-card .invite-primary{background:#1d2f5f;color:#fff}.connection-invite-card .invite-secondary{background:#f0eee6;color:#252a36}.connection-invite-card .invite-link-box{margin-top:12px;padding:12px;border-radius:10px;background:#f7f7f9;word-break:break-all;font-size:.84rem;color:#555b69}.connection-invite-card .invite-status{margin-top:10px;font-size:.84rem;color:#596071}.connection-invite-card .invite-note{margin-top:10px;font-size:.78rem;color:#858b98}@media(max-width:720px){.connection-invite-card{margin:14px 0;padding:16px}.connection-invite-card .invite-actions{grid-template-columns:1fr}.connection-invite-card button{min-height:54px;font-size:16px}}
  `;document.head.appendChild(style);
}
function injectInviteCard(){
  if(document.getElementById('connectionInviteCard'))return;
  const grid=document.querySelector('.connection-grid');if(!grid)return;
  const card=document.createElement('section');card.id='connectionInviteCard';card.className='connection-card connection-invite-card';card.innerHTML=`<div class="invite-head"><div><p class="section-label">INVITE TO MY CONNECTION MAP</p><h2>상대방을 초대해서 인연 연결하기</h2><p>내가 상대방의 생년월일을 직접 입력하지 않아도 됩니다. 초대 링크를 보내면 상대방이 자신의 정보를 직접 입력하고, 계산된 오행 결과만 연결에 사용됩니다.</p></div></div><div class="invite-actions"><button id="createConnectionInvite" class="invite-primary" type="button">상대방 초대 링크 만들기</button><button id="copyConnectionInvite" class="invite-secondary" type="button" hidden>초대 링크 복사</button></div><div id="connectionInviteLink" class="invite-link-box" hidden></div><p id="connectionInviteStatus" class="invite-status" role="status"></p><p class="invite-note">초대 링크는 7일간 사용할 수 있으며 한 번 연결되면 닫힙니다. 생년월일·출생시간 원본은 인연지도에 저장하지 않습니다.</p>`;
  grid.insertAdjacentElement('afterend',card);
  let currentUrl='';
  const createBtn=card.querySelector('#createConnectionInvite'),copyBtn=card.querySelector('#copyConnectionInvite'),linkBox=card.querySelector('#connectionInviteLink'),status=card.querySelector('#connectionInviteStatus');
  async function copy(text){try{await navigator.clipboard.writeText(text);status.textContent='초대 링크를 복사했습니다.';return true}catch{return false}}
  async function share(url,inviter){const shareData={title:'루멘 명운 인연지도 초대',text:`${inviter}님이 루멘 명운 인연지도에 초대했습니다.`,url};if(navigator.share){try{await navigator.share(shareData);status.textContent='초대 링크 공유 화면을 열었습니다.';return}catch(e){if(e?.name==='AbortError')return}}if(await copy(url))return;status.textContent='아래 링크를 길게 눌러 복사해 주세요.'}
  createBtn.addEventListener('click',async()=>{
    const profile=readProfile();
    if(!profile?.name||!profile?.elements){status.textContent='먼저 위에서 “나의 오행 기준 계산”을 완료해 주세요.';document.getElementById('saveProfile')?.scrollIntoView({behavior:'smooth',block:'center'});return}
    createBtn.disabled=true;createBtn.textContent='초대 링크 만드는 중…';status.textContent='';
    try{
      const res=await fetch('/api/lumen-link/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({inviterLabel:profile.name,elements:profile.elements,weakest:weakest(profile.elements)})});
      const data=await res.json().catch(()=>({}));
      if(!res.ok||!data?.ok||!data?.invite?.token){if(data?.error==='link_not_enabled')throw Error('초대 기능이 아직 서버에서 활성화되지 않았습니다. 배포 설정에서 LUMEN_LINK_ENABLED를 확인해 주세요.');throw Error('초대 링크를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.')}
      currentUrl=`${location.origin}/link/${encodeURIComponent(data.invite.token)}`;
      linkBox.textContent=currentUrl;linkBox.hidden=false;copyBtn.hidden=false;status.textContent='초대 링크가 만들어졌습니다.';
      await share(currentUrl,profile.name);
    }catch(e){status.textContent=e.message||'초대 링크 생성 중 오류가 발생했습니다.'}
    finally{createBtn.disabled=false;createBtn.textContent='새 초대 링크 만들기'}
  });
  copyBtn.addEventListener('click',()=>currentUrl&&copy(currentUrl));
}
const start=()=>{
  fix();injectInviteStyles();injectInviteCard();
  const targets=['meYear','otherYear'].map(id=>document.getElementById(id)).filter(Boolean);
  if(targets.length){let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fix()})});targets.forEach(el=>observer.observe(el,{subtree:true,childList:true,characterData:true}));}
  setTimeout(fix,120);setTimeout(fix,500);setTimeout(fix,1200);setTimeout(injectInviteCard,250);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
