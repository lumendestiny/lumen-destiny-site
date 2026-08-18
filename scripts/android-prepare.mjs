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

// Android packaged-site navigation fix.
// IMPORTANT: no navbar screenshots/images and no Android-only menu artwork are injected.
// The app keeps the website's real HTML/CSS navbar. We only guarantee the missing menu
// entries exist, map directory routes to bundled index.html files, and keep the Guardian
// selected-tab state visually consistent with the website (background + underline).
const androidRouteFixScript = `<script id="android-bundled-route-fix">(()=>{
  const directoryRoutes=new Set([
    '/compatibility',
    '/compatibility-result',
    '/connection-map',
    '/guardian',
    '/guardian-order',
    '/guardian-gift',
    '/guardian-campaigns',
    '/guardian-gallery',
    '/guardian-physical-status',
    '/guardian-verify',
    '/guardian-story',
    '/login'
  ]);

  const normalizePath=p=>{
    let out=String(p||'/');
    if(out.endsWith('/index.html'))out=out.slice(0,-11);
    else if(out.endsWith('.html'))out=out.slice(0,-5);
    if(out.length>1&&out.endsWith('/'))out=out.slice(0,-1);
    return out||'/';
  };

  const explicitBundledHref=raw=>{
    if(!raw)return null;
    if(raw==='#compatibility')return '/compatibility/index.html';
    if(raw==='#connection-map')return '/connection-map/index.html';
    if(raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return null;
    let u;
    try{u=new URL(raw,location.href)}catch{return null}
    if(u.origin!==location.origin)return null;
    const normalized=normalizePath(u.pathname);
    if(!directoryRoutes.has(normalized))return null;
    return normalized+'/index.html'+u.search+u.hash;
  };

  const labels={
    ko:{connection:'인연지도',guardian:'가디언',login:'로그인'},
    en:{connection:'Connection Map',guardian:'Guardian',login:'Login'},
    ja:{connection:'ご縁マップ',guardian:'ガーディアン',login:'ログイン'},
    tl:{connection:'Connection Map',guardian:'Guardian',login:'Login'},
    vi:{connection:'Bản đồ quan hệ',guardian:'Guardian',login:'Đăng nhập'},
    zh:{connection:'缘分地图',guardian:'Guardian',login:'登录'}
  };

  const currentLang=()=>{
    let value=String(localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
    if(value.startsWith('zh'))return 'zh';
    if(value.startsWith('ja'))return 'ja';
    if(value.startsWith('vi'))return 'vi';
    if(value.startsWith('tl')||value.startsWith('fil'))return 'tl';
    if(value.startsWith('en'))return 'en';
    return 'ko';
  };

  const ensureHomeNavbar=()=>{
    const path=normalizePath(location.pathname);
    if(path!=='/')return;
    const nav=document.querySelector('.main-fortune-nav');
    if(!nav)return;
    const t=labels[currentLang()]||labels.ko;
    const ensure=(match,href,text)=>{
      let a=[...nav.querySelectorAll('a[href]')].find(el=>String(el.getAttribute('href')||'').includes(match));
      if(!a){
        a=document.createElement('a');
        nav.appendChild(a);
      }
      a.href=href;
      a.textContent=text;
      return a;
    };
    ensure('connection-map','/connection-map/index.html',t.connection);
    ensure('guardian','/guardian/index.html',t.guardian);
    ensure('login','/login/index.html',t.login);
    nav.scrollLeft=0;
  };

  const guardianTabState=()=>{
    const path=normalizePath(location.pathname);
    if(!path.startsWith('/guardian'))return;
    const nav=document.querySelector('.main-fortune-nav');
    if(!nav)return;
    const archive=path==='/guardian'&&location.hash==='#purpose-guardians';
    nav.querySelectorAll('a[href]').forEach(a=>{
      let u;
      try{u=new URL(a.getAttribute('href')||'',location.href)}catch{return}
      const target=normalizePath(u.pathname);
      const targetArchive=target==='/guardian'&&u.hash==='#purpose-guardians';
      const active=targetArchive?archive:(!archive&&target===path);
      a.classList.toggle('active',active);
      if(active){
        a.setAttribute('aria-current','page');
        a.style.background='#f3f0ff';
        a.style.color='#3f2fc3';
        a.style.borderBottom='4px solid #4b38d2';
      }else{
        a.removeAttribute('aria-current');
        a.style.removeProperty('background');
        a.style.removeProperty('color');
        a.style.removeProperty('border-bottom');
      }
    });
  };

  const rewriteAnchors=root=>{
    (root||document).querySelectorAll('a[href]').forEach(a=>{
      const next=explicitBundledHref(a.getAttribute('href'));
      if(next)a.setAttribute('href',next);
    });
  };

  const refresh=()=>{
    ensureHomeNavbar();
    rewriteAnchors(document);
    guardianTabState();
  };

  window.addEventListener('DOMContentLoaded',()=>{
    refresh();
    setTimeout(refresh,0);
    setTimeout(refresh,250);
    setTimeout(refresh,800);
  });
  window.addEventListener('hashchange',()=>setTimeout(guardianTabState,0));

  document.addEventListener('click',e=>{
    const a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
    if(!a)return;
    const next=explicitBundledHref(a.getAttribute('href'));
    if(!next)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.assign(next);
  },true);
})();</script>`;

function patchHtml(filePath){
  if(!fs.existsSync(filePath))return;
  let html=fs.readFileSync(filePath,'utf8');
  html=html.replace(/<style id="android-nav-hotfix">[\s\S]*?<\/style>\s*/g,'');
  html=html.replace(/<script id="android-nav-hotfix-script">[\s\S]*?<\/script>\s*/g,'');
  html=html.replace(/<script id="android-bundled-route-fix">[\s\S]*?<\/script>\s*/g,'');
  html=html.replace('</body>',androidRouteFixScript+'\n</body>');
  fs.writeFileSync(filePath,html);
}

function patchAllHtml(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())patchAllHtml(full);
    else if(entry.isFile()&&entry.name.endsWith('.html'))patchHtml(full);
  }
}
patchAllHtml(webDir);

const config = {
  appId,
  appName: 'Lumen Destiny',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
    captureInput: true
  }
};
fs.writeFileSync(path.join(root, 'capacitor.config.json'), JSON.stringify(config, null, 2) + '\n');
console.log(`Prepared Capacitor web assets for ${appId} with website navbar, complete Android routes, and Guardian active-tab state`);
