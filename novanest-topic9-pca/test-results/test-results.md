# Test results (Topic 9)

Only 2 real voice (web) calls were run because of limited Retell credits. Results below are copied from the Retell Call History and the Google Sheet. Anything not run is marked NOT RUN.

## Runs
| Run | Type | Call ID / reference | Evidence |
|---|---|---|---|
| Sample | n8n sample payload (not a real call) | test_call_topic9_001 (sheet row 8) | screenshot 10 |
| Call A | Real web call, 2m 8s, 2026-10-12 17:41 IST | call_e0e46f64ec... (sheet row 9, duration_seconds 128) | screenshots 11, 13, 14 |
| Call B | Real web call, 3m 10s, 2026-10-12 17:43 IST | call_7d5c616006... (sheet row 10, duration_seconds 190) | screenshots 12, 13, 14 |

Call IDs are truncated in the screenshots. They were matched to sheet rows by call_id prefix, duration and time.

## PCA output (Retell Call History)
| Field | Call A | Call B |
|---|---|---|
| lead_score | 0 | 8 |
| appointment_intent | Moderate | Strong |
| objection_raised | false | false |
| objection_type | None | None |
| caller_sentiment | Neutral | Positive |
| required_fields_captured | false | false |
| agent_asked_all_questions | false | false |
| disqualification_applied | false | false |
| next_action | Send Follow-Up Email | Send Follow-Up Email |
| qa_flag | Fail | Fail |
| qa_flag_reason | The agent did not ask about budget, preferred location, property type, timeline, or financing, and no appointment time was captured. | The agent did not ask for the caller's preferred location or property type, and the booking submission failed. |

The 11 PCA columns in the sheet showed the same values for both calls (screenshots 10, 13, 14).

## TC-001 to TC-010
| TC | Result | Notes |
|---|---|---|
| 001 | PARTIAL / qa_flag expectation NOT met | Call B: lead_score 8 (>=7), Strong, Positive met. qa_flag expected Pass but was Fail because the unchanged booking prompt does not ask the qualification questions. |
| 002 | NOT RUN | No "just exploring" call. Call A was a low-information call (caller hung up), score 0, intent Moderate. |
| 003 | PASS (observed in both calls) | agent_asked_all_questions=false, qa_flag=Fail, specific reason sentence. The prompt never asks financing, so this occurs on every call. Call A's reason names financing. |
| 004 | NOT MET | Clean Pass is not achievable with the unchanged prompt. |
| 005 | NOT RUN | No price-objection call. |
| 006 | PASS | Call B: objection_raised=false, objection_type=None (also Call A). |
| 007 | NOT RUN (partial) | Only the Send Follow-Up Email outcome was observed. Book Consultation and No Action Required not tested. |
| 008 | PARTIAL | 2 real calls checked, not 5. All enum values were inside their allowed lists. |
| 009 | PARTIAL | 2 real calls checked, not 5. lead_score 0 and 8, both integers 0-10. |
| 010 | PARTIAL | For both calls the 11 PCA columns and call_summary were populated and matched the Retell values. The 60-second timing was not measured. qa_flag_reason is non-blank because both calls were not Pass. |

## Other observations
- create_booking_request returned an error in Call B (Topic 8 function, not PCA). The agent used the scripted fallback message.
- In Call B the caller said the first name "Neil", so caller_first_name = Neil, caller_name = Neil Torres.
