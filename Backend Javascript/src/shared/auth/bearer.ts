import { AppError } from "../errors/app-error.js";

export function readBearerToken(authorization: string | undefined): string {
  const match = /^Bearer\s+(.+)$/i.exec(authorization ?? "");
  if (!match?.[1]) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Se requiere un token de autenticación",
    );
  }
  return match[1];
}
