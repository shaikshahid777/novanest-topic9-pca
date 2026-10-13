// Step 4 + 5: field extraction and transformations
const body = $('Webhook').first().json.body;
const call = body.call || {};
const raw = call.call_analysis || {};
const a = { ...raw, ...(raw.custom_analysis_data || {}) };
const na = v => (v === undefined || v === null || String(v).trim() === '') ? 'N/A' : v;

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
  follow_up_status: 'Pending'
}}];
