import fs from 'node:fs';
import path from 'node:path';

const appId = (process.env.LUMEN_ANDROID_APP_ID || '').trim();
if (!appId) {
  console.error('\nLUMEN_ANDROID_APP_ID is required. Use the exact package name already registered in Google Play Console.\n');
  process.exit(2);
}
if (!/^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$/.test(appId)) {
  console.error(`Invalid Android application ID: ${appId}`);
  process.exit(2);
}

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
console.log(`Prepared Capacitor web assets for ${appId}`);
