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
// Preserve the website's original navbar markup and styling. The only Android-specific
// behavior here is resolving app navigation to files that physically exist in the AAB.
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

    // On the website these two header links are same-page anchors. Inside the packaged
    // Android app they must open their actual service pages instead of returning to/scrolling
    // the home document.
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

  const rewriteAnchors=root=>{
    (root||document).querySelectorAll('a[href]').forEach(a=>{
      const next=explicitBundledHref(a.getAttribute('href'));
      if(next)a.setAttribute('href',next);
    });
  };

  // Site scripts are deferred and may rewrite the links once. Run after they finish too.
  window.addEventListener('DOMContentLoaded',()=>{
    rewriteAnchors(document);
    setTimeout(()=>rewriteAnchors(document),0);
    setTimeout(()=>rewriteAnchors(document),250);
  });

  // Capture first so older navigation handlers cannot send a packaged route back to '/'.
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
  if(!html.includes('android-bundled-route-fix')){
    html=html.replace('</body>',androidRouteFixScript+'\n</body>');
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
