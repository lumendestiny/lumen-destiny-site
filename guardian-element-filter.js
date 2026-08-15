(()=>{
 const P=new URLSearchParams(location.search),raw=(P.get('element')||'').trim(),element=({wood:'목',fire:'화',earth:'토',metal:'금',water:'수'})[raw.toLowerCase()]||raw;
 if(!['목','화','토','금','수'].includes(element))return;
 const LABEL={목:'목(木) · 성장과 시작',화:'화(火) · 활력과 실행',토:'토(土) · 안정과 균형',금:'금(金) · 판단과 정리',수:'수(水) · 통찰과 유연성'};
 const norm=s=>(s||'').replace(/\s+/g,'');
 function run(){const collection=document.querySelector('.gc2-collection');if(!collection)return false;
  const cards=[...collection.querySelectorAll('.gc2-card')];if(!cards.length)return false;
  const matched=cards.filter(c=>norm(c.querySelector('.gc2-info p')?.textContent).includes(element+'('));
  if(!matched.length)return true;
  let box=document.getElementById('elementMatchGuardians');if(!box){box=document.createElement('section');box.id='elementMatchGuardians';box.className='gc2-tier element-match-tier';collection.prepend(box)}
  box.innerHTML=`<div class="gc2-tier-head"><span class="gc2-tier-price">추천</span><div><strong>사주 결과와 연결된 ${LABEL[element]} Guardian</strong><small>아래 상품은 사주 결과에서 전달된 보완 참고 기운과 같은 오행 테마입니다. 가격대와 디자인을 비교해 선택할 수 있습니다.</small></div></div><div class="gc2-row element-match-row"></div><p class="element-match-note">Guardian은 운세의 변화를 보장하는 상품이 아니라, 사주 해설에서 확인한 목표와 태도를 기억하기 위한 상징적 디지털 콘텐츠입니다. 구매하지 않아도 무료 사주 해설은 그대로 이용할 수 있습니다.</p>`;
  const row=box.querySelector('.element-match-row');matched.forEach(c=>{const clone=c.cloneNode(true);clone.classList.add('element-recommended');const a=clone.querySelector('a.button');if(a){const u=new URL(a.href,location.origin);u.searchParams.set('element',element);u.searchParams.set('source','saju-element-recommendation');a.href=u.pathname+u.search;a.textContent=`${element} 기운 Guardian 선택`}row.appendChild(clone)});
  const hero=document.querySelector('.archive-hero');if(hero){hero.querySelector('h1').textContent=`${LABEL[element]}을 위한 Guardian을 먼저 보여드립니다.`;const note=hero.querySelector('.archive-note');if(note)note.textContent=`사주 결과에서 ${LABEL[element]}이 보완 참고 기운으로 안내되었습니다. 아래 추천 영역에서 같은 오행을 가진 Guardian을 가격대별로 먼저 비교할 수 있습니다.`;const primary=hero.querySelector('.button.primary');if(primary){primary.href='#elementMatchGuardians';primary.textContent=`${element} 기운 추천 Guardian 보기`}}
  if(!document.getElementById('element-match-style')){const s=document.createElement('style');s.id='element-match-style';s.textContent='.element-match-tier{border:2px solid #b78a2f!important;background:linear-gradient(180deg,#fffdf7,#fff)!important}.element-match-tier .gc2-tier-price{font-size:1.2rem!important}.element-match-note{margin:10px 2px 0;color:#62697a;font-size:.76rem;line-height:1.5}.element-recommended{box-shadow:0 8px 28px rgba(151,105,20,.13)}#elementMatchGuardians{scroll-margin-top:90px}@media(max-width:760px){.element-match-note{font-size:.72rem}}';document.head.appendChild(s)}
  return true}
 let n=0,t=setInterval(()=>{if(run()||++n>100)clearInterval(t)},100);
})();