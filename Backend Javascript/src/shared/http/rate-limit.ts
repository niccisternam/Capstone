import type { Request, RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

export interface RateLimitOptions {
  /** Prefijo para separar contadores de distintos endpoints. */
  name: string;
  windowMs: number;
  max: number;
  /** Clave por defecto: IP del cliente (respeta `trust proxy`). */
  key?: (req: Request) => string | undefined;
  now?: () => number;
  /** Desactiva el límite (pruebas). */
  disabled?: boolean;
}

// Contador en memoria del proceso: suficiente para una instancia. Con varias
// instancias detrás de un balanceador debe reemplazarse por un almacén compartido.
const MAX_KEYS = 10_000;

export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const now = options.now ?? Date.now;
  const windows = new Map<string, { start: number; count: number }>();

  return (req, res, next) => {
    if (options.disabled) return next();
    const raw = options.key ? options.key(req) : req.ip;
    const key = `${options.name}:${raw ?? "desconocido"}`;
    const current = now();
    const window = windows.get(key);

    if (!window || current - window.start >= options.windowMs) {
      windows.delete(key);
      windows.set(key, { start: current, count: 1 });
      if (windows.size > MAX_KEYS) windows.delete(windows.keys().next().value!);
      return next();
    }

    if (window.count >= options.max) {
      const retryAfter = Math.max(
        1,
        Math.ceil((options.windowMs - (current - window.start)) / 1000),
      );
      res.setHeader("Retry-After", String(retryAfter));
      return next(
        new AppError(
          429,
          "RATE_LIMITED",
          "Demasiadas solicitudes. Espera un momento antes de volver a intentarlo.",
          { retryAfterSeconds: retryAfter },
        ),
      );
    }

    window.count += 1;
    next();
  };
}
