import { generateSecureToken, generateVerificationCode } from "./auth.tokens.js";

export interface AuthServiceOptions {
  createId: () => string;
  codeSecret: string;
  now?: () => Date;
  generateCode?: () => string;
  generateToken?: () => string;
  challengeTtlMinutes?: number;
  recoveryTokenTtlMinutes?: number;
  maxCodeAttempts?: number;
  resendCooldownSeconds?: number;
  maxSendsPerWindow?: number;
  sendWindowMinutes?: number;
  regularSessionDays?: number;
  rememberedSessionDays?: number;
  idleTimeoutMinutes?: number;
  appOrigin?: string;
}

export interface AuthConfig {
  createId: () => string;
  codeSecret: string;
  now: () => Date;
  generateCode: () => string;
  generateToken: () => string;
  challengeTtlMinutes: number;
  recoveryTokenTtlMinutes: number;
  maxCodeAttempts: number;
  resendCooldownSeconds: number;
  maxSendsPerWindow: number;
  sendWindowMinutes: number;
  regularSessionDays: number;
  rememberedSessionDays: number;
  idleTimeoutMinutes: number;
  appOrigin: string;
}

export function resolveAuthConfig(options: AuthServiceOptions): AuthConfig {
  return {
    createId: options.createId,
    codeSecret: options.codeSecret,
    now: options.now ?? (() => new Date()),
    generateCode: options.generateCode ?? generateVerificationCode,
    generateToken: options.generateToken ?? generateSecureToken,
    challengeTtlMinutes: options.challengeTtlMinutes ?? 5,
    recoveryTokenTtlMinutes: options.recoveryTokenTtlMinutes ?? 5,
    maxCodeAttempts: options.maxCodeAttempts ?? 3,
    resendCooldownSeconds: options.resendCooldownSeconds ?? 60,
    maxSendsPerWindow: options.maxSendsPerWindow ?? 3,
    sendWindowMinutes: options.sendWindowMinutes ?? 15,
    regularSessionDays: options.regularSessionDays ?? 7,
    rememberedSessionDays: options.rememberedSessionDays ?? 30,
    idleTimeoutMinutes: options.idleTimeoutMinutes ?? 30,
    appOrigin: options.appOrigin ?? "http://localhost:5173",
  };
}
