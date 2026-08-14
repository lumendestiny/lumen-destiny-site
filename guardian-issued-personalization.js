(()=>{
  const DATA={목:{benefit:'성장·기획·새로운 시작을 의식하는 힘'},화:{benefit:'표현·활력·실행을 의식하는 힘'},토:{benefit:'안정·관리·신뢰를 의식하는 힘'},금:{benefit:'판단·정리·결단을 의식하는 힘'},수:{benefit:'통찰·유연성·회복을 의식하는 힘'}};
  const qs=new URLSearchParams(location.search);
  const requested=(qs.get('id')||'').trim().toUpperCase();
  function read(id){try{return JSON.parse(localStorage.getItem('lumen-guardian-personalization')||'{}')[id]||null}catch{return null}}
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function render(id){
    const p=read(id);if(!p||document.getElementById('guardianPersonalizedIssued'))return;
    const result=document.getElementById('verifyResult');if(!result||result.hidden)return;
    const d=DATA[p.element]||{};
    const section=document.createElement('section');section.id='guardianPersonalizedIssued';section.className='result-panel';
    section.innerHTML=`<div class="panel-heading"><div><p class="section-label">MY ELEMENT GUARDIAN</p><h2>나에게 추천된 오행 Guardian</h2></div><span class="engine-badge">${esc(p.name||p.element)}</span></div><div style="display:grid;grid-template-columns:minmax(210px,.75fr) minmax(0,1.25fr);gap:14px;align-items:stretch"><div style="border:2px solid ${esc(p.border)};border-radius:18px;padding:12px;background:${p.cardBg};color:${esc(p.accent)}"><div style="min-height:250px;border:1px solid ${esc(p.border)};border-radius:14px;background:${p.frameBg};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:18px"><div style="font-size:4.8rem;line-height:1">${esc(p.animal)}</div><div style="margin-top:8px;padding:8px 10px;border-radius:8px;border:1px solid ${esc(p.border)};font-weight:900">${esc(p.symbol)}</div><strong style="margin-top:16px;font-size:1.05rem">${esc(p.displayName||'MY GUARDIAN')}</strong><span style="margin-top:5px;font-size:.78rem">${esc(p.title)}</span></div></div><div class="deep-reading-grid" style="margin-top:0"><article><span>추천 근거</span><h3>${esc(p.name)} · ${esc(p.theme)}</h3><p>무료사주에서 상대적으로 부족하게 나타난 기운을 생활에서 의식할 주제로 연결해 만든 맞춤 Guardian입니다.</p></article><article><span>기억하면 좋은 방향</span><h3>${esc(d.benefit||p.theme)}</h3><p>Guardian을 볼 때마다 이 주제를 오늘의 행동과 선택에 어떻게 적용할지 한 번 떠올려 보세요.</p></article><article><span>개인화 유지</span><h3>발급 후에도 같은 상징을 확인</h3><p>추천 당시의 오행, 색상, 수호동물과 문구를 이 브라우저의 인증 화면에서도 이어서 보여드립니다.</p></article><article><span>안내</span><h3>상징적 콘텐츠</h3><p>이 Guardian은 실제 오행이나 운을 물리적으로 바꾸는 상품이 아니라, 사용자가 키우고 싶은 태도와 소망을 기억하도록 돕는 디지털 콘텐츠입니다.</p></article></div></div>`;
    result.insertAdjacentElement('afterend',section);
  }
  window.addEventListener('lumen-guardian-verified',e=>{const id=(e.detail?.id||'').toUpperCase();setTimeout(()=>render(id),0)});
  if(requested){let n=0;const t=setInterval(()=>{const r=document.getElementById('verifyResult');if(r&&!r.hidden){clearInterval(t);render(requested)}else if(++n>80)clearInterval(t)},100)}
})();