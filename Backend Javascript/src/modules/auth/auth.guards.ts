import { AppError } from "../../shared/errors/app-error.js";

export function assertCanLogin(
  status: string,
  blockedUntil: Date | null,
  now: Date,
): void {
  if (status === "INACTIVO") {
    throw new AppError(403, "ACCOUNT_INACTIVE", "La cuenta está inactiva");
  }
  if (
    status === "BLOQUEADO" &&
    (!blockedUntil || blockedUntil.getTime() > now.getTime())
  ) {
    throw new AppError(
      423,
      "ACCOUNT_BLOCKED",
      "La cuenta está temporalmente bloqueada",
    );
  }
}
