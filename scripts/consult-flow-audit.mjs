import fs from 'node:fs';
const checks=[
['result.html','result-consult-context.js'],
['result.html','result-consult-link.js'],
['result-consult-context.js','lumen-consult-chart'],
['result-consult-link.js','/consult/?'],
['compatibility.js','lumen-compat-consult'],
['compatibility.js','topic=relationship&from=compatibility'],
['consult.js','lumen-consult-chart'],
['consult.js','lumen-compat-consult'],
['consult.js','compatibility:compatContext'],
['consult.js','/guardian-order/?wishType='],
['functions/api/consult.js','safeCompatibility'],
['functions/api/consult.js','compatibility:safeCompatibility(c.compatibility)'],
['functions/api/consult.js','stored:false'],
['functions/api/consult.js','LUMEN_AI_ENABLED'],
['functions/api/consult.js','OPENAI_API_KEY'],
['functions/api/health.js','consult:aiEnabled&&aiProviderReady']
];
let failed=false;for(const[file,needle]of checks){if(!fs.existsSync(file)){console.error(`MISSING FILE: ${file}`);failed=true;continue}const text=fs.readFileSync(file,'utf8');if(!text.includes(needle)){console.error(`MISSING CONTRACT: ${file} -> ${needle}`);failed=true}else console.log(`OK: ${file} -> ${needle}`)}if(failed)process.exit(1);console.log('AI consultation flow audit passed.');
