# Supabase migration history reconciliation

## Live project snapshot

- Project: `MXTLAB PROJECT`
- Snapshot date: 26 November 2026
- Applied migrations in the live ledger: **105**
- Active migration files after reconciliation: **17**
- Historical migration SQL files still missing from the repository: **89**

The live database is operating with the current schema. This is a source-control reproducibility issue, not a claim that live objects are missing.

## What was corrected

- Four historical files now use their exact remote ledger versions.
- Thirteen November 2026 security/performance migrations now use their exact applied versions.
- `20261031000000_curriculum_and_progress.sql` is archived because its version is absent from the live ledger and it overlaps curriculum/progress objects represented by the later roster-model migration.
- `migration-ledger.json` records the live version/name pairs.
- `validate-migrations.mjs` and CI fail if an active migration filename is missing from or mismatched with the applied live ledger.
- Department resource uploads are private, limited to 10 MB and approved document/image types, scoped to department staff and uploader folders. A temporary legacy-path policy preserves compatibility until the matching frontend is released.
- Account-linked lesson/practice progress is visible to a teacher only when the student is explicitly linked to that teacher, not merely because both accounts belong to the same school.
- Client roles no longer have TRUNCATE/REFERENCES/TRIGGER privileges. Anonymous users are read-only on the public lesson/store catalogue; unused anonymous completion and internal curriculum/token/rate-limit tables are no longer directly exposed.
- Future public-schema tables, sequences and functions created by `postgres` no longer inherit client grants by default. New migrations must explicitly grant only the required access.

## Historical migration SQL still missing

- `20260703165739_init_profiles_and_lesson_progress_v2.sql`
- `20260703165911_harden_helper_functions_and_search_path.sql`
- `20260703170912_fix_admin_policy_recursion_via_helper.sql`
- `20260703170952_regrant_helper_execute_to_authenticated.sql`
- `20260703172755_add_schools_table_and_backfill_school_id.sql`
- `20260713231716_add_missing_fk_indexes.sql`
- `20260713231726_optimize_rls_auth_uid_calls.sql`
- `20260713232108_consolidate_permissive_policies.sql`
- `20260713232129_curriculum_pdfs_storage_policies.sql`
- `20260714124834_add_lessons_reference_and_streak_tracking.sql`
- `20260714124851_add_progress_reporting_view.sql`
- `20260715092029_create_mxt_store_schema.sql`
- `20260715233901_fix_performance_issues_from_progress_tracking.sql`
- `20260715234536_remove_unused_store_checkout_infrastructure.sql`
- `20260717123714_add_store_public_read_policies.sql`
- `20260717124405_tighten_connection_timeouts.sql`
- `20260717124627_add_edge_function_rate_limiting.sql`
- `20260717230200_teacher_os_pilot_agriculture_kerema.sql`
- `20260717231346_seed_lessons_table.sql`
- `20260718104258_department_resources_storage.sql`
- `20260718104352_increment_resource_downloads_fn.sql`
- `20260719052540_department_roles_table.sql`
- `20260719054756_restrict_teacher_os_to_staff_roles.sql`
- `20260719055252_science_department_subjects.sql`
- `20260719061517_curriculum_intelligence.sql`
- `20260719064705_hod_assign_department_members.sql`
- `20260719072519_fix_profiles_rls_infinite_recursion.sql`
- `20260720230519_security_hardening_search_path_and_grants.sql`
- `20260720230546_revoke_public_execute_on_staff_functions.sql`
- `20260720230738_revoke_anon_select_on_messaging_tables.sql`
- `20260721111200_add_self_service_school_claim.sql`
- `20260721122219_lesson_plan_status_notify_webhook.sql`
- `20260721122241_lock_down_notify_trigger_function.sql`
- `20260721141747_curriculum_units_full_detail.sql`
- `20260721142657_import_agriculture_curriculum_data.sql`
- `20260722015806_normalize_legacy_curriculum_rows.sql`
- `20260723144313_fix_rls_auth_initplan_perf.sql`
- `20260725002555_fix_profiles_insert_policy_for_google_signin.sql`
- `20260725061835_create_anon_lesson_completions.sql`
- `20260726174823_dashboard_entries_owner_update_delete.sql`
- `20260726174832_dashboard_entries_hod_department_select.sql`
- `20260727105033_simplify_notify_payload_for_make.sql`
- `20260730101201_add_results_and_api_tokens.sql`
- `20260731062956_districtos_initial_schema.sql`
- `20260731114953_districtos_schema_rebuild_authoritative.sql`
- `20260803075002_security_fixes_critical.sql`
- `20260803075017_seed_missing_lessons.sql`
- `20260803081446_link_results_to_lesson_plans.sql`
- `20260803154845_add_meeting_manager_and_program_of_work.sql`
- `20260803154946_add_student_tracker_attendance_behavior.sql`
- `20260804095340_create_teacher_requests.sql`
- `20260804095514_create_teacher_request_decision_function.sql`
- `20260804100009_create_notifications_and_wire_up_teacher_requests.sql`
- `20260804143745_create_department_health_scoring.sql`
- `20260804143855_schedule_department_health_snapshot.sql`
- `20260804144012_create_notices.sql`
- `20260808104935_create_lesson_notes.sql`
- `20260808105222_create_timetable_entries.sql`
- `20260808105305_create_saps.sql`
- `20260808105431_create_audit_logs.sql`
- `20260808105530_create_version_history.sql`
- `20260808105612_create_sessions.sql`
- `20260808105636_create_subscriptions.sql`
- `20260809044040_add_pdf_uploads_table.sql`
- `20260809044049_add_license_keys_table.sql`
- `20260809044058_add_profile_id_to_subscriptions.sql`
- `20260809044107_add_arch_checklist_progress_table.sql`
- `20260809044115_add_modelling_guided_practice_to_lesson_plans.sql`
- `20260813052559_self_serve_api_tokens_v2.sql`
- `20260813052615_add_generate_my_api_token.sql`
- `20261003050026_curriculum_knowledge_base.sql`
- `20261007215613_fix_dashboard_entries_hod_select_scope_bug.sql`
- `20261007215729_dashboard_entries_soft_delete_and_teacher_api_keys.sql`
- `20261021063845_wire_lesson_plan_versioning.sql`
- `20261021064102_wire_saps_versioning.sql`
- `20261028075512_add_api_key_management_functions.sql`
- `20261028075522_add_hod_visibility_to_version_history.sql`
- `20261028075545_add_session_anomaly_detection.sql`
- `20261028075607_drop_legacy_students_table.sql`
- `20261028080105_add_rate_limit_helper.sql`
- `20261028080127_add_lesson_plan_and_sap_approval_functions.sql`
- `20261028080225_sync_hod_sources_of_truth.sql`
- `20261028080320_fix_hod_sync_upgrade_path.sql`
- `20261028090711_teacher_student_links_and_assignable_accounts.sql`
- `20261030181527_lock_down_teacher_api_keys_grants.sql`
- `20261110093224_curriculum_and_progress_roster_model.sql`
- `20261110093232_profiles_select_students_only_when_linked.sql`
- `20261110093247_curriculum_progress_revoke_default_authenticated_grants.sql`
- `20261125170625_revoke_postgres_default_client_privileges.sql`

## Operational warning

Do **not** run `supabase db reset` or treat this repository as a reproducible clean-database baseline yet. The missing historical SQL must be recovered from the original source or a verified backup and tested against a fresh disposable Supabase project before a clean reset/bootstrap is safe.

Do not create empty placeholder migrations or guess historical SQL. For the live project, continue using forward-only migrations and commit each applied migration with its exact remote version and name.

## Required follow-up

Recover the missing historical migration files, reconstruct a verified baseline if originals cannot be recovered, then validate a clean local reset and a disposable-project migration replay.
