# Funny Filters AI Agent

An AI-powered image and video transformation application developed using **React, TypeScript, FastAPI, and LangGraph**.

## Project Overview

Funny Filters AI Agent is a web-based application designed to apply creative AI effects to uploaded images and produce image and video transformations.

The application uses a React frontend, a FastAPI backend, and LangGraph for workflow orchestration.

**ComfyUI is not used in this project.**

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python 3.11, FastAPI
- **AI Orchestration:** LangGraph
- **Image Model:** FLUX.1 Kontext [dev]
- **Video Model:** LTX-Video
- **Model Hosting:** Hugging Face
- **Development:** Windows, Visual Studio Code

## Features

- 16 funny filter presets
- Dedicated filter pages
- Image upload and preview
- Frontend and backend integration
- LangGraph filter routing
- Preset validation and prompt selection
- AI image and video processing architecture
- GPU-based model execution support

## Project Architecture

1. The user uploads an image and selects a filter.
2. The React frontend sends the request to FastAPI.
3. LangGraph validates the selected filter and determines the processing workflow.
4. The selected AI model service processes the request.
5. The application returns the result for preview and download.

## AI Models

Large AI model files are excluded from this repository.

### Image Generation

**Model:** FLUX.1 Kontext [dev]

**Hugging Face:** https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev

**Purpose:** AI-based image editing and transformations.

### Video Generation

**Model:** LTX-Video

**Hugging Face:** https://huggingface.co/Lightricks/LTX-Video

**Purpose:** AI-powered image-to-video generation.

**Note:** The model repositories are provided as references. The exact local checkpoint versions and dependencies should match the project's model configuration.

## Development and Testing Status

| Component | Status |
|---|---|
| Project environment setup | Completed |
| React frontend implementation | Verified / Tested |
| 16 filter preset pages | Verified / Tested |
| Image upload and preview | Verified / Tested |
| FastAPI backend | Verified / Tested |
| LangGraph filter routing | Verified / Tested (16/16) |
| Preset validation and prompt selection | Verified / Tested |
| Backend regression tests | Verified / Tested (4/4) |
| Frontend production build | Verified / Tested |
| Frontend/backend integration | Verified / Tested |
| GPU verification | Verified / Tested  

## Testing Summary

The recorded development results include:

- 16/16 LangGraph preset-routing checks passed
- 4/4 backend regression tests passed
- Successful React frontend production build
- Verified image upload and preview
- Verified frontend/backend integration
- GPU verification reported as completed by the project owner

Detailed GPU inference logs, individual image/video output measurements, and per-preset GPU test results are not included in this documentation.

## Local Development

### Requirements

- Python 3.11
- Node.js and npm
- Git
- Compatible AI model dependencies
- GPU-compatible inference environment

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

Install the backend Python dependencies from the project's requirements file and start FastAPI using the configured application entry point.

### Model Setup

Download the required AI models from the Hugging Face repositories listed above.

Place them in the directories specified by the project's model configuration.

## Project Status

**Core application implementation and development testing completed.**

The React frontend, FastAPI backend, LangGraph routing, filter validation, and frontend/backend integration have recorded successful tests.

GPU verification has also been reported as completed.

## Repository Notes

This repository excludes:

- Large AI model weights
- Virtual environments
- Node.js dependencies
- Local secrets and API keys
- Uploaded user images
- Generated media files

Model links are provided to support reproducible local installation.