# LearnFlux AI Tutor Backend

This is a minimal FastAPI backend for the LearnFlux AI Tutor Chat.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Test:**
   - The endpoint `/api/ask` will echo your question and uploaded file name.
   - The frontend will work with this backend for file-based Q&A.

## Endpoint
- `POST /api/ask` — Accepts a `question` (form field) and an optional file (`documents`). 