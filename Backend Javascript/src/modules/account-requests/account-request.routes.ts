import { Router, type RequestHandler } from 'express';
import type { AdminIdentity, AdminResolver } from '../../shared/auth/admin-resolver.js';
import { AppError } from '../../shared/errors/app-error.js';
import {
  approveAccountRequestSchema,
  createAccountRequestSchema,
  listAccountRequestsSchema,
  rejectAccountRequestSchema,
  requestIdSchema,
} from './account-request.schemas.js';
import type { AccountRequestService } from './account-request.service.js';

export function createAccountRequestRouter(
  service: AccountRequestService,
  resolveAdmin: AdminResolver,
) {
  const router = Router();
  const requireAdmin: RequestHandler = async (req, res, next) => {
    try {
      const identity = await resolveAdmin(req);
      if (!identity) {
        throw new AppError(401, 'AUTHENTICATION_REQUIRED', 'Se requiere autenticación de administrador');
      }
      res.locals.adminIdentity = identity;
      next();
    } catch (error) {
      next(error);
    }
  };

  router.post('/', async (req, res, next) => {
    try {
      const input = createAccountRequestSchema.parse(req.body);
      const request = await service.submit(input);
      res.status(201).json({ solicitud: request });
    } catch (error) {
      next(error);
    }
  });

  router.get('/', requireAdmin, async (req, res, next) => {
    try {
      const query = listAccountRequestsSchema.parse(req.query);
      res.status(200).json({ solicitudes: await service.list(query.estado) });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:idSolicitud', requireAdmin, async (req, res, next) => {
    try {
      const { idSolicitud } = requestIdSchema.parse(req.params);
      res.status(200).json({ solicitud: await service.get(idSolicitud) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/:idSolicitud/approve', requireAdmin, async (req, res, next) => {
    try {
      const { idSolicitud } = requestIdSchema.parse(req.params);
      const input = approveAccountRequestSchema.parse(req.body);
      const identity = res.locals.adminIdentity as AdminIdentity;
      const result = await service.approve(idSolicitud, identity.idUsuario, input);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post('/:idSolicitud/reject', requireAdmin, async (req, res, next) => {
    try {
      const { idSolicitud } = requestIdSchema.parse(req.params);
      const input = rejectAccountRequestSchema.parse(req.body);
      const identity = res.locals.adminIdentity as AdminIdentity;
      const result = await service.reject(idSolicitud, identity.idUsuario, input.motivo);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
