# Funny AI Agent — integrated React frontend

Original 16-preset UI retained, with FastAPI + LangGraph integration.

## Run

Start FastAPI at `127.0.0.1:8000`. In a second PowerShell window:

```powershell
cd D:\Funny\frontend
npm.cmd install
npm.cmd run dev
```

Open Vite's printed URL (usually `http://localhost:3000`).

The Vite development proxy forwards `/api` to `http://127.0.0.1:8000`.
The optional custom prompt goes to FastAPI, which routes by the chosen filter ID.

Output previews only appear after the backend reports `completed` with a real PNG or MP4. If model inference is disabled, Generate displays an explicit error; it does not produce a fake picture.

See `README_INTEGRATION.md` in the integration package for installation and limitations.
