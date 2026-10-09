export interface ApiResult<T = unknown> { status: number; data: T; }
export function getApiPrefix(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) {
    const clean = envUrl.replace(/\/+$/, "");
    return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
  }
  return "http://localhost:3000/api/v1";
}

let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;
export function getAccessToken() { return accessToken; }
export function setAccessToken(token: string | null) { accessToken = token; }
export function setSessionTokens(tokens: { accessToken: string } | null) { setAccessToken(tokens?.accessToken ?? null); }
export async function refreshSession(): Promise<string | null> { if (!refreshing) refreshing = request<{ accessToken?: string }>("/auth/refresh", { method: "POST" }, null, false).then((r) => { const token = r.status === 200 && typeof r.data.accessToken === "string" ? r.data.accessToken : null; setAccessToken(token); return token; }).finally(() => { refreshing = null; }); return refreshing; }
export async function logoutSession() { try { await request("/auth/logout", { method: "POST" }, null, false); } finally { setAccessToken(null); } }
export interface JwtPayloadData {
  sub?: string;
  rol?: "ADMINISTRADOR" | "USUARIO";
  exp?: number;
  [key: string]: unknown;
}

export function parseJwtPayload(token: string): JwtPayloadData | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

type ResponseReader<T> = (response: Response) => Promise<T>;

async function readJsonBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  try { return text ? JSON.parse(text) as T : ({} as T); } catch { return text as T; }
}

async function readPdfBody(response: Response): Promise<unknown> {
  return response.ok ? response.blob() : readJsonBody<unknown>(response);
}

async function sendRequest<T>(path: string, init: RequestInit, token: string | null, retry: boolean, readBody: ResponseReader<T>): Promise<ApiResult<T>> {
  const currentToken = token ?? accessToken;
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`); else headers.delete("Authorization");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${getApiPrefix()}${cleanPath}`, { ...init, headers, credentials: "include" });
  const data = await readBody(response);
  if (response.status === 401 && retry) { const renewed = await refreshSession(); if (renewed) return sendRequest(path, init, renewed, false, readBody); setAccessToken(null); }
  return { status: response.status, data };
}

export async function request<T>(path: string, init: RequestInit = {}, token: string | null = null, retry = true): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return sendRequest<T>(path, { ...init, headers }, token, retry, readJsonBody<T>);
}

/**
 * Envía multipart/form-data. No establece Content-Type: el navegador debe generar el boundary.
 */
export function requestFormData<T>(path: string, formData: FormData, token: string | null = null): Promise<ApiResult<T>> {
  return sendRequest<T>(path, { method: "POST", body: formData }, token, true, readJsonBody<T>);
}

/**
 * Obtiene un PDF binario. Si el backend responde con error, `data` contiene el cuerpo JSON del error.
 */
export function requestPdf(path: string, token: string | null = null): Promise<ApiResult<unknown>> {
  return sendRequest<unknown>(path, { method: "GET", headers: { Accept: "application/pdf" } }, token, true, readPdfBody);
}
