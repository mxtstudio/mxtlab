import { readdir, readFile } from 'node:fs/promises';

const directory = 'supabase/migrations';
const ledger = JSON.parse(await readFile('supabase/migration-ledger.json', 'utf8'));
const pendingLedger = JSON.parse(await readFile('supabase/pending-migrations.json', 'utf8'));
const files = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
const errors = [];
const seenFiles = new Set();
const applied = new Map();
const pending = new Map();

if (!Array.isArray(ledger.applied_migrations)) {
  throw new Error('migration-ledger.json must contain an applied_migrations array');
}
if (!Array.isArray(pendingLedger.pending_migrations)) {
  throw new Error('pending-migrations.json must contain a pending_migrations array');
}

for (const item of ledger.applied_migrations) {
  if (!/^\\d{14}$/.test(item.version || '') || !/^[a-z0-9_]+$/.test(item.name || '')) {
    errors.push(`Invalid applied migration ledger entry: ${JSON.stringify(item)}`);
    continue;
  }
  if (applied.has(item.version)) errors.push(`Duplicate applied migration version: ${item.version}`);
  applied.set(item.version, item.name);
}

for (const item of pendingLedger.pending_migrations) {
  if (!/^\\d{14}$/.test(item.version || '') || !/^[a-z0-9_]+$/.test(item.name || '')) {
    errors.push(`Invalid pending migration entry: ${JSON.stringify(item)}`);
    continue;
  }
  if (pending.has(item.version)) errors.push(`Duplicate pending migration version: ${item.version}`);
  if (applied.has(item.version)) errors.push(`Migration cannot be both applied and pending: ${item.version}`);
  pending.set(item.version, item.name);
}

for (const file of files) {
  const match = /^(\\d{14})_([a-z0-9_]+)\\.sql$/.exec(file);
  if (!match) {
    errors.push(`Invalid migration filename: ${file}`);
    continue;
  }

  const [, version, name] = match;
  if (seenFiles.has(version)) errors.push(`Duplicate migration file version: ${version}`);
  seenFiles.add(version);

  const appliedName = applied.get(version);
  const pendingName = pending.get(version);

  if (appliedName) {
    if (appliedName !== name) {
      errors.push(`Applied migration name mismatch for ${version}: file=${name}, ledger=${appliedName}`);
    }
    if (pendingName) errors.push(`Applied migration is incorrectly listed as pending: ${file}`);
  } else if (pendingName) {
    if (pendingName !== name) {
      errors.push(`Pending migration name mismatch for ${version}: file=${name}, manifest=${pendingName}`);
    }
  } else {
    errors.push(`Migration is neither recorded as applied nor explicitly pending: ${file}`);
  }
}

for (const [version, name] of pending) {
  if (!seenFiles.has(version)) errors.push(`Pending migration has no matching SQL file: ${version}_${name}.sql`);
}

const missing = ledger.applied_migrations.filter((item) => !seenFiles.has(item.version));
console.log(`Validated ${files.length} local migration files: ${applied.size} applied-ledger entries and ${pending.size} explicitly pending migrations.`);
console.log(`${missing.length} historical applied migrations have no source file; see supabase/MIGRATION_DRIFT.md.`);
console.log('Pending migrations are review-only and are not applied by this validation step.');

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
}
