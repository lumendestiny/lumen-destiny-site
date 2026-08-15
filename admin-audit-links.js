(()=>{
  const search=document.getElementById('opsSearch'),filter=document.getElementById('opsFilter'),events=document.getElementById('opsEvents');
  function focusAudit(eventId,guardianId){if(filter){filter.value='all';filter.dispatchEvent(new Event('change',{bubbles:true}))}if(search){search.value=eventId||guardianId||'';search.dispatchEvent(new Event('input',{bubbles:true}))}const table=events?.closest('.result-panel')||events;if(table)table.scrollIntoView({behavior:'smooth',block:'start'});const message=document.getElementById('opsMessage');if(message)message.textContent=`결제 이벤트 조사 필터 적용: ${eventId||guardianId||'선택 이벤트'}`;}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-audit-event]');if(!b)return;focusAudit(b.dataset.auditEvent||'',b.dataset.auditGuardian||'')});

  const toolbar=document.querySelector('.ops-toolbar');
  const goLive=document.getElementById('opsGoLiveGate')?.closest('.result-panel');
  if(!toolbar||!goLive)return;

  const button=document.createElement('button');
  button.id='opsD1Preflight';
  button.className='button secondary';
  button.type='button';
  button.textContent='D1 Preflight';
  toolbar.insertBefore(button,toolbar.querySelector('#opsForget'));

  const panel=document.createElement('section');
  panel.className='result-panel';
  panel.innerHTML='<p class="section-label">PRODUCTION D1 PREFLIGHT</p><div id="opsD1Gate" class="release-gate release-hold"><strong>D1 PREFLIGHT HOLD</strong><p>Internal secret을 입력하고 D1 Preflight를 실행하면 고객 데이터를 불러오지 않고 스키마·필수 인덱스·checkout control 상태만 확인합니다.</p></div><div id="opsD1Items" class="ops-grid" style="margin-top:14px"></div><p id="opsD1Note" class="result-disclaimer">※ 이 검사는 읽기 전용입니다. 실제 고객 주문/메시지/배송값은 표시하지 않습니다.</p>';
  goLive.insertAdjacentElement('afterend',panel);

  const gate=document.getElementById('opsD1Gate'),items=document.getElementById('opsD1Items'),note=document.getElementById('opsD1Note'),secret=document.getElementById('opsSecret'),message=document.getElementById('opsMessage');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const badge=(label,ok)=>`<span class="ops-badge">${ok?'PASS':'HOLD'} · ${esc(label)}</span>`;
  function getSecret(){const value=(secret?.value||sessionStorage.getItem('lumen-internal-secret')||'').trim();if(value)sessionStorage.setItem('lumen-internal-secret',value);return value;}
  function render(data){
    const summary=data?.summary||{},control=data?.paymentControl||{},release=data?.releaseContext||{},blockers=data?.blockers||[];
    gate.classList.toggle('release-ready',!!summary.ready);gate.classList.toggle('release-hold',!summary.ready);
    gate.innerHTML=`<strong>${summary.ready?'D1 PREFLIGHT READY':'D1 PREFLIGHT HOLD'}</strong><p>스키마 ${summary.tablesReady?'PASS':'HOLD'} · 인덱스 ${summary.indexesReady?'PASS':'HOLD'} · Checkout control ${summary.controlSafe?'SAFE':'HOLD 확인 필요'}</p>`;
    items.innerHTML=`<article class="ops-card"><span>필수 테이블/컬럼</span><strong>${summary.tablesReady?'PASS':'HOLD'}</strong><p>${(data.tables||[]).filter(x=>x.ok).length} / ${(data.tables||[]).length}</p></article><article class="ops-card"><span>필수 인덱스</span><strong>${summary.indexesReady?'PASS':'HOLD'}</strong><p>${(data.indexes||[]).filter(x=>x.ok).length} / ${(data.indexes||[]).length}</p></article><article class="ops-card"><span>Checkout control</span><strong>${esc(control.state||'MISSING')}</strong><p>현재 기대값: ${esc(control.expected||'hold')}</p></article><article class="ops-card"><span>PG 외부 증거</span><strong>${release.pgEvidenceReady?'READY':'HOLD'}</strong><p>KYC · Sandbox · Production</p></article><article class="ops-card"><span>Privacy 운영 증거</span><strong>${release.privacyEvidenceReady?'READY':'HOLD'}</strong><p>Retention · 삭제요청 · Logging</p></article><article class="ops-card"><span>Public Checkout Arm</span><strong>${release.paymentPublicCheckoutEnabled?'ON':'OFF'}</strong><p>TEST MODE ${release.paymentTestMode?'ON':'OFF'}</p></article>`;
    note.innerHTML=`읽기 전용 · 고객 row 반환 ${data.customerRowsReturned?'주의':'없음'}${blockers.length?` · Blocker: ${blockers.map(esc).join(', ')}`:' · 현재 D1 구조/제어 blocker 없음'}`;
  }
  async function run(){
    const key=getSecret();if(!key){if(message)message.textContent='D1 Preflight: Internal secret을 먼저 입력해 주세요.';return}
    button.disabled=true;button.textContent='D1 확인 중…';
    try{
      const res=await fetch(`/api/admin/d1-preflight?ts=${Date.now()}`,{cache:'no-store',headers:{accept:'application/json','x-lumen-internal-secret':key}});
      let data={};try{data=await res.json()}catch{}
      if(!res.ok)throw new Error(data?.error||`HTTP ${res.status}`);
      render(data);if(message)message.textContent=`D1 Preflight 완료: ${data.summary?.label||'상태 확인 완료'} · ${new Date(data.generatedAt||Date.now()).toLocaleString()}`;
    }catch(error){gate.classList.remove('release-ready');gate.classList.add('release-hold');gate.innerHTML=`<strong>D1 PREFLIGHT ERROR</strong><p>${esc(error?.message||error)}</p>`;if(message)message.textContent=`D1 Preflight 실패: ${error?.message||error}`}
    finally{button.disabled=false;button.textContent='D1 Preflight'}
  }
  button.addEventListener('click',run);
})();
