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

export async function request<T>(path: string, init: RequestInit = {}, token: string | null = null, retry = true): Promise<ApiResult<T>> {
  const currentToken = token ?? accessToken;
  const headers = new Headers(init.headers); headers.set("Accept", "application/json"); if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json"); if (currentToken) headers.set("Authorization", `Bearer ${currentToken}`); else headers.delete("Authorization");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${getApiPrefix()}${cleanPath}`, { ...init, headers, credentials: "include" }); const text = await response.text(); let data: T; try { data = text ? JSON.parse(text) as T : ({} as T); } catch { data = text as T; }
  if (response.status === 401 && retry) { const renewed = await refreshSession(); if (renewed) return request(path, init, renewed, false); setAccessToken(null); }
  return { status: response.status, data };
}
