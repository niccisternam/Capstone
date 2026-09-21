import { createHash, randomBytes, randomUUID } from "node:crypto";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { InMemoryAccountRequestRepository } from "../src/modules/account-requests/in-memory-account-request.repository.js";
import { AccountRequestService } from "../src/modules/account-requests/account-request.service.js";
import {
  hashPassword,
  verifyPassword,
} from "../src/modules/account-requests/password.js";
import type {
  AuthRepository,
  CompleteLoginData,
  CompletePasswordRecoveryData,
  RotateSessionData,
} from "../src/modules/auth/auth.repository.js";
import {
  AuthService,
  generateVerificationCode,
} from "../src/modules/auth/auth.service.js";
import type {
  AuthUser,
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "../src/modules/auth/auth.types.js";
import { JwtService } from "../src/modules/auth/jwt.service.js";
import { createJwtAdminResolver } from "../src/shared/auth/jwt-admin-resolver.js";
import type {
  PasswordRecoveryLinkEmail,
  VerificationCodeEmail,
  VerificationEmailSender,
} from "../src/shared/email/verification-email.sender.js";
import { AppError } from "../src/shared/errors/app-error.js";

class MemoryAuthRepository implements AuthRepository {
  readonly users = new Map<string, AuthUser>();
  readonly challenges = new Map<string, SecurityCodeChallenge>();
  readonly sessions: CompleteLoginData[] = [];
  readonly recoveries: CompletePasswordRecoveryData[] = [];
  readonly revokedSessionIds = new Set<string>();
  readonly sessionActivity = new Map<string, Date>();

  async findUserByEmail(email: string) {
    return (
      [...this.users.values()].find((user) => user.correo === email) ?? null
    );
  }

  async findUserById(id: string) {
    return this.users.get(id) ?? null;
  }

  async registerFailedLogin(userId: string, now: Date) {
    const user = this.users.get(userId)!;
    const attempts =
      ((user as AuthUser & { attempts?: number }).attempts ?? 0) + 1;
    this.users.set(userId, { ...user, attempts } as AuthUser);
    if (attempts >= 5) {
      this.users.set(userId, {
        ...this.users.get(userId)!,
        estado: "BLOQUEADO",
        bloqueadoHasta: new Date(now.getTime() + 15 * 60 * 1000),
      });
    }
  }

  async clearFailedLogins(userId: string, unblockTo?: "PENDIENTE" | "ACTIVO") {
    const user = this.users.get(userId)!;
    this.users.set(userId, {
      ...user,
      estado: unblockTo ?? user.estado,
      bloqueadoHasta: null,
    });
  }

  async changeTemporaryPassword(userId: string, passwordHash: string) {
    const user = this.users.get(userId)!;
    this.users.set(userId, {
      ...user,
      passwordHash,
      debeCambiarPassword: false,
    });
  }

  async listSecurityCodeCreationTimes(
    userId: string,
    purpose: SecurityCodePurpose,
    since: Date,
  ) {
    return [...this.challenges.values()]
      .filter(
        (challenge) =>
          challenge.idUsuario === userId &&
          challenge.tipo === purpose &&
          challenge.createdAt >= since,
      )
      .sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      )
      .map((challenge) => challenge.createdAt);
  }

  async createSecurityCode(data: {
    id: string;
    userId: string;
    purpose: SecurityCodePurpose;
    tokenHash: string;
    now: Date;
    expiresAt: Date;
  }) {
    for (const challenge of this.challenges.values()) {
      if (
        challenge.idUsuario === data.userId &&
        challenge.tipo === data.purpose &&
        !challenge.revokedAt
      ) {
        challenge.revokedAt = data.now;
      }
    }
    this.challenges.set(data.id, {
      idToken: data.id,
      idUsuario: data.userId,
      tipo: data.purpose,
      tokenHash: data.tokenHash,
      cantidadIntentos: 0,
      createdAt: data.now,
      expiresAt: data.expiresAt,
      usedAt: null,
      revokedAt: null,
      usuario: this.users.get(data.userId)!,
    });
  }

  async revokeSecurityCode(id: string, now: Date) {
    const challenge = this.challenges.get(id);
    if (challenge && !challenge.revokedAt) challenge.revokedAt = now;
  }

  async findSecurityCodeById(id: string, purpose: SecurityCodePurpose) {
    const challenge = this.challenges.get(id);
    return challenge?.tipo === purpose ? challenge : null;
  }

  async findSecurityCodeByTokenHash(
    tokenHash: string,
    purpose: SecurityCodePurpose,
  ) {
    return (
      [...this.challenges.values()].find(
        (challenge) =>
          challenge.tokenHash === tokenHash && challenge.tipo === purpose,
      ) ?? null
    );
  }

  async findLatestSecurityCode(userId: string, purpose: SecurityCodePurpose) {
    return (
      [...this.challenges.values()]
        .filter(
          (challenge) =>
            challenge.idUsuario === userId && challenge.tipo === purpose,
        )
        .sort(
          (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
        )[0] ?? null
    );
  }

  async registerInvalidCode(id: string, now: Date, revoke: boolean) {
    const challenge = this.challenges.get(id)!;
    challenge.cantidadIntentos += 1;
    if (revoke) challenge.revokedAt = now;
  }

  async markSecurityCodeUsed(id: string, now: Date) {
    const challenge = this.challenges.get(id);
    if (
      !challenge ||
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.expiresAt <= now
    ) {
      return false;
    }
    challenge.usedAt = now;
    return true;
  }

  async completeLogin(data: CompleteLoginData) {
    const challenge = this.challenges.get(data.challengeId)!;
    if (
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.expiresAt <= data.now
    ) {
      throw new Error("Challenge no disponible");
    }
    challenge.usedAt = data.now;
    this.sessions.push(data);
    this.sessionActivity.set(data.sessionId, data.now);
    const user = this.users.get(data.userId)!;
    this.users.set(data.userId, {
      ...user,
      estado: "ACTIVO",
      correoVerificadoAt: data.now,
    });
  }

  async findSessionByTokenHash(tokenHash: string) {
    const session = this.sessions.find(
      (candidate) => candidate.refreshTokenHash === tokenHash,
    );
    if (!session) return null;
    return {
      idSesion: session.sessionId,
      idUsuario: session.userId,
      tokenHash: session.refreshTokenHash,
      recordarSesion: session.rememberSession,
      createdAt: session.now,
      ultimaActividadAt: this.sessionActivity.get(session.sessionId)!,
      expiresAt: session.expiresAt,
      revokedAt: this.revokedSessionIds.has(session.sessionId)
        ? session.now
        : null,
      usuario: this.users.get(session.userId)!,
    };
  }

  async rotateSession(data: RotateSessionData) {
    const session = this.sessions.find(
      (candidate) =>
        candidate.sessionId === data.sessionId &&
        candidate.refreshTokenHash === data.currentTokenHash,
    );
    if (
      !session ||
      this.revokedSessionIds.has(session.sessionId) ||
      session.expiresAt <= data.now
    ) {
      return false;
    }
    session.refreshTokenHash = data.newTokenHash;
    this.sessionActivity.set(session.sessionId, data.now);
    return true;
  }

  async revokeSessionByTokenHash(tokenHash: string) {
    const session = this.sessions.find(
      (candidate) => candidate.refreshTokenHash === tokenHash,
    );
    if (!session || this.revokedSessionIds.has(session.sessionId)) return false;
    this.revokedSessionIds.add(session.sessionId);
    return true;
  }

  async completePasswordRecovery(data: CompletePasswordRecoveryData) {
    const challenge = this.challenges.get(data.tokenId)!;
    if (
      !challenge ||
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.idUsuario !== data.userId ||
      challenge.expiresAt <= data.now
    ) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "El token de recuperación no es válido o ya fue utilizado",
      );
    }
    challenge.usedAt = data.now;
    challenge.revokedAt = data.now;
    for (const candidate of this.challenges.values()) {
      if (
        candidate.idUsuario === data.userId &&
        candidate.tipo === "RECUPERACION_PASSWORD" &&
        !candidate.revokedAt
      ) {
        candidate.revokedAt = data.now;
      }
    }
    const user = this.users.get(data.userId)!;
    this.users.set(data.userId, {
      ...user,
      passwordHash: data.passwordHash,
      debeCambiarPassword: false,
      estado:
        user.estado === "BLOQUEADO"
          ? user.correoVerificadoAt
            ? "ACTIVO"
            : "PENDIENTE"
          : user.estado,
      bloqueadoHasta: null,
    });
    this.recoveries.push(data);
    for (const session of this.sessions) {
      if (session.userId === data.userId) {
        this.revokedSessionIds.add(session.sessionId);
      }
    }
  }
}

class CapturingVerificationEmailSender implements VerificationEmailSender {
  readonly login: VerificationCodeEmail[] = [];
  readonly recovery: PasswordRecoveryLinkEmail[] = [];
  fail = false;

  async sendLoginVerificationCode(email: VerificationCodeEmail) {
    if (this.fail) throw new Error("Fallo SMTP simulado");
    this.login.push(email);
  }

  async sendPasswordRecoveryLink(email: PasswordRecoveryLinkEmail) {
    if (this.fail) throw new Error("Fallo SMTP simulado");
    this.recovery.push(email);
  }
}

async function testContext(
  options: {
    temporary?: boolean;
    role?: "USUARIO" | "ADMINISTRADOR";
    code?: string;
    token?: string;
    appOrigin?: string;
    userStatus?: "PENDIENTE" | "ACTIVO" | "BLOQUEADO" | "INACTIVO";
  } = {},
) {
  const repository = new MemoryAuthRepository();
  const emailSender = new CapturingVerificationEmailSender();
  const userId = randomUUID();
  let now = new Date("2026-09-11T12:00:00.000Z");
  repository.users.set(userId, {
    idUsuario: userId,
    idEmpresa: randomUUID(),
    nombre: "Admin",
    correo: "admin@capstone.test",
    passwordHash: await hashPassword("AdminTemporal1!"),
    rol: options.role ?? "ADMINISTRADOR",
    estado: options.userStatus ?? (options.temporary ? "PENDIENTE" : "ACTIVO"),
    debeCambiarPassword: options.temporary ?? false,
    bloqueadoHasta: null,
    correoVerificadoAt: options.temporary ? null : new Date(),
  });
  const jwt = new JwtService("test-secret-at-least-16-characters");
  const authService = new AuthService(repository, jwt, emailSender, {
    createId: randomUUID,
    codeSecret: "test-secret-at-least-16-characters",
    generateCode: () => options.code ?? "123456",
    generateToken: () =>
      options.token ?? randomBytes(32).toString("base64url"),
    now: () => now,
    appOrigin: options.appOrigin ?? "http://localhost:5173",
  });
  const accountService = new AccountRequestService(
    new InMemoryAccountRequestRepository(),
    {
      sendApprovedAccount: async () => undefined,
      sendRejectedAccount: async () => undefined,
    },
    { createId: randomUUID },
  );
  const app = createApp({
    authService,
    accountRequestService: accountService,
    adminResolver: createJwtAdminResolver(jwt, repository),
  });
  return {
    app,
    repository,
    emailSender,
    userId,
    advanceSeconds(seconds: number) {
      now = new Date(now.getTime() + seconds * 1000);
    },
  };
}

async function login(app: ReturnType<typeof createApp>) {
  return request(app)
    .post("/api/v1/auth/login")
    .send({ correo: "admin@capstone.test", password: "AdminTemporal1!" });
}

describe("verification codes and authentication", () => {
  it("generates cryptographically random-looking six-digit codes", () => {
    for (let sample = 0; sample < 100; sample += 1) {
      expect(generateVerificationCode()).toMatch(/^\d{6}$/);
    }
  });

  it("rejects invalid credentials without revealing which field failed", async () => {
    const { app } = await testContext();
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ correo: "admin@capstone.test", password: "incorrecta" });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("requires 2FA, emails the code and stores only its hash", async () => {
    const { app, repository, emailSender } = await testContext();
    const response = await login(app);
    const stored = repository.challenges.get(
      response.body.challengeId as string,
    )!;

    expect(response.status).toBe(200);
    expect(response.body.estado).toBe("CODIGO_REQUERIDO");
    expect(response.body).not.toHaveProperty("codigo");
    expect(emailSender.login[0]).toMatchObject({
      code: "123456",
      expiresInMinutes: 5,
    });
    expect(stored.tokenHash).not.toContain("123456");
    expect(stored.expiresAt.getTime() - stored.createdAt.getTime()).toBe(
      5 * 60 * 1000,
    );
    expect(repository.sessions).toHaveLength(0);
  });

  it("forces the temporary password change before emailing the login code", async () => {
    const { app, emailSender } = await testContext({
      temporary: true,
      role: "USUARIO",
    });
    const firstLogin = await login(app);
    const changed = await request(app)
      .post("/api/v1/auth/change-temporary-password")
      .set(
        "Authorization",
        `Bearer ${firstLogin.body.passwordChangeToken as string}`,
      )
      .send({
        nuevaPassword: "NuevaSegura123!",
        confirmarPassword: "NuevaSegura123!",
      });

    expect(firstLogin.body.estado).toBe("CAMBIO_PASSWORD_REQUERIDO");
    expect(changed.status).toBe(200);
    expect(changed.body.estado).toBe("CODIGO_REQUERIDO");
    expect(emailSender.login).toHaveLength(1);
  });

  it("completes login and creates the session only after a correct code", async () => {
    const { app, repository } = await testContext();
    const started = await login(app);
    const verified = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "123456",
      recordarSesion: true,
    });

    expect(verified.status).toBe(200);
    expect(verified.body.estado).toBe("AUTENTICADO");
    expect(verified.body).not.toHaveProperty("refreshToken");
    expect(verified.headers["set-cookie"]?.[0]).toContain(
      "capstone_refresh_token=",
    );
    expect(verified.headers["set-cookie"]?.[0]).toContain("HttpOnly");
    expect(verified.headers["set-cookie"]?.[0]).toContain("Expires=");
    expect(repository.sessions).toHaveLength(1);
    expect(repository.sessions[0]?.rememberSession).toBe(true);
    expect(
      repository.sessions[0]!.expiresAt.getTime() -
        repository.sessions[0]!.now.getTime(),
    ).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it("renews a remembered session, rotates its cookie and rejects reuse", async () => {
    const { app } = await testContext();
    const started = await login(app);
    const verified = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "123456",
      recordarSesion: true,
    });
    const firstCookie = verified.headers["set-cookie"]![0]!.split(";")[0]!;

    const refreshed = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", firstCookie);
    const secondCookie = refreshed.headers["set-cookie"]![0]!.split(";")[0]!;
    const replay = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", firstCookie);

    expect(refreshed.status).toBe(200);
    expect(refreshed.body.estado).toBe("SESION_RENOVADA");
    expect(refreshed.body.accessToken).toEqual(expect.any(String));
    expect(refreshed.body).not.toHaveProperty("refreshToken");
    expect(secondCookie).not.toBe(firstCookie);
    expect(replay.status).toBe(401);
    expect(replay.body.error.code).toBe("INVALID_REFRESH_TOKEN");
  });

  it("uses a browser-session cookie when recordarSesion is false", async () => {
    const { app, repository } = await testContext();
    const started = await login(app);
    const verified = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "123456",
      recordarSesion: false,
    });
    const cookie = verified.headers["set-cookie"]![0]!;

    expect(cookie).not.toContain("Expires=");
    expect(cookie).not.toContain("Max-Age=");
    expect(repository.sessions[0]?.rememberSession).toBe(false);
  });

  it("expires a non-remembered session after the inactivity limit", async () => {
    const context = await testContext();
    const started = await login(context.app);
    const verified = await request(context.app)
      .post("/api/v1/auth/verify-code")
      .send({
        challengeId: started.body.challengeId,
        codigo: "123456",
        recordarSesion: false,
      });
    const cookie = verified.headers["set-cookie"]![0]!.split(";")[0]!;
    context.advanceSeconds(30 * 60 + 1);

    const refreshed = await request(context.app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", cookie);

    expect(refreshed.status).toBe(401);
    expect(refreshed.body.error.code).toBe("INVALID_REFRESH_TOKEN");
  });

  it("revokes the refresh token and clears the cookie on logout", async () => {
    const { app } = await testContext();
    const started = await login(app);
    const verified = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "123456",
      recordarSesion: true,
    });
    const cookie = verified.headers["set-cookie"]![0]!.split(";")[0]!;
    const logout = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", cookie);
    const afterLogout = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", cookie);

    expect(logout.status).toBe(204);
    expect(logout.headers["set-cookie"]?.[0]).toContain(
      "capstone_refresh_token=;",
    );
    expect(afterLogout.status).toBe(401);
  });

  it("invalidates a login code after three failed attempts", async () => {
    const { app, repository } = await testContext();
    const started = await login(app);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await request(app).post("/api/v1/auth/verify-code").send({
        challengeId: started.body.challengeId,
        codigo: "000000",
        recordarSesion: false,
      });
    }
    const stored = repository.challenges.get(
      started.body.challengeId as string,
    )!;
    const retry = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "123456",
      recordarSesion: false,
    });

    expect(stored.cantidadIntentos).toBe(3);
    expect(stored.revokedAt).not.toBeNull();
    expect(retry.body.error.code).toBe("LOGIN_CODE_INVALID_OR_EXPIRED");
  });

  it("rejects expired and already-used codes", async () => {
    const expiredContext = await testContext();
    const expiredLogin = await login(expiredContext.app);
    expiredContext.advanceSeconds(301);
    const expired = await request(expiredContext.app)
      .post("/api/v1/auth/verify-code")
      .send({
        challengeId: expiredLogin.body.challengeId,
        codigo: "123456",
        recordarSesion: false,
      });

    const usedContext = await testContext();
    const usedLogin = await login(usedContext.app);
    const payload = {
      challengeId: usedLogin.body.challengeId,
      codigo: "123456",
      recordarSesion: false,
    };
    await request(usedContext.app)
      .post("/api/v1/auth/verify-code")
      .send(payload);
    const reused = await request(usedContext.app)
      .post("/api/v1/auth/verify-code")
      .send(payload);

    expect(expired.body.error.code).toBe("LOGIN_CODE_INVALID_OR_EXPIRED");
    expect(reused.body.error.code).toBe("LOGIN_CODE_INVALID_OR_EXPIRED");
  });

  it("separates login codes from recovery codes", async () => {
    const { app, repository } = await testContext();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });
    const recovery = await repository.findLatestSecurityCode(
      [...repository.users.keys()][0]!,
      "RECUPERACION_PASSWORD",
    );
    const response = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: recovery!.idToken,
      codigo: "123456",
      recordarSesion: false,
    });

    expect(response.body.error.code).toBe("LOGIN_CODE_INVALID_OR_EXPIRED");
  });

  it("enforces the 60-second cooldown and invalidates the previous code on resend", async () => {
    const context = await testContext();
    const started = await login(context.app);
    const tooSoon = await request(context.app)
      .post("/api/v1/auth/login-code/resend")
      .send({ challengeId: started.body.challengeId });
    context.advanceSeconds(60);
    const resent = await request(context.app)
      .post("/api/v1/auth/login-code/resend")
      .send({ challengeId: started.body.challengeId });

    expect(tooSoon.status).toBe(429);
    expect(tooSoon.body.error.code).toBe("CODE_RESEND_TOO_SOON");
    expect(resent.status).toBe(200);
    expect(
      context.repository.challenges.get(started.body.challengeId)!.revokedAt,
    ).not.toBeNull();
  });

  it("allows at most three sends in a 15-minute window", async () => {
    const context = await testContext();
    const first = await login(context.app);
    context.advanceSeconds(60);
    const second = await request(context.app)
      .post("/api/v1/auth/login-code/resend")
      .send({ challengeId: first.body.challengeId });
    context.advanceSeconds(60);
    const third = await request(context.app)
      .post("/api/v1/auth/login-code/resend")
      .send({ challengeId: second.body.challengeId });
    context.advanceSeconds(60);
    const fourth = await request(context.app)
      .post("/api/v1/auth/login-code/resend")
      .send({ challengeId: third.body.challengeId });

    expect(fourth.status).toBe(429);
    expect(fourth.body.error.code).toBe("CODE_SEND_LIMIT_EXCEEDED");
  });

  it("1. correo existente genera un enlace", async () => {
    const { app, emailSender } = await testContext();
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    expect(response.status).toBe(202);
    expect(response.body.estado).toBe("RECUPERACION_SOLICITADA");
    expect(emailSender.recovery).toHaveLength(1);
    expect(emailSender.recovery[0]!.recipient).toBe("admin@capstone.test");
    expect(emailSender.recovery[0]!.userName).toBe("Admin");
    expect(emailSender.recovery[0]!.expiresInMinutes).toBe(15);
    expect(emailSender.recovery[0]!.recoveryUrl).toMatch(
      /^http:\/\/localhost:5173\/recuperar-password#token=[A-Za-z0-9_-]+$/,
    );
  });

  it("2. correo desconocido devuelve la misma respuesta", async () => {
    const { app, emailSender } = await testContext();
    const existing = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });
    const unknown = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "nadie@example.invalid" });

    expect(existing.status).toBe(202);
    expect(unknown.status).toBe(202);
    expect(existing.body).toEqual(unknown.body);
    // Solo el correo existente disparó envío
    expect(emailSender.recovery).toHaveLength(1);
  });

  it("3. la respuesta no contiene el token", async () => {
    const { app } = await testContext();
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    expect(response.body).toEqual({
      estado: "RECUPERACION_SOLICITADA",
      mensaje: expect.any(String),
    });
    expect(response.body).not.toHaveProperty("token");
    expect(response.body).not.toHaveProperty("recoveryToken");
    expect(response.body).not.toHaveProperty("passwordRecoveryToken");
  });

  it("4. PostgreSQL/repositorio almacena solamente el hash", async () => {
    const { app, repository, emailSender } = await testContext();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    const recoveryEmail = emailSender.recovery[0]!;
    const rawToken = recoveryEmail.recoveryUrl.split("#token=")[1]!;
    const stored = [...repository.challenges.values()].find(
      (c) => c.tipo === "RECUPERACION_PASSWORD",
    )!;

    expect(stored.tokenHash).not.toContain(rawToken);
    expect(stored.tokenHash).toBe(
      createHash("sha256").update(rawToken).digest("hex"),
    );
  });

  it("5. el enlace utiliza exclusivamente APP_ORIGIN", async () => {
    const customOrigin = "https://portal.tributario.cl";
    const { app, emailSender } = await testContext({
      appOrigin: customOrigin,
    });
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .set("Origin", "https://sitio-malicioso.com")
      .send({ correo: "admin@capstone.test" });

    expect(emailSender.recovery[0]!.recoveryUrl.startsWith(customOrigin)).toBe(
      true,
    );
    expect(emailSender.recovery[0]!.recoveryUrl).toBe(
      `${customOrigin}/recuperar-password#token=${emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]}`,
    );
  });

  it("6. token válido permite cambiar la contraseña", async () => {
    const { app, emailSender, repository, userId } = await testContext();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    const rawToken = emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "NuevaValida123!",
        confirmarPassword: "NuevaValida123!",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ estado: "PASSWORD_ACTUALIZADA" });
    const updatedUser = repository.users.get(userId)!;
    expect(
      await verifyPassword("NuevaValida123!", updatedUser.passwordHash),
    ).toBe(true);
  });

  it("7. token incorrecto es rechazado", async () => {
    const { app } = await testContext();
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", "Bearer token-totalmente-invalido")
      .send({
        nuevaPassword: "NuevaValida123!",
        confirmarPassword: "NuevaValida123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_RECOVERY_TOKEN");
  });

  it("8. token vencido es rechazado", async () => {
    const context = await testContext();
    await request(context.app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    const rawToken =
      context.emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;
    context.advanceSeconds(15 * 60 + 1);

    const response = await request(context.app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "NuevaValida123!",
        confirmarPassword: "NuevaValida123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_RECOVERY_TOKEN");
  });

  it("9. token utilizado no puede reutilizarse", async () => {
    const { app, emailSender } = await testContext();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    const rawToken = emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;
    const first = await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "NuevaValida123!",
        confirmarPassword: "NuevaValida123!",
      });
    const second = await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "OtraValida123!",
        confirmarPassword: "OtraValida123!",
      });

    expect(first.status).toBe(200);
    expect(second.status).toBe(401);
    expect(second.body.error.code).toBe("INVALID_RECOVERY_TOKEN");
  });

  it("10. un enlace nuevo revoca el anterior", async () => {
    const context = await testContext();
    await request(context.app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });
    const firstToken =
      context.emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;

    context.advanceSeconds(60);
    await request(context.app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });
    const secondToken =
      context.emailSender.recovery[1]!.recoveryUrl.split("#token=")[1]!;

    const firstAttempt = await request(context.app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${firstToken}`)
      .send({
        nuevaPassword: "NuevaValida123!",
        confirmarPassword: "NuevaValida123!",
      });
    const secondAttempt = await request(context.app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${secondToken}`)
      .send({
        nuevaPassword: "NuevaValida123!",
        confirmarPassword: "NuevaValida123!",
      });

    expect(firstAttempt.status).toBe(401);
    expect(firstAttempt.body.error.code).toBe("INVALID_RECOVERY_TOKEN");
    expect(secondAttempt.status).toBe(200);
  });

  it("11. fallo SMTP revoca el token y mantiene la respuesta genérica", async () => {
    const { app, repository, emailSender } = await testContext();
    emailSender.fail = true;
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    expect(response.status).toBe(202);
    expect(response.body.estado).toBe("RECUPERACION_SOLICITADA");
    const stored = [...repository.challenges.values()].find(
      (c) => c.tipo === "RECUPERACION_PASSWORD",
    )!;
    expect(stored.revokedAt).not.toBeNull();
  });

  it("12. consumo simultáneo no permite dos cambios", async () => {
    const { app, emailSender } = await testContext();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    const rawToken = emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;
    const resetPayload1 = {
      nuevaPassword: "PasswordUno123!",
      confirmarPassword: "PasswordUno123!",
    };
    const resetPayload2 = {
      nuevaPassword: "PasswordDos123!",
      confirmarPassword: "PasswordDos123!",
    };

    const [res1, res2] = await Promise.all([
      request(app)
        .post("/api/v1/auth/reset-password")
        .set("Authorization", `Bearer ${rawToken}`)
        .send(resetPayload1),
      request(app)
        .post("/api/v1/auth/reset-password")
        .set("Authorization", `Bearer ${rawToken}`)
        .send(resetPayload2),
    ]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([200, 401]);
  });

  it("13. el cambio revoca las sesiones existentes", async () => {
    const { app, emailSender, repository } = await testContext();
    const started = await login(app);
    const verified = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "123456",
      recordarSesion: true,
    });
    const cookie = verified.headers["set-cookie"]![0]!.split(";")[0]!;
    expect(repository.sessions).toHaveLength(1);

    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });
    const rawToken = emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;

    await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "NuevaPassword123!",
        confirmarPassword: "NuevaPassword123!",
      });

    const refreshAttempt = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", cookie);

    expect(refreshAttempt.status).toBe(401);
    expect(refreshAttempt.body.error.code).toBe("INVALID_REFRESH_TOKEN");
  });

  it("14. una cuenta inactiva no se reactiva", async () => {
    const { app, emailSender, repository, userId } = await testContext({
      userStatus: "INACTIVO",
    });

    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    expect(response.status).toBe(202);
    expect(emailSender.recovery).toHaveLength(0);

    // Si existiera un token previo, intentar resetear arroja 403 y no la reactiva
    const id = randomUUID();
    const rawToken = "token-for-inactive-user";
    await repository.createSecurityCode({
      id,
      userId,
      purpose: "RECUPERACION_PASSWORD",
      tokenHash: createHash("sha256").update(rawToken).digest("hex"),
      now: new Date("2026-09-11T12:00:00.000Z"),
      expiresAt: new Date("2026-09-11T12:30:00.000Z"),
    });

    const resetResponse = await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "NuevaPassword123!",
        confirmarPassword: "NuevaPassword123!",
      });

    expect(resetResponse.status).toBe(403);
    expect(resetResponse.body.error.code).toBe("ACCOUNT_INACTIVE");
    expect(repository.users.get(userId)!.estado).toBe("INACTIVO");
  });

  it("15. la recuperación no crea una sesión", async () => {
    const { app, emailSender, repository } = await testContext();
    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ correo: "admin@capstone.test" });

    const rawToken = emailSender.recovery[0]!.recoveryUrl.split("#token=")[1]!;
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .set("Authorization", `Bearer ${rawToken}`)
      .send({
        nuevaPassword: "NuevaPassword123!",
        confirmarPassword: "NuevaPassword123!",
      });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("accessToken");
    expect(response.body).not.toHaveProperty("refreshToken");
    // La respuesta no crea una sesión; si envía set-cookie es únicamente para limpiar la cookie de refresh
    if (response.headers["set-cookie"]) {
      expect(response.headers["set-cookie"][0]).toContain(
        "capstone_refresh_token=;",
      );
    }
    expect(repository.sessions).toHaveLength(0);
  });

  it("16. el código de verificación del login continúa funcionando", async () => {
    const { app, emailSender } = await testContext({ code: "789123" });
    const started = await login(app);
    expect(started.status).toBe(200);
    expect(started.body.estado).toBe("CODIGO_REQUERIDO");
    expect(emailSender.login[0]!.code).toBe("789123");

    const verified = await request(app).post("/api/v1/auth/verify-code").send({
      challengeId: started.body.challengeId,
      codigo: "789123",
      recordarSesion: false,
    });

    expect(verified.status).toBe(200);
    expect(verified.body.estado).toBe("AUTENTICADO");
    expect(verified.body.accessToken).toEqual(expect.any(String));
  });

  it("POST /api/v1/auth/verify-recovery-code responde 410 Gone", async () => {
    const { app } = await testContext();
    const response = await request(app)
      .post("/api/v1/auth/verify-recovery-code")
      .send({ correo: "admin@capstone.test", codigo: "123456" });

    expect(response.status).toBe(410);
    expect(response.body.error.code).toBe("ENDPOINT_DEPRECATED");
  });
});

