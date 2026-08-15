import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const must=(p,needles)=>{const t=read(p);for(const n of needles){if(!t.includes(n))throw new Error(`${p}: missing required D1 schema evidence: ${n}`)}return t};
const exists=p=>{if(!fs.existsSync(p))throw new Error(`missing migration: ${p}`)};

const requiredFiles=[
  'migrations/0001_guardian_orders.sql',
  'migrations/0003_guardian_gifting.sql',
  'migrations/0006_guardian_payment_audit.sql',
  'migrations/0007_guardian_edition_slots.sql',
  'migrations/0008_guardian_checkout_sessions.sql',
  'migrations/0009_guardian_payment_lifecycle.sql',
  'migrations/0010_guardian_checkout_lifecycle.sql',
  'migrations/0010_guardian_policy_acceptance.sql',
  'migrations/0011_guardian_e2e_runs.sql',
  'migrations/0013_payment_reference_integrity.sql',
  'migrations/0014_payment_incidents.sql',
  'migrations/0015_payment_control.sql',
  'migrations/0016_guardian_personalization.sql',
  'migrations/BOOTSTRAP_V1_NEW_D1.sql',
  'CLOUDFLARE_D1_PREFLIGHT.md'
];
for(const p of requiredFiles) exists(p);

must('migrations/0001_guardian_orders.sql',['guardian_orders']);
must('migrations/0003_guardian_gifting.sql',['guardian_orders']);
must('migrations/0006_guardian_payment_audit.sql',['guardian_payment_events','payment_provider','payment_event_id']);
must('migrations/0007_guardian_edition_slots.sql',['guardian_edition_slots']);
must('migrations/0008_guardian_checkout_sessions.sql',['guardian_checkout_sessions']);
must('migrations/0009_guardian_payment_lifecycle.sql',['guardian_refund_jobs','refund_status','fulfillment_status']);
must('migrations/0010_guardian_checkout_lifecycle.sql',['guardian_checkout_sessions']);
must('migrations/0010_guardian_policy_acceptance.sql',['guardian_orders']);
must('migrations/0011_guardian_e2e_runs.sql',['guardian_e2e_runs']);
must('migrations/0013_payment_reference_integrity.sql',['uq_guardian_payment_success_provider_reference','guardian_payment_events','guardian_orders']);
must('migrations/0014_payment_incidents.sql',['guardian_payment_incidents']);
must('migrations/0015_payment_control.sql',['guardian_payment_control','guardian_payment_control_audit',"VALUES('checkout','open'"]);
must('migrations/0016_guardian_personalization.sql',['guardian_element','guardian_design_key','personalization_source']);

const bootstrap=must('migrations/BOOTSTRAP_V1_NEW_D1.sql',[
  'guardian_orders','payment_reference','verification_token','giver_name','recipient_name','gift_message','guardian_element','guardian_design_key','personalization_source',
  'guardian_editions','guardian_edition_slots','guardian_checkout_sessions','policy_version','policy_accepted_at',
  'guardian_payment_events','uq_guardian_payment_success_provider_reference','guardian_refund_jobs','guardian_payment_incidents',
  'guardian_payment_control','guardian_payment_control_audit','guardian_e2e_runs','guardian_stories','guardian_physical_fulfillment',
  "VALUES('checkout','hold'"
]);
if(/VALUES\('checkout','open'/i.test(bootstrap))throw new Error('BOOTSTRAP_V1_NEW_D1.sql must fail closed with initial checkout hold state');

must('CLOUDFLARE_D1_PREFLIGHT.md',['GUARDIAN_DB','Production D1','Fail closed','BOOTSTRAP_V1_NEW_D1.sql','Do not treat lexical replay']);

console.log('Guardian D1 schema audit passed: historical migration evidence is present, canonical V1 bootstrap is fail-closed and complete, and Production D1 still requires read-only manual verification.');
