import type { ErrorRequestHandler } from "express";
import multer from "multer";
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

  if (error instanceof multer.MulterError) {
    const mapped = error.code === "LIMIT_FILE_SIZE"
      ? { code: "FILE_TOO_LARGE", message: "Cada PDF debe pesar como máximo 15 MB" }
      : error.code === "LIMIT_FILE_COUNT"
        ? { code: "INVALID_BATCH_SIZE", message: "El lote debe contener entre 1 y 10 documentos" }
        : error.code === "LIMIT_UNEXPECTED_FILE"
          ? { code: "INVALID_BATCH_FIELD", message: "Los archivos deben enviarse en el campo documents" }
          : { code: "INVALID_MULTIPART_UPLOAD", message: "La carga de archivos no es válida" };
    res.status(400).json({ error: { code: mapped.code, message: mapped.message, details: {} } });
    return;
  }

  req.log.error({ err: error }, "Error no controlado");
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" },
  });
};
