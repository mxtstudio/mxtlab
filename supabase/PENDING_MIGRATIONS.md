# Pending migration workflow

`migration-ledger.json` is a snapshot of migrations confirmed as applied to the live Supabase project. Do not add a candidate migration to that ledger before it has actually been applied and verified.

`pending-migrations.json` lists reviewed SQL candidates that exist in `migrations/` but have not yet been applied. The quality workflow validates each pending entry against its SQL filename, version, and name. Validation does not connect to Supabase, execute SQL, or change production data.

## Adding a migration

1. Create a uniquely versioned SQL file in `supabase/migrations/`.
2. Add the exact version and name to `pending-migrations.json`.
3. Review the SQL, security implications, rollback/recovery plan, and expected data impact.
4. Run CI. A passing check means the migration is structurally accounted for, not that it has been applied or approved for production.
5. Obtain explicit approval before applying it to any live environment.

## After an approved application

1. Verify the migration completed successfully in the intended Supabase project.
2. Update `migration-ledger.json` from the actual applied-migration history.
3. Remove that migration from `pending-migrations.json`.
4. Keep the SQL file as the source history and rerun CI.

Never apply a migration merely to make CI pass. Never rewrite an already-applied migration to change its historical behavior; create a new migration instead.
