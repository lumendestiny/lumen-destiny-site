(()=>{
  'use strict';
  const qs=new URLSearchParams(location.search);
  let lang=(qs.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';
  else if(lang.startsWith('ja'))lang='ja';
  else if(lang.startsWith('vi'))lang='vi';
  else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';
  else if(lang.startsWith('en'))lang='en';
  else lang='ko';

  const copy={
    ko:{nav:'인연지도',title:'인연지도',body:'가족·연인·친구·직장 인연을 연결해 관계망의 오행 균형과 각 인연의 영향을 살펴봅니다.',cta:'나의 인연지도 만들기 →'},
    en:{nav:'Connection Map',title:'Connection Map',body:'Connect family, partners, friends and work relationships to see how each connection changes the Five-Element balance of your network.',cta:'Build my connection map →'},
    ja:{nav:'ご縁マップ',title:'ご縁マップ',body:'家族・恋人・友人・仕事のご縁をつなぎ、関係ネットワークの五行バランスと各ご縁の影響を見ます。',cta:'ご縁マップを作る →'},
    tl:{nav:'Connection Map',title:'Connection Map',body:'Ikonekta ang pamilya, partner, kaibigan at trabaho upang makita ang balanse ng Five Elements at epekto ng bawat ugnayan.',cta:'Gawin ang aking connection map →'},
    vi:{nav:'Bản đồ quan hệ',title:'Bản đồ quan hệ',body:'Kết nối gia đình, người yêu, bạn bè và công việc để xem cân bằng Ngũ Hành của mạng lưới và ảnh hưởng của từng mối quan hệ.',cta:'Tạo bản đồ quan hệ →'},
    zh:{nav:'缘分地图',title:'缘分地图',body:'连接家人、伴侣、朋友与职场关系，查看关系网络的五行平衡以及每段缘分带来的变化。',cta:'创建我的缘分地图 →'}
  }[lang]||null;
  if(!copy)return;

  document.querySelectorAll('a[href*="consult"]').forEach(a=>a.remove());

  const card=document.getElementById('connection-map');
  if(card){
    const number=card.querySelector(':scope > span');
    const title=card.querySelector('h3');
    const body=card.querySelector('p');
    let link=card.querySelector('a');
    if(number)number.textContent='06';
    if(title)title.textContent=copy.title;
    if(body)body.textContent=copy.body;
    if(!link){link=document.createElement('a');card.appendChild(link)}
    link.href='/connection-map/?lang='+encodeURIComponent(lang);
    link.textContent=copy.cta;
  }

  const nav=document.querySelector('.main-fortune-nav');
  if(nav){
    let link=nav.querySelector('a[href*="connection-map"]');
    if(!link){
      link=document.createElement('a');
      link.href='/connection-map/?lang='+encodeURIComponent(lang);
      nav.appendChild(link);
    }
    link.textContent=copy.nav;
  }
})();
