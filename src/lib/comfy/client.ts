import 'server-only';
import type { ObjectInfo, SystemStats, ComfyHistory, QueueState } from './types';

export const COMFY_BASE_URL = process.env.COMFY_BASE_URL ?? 'http://127.0.0.1:8188';

export async function comfyFetch(path: string, init?: RequestInit) {
  const url = new URL(path, COMFY_BASE_URL);
  return fetch(url.toString(), { ...init, cache: 'no-store' });
}

async function json<T>(path: string): Promise<T> {
  const r = await comfyFetch(path);
  if (!r.ok) throw new Error(`ComfyUI ${path} → ${r.status}`);
  return r.json() as Promise<T>;
}

export const getObjectInfo = () => json<ObjectInfo>('/object_info');
export const getSystemStats = () => json<SystemStats>('/system_stats');
export const getQueue = () => json<QueueState>('/queue');
export const getHistory = (max = 64) => json<ComfyHistory>(`/history?max_items=${max}`);
