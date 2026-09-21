import { getAccessToken, request, type ApiResult } from "./client";

export interface AccountRequestInput {
  rutEmpresa: string;
  razonSocial: string;
  rutUsuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  descripcion?: string;
}

export function createAccountRequest(
  input: AccountRequestInput
): Promise<ApiResult<{ solicitud: AccountRequestItem }>> {
  return request<{ solicitud: AccountRequestItem }>(
    "/account-requests",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    null
  );
}
export type RequestStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface AccountRequestItem {
  idSolicitud: string;
  rutEmpresa: string;
  razonSocial?: string;
  rutUsuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  descripcion?: string;
  estado: RequestStatus;
  createdAt: string;
  reviewedAt?: string | null;
  motivoRechazo?: string | null;
}

export function listAccountRequests(
  estado?: RequestStatus | "TODOS"
): Promise<ApiResult<{ solicitudes: AccountRequestItem[] }>> {
  const query = estado && estado !== "TODOS" ? `?estado=${encodeURIComponent(estado)}` : "";
  return request<{ solicitudes: AccountRequestItem[] }>(
    `/account-requests${query}`,
    {},
    getAccessToken()
  );
}
export function getAccountRequest(id: string): Promise<ApiResult<{ solicitud: AccountRequestItem }>> { return request<{ solicitud: AccountRequestItem }>(`/account-requests/${encodeURIComponent(id)}`, {}, getAccessToken()); }
export function approveAccountRequest(id: string, razonSocial?: string): Promise<ApiResult> {
  const body = razonSocial ? { confirmacionSii: true, razonSocial } : { confirmacionSii: true };
  return request(`/account-requests/${encodeURIComponent(id)}/approve`, { method: "POST", body: JSON.stringify(body) }, getAccessToken());
}
export function rejectAccountRequest(id: string, motivo: string): Promise<ApiResult> { return request(`/account-requests/${encodeURIComponent(id)}/reject`, { method: "POST", body: JSON.stringify({ motivo }) }, getAccessToken()); }
