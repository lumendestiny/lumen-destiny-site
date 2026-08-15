import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skip = new Set(['node_modules', '.git']);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (/\.(css|html|js)$/i.test(entry.name)) files.push(filePath);
  }
}

walk(root);

const issues = [];
const add = (file, line, kind, text) =>
  issues.push({
    file: path.relative(root, file),
    line,
    kind,
    text: text.trim().slice(0, 180),
  });

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const source = lines[i];

    // Match an actual CSS `width:` declaration, but never `min-width:` or `max-width:`.
    // Fixed elements wider than the smallest supported 320px viewport are blockers.
    const widthPattern = /(^|[;{\s])width\s*:\s*(\d+)px/gi;
    let widthMatch;
    while ((widthMatch = widthPattern.exec(source)) !== null) {
      const widthPx = Number(widthMatch[2]);
      if (widthPx > 320) add(file, i + 1, 'fixed-wide-width', source);
      else if (widthPx >= 240) add(file, i + 1, 'fixed-width-review', source);
    }

    if (/min-width\s*:\s*\d{3,}px/i.test(source)) {
      add(file, i + 1, 'large-min-width', source);
    }

    if (/(^|[;{\s])width\s*:\s*100vw/i.test(source)) {
      add(file, i + 1, '100vw-overflow-risk', source);
    }

    if (/position\s*:\s*fixed/i.test(source) && !/mobile-audit-ok/i.test(source)) {
      add(file, i + 1, 'fixed-position-review', source);
    }

    if (/white-space\s*:\s*nowrap/i.test(source) && !/overflow-x\s*:\s*auto/i.test(source)) {
      add(file, i + 1, 'nowrap-review', source);
    }

    if (i === 0 && /<!doctype html/i.test(source)) {
      const whole = lines.join('\n');
      if (!/<meta[^>]+name=["']viewport["']/i.test(whole)) {
        add(file, 1, 'missing-viewport', 'HTML page has no viewport meta tag');
      }
    }
  }
}

const blockingKinds = new Set([
  'fixed-wide-width',
  '100vw-overflow-risk',
  'missing-viewport',
]);
const blocking = issues.filter((issue) => blockingKinds.has(issue.kind));

console.log(`Mobile UX audit: ${issues.length} review item(s), ${blocking.length} blocker(s)`);
for (const issue of issues) {
  console.log(
    `${blocking.includes(issue) ? 'BLOCK' : 'REVIEW'} ${issue.file}:${issue.line} [${issue.kind}] ${issue.text}`,
  );
}

if (blocking.length) {
  console.error(
    '\nMobile UX audit failed. Replace fixed widths wider than 320px/100vw or add viewport meta. Review fixed/sticky elements manually at 320/360/390/430px.',
  );
  process.exit(1);
}
