import fs from 'node:fs';

const js=fs.readFileSync('compatibility.js','utf8');
const html=fs.readFileSync('compatibility/index.html','utf8');
const result=fs.readFileSync('compatibility-result/index.html','utf8');

const need=(text,needle,label)=>{if(!text.includes(needle))throw new Error(`${label}: missing ${needle}`)};

need(js,"calculateSaju,lunarToSolar",'compatibility.js');
need(js,"return calculateSaju(y,m,day,h||0,min||0",'compatibility.js');
need(js,"lunarToSolar(y,m,day",'compatibility.js');
need(js,"yearPillar",'compatibility.js');
need(js,"monthPillar",'compatibility.js');
need(js,"dayPillar",'compatibility.js');
need(js,"hourPillar",'compatibility.js');
need(js,"q.get(prefix+'Birth')",'compatibility.js');
need(js,"q.get(prefix+'Calendar')==='lunar'",'compatibility.js');

if(/calculateSaju\s*\(\s*\{/.test(js)) throw new Error('compatibility.js: object-form calculateSaju call reintroduced; this caused Year [object Object] runtime failure');
if(js.includes("el.textContent=L.error+' '+(e.message||'')")) throw new Error('compatibility.js: raw library error text must not be exposed to users');

for(const token of ['aBirth','bBirth','aCalendar','bCalendar','aLeap','bLeap','lang']) need(html,token,'compatibility/index.html');
need(result,'compatibility.js','compatibility-result/index.html');
need(result,'compatError','compatibility-result/index.html');
need(result,'compatContent','compatibility-result/index.html');

console.log('Compatibility release audit passed: supported manseryeok call shape, lunar conversion, four-pillar extraction and user-safe error path are locked.');
