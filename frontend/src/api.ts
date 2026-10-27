export type Mode = 'image_to_image' | 'image_to_video';
export type Preset = {
  id: string;
  name: string;
  description: string;
  media_type: Mode;
  prompt_template: string;
  is_sample: boolean;
};
export type Capabilities = Record<Mode, boolean>;
export type Plan = { preset_id: string; route: Mode; prompt: string; provider_ready: boolean };
export type Job = { id: string; status: string; media_type: Mode; error?: string | null; output_name?: string | null };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch('/api' + path, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail ?? `Request failed (${response.status})`);
  return body as T;
}
export const getPresets = () => request<Preset[]>('/presets');
export const getCapabilities = () => request<Capabilities>('/capabilities');
export const getJob = (id: string) => request<Job>(`/jobs/${encodeURIComponent(id)}`);
export const plan = (preset_id: string, extra_prompt: string) =>
  request<Plan>('/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ preset_id, extra_prompt }) });
export async function upload(file: File) {
  const body = new FormData();
  body.append('file', file);
  return request<{ image_id: string; status: string }>('/upload', { method: 'POST', body });
}
export const generate = (preset_id: string, image_id: string, extra_prompt: string) =>
  request<Job>('/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ preset_id, image_id, extra_prompt }) });
