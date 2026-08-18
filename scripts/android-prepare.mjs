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
// Keep the exact website navbar/visual structure. Do not inject Android-only menu items,
// icons, grid rules, or active-state styling. Only translate directory routes to explicit
// bundled index.html files so Capacitor does not fall back to the home page.
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
    let out=String(p||'/').replace(/\\/index\\.html$/,'').replace(/\\.html$/,'');
    if(out.length>1)out=out.replace(/\\/$/,'');
    return out||'/';
  };

  const explicitBundledHref=raw=>{
    if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return null;
    let u;
    try{u=new URL(raw,location.href)}catch{return null}
    if(u.origin!==location.origin)return null;
    const normalized=normalizePath(u.pathname);
    if(!directoryRoutes.has(normalized))return null;
    return normalized+'/index.html'+u.search+u.hash;
  };

  const rewriteAnchors=root=>{
    (root||document).querySelectorAll('a[href]').forEach(a=>{
      const next=explicitBundledHref(a.getAttribute('href'));
      if(next)a.setAttribute('href',next);
    });
  };

  // Run after the site's deferred navigation/i18n scripts have finished their DOM updates.
  window.addEventListener('DOMContentLoaded',()=>{
    rewriteAnchors(document);
    setTimeout(()=>rewriteAnchors(document),0);
    setTimeout(()=>rewriteAnchors(document),250);
  });

  // Capture navigation before any older page script can normalize a directory route back
  // to a path that Capacitor serves as the home page.
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
  // Remove the previous Android-only visual/navigation hotfix if present in generated assets.
  html=html.replace(/<style id="android-nav-hotfix">[\\s\\S]*?<\\/style>\\s*/g,'');
  html=html.replace(/<script id="android-nav-hotfix-script">[\\s\\S]*?<\\/script>\\s*/g,'');
  if(!html.includes('android-bundled-route-fix')){
    html=html.replace('</body>',androidRouteFixScript+'\\n</body>');
  }
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
console.log(`Prepared Capacitor web assets for ${appId} with explicit bundled routes and original website navbar`);
