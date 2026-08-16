import{getAuthConfig,getAuthClient,getSession,getUser,getAccessToken,signOut,onAuthStateChange,normalizeLang,safeNext}from'/auth-client.js?v=20260816-1';

const lang=normalizeLang(new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');
const L={
  ko:{login:'로그인',logout:'로그아웃',checking:'로그인 상태를 확인하고 있습니다…',need:'개인정보 보호를 위해 로그인이 필요한 서비스입니다.'},
  en:{login:'Sign in',logout:'Sign out',checking:'Checking your sign-in status…',need:'Sign-in is required to protect your personal data.'},
  ja:{login:'ログイン',logout:'ログアウト',checking:'ログイン状態を確認しています…',need:'個人情報保護のためログインが必要なサービスです。'},
  tl:{login:'Mag-sign in',logout:'Mag-sign out',checking:'Sinusuri ang sign-in status…',need:'Kailangang mag-sign in upang maprotektahan ang personal data.'},
  vi:{login:'Đăng nhập',logout:'Đăng xuất',checking:'Đang kiểm tra trạng thái đăng nhập…',need:'Cần đăng nhập để bảo vệ dữ liệu cá nhân.'},
  zh:{login:'登录',logout:'退出登录',checking:'正在检查登录状态…',need:'为保护个人信息，使用此服务需要登录。'}
}[lang];

const normPath=()=>location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
const protectedExact=new Set(['/connection-map','/guardian','/guardian-order','/guardian-gift','/guardian-gallery','/guardian-campaigns','/guardian-story','/guardian-physical-status','/guardian-shipping','/guardian-payment-result']);
const publicExceptions=new Set(['/guardian-verify']);
const isProtected=()=>{
  const p=normPath();
  if(publicExceptions.has(p))return false;
  if(protectedExact.has(p))return true;
  return p.startsWith('/connection-map/')||p.startsWith('/guardian-order/')||p.startsWith('/guardian-gift/')||p.startsWith('/guardian-gallery/')||p.startsWith('/guardian-campaigns/')||p.startsWith('/guardian-story/')||p.startsWith('/guardian-physical-status/');
};

function loginUrl(){
  const u=new URL('/login/',location.origin);
  u.searchParams.set('next',safeNext(location.pathname+location.search+location.hash));
  u.searchParams.set('lang',lang);
  return u.pathname+u.search;
}

function overlay(){
  if(document.getElementById('lumen-auth-gate'))return;
  const el=document.createElement('div');
  el.id='lumen-auth-gate';
  el.className='lumen-auth-gate';
  el.innerHTML=`<div class="lumen-auth-gate-card"><span class="lumen-auth-spinner" aria-hidden="true"></span><strong>${L.checking}</strong><p>${L.need}</p></div>`;
  document.body.appendChild(el);
}
function removeOverlay(){document.getElementById('lumen-auth-gate')?.remove()}

function remember(session){
  const user=session?.user;
  if(user?.id){
    localStorage.setItem('lumen-auth-user-id',user.id);
    if(user.email)localStorage.setItem('lumen-auth-user-email',user.email);
  }else{
    localStorage.removeItem('lumen-auth-user-id');
    localStorage.removeItem('lumen-auth-user-email');
  }
}

function renderNav(session){
  const nav=document.querySelector('.main-fortune-nav');
  if(!nav)return;
  let a=nav.querySelector('.lumen-auth-nav');
  if(!a){a=document.createElement('a');a.className='lumen-auth-nav';nav.appendChild(a)}
  if(session?.user){
    a.href='#logout';
    a.textContent=L.logout;
    a.onclick=async e=>{e.preventDefault();a.setAttribute('aria-busy','true');await signOut();location.href=`/?lang=${encodeURIComponent(lang)}`};
  }else{
    a.href=loginUrl();
    a.textContent=L.login;
    a.onclick=null;
  }
}

async function start(){
  const cfg=await getAuthConfig();
  if(cfg?.required&&isProtected())overlay();

  let session=null;
  try{session=await getSession()}catch{}
  remember(session);
  renderNav(session);

  window.LumenAuth={
    configured:!!cfg?.enabled,
    required:!!cfg?.required,
    getSession,getUser,getAccessToken,signOut,
    get user(){return session?.user||null}
  };
  window.dispatchEvent(new CustomEvent('lumen-auth-ready',{detail:{configured:!!cfg?.enabled,required:!!cfg?.required,user:session?.user||null}}));

  if(cfg?.required&&isProtected()&&!session?.user){
    const u=new URL('/login/',location.origin);
    u.searchParams.set('next',safeNext(location.pathname+location.search+location.hash));
    u.searchParams.set('lang',lang);
    u.searchParams.set('reason','protected');
    location.replace(u.toString());
    return;
  }
  removeOverlay();

  if(cfg?.enabled){
    onAuthStateChange((_event,nextSession)=>{
      session=nextSession||null;
      remember(session);
      renderNav(session);
      window.dispatchEvent(new CustomEvent('lumen-auth-change',{detail:{user:session?.user||null}}));
      if(cfg?.required&&isProtected()&&!session?.user)location.replace(loginUrl());
    }).catch(()=>{});
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
