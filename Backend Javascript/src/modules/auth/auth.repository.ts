import type {
  AuthSession,
  AuthUser,
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "./auth.types.js";

export interface CompleteLoginData {
  challengeId: string;
  userId: string;
  sessionId: string;
  refreshTokenHash: string;
  rememberSession: boolean;
  now: Date;
  expiresAt: Date;
}

export interface CompletePasswordRecoveryData {
  tokenId: string;
  userId: string;
  passwordHash: string;
  now: Date;
}

export interface RotateSessionData {
  sessionId: string;
  currentTokenHash: string;
  newTokenHash: string;
  now: Date;
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<AuthUser | null>;
  findUserById(id: string): Promise<AuthUser | null>;
  registerFailedLogin(userId: string, now: Date): Promise<void>;
  clearFailedLogins(
    userId: string,
    unblockTo?: "PENDIENTE" | "ACTIVO",
  ): Promise<void>;
  changeTemporaryPassword(
    userId: string,
    passwordHash: string,
    now: Date,
  ): Promise<void>;
  listSecurityCodeCreationTimes(
    userId: string,
    purpose: SecurityCodePurpose,
    since: Date,
  ): Promise<Date[]>;
  createSecurityCode(data: {
    id: string;
    userId: string;
    purpose: SecurityCodePurpose;
    tokenHash: string;
    now: Date;
    expiresAt: Date;
  }): Promise<void>;
  revokeSecurityCode(id: string, now: Date): Promise<void>;
  findSecurityCodeById(
    id: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null>;
  findSecurityCodeByTokenHash(
    tokenHash: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null>;
  findLatestSecurityCode(
    userId: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null>;
  registerInvalidCode(id: string, now: Date, revoke: boolean): Promise<void>;
  markSecurityCodeUsed(id: string, now: Date): Promise<boolean>;
  completeLogin(data: CompleteLoginData): Promise<void>;
  findSessionByTokenHash(tokenHash: string): Promise<AuthSession | null>;
  rotateSession(data: RotateSessionData): Promise<boolean>;
  revokeSessionByTokenHash(tokenHash: string, now: Date): Promise<boolean>;
  completePasswordRecovery(data: CompletePasswordRecoveryData): Promise<void>;
}
