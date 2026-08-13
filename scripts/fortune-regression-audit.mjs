import fs from 'node:fs';
const checks=[
 ['index.html','script.js'],['index.html','name="viewport"'],
 ['script.js','calendarType'],['script.js','isLeapMonth'],
 ['result.html','manse-result.js'],['result.html','result-i18n.js'],
 ['manse-result.js','calculateSaju'],['manse-result.js','zh'],
 ['compatibility/index.html','compatibility-form.css'],['compatibility/index.html','aBirth'],['compatibility/index.html','bBirth'],
 ['compatibility-result/index.html','compatibility.js'],
 ['compatibility.js','calculateSaju'],['compatibility.js',"lang.startsWith('zh')"],['compatibility.js','aBirth'],['compatibility.js','bBirth'],
 ['compatibility-i18n.js','zh'],['service-shell.js',"['ko','한국어'"],['service-shell.js',"['zh','简体中文'"]
];
let failed=false;
for(const [file,needle] of checks){
 if(!fs.existsSync(file)){console.error(`MISSING FILE: ${file}`);failed=true;continue}
 const text=fs.readFileSync(file,'utf8');
 if(!text.includes(needle)){console.error(`MISSING CONTRACT: ${file} -> ${needle}`);failed=true}else console.log(`OK: ${file} -> ${needle}`);
}
if(failed)process.exit(1);
console.log('Free saju + compatibility regression audit passed.');
