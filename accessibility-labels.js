(()=>{
  const qs=new URLSearchParams(location.search);
  let lang=(window.__LUMEN_LANG__||qs.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';else if(lang.startsWith('ja'))lang='ja';else if(lang.startsWith('vi'))lang='vi';else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';else if(lang.startsWith('en'))lang='en';else lang='ko';
  const L={
    ko:{gender:'성별',year:'출생 연도',month:'출생 월',day:'출생 일',time:'태어난 시간',calendar:'달력 유형',tier:'Guardian 등급',wishType:'소망 분야'},
    en:{gender:'Gender',year:'Birth year',month:'Birth month',day:'Birth day',time:'Birth time',calendar:'Calendar type',tier:'Guardian tier',wishType:'Wish category'},
    ja:{gender:'性別',year:'出生年',month:'出生月',day:'出生日',time:'出生時刻',calendar:'暦の種類',tier:'Guardian等級',wishType:'願いの種類'},
    tl:{gender:'Kasarian',year:'Taon ng kapanganakan',month:'Buwan ng kapanganakan',day:'Araw ng kapanganakan',time:'Oras ng kapanganakan',calendar:'Uri ng kalendaryo',tier:'Guardian tier',wishType:'Wish category'},
    vi:{gender:'Giới tính',year:'Năm sinh',month:'Tháng sinh',day:'Ngày sinh',time:'Giờ sinh',calendar:'Loại lịch',tier:'Hạng Guardian',wishType:'Nhóm điều ước'},
    zh:{gender:'性别',year:'出生年份',month:'出生月份',day:'出生日期',time:'出生时间',calendar:'历法类型',tier:'Guardian 等级',wishType:'愿望类别'}
  }[lang];
  if(!L)return;
  const ids={gender:'gender',birthYear:'year',birthMonth:'month',birthDay:'day',birthTime:'time',calendarType:'calendar',guardianTier:'tier',guardianWishType:'wishType'};
  for(const [id,key] of Object.entries(ids)){
    const el=document.getElementById(id);
    if(el&&!el.getAttribute('aria-labelledby'))el.setAttribute('aria-label',L[key]);
  }
})();
