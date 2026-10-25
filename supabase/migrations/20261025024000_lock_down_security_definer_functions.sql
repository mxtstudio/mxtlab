-- Applied to live project mqiwckclyohjdhjaoaor on 2026-10-25.
-- 1. Remove anon (and implicit PUBLIC) execute from every SECURITY DEFINER function anon could call.
revoke execute on function public.approve_or_decline_teacher_request(uuid, boolean, text) from public, anon;
revoke execute on function public.compute_department_health(uuid) from public, anon;
revoke execute on function public.generate_my_api_token(text) from public, anon;
revoke execute on function public.list_my_api_tokens() from public, anon;
revoke execute on function public.log_audit_event(uuid, uuid, text, text, uuid, jsonb, jsonb, text) from public, anon;
revoke execute on function public.notify_department_of_new_notice() from public, anon;
revoke execute on function public.notify_hods_of_new_teacher_request() from public, anon;
revoke execute on function public.notify_lesson_plan_status_change() from public, anon;
revoke execute on function public.record_document_version(text, uuid, jsonb, uuid, text) from public, anon;
revoke execute on function public.revoke_my_api_token(uuid) from public, anon;
revoke execute on function public.snapshot_all_department_health() from public, anon;
revoke execute on function public.version_lesson_plan_on_change() from public, anon;
revoke execute on function public.version_sap_on_change() from public, anon;

-- 2. Functions with no caller identity check, and trigger-only functions,
--    should not be callable by signed-in users either (service_role and triggers keep access).
revoke execute on function public.compute_department_health(uuid) from authenticated;
revoke execute on function public.log_audit_event(uuid, uuid, text, text, uuid, jsonb, jsonb, text) from authenticated;
revoke execute on function public.record_document_version(text, uuid, jsonb, uuid, text) from authenticated;
revoke execute on function public.snapshot_all_department_health() from authenticated;
revoke execute on function public.notify_department_of_new_notice() from authenticated;
revoke execute on function public.notify_hods_of_new_teacher_request() from authenticated;
revoke execute on function public.notify_lesson_plan_status_change() from authenticated;
revoke execute on function public.version_lesson_plan_on_change() from authenticated;
revoke execute on function public.version_sap_on_change() from authenticated;

-- 3. Pin search_path on the updated_at trigger functions.
alter function public.set_notices_updated_at() set search_path = '';
alter function public.set_lesson_notes_updated_at() set search_path = '';
alter function public.set_timetable_entries_updated_at() set search_path = '';
alter function public.set_saps_updated_at() set search_path = '';
alter function public.set_subscriptions_updated_at() set search_path = '';
