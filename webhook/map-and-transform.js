// Step 4 + 5: field extraction and transformations
// Topic 9 update: adds 11 PCA fields (call_summary already existed)
const body = $('Webhook').first().json.body;
const call = body.call || {};
const raw = call.call_analysis || {};
const a = { ...raw, ...(raw.custom_analysis_data || {}) };
const na = v => (v === undefined || v === null || String(v).trim() === '') ? 'N/A' : v;
// For booleans: keep false as "false" (not blank)
const bool = v => (v === undefined || v === null) ? 'N/A' : String(v);

const d = new Date(call.start_timestamp);
const dateStr = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Chicago', year:'numeric', month:'2-digit', day:'2-digit'}).format(d);
const timeStr = new Intl.DateTimeFormat('en-GB', {timeZone:'America/Chicago', hour:'2-digit', minute:'2-digit', hour12:false}).format(d) + ' CT';

const fullName = (a.caller_first_name || a.caller_last_name)
  ? `${a.caller_first_name || ''} ${a.caller_last_name || ''}`.trim()
  : 'N/A';

// Recording URL expires ~10 min: valid https URL -> keep, else placeholder
const rec = (typeof call.recording_url === 'string' && /^https:\/\/.+/.test(call.recording_url))
  ? call.recording_url : 'URL expired';

return [{ json: {
  call_id: call.call_id,
  call_date: call.start_timestamp ? dateStr : 'N/A',
  call_time: call.start_timestamp ? timeStr : 'N/A',
  duration_seconds: call.duration_ms != null ? Math.round(call.duration_ms / 1000) : 'N/A',
  call_status: na(call.call_status),
  caller_name: fullName,
  caller_phone: na(a.caller_phone),
  caller_email: na(a.caller_email),
  qualification_status: na(a.qualification_status),
  call_summary: na(a.call_summary),
  recording_url: rec,
  follow_up_status: 'Pending',

  // ---- Topic 9 PCA fields ----
  lead_score: na(a.lead_score),
  appointment_intent: na(a.appointment_intent),
  objection_raised: bool(a.objection_raised),
  objection_type: na(a.objection_type),
  caller_sentiment: na(a.caller_sentiment),
  required_fields_captured: bool(a.required_fields_captured),
  agent_asked_all_questions: bool(a.agent_asked_all_questions),
  disqualification_applied: bool(a.disqualification_applied),
  next_action: na(a.next_action),
  qa_flag: na(a.qa_flag),
  // Blank is correct when qa_flag is Pass
  qa_flag_reason: (a.qa_flag_reason === undefined || a.qa_flag_reason === null) ? '' : a.qa_flag_reason
}}];
