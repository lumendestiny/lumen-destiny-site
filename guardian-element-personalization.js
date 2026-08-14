(()=>{
  const qs=new URLSearchParams(location.search);
  const element=qs.get('element');
  const source=qs.get('source');
  if(!['목','화','토','금','수'].includes(element)||source!=='saju-result')return;
  const DATA={
    목:{name:'목(木)',theme:'성장·기획·새로운 시작',animal:'🦌',symbol:'生長守護',title:'Wood · Growth Guardian',cardBg:'linear-gradient(155deg,#07170f,#123522)',frameBg:'radial-gradient(circle at 50% 38%,rgba(96,190,126,.25),transparent 45%),linear-gradient(180deg,#081b12 0%,#12301f 58%,#07150e 100%)',border:'#64b47d',accent:'#bce8c7',reason:'새로운 시작, 계획, 배움과 장기적인 성장 방향을 의식적으로 키우는 상징으로 구성합니다.'},
    화:{name:'화(火)',theme:'표현·활력·실행',animal:'🦅',symbol:'活力守護',title:'Fire · Vitality Guardian',cardBg:'linear-gradient(155deg,#26090b,#54171b)',frameBg:'radial-gradient(circle at 50% 38%,rgba(245,112,83,.27),transparent 45%),linear-gradient(180deg,#26090b 0%,#471216 58%,#1e0708 100%)',border:'#e66d58',accent:'#ffc0ad',reason:'생각을 행동으로 옮기는 추진력, 표현력과 따뜻한 소통을 기억하는 상징으로 구성합니다.'},
    토:{name:'토(土)',theme:'안정·관리·신뢰',animal:'🐻',symbol:'安定守護',title:'Earth · Balance Guardian',cardBg:'linear-gradient(155deg,#21170b,#4a3518)',frameBg:'radial-gradient(circle at 50% 38%,rgba(211,172,93,.26),transparent 45%),linear-gradient(180deg,#22170b 0%,#3d2c16 58%,#1c1208 100%)',border:'#c9a35e',accent:'#f2d69a',reason:'생활 리듬, 관리, 꾸준함과 관계에서의 신뢰를 의식하는 상징으로 구성합니다.'},
    금:{name:'금(金)',theme:'판단·정리·결단',animal:'🐯',symbol:'決斷守護',title:'Metal · Clarity Guardian',cardBg:'linear-gradient(155deg,#11151b,#303945)',frameBg:'radial-gradient(circle at 50% 38%,rgba(197,214,229,.24),transparent 45%),linear-gradient(180deg,#111720 0%,#27313c 58%,#0d1218 100%)',border:'#aebdca',accent:'#e4edf4',reason:'우선순위, 원칙, 판단과 마무리 집중력을 떠올리는 상징으로 구성합니다.'},
    수:{name:'수(水)',theme:'통찰·유연성·회복',animal:'🐢',symbol:'智慧守護',title:'Water · Insight Guardian',cardBg:'linear-gradient(155deg,#061728,#0d3555)',frameBg:'radial-gradient(circle at 50% 38%,rgba(82,163,218,.26),transparent 45%),linear-gradient(180deg,#071a2d 0%,#0d2f4d 58%,#051421 100%)',border:'#5ba0cf',accent:'#b9def5',reason:'상황을 넓게 보는 통찰, 유연한 대응과 관계의 회복력을 기억하는 상징으로 구성합니다.'}
  };
  const d=DATA[element];
  const nameInput=document.getElementById('guardianName');
  const wishInput=document.getElementById('guardianWish');
  const tier=document.getElementById('guardianTier');
  const wishType=document.getElementById('guardianWishType');
  const card=document.querySelector('.guardian-card-preview');
  const frame=document.querySelector('.guardian-card-frame');
  const animal=document.getElementById('guardianCardAnimal');
  const talisman=document.getElementById('guardianCardTalisman');
  const title=document.getElementById('guardianCardTitle');
  const nameText=document.getElementById('guardianCardName');
  const brand=frame?.querySelector('.guardian-card-brand');
  const incomingName=(qs.get('name')||'').trim();
  const incomingWish=(qs.get('wish')||'').trim();
  if(tier&&qs.get('tier')){tier.value=qs.get('tier');tier.dispatchEvent(new Event('change',{bubbles:true}))}
  if(wishType&&qs.get('wishType')){wishType.value=qs.get('wishType');wishType.dispatchEvent(new Event('change',{bubbles:true}))}
  if(nameInput&&incomingName&&!nameInput.value){nameInput.value=incomingName;nameInput.dispatchEvent(new Event('input',{bubbles:true}))}
  if(wishInput&&incomingWish&&!wishInput.value){wishInput.value=incomingWish;wishInput.dispatchEvent(new Event('input',{bubbles:true}))}
  function applyVisual(){
    if(animal)animal.textContent=d.animal;
    if(talisman)talisman.textContent=d.symbol;
    if(title)title.textContent=d.title;
    if(card){card.style.background=d.cardBg;card.style.borderColor=d.border}
    if(frame){frame.style.background=d.frameBg;frame.style.borderColor=d.border}
    if(brand)brand.style.color=d.accent;
    if(nameText)nameText.style.color=d.accent;
  }
  applyVisual();
  tier?.addEventListener('change',()=>setTimeout(applyVisual,0));
  wishType?.addEventListener('change',()=>setTimeout(applyVisual,0));
  const panel=document.querySelector('.guardian-order-panel');
  if(panel&&!document.getElementById('elementRecommendationReason')){
    const box=document.createElement('div');
    box.id='elementRecommendationReason';
    box.className='result-disclaimer';
    box.style.margin='0 0 12px';
    box.style.borderLeft='4px solid '+d.border;
    box.innerHTML=`<strong>사주 결과 맞춤 추천 · ${d.name}</strong><br>현재 무료사주에서 상대적으로 부족하게 나타난 ${d.name}의 <b>${d.theme}</b> 의미를 카드에 반영했습니다. ${d.reason}<br><span style="display:block;margin-top:5px">※ Guardian은 오행이나 운을 실제로 바꾸는 상품이 아니라, 사용자가 키우고 싶은 태도와 소망을 기억하도록 돕는 상징적 디지털 콘텐츠입니다.</span>`;
    panel.prepend(box);
  }
})();