(()=>{
'use strict';

const LANGS=['ko','en','ja','tl','vi','zh'];
function normalizeLang(value){
  const v=String(value||'').toLowerCase();
  if(v.startsWith('zh'))return 'zh';
  if(v.startsWith('ja'))return 'ja';
  if(v.startsWith('vi'))return 'vi';
  if(v.startsWith('tl')||v.startsWith('fil'))return 'tl';
  if(v.startsWith('en'))return 'en';
  return 'ko';
}
function currentLang(explicit){
  const q=new URLSearchParams(location.search).get('lang');
  return normalizeLang(explicit||window.__LUMEN_LANG__||q||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');
}

const COPY={
  ko:{heading:'가격대별 5종, 총 20종의 고해상도 판매용 Guardian',intro:'$5 · $10 · $50 · $100 각 등급마다 수호동물·오행·소망 테마·문양을 다르게 설계했습니다. 모든 아트는 Lumen 전용 원본으로 관리하며, 검수 완료된 HD 마스터만 개별 카드에 연결합니다. $50은 변화하는 Rare 테두리, $100은 빛과 메인 아트에 모션 효과가 적용됩니다. 이미지와 상품 설명은 완전히 분리되어 서로 겹치지 않습니다.',perDesign:n=>`각 디자인 ${n}개 한정 발행`,onePerDesign:'각 디자인 1개만 발행',limited:n=>`${n}개 한정`,oneOfOne:'1/1',select:'이 Guardian 선택'},
  en:{heading:'5 designs per tier, 20 high-resolution Guardians in total',intro:'Each $5 · $10 · $50 · $100 tier has its own guardian animal, Five Element, wish theme, and pattern. All artwork is managed as original Lumen-exclusive art, and only reviewed HD masters are connected to each card. $50 Rare cards use an animated border, while $100 Legendary cards include light and main-art motion effects. Artwork and product descriptions are kept separate so they never overlap.',perDesign:n=>`${n} issued per design`,onePerDesign:'Only 1 issued per design',limited:n=>`${n} limited`,oneOfOne:'1/1',select:'Select this Guardian'},
  ja:{heading:'価格帯ごとに5種、全20種の高解像度Guardian',intro:'$5・$10・$50・$100の各ランクごとに、守護動物・五行・願いのテーマ・文様をそれぞれ異なる構成で設計しています。すべてのアートはLumen専用のオリジナルとして管理し、検品済みのHDマスターのみ各カードに接続します。$50 Rareには変化するボーダー、$100 Legendaryには光とメインアートのモーション効果が入ります。画像と商品説明は完全に分離し、重ならないようにしています。',perDesign:n=>`各デザイン${n}点限定発行`,onePerDesign:'各デザイン1点のみ発行',limited:n=>`${n}点限定`,oneOfOne:'1/1',select:'このGuardianを選択'},
  tl:{heading:'5 disenyo bawat tier, 20 high-resolution Guardian sa kabuuan',intro:'Magkakaiba ang guardian animal, Five Element, wish theme, at pattern sa bawat $5 · $10 · $50 · $100 tier. Lahat ng artwork ay orihinal at eksklusibo sa Lumen, at reviewed HD masters lamang ang ikinakabit sa bawat card. Ang $50 Rare ay may animated border, habang ang $100 Legendary ay may motion effects sa liwanag at main artwork. Hiwalay ang artwork at product description para hindi sila mag-overlap.',perDesign:n=>`${n} lamang bawat disenyo`,onePerDesign:'1 lamang bawat disenyo',limited:n=>`${n} limited`,oneOfOne:'1/1',select:'Piliin ang Guardian na ito'},
  vi:{heading:'5 thiết kế mỗi hạng, tổng cộng 20 Guardian độ phân giải cao',intro:'Mỗi hạng $5 · $10 · $50 · $100 được thiết kế với linh thú hộ mệnh, Ngũ Hành, chủ đề điều ước và hoa văn riêng. Toàn bộ artwork là bản gốc độc quyền của Lumen và chỉ bản HD đã kiểm duyệt mới được gắn vào từng thẻ. Hạng Rare $50 có viền chuyển động, còn Legendary $100 có hiệu ứng chuyển động ánh sáng và hình chính. Hình ảnh và mô tả sản phẩm được tách riêng để không chồng lấn.',perDesign:n=>`Giới hạn ${n} bản mỗi thiết kế`,onePerDesign:'Chỉ 1 bản mỗi thiết kế',limited:n=>`Giới hạn ${n} bản`,oneOfOne:'1/1',select:'Chọn Guardian này'},
  zh:{heading:'每个价位5款，共20款高清Guardian',intro:'$5、$10、$50、$100各等级均采用不同的守护动物、五行、愿望主题与纹样设计。所有作品均作为Lumen专属原创进行管理，仅将审核完成的HD母版连接到各卡片。$50 Rare采用动态边框，$100 Legendary则加入光效与主画面动态效果。图片与商品说明完全分离，避免相互遮挡。',perDesign:n=>`每款限量发行${n}份`,onePerDesign:'每款仅发行1份',limited:n=>`限量${n}份`,oneOfOne:'1/1',select:'选择此Guardian'}
};

const DATA={
'fortune-cat':{el:'metal',ko:['행운냥이','행운 · 재물 · 번성'],en:['Fortune Cat','Luck · Wealth · Prosperity'],ja:['幸運ねこ','幸運 · 金運 · 繁栄'],tl:['Fortune Cat','Suwerte · Yaman · Pag-unlad'],vi:['Mèo May Mắn','May mắn · Tài lộc · Thịnh vượng'],zh:['招财猫','好运 · 财富 · 兴旺']},
'koi':{el:'water',ko:['비단잉어','출세 · 합격 · 도약'],en:['Silk Koi','Advancement · Success · Leap'],ja:['錦鯉','出世 · 合格 · 飛躍'],tl:['Koi','Pag-angat · Tagumpay · Pagsulong'],vi:['Cá Chép Gấm','Thăng tiến · Đỗ đạt · Bứt phá'],zh:['锦鲤','晋升 · 金榜题名 · 飞跃']},
'sun-bird':{el:'fire',ko:['아기 봉황','기쁨 · 좋은 소식 · 활력'],en:['Baby Phoenix','Joy · Good News · Vitality'],ja:['幼い鳳凰','喜び · 良い知らせ · 活力'],tl:['Batang Phoenix','Saya · Magandang Balita · Sigla'],vi:['Phượng Hoàng Non','Niềm vui · Tin tốt · Sức sống'],zh:['幼凤','喜悦 · 好消息 · 活力']},
'new-deer':{el:'wood',ko:['새벽사슴','새로운 시작 · 성장'],en:['Dawn Deer','New Beginnings · Growth'],ja:['暁の鹿','新しい始まり · 成長'],tl:['Dawn Deer','Bagong Simula · Paglago'],vi:['Hươu Bình Minh','Khởi đầu mới · Phát triển'],zh:['晨鹿','新的开始 · 成长']},
'gold-hamster':{el:'earth',ko:['복다람','모으기 · 지킴 · 풍요'],en:['Fortune Squirrel','Saving · Protection · Abundance'],ja:['福リス','蓄え · 守り · 豊かさ'],tl:['Fortune Squirrel','Pag-iipon · Pagprotekta · Kasaganaan'],vi:['Sóc Phúc Lộc','Tích lũy · Gìn giữ · Sung túc'],zh:['福松鼠','积累 · 守护 · 富足']},
'moon-rabbit':{el:'metal',ko:['달토끼','인연성취 · 행복'],en:['Moon Rabbit','Connection · Fulfillment · Happiness'],ja:['月うさぎ','良縁成就 · 幸福'],tl:['Moon Rabbit','Ugnayan · Katuparan · Kaligayahan'],vi:['Thỏ Trăng','Nhân duyên · Viên mãn · Hạnh phúc'],zh:['月兔','良缘 · 圆满 · 幸福']},
'dolphin':{el:'water',ko:['소망돌고래','기회 · 여행 · 자유'],en:['Wish Dolphin','Opportunity · Travel · Freedom'],ja:['願いのイルカ','機会 · 旅 · 自由'],tl:['Wish Dolphin','Oportunidad · Paglalakbay · Kalayaan'],vi:['Cá Heo Điều Ước','Cơ hội · Du hành · Tự do'],zh:['愿望海豚','机会 · 旅行 · 自由']},
'fire-fox':{el:'fire',ko:['불여우','열정 · 자신감 · 행운'],en:['Fire Fox','Passion · Confidence · Luck'],ja:['炎の狐','情熱 · 自信 · 幸運'],tl:['Fire Fox','Pasyon · Kumpiyansa · Suwerte'],vi:['Cáo Lửa','Đam mê · Tự tin · May mắn'],zh:['火狐','热情 · 自信 · 好运']},
'leaf-turtle':{el:'wood',ko:['잎새거북','건강 · 안정 · 보호'],en:['Leaf Turtle','Health · Stability · Protection'],ja:['葉の亀','健康 · 安定 · 守護'],tl:['Leaf Turtle','Kalusugan · Katatagan · Proteksyon'],vi:['Rùa Lá','Sức khỏe · Ổn định · Bảo hộ'],zh:['叶龟','健康 · 安稳 · 守护']},
'star-owl':{el:'earth',ko:['별부엉이','학업 · 합격 · 목표달성'],en:['Star Owl','Study · Success · Goal Achievement'],ja:['星ふくろう','学業 · 合格 · 目標達成'],tl:['Star Owl','Pag-aaral · Tagumpay · Pag-abot ng Layunin'],vi:['Cú Sao','Học tập · Đỗ đạt · Đạt mục tiêu'],zh:['星鸮','学业 · 成功 · 达成目标']},
'nine-fox':{el:'metal',ko:['백호','수호 · 승리 · 권위'],en:['White Tiger','Protection · Victory · Authority'],ja:['白虎','守護 · 勝利 · 威厳'],tl:['White Tiger','Proteksyon · Tagumpay · Awtoridad'],vi:['Bạch Hổ','Bảo hộ · Chiến thắng · Uy quyền'],zh:['白虎','守护 · 胜利 · 威严']},
'sea-dragon':{el:'wood',ko:['청룡','성장 · 기회 · 도약'],en:['Azure Dragon','Growth · Opportunity · Leap'],ja:['青龍','成長 · 機会 · 飛躍'],tl:['Azure Dragon','Paglago · Oportunidad · Pagsulong'],vi:['Thanh Long','Phát triển · Cơ hội · Bứt phá'],zh:['青龙','成长 · 机会 · 飞跃']},
'unicorn':{el:'fire',ko:['주작','열정 · 성공 · 명예'],en:['Vermilion Bird','Passion · Success · Honor'],ja:['朱雀','情熱 · 成功 · 名誉'],tl:['Vermilion Bird','Pasyon · Tagumpay · Karangalan'],vi:['Chu Tước','Đam mê · Thành công · Danh dự'],zh:['朱雀','热情 · 成功 · 荣耀']},
'forest-turtle':{el:'water',ko:['현무','안정 · 보호 · 장수'],en:['Black Tortoise','Stability · Protection · Longevity'],ja:['玄武','安定 · 守護 · 長寿'],tl:['Black Tortoise','Katatagan · Proteksyon · Mahabang Buhay'],vi:['Huyền Vũ','Ổn định · Bảo hộ · Trường thọ'],zh:['玄武','安稳 · 守护 · 长寿']},
'wing-owl':{el:'earth',ko:['황금기린','재물 · 번영 · 행운'],en:['Golden Qilin','Wealth · Prosperity · Luck'],ja:['黄金麒麟','金運 · 繁栄 · 幸運'],tl:['Golden Qilin','Yaman · Kasaganaan · Suwerte'],vi:['Kỳ Lân Vàng','Tài lộc · Thịnh vượng · May mắn'],zh:['黄金麒麟','财富 · 繁荣 · 好运']},
'sky-dragon':{el:'metal',ko:['백룡','성공 · 권위 · 개운'],en:['White Dragon','Success · Authority · Auspicious Change'],ja:['白龍','成功 · 威厳 · 開運'],tl:['White Dragon','Tagumpay · Awtoridad · Mabuting Pagbabago'],vi:['Bạch Long','Thành công · Uy quyền · Khai vận'],zh:['白龙','成功 · 威望 · 开运']},
'fire-phoenix':{el:'fire',ko:['주작','열정 · 재물 · 승진'],en:['Vermilion Bird','Passion · Wealth · Promotion'],ja:['朱雀','情熱 · 金運 · 昇進'],tl:['Vermilion Bird','Pasyon · Yaman · Promotion'],vi:['Chu Tước','Đam mê · Tài lộc · Thăng tiến'],zh:['朱雀','热情 · 财富 · 晋升']},
'moon-tiger':{el:'wood',ko:['청호','수호 · 극복 · 도약'],en:['Azure Tiger','Protection · Overcoming · Leap'],ja:['青虎','守護 · 克服 · 飛躍'],tl:['Azure Tiger','Proteksyon · Pagtagumpayan · Pagsulong'],vi:['Thanh Hổ','Bảo hộ · Vượt qua · Bứt phá'],zh:['青虎','守护 · 克服 · 飞跃']},
'qilin':{el:'earth',ko:['녹기린','번영 · 성장 · 행운'],en:['Green Qilin','Prosperity · Growth · Luck'],ja:['緑麒麟','繁栄 · 成長 · 幸運'],tl:['Green Qilin','Kasaganaan · Paglago · Suwerte'],vi:['Lục Kỳ Lân','Thịnh vượng · Phát triển · May mắn'],zh:['绿麒麟','繁荣 · 成长 · 好运']},
'black-turtle':{el:'water',ko:['현무','안정 · 장수 · 보호'],en:['Black Tortoise','Stability · Longevity · Protection'],ja:['玄武','安定 · 長寿 · 守護'],tl:['Black Tortoise','Katatagan · Mahabang Buhay · Proteksyon'],vi:['Huyền Vũ','Ổn định · Trường thọ · Bảo hộ'],zh:['玄武','安稳 · 长寿 · 守护']}
};
const ELEMENTS={
 ko:{metal:'금(金)',water:'수(水)',fire:'화(火)',wood:'목(木)',earth:'토(土)'},
 en:{metal:'Metal',water:'Water',fire:'Fire',wood:'Wood',earth:'Earth'},
 ja:{metal:'金',water:'水',fire:'火',wood:'木',earth:'土'},
 tl:{metal:'Metal',water:'Tubig',fire:'Apoy',wood:'Kahoy',earth:'Lupa'},
 vi:{metal:'Kim',water:'Thủy',fire:'Hỏa',wood:'Mộc',earth:'Thổ'},
 zh:{metal:'金',water:'水',fire:'火',wood:'木',earth:'土'}
};

function localize(explicit){
  const lang=currentLang(explicit), c=COPY[lang]||COPY.ko;
  const heading=document.querySelector('.purpose-guardian-heading h2');
  const intro=document.querySelector('.purpose-guardian-heading p:not(.section-label)');
  if(heading)heading.textContent=c.heading;
  if(intro)intro.textContent=c.intro;

  document.querySelectorAll('.gc2-tier').forEach(section=>{
    const price=Number((section.querySelector('.gc2-tier-price')?.textContent||'').replace(/[^0-9]/g,''));
    const small=section.querySelector('.gc2-tier-head small');
    if(small){
      const limit=price===5||price===10?100:price===50?5:1;
      small.textContent=price===100?c.onePerDesign:c.perDesign(limit);
    }
  });

  document.querySelectorAll('.gc2-card[data-guardian-key]').forEach(card=>{
    const key=card.dataset.guardianKey, d=DATA[key];
    if(!d)return;
    const translated=d[lang]||d.ko;
    const title=card.querySelector('.gc2-info h3');
    const desc=card.querySelector('.gc2-info p');
    const limit=card.querySelector('.gc2-limit');
    const button=card.querySelector('.gc2-info .button');
    const alt=card.querySelector('.gc2-hd-img');
    if(title)title.textContent=translated[0];
    if(desc)desc.innerHTML=`<strong>${ELEMENTS[lang][d.el]}</strong> · ${translated[1]}`;
    if(limit){
      const tier=card.className.match(/gc2-(basic|personal|rare|legendary)/)?.[1];
      limit.textContent=tier==='legendary'?c.oneOfOne:c.limited(tier==='rare'?5:100);
    }
    if(button)button.textContent=c.select;
    if(alt)alt.alt=`${translated[0]} Lumen Guardian HD`;
  });
}

function schedule(lang){
  setTimeout(()=>localize(lang),0);
  setTimeout(()=>localize(lang),80);
  setTimeout(()=>localize(lang),300);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule());
else schedule();
window.addEventListener('load',()=>schedule(),{once:true});
window.addEventListener('lumen-language-change',e=>schedule(e.detail?.lang));
document.addEventListener('click',e=>{
  const choice=e.target.closest?.('.lang-choice');
  if(choice)schedule(choice.dataset.lang);
});
const target=document.querySelector('#purpose-guardians .archive-grid');
if(target)new MutationObserver(()=>localize()).observe(target,{childList:true,subtree:true});
})();