import fs from 'node:fs';
import path from 'node:path';

const input=process.argv[2];
if(!input){
  console.error('Usage: node scripts/d1-export-validate.mjs /secure/path/lumen-d1-export.sql');
  process.exit(2);
}

const repo=path.resolve(process.cwd());
const file=path.resolve(input);
const relative=path.relative(repo,file);
if(relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..')){
  console.error('Refusing to validate a production-style backup stored inside the Git repository. Move the export to a secure path outside the repo first.');
  process.exit(2);
}
if(!fs.existsSync(file)||!fs.statSync(file).isFile()){
  console.error(`Backup file not found: ${file}`);
  process.exit(2);
}

const sql=fs.readFileSync(file,'utf8');
if(sql.length<100){
  console.error('Export is unexpectedly small; refusing to treat it as a valid D1 backup.');
  process.exit(1);
}

const migrationDir=path.join(repo,'migrations');
const migrations=fs.readdirSync(migrationDir).filter(x=>x.endsWith('.sql')).sort();
const expectedTables=new Set();
for(const name of migrations){
  const text=fs.readFileSync(path.join(migrationDir,name),'utf8');
  for(const m of text.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`\[]?([A-Za-z0-9_]+)["`\]]?/gi))expectedTables.add(m[1]);
}

const exportedTables=new Set();
for(const m of sql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`\[]?([A-Za-z0-9_]+)["`\]]?/gi))exportedTables.add(m[1]);

const missing=[...expectedTables].filter(t=>!exportedTables.has(t)).sort();
const critical={
  guardian_orders:['id','tier','price_usd','display_name','wish_type','payment_status','issuance_status','verification_token','giver_name','recipient_name','gift_message','edition_key','issuance_serial','refund_status','support_status','policy_version','policy_accepted_at','policy_lang'],
  guardian_stories:['id','guardian_id','story_text','display_name','shipping_name','shipping_phone','shipping_postal_code','shipping_address1','shipping_address2'],
  guardian_payment_events:['event_id','provider','event_type','guardian_id','payment_reference','amount_usd','currency','status','received_at'],
  guardian_checkout_sessions:['checkout_id','guardian_id','provider','amount_usd','currency','status','provider_session_id','created_at','expires_at','policy_version','policy_accepted_at'],
  guardian_refund_jobs:['refund_job_id','guardian_id','provider','payment_reference','amount_usd','currency','reason','status'],
  guardian_edition_slots:['edition_key','slot_no','order_id','reserved_at']
};

const normalized=sql.toLowerCase();
const missingColumns=[];
for(const [table,columns] of Object.entries(critical)){
  const tablePattern=new RegExp('create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?["`\\[]?'+table+'["`\\]]?\\s*\\(','i');
  const tableStart=normalized.search(tablePattern);
  if(tableStart<0)continue;
  const after=normalized.slice(tableStart);
  const end=after.indexOf(');');
  const schema=end>=0?after.slice(0,end+2):after.slice(0,12000);
  for(const column of columns){
    const columnPattern=new RegExp('(?:^|[\\s,("`\\[])'+column+'(?:[\\s,)"`\\]])','i');
    if(!columnPattern.test(schema))missingColumns.push(`${table}.${column}`);
  }
}

const statements=(sql.match(/;\s*(?:\r?\n|$)/g)||[]).length;
const insertTables=new Set();
for(const m of sql.matchAll(/INSERT\s+INTO\s+["`\[]?([A-Za-z0-9_]+)["`\]]?/gi))insertTables.add(m[1]);

console.log(JSON.stringify({
  file:path.basename(file),
  bytes:Buffer.byteLength(sql,'utf8'),
  migrationFiles:migrations.length,
  expectedTables:expectedTables.size,
  exportedTables:exportedTables.size,
  insertTableCount:insertTables.size,
  statementApproximation:statements,
  missingTables:missing,
  missingCriticalColumns:missingColumns
},null,2));

if(missing.length||missingColumns.length){
  console.error('D1 export validation FAILED. Do not treat this file as a complete recovery export.');
  process.exit(1);
}
console.log('D1 export structure validation PASSED. This proves expected schema coverage only; a non-production import/restore rehearsal is still required before the operational backup gate can pass.');
