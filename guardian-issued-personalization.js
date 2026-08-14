(()=>{
  const DATA={
    목:{name:'목(木)',theme:'성장·기획·새로운 시작',benefit:'성장·기획·새로운 시작을 의식하는 힘',animal:'🦌',symbol:'生長守護',title:'Wood · Growth Guardian',cardBg:'linear-gradient(155deg,#07170f,#123522)',frameBg:'radial-gradient(circle at 50% 38%,rgba(96,190,126,.25),transparent 45%),linear-gradient(180deg,#081b12 0%,#12301f 58%,#07150e 100%)',border:'#64b47d',accent:'#bce8c7'},
    화:{name:'화(火)',theme:'표현·활력·실행',benefit:'표현·활력·실행을 의식하는 힘',animal:'🦅',symbol:'活力守護',title:'Fire · Vitality Guardian',cardBg:'linear-gradient(155deg,#26090b,#54171b)',frameBg:'radial-gradient(circle at 50% 38%,rgba(245,112,83,.27),transparent 45%),linear-gradient(180deg,#26090b 0%,#471216 58%,#1e0708 100%)',border:'#e66d58',accent:'#ffc0ad'},
    토:{name:'토(土)',theme:'안정·관리·신뢰',benefit:'안정·관리·신뢰를 의식하는 힘',animal:'🐻',symbol:'安定守護',title:'Earth · Balance Guardian',cardBg:'linear-gradient(155deg,#21170b,#4a3518)',frameBg:'radial-gradient(circle at 50% 38%,rgba(211,172,93,.26),transparent 45%),linear-gradient(180deg,#22170b 0%,#3d2c16 58%,#1c1208 100%)',border:'#c9a35e',accent:'#f2d69a'},
    금:{name:'금(金)',theme:'판단·정리·결단',benefit:'판단·정리·결단을 의식하는 힘',animal:'🐯',symbol:'決斷守護',title:'Metal · Clarity Guardian',cardBg:'linear-gradient(155deg,#11151b,#303945)',frameBg:'radial-gradient(circle at 50% 38%,rgba(197,214,229,.24),transparent 45%),linear-gradient(180deg,#111720 0%,#27313c 58%,#0d1218 100%)',border:'#aebdca',accent:'#e4edf4'},
    수:{name:'수(水)',theme:'통찰·유연성·회복',benefit:'통찰·유연성·회복을 의식하는 힘',animal:'🐢',symbol:'智慧守護',title:'Water · Insight Guardian',cardBg:'linear-gradient(155deg,#061728,#0d3555)',frameBg:'radial-gradient(circle at 50% 38%,rgba(82,163,218,.26),transparent 45%),linear-gradient(180deg,#071a2d 0%,#0d2f4d 58%,#051421 100%)',border:'#5ba0cf',accent:'#b9def5'}
  };
  const qs=new URLSearchParams(location.search),requested=(qs.get('id')||'').trim().toUpperCase();
  function readLocal(id){try{return JSON.parse(localStorage.getItem('lumen-guardian-personalization')||'{}')[id]||null}catch{return null}}
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  async function resolve(id){
    try{const res=await window.LumenAPI?.verifyGuardian?.(id),g=res?.guardian;if(res?.ok&&g?.guardianElement&&DATA[g.guardianElement])return{element:g.guardianElement,displayName:g.displayName||'',server:true,designKey:g.guardianDesignKey||'',source:g.personalizationSource||''}}
    catch{}
    const local=readLocal(id);return local?{...local,server:false}:null;
  }
  async function render(id){
    if(document.getElementById('guardianPersonalizedIssued'))return;
    const result=document.getElementById('verifyResult');if(!result||result.hidden)return;
    const p=await resolve(id);if(!p)return;const d=DATA[p.element];if(!d)return;
    const section=document.createElement('section');section.id='guardianPersonalizedIssued';section.className='result-panel';
    const persistence=p.server?'발급 서버 기록에 저장된 개인화 정보입니다. QR을 다른 기기에서 열어도 같은 오행·수호동물·색상·상징 문구를 확인할 수 있습니다.':'이 브라우저에 저장된 개인화 정보를 표시하고 있습니다.';
    section.innerHTML=`<div class="panel-heading"><div><p class="section-label">MY ELEMENT GUARDIAN</p><h2>나에게 추천된 오행 Guardian</h2></div><span class="engine-badge">${esc(d.name)}</span></div><div class="guardian-issued-personal-grid" style="display:grid;grid-template-columns:minmax(210px,.75fr) minmax(0,1.25fr);gap:14px;align-items:stretch"><div style="border:2px solid ${esc(d.border)};border-radius:18px;padding:12px;background:${d.cardBg};color:${esc(d.accent)}"><div style="min-height:250px;border:1px solid ${esc(d.border)};border-radius:14px;background:${d.frameBg};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:18px"><div style="font-size:4.8rem;line-height:1">${esc(d.animal)}</div><div style="margin-top:8px;padding:8px 10px;border-radius:8px;border:1px solid ${esc(d.border)};font-weight:900">${esc(d.symbol)}</div><strong style="margin-top:16px;font-size:1.05rem">${esc(p.displayName||'MY GUARDIAN')}</strong><span style="margin-top:5px;font-size:.78rem">${esc(d.title)}</span></div></div><div class="deep-reading-grid" style="margin-top:0"><article><span>추천 근거</span><h3>${esc(d.name)} · ${esc(d.theme)}</h3><p>무료사주에서 상대적으로 부족하게 나타난 기운을 생활에서 의식할 주제로 연결해 만든 맞춤 Guardian입니다.</p></article><article><span>기억하면 좋은 방향</span><h3>${esc(d.benefit)}</h3><p>Guardian을 볼 때마다 이 주제를 오늘의 행동과 선택에 어떻게 적용할지 한 번 떠올려 보세요.</p></article><article><span>개인화 유지</span><h3>발급 후에도 같은 상징을 확인</h3><p>${esc(persistence)}</p></article><article><span>안내</span><h3>상징적 콘텐츠</h3><p>이 Guardian은 실제 오행이나 운을 물리적으로 바꾸는 상품이 아니라, 사용자가 키우고 싶은 태도와 소망을 기억하도록 돕는 디지털 콘텐츠입니다.</p></article></div></div>`;
    const style=document.createElement('style');style.textContent='@media(max-width:700px){.guardian-issued-personal-grid{grid-template-columns:1fr!important}}';section.appendChild(style);result.insertAdjacentElement('afterend',section);
  }
  window.addEventListener('lumen-guardian-verified',e=>{const id=(e.detail?.id||'').toUpperCase();setTimeout(()=>render(id),0)});
  if(requested){let n=0;const t=setInterval(()=>{const r=document.getElementById('verifyResult');if(r&&!r.hidden){clearInterval(t);render(requested)}else if(++n>80)clearInterval(t)},100)}
})();