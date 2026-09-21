export type AccountRequestStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface AccountRequest {
  idSolicitud: string;
  rutEmpresa: string;
  razonSocial: string | null;
  rutUsuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  descripcion: string | null;
  estado: AccountRequestStatus;
  revisadaPorId: string | null;
  fechaRevision: Date | null;
  motivoRechazo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  idEmpresa: string;
  rutEmpresa: string;
  razonSocial: string;
}

export interface User {
  idUsuario: string;
  idEmpresa: string;
  rutUsuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  passwordHash: string;
  rol: "USUARIO" | "ADMINISTRADOR";
  estado: "PENDIENTE" | "ACTIVO" | "BLOQUEADO" | "INACTIVO";
  debeCambiarPassword: boolean;
}

export interface ApprovalResult {
  request: AccountRequest;
  company: Company;
  user: User;
}
