import type { Request, RequestHandler, Response } from "express";

type Handler<P> = (req: Request<P>, res: Response) => Promise<void> | void;

/**
 * Envuelve un handler asíncrono para que cualquier error llegue al errorHandler
 * en lugar de repetir try/catch en cada ruta.
 */
export function handle<P extends Record<string, string>>(
  handler: Handler<P>,
): RequestHandler<P> {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}
