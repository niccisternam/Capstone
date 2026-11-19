import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  AuthRepository,
  CompleteLoginData,
  CompletePasswordRecoveryData,
  RotateSessionData,
} from "./auth.repository.js";
import type {
  AuthSession,
  AuthUser,
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "./auth.types.js";
import { PrismaAuthRecoveryRepository } from "./prisma-auth-recovery.repository.js";
import { PrismaAuthSessionRepository } from "./prisma-auth-session.repository.js";
import { PrismaAuthUserRepository } from "./prisma-auth-user.repository.js";
import { PrismaSecurityCodeRepository } from "./prisma-security-code.repository.js";

/**
 * Fachada del repositorio de autenticación. Cada grupo de operaciones vive en su
 * propio repositorio Prisma y esta clase mantiene el contrato que usa AuthService.
 */
export class PrismaAuthRepository implements AuthRepository {
  private readonly users: PrismaAuthUserRepository;
  private readonly codes: PrismaSecurityCodeRepository;
  private readonly sessions: PrismaAuthSessionRepository;
  private readonly recovery: PrismaAuthRecoveryRepository;

  constructor(prisma: PrismaClient) {
    this.users = new PrismaAuthUserRepository(prisma);
    this.codes = new PrismaSecurityCodeRepository(prisma);
    this.sessions = new PrismaAuthSessionRepository(prisma);
    this.recovery = new PrismaAuthRecoveryRepository(prisma);
  }

  findUserByEmail(email: string): Promise<AuthUser | null> {
    return this.users.findUserByEmail(email);
  }

  findUserById(id: string): Promise<AuthUser | null> {
    return this.users.findUserById(id);
  }

  registerFailedLogin(userId: string, now: Date): Promise<boolean> {
    return this.users.registerFailedLogin(userId, now);
  }

  clearFailedLogins(
    userId: string,
    unblockTo?: "PENDIENTE" | "ACTIVO",
  ): Promise<void> {
    return this.users.clearFailedLogins(userId, unblockTo);
  }

  changeTemporaryPassword(
    userId: string,
    passwordHash: string,
    now: Date,
  ): Promise<void> {
    return this.users.changeTemporaryPassword(userId, passwordHash, now);
  }

  listSecurityCodeCreationTimes(
    userId: string,
    purpose: SecurityCodePurpose,
    since: Date,
  ): Promise<Date[]> {
    return this.codes.listSecurityCodeCreationTimes(userId, purpose, since);
  }

  createSecurityCode(data: {
    id: string;
    userId: string;
    purpose: SecurityCodePurpose;
    tokenHash: string;
    now: Date;
    expiresAt: Date;
  }): Promise<void> {
    return this.codes.createSecurityCode(data);
  }

  revokeSecurityCode(id: string, now: Date): Promise<void> {
    return this.codes.revokeSecurityCode(id, now);
  }

  findSecurityCodeById(
    id: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    return this.codes.findSecurityCodeById(id, purpose);
  }

  findSecurityCodeByTokenHash(
    tokenHash: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    return this.codes.findSecurityCodeByTokenHash(tokenHash, purpose);
  }

  findLatestSecurityCode(
    userId: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    return this.codes.findLatestSecurityCode(userId, purpose);
  }

  registerInvalidCode(
    id: string,
    now: Date,
    revoke: boolean,
  ): Promise<void> {
    return this.codes.registerInvalidCode(id, now, revoke);
  }

  markSecurityCodeUsed(id: string, now: Date): Promise<boolean> {
    return this.codes.markSecurityCodeUsed(id, now);
  }

  completeLogin(data: CompleteLoginData): Promise<void> {
    return this.sessions.completeLogin(data);
  }

  findSessionByTokenHash(tokenHash: string): Promise<AuthSession | null> {
    return this.sessions.findSessionByTokenHash(tokenHash);
  }

  rotateSession(data: RotateSessionData): Promise<boolean> {
    return this.sessions.rotateSession(data);
  }

  revokeSessionByTokenHash(
    tokenHash: string,
    now: Date,
  ): Promise<boolean> {
    return this.sessions.revokeSessionByTokenHash(tokenHash, now);
  }

  completePasswordRecovery(
    data: CompletePasswordRecoveryData,
  ): Promise<void> {
    return this.recovery.completePasswordRecovery(data);
  }
}
