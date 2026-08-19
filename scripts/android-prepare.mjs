import fs from 'node:fs';
import path from 'node:path';

const appId = 'com.lumendestiny.app';

const root = process.cwd();
const webDir = path.join(root, 'www');
const excluded = new Set([
  '.git', '.github', 'node_modules', 'android', 'www', 'functions', 'migrations', 'scripts',
  'package.json', 'package-lock.json', 'capacitor.config.json'
]);

fs.rmSync(webDir, { recursive: true, force: true });
fs.mkdirSync(webDir, { recursive: true });

function copyTree(src, dst, relative = '') {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (!relative && excluded.has(entry.name)) continue;
    const source = path.join(src, entry.name);
    const target = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(target, { recursive: true });
      copyTree(source, target, path.join(relative, entry.name));
    } else if (entry.isFile()) {
      fs.copyFileSync(source, target);
    }
  }
}
copyTree(root, webDir);

// Android-only presentation polish. Keep the real website HTML and, importantly,
// keep the exact Guardian archive artwork that the website already renders.
const androidNavbarStyle = `<style id="android-home-navbar-text-only">
@media (max-width:780px){
  .site-header.fortune-header{padding:10px 14px!important;min-height:auto!important;align-items:center!important}
  .brand-language-stack{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;width:100%!important;flex-wrap:nowrap!important}
  .brand-language-stack .brand,.site-header .brand{display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin:0!important;padding:0!important;font-size:1.05rem!important;line-height:1.15!important;white-space:nowrap!important}
  .brand-language-stack .language-switcher{display:flex!important;flex-direction:row!important;align-items:center!important;gap:6px!important;margin:0!important;padding:0!important;flex-wrap:nowrap!important}
  .brand-language-stack .language-switcher .lang-choice{margin:0!important;flex:0 0 auto!important}
  .main-fortune-nav a::before,.main-fortune-nav a::after{content:none!important;display:none!important;background:none!important;background-image:none!important}
  .main-fortune-nav a img,.main-fortune-nav a svg,.main-fortune-nav a small,.main-fortune-nav a .nav-icon,.main-fortune-nav a .nav-subtitle,.main-fortune-nav a [class*="icon"],.main-fortune-nav a [class*="subtitle"],.main-fortune-nav a [class*="indicator"]{display:none!important}
  .main-fortune-nav a{background-image:none!important;box-shadow:none!important;outline:none!important;border-bottom:4px solid transparent!important;text-decoration:none!important}
  .main-fortune-nav a.active,.main-fortune-nav a[aria-current="page"]{border-bottom:4px solid #4b38d2!important;box-shadow:none!important;text-decoration:none!important}
  .main-fortune-nav a.active>*,.main-fortune-nav a[aria-current="page"]>*{border-bottom:0!important;box-shadow:none!important;text-decoration:none!important}
}
</style>`;

const androidRouteFixScript = `<script id="android-bundled-route-fix">(()=>{
  const directoryRoutes=new Set([
    '/compatibility','/compatibility-result','/connection-map','/guardian','/guardian-order',
    '/guardian-gift','/guardian-campaigns','/guardian-gallery','/guardian-physical-status',
    '/guardian-verify','/guardian-story','/login'
  ]);
  const normalizePath=p=>{let out=String(p||'/');if(out.endsWith('/index.html'))out=out.slice(0,-11);else if(out.endsWith('.html'))out=out.slice(0,-5);if(out.length>1&&out.endsWith('/'))out=out.slice(0,-1);return out||'/'};
  const explicitBundledHref=raw=>{if(!raw)return null;if(raw==='#compatibility')return '/compatibility/index.html';if(raw==='#connection-map')return '/connection-map/index.html';if(raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return null;let u;try{u=new URL(raw,location.href)}catch{return null}if(u.origin!==location.origin)return null;const normalized=normalizePath(u.pathname);if(!directoryRoutes.has(normalized))return null;return normalized+'/index.html'+u.search+u.hash};
  const labels={ko:{saju:'무료사주',wealth:'금전운',year:'신년운세',month:'월간운세',today:'오늘의 운세',compat:'궁합',connection:'인연지도',guardian:'가디언',login:'로그인'},en:{saju:'Free Saju',wealth:'Money',year:'Year',month:'Month',today:'Today',compat:'Compatibility',connection:'Connection Map',guardian:'Guardian',login:'Login'},ja:{saju:'無料四柱',wealth:'金運',year:'新年運',month:'月運',today:'今日の運勢',compat:'相性',connection:'ご縁マップ',guardian:'ガーディアン',login:'ログイン'},tl:{saju:'Free Saju',wealth:'Pera',year:'Taon',month:'Buwan',today:'Ngayon',compat:'Compatibility',connection:'Connection Map',guardian:'Guardian',login:'Login'},vi:{saju:'Tứ trụ miễn phí',wealth:'Tài vận',year:'Năm',month:'Tháng',today:'Hôm nay',compat:'Hợp tuổi',connection:'Bản đồ quan hệ',guardian:'Guardian',login:'Đăng nhập'},zh:{saju:'免费四柱',wealth:'财运',year:'新年运势',month:'月运',today:'今日运势',compat:'合婚',connection:'缘分地图',guardian:'Guardian',login:'登录'}};
  const currentLang=()=>{let value=String(localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();if(value.startsWith('zh'))return 'zh';if(value.startsWith('ja'))return 'ja';if(value.startsWith('vi'))return 'vi';if(value.startsWith('tl')||value.startsWith('fil'))return 'tl';if(value.startsWith('en'))return 'en';return 'ko'};
  const ensureHomeNavbar=()=>{if(normalizePath(location.pathname)!=='/')return;const nav=document.querySelector('.main-fortune-nav');if(!nav)return;const t=labels[currentLang()]||labels.ko;const wanted=[['analysis','#analysis',t.saju],['wealth','#wealth',t.wealth],['yearly','#yearly',t.year],['monthly','#monthly',t.month],['today','#today',t.today],['compatibility','/compatibility/index.html',t.compat],['connection-map','/connection-map/index.html',t.connection],['guardian','/guardian/index.html',t.guardian],['login','/login/index.html',t.login]];const existing=[...nav.querySelectorAll('a[href]')];const find=needle=>existing.find(a=>{const h=String(a.getAttribute('href')||'');return h.includes(needle)||(needle==='yearly'&&h==='#year')||(needle==='monthly'&&h==='#month')});const ordered=[];wanted.forEach(([needle,href,text])=>{let a=find(needle);if(!a)a=document.createElement('a');if(a.getAttribute('href')!==href)a.setAttribute('href',href);if(a.textContent.trim()!==text)a.textContent=text;ordered.push(a)});ordered.forEach(a=>nav.appendChild(a));nav.querySelectorAll('a[href]').forEach(a=>{if(!ordered.includes(a))a.remove()})};
  const stabilizeAndroidTextInputs=()=>{const name=document.querySelector('#userName');if(name){name.maxLength=20;name.setAttribute('maxlength','20');name.setAttribute('inputmode','text');name.setAttribute('autocomplete','name');name.style.webkitUserSelect='text';name.style.userSelect='text'}};
  const guardianTabState=()=>{const path=normalizePath(location.pathname);if(!path.startsWith('/guardian'))return;const nav=document.querySelector('.main-fortune-nav');if(!nav)return;const archive=path==='/guardian'&&location.hash==='#purpose-guardians';nav.querySelectorAll('a[href]').forEach(a=>{let u;try{u=new URL(a.getAttribute('href')||'',location.href)}catch{return}const target=normalizePath(u.pathname);const targetArchive=target==='/guardian'&&u.hash==='#purpose-guardians';const active=targetArchive?archive:(!archive&&target===path);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})};
  const rewriteAnchors=root=>{(root||document).querySelectorAll('a[href]').forEach(a=>{const next=explicitBundledHref(a.getAttribute('href'));if(next&&a.getAttribute('href')!==next)a.setAttribute('href',next)})};
  let refreshing=false;const refresh=()=>{if(refreshing)return;refreshing=true;ensureHomeNavbar();stabilizeAndroidTextInputs();rewriteAnchors(document);guardianTabState();refreshing=false};
  window.addEventListener('DOMContentLoaded',()=>{refresh();[0,100,300,700,1500,3000].forEach(ms=>setTimeout(refresh,ms));const nav=document.querySelector('.main-fortune-nav');if(nav){let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(refresh,30)}).observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['href','class']})}});
  window.addEventListener('hashchange',()=>setTimeout(refresh,0));
  document.addEventListener('click',e=>{const a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;const next=explicitBundledHref(a.getAttribute('href'));if(!next)return;e.preventDefault();e.stopImmediatePropagation();location.assign(next)},true);
})();</script>`;

function patchHtml(filePath){
  if(!fs.existsSync(filePath))return;
  let html=fs.readFileSync(filePath,'utf8');
  html=html.replace(/<style id="android-nav-hotfix">[\s\S]*?<\/style>\s*/g,'');
  html=html.replace(/<style id="android-home-navbar-text-only">[\s\S]*?<\/style>\s*/g,'');
  html=html.replace(/<script id="android-nav-hotfix-script">[\s\S]*?<\/script>\s*/g,'');
  html=html.replace(/<script id="android-bundled-route-fix">[\s\S]*?<\/script>\s*/g,'');
  html=html.replace('</head>',androidNavbarStyle+'\n</head>');
  html=html.replace('</body>',androidRouteFixScript+'\n</body>');
  fs.writeFileSync(filePath,html);
}
function patchAllHtml(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())patchAllHtml(full);else if(entry.isFile()&&entry.name.endsWith('.html'))patchHtml(full)}}
patchAllHtml(webDir);

const config={appId,appName:'Lumen Destiny',webDir:'www',bundledWebRuntime:false,android:{allowMixedContent:false,captureInput:false}};
fs.writeFileSync(path.join(root,'capacitor.config.json'),JSON.stringify(config,null,2)+'\n');
console.log(`Prepared Capacitor V10 assets with website-identical Guardian archive artwork for ${appId}`);
