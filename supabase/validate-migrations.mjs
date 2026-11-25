import { readdir, readFile } from 'node:fs/promises';

const directory = 'supabase/migrations';
const ledger = JSON.parse(await readFile('supabase/migration-ledger.json', 'utf8'));
const applied = new Map(ledger.applied_migrations.map((item) => [item.version, item.name]));
const files = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
const errors = [];
const seen = new Set();

for (const file of files) {
  const match = /^(\d{14})_([a-z0-9_]+)\.sql$/.exec(file);
  if (!match) {
    errors.push(`Invalid migration filename: ${file}`);
    continue;
  }
  const [, version, name] = match;
  if (seen.has(version)) errors.push(`Duplicate migration version: ${version}`);
  seen.add(version);
  const appliedName = applied.get(version);
  if (!appliedName) errors.push(`Migration is not recorded in the live ledger: ${file}`);
  else if (appliedName !== name) {
    errors.push(`Migration name mismatch for ${version}: file=${name}, live=${appliedName}`);
  }
}

const missing = ledger.applied_migrations.filter((item) => !seen.has(item.version));
console.log(`Validated ${files.length} local migrations against ${ledger.applied_migrations.length} live ledger entries.`);
console.log(`${missing.length} historical applied migrations have no source file; see supabase/MIGRATION_DRIFT.md.`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
}
