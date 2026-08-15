import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';

const repo=process.cwd();
const bootstrap=path.join(repo,'migrations','BOOTSTRAP_V1_NEW_D1.sql');
if(!fs.existsSync(bootstrap))throw new Error('Missing migrations/BOOTSTRAP_V1_NEW_D1.sql');

const db=new DatabaseSync(':memory:');
try{
  const bootstrapSql=fs.readFileSync(bootstrap,'utf8');
  try{db.exec(bootstrapSql)}catch(error){throw new Error(`BOOTSTRAP_V1_NEW_D1.sql: ${error.message}`)}

  const rows=db.prepare("SELECT type,name,sql FROM sqlite_schema WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND type IN ('table','index') ORDER BY type,name").all();
  if(!rows.length)throw new Error('Canonical V1 bootstrap produced no schema rows');
  const dump=rows.map(row=>String(row.sql).trim().replace(/;?$/,';')).join('\n')+'\n';
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'lumen-d1-validator-'));
  const file=path.join(dir,'synthetic-current-schema.sql');
  fs.writeFileSync(file,dump,'utf8');

  const result=spawnSync(process.execPath,['scripts/d1-export-validate.mjs',file],{cwd:repo,encoding:'utf8'});
  process.stdout.write(result.stdout||'');
  process.stderr.write(result.stderr||'');
  if(result.status!==0)throw new Error(`validator exited with ${result.status}`);

  const inRepo=path.join(repo,'.d1-validator-safety-fixture.sql');
  fs.writeFileSync(inRepo,dump,'utf8');
  try{
    const unsafe=spawnSync(process.execPath,['scripts/d1-export-validate.mjs',inRepo],{cwd:repo,encoding:'utf8'});
    if(unsafe.status===0)throw new Error('validator accepted a backup path inside the public repository');
    if(!String(unsafe.stderr||'').includes('inside the Git repository'))throw new Error('in-repo safety rejection did not use the expected guard');
  }finally{try{fs.unlinkSync(inRepo)}catch{}}

  console.log(`D1 export validator self-test passed against the canonical V1 bootstrap (${rows.length} schema objects), including the in-repository backup safety guard.`);
}finally{db.close()}
