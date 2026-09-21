import { request, type ApiResult } from "./client";

export interface LoginInput { correo: string; password: string; }
export function login(input: LoginInput): Promise<ApiResult> { return request("/auth/login", { method: "POST", body: JSON.stringify(input) }, null); }
export function changeTemporaryPassword(token: string, nuevaPassword: string, confirmarPassword: string): Promise<ApiResult> {
  return request("/auth/change-temporary-password", { method: "POST", body: JSON.stringify({ nuevaPassword, confirmarPassword }) }, token);
}
export function verifyCode(challengeId: string, codigo: string, recordarSesion = false): Promise<ApiResult> {
  return request("/auth/verify-code", { method: "POST", body: JSON.stringify({ challengeId, codigo, recordarSesion }) }, null);
}
export function resendCode(challengeId: string): Promise<ApiResult> { return request("/auth/login-code/resend", { method: "POST", body: JSON.stringify({ challengeId }) }, null); }
export function forgotPassword(correo: string): Promise<ApiResult> { return request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ correo }) }, null); }
export function verifyRecoveryCode(correo: string, codigo: string): Promise<ApiResult> { return request("/auth/verify-recovery-code", { method: "POST", body: JSON.stringify({ correo, codigo }) }, null); }
export function resetPassword(token: string, nuevaPassword: string, confirmarPassword: string): Promise<ApiResult> { return request("/auth/reset-password", { method: "POST", body: JSON.stringify({ nuevaPassword, confirmarPassword }) }, token, false); }
