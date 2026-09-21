import { AppError } from "../../shared/errors/app-error.js";
import type {
  ApproveAccountRequestInput,
  CreateAccountRequestInput,
} from "./account-request.schemas.js";
import type { AccountRequestRepository } from "./account-request.repository.js";
import type { AccountEmailSender } from "./account-email.sender.js";
import { generateTemporaryPassword, hashPassword } from "./password.js";
import type { AccountRequestStatus } from "./account-request.types.js";

interface ServiceOptions {
  createId: () => string;
  now?: () => Date;
  generatePassword?: () => string;
  hash?: (password: string) => Promise<string>;
}

export class AccountRequestService {
  private readonly now: () => Date;
  private readonly generatePassword: () => string;
  private readonly hash: (password: string) => Promise<string>;

  constructor(
    private readonly repository: AccountRequestRepository,
    private readonly emailSender: AccountEmailSender,
    private readonly options: ServiceOptions,
  ) {
    this.now = options.now ?? (() => new Date());
    this.generatePassword =
      options.generatePassword ?? generateTemporaryPassword;
    this.hash = options.hash ?? hashPassword;
  }

  submit(input: CreateAccountRequestInput) {
    return this.repository.create(input, this.options.createId(), this.now());
  }

  list(status?: AccountRequestStatus) {
    return this.repository.list(status);
  }

  async get(id: string) {
    const request = await this.repository.findById(id);
    if (!request)
      throw new AppError(
        404,
        "ACCOUNT_REQUEST_NOT_FOUND",
        "Solicitud no encontrada",
      );
    return request;
  }

  async approve(
    id: string,
    adminId: string,
    input: ApproveAccountRequestInput,
  ) {
    const request = await this.get(id);
    if (request.estado !== "PENDIENTE") {
      throw new AppError(
        409,
        "ACCOUNT_REQUEST_ALREADY_REVIEWED",
        "La solicitud ya fue revisada",
      );
    }
    const companyName = request.razonSocial ?? input.razonSocial;
    if (!companyName) {
      throw new AppError(
        409,
        "ACCOUNT_REQUEST_MISSING_COMPANY_NAME",
        "La solicitud antigua no tiene razón social; debes indicarla al aprobar",
      );
    }

    const temporaryPassword = this.generatePassword();
    const passwordHash = await this.hash(temporaryPassword);
    const result = await this.repository.approve({
      idSolicitud: id,
      adminId,
      reviewedAt: this.now(),
      company: {
        idEmpresa: this.options.createId(),
        rutEmpresa: request.rutEmpresa,
        razonSocial: companyName,
      },
      user: {
        idUsuario: this.options.createId(),
        idEmpresa: "",
        rutUsuario: request.rutUsuario,
        nombre: request.nombre,
        apellido: request.apellido,
        correo: request.correo,
        passwordHash,
        rol: "USUARIO",
        estado: "PENDIENTE",
        debeCambiarPassword: true,
      },
    });

    let emailSent = true;
    try {
      await this.emailSender.sendApprovedAccount({
        recipient: request.correo,
        name: request.nombre,
        temporaryPassword,
      });
    } catch {
      emailSent = false;
    }

    return {
      solicitud: result.request,
      empresa: result.company,
      usuario: {
        idUsuario: result.user.idUsuario,
        idEmpresa: result.user.idEmpresa,
        correo: result.user.correo,
        estado: result.user.estado,
        debeCambiarPassword: result.user.debeCambiarPassword,
      },
      correoEnviado: emailSent,
    };
  }

  async reject(id: string, adminId: string, reason: string) {
    const pendingRequest = await this.get(id);
    const request = await this.repository.reject(
      id,
      adminId,
      reason,
      this.now(),
    );
    let emailSent = true;
    try {
      await this.emailSender.sendRejectedAccount({
        recipient: pendingRequest.correo,
        name: pendingRequest.nombre,
        reason,
      });
    } catch {
      emailSent = false;
    }
    return { solicitud: request, correoEnviado: emailSent };
  }
}
