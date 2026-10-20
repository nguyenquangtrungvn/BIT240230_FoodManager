import { BASE_URL } from "../constants/config";

export class ApiError extends Error {
  status?: number;
  isNetwork: boolean;
  constructor(code: string, isNetwork = false, status?: number) {
    super(code);
    this.isNetwork = isNetwork;
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(BASE_URL + path, {
      ...options,
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    if (res.status === 404) throw new ApiError("NOT_FOUND", false, 404);
    if (!res.ok) throw new ApiError("SERVER_ERROR", false, res.status);
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("NETWORK_ERROR", true); // mất mạng / timeout
  } finally {
    clearTimeout(timer);
  }
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};