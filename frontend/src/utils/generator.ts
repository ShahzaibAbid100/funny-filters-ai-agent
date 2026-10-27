/** FastAPI-backed generation. No browser-side fake compositions. */
export type MediaType = 'image_to_image' | 'image_to_video';

export type GenerationPhase = 'checking' | 'uploading' | 'queued' | 'processing' | 'completed';

interface PlanResponse {
  preset_id: string;
  route: MediaType;
  prompt: string;
  provider_ready: boolean;
}

interface UploadResponse { image_id: string; status: string }
interface JobResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  media_type: MediaType;
  error: string | null;
  output_name: string | null;
}

const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const api = (path: string) => `${BASE}/api${path}`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(api(path), options);
  } catch {
    throw new Error('Cannot connect to FastAPI. Run the backend on port 8000.');
  }
  if (!response.ok) {
    let message = `Request failed (HTTP ${response.status})`;
    try {
      const data = await response.json();
      if (typeof data.detail === 'string') message = data.detail;
      else if (data.detail) message = JSON.stringify(data.detail);
    } catch { /* Server may return non-JSON errors. */ }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

// Convert chosen photo (including the starter SVG demo faces) into a JPEG upload.
// FastAPI accepts JPEG, PNG or WebP and limits uploads to 10 MiB / 16 MP.
async function photoAsJpeg(photoUrl: string): Promise<Blob> {
  const image = new Image();
  image.src = photoUrl;
  try {
    await image.decode();
  } catch {
    throw new Error('Cannot open this photo. Please choose a valid image.');
  }
  const scale = Math.min(1, 2048 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Browser canvas is unavailable.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  try { context.drawImage(image, 0, 0, canvas.width, canvas.height); }
  catch { throw new Error('Unable to prepare this image for upload.'); }
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  if (!blob) throw new Error('Could not encode photo as JPEG.');
  if (blob.size > 10 * 1024 * 1024) throw new Error('Image exceeds the 10 MB upload limit.');
  return blob;
}

export interface GenerationResult {
  jobId: string;
  mediaType: MediaType;
  outputUrl: string;
}

/** Filter is selected first; preset ID, not the free-text prompt, selects the model. */
export async function generateWithBackend(
  photoUrl: string,
  presetId: string,
  extraPrompt: string,
  onPhase: (phase: GenerationPhase) => void,
): Promise<GenerationResult> {
  onPhase('checking');
  const plan = await request<PlanResponse>('/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preset_id: presetId, extra_prompt: extraPrompt }),
  });
  if (!plan.provider_ready) {
    const model = plan.route === 'image_to_video' ? 'LTX-Video' : 'FLUX Kontext';
    throw new Error(`${model} inference is currently disabled. The frontend and routing are connected, but real generation requires the configured GPU backend.`);
  }

  onPhase('uploading');
  const uploadForm = new FormData();
  uploadForm.append('file', await photoAsJpeg(photoUrl), 'photo.jpg');
  const uploaded = await request<UploadResponse>('/upload', {
    method: 'POST', body: uploadForm,
  });

  onPhase('queued');
  const started = await request<JobResponse>('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preset_id: presetId, image_id: uploaded.image_id, extra_prompt: extraPrompt }),
  });
  if (!started.id) throw new Error('Backend did not return a generation job ID.');
  const deadline = Date.now() + 30 * 60 * 1000;

  while (Date.now() < deadline) {
    const job = await request<JobResponse>(`/jobs/${encodeURIComponent(started.id)}`);
    if (job.status === 'failed') throw new Error(job.error || 'AI generation failed.');
    if (job.status === 'completed') {
      if (!job.output_name) throw new Error('Job completed without an output file.');
      onPhase('completed');
      return {
        jobId: job.id,
        mediaType: job.media_type,
        outputUrl: api(`/jobs/${encodeURIComponent(job.id)}/output`),
      };
    }
    onPhase(job.status === 'processing' ? 'processing' : 'queued');
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error('Generation is taking longer than 30 minutes. Check the FastAPI job logs.');
}
