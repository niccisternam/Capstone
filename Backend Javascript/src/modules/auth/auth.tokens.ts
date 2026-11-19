import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import type { SecurityCodePurpose } from "./auth.types.js";

export function generateVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}

export function generateSecureToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function hashCode(
  secret: string,
  id: string,
  purpose: SecurityCodePurpose,
  code: string,
): string {
  return createHmac("sha256", secret)
    .update(`${id}:${purpose}:${code}`)
    .digest("hex");
}

export function codeMatches(
  secret: string,
  challenge: { idToken: string; tipo: SecurityCodePurpose; tokenHash: string },
  code: string,
): boolean {
  const expected = Buffer.from(challenge.tokenHash, "hex");
  const actual = Buffer.from(
    hashCode(secret, challenge.idToken, challenge.tipo, code),
    "hex",
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
