import { getIdToken } from './authService';

// URL de la API (API Gateway en AWS), sin "/" al final.
// Se define en el archivo .env de la raíz:  EXPO_PUBLIC_API_URL=https://<id>.execute-api.us-east-2.amazonaws.com
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(public status: number, public code: string) {
    super(code);
    this.name = 'ApiError';
  }
}

async function request<T>(method: 'GET' | 'POST' | 'PUT', path: string, opts: { params?: Record<string, string>; body?: unknown } = {}): Promise<T> {
  if (!API_URL) throw new ApiError(0, 'api_not_configured');

  const token = await getIdToken();
  if (!token) throw new ApiError(401, 'no_session');

  const query = opts.params ? new URLSearchParams(opts.params).toString() : '';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${path}${query ? `?${query}` : ''}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(res.status, data?.error ?? 'request_failed');
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, 'network_error');
  } finally {
    clearTimeout(timer);
  }
}

export function apiGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  return request<T>('GET', path, { params });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>('POST', path, { body });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PUT', path, { body });
}