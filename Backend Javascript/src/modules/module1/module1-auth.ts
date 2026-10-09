import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error.js";
import { JwtService } from "../auth/jwt.service.js";
import type { Module1Identity } from "./module1.types.js";

export type Module1Request = Request & { module1Identity?: Module1Identity };

export function requireModule1Auth(jwt: JwtService, findUser: (id: string) => Promise<{ idUsuario: string; idEmpresa: string; estado: string } | null>) {
  return async (req: Module1Request, _res: Response, next: NextFunction) => {
    try {
      const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization ?? "");
      if (!match?.[1]) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Se requiere un token de autenticación");
      const identity = await jwt.verifyAccessToken(match[1]);
      const user = await findUser(identity.idUsuario);
      if (!user || user.estado !== "ACTIVO") throw new AppError(403, "USER_NOT_ACTIVE", "El usuario no está habilitado");
      req.module1Identity = { idUsuario: user.idUsuario, idEmpresa: user.idEmpresa };
      next();
    } catch (error) { next(error); }
  };
}

export function module1Identity(req: Request): Module1Identity {
  const identity = (req as Module1Request).module1Identity;
  if (!identity) throw new AppError(401, "AUTHENTICATION_REQUIRED", "Se requiere un token de autenticación");
  return identity;
}
