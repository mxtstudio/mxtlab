-- MXT Lab: make review RPCs race-safe and restrict API-token creation.
CREATE OR REPLACE FUNCTION public.approve_or_decline_teacher_request(p_request_id uuid,p_approve boolean,p_feedback text DEFAULT NULL)
RETURNS public.teacher_requests LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $function$
DECLARE v_request public.teacher_requests; v_is_hod boolean;
BEGIN
  SELECT * INTO v_request FROM public.teacher_requests WHERE id=p_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Teacher request not found'; END IF;
  IF v_request.status<>'pending' THEN RAISE EXCEPTION 'Request has already been decided'; END IF;
  IF p_feedback IS NOT NULL AND char_length(p_feedback)>2000 THEN RAISE EXCEPTION 'Feedback is too long'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.department_roles WHERE department_id=v_request.department_id AND profile_id=auth.uid() AND role='hod') INTO v_is_hod;
  IF NOT v_is_hod THEN RAISE EXCEPTION 'Only the HOD of this department can decide on this request'; END IF;
  UPDATE public.teacher_requests SET status=CASE WHEN p_approve THEN 'approved' ELSE 'declined' END,hod_id=auth.uid(),hod_feedback=p_feedback,hod_decided_at=now()
   WHERE id=p_request_id RETURNING * INTO v_request;
  IF p_approve AND v_request.requested_by IS NOT NULL THEN
    UPDATE public.profiles SET school_id=v_request.school_id,department_id=v_request.department_id WHERE id=v_request.requested_by;
    INSERT INTO public.department_roles(department_id,profile_id,role) VALUES(v_request.department_id,v_request.requested_by,'teacher') ON CONFLICT(department_id,profile_id) DO NOTHING;
  END IF;
  IF v_request.requested_by IS NOT NULL THEN
    INSERT INTO public.notifications(user_id,type,title,body,data) VALUES(
      v_request.requested_by,
      CASE WHEN p_approve THEN 'teacher_request_approved' ELSE 'teacher_request_declined' END,
      CASE WHEN p_approve THEN 'Request approved' ELSE 'Request declined' END,
      COALESCE(p_feedback,CASE WHEN p_approve THEN 'Welcome to the department!' ELSE 'Your request was not approved.' END),
      jsonb_build_object('request_id',v_request.id,'department_id',v_request.department_id));
  END IF;
  PERFORM public.log_audit_event(auth.uid(),v_request.school_id,
    CASE WHEN p_approve THEN 'teacher_request.approved' ELSE 'teacher_request.declined' END,
    'teacher_requests',v_request.id,jsonb_build_object('status','pending'),
    jsonb_build_object('status',v_request.status,'decided_by',auth.uid()),
    CASE WHEN p_approve THEN 'info' ELSE 'warning' END);
  RETURN v_request;
END;$function$;

CREATE OR REPLACE FUNCTION public.review_lesson_plan(p_lesson_plan_id uuid,p_approve boolean,p_notes text DEFAULT NULL)
RETURNS public.lesson_plans LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $function$
DECLARE v_plan public.lesson_plans; v_is_hod boolean;
BEGIN
  SELECT * INTO v_plan FROM public.lesson_plans WHERE id=p_lesson_plan_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lesson plan not found'; END IF;
  IF v_plan.status<>'SUBMITTED' THEN RAISE EXCEPTION 'Lesson plan is not awaiting review'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.department_roles WHERE department_id=v_plan.department_id AND profile_id=auth.uid() AND role='hod') INTO v_is_hod;
  IF NOT v_is_hod THEN RAISE EXCEPTION 'Only the HOD of this department can review this lesson plan'; END IF;
  UPDATE public.lesson_plans SET status=CASE WHEN p_approve THEN 'APPROVED' ELSE 'REJECTED' END,hod_review_notes=p_notes,reviewed_by=auth.uid(),reviewed_at=now()
   WHERE id=p_lesson_plan_id RETURNING * INTO v_plan;
  INSERT INTO public.notifications(user_id,type,title,body,data) VALUES(
    v_plan.teacher_id,CASE WHEN p_approve THEN 'lesson_plan_approved' ELSE 'lesson_plan_rejected' END,
    CASE WHEN p_approve THEN 'Lesson plan approved' ELSE 'Lesson plan needs changes' END,
    COALESCE(p_notes,CASE WHEN p_approve THEN 'Your lesson plan was approved.' ELSE 'Your lesson plan was rejected.' END),
    jsonb_build_object('lesson_plan_id',v_plan.id,'department_id',v_plan.department_id));
  PERFORM public.log_audit_event(auth.uid(),NULL,CASE WHEN p_approve THEN 'lesson_plan.approved' ELSE 'lesson_plan.rejected' END,
    'lesson_plans',v_plan.id,jsonb_build_object('status','SUBMITTED'),
    jsonb_build_object('status',v_plan.status,'reviewed_by',auth.uid()),
    CASE WHEN p_approve THEN 'info' ELSE 'warning' END);
  RETURN v_plan;
END;$function$;

CREATE OR REPLACE FUNCTION public.review_sap(p_sap_id uuid,p_approve boolean)
RETURNS public.saps LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $function$
DECLARE v_sap public.saps; v_is_hod boolean;
BEGIN
  SELECT * INTO v_sap FROM public.saps WHERE id=p_sap_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'SAP not found'; END IF;
  IF v_sap.status<>'submitted' THEN RAISE EXCEPTION 'SAP is not awaiting review'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.department_roles WHERE department_id=v_sap.department_id AND profile_id=auth.uid() AND role='hod') INTO v_is_hod;
  IF NOT v_is_hod THEN RAISE EXCEPTION 'Only the HOD of this department can review this SAP'; END IF;
  IF p_approve THEN
    UPDATE public.saps SET status='approved',approved_at=now(),approved_by=auth.uid() WHERE id=p_sap_id RETURNING * INTO v_sap;
  ELSE
    UPDATE public.saps SET status='draft' WHERE id=p_sap_id RETURNING * INTO v_sap;
  END IF;
  INSERT INTO public.notifications(user_id,type,title,body,data) VALUES(
    v_sap.teacher_id,CASE WHEN p_approve THEN 'sap_approved' ELSE 'sap_sent_back' END,
    CASE WHEN p_approve THEN 'SAP approved' ELSE 'SAP sent back for changes' END,
    CASE WHEN p_approve THEN 'Your assessment plan was approved.' ELSE 'Your assessment plan was sent back to draft.' END,
    jsonb_build_object('sap_id',v_sap.id,'department_id',v_sap.department_id));
  PERFORM public.log_audit_event(auth.uid(),NULL,CASE WHEN p_approve THEN 'sap.approved' ELSE 'sap.sent_back' END,
    'saps',v_sap.id,jsonb_build_object('status','submitted'),
    jsonb_build_object('status',v_sap.status,'reviewed_by',auth.uid()),
    CASE WHEN p_approve THEN 'info' ELSE 'warning' END);
  RETURN v_sap;
END;$function$;

CREATE OR REPLACE FUNCTION public.generate_my_api_token(_label text DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $function$
DECLARE _raw_token text; _hash text; _role text; _active_count integer; _safe_label text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT role INTO _role FROM public.profiles WHERE id=auth.uid();
  IF _role NOT IN ('teacher','admin') THEN RAISE EXCEPTION 'Only teacher or administrator accounts can create API tokens'; END IF;
  IF _label IS NOT NULL AND char_length(btrim(_label))>80 THEN RAISE EXCEPTION 'Token label must be 80 characters or fewer'; END IF;
  SELECT count(*) INTO _active_count FROM public.api_tokens
   WHERE profile_id=auth.uid() AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at>now());
  IF _active_count>=10 THEN RAISE EXCEPTION 'You have reached the maximum of 10 active API tokens'; END IF;
  _safe_label:=COALESCE(NULLIF(btrim(_label),''),'My device');
  _raw_token:=encode(gen_random_bytes(32),'hex');
  _hash:=encode(digest(_raw_token,'sha256'),'hex');
  INSERT INTO public.api_tokens(token,token_hash,profile_id,label) VALUES(NULL,_hash,auth.uid(),_safe_label);
  RETURN _raw_token;
END;$function$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text,integer,integer) TO service_role;
