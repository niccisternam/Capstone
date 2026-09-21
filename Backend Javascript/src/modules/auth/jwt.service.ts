import { jwtVerify, SignJWT } from "jose";
import { AppError } from "../../shared/errors/app-error.js";

export interface AccessIdentity {
  idUsuario: string;
  rol: "USUARIO" | "ADMINISTRADOR";
}

export interface PasswordRecoveryIdentity {
  idUsuario: string;
  authorizationId: string;
}

export class JwtService {
  private readonly secret: Uint8Array;

  constructor(
    secret: string,
    private readonly accessTtl: string = "15m",
  ) {
    this.secret = new TextEncoder().encode(secret);
  }

  createPasswordChangeToken(userId: string): Promise<string> {
    return new SignJWT({ scope: "change_temporary_password" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(this.secret);
  }

  createAccessToken(identity: AccessIdentity): Promise<string> {
    return new SignJWT({ rol: identity.rol, scope: "access" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(identity.idUsuario)
      .setIssuedAt()
      .setExpirationTime(this.accessTtl)
      .sign(this.secret);
  }

  createPasswordRecoveryToken(
    userId: string,
    authorizationId: string,
  ): Promise<string> {
    return new SignJWT({ scope: "reset_password" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setJti(authorizationId)
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(this.secret);
  }

  async verifyPasswordChangeToken(token: string): Promise<string> {
    const payload = await this.verify(token);
    if (payload.scope !== "change_temporary_password" || !payload.sub) {
      throw new AppError(
        401,
        "INVALID_AUTH_TOKEN",
        "Token de autenticación inválido",
      );
    }
    return payload.sub;
  }

  async verifyAccessToken(token: string): Promise<AccessIdentity> {
    const payload = await this.verify(token);
    if (
      payload.scope !== "access" ||
      !payload.sub ||
      (payload.rol !== "USUARIO" && payload.rol !== "ADMINISTRADOR")
    ) {
      throw new AppError(
        401,
        "INVALID_AUTH_TOKEN",
        "Token de autenticación inválido",
      );
    }
    return { idUsuario: payload.sub, rol: payload.rol };
  }

  async verifyPasswordRecoveryToken(
    token: string,
  ): Promise<PasswordRecoveryIdentity> {
    const payload = await this.verify(token);
    if (payload.scope !== "reset_password" || !payload.sub || !payload.jti) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "Token de recuperación inválido",
      );
    }
    return { idUsuario: payload.sub, authorizationId: payload.jti };
  }

  private async verify(token: string) {
    try {
      const result = await jwtVerify(token, this.secret, {
        algorithms: ["HS256"],
      });
      return result.payload;
    } catch {
      throw new AppError(
        401,
        "INVALID_AUTH_TOKEN",
        "Token de autenticación inválido o vencido",
      );
    }
  }
}
