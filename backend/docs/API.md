# Meeting Agent Backend API

## Running Locally
1. From `backend/`, activate the virtualenv and install deps: `python -m venv .venv && .\.venv\Scripts\activate && pip install -r requirements.txt`.
2. Define the required environment variables (or drop them into `.env`). Minimum for production-style runs:
   - `DATABASE_URL=sqlite:///meeting_agent.db`
   - `ASSEMBLYAI_API_KEY=<your key>`
   - `TRANSCRIPTION_PROVIDER=assemblyai` (or `whisper` if you have Whisper locally)
   - `GEMINI_API_KEY=<your key>` and optional `GEMINI_MODEL`
   - `ENABLE_BACKGROUND_JOBS=false` if you want each request to block until processing completes
3. Start the API: `python app.py` (loads `.env` automatically).
4. In another terminal, run the `curl`/`python` commands below to exercise the endpoints exactly as your frontend will.

## Health Check
- **GET** `/health`
- **200 Response**
```json
{ "status": "ok" }
```
Useful for liveness probes and smoke tests.

## Meetings
Create a meeting by supplying either a transcript (JSON) or an audio upload (multipart). Every meeting immediately receives an ID; keep polling until `status` is `done`.

### JSON Transcript Upload
```bash
curl -X POST http://127.0.0.1:5000/meetings \
  -H "Content-Type: application/json" \
  -d '{
        "title": "Weekly Sync",
        "transcript": "ACTION: send recap @Alex (due 2023-12-01)",
        "source_agent": "dashboard"
      }'
```
**201 Response**
```json
{ "meeting_id": 12, "status": "pending" }
```
Immediately fetch the full record:
```bash
curl http://127.0.0.1:5000/meetings/12
```
**200 Response (once processing finishes)**
```json
{
  "id": 12,
  "title": "Weekly Sync",
  "status": "done",
  "created_at": "2025-11-15T16:05:27.752506",
  "transcript": "...",
  "summary": "This video offers practical insights...",
  "audio_url": null,
  "source_agent": "dashboard",
  "action_items": [
    {
      "id": 42,
      "description": "Fix the issue where the name is incorrect...",
      "owner": null,
      "due_date": null,
      "status": "todo"
    }
  ]
}
```

### Audio Upload
```bash
curl -X POST http://127.0.0.1:5000/meetings \
  -F "title=Weekly Meeting Example" \
  -F "source_agent=cli" \
  -F "audio=@\"Weekly Meeting Example.mp3\""
```
The backend persists the file to `STORAGE_DIR`, transcribes it with the configured provider, summarizes it with Gemini, and extracts action items. Poll `/meetings/{id}` exactly as above to see progress (`pending` → `processing` → `done`).

### Failure Cases
- Missing transcript/audio returns `400` with `{ "error": "Provide a transcript or an audio file" }`.
- If transcription or summarization fails, the meeting transitions to `status: "failed"` and includes the partial data that succeeded (e.g., transcript but no summary).

## Agent Follow-up
Use this when you need a summary + actions without persisting anything.

### Request
```bash
curl -X POST http://127.0.0.1:5000/agents/meeting-followup \
  -H "Content-Type: application/json" \
  -d '{
        "transcript": "ACTION: Prepare budget @Liam (due 2023-12-15)",
        "metadata": { "source": "planner-service" }
      }'
```

### Response
```json
{
  "summary": "The team aligned on budget preparation and next steps...",
  "action_items": [
    {
      "description": "Prepare budget",
      "owner": "Liam",
      "due_date": "2023-12-15",
      "status": "pending"
    }
  ],
  "metadata": { "source": "planner-service" }
}
```

## Integration Notes
1. Provide either `transcript` or an audio upload when calling `/meetings`; both simultaneously is allowed, but the transcript takes precedence.
2. Set `ENABLE_BACKGROUND_JOBS=false` for synchronous processing in local/dev. In production, leave it `true` so workers process meetings asynchronously while clients poll `/meetings/{id}`.
3. `/agents/meeting-followup` never writes to the database. Use it for immediate AI feedback inside other services.
4. Environment variables: `ASSEMBLYAI_API_KEY`, `TRANSCRIPTION_PROVIDER`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `WHISPER_MODEL`, `DATABASE_URL`, `ENABLE_BACKGROUND_JOBS`, `STORAGE_DIR`. Without Gemini/AssemblyAI keys you can set `MOCK_TRANSCRIPTION=1`, `MOCK_SUMMARY=1`, `MOCK_ACTION_ITEMS=1` to bypass external calls.
