import { AppError } from '../../shared/errors/app-error.js';
import type { PrismaClient } from '../../generated/prisma/client.js';
import type { CreateAccountRequestInput } from './account-request.schemas.js';
import type { AccountRequestRepository, ApproveRequestData } from './account-request.repository.js';
import type {
  AccountRequest,
  AccountRequestStatus,
  ApprovalResult,
} from './account-request.types.js';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

export class PrismaAccountRequestRepository implements AccountRequestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateAccountRequestInput, id: string, now: Date): Promise<AccountRequest> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const [company, user, pendingRequest] = await Promise.all([
          transaction.empresa.findUnique({ where: { rutEmpresa: input.rutEmpresa } }),
          transaction.usuario.findFirst({
            where: {
              OR: [
                { rutUsuario: input.rutUsuario },
                { correo: { equals: input.correo, mode: 'insensitive' } },
              ],
            },
          }),
          transaction.solicitudCuenta.findFirst({
            where: {
              estado: 'PENDIENTE',
              OR: [
                { rutEmpresa: input.rutEmpresa },
                { rutUsuario: input.rutUsuario },
                { correo: { equals: input.correo, mode: 'insensitive' } },
              ],
            },
          }),
        ]);

        if (company) {
          throw new AppError(
            409,
            'COMPANY_ALREADY_REGISTERED',
            'La empresa ya tiene un usuario cliente registrado',
          );
        }
        if (user || pendingRequest) {
          throw new AppError(
            409,
            'ACCOUNT_REQUEST_DUPLICATE',
            'Ya existe una solicitud pendiente o un usuario con los datos enviados',
          );
        }

        return transaction.solicitudCuenta.create({
          data: {
            idSolicitud: id,
            ...input,
            descripcion: input.descripcion ?? null,
            createdAt: now,
            updatedAt: now,
          },
        });
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (isUniqueConstraintError(error)) {
        throw new AppError(
          409,
          'ACCOUNT_REQUEST_DUPLICATE',
          'Ya existe una solicitud pendiente o un usuario con los datos enviados',
        );
      }
      throw error;
    }
  }

  async list(status?: AccountRequestStatus): Promise<AccountRequest[]> {
    return this.prisma.solicitudCuenta.findMany({
      where: status ? { estado: status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<AccountRequest | null> {
    return this.prisma.solicitudCuenta.findUnique({ where: { idSolicitud: id } });
  }

  async approve(data: ApproveRequestData): Promise<ApprovalResult> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const request = await transaction.solicitudCuenta.findUnique({
          where: { idSolicitud: data.idSolicitud },
        });
        if (!request) {
          throw new AppError(404, 'ACCOUNT_REQUEST_NOT_FOUND', 'Solicitud no encontrada');
        }
        if (request.estado !== 'PENDIENTE') {
          throw new AppError(
            409,
            'ACCOUNT_REQUEST_ALREADY_REVIEWED',
            'La solicitud ya fue revisada',
          );
        }

        const [company, user] = await Promise.all([
          transaction.empresa.findUnique({ where: { rutEmpresa: request.rutEmpresa } }),
          transaction.usuario.findFirst({
            where: {
              OR: [
                { rutUsuario: data.user.rutUsuario },
                { correo: { equals: data.user.correo, mode: 'insensitive' } },
              ],
            },
          }),
        ]);
        if (company) {
          throw new AppError(
            409,
            'COMPANY_ALREADY_REGISTERED',
            'La empresa ya tiene un usuario cliente registrado',
          );
        }
        if (user) {
          throw new AppError(409, 'USER_DUPLICATE', 'Ya existe un usuario con ese RUT o correo');
        }

        const createdCompany = await transaction.empresa.create({ data: data.company });
        const createdUser = await transaction.usuario.create({
          data: { ...data.user, idEmpresa: createdCompany.idEmpresa },
        });
        const approvedRequest = await transaction.solicitudCuenta.update({
          where: { idSolicitud: data.idSolicitud },
          data: {
            estado: 'APROBADA',
            revisadaPorId: data.adminId,
            fechaRevision: data.reviewedAt,
            motivoRechazo: null,
            updatedAt: data.reviewedAt,
          },
        });

        return {
          request: approvedRequest,
          company: createdCompany,
          user: createdUser,
        };
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (isUniqueConstraintError(error)) {
        throw new AppError(
          409,
          'APPROVAL_CONFLICT',
          'La empresa, el RUT o el correo ya fueron registrados',
        );
      }
      throw error;
    }
  }

  async reject(
    id: string,
    adminId: string,
    reason: string,
    reviewedAt: Date,
  ): Promise<AccountRequest> {
    return this.prisma.$transaction(async (transaction) => {
      const request = await transaction.solicitudCuenta.findUnique({
        where: { idSolicitud: id },
      });
      if (!request) {
        throw new AppError(404, 'ACCOUNT_REQUEST_NOT_FOUND', 'Solicitud no encontrada');
      }
      if (request.estado !== 'PENDIENTE') {
        throw new AppError(
          409,
          'ACCOUNT_REQUEST_ALREADY_REVIEWED',
          'La solicitud ya fue revisada',
        );
      }

      return transaction.solicitudCuenta.update({
        where: { idSolicitud: id },
        data: {
          estado: 'RECHAZADA',
          revisadaPorId: adminId,
          fechaRevision: reviewedAt,
          motivoRechazo: reason,
          updatedAt: reviewedAt,
        },
      });
    });
  }
}
