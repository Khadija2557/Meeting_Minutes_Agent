# Meeting Agent Backend

This Flask backend ingests meetings (audio or transcript), runs transcription, summarization, and action extraction pipelines, and exposes REST APIs for dashboards and collaborating agents.

## Setup
1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Export environment variables:
   ```bash
   export DATABASE_URL=sqlite:///meeting_agent.db
   export ENABLE_BACKGROUND_JOBS=true
   export ASSEMBLYAI_API_KEY=your-assemblyai-key
   export TRANSCRIPTION_PROVIDER=assemblyai
   export GEMINI_API_KEY=your-gemini-key
   export GEMINI_MODEL=gemini-2.5-flash # optional override
   ```
3. Run the server:
   ```bash
   flask --app app run --debug
   ```

## Pipelines
- **Speech-to-Text**: `pipelines/transcription.py` uses AssemblyAI's free tier by default and falls back to Whisper when `TRANSCRIPTION_PROVIDER=whisper`. Set `MOCK_TRANSCRIPTION=1` to bypass audio processing in tests.
- **Summarization**: `pipelines/summarization.py` uses LangChain + Google Gemini (default `gemini-2.5-flash`, configurable) with a mocked fallback for tests.
- **Action Items**: `pipelines/action_items.py` uses LangChain structured parsing with Gemini plus rule-based heuristics as a fallback.
- **Orchestration**: `pipelines/orchestrator.py` chains all modules and persists results.

## Testing
Run unit tests (mocks enabled via env vars):
```bash
cd backend
pytest
```

## Deployment
1. Create a Railway service using the Python template.
2. Set `PORT`, `DATABASE_URL`, `GEMINI_API_KEY`, `ASSEMBLYAI_API_KEY`, `WHISPER_MODEL`, `ENABLE_BACKGROUND_JOBS`, and `STORAGE_DIR` environment variables.
3. Configure a persistent volume for audio uploads if needed.
4. Enable HTTPS and add a health check on `/health`.

## Documentation
Detailed API usage lives in `docs/API.md`, including example payloads and integration notes.
