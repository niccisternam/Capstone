import { AppError } from '../../shared/errors/app-error.js';
import type { CreateAccountRequestInput } from './account-request.schemas.js';
import type { AccountRequestRepository, ApproveRequestData } from './account-request.repository.js';
import type {
  AccountRequest,
  AccountRequestStatus,
  ApprovalResult,
  Company,
  User,
} from './account-request.types.js';

export class InMemoryAccountRequestRepository implements AccountRequestRepository {
  private readonly requests = new Map<string, AccountRequest>();
  private readonly companies = new Map<string, Company>();
  private readonly users = new Map<string, User>();

  async create(input: CreateAccountRequestInput, id: string, now: Date): Promise<AccountRequest> {
    if (this.companies.has(input.rutEmpresa)) {
      throw new AppError(
        409,
        'COMPANY_ALREADY_REGISTERED',
        'La empresa ya tiene un usuario cliente registrado',
      );
    }

    const duplicatedUser = [...this.users.values()].some(
      (user) => user.rutUsuario === input.rutUsuario || user.correo === input.correo,
    );
    const duplicatedPendingRequest = [...this.requests.values()].some(
      (request) =>
        request.estado === 'PENDIENTE' &&
        (request.rutEmpresa === input.rutEmpresa ||
          request.rutUsuario === input.rutUsuario ||
          request.correo === input.correo),
    );
    if (duplicatedUser || duplicatedPendingRequest) {
      throw new AppError(
        409,
        'ACCOUNT_REQUEST_DUPLICATE',
        'Ya existe una solicitud pendiente o un usuario con los datos enviados',
      );
    }

    const request: AccountRequest = {
      idSolicitud: id,
      ...input,
      descripcion: input.descripcion ?? null,
      estado: 'PENDIENTE',
      revisadaPorId: null,
      fechaRevision: null,
      motivoRechazo: null,
      createdAt: now,
      updatedAt: now,
    };
    this.requests.set(id, request);
    return structuredClone(request);
  }

  async list(status?: AccountRequestStatus): Promise<AccountRequest[]> {
    return [...this.requests.values()]
      .filter((request) => !status || request.estado === status)
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .map((request) => structuredClone(request));
  }

  async findById(id: string): Promise<AccountRequest | null> {
    const request = this.requests.get(id);
    return request ? structuredClone(request) : null;
  }

  async approve(data: ApproveRequestData): Promise<ApprovalResult> {
    const request = this.requirePending(data.idSolicitud);
    const existingCompany = this.companies.get(request.rutEmpresa);
    if (existingCompany) {
      throw new AppError(
        409,
        'COMPANY_ALREADY_REGISTERED',
        'La empresa ya tiene un usuario cliente registrado',
      );
    }

    if (
      [...this.users.values()].some(
        (user) => user.rutUsuario === data.user.rutUsuario || user.correo === data.user.correo,
      )
    ) {
      throw new AppError(409, 'USER_DUPLICATE', 'Ya existe un usuario con ese RUT o correo');
    }

    const company = data.company;
    this.companies.set(company.rutEmpresa, company);
    const user = { ...data.user, idEmpresa: company.idEmpresa };
    this.users.set(user.idUsuario, user);
    const approved: AccountRequest = {
      ...request,
      estado: 'APROBADA',
      revisadaPorId: data.adminId,
      fechaRevision: data.reviewedAt,
      motivoRechazo: null,
      updatedAt: data.reviewedAt,
    };
    this.requests.set(approved.idSolicitud, approved);

    return {
      request: structuredClone(approved),
      company: structuredClone(company),
      user: structuredClone(user),
    };
  }

  async reject(
    id: string,
    adminId: string,
    reason: string,
    reviewedAt: Date,
  ): Promise<AccountRequest> {
    const request = this.requirePending(id);
    const rejected: AccountRequest = {
      ...request,
      estado: 'RECHAZADA',
      revisadaPorId: adminId,
      fechaRevision: reviewedAt,
      motivoRechazo: reason,
      updatedAt: reviewedAt,
    };
    this.requests.set(id, rejected);
    return structuredClone(rejected);
  }

  private requirePending(id: string): AccountRequest {
    const request = this.requests.get(id);
    if (!request) throw new AppError(404, 'ACCOUNT_REQUEST_NOT_FOUND', 'Solicitud no encontrada');
    if (request.estado !== 'PENDIENTE') {
      throw new AppError(409, 'ACCOUNT_REQUEST_ALREADY_REVIEWED', 'La solicitud ya fue revisada');
    }
    return request;
  }
}
