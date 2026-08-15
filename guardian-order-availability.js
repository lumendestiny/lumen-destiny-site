(()=>{
 const qs=new URLSearchParams(location.search),guardian=(qs.get('guardian')||'').trim();
 if(!guardian)return;
 const form=document.getElementById('guardianOrderForm'),submit=form?.querySelector('button[type="submit"]'),confirm=document.getElementById('guardianConfirm');
 const tierMap={'fortune-cat':'basic','koi':'basic','sun-bird':'basic','new-deer':'basic','gold-hamster':'basic','moon-rabbit':'custom','dolphin':'custom','fire-fox':'custom','leaf-turtle':'custom','star-owl':'custom','nine-fox':'rare','sea-dragon':'rare','unicorn':'rare','forest-turtle':'rare','wing-owl':'rare','sky-dragon':'legendary','fire-phoenix':'legendary','moon-tiger':'legendary','qilin':'legendary','black-turtle':'legendary'};
 const tier=tierMap[guardian];if(!tier)return;
 const editionKey=guardian;
 function block(msg){
  if(submit){submit.disabled=true;submit.textContent='SOLD OUT'}
  if(confirm){confirm.disabled=true;confirm.textContent='SOLD OUT · 다른 Guardian 선택'}
  let n=document.getElementById('guardianSoldOutNotice');if(!n){n=document.createElement('div');n.id='guardianSoldOutNotice';n.className='result-panel error-panel';form?.before(n)}
  n.innerHTML=`<p class="section-label">EDITION SOLD OUT</p><h2>이 Guardian은 발행 한도가 모두 소진되었습니다.</h2><p>${msg||'동일 디자인은 추가 발행하지 않습니다. 아카이브에서 다른 Guardian을 선택해 주세요.'}</p><div class="result-actions"><a class="button primary" href="/guardian/">다른 Guardian 보기</a></div>`;
 }
 async function run(){try{const r=await fetch(`/api/guardian/availability?editionKey=${encodeURIComponent(editionKey)}&tier=${encodeURIComponent(tier)}`,{headers:{accept:'application/json'},cache:'no-store'});if(!r.ok)return;const d=await r.json();if(d?.soldOut||Number(d?.remaining)===0)block();}catch{}}
 run();
})();