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

// Android-only closed-test hotfix.
// 1) Keep Compatibility / Connection Map / Guardian visible on the mobile home navigation.
// 2) Do not depend on a hash-only route for the Guardian archive; use ?view=archive.
const androidHotfixStyle = `<style id="android-nav-hotfix">
@media (max-width:780px){
  .main-fortune-nav{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;overflow:visible!important}
  .main-fortune-nav a:nth-child(n+7){display:flex!important}
  .main-fortune-nav a:nth-child(3n){border-right:0!important}
  .main-fortune-nav a:nth-child(n+4):nth-child(-n+6){border-bottom:1px solid #ebe9f1!important}
  .main-fortune-nav a:nth-child(n+7){border-bottom:0!important}
}
body.guardian-archive-view .archive-hero{display:none!important}
body.guardian-archive-view #purpose-guardians{display:flex!important;min-height:calc(100vh - 80px)!important;margin:0!important;padding-top:14px!important;justify-content:flex-start!important;background:#f7f8fb!important}
body.guardian-archive-view .main-fortune-nav a[data-android-archive-link="1"]{background:#f3f0ff!important;color:#3f2fc3!important;position:relative!important}
body.guardian-archive-view .main-fortune-nav a[data-android-archive-link="1"]:after{content:""!important;position:absolute!important;left:14px!important;right:14px!important;bottom:0!important;height:3px!important;background:#4b38d2!important}
</style>`;

const androidHotfixScript = `<script id="android-nav-hotfix-script">(()=>{
  const normalize=p=>String(p||'').replace(/\\/index\\.html$/,'/').replace(/\\.html$/,'').replace(/\\/$/,'')||'/';
  const lang=String(localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase().split('-')[0];
  const archiveUrl='/guardian/?view=archive&lang='+encodeURIComponent(lang);
  const onHome=normalize(location.pathname)==='/';
  const onGuardian=normalize(location.pathname)==='/guardian';

  if(onHome){
    document.querySelectorAll('a[href*="/guardian/"][href*="purpose-guardians"],a[href*="/guardian"][href*="purpose-guardians"]').forEach(a=>a.setAttribute('href',archiveUrl));
    const nav=document.querySelector('.main-fortune-nav');
    if(nav){
      const ensure=(needle,href,text,cls='')=>{
        let a=[...nav.querySelectorAll('a')].find(x=>(x.getAttribute('href')||'').includes(needle));
        if(!a){a=document.createElement('a');a.href=href;if(cls)a.className=cls;nav.appendChild(a)}
        if(!String(a.textContent||'').trim())a.textContent=text;
        return a;
      };
      ensure('compatibility','/compatibility/','궁합');
      ensure('connection-map','/connection-map/','인연지도');
      ensure('guardian','/guardian/','가디언','guardian-nav-link');
    }
  }

  if(onGuardian){
    const nav=document.querySelector('.main-fortune-nav');
    if(nav){
      [...nav.querySelectorAll('a')].forEach(a=>{
        const href=a.getAttribute('href')||'';
        if(href.includes('purpose-guardians')||/부적 아카이브|Talisman Archive|护符档案|お守りアーカイブ|Kho bùa hộ mệnh/i.test(a.textContent||'')){
          a.dataset.androidArchiveLink='1';
          a.setAttribute('href',archiveUrl);
          a.addEventListener('click',e=>{e.preventDefault();location.assign(archiveUrl)});
        }
      });
    }
    const params=new URLSearchParams(location.search);
    if(params.get('view')==='archive'||location.hash==='#purpose-guardians'){
      document.body.classList.add('guardian-archive-view');
      if(location.hash==='#purpose-guardians')history.replaceState(null,'',archiveUrl);
      const section=document.getElementById('purpose-guardians');
      if(section)requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
      if(nav){
        nav.querySelectorAll('a').forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current')});
        const archive=nav.querySelector('a[data-android-archive-link="1"]');
        if(archive){archive.classList.add('active');archive.setAttribute('aria-current','page')}
      }
    }
  }
})();</script>`;

function patchHtml(filePath){
  if(!fs.existsSync(filePath))return;
  let html=fs.readFileSync(filePath,'utf8');
  if(!html.includes('android-nav-hotfix')){
    html=html.replace('</head>',androidHotfixStyle+'\n</head>');
    html=html.replace('</body>',androidHotfixScript+'\n</body>');
    fs.writeFileSync(filePath,html);
  }
}
patchHtml(path.join(webDir,'index.html'));
patchHtml(path.join(webDir,'guardian','index.html'));

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
console.log(`Prepared Capacitor web assets for ${appId} with Android navigation hotfix`);
