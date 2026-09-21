import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  void _next;
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Los datos enviados no son válidos",
        details: error.flatten(),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    if (error.status >= 500) {
      req.log.error(
        { err: error, code: error.code },
        "Error controlado del servicio",
      );
    }
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? {},
      },
    });
    return;
  }

  req.log.error({ err: error }, "Error no controlado");
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" },
  });
};
