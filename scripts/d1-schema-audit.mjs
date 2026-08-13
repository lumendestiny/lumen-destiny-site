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
must('CLOUDFLARE_D1_PREFLIGHT.md',['GUARDIAN_DB','Production D1','Fail closed']);

console.log('Guardian D1 schema audit passed. Repository migration evidence is present; Production D1 still requires manual verification.');
