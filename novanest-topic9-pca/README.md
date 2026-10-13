# NovaNest - Retell AI Topic 9: Post-Call Analysis, Scoring & QA Dashboards

Adds a 12-field Post-Call Analysis (PCA) layer to the NovaNest Consultation Booking Agent, extends the Google Sheet, and forwards `call_analysis` through the existing n8n webhook pipeline.

## What is in this repo
| Path | Content |
|---|---|
| `config/pca_fields.json` | The 12 PCA fields (type, choices, descriptions) as saved in Retell |
| `webhook/map-and-transform.js` | Updated n8n "Map & Transform" code (Topic 8 code + 11 PCA fields) |
| `webhook/backup-map-transform-topic8.js` | Original Topic 8 code (rollback) |
| `sample-payloads/call_analyzed_sample.json` | Sample `call_analyzed` payload used for the pipeline test |
| `test-results/test-results.md` | TC-001 to TC-010 results table |
| `screenshots/` | Evidence screenshots |

## Setup
1. Retell: agent page > Post call extraction > add the 12 fields (see `config/pca_fields.json`). Existing booking fields were kept.
2. Retell: Webhook settings > Webhook Events: `Call analyzed` enabled (screenshot 04). Webhook URL unchanged: `https://shaheedn8n.app.n8n.cloud/webhook/retell-novanest`.
3. Google Sheet "NovaNest Call Log": 11 new columns M-W after `follow_up_status`, names identical to the field names.
4. n8n "NovaNest Webhook Call Log Pipeline": Map & Transform code replaced with `webhook/map-and-transform.js`. Append Row uses "Map Automatically", so field names must match column names exactly.

## Webhook mapping
Flow: Webhook > Is call_analyzed? > Has call_id? > Lookup call_id in Sheet > Duplicate? > Map & Transform > Append Row.
The code merges `call_analysis` and `call_analysis.custom_analysis_data`, so fields are found in either place. Booleans are written as `true`/`false` strings (Sheets shows TRUE/FALSE). `qa_flag_reason` is left blank when empty (correct for Pass). Other missing values become `N/A`.

## Assumptions, limitations, challenges
- **Prompt not changed.** The implementation doc says "No change is made to the prompt or function configuration." The agent is a consultation booking agent. It asks for name, phone, email, service and time windows. It does not ask budget, preferred location, property type, timeline or financing. So `agent_asked_all_questions=false`, `required_fields_captured=false` and `qa_flag=Fail` are expected results, and the Pass-based expectations in TC-001, TC-004 and TC-007 cannot be met unless a caller volunteers the details. No written instructor clarification was received.
- **Undefined in the assessment:** the budget threshold, "genuine buyer", and "properly ended intake". Disqualification could not be tested against assessment-defined conditions. The existing `qualification_status` field uses different "Disqualified" criteria.
- **Format Example:** the Retell UI offers a Format Example box only for Text fields (screenshots 05-09). Number, Yes/No and Selector fields have none; Selector fields use their exact Choices instead.
- **call_summary:** the built-in Call Summary field already uses the key `call_summary`, so a second field with that name was rejected. The built-in field's description was replaced with the Topic 9 two-sentence description; the original built-in wording could not be recovered. The sheet already had a `call_summary` column from Topic 8, so 11 columns were added instead of 12.
- **objection_raised** description says "expresses an objection or concern", narrower than the doc's "any pushback, hesitation".
- **Enhancements:** add the five qualification questions to the prompt (if permitted), define the disqualification threshold, add dashboard filters in Sheets.

## Test status
2 real web calls and 1 sample-payload test were run (credits were limited). See `test-results/test-results.md` for the exact results.
- Passed: TC-003, TC-006.
- Partial: TC-001 (qa_flag is Fail because of the prompt mismatch), TC-008, TC-009 (2 calls, not 5), TC-010 (values match, 60 s not timed).
- Not run: TC-002, TC-005, TC-007. Not achievable with the unchanged prompt: TC-004.
